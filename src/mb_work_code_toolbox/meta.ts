import type { UserscriptMetadata } from '@lib/util/metadata';
import { createMBRegex as mb, createURLRuleRegex, MB_EDIT_DISPLAY_PAGE_PATTERNS, MB_EDITABLE_ENTITIES, MBID_REGEX_PART as mbid } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Work code toolbox',
    description: 'Copy work identifiers from various online repertoires and paste them into MB works with ease. Validate work code formatting: Highlight invalid or ill-formatted codes.',
    'run-at': 'document-end',
    include: [
        // Work code input
        // Edit and creation pages, either works themselves or another entity linked to works (via embedded iframe)
        mb`(${MB_EDITABLE_ENTITIES.join('|')})/(create|${mbid}/edit)`,
        // Relationship editor via embedded iframe
        mb`release/${mbid}/edit-relationships`,

        // Work code display, for validation
        // Any page that displays edits
        ...MB_EDIT_DISPLAY_PAGE_PATTERNS,
        // Any work tab (overlaps with a previous match though)
        mb`work/${mbid}/.+`,
        // Collections of works.
        mb`collection/${mbid}`,
        // Table of works to which author is related.
        mb`artist/${mbid}/works`,

        // Repertoires
        createURLRuleRegex('online.gema.de', /werke\/search\.faces/),
        // We need to match the index page of ISWCNet too, it's a single-page
        // application and the userscript may not get loaded after solving the
        // captcha.
        createURLRuleRegex('iswcnet.cisac.org', /.*/),
    ],
    grant: [
        'GM.getValue',
        'GM.setValue',
        'GM.deleteValue',
    ],
};

export default metadata;
