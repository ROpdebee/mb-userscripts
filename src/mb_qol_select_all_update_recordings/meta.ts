import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: QoL: Select All Update Recordings',
    description: 'Add buttons to release editor to select all "Update recordings" checkboxes.',
    'run-at': 'document-idle',
    match: [
        'release/*/edit',
        'release/*/edit?*',
        'release/add*',
    ].map((path) => transformMBMatchURL(path)),
    blurb: 'Add buttons to release editor to select all "Update recordings" checkboxes. Differs from the built-in "Select All" checkboxes in that it doesn\'t lock the checkboxes to a given state, enabling you to deselect some checkboxes.',
};

export default metadata;
