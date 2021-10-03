import { EditNote } from '@lib/MB/EditNote';
import { assertHasValue } from '@lib/util/assert';
import { qs, qsa } from '@lib/util/dom';
import { gmxhr } from '@lib/util/xhr';
import { LOGGER } from '@lib/logging/logger';
import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';

import css from './main.scss';
import { addAtisketSeedLinks } from './atisket';
import { getMaxUrlCandidates } from './maxurl';
import { findImages, getProvider, hasProvider } from './providers';
import { ArtworkTypeIDs } from './providers/base';

import type { CoverArt } from './providers/base';

import { StatusBanner } from './ui/status_banner';

interface FetchResult {
    fetchedUrl: URL
    file: File
}

interface QueuedURL {
    filename: string
    originalUrl: URL
    maximisedUrl: URL
    wasMaximised: boolean
}

interface QueuedURLsResult {
    queuedUrls: QueuedURL[]
    containerUrl?: URL
}

class ImageImporter {
    #note: EditNote;
    #urlInput: HTMLInputElement;
    // Store `URL.href`, since two `URL` objects for the same URL are not identical.
    #doneImages: Set<string>;
    // Monotonically increasing ID to uniquely identify the image. We use this
    // so we can later set the image type.
    #lastId = 0;

    constructor(/* temporary */ banner: StatusBanner) {
        this.#note = EditNote.withFooterFromGMInfo();
        this.#urlInput = setupPage(banner, this.cleanUrlAndAdd.bind(this));
        this.#doneImages = new Set();
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

    #updateBannerSuccess(result: QueuedURLsResult): void {
        if (result.containerUrl) {
            LOGGER.success(`Successfully added ${result.queuedUrls.length} URLs from ${result.containerUrl.pathname.split('/').at(-1)}`);
        } else {
            // There should only be one queued URL
            LOGGER.success(`Successfully added ${result.queuedUrls[0].filename}` + (result.queuedUrls[0].wasMaximised ? ' (maximised)' : ''));
        }
    }

    #fillEditNote(queueResult: QueuedURLsResult, origin = ''): void {
        let prefix = '';
        if (queueResult.containerUrl) {
            prefix = ' * ';
            this.#note.addExtraInfo(queueResult.containerUrl.href);
        }

        // Limiting to 3 URLs to reduce noise
        for (const queuedUrl of queueResult.queuedUrls.slice(0, 3)) {
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
        if (queueResult.queuedUrls.length > 3) {
            this.#note.addExtraInfo(prefix + `…and ${queueResult.queuedUrls.length - 3} additional images`);
        }
        if (origin) {
            this.#note.addExtraInfo(`Seeded from ${origin}`);
        }

        this.#note.addFooter();
    }

    async cleanUrlAndAdd(url: string): Promise<void> {
        const urlObj = this.#cleanUrl(url);
        if (!urlObj) return;
        await this.#addImagesFromUrl(urlObj);
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

    async #addImagesFromUrl(url: URL): Promise<void> {
        const result = await this.#addImages(url);
        if (!result) return;

        this.#fillEditNote(result);
        this.#clearInput(url.href);
        this.#updateBannerSuccess(result);
    }

    async #addImagesFromProvider(originalUrl: URL, images: CoverArt[]): Promise<QueuedURLsResult | undefined> {
        LOGGER.info(`Found ${images.length} images`);
        let queueResults: QueuedURL[] = [];
        for (const img of images) {
            const result = await this.#addImages(img.url, img.type ?? [], img.comment ?? '');
            if (!result) continue;
            queueResults = queueResults.concat(result.queuedUrls);
        }

        this.#clearInput(originalUrl.href);
        LOGGER.info(`Added ${queueResults.length} images from ${originalUrl}`);
        if (!queueResults.length) {
            return;
        }

