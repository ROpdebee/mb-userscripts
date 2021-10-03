import { EditNote } from '@lib/MB/EditNote';
import { assertHasValue } from '@lib/util/assert';
import { qs, qsa } from '@lib/util/dom';
import { LOGGER } from '@lib/logging/logger';
import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';

import { addAtisketSeedLinks } from './atisket';
import { getProvider, hasProvider } from './providers';
import { ArtworkTypeIDs } from './providers/base';

import { StatusBanner } from './ui/status_banner';
import USERSCRIPT_NAME from 'consts:userscript-name';
import DEBUG_MODE from 'consts:debug-mode';
import { InputForm } from './ui/main';
import type { FetchedImages } from './fetch';
import { ImageFetcher } from './fetch';

class ImageImporter {
    #note: EditNote;
    #fetcher: ImageFetcher;

    constructor() {
        this.#note = EditNote.withFooterFromGMInfo();
        this.#fetcher = new ImageFetcher();
    }

    async addImagesFromLocationHash(): Promise<void> {
        const seedParams: Record<string, string | undefined> = {};
        document.location.hash.replace(/^#/, '').split('&').forEach((param) => {
            try {
                const [name, value] = param.split('=');
                seedParams[name] = decodeURIComponent(value);
            } catch (err) {
                console.error(err);
                return;
            }
        });

        if (!seedParams.artwork_url) return;
        const url = this.#cleanUrl(seedParams.artwork_url);
        if (!url) return;

        const types = [];
        if (seedParams.artwork_type) {
            const artworkTypeName = seedParams.artwork_type as keyof typeof ArtworkTypeIDs;
            const artworkType = ArtworkTypeIDs[artworkTypeName];
            if (typeof artworkType !== 'undefined') {
                types.push(artworkType);
            }
        }

        const result = await this.#addImages(url, types);
        if (!result) return;

        this.#fillEditNote(result, seedParams.origin ?? '');

