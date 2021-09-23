import css from './main.scss';
import { Edit, Vote } from '../lib/MB/DOM/Edit';
import { onDocumentLoaded } from '../lib/util/dom';

// Add unblind stylesheet
document.head.append(<style id='ROpdebee_blind_votes'>{css}</style>);

function blindEdit(edit: Edit) {
    edit.baseContainer.classList.remove('unblind');
}

function unblindEdit(edit: Edit) {
    edit.baseContainer.classList.add('unblind');
}

// Change blind status when a vote is changed.
Edit.onVoteChanged((edit: Edit) => {
    // We cannot use classList.toggle here, since a vote may have changed from
    // 'No' to 'Yes', both of which need to be unblinded.
    // eslint-disable-next-line init-declarations
    let blindToggler: (edit: Edit) => void;
    if (edit.myVote === Vote.NONE) {
        blindToggler = blindEdit;
    } else {
        blindToggler = unblindEdit;
    }

    blindToggler(edit);
});

// Unblind any edits that aren't open, are your own, or on which you already voted
onDocumentLoaded(() => {
    Edit.getEdits()
        .filter((edit) => edit.isOwnEdit || (!edit.isOpen) || edit.myVote !== Vote.NONE)
        .forEach(unblindEdit);
});
