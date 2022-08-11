import { LOGGER } from '@lib/logging/logger';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assert, assertHasValue } from '@lib/util/assert';
import { parseDOM, qs, qsa, qsMaybe } from '@lib/util/dom';
import { safeParseJSON } from '@lib/util/json';
import { request } from '@lib/util/request';
import { urlBasename } from '@lib/util/urls';

import type { CoverArt } from '../types';
import { CoverArtProvider } from './base';

// Not full, only what we need
interface AlbumMetadata {
    covers: Array<{
        full: string;
        medium: string;
        name: string;
        thumb: string;
    }>;

    picture_full: string;
    link: string;
}

// type, list of types, or type with additional information
type MappedArtwork = ArtworkTypeIDs | ArtworkTypeIDs[] | { type: ArtworkTypeIDs | ArtworkTypeIDs[]; comment: string };

function mapPackagingType(packaging: string, caption: string): MappedArtwork {
    if (!caption && packaging === 'Jacket') {
        // Assume jacket is front, back, and spine.
        return {
            type: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine],
            comment: '',
        };
    } else if (!caption) {
        // Slipcase, digipak, box is likely just front
        return {
            type: [ArtworkTypeIDs.Front],
            comment: packaging,
        };
    }

    const types = new Set<ArtworkTypeIDs>();
    const keywords = caption.split(/,|\s|and|&/i);
    const typeKeywordsToTypes = [
        ['front', ArtworkTypeIDs.Front],
        ['back', ArtworkTypeIDs.Back],
        ['spine', ArtworkTypeIDs.Spine],
        ['side', ArtworkTypeIDs.Spine],
        ['top', ArtworkTypeIDs.Top],
        ['bottom', ArtworkTypeIDs.Bottom],
        ['interior', ArtworkTypeIDs.Tray],
        ['inside', ArtworkTypeIDs.Tray],
    ] as const;
    for (const [typeKeyword, type] of typeKeywordsToTypes) {
        if (keywords.some((kw) => kw.toLowerCase() === typeKeyword)) {
            types.add(type);
        }
    }

    // Assuming if the front and back are included, the spine is as well.
    if (types.has(ArtworkTypeIDs.Front) && types.has(ArtworkTypeIDs.Back)) {
        types.add(ArtworkTypeIDs.Spine);
    }

    // Copy anything other than the type keywords to the comment
    const typeKeywords = new Set<string>(typeKeywordsToTypes.map(([typeKeyword]) => typeKeyword));
    const otherKeywords = keywords
        .filter((kw) => !typeKeywords.has(kw.toLowerCase()));

    // Also include packaging name in comment if it's not a jacket.
    if (packaging !== 'Jacket') otherKeywords.unshift(packaging);
    const comment = otherKeywords.join(' ').trim();

    return {
        type: types.size > 0 ? [...types] : [ArtworkTypeIDs.Other],
        comment,
    };
}

function mapDiscType(mediumType: string, caption: string): MappedArtwork {
    const commentParts = [];
    let type = ArtworkTypeIDs.Medium;

    const keywords = caption.split(/,|\s/).filter(Boolean);
    for (const keyword of keywords) {
        // As a regular expression because it might be surrounded in parentheses
        if (/reverse|back/i.test(keyword)) {
            type = ArtworkTypeIDs.Matrix;
        } else if (!/front/i.test(keyword)) {  // Don't include "front" for e.g. "Disc Front"
            commentParts.push(keyword);
        }
    }

    // If the comment starts with a sequence number or isn't just "Disc", add the medium type
    if (commentParts.length > 0 && /^\d+/.test(commentParts[0]) || mediumType !== 'Disc') {
        commentParts.unshift(mediumType);
    }

    return {
        type,
        comment: commentParts.join(' '),
    };
}

