/* istanbul ignore file: Covered by E2E */

import { LOGGER } from '@lib/logging/logger';

import { App } from './app';
import { seederFactory } from './seeding';

const seeder = seederFactory(document.location);
if (seeder) {
    Promise.resolve(seeder.insertSeedLinks())
        .catch((error) => {
            LOGGER.error('Failed to add seeding links', error);
        });
} else if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    // Initialise the app, which will start listening for pasted URLs.
    // The only reason we're using an app here is so we can easily access the
    // UI and fetcher instances without having to pass them around as
    // parameters.
    const app = new App();

    app.processSeedingParameters()
        .catch((error) => {
            LOGGER.error('Failed to process seeded cover art parameters', error);
        });
    app.addImportButtons()
        .catch((error) => {
            LOGGER.error('Failed to add some provider import buttons', error);
        });
} else {
    LOGGER.error('Somehow I am running on a page I do not support…');
}
