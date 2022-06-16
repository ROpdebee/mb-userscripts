import { assertNonNull } from '@lib/util/assert';
import { onDocumentLoaded, qsa } from '@lib/util/dom';

function setupStyle(): void {
    const style = document.createElement('style');
    style.id = 'ROpdebee_blind_votes';
    document.head.append(style);
    // Names and votes
    style.sheet!.insertRule(`
        /* Edit pages */
        div#content:not(.unblind) div.edit-header > p.subheader > a, /* Editor */
        div#content:not(.unblind) table.vote-tally tr:nth-child(n+3), /* Vote */
        div#content:not(.unblind) table.vote-tally tr:nth-child(n+3) a, /* Voter */
        div#content:not(.unblind) table.vote-tally tr:nth-child(1) td, /* Vote tally */
        div#content:not(.unblind) div.edit-notes h3 > a:not(.date), /* Edit note author */

        /* Edit lists */
        div.edit-list:not(.unblind) div.edit-header > p.subheader > a, /* Editor */
        div.edit-list:not(.unblind) div.edit-notes h3 > a:not(.date) /* Edit note author */
        {
            color: black;
            background-color: black;
        }`);
    // Profile images
    style.sheet!.insertRule(`
        /* Edit pages */
        div#content:not(.unblind) div.edit-header > p.subheader > a > img, /* Editor */
        div#content:not(.unblind) table.vote-tally th > a > img, /* Voter */
        div#content:not(.unblind) div.edit-notes h3 > a:not(.date) > img, /* Edit note author */
        div#content:not(.unblind) div.edit-notes h3 > div.voting-icon, /* Vote icon */

        /* Edit lists */
        div.edit-list:not(.unblind) div.edit-header > p.subheader > a > img, /* Editor */
        div.edit-list:not(.unblind) div.edit-notes h3 > a:not(.date) > img, /* Edit note author */
        div.edit-list:not(.unblind) div.edit-notes h3 > div.voting-icon /* Vote icon */
        {
            display: none;
        }`);
}

function onVoteSelected(evt: Event): void {
    // TODO: Don't we need to verify that the target is actually selected before
    // deciding to unblind? I think this is now relying on the order in which
    // events arrive.
    assertNonNull(evt.target);
    const target = evt.target as HTMLInputElement;
    target
        .closest('div.edit-list')
        ?.classList.add('unblind');
    // Make sure we also add .unblind to the content div on edit lists
    // otherwise the CSS rules for the edit page still apply.
    target
        .closest('div#content')
        ?.classList.add('unblind');
}

function onNoVoteSelected(evt: Event): void {
    assertNonNull(evt.target);
    const target = evt.target as HTMLInputElement;
    target
        .closest('div.edit-list, div#content')
        ?.classList.remove('unblind');
}

function setupUnblindListeners(): void {
    for (const voteButton of qsa<HTMLInputElement>('input[name^="enter-vote.vote"]:not([id$="-None"])')) {
        voteButton.addEventListener('change', onVoteSelected);
    }

    for (const noVoteButton of qsa<HTMLInputElement>('input[name^="enter-vote.vote"][id$="-None"]')) {
        noVoteButton.addEventListener('change', onNoVoteSelected);
    }
}

setupStyle();
// TODO: Why is this here? It's also on the document ready callback
setupUnblindListeners();

// Unblind any edits that aren't open, are your own, or on which you already voted
onDocumentLoaded(() => {
    setupUnblindListeners();

    const unblindEdits = qsa<HTMLElement>(`
        div.edit-header:not(.open),
        div.cancel-edit > a.negative[href*="/cancel"],
        input[name^="enter-vote.vote"]:checked:not([id$="-None"])`);

    for (const unblindEdit of unblindEdits) {
        unblindEdit
            .closest('div.edit-list')
            ?.classList.add('unblind');
        unblindEdit
            .closest('div#content')
            ?.classList.add('unblind');
    }
});
