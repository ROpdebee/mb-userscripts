import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Display CAA image dimensions',
    description: 'Displays the dimensions and size of images in the cover art archive.',
    'run-at': 'document-start',
    match: [
        'release/*',
        'edit/*',  // Cover art in edit history
        'search/edits/*',
        'release-group/*',
    ].map(transformMBMatchURL),
    exclude: [
        transformMBMatchURL('release/*/edit'),
        transformMBMatchURL('release/*/edit-relationships'),
        transformMBMatchURL('release-group/*/edit'),
    ],
};

export default metadata;
