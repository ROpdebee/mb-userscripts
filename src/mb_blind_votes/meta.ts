import type { UserscriptMetadata } from '@lib/util/metadata';
import { MB_EDIT_DISPLAY_PAGE_PATTERNS } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Blind Votes',
    description: 'Blinds editor details before your votes are cast.',
    // FIXME: This should run at document-start to ensure that editor details
    // don't flash onto the screen while the page is still loading.
    'run-at': 'document-end',
    include: MB_EDIT_DISPLAY_PAGE_PATTERNS,
};

export default metadata;
