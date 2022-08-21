import type { UserscriptMetadata } from '@lib/util/metadata';
import { createMBRegex as mb, MBID_REGEX_PART as mbid } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: QoL: Seed the batch recording comments script',
    description: 'Seed the recording comments for the batch recording comments userscripts with live and DJ-mix data.',
    'run-at': 'document-end',
    include: mb`release/${mbid}`,
};

export default metadata;
