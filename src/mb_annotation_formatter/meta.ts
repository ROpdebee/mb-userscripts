import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Annotation Formatter',
    description: 'Annotation formatting made easy. Automatically formats URLs on paste, etc.',
    'run-at': 'document-end',
    match: [
        '*/edit_annotation',
        '*/edit_annotation?*',
    ].map((path) => transformMBMatchURL(path)),
};

export default metadata;
