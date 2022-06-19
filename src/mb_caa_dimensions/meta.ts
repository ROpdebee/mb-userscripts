import type { UserscriptMetadata } from '@lib/util/metadata';
import { createMBRegex as mb, MB_EDIT_DISPLAY_PAGE_PATTERNS, MBID_REGEX_PART as mbid } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Display CAA image dimensions',
    description: 'Displays the dimensions and size of images in the cover art archive.',
    'run-at': 'document-start',
    include: [
        ...MB_EDIT_DISPLAY_PAGE_PATTERNS,
        mb`release(-group)?/${mbid}(/.+?)?`,
    ],
    exclude: [
        mb`release(-group)?/${mbid}/edit`,
        mb`release-group/${mbid}/edit-relationships`,
    ],
};

export default metadata;