// Keys: First word of the VGMdb caption (mostly structured), lower-cased
// Values: Either MappedArtwork or a callable taking the remainder of the caption and returning MappedArtwork
const __CAPTION_TYPE_MAPPING: Record<string, MappedArtwork | ((caption: string) => MappedArtwork)> = {
    front: ArtworkTypeIDs.Front,
    booklet: ArtworkTypeIDs.Booklet,
    jacket: mapPackagingType.bind(undefined, 'Jacket'), // DVD jacket
    disc: mapDiscType.bind(undefined, 'Disc'),
    cd: mapDiscType.bind(undefined, 'CD'),
    cassette: ArtworkTypeIDs.Medium,
    vinyl: ArtworkTypeIDs.Medium,
    dvd: mapDiscType.bind(undefined, 'DVD'),
    'blu-ray': mapDiscType.bind(undefined, 'Blu‐ray'),
    tray: ArtworkTypeIDs.Tray,
    back: ArtworkTypeIDs.Back,
    obi: ArtworkTypeIDs.Obi,
    box: mapPackagingType.bind(undefined, 'Box'),
    card: { type: ArtworkTypeIDs.Other, comment: 'Card' },
    sticker: ArtworkTypeIDs.Sticker,
    slipcase: mapPackagingType.bind(undefined, 'Slipcase'),
    digipack: mapPackagingType.bind(undefined, 'Digipak'),
    sleeve: mapPackagingType.bind(undefined, 'Sleeve'),
    insert: { type: ArtworkTypeIDs.Other, comment: 'Insert' }, // Or poster?
    inside: ArtworkTypeIDs.Tray,
    case: mapPackagingType.bind(undefined, 'Case'),
    contents: ArtworkTypeIDs.Raw,
};

function convertMappingReturnValue(ret: MappedArtwork): { types: ArtworkTypeIDs[]; comment: string } {
    if (Object.prototype.hasOwnProperty.call(ret, 'type')
            && Object.prototype.hasOwnProperty.call(ret, 'comment')) {
        const retObj = ret as { type: ArtworkTypeIDs | ArtworkTypeIDs[]; comment: string };
        return {
            types: Array.isArray(retObj.type) ? retObj.type : [retObj.type],
            comment: retObj.comment,
        };
    }

    let types = ret as ArtworkTypeIDs | ArtworkTypeIDs[];
    /* istanbul ignore next: No mapper generates this currently */
    if (!Array.isArray(types)) {
        types = [types];
    }

    return {
        types,
        comment: '',
    };
}

const CAPTION_TYPE_MAPPING: Record<string, ((caption: string) => { types: ArtworkTypeIDs[]; comment: string }) | undefined> = {};
// Convert all definitions to a single signature for easier processing later on
for (const [key, value] of Object.entries(__CAPTION_TYPE_MAPPING)) {
    // Since value is a block-scoped const, the lambda will close over that
    // exact value. It wouldn't if it was a var, as `value` would in the end
    // only refer to the last value. Babel transpiles this correctly, so this
    // is safe.
    CAPTION_TYPE_MAPPING[key] = (caption: string): { types: ArtworkTypeIDs[]; comment: string } => {
        if (typeof value === 'function') {
            // Assume the function sets everything correctly, including the
            // comment
            return convertMappingReturnValue(value(caption));
        }

        const retObj = convertMappingReturnValue(value);
        // Add remainder of the caption to the comment returned by the mapping
        if (retObj.comment && caption) retObj.comment += ' ' + caption;
        // If there's a caption but no comment, set the comment to the caption
        else if (caption) retObj.comment = caption;
        // Otherwise there's a comment set by the mapper but no caption => keep,
        // or neither a comment nor a caption => nothing needs to be done.

        return retObj;
    };
}

const PLACEHOLDER_URL = '/db/img/album-nocover-medium.gif';
const NSFW_PLACEHOLDER_URL = '/db/img/album-nsfw-medium.gif';

function cleanupCaption(captionRest: string): string {
    return captionRest
        // Remove parentheses, braces and brackets, but only if they wrap the
        // whole caption
        .replace(/^\((.+)\)$/, '$1')
        .replace(/^\[(.+)]$/, '$1')
        .replace(/^{(.+)}$/, '$1')
        // Remove leading dash or colon, possibly used to split type from comment
        .replace(/^[-–:]\s*/, '');
}

function convertCaption(caption: string): { types?: ArtworkTypeIDs[]; comment: string } {
    LOGGER.debug(`Found caption “${caption}”`);
    const [captionType, ...captionRestParts] = caption.trim().split(/(?=[^a-zA-Z\d-])/);
    const captionRest = cleanupCaption(captionRestParts.join('').trim());
    const mapper = CAPTION_TYPE_MAPPING[captionType.toLowerCase()];

    if (!mapper) {
        LOGGER.debug(`Could not map “${captionType}” to any known cover art types`);
        LOGGER.debug(`Setting cover art comment to “${caption}”`);
        return { comment: caption };
    }

    const mappedResult = mapper(captionRest);
    LOGGER.debug(`Mapped caption to types ${mappedResult.types} and comment “${mappedResult.comment}”`);
    return mappedResult;
}

