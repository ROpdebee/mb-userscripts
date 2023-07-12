import { insertBetween } from '@lib/util/array';
import { qs, qsa, qsMaybe } from '@lib/util/dom';

import * as urls from '../urls';

function addBarcodeSearchLinks(): void {
    const upcElement = qsMaybe<HTMLDataElement>('dd.barcode');
    if (upcElement === null) return;
    const upc = upcElement.textContent!;

    const insertUrls: Array<[string, string]> = [
        ['at', urls.atisketSearch.byBarcode(upc)],
        ['dc', urls.discogsSearch(upc)],
        ['dd', urls.ddgSearch(upc)],
        ['gg', urls.googleSearch(upc)],
        ['eb', urls.ebaySearch(upc)],
    ];
    const insertAnchors = insertUrls.map(([name, url]) =>
        <a target='_blank' href={url} style={{ background: 'none', padding: 0 }}>{name}</a>);

    upcElement.after(
        // Hidden dt for alignment. "Borcode" to prevent any other script which does improper element selection
        // from matching our element instead of the real one.
        <dt style={{ color: '#fff' }}>Borcode:</dt>,
        <dd>{insertBetween(insertAnchors, '|')}</dd>);
}

function addCatNoSearchLinks(): void {

}

function addStreamingUrlLinks(): void {
    for (const link of qsa<HTMLAnchorElement>('#release-relationships a.wrap-anywhere')) {
        let searchLink: string;
        if (link.href.includes('music.apple.com') || link.href.includes('itunes.apple.com')) {
            searchLink = urls.atisketSearch.byAppleMusicUrl(link.href);
        } else if (link.href.includes('spotify.com')) {
            searchLink = urls.atisketSearch.bySpotifyUrl(link.href);
        } else if (link.href.includes('deezer.com')) {
            searchLink = urls.atisketSearch.byDeezerUrl(link.href);
        } else {
            continue;
        }

        // Search for <br> to insert link
        let insertAfter: ChildNode = link;
        while (insertAfter.nextSibling && insertAfter.nextSibling.nodeName !== 'BR') {
            insertAfter = insertAfter.nextSibling;
        }

        insertAfter.after(
            ' [',
            <a target='_blank' href={searchLink}>a-tisket</a>,
            ']',
        );
    }
}

function addNameSearchLinks(): void {
    const releaseName = qs('h1 bdi').textContent!;
    const releaseArtist = qsa('p.subheader > a > bdi')
        .map((artist) => artist.textContent)
        .join(' & ');

    const query = `${releaseArtist} - ${releaseName}`;

    const insertUrls = [
        ['dc', urls.discogsSearch(query)],
        ['dd', urls.ddgSearch(query)],
        ['gg', urls.googleSearch(query)],
        ['eb', urls.ebaySearch(query)],
    ];
    const insertAnchors = insertUrls.map(([name, url]) =>
        <a target='_blank' href={url} style={{ background: 'none', padding: 0 }}>{name}</a>);

    qs('p.subheader').append(' [', ...insertBetween(insertAnchors, '|'), ']');
}

export function addLinks(): void {
    /*addBarcodeSearchLinks();
    addCatNoSearchLinks();
    addImageSearchLinks();
    addStreamingUrlLinks();
    addNameSearchLinks();*/
}
