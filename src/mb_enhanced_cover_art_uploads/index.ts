/* istanbul ignore file: Covered by E2E */

import DEBUG_MODE from 'consts:debug-mode';
import USERSCRIPT_NAME from 'consts:userscript-name';

import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';
import { LOGGER } from '@lib/logging/logger';

import { App } from './App';
import { seederFactory } from './seeding';

LOGGER.configure({
    logLevel: DEBUG_MODE ? LogLevel.DEBUG : LogLevel.INFO,
});
LOGGER.addSink(new ConsoleSink(USERSCRIPT_NAME));

function runOnMB(): void {
    // Initialise the app, which will start listening for pasted URLs.
    // The only reason we're using an app here is so we can easily access the
    // UI and fetcher instances without having to pass them around as
    // parameters.
    const app = new App();

    app.processSeedingParameters();
    app.addImportButtons();
}

function runOnSeederPage(): void {
    const seeder = seederFactory(document.location);
    if (seeder) {
        seeder.insertSeedLinks();
    } else {
        LOGGER.error('Somehow I am running on a page I do not support…');
    }
}

if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    runOnMB();
} else {
    runOnSeederPage();
}
