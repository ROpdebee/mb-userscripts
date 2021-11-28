import { promisify } from 'util';
import child_process from 'child_process';
import { event, recorder } from 'codeceptjs';

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

module.exports = function dbPlugin(): void {
    // Initialise the DB for the tests
    event.dispatcher.on(event.all.before, async () => {
        recorder.add('prepare database', async () => {
            return tryExec('docker exec musicbrainz bash /media/e2e/setup/prepare_db.sh');
        });
    });

    // TODO: Test-specific (and perhaps suite-specific) data by having an
    // `extraSql` option on Scenarios and Features. Preferably without resetting
    // the whole DB, so a `before` hook that inserts the data, and an `after`
    // hook which deletes it again.
};
