// istanbul ignore file: Better suited for E2E test.

import type { ExternalLinks } from '@lib/MB/types';
import { LOGGER } from '@lib/logging/logger';
import { assertHasValue } from '@lib/util/assert';
import { logFailure, retryTimes } from '@lib/util/async';
import { createPersistentCheckbox } from '@lib/util/checkboxes';
import { onAddEntityDialogLoaded, qsa, qsMaybe, setInputValue } from '@lib/util/dom';


function getExternalLinksEditor(mbInstance: typeof window.MB): ExternalLinks {
    // Can be found in the MB object, but exact property depends on actual page.
    const editor = (mbInstance.releaseEditor?.externalLinks ?? mbInstance.sourceExternalLinksEditor)?.externalLinksEditorRef.current;
    assertHasValue(editor, 'Cannot find external links editor object');
    return editor;
}

function getLastInput(editor: ExternalLinks): HTMLInputElement {
    const linkInputs = qsa<HTMLInputElement>('input.value', editor.tableRef.current);
    return linkInputs[linkInputs.length - 1];
}

function submitUrls(editor: ExternalLinks, urls: string[]): void {
    // Technically we're recursively calling the patched methods, but the
    // patched methods just pass through to the originals when there's only
    // one link.
    if (urls.length === 0) return;

    const lastInput = getLastInput(editor);

    LOGGER.debug(`Submitting URL ${urls[0]}`);
    setInputValue(lastInput, urls[0]);
    // Need to wait a while before the input event is processed before we can
    // fire the blur event, otherwise things get messy.
    setTimeout(() => {
        lastInput.dispatchEvent(new Event('focusout', { bubbles: true }));
        submitUrls(editor, urls.slice(1));
    });
}

const Patcher = {
    urlQueue: [] as string[],

    patchOnBlur(editor: ExternalLinks, originalOnBlur: ExternalLinks['handleUrlBlur']): ExternalLinks['handleUrlBlur'] {
        // Accepting and passing arguments as array to prevent potential problems
        // when the signature of the patched methods change.
        return (...args) => {
            // onchange should have removed the other URLs and queued them in the urlQueue.
            originalOnBlur(...args);

            // Paste each link in the URL queue one-by-one.
            submitUrls(editor, this.urlQueue);
            this.urlQueue = [];
        };
    },

    patchOnChange(originalOnBlur: ExternalLinks['handleUrlChange']): ExternalLinks['handleUrlChange'] {
        // Like above, we won't make too many assumptions about the signature
        // of `onUrlBlur`.
        return (...args) => {
            // Split the URLs and only feed the first URL into actual handler. This
            // is to prevent it from performing any cleanup or relationship type
            // inference that doesn't make sense.
            // We'll feed the other URLs one-by-one separately later on the blur event.
            // However, we need to "remember" those URLs, as the original handler
            // seems to assign the input value and we'll lose the rest of the URLs.
            const rawUrl = args[2];
            LOGGER.debug(`onchange received URLs ${rawUrl}`);
            args = [...args]; // Copy, prevent modifying original argument list.
            try {
                const splitUrls = rawUrl.trim().split(/\s+/);
                this.urlQueue = splitUrls.slice(1);
                // Take care to retain the rest of the arguments, the signature could
                // change in a server update and we want to avoid feeding the
                // wrong data.
                if (splitUrls.length > 1) {
                    args[2] = splitUrls[0];
                }
            } catch (err) {
                LOGGER.error('Something went wrong. onUrlBlur signature change?', err);
            }
            originalOnBlur(...args);
        };
    },
};

interface LinkSplitter {
    enable(): void;
    disable(): void;
    toggle(): void;
    setEnabled(enabled: boolean): void;
}

function createLinkSplitter(editor: ExternalLinks): LinkSplitter {
    const originalOnBlur = editor.handleUrlBlur.bind(editor);
    const originalOnChange = editor.handleUrlChange.bind(editor);

    const patchedOnBlur = Patcher.patchOnBlur(editor, originalOnBlur);
    const patchedOnChange = Patcher.patchOnChange(originalOnChange);

    return {
        enable(): void {
            LOGGER.debug('Enabling link splitter');
            editor.handleUrlBlur = patchedOnBlur;
            editor.handleUrlChange = patchedOnChange;
        },
        disable(): void {
            LOGGER.debug('Disabling link splitter');
            editor.handleUrlBlur = originalOnBlur;
            editor.handleUrlChange = originalOnChange;
        },
        setEnabled(enabled: boolean): void {
            if (enabled) {
                this.enable();
            } else {
                this.disable();
            }
        },
        toggle(): void {
            this.setEnabled(editor.handleUrlBlur === originalOnBlur);
        },
    };
}

function insertCheckboxElements(editor: ExternalLinks, checkboxElmt: HTMLInputElement, labelElmt: HTMLLabelElement): void {
    // Adding the checkbox beneath the last input element would require constantly
    // removing and reinserting while react re-renders the link editor. Instead,
    // let's just add it outside of the table and align it with JS.
    editor.tableRef.current.after(checkboxElmt, labelElmt);
    const lastInput = getLastInput(editor);
    const marginLeft = lastInput.offsetLeft + (lastInput.parentElement?.offsetLeft ?? 0);
    checkboxElmt.style.marginLeft = `${marginLeft}px`;
}

async function run(windowInstance: Window): Promise<void> {
    // This element should be present even before React is initialized. Checking
    // for its existence enables us to skip attempting to find the link input on
    // edit pages that don't have external links, without having to exclude
    // specific pages.
    const editorContainer = qsMaybe<HTMLElement>('#external-links-editor-container', windowInstance.document);
    if (!editorContainer) return;

    // We might be running before the release editor is loaded, so retry a couple of times
    // until it is. We could also just have a different @run-at or listen for the window
    // load event, but if the page takes an extraordinary amount to load e.g. an image,
    // the external links editor may be ready long before we run. We want to add our
    // functionality as soon as possible without waiting for the whole page to load.
    const editor = await retryTimes(() => getExternalLinksEditor(windowInstance.MB), 100, 50);
    const splitter = createLinkSplitter(editor);
    const [checkboxElmt, labelElmt] = createPersistentCheckbox('ROpdebee_multi_links_no_split', "Don't split links", () => {
        splitter.toggle();
    });
    splitter.setEnabled(!checkboxElmt.checked);
    insertCheckboxElements(editor, checkboxElmt, labelElmt);
}

function onIframeAdded(iframe: HTMLIFrameElement): void {
    LOGGER.debug(`Initialising on iframe ${iframe.src}`);

    onAddEntityDialogLoaded(iframe, () => {
        logFailure(run(iframe.contentWindow!));
    });
}

// Observe for additions of embedded entity creation dialogs and run the link
// splitter on those as well.
function listenForIframes(): void {
    const iframeObserver = new MutationObserver((mutations) => {
        for (const addedNode of mutations.flatMap((mut) => [...mut.addedNodes])) {
            if (addedNode instanceof HTMLElement && addedNode.classList.contains('iframe-dialog')) {
                // Addition of a dialog: Get the iframe and run the splitter
                const iframe = qsMaybe<HTMLIFrameElement>('iframe', addedNode);

                if (iframe) {
                    onIframeAdded(iframe);
                }
            }
        }
    });

    iframeObserver.observe(document, {
        subtree: true,
        childList: true,
    });
}

logFailure(run(window));

listenForIframes();
