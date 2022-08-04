import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Simple Batch Edits',
    description: 'Perform simple entity edits in batch.',
    'run-at': 'document-start',
    match: [
        'artist/*/recordings',
        'artist/*/recordings?*',
    ].map((path) => transformMBMatchURL(path)),
};

export default metadata;
