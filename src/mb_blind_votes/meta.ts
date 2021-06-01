import { transformMBRequires } from '../lib/util/metadata.js';

import type { UserscriptMetadata } from 'userscriptMetadata.js';

export default {
    name: 'MB: Blind votes',
    version: '2021.3.30',
    description: 'Blinds editor details before your votes are cast.',
    'run-at': 'document-body',
    match: transformMBRequires('*'),
} as UserscriptMetadata;