        this.#clearInput(url.href);
        this.#updateBannerSuccess(result);
    }

    async #addImages(url: URL, artworkTypes: ArtworkTypeIDs[] = [], comment = ''): Promise<FetchedImages | undefined> {
        // eslint-disable-next-line init-declarations
        let result: FetchedImages;
        try {
            result = await this.#fetcher.fetchImages(url);
        } catch (err) {
            LOGGER.error('Failed to grab images', err);
            return;
        }
        const resultsWithTypes = {
            containerUrl: result.containerUrl,
            images: result.images.map((img) => {
                return {
                    ...img,
                    types: img.types.length ? img.types : artworkTypes,
                    comment: img.comment || comment,
                };
            }),
        };

        resultsWithTypes.images.forEach((img) => {
            this.#enqueueImageForUpload(img.content, img.types, img.comment);
        });
        return resultsWithTypes;
    }

    #updateBannerSuccess(result: FetchedImages): void {
        if (result.containerUrl) {
            LOGGER.success(`Successfully added ${result.images.length} URLs from ${result.containerUrl.pathname.split('/').at(-1)}`);
        } else {
            // There should only be one queued URL
            LOGGER.success(`Successfully added ${result.images[0].content.name}` + (result.images[0].wasMaximised ? ' (maximised)' : ''));
        }
    }

    #fillEditNote(queueResult: FetchedImages, origin = ''): void {
        let prefix = '';
        if (queueResult.containerUrl) {
            prefix = ' * ';
            this.#note.addExtraInfo(queueResult.containerUrl.href);
        }

        // Limiting to 3 URLs to reduce noise
        for (const queuedUrl of queueResult.images.slice(0, 3)) {
            // Prevent noise
            if (queuedUrl.maximisedUrl.protocol === 'data:') {
                this.#note.addExtraInfo(prefix + 'Uploaded from data URL');
                continue;
            }
            this.#note.addExtraInfo(prefix + queuedUrl.maximisedUrl.href);
            if (queuedUrl.wasMaximised) {
                this.#note.addExtraInfo(' '.repeat(prefix.length) + 'Maximised from ' + queuedUrl.originalUrl.href);
            }
        }
        if (queueResult.images.length > 3) {
            this.#note.addExtraInfo(prefix + `…and ${queueResult.images.length - 3} additional images`);
        }
        if (origin) {
            this.#note.addExtraInfo(`Seeded from ${origin}`);
        }

        this.#note.addFooter();
    }

    #cleanUrl(url: string): URL | undefined {
        url = url.trim();
        if (!url) {
            return;
        }

        try {
            return new URL(url);
        } catch {
            LOGGER.error(`Invalid URL: ${url}`);
            return;
        }
    }

    async addImagesFromUrl(url: URL): Promise<void> {
        const result = await this.#addImages(url);
        if (!result) return;

        this.#fillEditNote(result);
        this.#clearInput(url.href);
        this.#updateBannerSuccess(result);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #clearInput(_oldValue: string): void {
        // FIXME: We don't have access to the URL inputs anymore. Instead, we
        // should return our results and have the client of the importer do the
        // clearing.
        /*if (this.#urlInput.value == oldValue) {
            this.#urlInput.value = '';
        }*/
    }

    #enqueueImageForUpload(file: File, artworkTypes: ArtworkTypeIDs[], comment: string): void {
        // Fake event to trigger the drop event on the drag'n'drop element
        // Using jQuery because native JS cannot manually trigger such events
        // for security reasons
        const dropEvent = $.Event('drop') as JQuery.TriggeredEvent;
        dropEvent.originalEvent = {
            dataTransfer: { files: [file] }
        } as unknown as DragEvent;

        // Note that we're using MB's own jQuery here, not a script-local one.
        // We need to reuse MB's own jQuery to be able to trigger the event
        // handler.
        $('#drop-zone').trigger(dropEvent);

        if (artworkTypes.length) {
            // Asynchronous to allow the event to be handled first
            setTimeout(() => { this.#setArtworkTypeAndComment(file, artworkTypes, comment); }, 0);
        }
    }

    #setArtworkTypeAndComment(file: File, artworkTypes: ArtworkTypeIDs[], comment: string): void {
        // Find the row for this added image. Since we're called asynchronously,
        // we can't be 100% sure it's the last one. We find the correct image
        // via the file name, which is guaranteed to be unique since we embed
        // a unique ID into it.
        const pendingUploadRows = qsa<HTMLTableRowElement>('tbody[data-bind="foreach: files_to_upload"] > tr');
        const fileRow = pendingUploadRows.find((row) =>
            qs<HTMLSpanElement>('.file-info span[data-bind="text: name"]', row).innerText == file.name);

        // Try again if the artwork hasn't been queued yet
        if (!fileRow) {
            setTimeout(() => { this.#setArtworkTypeAndComment(file, artworkTypes, comment); }, 500);
            return;
        }

        const checkboxesToCheck = qsa<HTMLInputElement>('ul.cover-art-type-checkboxes input[type="checkbox"]', fileRow)
            .filter((cbox) => artworkTypes.includes(parseInt(cbox.value)));
        checkboxesToCheck.forEach((cbox) => {
            cbox.checked = true;
            cbox.dispatchEvent(new Event('click'));
        });

        if (comment.trim().length) {
            const commentInput = qs<HTMLInputElement>('div.comment > input.comment', fileRow);
            commentInput.value = comment.trim();
            commentInput.dispatchEvent(new Event('change'));
        }
    }
}

async function addImportButtons(ui: InputForm, importer: ImageImporter): Promise<void> {
    const attachedURLs = await getAttachedURLs();
    const supportedURLs = attachedURLs.filter(hasProvider);

    if (!supportedURLs.length) return;

    supportedURLs.forEach((url) => {
        const provider = getProvider(url);
        assertHasValue(provider);
        ui.addImportButton(importer.addImagesFromUrl.bind(importer, url), url.href, provider);
    });
}

async function getAttachedURLs(): Promise<URL[]> {
    const mbid = location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)?.[1];
    assertHasValue(mbid);
    const resp = await fetch(`/ws/2/release/${mbid}?inc=url-rels&fmt=json`);
    const metadata = await resp.json();
    const urls: string[] = metadata.relations
        ?.filter((rel: { ended: boolean }) => !rel.ended)
        ?.map((rel: { url: { resource: string } }) => rel.url.resource) ?? [];
    // Deduplicate, e.g. bandcamp URLs may have multiple rels
    // (stream for free, purchase for download)
    return [...new Set(urls)]
        // Filter out bad URLs, you never know...
        .map((url) => {
            try {
                return new URL(url);
            } catch {
                return null;
            }
        })
        .filter((url: URL | null) => url !== null) as URL[];

}

LOGGER.configure({
    logLevel: DEBUG_MODE ? LogLevel.DEBUG : LogLevel.INFO,
});
LOGGER.addSink(new ConsoleSink(USERSCRIPT_NAME));

if (document.location.hostname.endsWith('musicbrainz.org')) {
    const banner = new StatusBanner();
    LOGGER.addSink(banner);
    const importer = new ImageImporter();

    const ui = new InputForm(banner.htmlElement, importer.addImagesFromUrl.bind(importer));

    // Deliberately not awaiting any of these, we don't need any results.
    addImportButtons(ui, importer);
    if (/artwork_url=(.+)/.test(document.location.hash)) {
        importer.addImagesFromLocationHash();
    }
} else if (document.location.hostname === 'atisket.pulsewidth.org.uk') {
    addAtisketSeedLinks();
}
