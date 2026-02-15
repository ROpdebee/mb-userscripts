// istanbul ignore file: Better suited for E2E test.

import { LOGGER } from '@lib/logging/logger';
import { assert } from '@lib/util/assert';
import { asyncSleep, logFailure, retryTimes } from '@lib/util/async';
import { createPersistentCheckbox } from '@lib/util/checkboxes';
import { onAddEntityDialogLoaded, onDOMNodeAdded, qs, qsMaybe, setInputValue } from '@lib/util/dom';

class ExternalLinksEditor {
    public readonly element: HTMLTableElement;

    public constructor(element: HTMLTableElement) {
        this.element = element;
    }

    public static async create(thisWindow: Window): Promise<ExternalLinksEditor> {
        // We might be running before the release editor is loaded, so retry a couple of times
        // until it is. We could also just have a different @run-at or listen for the window
        // load event, but if the page takes an extraordinary amount to load e.g. an image,
        // the external links editor may be ready long before we run. We want to add our
        // functionality as soon as possible without waiting for the whole page to load.
        const editor = await retryTimes(
            () => qs<HTMLTableElement>('#external-links-editor', thisWindow.document),
            100, 50);
        return new ExternalLinksEditor(editor);
    }

    public get urlInput(): HTMLInputElement {
        return qs('tr:last-child input[type="url"]', this.element);
    }
}

class LinkSplitter {
    private readonly editor: ExternalLinksEditor;
    private enabled = false;
    private readonly hookedInputs = new Set<HTMLInputElement>();

    public constructor(editor: ExternalLinksEditor) {
        this.editor = editor;
        this.hookInput(editor.urlInput);
        onDOMNodeAdded(editor.element, 'tr input[type="url"]', this.hookInput.bind(this));
    }

    private hookInput(input: HTMLInputElement): void {
        LOGGER.debug(`Hooking input ${input.dataset.index}`);
        // Note that it is possible for multiple input elements to be active at the same time,
        // and all of them should be hooked.
        if (this.hookedInputs.has(input)) return;

        input.addEventListener('input', this.handleInput.bind(this));

        this.hookedInputs.add(input);
    }

    private handleInput(event: Event): void {
        if (!this.enabled) return;

        const thisInput = event.target as HTMLInputElement;
        const rawUrl = thisInput.value;
        LOGGER.debug(`onchange received URLs ${rawUrl}`);
        const splitUrls = rawUrl.split(/\s+/);

        // If there is just one URL, we don't need to do anything.
        // It's important we skip the subsequent processing, otherwise
        // we'll get into an infinite loop in this event handler (as it
        // will trigger itself).
        if (splitUrls.length <= 1) return;

        this.submitUrls(splitUrls, thisInput)
            .catch(logFailure('Something went wrong.'));
    }

    private async submitUrls(urls: string[], currentInput: HTMLInputElement): Promise<void> {
        // Enter the first URL via the current input, and the remaining URLs via the new input
        // field that will be created later. We "schedule" the remaining URLs for the next event
        // loop cycle to allow event handlers to run normally and insert that input field.

        for (const url of urls) {
            LOGGER.debug(`Submitting URL ${url} into input ${currentInput.dataset.index}`);
            setInputValue(currentInput, url);
            currentInput.focus();

            // This causes us to wait until the next cycle, at which point a new input
            // element should have been added.
            await asyncSleep();
            currentInput = this.editor.urlInput;
            assert(currentInput.value === '', 'Expected input element to be empty!');
        }
    }

    public toggle(): void {
        this.enabled = !this.enabled;
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }
}

function insertCheckboxElements(editor: ExternalLinksEditor, checkboxElement: HTMLInputElement, labelElement: HTMLLabelElement): void {
    // Adding the checkbox beneath the last input element would require constantly
    // removing and reinserting while react re-renders the link editor. Instead,
    // let's just add it outside of the table and align it with JS.
    editor.element.after(checkboxElement, labelElement);
    const lastInput = editor.urlInput;
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

    const editor = await ExternalLinksEditor.create(windowInstance);
    const splitter = new LinkSplitter(editor);

    // TODO: Switch to ConfigProperty -- Needs event listeners on ConfigProperty.
    const [checkboxElement, labelElement] = createPersistentCheckbox('ROpdebee_multi_links_no_split', "Don't split links", () => {
        splitter.toggle();
    });
    splitter.setEnabled(!checkboxElement.checked);
    insertCheckboxElements(editor, checkboxElement, labelElement);
}

const INIT_IFRAMES = new Set<HTMLIFrameElement>();

function injectIntoIframe(iframe: HTMLIFrameElement): void {
    // the iframe observer triggers multiple times for the same iframe
    if (INIT_IFRAMES.has(iframe)) return;
    INIT_IFRAMES.add(iframe);

    LOGGER.debug(`Initialising on iframe ${iframe.src}`);

    onAddEntityDialogLoaded(iframe, () => {
        LOGGER.debug(`Iframe ${iframe.src} initialized`);
        run(iframe.contentWindow!).catch(logFailure());
    });
}

run(window).catch(logFailure());

// Observe for additions of embedded entity creation dialogs and run the link
// splitter on those as well.
onDOMNodeAdded(document, '.iframe-dialog iframe', injectIntoIframe);
