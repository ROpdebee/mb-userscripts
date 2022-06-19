import type { UserscriptMetadata } from '@lib/util/metadata';
import { createMBRegex as mb, createURLRuleRegex, MBID_REGEX_PART as mbid } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Enhanced Cover Art Uploads',
    description: 'Enhance the cover art uploader! Upload directly from a URL, automatically import covers from Discogs/Spotify/Apple Music/..., automatically retrieve the largest version, and more!',
    'run-at': 'document-end',
    include: [
        mb`release/${mbid}/add-cover-art`,
        mb`release/${mbid}/cover-art`,
        createURLRuleRegex('atisket.pulsewidth.org.uk/', /.*?/, { query: 'mandatory' }),
        createURLRuleRegex('etc.marlonob.info', /atisket\/.*?/, { query: 'mandatory' }),
        createURLRuleRegex('vgmdb.net', /album\/\d+/),
    ],
    grant: [
        'GM.xmlhttpRequest',
        // Used for some favicons
        'GM.getResourceURL',
    ],
    connect: '*',
    require: ['https://github.com/qsniyg/maxurl/blob/4b8661ee2d7a856dc6c4a9b910664584b397d45a/userscript.user.js?raw=true'],
    resource: ['amazonFavicon https://www.amazon.com/favicon.ico'],
};

export default metadata;
