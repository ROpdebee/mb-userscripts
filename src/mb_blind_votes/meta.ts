import type { UserscriptMetadata } from 'userscriptMetadata.js';

import { transformMBMatchURL } from '../lib/util/metadata.js';

const metadata: UserscriptMetadata = {
    name: 'MB: Blind votes',
    version: '2021.3.30',
    description: 'Blinds editor details before your votes are cast.',
    'run-at': 'document-body',
    match: [
        'edit/*',           // Single edit pages + certain edit lists
        '*/open_edits',     // Entity open edits
        '*/edits*',         // Entity edit history + search edits
        '*/votes',          // User votes
    ].map(transformMBMatchURL),
    exclude: transformMBMatchURL('search/edits'), // Bare edit search
};

export default metadata;
