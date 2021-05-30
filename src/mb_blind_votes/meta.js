const { transformMBRequires } = require('../lib/util/metadata');

module.exports = {
    name: 'MB: Blind votes',
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
