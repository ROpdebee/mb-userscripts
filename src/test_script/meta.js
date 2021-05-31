import { transformMBRequires } from '../lib/util/metadata.js';

export default {
    name: 'MB: Test userscript',
    version: '2021.3.30',
    description: 'Blinds editor details before your votes are cast.',
    'run-at': 'document-body',
    require: [
        'https://code.jquery.com/jquery-3.6.0.min.js',
    ],
    match: [
        'musicbrainz.org/*'
    ].flatMap(transformMBRequires),
};
