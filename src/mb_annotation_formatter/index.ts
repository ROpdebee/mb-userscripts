import { logFailure } from '@lib/util/async';
import { qsa } from '@lib/util/dom';

const URL_REGEX = /https?:\/\/\S+/g;
const MBID_REGEX = /^[a-f\d-]{36}$/;

function formatURIWithTitle(uri: string, title?: string | null): string {
    return title ? `[${uri}|${title}]` : `[${uri}]`;
}

async function getEntityTitle(entityType: string, mbid: string): Promise<string | undefined> {
    const resp = await fetch(`/ws/2/${entityType}/${mbid}?fmt=json`);
    const json = await resp.json() as { title?: string; name?: string };
    return json.title ?? json.name;
}

async function rewriteURL(url: string, title?: string | null): Promise<string> {
    let urlObj: URL;
    try {
        urlObj = new URL(url);
    } catch {
        return url;
    }

    if (!(urlObj.hostname === 'musicbrainz.org' || urlObj.hostname.endsWith('.musicbrainz.org'))) {
        return formatURIWithTitle(url, title);
    }

    const [entityType, mbid] = urlObj.pathname.split('/').slice(1);
    if (!entityType || !mbid || !MBID_REGEX.test(mbid)) {
        return formatURIWithTitle(url, title);
    }

    const urn = `${entityType}:${mbid}`;
    // Use supplied title if any, otherwise load it
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    title = title || (await getEntityTitle(entityType, mbid));
    if (!title) {
        // Couldn't load title for some reason
        // TODO: Logging.
        return url;
    }
    return formatURIWithTitle(urn, title);
}

async function replaceRawUrls(text: string): Promise<string> {
    let newText = '';
    let lastIndex = 0;

    // `String#matchAll` does not return overlapping matches, e.g.
    // https://web.archive.org/web/https://example.com/ matches only once.
    for (const match of text.matchAll(URL_REGEX)) {
        // Anything that the regex skipped between the previous iteration and
        // this one is not a URL, so needs to be added literally.
        newText += text.slice(lastIndex, match.index);

        // Add the rewritten URL to the new text.
        const replacement = await rewriteURL(match[0]);
        newText += replacement;

        // For the next literal chunk
        lastIndex = match.index! + match[0].length;
    }

    // There may be text trailing the URL, add that last chunk too.
    newText += text.slice(lastIndex);

    return newText;
}

async function replaceHTMLURLs(htmlText: string): Promise<string> {
    // DOMParser cannot parse partial snippets. Parse it by injecting it into a
    // fake div.
    const div = document.createElement('div');
    // eslint-disable-next-line no-unsanitized/property -- Fine, we're not going to insert it into the DOM.
    div.innerHTML = htmlText;

    // Replace the text in the anchors with the formatted text, later we'll be
    // able to extract the full text from the div we just created.
    for (const anchor of qsa<HTMLAnchorElement>('a', div)) {
        anchor.textContent = await rewriteURL(anchor.href, anchor.textContent);
    }

    return div.textContent!;
}

function formatURLs(htmlText: string, text: string): Promise<string> {
    if (!htmlText) {
        return replaceRawUrls(text);
    }

    return replaceHTMLURLs(htmlText);
}

async function handleOnPaste(event: ClipboardEvent): Promise<void> {
    const htmlText = event.clipboardData!.getData('text/html');
    const text = event.clipboardData!.getData('text');

    // Prevent the browser from pasting, we'll do it ourselves.
    event.preventDefault();
    const textarea = event.target as HTMLTextAreaElement;
    // Disable the textarea while we're formatting the text.
    textarea.disabled = true;

    try {
        const replacementText = await formatURLs(htmlText, text);

        // If the user selected stuff, replace it. If the user hasn't selected any
        // text, this will "replace" a zero-length string where the cursor is.
        const textBefore = textarea.value.slice(0, textarea.selectionStart);
        const textAfter = textarea.value.slice(textarea.selectionEnd);
        textarea.value = textBefore + replacementText + textAfter;
    } finally {
        textarea.disabled = false;
    }
}

function attachListeners(textarea: HTMLTextAreaElement): void {
    textarea.addEventListener('paste', (evt) => {
        logFailure(handleOnPaste(evt));
    });
}

// eslint-disable-next-line unicorn/prefer-query-selector -- ID contains dots.
attachListeners(document.getElementById('id-edit-annotation.text') as HTMLTextAreaElement);
