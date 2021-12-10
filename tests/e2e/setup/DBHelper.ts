import { promisify } from 'util';
import child_process from 'child_process';
import { event, Helper, recorder } from 'codeceptjs';
import path from 'path';
import { assertDefined } from '@lib/util/assert';

const exec = promisify(child_process.exec);

async function tryExec(command: string): Promise<void> {
    try {
        await exec(command);
    } catch (err) {
        // @ts-expect-error err is of type unknown
        console.log(err.stderr);
        // @ts-expect-error err is of type unknown
        console.log(err.stdout);
        throw err;
    }
}

async function execInMBContainer(command: string): Promise<void> {
    await tryExec(`docker exec musicbrainz ${command}`);
}

function _pathToContainerPath(fullPath: string): string {
    const basePath = path.resolve('./tests/e2e/');
    return '/media/e2e/' + path.relative(basePath, fullPath);
}


type Options = Partial<{
    extraSql: string;
    revertSql: string;
}>;

const PREP_SCRIPT_PATH = _pathToContainerPath(path.resolve(__dirname, './prepare_db.sh'));
const EXEC_SCRIPT_PATH = _pathToContainerPath(path.resolve(__dirname, './exec_psql.sh'));

class DBHelper extends Helper<Options> {
    _resetDbOnNextRun = false;
    _revertScript?: string;

    override async _init(): Promise<void> {
        event.dispatcher.on(event.all.before, () => {
            recorder.add(async () => {
                await this._resetDb();
                console.info('Done setting up Musicbrainz database');
            });
        });
    }

    _validateOptions(): Options {
        const opts = { ...this.config, ...(this.options ?? {}) };
        if (opts.revertSql && !opts.extraSql) {
            throw new Error('Cannot have `revertSql` without `extraSql`');
        }
        return opts;
    }

    _getSqlScriptContainerPath(testSuite: Mocha.Suite, scriptName: string): string {
        assertDefined(testSuite.file);
        const fullPath = path.resolve(path.dirname(testSuite.file), scriptName);
        return _pathToContainerPath(fullPath);
    }

    async _resetDb(): Promise<void> {
        await execInMBContainer(`bash ${PREP_SCRIPT_PATH}`);
    }

    override async _beforeSuite(suite: Mocha.Suite): Promise<void> {
        const options = this._validateOptions();
        if (options.extraSql) {
            const sqlPath = this._getSqlScriptContainerPath(suite, options.extraSql);
            await execInMBContainer(`bash ${EXEC_SCRIPT_PATH} "${sqlPath}"`);
            this._resetDbOnNextRun = true;
            // Codecept doesn't seem to propagate suite-specific options to the
            // afterSuite hook, so we'll have to store it.
            this._revertScript = options.revertSql;
            console.info(`Inserted suite-specific DB data \`${options.extraSql}\``);
        }
    }

    override async _afterSuite(suite: Mocha.Suite): Promise<void> {
        if (!this._resetDbOnNextRun) return;

        if (this._revertScript) {
            // Undo via revert script, which should be faster than truncating
            // the whole database.
            const sqlPath = this._getSqlScriptContainerPath(suite, this._revertScript);
            await execInMBContainer(`bash ${EXEC_SCRIPT_PATH} "${sqlPath}"`);
            console.info('Removed suite-specific DB data');
        } else {
            await this._resetDb();
            console.info('Reset DB after suite-specific DB data');
        }

        this._resetDbOnNextRun = false;
    }
}

module.exports = DBHelper;
