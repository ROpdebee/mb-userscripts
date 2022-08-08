import { insertStylesheet } from '@lib/util/css';
import { onDocumentLoaded, onReactHydrated, qs, qsa } from '@lib/util/dom';

import css from './style.scss';

function stripNameVariations(): void {
    for (const nameVariation of qsa<HTMLAnchorElement>('.name-variation > a')) {
        const trackName = nameVariation.firstChild!.textContent!;
        const recordingName = nameVariation.lastChild!.textContent!;
        if (trackName === recordingName) continue; // jesus script not active?
        nameVariation.textContent = trackName;
        nameVariation.dataset.ROpdebee_flat_rec_name = recordingName;
    }
}

function restoreNameVariations(): void {
    for (const nameVariation of qsa<HTMLAnchorElement>('.name-variation > a')) {
        const recordingName = nameVariation.dataset.ROpdebee_flat_rec_name;
        if (!recordingName) continue;
        nameVariation.append(<br/>, recordingName);
    }
}

onDocumentLoaded(() => {
    insertStylesheet(css);
});

onReactHydrated(qs('.tracklist-and-credits'), function() {
    // Callback as a function instead of a lambda here because when nativejsx
    // transpiles the JSX below, it wraps it in a functions which it calls as
    // `.call(this)` (to inject the outer scope's this), but that produces rollup
    // warnings since `this` is not available at the top level.
    // TODO: Can we edit nativejsx to instead wrap it in a lambda? Then `this`
    // wouldn't need to be injected.

    const contentDiv = qs('#content');
    function onClick(): void {
        contentDiv.classList.toggle('ROpdebee_flat');
        const flattened = contentDiv.classList.contains('ROpdebee_flat');
        button.textContent = flattened ? 'Unflatten tracklist' : 'Flatten tracklist';
        if (flattened) {
            stripNameVariations();
        } else {
            restoreNameVariations();
        }
    }
    const button = <button className='btn-link' type='button' onClick={onClick}>
        Flatten tracklist
    </button>;

    qs('span#medium-toolbox')
        .firstChild?.before(button, ' | ');
});
