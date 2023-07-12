const e = encodeURIComponent;

export function ddgSearch(term: string): string {
    return `https://duckduckgo.com/?q=${e(term)}`;
}

function ddgSearchPrefix(prefix: string, term: string): string {
    return `https://duckduckgo.com/?q=${prefix} ${e(term)}`;
}

export const googleSearch = ddgSearchPrefix.bind(undefined, '!g');
export const ebaySearch = ddgSearchPrefix.bind(undefined, '!e');

export function discogsSearch(term: string): string {
    return `https://www.discogs.com/search/?q=${e(term)}&btn=&type=release`;
}

export function spotifySearch(term: string): string {
    return `https://open.spotify.com/search/${e(term)}/albums`;
}

export function googleReverseImageSearch(imgUrl: string): string {
    return `https://lens.google.com/uploadbyurl?url=${e(imgUrl)}`;
}

export function tineyeReverseImageSearch(imgUrl: string): string {
    return `https://tineye.com/search/?url=${e(imgUrl)}`;
}

export function appleMusicSearch(term: string): string {
    return `https://music.apple.com/us/search?term=${e(term)}`
}

export const atisketSearch = {
    byBarcode(barcode: string): string {
        return `https://atisket.pulsewidth.org.uk/?preferred_countries=GB%2CUS%2CDE&upc=${barcode}`;
    },

    byAppleMusicUrl(url: string): string {
        const id = url.match(/album(?:\/[^/]+)?\/(?:id)?(\d+)/)?.[1];
        return `https://atisket.pulsewidth.org.uk/?preferred_countries=GB%2CUS%2CDE&itu_id=${id}&preferred_vendor=itu`;
    },

    bySpotifyUrl(url: string): string {
        const id = url.match(/album\/([\dA-Za-z]{22})/)?.[1];
        return `https://atisket.pulsewidth.org.uk/?preferred_countries=GB%2CUS%2CDE&spf_id=${id}&preferred_vendor=spf`;
    },

    byDeezerUrl(url: string): string {
        const id = url.match(/album\/(\d+)/)?.[1];
        return `https://atisket.pulsewidth.org.uk/?preferred_countries=GB%2CUS%2CDE&deez_id=${id}&preferred_vendor=deez`;
    },
}
