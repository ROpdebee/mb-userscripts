/* istanbul ignore file: Covered by E2E */

import { GuiSink } from '@lib/logging/gui-sink';
import { LOGGER } from '@lib/logging/logger';
import { EditNote } from '@lib/MB/edit-note';
import { getURLsForRelease } from '@lib/MB/urls';
import { enumerate } from '@lib/util/array';
import { assertHasValue } from '@lib/util/assert';
import { pFinally } from '@lib/util/async';
import { qs } from '@lib/util/dom';
import { ObservableSemaphore } from '@lib/util/observable';

import type { CoverArtJob, QueuedImageBatch } from './types';
import { fillEditNote } from './form';
import { CoverArtDownloader } from './images/download';
import { CoverArtResolver } from './images/resolve';
import { getProvider } from './providers';
import { SeedParameters } from './seeding/parameters';
import { InputForm } from './ui/main';

export class App {
    private readonly note: EditNote;
    private readonly resolver: CoverArtResolver;
    private readonly downloader: CoverArtDownloader;
    private readonly ui: InputForm;
    private readonly urlsInProgress: Set<string>;
    private readonly loggingSink = new GuiSink();
    private readonly fetchingSema: ObservableSemaphore;

    public constructor() {
        this.note = EditNote.withFooterFromGMInfo();
        this.urlsInProgress = new Set();

        // Set up logging banner
        LOGGER.addSink(this.loggingSink);
        qs('.add-files').insertAdjacentElement('afterend', this.loggingSink.rootElement);

        this.fetchingSema = new ObservableSemaphore({
            // Need to use lambdas here to access the original `this`.
            onAcquired: (): void => {
                this.ui.disableSubmissions();
            },
            onReleased: (): void => {
                this.ui.enableSubmissions();
            },
        });
        this.ui = new InputForm(this);
        this.resolver = new CoverArtResolver();
        this.downloader = new CoverArtDownloader(this.ui);
    }

    public async processURLs(urls: URL[]): Promise<void> {
        return this._processURLs(urls.map((url) => ({ url })));
    }

    public clearLogLater(): void {
        this.loggingSink.clearAllLater();
    }

    private async _processURLs(jobs: readonly CoverArtJob[], origin?: string): Promise<void> {
        // Run the fetcher in a section during which submitting the edit form
        // will be blocked. This is to prevent users from submitting the edits
        // while we're still adding images. We run the whole loop in the section
        // to prevent toggling the button in between two URLs.
        const batches = await this.fetchingSema.runInSection(async () => {
            const queuedBatches: QueuedImageBatch[] = [];

            for (const [job, index] of enumerate(jobs)) {
                // Don't process a URL if we're already doing so, e.g. a user
                // clicked a button that was already processing via a seed param.
                if (this.urlsInProgress.has(job.url.href)) {
                    continue;
                }

                this.urlsInProgress.add(job.url.href);
                if (jobs.length > 1) {
                    LOGGER.info(`Fetching ${job.url} (${index + 1}/${jobs.length})`);
                } else {
                    // Don't specify progress if there's just one image to process.
                    LOGGER.info(`Fetching ${job.url}`);
                }
                try {
                    const batchMetadata = await this.resolver.resolveImages(job);
                    const fetchResult = await this.downloader.fetchAndEnqueueCoverArt(batchMetadata);
                    queuedBatches.push(fetchResult);
                } catch (error) {
                    LOGGER.error('Failed to fetch or enqueue images', error);
                }

                this.urlsInProgress.delete(job.url.href);
            }

            return queuedBatches;
        });

        fillEditNote(batches, origin ?? '', this.note);
        const totalNumberImages = batches.reduce((accumulator, batch) => accumulator + batch.images.length, 0);
        if (totalNumberImages > 0) {
            LOGGER.success(`Successfully added ${totalNumberImages} image(s)`);
        }
    }

    public async processSeedingParameters(): Promise<void> {
        const parameters = SeedParameters.decode(new URLSearchParams(document.location.search));
        await this._processURLs(parameters.images, parameters.origin);
        this.clearLogLater();
    }

    public async addImportButtons(): Promise<void> {
        const mbid = /musicbrainz\.org\/release\/([a-f\d-]+)\//.exec(window.location.href)?.[1];
        assertHasValue(mbid);
        const attachedURLs = await getURLsForRelease(mbid, {
            excludeEnded: true,
            excludeDuplicates: true,
        });
        const supportedURLs = attachedURLs.filter((url) => getProvider(url)?.allowButtons);

        if (supportedURLs.length === 0) return;

        // Helper to ensure we don't silently ignore promise rejections in
        // `this.processURL`, as the callback given to `ui.addImportButton`
        // expects a synchronous function.
        // eslint-disable-next-line unicorn/consistent-function-scoping -- Requires access to `this`.
        const syncProcessURL = (url: URL): void => {
            void pFinally(
                this.processURLs([url])
                    .catch((error: unknown) => {
                        LOGGER.error(`Failed to process URL ${url.href}`, error);
                    }),
                this.clearLogLater.bind(this));
        };

        const providers = supportedURLs
            .map((url) => {
                const provider = getProvider(url);
                assertHasValue(provider);
                return { url, provider };
            })
            .sort((a, b) => a.provider.name.localeCompare(b.provider.name));

        await Promise.all(providers.map(
            ({ url, provider }) => this.ui.addImportButton(syncProcessURL.bind(this, url), url.href, provider)));
    }
}
