import { assertHasValue } from '../../lib/util/assert';
import { gmxhr } from '../../lib/util/xhr';

import type { CoverArt, CoverArtProvider } from './base';
import { ArtworkTypeIDs } from './base';

const ID_REGEX = /\/album\/(\d+)(?:\/|$)/;

// Not full, only what we need
interface AlbumMetadata {
    covers: Array<{
        full: string
        medium: string
        name: string
        thumb: string
    }>

    picture_full: string
}

// type, list of types, or type with additional information
type MappedArtwork = ArtworkTypeIDs | ArtworkTypeIDs[] | { type: ArtworkTypeIDs | ArtworkTypeIDs[]; comment: string };

function mapJacketType(caption: string): MappedArtwork {
    if (!caption) return [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back, ArtworkTypeIDs.Spine];
    const types = [];
    const keywords = caption.split(/(?:,|\s|and|&)/i);
    const faceKeywords = ['front', 'back', 'spine'];
    const [hasFront, hasBack, hasSpine] = faceKeywords
        .map((faceKw) => !!keywords
            // Case-insensitive .includes()
            .find((kw) => kw.toLowerCase() === faceKw.toLowerCase()));

    if (hasFront) types.push(ArtworkTypeIDs.Front);
    if (hasBack) types.push(ArtworkTypeIDs.Back);
    // Assuming if the front and back are included, the spine is as well.
    if (hasSpine || (hasFront && hasBack)) types.push(ArtworkTypeIDs.Spine);

    // Copy anything other than 'front', 'back', or 'spine' to the comment
    const otherKeywords = keywords
        .filter((kw) => !faceKeywords.includes(kw.toLowerCase()));
    if (otherKeywords.length) {
        return { type: types, comment: otherKeywords.join(' ') };
    }
    return types;
}

// Keys: First word of the VGMdb caption (mostly structured), lower-cased
// Values: Either MappedArtwork or a callable taking the remainder of the caption and returning MappedArtwork
const __CAPTION_TYPE_MAPPING: Record<string, MappedArtwork | ((caption: string) => MappedArtwork)> = {
    front: ArtworkTypeIDs.Front,
    booklet: ArtworkTypeIDs.Booklet,
    jacket: mapJacketType, // DVD jacket
    disc: ArtworkTypeIDs.Medium,
    cassette: ArtworkTypeIDs.Medium,
    vinyl: ArtworkTypeIDs.Medium,
    tray: ArtworkTypeIDs.Tray,
    back: ArtworkTypeIDs.Back,
    obi: ArtworkTypeIDs.Obi,
    box: { type: ArtworkTypeIDs.Other, comment: 'Box' },
    card: { type: ArtworkTypeIDs.Other, comment: 'Card' },
    sticker: ArtworkTypeIDs.Sticker,
    slipcase: { type: ArtworkTypeIDs.Other, comment: 'Slipcase' },
    digipack: { type: ArtworkTypeIDs.Other, comment: 'Digipack' },
    insert: { type: ArtworkTypeIDs.Other, comment: 'Insert' }, // Or poster?
    case: { type: ArtworkTypeIDs.Other, comment: 'Case' },
    contents: ArtworkTypeIDs.Raw,
};

const CAPTION_TYPE_MAPPING: Record<string, ((caption: string) => { type: ArtworkTypeIDs[]; comment: string }) | undefined> = {};
// Convert all definitions to a single signature for easier processing later on
for (const [key, value] of Object.entries(__CAPTION_TYPE_MAPPING)) {
    // Since value is a block-scoped const, the lambda will close over that
    // exact value. It wouldn't if it was a var, as `value` would in the end
    // only refer to the last value. Babel transpiles this correctly, so this
    // is safe.
    CAPTION_TYPE_MAPPING[key] = (caption: string): { type: ArtworkTypeIDs[]; comment: string } => {
        const ret = typeof value === 'function' ? value(caption) : value;
        if (Object.prototype.hasOwnProperty.call(ret, 'type')
                && Object.prototype.hasOwnProperty.call(ret, 'comment')) {
            const retObj = ret as { type: ArtworkTypeIDs | ArtworkTypeIDs[]; comment: string };
            return {
                type: Array.isArray(retObj.type) ? retObj.type : [retObj.type],
                comment: retObj.comment,
            };
        }
        const retObj = ret as ArtworkTypeIDs | ArtworkTypeIDs[];
        return {
            type: Array.isArray(retObj) ? retObj : [retObj],
            comment: caption,
        };
    };
}

export class VGMdbProvider implements CoverArtProvider {
    supportedDomains = ['vgmdb.net']
    favicon = 'https://vgmdb.net/favicon.ico'
    name = 'VGMdb'

    supportsUrl(url: URL): boolean {
        return ID_REGEX.test(url.pathname);
    }

    async findImages(url: URL): Promise<CoverArt[]> {
        // Using the unofficial API at vgmdb.info
        const id = url.pathname.match(ID_REGEX)?.[1];
        assertHasValue(id);
        const apiUrl = `https://vgmdb.info/album/${id}?format=json`;
        const apiResp = await gmxhr({ url: apiUrl, method: 'GET' });
        const metadata = JSON.parse(apiResp.responseText) as AlbumMetadata;

        return this.#extractImages(metadata);
    }

    #extractImages(metadata: AlbumMetadata): CoverArt[] {
        const covers = metadata.covers.map((cover) => {
            return { url: cover.full, caption: cover.name };
        });
        if (metadata.picture_full
                && !covers.find((cover) => cover.url === metadata.picture_full)) {
            // Assuming the main picture is the front cover
            covers.unshift({ url: metadata.picture_full, caption: 'Front' });
        }

        return covers.map(this.#convertCaptions.bind(this));
    }

    #convertCaptions(cover: { url: string; caption: string }): CoverArt {
        const url = new URL(cover.url);
        if (!cover.caption) {
            return { url };
        }
        const [captionType, ...captionRestParts] = cover.caption.split(' ');
        const captionRest = captionRestParts.join(' ');
        const mapper = CAPTION_TYPE_MAPPING[captionType.toLowerCase()];

        if (!mapper) return { url, comment: cover.caption };
        return {
            url,
            ...mapper(captionRest),
        };
    }
}