export function convertCaptions(cover: { url: string; caption: string }): CoverArt {
    const url = new URL(cover.url);
    if (!cover.caption) {
        return { url };
    }

    return {
        url,
        ...convertCaption(cover.caption),
    };
}

export class VGMdbProvider extends CoverArtProvider {
    public readonly supportedDomains = ['vgmdb.net'];
    public readonly favicon = 'https://vgmdb.net/favicon.ico';
    public readonly name = 'VGMdb';
    protected readonly urlRegex = /\/album\/(\d+)(?:\/|$)/;

    public async findImages(url: URL): Promise<CoverArt[]> {
        const pageSrc = await this.fetchPage(url);
        if (pageSrc.includes('/db/img/banner-error.gif')) {
            throw new Error('VGMdb returned an error');
        }

        const pageDom = parseDOM(pageSrc, url.href);

        // istanbul ignore else: Tests are not logged in
        if (qsMaybe('#navmember', pageDom) === null) {
            LOGGER.warn('Heads up! VGMdb requires you to be logged in to view all images. Some images may have been missed. If you have an account, please log in to VGMdb to fetch all images.');
        }

        const coverGallery = qsMaybe('#cover_gallery', pageDom);
        const galleryCovers = coverGallery ? await VGMdbProvider.extractCoversFromDOMGallery(coverGallery) : [];

        // Add the main cover if it's not in the gallery
        const mainCoverUrl = qsMaybe<HTMLDivElement>('#coverart', pageDom)?.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/)?.[1];
        if (mainCoverUrl && mainCoverUrl !== PLACEHOLDER_URL && !galleryCovers.some((cover) => urlBasename(cover.url) === urlBasename(mainCoverUrl))) {
            if (mainCoverUrl === NSFW_PLACEHOLDER_URL) {
                // FIXME: We should be able to work around this by sending a cookie.
                // I've tried, but for some reason either the cookie isn't being sent,
                // or VGMdb isn't accepting it.
                LOGGER.warn('Heads up! The main cover of this VGMdb release is marked as NSFW. The original image may have been skipped. Please adjust your VGMdb preferences to show NSFW images to enable fetching these.');
            } else {
                galleryCovers.unshift({
                    url: new URL(mainCoverUrl, url.origin),
                    types: [ArtworkTypeIDs.Front],
                    comment: '',
                });
            }
        }

        return galleryCovers;
    }

    public static async extractCoversFromDOMGallery(coverGallery: Element): Promise<CoverArt[]> {
        const coverElements = qsa<HTMLAnchorElement>('a[id*="thumb_"]', coverGallery);
        return coverElements.map(this.extractCoverFromAnchor.bind(this));
    }

    private static extractCoverFromAnchor(anchor: HTMLAnchorElement): CoverArt {
        return convertCaptions({
            url: anchor.href,
            caption: qs('.label', anchor).textContent ?? /* istanbul ignore next */ '',
        });
    }

    public async findImagesWithApi(url: URL): Promise<CoverArt[]> {
        // Using the unofficial API at vgmdb.info
        const id = this.extractId(url);
        assertHasValue(id);
        const apiUrl = `https://vgmdb.info/album/${id}?format=json`;
        const apiResp = await request.get(apiUrl);
        const metadata = safeParseJSON<AlbumMetadata>(apiResp.text, 'Invalid JSON response from vgmdb.info API');

        assert(metadata.link === 'album/' + id, `VGMdb.info returned wrong release: Requested album/${id}, got ${metadata.link}`);

        return VGMdbProvider.extractImagesFromApiMetadata(metadata);
    }

    private static extractImagesFromApiMetadata(metadata: AlbumMetadata): CoverArt[] {
        const covers = metadata.covers.map((cover) => {
            return { url: cover.full, caption: cover.name };
        });
        if (metadata.picture_full
                && !covers.some((cover) => cover.url === metadata.picture_full)) {
            // Assuming the main picture is the front cover
            covers.unshift({ url: metadata.picture_full, caption: 'Front' });
        }

        return covers.map((cover) => convertCaptions(cover));
    }
}
