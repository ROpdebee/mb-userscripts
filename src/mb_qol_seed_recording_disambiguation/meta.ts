import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: QoL: Seed the batch recording comments script',
    description: 'Seed the recording comments for the batch recording comments userscripts with live and DJ-mix data.',
    'run-at': 'document-end',
    match: transformMBMatchURL('release/*'),
    exclude: [
        transformMBMatchURL('release/add'),
        transformMBMatchURL('release/*/edit*'),
    ],
};

export default metadata;
