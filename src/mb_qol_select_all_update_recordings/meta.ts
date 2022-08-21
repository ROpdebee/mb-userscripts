import type { UserscriptMetadata } from '@lib/util/metadata';
import { createMBRegex as mb, MBID_REGEX_PART as mbid } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: QoL: Select All Update Recordings',
    description: 'Add buttons to release editor to select all "Update recordings" checkboxes.',
    'run-at': 'document-idle',
    include: mb`release/(add|${mbid}/edit)`,
};

export default metadata;
