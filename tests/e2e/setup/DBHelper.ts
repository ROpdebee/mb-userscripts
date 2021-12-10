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
    _revertScriptPath?: string;

    override async _init(): Promise<void> {
        event.dispatcher.on(event.all.before, () => {
            recorder.add(async () => {
                await execInMBContainer(`bash ${PREP_SCRIPT_PATH}`);
                console.info('Done setting up Musicbrainz database');
            });
        });
    }

    _validateOptions(suite: Mocha.Suite): Options {
        // @ts-expect-error Incomplete type definitions
        const opts: Options = suite.config?.DB ?? {};
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

    override async _beforeSuite(suite: Mocha.Suite): Promise<void> {
        // We may need to do the clean up in the before hook of the next suite
        // as the after hook of the original suite might not get called under
        // some circumstances. This might lead to failures in the next suite.
        if (this._resetDbOnNextRun) {
            await this._resetDb();
        }

        const options = this._validateOptions(suite);
        if (options.extraSql) {
            const sqlPath = this._getSqlScriptContainerPath(suite, options.extraSql);
            await execInMBContainer(`bash ${EXEC_SCRIPT_PATH} "${sqlPath}"`);
            this._resetDbOnNextRun = true;
            // Codecept doesn't seem to propagate suite-specific options to the
            // afterSuite hook, so we'll have to store it.
            if (options.revertSql) {
                // Need to provide full path because next suite may be in different file
                this._revertScriptPath = this._getSqlScriptContainerPath(suite, options.revertSql);
            }
            console.info(`Inserted suite-specific DB data \`${options.extraSql}\``);
        }
    }

    override async _afterSuite(): Promise<void> {
        if (!this._resetDbOnNextRun) return;
        await this._resetDb();
    }

    async _resetDb(): Promise<void> {
        if (this._revertScriptPath) {
            // Undo via revert script, which should be faster than truncating
            // the whole database.
            await execInMBContainer(`bash ${EXEC_SCRIPT_PATH} "${this._revertScriptPath}"`);
            console.info('Reverted specific DB data');
        } else {
            await execInMBContainer(`bash ${PREP_SCRIPT_PATH}`);
            console.info('Reset DB to clean up specific DB data. Consider adding a revert script for additional performance.');
        }

        this._resetDbOnNextRun = false;
    }
}

module.exports = DBHelper;
