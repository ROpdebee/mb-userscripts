import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const mbPagesWithWorkCodeInput = [
    '*/edit',
    '*/edit?*',
    'release/*/edit-relationships',
    'release/*/edit-relationships?*',
    '*/create',
    '*/create?*',
].map((path) => transformMBMatchURL(path));

const metadata: UserscriptMetadata = {
    name: 'MB: Bulk copy-paste work codes',
    description: 'Copy work identifiers from various online repertoires and paste them into MB works with ease.',
    'run-at': 'document-end',
    match: [
        ...mbPagesWithWorkCodeInput,
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
