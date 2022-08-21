import type { UserscriptMetadata } from '@lib/util/metadata';
import { MB_EDIT_DISPLAY_PAGE_PATTERNS } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Supercharged Cover Art Edits',
    description: 'Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.',
    'run-at': 'document-end',
    include: MB_EDIT_DISPLAY_PAGE_PATTERNS,
    require: [
        'https://cdn.jsdelivr.net/npm/resemblejs@4.1.0/resemble.min.js',
        'https://cdn.jsdelivr.net/npm/moment@2.29.3/min/moment-with-locales.min.js',
        'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js',
        'https://cdn.jsdelivr.net/npm/jquery-ui-dist@1.13.1/jquery-ui.min.js',
    ],
};

export default metadata;
