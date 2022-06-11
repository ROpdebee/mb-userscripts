// istanbul ignore file: Better suited for E2E test.

import type { ExternalLinks } from '@lib/MB/types';
import { ConsoleSink } from '@lib/logging/consoleSink';
import { LogLevel } from '@lib/logging/levels';
import { LOGGER } from '@lib/logging/logger';
import { assertDefined } from '@lib/util/assert';
import { retryTimes } from '@lib/util/async';
import { createPersistentCheckbox } from '@lib/util/checkboxes';
import { qsa, qsMaybe, setInputValue } from '@lib/util/dom';

import DEBUG_MODE from 'consts:debug-mode';
import USERSCRIPT_ID from 'consts:userscript-id';

function getExternalLinksEditor(): ExternalLinks {
    // Can be found in the MB object, but exact property depends on actual page.
    const editor = (MB.releaseEditor?.externalLinks ?? MB.sourceExternalLinksEditor)?.current;
    assertDefined(editor, 'Cannot find external links editor object');
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
    lastInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
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
        return (index, isDupe, event, urlIndex, canMerge) => {
            // onchange should have removed the other URLs and queued them in the urlQueue.
            originalOnBlur(index, isDupe, event, urlIndex, canMerge);

            // Past each link in the URL queue one-by-one.
            submitUrls(editor, this.urlQueue);
            this.urlQueue = [];
        };
    },

    patchOnChange(originalOnBlur: ExternalLinks['handleUrlChange']): ExternalLinks['handleUrlChange'] {
        return (linkIndexes, urlIndex, rawUrl) => {
            // Split the URLs and only feed the first URL into actual handler. This
            // is to prevent it from performing any cleanup or relationship type
            // inference that doesn't make sense.
            // We'll feed the other URLs one-by-one separately later on the blur event.
            // However, we need to "remember" those URLs, as the original handler
            // seems to assign the input value and we'll lose the rest of the URLs.
            LOGGER.debug(`onchange received URLs ${rawUrl}`);
            const splitUrls = rawUrl.trim().split(/\s+/);
            this.urlQueue = splitUrls.slice(1);
            originalOnBlur(linkIndexes, urlIndex, splitUrls.length > 0 ? splitUrls[0] : rawUrl);
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

async function run(): Promise<void> {
    // This element should be present even before React is initialized. Checking
    // for its existence enables us to skip attempting to find the link input on
    // edit pages that don't have external links, without having to exclude
    // specific pages.
    const editorContainer = qsMaybe<HTMLElement>('#external-links-editor-container');
    if (!editorContainer) return;

    // We might be running before the release editor is loaded, so retry a couple of times
    // until it is. We could also just have a different @run-at or listen for the window
    // load event, but if the page takes an extraordinary amount to load e.g. an image,
    // the external links editor may be ready long before we run. We want to add our
    // functionality as soon as possible without waiting for the whole page to load.
    const editor = await retryTimes(getExternalLinksEditor, 100, 50);
    const splitter = createLinkSplitter(editor);
    const [checkboxElmt, labelElmt] = createPersistentCheckbox('ROpdebee_multi_links_no_split', "Don't split links", () => {
        splitter.toggle();
    });
    splitter.setEnabled(!checkboxElmt.checked);
    insertCheckboxElements(editor, checkboxElmt, labelElmt);
}

LOGGER.configure({
    logLevel: DEBUG_MODE ? LogLevel.DEBUG : LogLevel.INFO,
});
LOGGER.addSink(new ConsoleSink(USERSCRIPT_ID));

run()
    // TODO: Replace this by `logFailure`
    .catch((err) => {
        LOGGER.error('Something went wrong', err);
    });
