import type { UserscriptMetadata } from '@lib/util/metadata';
import { MB_EDIT_PAGE_PATHS, transformMBMatchURL } from '@lib/util/metadata';

const metadata: UserscriptMetadata = {
    name: 'MB: Blind Votes',
    description: 'Blinds editor details before your votes are cast.',
    // FIXME: This should run at document-start to ensure that editor details
    // don't flash onto the screen while the page is still loading.
    'run-at': 'document-end',
    match: MB_EDIT_PAGE_PATHS.map((path) => transformMBMatchURL(path)),
};

export default metadata;
