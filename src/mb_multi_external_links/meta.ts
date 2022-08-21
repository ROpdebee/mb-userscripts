import type { UserscriptMetadata } from '@lib/util/metadata';
import { createMBRegex as mb, MB_EDITABLE_ENTITIES, MBID_REGEX_PART as mbid } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: QoL: Paste multiple external links at once',
    description: 'Enables pasting multiple links, separated by whitespace, into the external link editor.',
    'run-at': 'document-end',
    include: [
        mb`(${MB_EDITABLE_ENTITIES.join('|')})/(add|create|${mbid}/edit)`,
        mb`release/${mbid}/edit-relationships`,
    ],
};

export default metadata;
