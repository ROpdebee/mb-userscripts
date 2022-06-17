import type { UserscriptMetadata } from '@lib/util/metadata';
import { MB_EDIT_PAGE_PATHS, transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Supercharged Cover Art Edits',
    description: 'Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.',
    'run-at': 'document-end',
    match: [
        ...MB_EDIT_PAGE_PATHS,
    ].map((path) => transformMBMatchURL(path)),
    require: [
        'https://github.com/rsmbl/Resemble.js/raw/v3.2.4/resemble.js',
        'https://momentjs.com/downloads/moment-with-locales.min.js',
    ],
};

export default metadata;
