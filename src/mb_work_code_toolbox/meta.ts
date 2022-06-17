import type { UserscriptMetadata } from '@lib/util/metadata';
import { MB_EDIT_PAGE_PATHS, transformMBMatchURL } from '@lib/util/metadata';

const mbPagesWithWorkCodeInput = [
    '*/edit',
    '*/edit?*',
    'release/*/edit-relationships',
    'release/*/edit-relationships?*',
    '*/create',
    '*/create?*',
].map((path) => transformMBMatchURL(path));

const mbPagesWithWorkCodesDisplayed = [
    // Any edit page can display work codes
    ...MB_EDIT_PAGE_PATHS,
    // Works themselves, of course
    'work/*',
    // Collections of works
    'collection/*',
    // Table of works to which artist is related.
    'artist/*/works*',
].map((path) => transformMBMatchURL(path));

const metadata: UserscriptMetadata = {
    name: 'MB: Work code toolbox',
    description: 'Copy work identifiers from various online repertoires and paste them into MB works with ease. Validate work code formatting: Highlight invalid or ill-formatted codes.',
    'run-at': 'document-end',
    match: [
        ...mbPagesWithWorkCodeInput,
        ...mbPagesWithWorkCodesDisplayed,
        'https://online.gema.de/werke/search.faces*',
        'https://iswcnet.cisac.org/*',
    ],
    grant: [
        'GM.getValue',
        'GM.setValue',
        'GM.deleteValue',
    ],
};

export default metadata;
