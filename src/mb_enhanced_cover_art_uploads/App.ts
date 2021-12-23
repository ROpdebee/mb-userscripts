/* istanbul ignore file: Covered by E2E */

import { LOGGER } from '@lib/logging/logger';
import { EditNote } from '@lib/MB/EditNote';
import { getURLsForRelease } from '@lib/MB/URLs';
import { assertHasValue } from '@lib/util/assert';

import type { FetchedImages } from './fetch';
import type { CoverArt } from './providers/base';
import { ImageFetcher } from './fetch';
import { enqueueImages, fillEditNote } from './form';
import { getProvider } from './providers';
import { SeedParameters } from './seeding/parameters';
import { InputForm } from './ui/main';
import { StatusBanner } from './ui/status_banner';

export class App {
    #note: EditNote;
    #fetcher: ImageFetcher;
    #ui: InputForm;
    #urlsInProgress: Set<string>;
    onlyFront = false;

    constructor() {
        this.#note = EditNote.withFooterFromGMInfo();
        this.#fetcher = new ImageFetcher();
        this.#urlsInProgress = new Set();

        const banner = new StatusBanner();
        LOGGER.addSink(banner);
        this.#ui = new InputForm(banner.htmlElement, this);
    }

    async processURL(url: URL): Promise<void> {
        // Don't process a URL if we're already doing so
        if (this.#urlsInProgress.has(url.href)) {
            return;
        }

        try {
            this.#urlsInProgress.add(url.href);
            await this.#_processURL(url);
        } finally {
            this.#urlsInProgress.delete(url.href);
        }
    }

    async #_processURL(url: URL): Promise<void> {
        let fetchResult: FetchedImages;
        try {
            fetchResult = await this.#fetcher.fetchImages(url, this.onlyFront);
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

        fillEditNote([fetchResult], '', this.#note);
        if (fetchResult.images.length) {
            LOGGER.success(`Successfully added ${fetchResult.images.length} image(s)`);
        }
    }

    async processSeedingParameters(): Promise<void> {
        const params = SeedParameters.decode(new URLSearchParams(document.location.search));
        // Although this is very similar to `processURL`, we may have to fetch
        // and enqueue multiple images. We want to fetch images in parallel, but
        // enqueue them sequentially to ensure the order stays consistent.

        let fetchResults: Array<[FetchedImages, CoverArt]>;
        try {
            fetchResults = await Promise.all(params.images
                .map(async (cover): Promise<[FetchedImages, CoverArt]> => {
                    return [await this.#fetcher.fetchImages(cover.url, this.onlyFront), cover];
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

        fillEditNote(fetchResults.map((pair) => pair[0]), params.origin ?? '', this.#note);
        const totalNumImages = fetchResults.reduce((acc, pair) => acc + pair[0].images.length, 0);
        if (totalNumImages) {
            LOGGER.success(`Successfully added ${totalNumImages} image(s)`);
        }
    }

    async addImportButtons(): Promise<void> {
        const mbid = window.location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)?.[1];
        assertHasValue(mbid);
        const attachedURLs = await getURLsForRelease(mbid, {
            excludeEnded: true,
            excludeDuplicates: true,
        });
        const supportedURLs = attachedURLs.filter((url) => getProvider(url)?.allowButtons);

        if (!supportedURLs.length)
            return;

        supportedURLs.forEach((url) => {
            const provider = getProvider(url);
            assertHasValue(provider);
            this.#ui.addImportButton(this.processURL.bind(this, url), url.href, provider);
        });
    }
}
