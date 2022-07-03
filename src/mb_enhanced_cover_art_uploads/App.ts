/* istanbul ignore file: Covered by E2E */

import { GuiSink } from '@lib/logging/guiSink';
import { LOGGER } from '@lib/logging/logger';
import { EditNote } from '@lib/MB/EditNote';
import { getURLsForRelease } from '@lib/MB/URLs';
import { assertHasValue } from '@lib/util/assert';
import { qs } from '@lib/util/dom';
import { ObservableSemaphore } from '@lib/util/observable';

import type { CoverArt, FetchedImageBatch } from './types';
import { ImageFetcher } from './fetch';
import { enqueueImages, fillEditNote } from './form';
import { getProvider } from './providers';
import { SeedParameters } from './seeding/parameters';
import { InputForm } from './ui/main';

export class App {
    private readonly note: EditNote;
    private readonly fetcher: ImageFetcher;
    private readonly ui: InputForm;
    private readonly urlsInProgress: Set<string>;
    private readonly loggingSink = new GuiSink();
    private readonly fetchingSema: ObservableSemaphore;
    public onlyFront = false;

    public constructor() {
        this.note = EditNote.withFooterFromGMInfo();
        this.fetcher = new ImageFetcher();
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
    }

    public async processURL(url: URL): Promise<void> {
        // Don't process a URL if we're already doing so
        if (this.urlsInProgress.has(url.href)) {
            return;
        }

        this.urlsInProgress.add(url.href);
        try {
            // Run the fetcher in a section during which submitting the edit
            // form will be blocked. This is to prevent users from submitting
            // the edits while we're still adding images.
            await this.fetchingSema.runInSection(this._processURL.bind(this, url));
        } finally {
            this.urlsInProgress.delete(url.href);
        }
    }

    public clearLogLater(): void {
        this.loggingSink.clearAllLater();
    }

    private async _processURL(url: URL): Promise<void> {
        let fetchResult: FetchedImageBatch;
        try {
            fetchResult = await this.fetcher.fetchImages(url, this.onlyFront);
        } catch (err) {
            LOGGER.error('Failed to grab images', err);
            return;
        }

        try {
            await enqueueImages(fetchResult);
        } catch (err) {
            LOGGER.error('Failed to enqueue images', err);
            return;
        }

        fillEditNote([fetchResult], '', this.note);
        if (fetchResult.images.length > 0) {
            LOGGER.success(`Successfully added ${fetchResult.images.length} image(s)`);
        }
    }

    public async processSeedingParameters(): Promise<void> {
        const params = SeedParameters.decode(new URLSearchParams(document.location.search));
        // Although this is very similar to `processURL`, we may have to fetch
        // and enqueue multiple images. We want to fetch images in parallel, but
        // enqueue them sequentially to ensure the order stays consistent.

        let fetchResults: Array<[FetchedImageBatch, CoverArt]>;
        try {
            fetchResults = await Promise.all(params.images
                .map(async (cover): Promise<[FetchedImageBatch, CoverArt]> => {
                    return [await this.fetcher.fetchImages(cover.url, this.onlyFront), cover];
                }));
        } catch (err) {
            LOGGER.error('Failed to grab images', err);
            return;
        }

        // Not using Promise.all to ensure images get added in order.
        for (const [fetchResult, cover] of fetchResults) {
            try {
                await enqueueImages(fetchResult, cover.types, cover.comment);
            } catch (err) {
                LOGGER.error('Failed to enqueue some images', err);
            }
        }

        fillEditNote(fetchResults.map((pair) => pair[0]), params.origin ?? '', this.note);
        const totalNumImages = fetchResults.reduce((acc, pair) => acc + pair[0].images.length, 0);
        if (totalNumImages) {
            LOGGER.success(`Successfully added ${totalNumImages} image(s)`);
        }
        this.clearLogLater();
    }

    public async addImportButtons(): Promise<void> {
        const mbid = window.location.href.match(/musicbrainz\.org\/release\/([a-f\d-]+)\//)?.[1];
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
            this.processURL(url)
                .catch((err) => {
                    LOGGER.error(`Failed to process URL ${url.href}`, err);
                })
                .finally(() => {
                    this.clearLogLater();
                });
        };

        await Promise.all(supportedURLs.map((url) => {
            const provider = getProvider(url);
            assertHasValue(provider);
            return this.ui.addImportButton(syncProcessURL.bind(this, url), url.href, provider);
        }));
    }
}
