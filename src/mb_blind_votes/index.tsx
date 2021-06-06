import blindCss from './blind.css';

function setupStyle(): void {
    document.head.append(<style id='ROpdebee_blind_votes'>{blindCss}</style>);
}

function setupUnblindListeners(): void {
    document.querySelector('input[name^="enter-vote.vote"]:not([id$="-None"])')
        ?.addEventListener('change', (evt: Readonly<Event>) => {
            const target = evt.currentTarget as HTMLInputElement;
            target
                .closest('div.edit-list')
                ?.classList.add('unblind');
            // Make sure we also add .unblind to the content div on edit lists
            // otherwise the CSS rules for the edit page still apply.
            target
                .closest('div#content')
                ?.classList.add('unblind');
        });

    document.querySelector('input[name^="enter-vote.vote"][id$="-None"]')
        ?.addEventListener('change', (evt: Readonly<Event>) => {
            (evt.currentTarget as HTMLInputElement)
                .closest('div.edit-list, div#content')
                ?.classList.remove('unblind');
        });
}

setupStyle();
setupUnblindListeners();
// Unblind any edits that aren't open, are your own, or on which you already voted
document.addEventListener('DOMContentLoaded', () => {
    setupUnblindListeners();
    const unblindEdits = document.querySelectorAll(`
        div.edit-header:not(.open),
        div.cancel-edit > a.negative[href*="/cancel"],
        input[name^="enter-vote.vote"]:checked:not([id$="-None"])`);
    Array.from(unblindEdits)
        .forEach((edit) => edit.closest('div.edit-list')?.classList.add('unblind'));
    Array.from(unblindEdits)
        .forEach((edit) => edit.closest('div#content')?.classList.add('unblind'));
});
