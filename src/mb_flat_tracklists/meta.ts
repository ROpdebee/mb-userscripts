import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Flat Tracklists',
    description: 'Flatten tracklists to ease side-by-side release comparisons',
    'run-at': 'document-end',
    match: [
        'release/*', // TODO: Use regular expression to exclude sub-pages
    ].map((path) => transformMBMatchURL(path)),
};

export default metadata;
