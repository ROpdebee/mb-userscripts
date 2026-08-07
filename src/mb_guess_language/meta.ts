import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Guess language and script',
    description: 'Guess language and script from release tracklist',
    'run-at': 'document-end',
    match: [
        'release/add',
        'release/add?*',
        'release/*/edit',
        'release/*/edit?*',
    ].map((path) => transformMBMatchURL(path)),
};

export default metadata;
