import type { UserscriptMetadata } from '@lib/util/metadata';
import { transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    // FIXME: This name isn't very descriptive.
    name: 'MB: QoL: Inline all recordings\' tracks on releases',
    description: 'Display all tracks and releases on which a recording appears from the release page.',
    'run-at': 'document-end',
    match: transformMBMatchURL('release/*'),
    exclude: [
        transformMBMatchURL('release/add'),
        transformMBMatchURL('release/*/edit*'),
    ],
};

export default metadata;
