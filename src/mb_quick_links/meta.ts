import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Quick Links',
    description: 'Insert quick links in release pages.',
    'run-at': 'document-end',
    match: [
        'release/*',
    ].map((path) => transformMBMatchURL(path)),
    blurb: 'Insert quick links in release pages.',
};

export default metadata;
