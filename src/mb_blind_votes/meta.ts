import type { UserscriptMetadata } from 'userscriptMetadata.js';

import { transformMBMatchURL } from '../lib/util/metadata.js';

const metadata: UserscriptMetadata = {
    name: 'MB: Blind votes',
    version: '2021.3.30',
    description: 'Blinds editor details before your votes are cast.',
    'run-at': 'document-body',
    match: transformMBMatchURL('*'),
};

export default metadata;
