// ==UserScript==
// @name         MB: QoL: Paste multiple external links at once
// @version      2021.9.19
// @description  Enables pasting multiple links, separated by whitespace, into the external link editor.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_multi_external_links.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_multi_external_links.user.js
// @match        *://*.musicbrainz.org/*/edit
// @match        *://musicbrainz.org/*/edit
// @run-at       document-end
// ==/UserScript==

const noSplitCboxHtml = `
    <div id="ROpdebee_no_split_cont">
        <input type="checkbox" id="ROpdebee_no_split">
        <label for="ROpdebee_no_split">Don't split links</label>
    </div>`

function addInputHandler() {
    let inp = document.querySelector('#external-links-editor > tbody > tr.external-link-item:last-child input');
    // React might still be initializing, retry soon
    if (!inp) {
        return setTimeout(addInputHandler, 100);
    }

    let existingCboxCont = document.querySelector('#ROpdebee_no_split_cont');
    if (existingCboxCont) {
        inp.insertAdjacentElement('afterend', existingCboxCont);
    } else {
        inp.insertAdjacentHTML('afterend', noSplitCboxHtml);
    }
    inp.addEventListener('input', handleLinkInput);
}

function getExtLinksEditor() {
    // Can be found in the MB object, but depends on actual page.
    // Release editor:
    if (typeof MB.releaseEditor !== 'undefined') {
        return MB.releaseEditor.externalLinks;
    }

    // Other edit pages, confirmed to exist on artists and labels, probably
    // others as well
    return MB.sourceExternalLinksEditor;
}

function handleLinkInput(evt) {
    let target = evt.currentTarget;

    // Queued for execution after we've split the links
    setTimeout(() => {
        // Remove ourselves from this element and add ourselves to the new empty
        // input, in case new links will be pasted. The current event target
        // doesn't exist anymore/was repurposed to store a pasted link.
        target.removeEventListener('input', handleLinkInput);
        addInputHandler();
    }, 100);

    if (document.querySelector('#ROpdebee_no_split').checked) return;

    let links = target.value.trim().split(/\s+/);

    // No need to split the input if there's only one link.
    if (links.length <= 1) return;

    // Don't let the link editor handle multi-link inputs.
    evt.stopPropagation();

    // We'll retrieve the React component to feed it the links directly, rather
    // than changing the input's value and dispatching events. Reason being
    // that dispatching events doesn't seem to work. Not sure why, probably due
    // to React.
    let tbody = getExtLinksEditor()._reactInternals.child.child;

    links.forEach((link) => {
        // Get the ExternalLink React component. Need to do this again for each
        // link since it changes whenever we add a new one.
        let extLink = tbody.child;
        // Need to get the *last* ExternalLink, this is where we're inputting.
        while (extLink.sibling) {
            extLink = extLink.sibling;
        }

        // Normally called on change events, stores the link in some internal
        // state.
        extLink.memoizedProps.handleUrlChange(link);
        // Normally called on blur events, to finalise the link.
        // Fake event, just needs those props.
        extLink.memoizedProps.handleUrlBlur({ currentTarget: { value: link } });
    });
}

// This element should be present even before React is initialized. Checking
// for its existence enables us to skip attempting to find the link input on
// edit pages that don't have external links, without having to exclude
// specific pages.
let cont = document.querySelector('#external-links-editor-container');
if (cont) {
    addInputHandler();
}