        return {
            containerUrl: originalUrl,
            queuedUrls: queueResults
        };
    }

    async #addImages(url: URL, artworkTypes: ArtworkTypeIDs[] = [], comment = ''): Promise<QueuedURLsResult | undefined> {
        LOGGER.info('Searching for images…');
        // eslint-disable-next-line init-declarations
        let containedImages: CoverArt[] | undefined;
        try {
            containedImages = await findImages(url);
        } catch (err) {
            LOGGER.error('Failed to search images', err);
            return;
        }

        if (containedImages) {
            return this.#addImagesFromProvider(url, containedImages);
        }

        const originalFilename = url.pathname.split('/').at(-1) || 'image';

        // Prevent re-adding one we've already done
        if (this.#doneImages.has(url.href)) {
            LOGGER.warn(`${originalFilename} has already been added`);
            this.#clearInput(url.href);
            return;
        }

        // eslint-disable-next-line init-declarations
        let result: FetchResult;
        try {
            result = await this.#fetchLargestImage(url);
        } catch (err) {
            LOGGER.error(`Failed to load ${originalFilename}`, err);
            return;
        }

        const { file, fetchedUrl } = result;
        const wasMaximised = fetchedUrl.href !== url.href;

        // As above, but also checking against maximised versions
        if (wasMaximised && this.#doneImages.has(fetchedUrl.href)) {
            LOGGER.warn(`${originalFilename} has already been added`);
            this.#clearInput(url.href);
            return;
        }

        this.#enqueueImageForUpload(file, artworkTypes, comment);
        this.#doneImages.add(fetchedUrl.href);
        this.#doneImages.add(url.href);
        return {
            queuedUrls: [{
                filename: file.name,
                wasMaximised: wasMaximised,
                originalUrl: url,
                maximisedUrl: fetchedUrl,
            }],
        };
    }

    #clearInput(oldValue: string): void {
        // Clear the old input, but only if it hasn't changed since. Because
        // this is asynchronous code, it's entirely possible for another image
        // to be loading at the same time
        if (this.#urlInput.value == oldValue) {
            this.#urlInput.value = '';
        }
    }

    async #fetchLargestImage(url: URL): Promise<FetchResult> {
        for await (const imageResult of getMaxUrlCandidates(url)) {
            const candName = imageResult.filename || imageResult.url.pathname.split('/').at(-1);
            try {
                LOGGER.info(`Trying ${candName}…`);
                return await this.#fetchImage(imageResult.url, candName, imageResult.headers);
            } catch (err) {
                LOGGER.error(candName + ' failed', err);
            }
        }

        // Fall back on original image
        return await this.#fetchImage(url, url.pathname.split('/').at(-1) || 'image');
    }

    async #fetchImage(url: URL, fileName: string, headers: Record<string, unknown> = {}): Promise<FetchResult> {
        const resp = await gmxhr(url, {
            responseType: 'blob',
            headers: headers,
        });

        const rawFile = new File([resp.response], fileName);

        return new Promise((resolve, reject) => {
            MB.CoverArt.validate_file(rawFile)
                .fail(() => {
                    reject(new Error(`${fileName} has an unsupported file type`));
                })
                .done((mimeType) => {
                    resolve({
                        fetchedUrl: url,
                        file: new File(
                            [resp.response],
                            `${fileName}.${this.#lastId++}.${mimeType.split('/')[1]}`,
                            { type: mimeType }),
                    });
                });
        });
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

function setupPage(statusBanner: StatusBanner, addImageCallback: (url: string) => void): HTMLInputElement {
    document.head.append(<style id='ROpdebee_upload_to_caa_from_url'>
        {css}
    </style>);

    const input = <input
        type='text'
        placeholder='or paste a URL here'
        size={47}
        onInput={(evt): void => { addImageCallback(evt.currentTarget.value); }}
    /> as HTMLInputElement;

    const container =
        <div className='ROpdebee_paste_url_cont'>
            {input}
            <a
                href='https://github.com/ROpdebee/mb-userscripts/blob/main/src/mb_enhanced_cover_art_uploads/supportedProviders.md'
                target='_blank'
            >
                Supported providers
            </a>
            {statusBanner.htmlElement}
        </div>;

    qs('#drop-zone')
        .insertAdjacentElement('afterend', container);

    // Intentionally not awaiting this, don't want to block the paste input
    addImportButtons(addImageCallback, container);

    return input;
}

async function addImportButtons(addImageCallback: (url: string) => void, inputContainer: Element): Promise<void> {
    const attachedURLs = await getAttachedURLs();
    const supportedURLs = attachedURLs.filter(hasProvider);

    if (!supportedURLs.length) return;

    const buttons = supportedURLs
        .map((url) => createImportButton(url, addImageCallback));
    inputContainer.insertAdjacentElement('afterend',
        <div className='ROpdebee_import_url_buttons buttons'>
            {buttons}
        </div>);
    inputContainer.insertAdjacentElement('afterend', <span>or</span>);
}

function createImportButton(url: URL, addImageCallback: (url: string) => void): HTMLElement {
    const provider = getProvider(url);
    return <button
        type='button'
        title={url.href}
        onClick={(evt): void => { evt.preventDefault(); addImageCallback(url.href); }}
    >
        <img src={provider?.favicon} alt={provider?.name} />
        <span>{'Import from ' + provider?.name}</span>
    </button>;
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
    logLevel: LogLevel.INFO,
});
LOGGER.addSink(new ConsoleSink('mb_enhanced_cover_art_uploads'));

if (document.location.hostname.endsWith('musicbrainz.org')) {
    const banner = new StatusBanner();
    LOGGER.addSink(banner);
    const importer = new ImageImporter(banner);
    if (/artwork_url=(.+)/.test(document.location.hash)) {
        importer.addImagesFromLocationHash();
    }
} else if (document.location.hostname === 'atisket.pulsewidth.org.uk') {
    addAtisketSeedLinks();
}
