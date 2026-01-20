// istanbul ignore file: Better suited for E2E test.

import type { ExternalLinks } from '@lib/MB/types';
import { LOGGER } from '@lib/logging/logger';
import { assertHasValue } from '@lib/util/assert';
import { asyncSleep, logFailure, retryTimes } from '@lib/util/async';
import { createPersistentCheckbox } from '@lib/util/checkboxes';
import { onAddEntityDialogLoaded, qsa, qsMaybe, setInputValue } from '@lib/util/dom';

function getExternalLinksEditor(mbInstance: typeof window.MB): ExternalLinks {
    // Can be found in the MB object, but exact property depends on actual page.
    const editor = (mbInstance.releaseEditor?.externalLinks.externalLinksEditorRef ?? mbInstance.sourceExternalLinksEditor)?.current;
    assertHasValue(editor, 'Cannot find external links editor object');
    return editor;
}

function getLastInput(editor: ExternalLinks): HTMLInputElement {
    const linkInputs = qsa<HTMLInputElement>('input.value', editor.tableRef.current);
    return linkInputs.at(-1)!;
}

async function submitUrls(editor: ExternalLinks, urls: string[]): Promise<void> {
    // Technically we're recursively calling the patched methods, but the
    // patched methods just pass through to the originals when there's only
    // one link.
    if (urls.length === 0) return;

    const lastInput = getLastInput(editor);

    LOGGER.debug(`Submitting URL ${urls[0]}`);
    setInputValue(lastInput, urls[0]);
    // Need to wait a while before the input event is processed before we can
    // fire the blur event, otherwise things get messy.
    await asyncSleep();
    lastInput.dispatchEvent(new Event('focusout', { bubbles: true }));
    await submitUrls(editor, urls.slice(1));
}

class LinkSplitter {
    private readonly editor: ExternalLinks;
    private readonly originalOnChange: ExternalLinks['handleUrlChange'];
    private readonly patchedOnChange: ExternalLinks['handleUrlChange'];

    public constructor(editor: ExternalLinks) {
        this.editor = editor;
        this.originalOnChange = editor.handleUrlChange.bind(editor);

        // Accepting and passing arguments as array to prevent potential problems
        // when the signature of the patched methods change.
        this.patchedOnChange = (...arguments_): void => {
            // Split the URLs and submit all but the last URL into the actual
            // handlers separately. The last URL will be entered, but not
            // blurred.
            const rawUrl = arguments_[2];
            LOGGER.debug(`onchange received URLs ${rawUrl}`);
            const splitUrls = rawUrl.trim().split(/\s+/);

            // No links to split, just use the standard handlers.
            if (splitUrls.length <= 1) {
                this.originalOnChange(...arguments_);
                return;
            }

            const lastUrl = splitUrls.at(-1)!;
            const firstUrls = splitUrls.slice(0, -1);
            // Submit all but the last URL.
            submitUrls(editor, firstUrls)
                // Afterwards, enter the last URL, but don't submit it.
                .then(() => {
                    const lastInput = getLastInput(this.editor);
                    LOGGER.debug(`Submitting URL ${lastUrl}`);
                    setInputValue(lastInput, lastUrl);
                    lastInput.focus();
                })
                .catch(logFailure('Something went wrong. onUrlBlur signature change?'));
        };
    }

    public enable(): void {
        LOGGER.debug('Enabling link splitter');
        this.editor.handleUrlChange = this.patchedOnChange;
    }

    public disable(): void {
        LOGGER.debug('Disabling link splitter');
        this.editor.handleUrlChange = this.originalOnChange;
    }

    public toggle(): void {
        this.setEnabled(this.editor.handleUrlChange === this.originalOnChange);
    }

    public setEnabled(enabled: boolean): void {
        // eslint-disable-next-line sonarjs/no-selector-parameter
        if (enabled) {
            this.enable();
        } else {
            this.disable();
        }
    }
}

function insertCheckboxElements(editor: ExternalLinks, checkboxElement: HTMLInputElement, labelElement: HTMLLabelElement): void {
    // Adding the checkbox beneath the last input element would require constantly
    // removing and reinserting while react re-renders the link editor. Instead,
    // let's just add it outside of the table and align it with JS.
    editor.tableRef.current.after(checkboxElement, labelElement);
    const lastInput = getLastInput(editor);
    const marginLeft = lastInput.offsetLeft + (lastInput.parentElement?.offsetLeft ?? 0);
    checkboxElement.style.marginLeft = `${marginLeft}px`;
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
    const splitter = new LinkSplitter(editor);
    // TODO: Switch to ConfigProperty -- Needs event listeners on ConfigProperty.
    const [checkboxElement, labelElement] = createPersistentCheckbox('ROpdebee_multi_links_no_split', "Don't split links", () => {
        splitter.toggle();
    });
    splitter.setEnabled(!checkboxElement.checked);
    insertCheckboxElements(editor, checkboxElement, labelElement);
}

function onIframeAdded(iframe: HTMLIFrameElement): void {
    LOGGER.debug(`Initialising on iframe ${iframe.src}`);

    onAddEntityDialogLoaded(iframe, () => {
        run(iframe.contentWindow!).catch(logFailure());
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

run(window).catch(logFailure());

listenForIframes();
