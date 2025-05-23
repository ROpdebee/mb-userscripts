/**
 * Userscript metadata helpers.
 */

export interface UserscriptCustomMetadata {
    'name': string;
    'description': string;
    'match': string | readonly string[];
    'exclude'?: string | readonly string[];
    'require'?: string | readonly string[];
    // https://wiki.greasespot.net/Metadata_Block#.40run-at
    'run-at'?: 'document-end' | 'document-idle' | 'document-start';
    'grant'?: string | readonly string[];
    'connect'?: string | readonly string[];
    'resource'?: string | readonly string[];
    'blurb': string;
}

export interface UserscriptDefaultMetadata {
    author: string;
    license?: string;
    namespace: string;
    homepageURL: string;
    supportURL: string;
    downloadURL: string;
    updateURL: string;
}

export type UserscriptMetadata = Partial<UserscriptDefaultMetadata> & UserscriptCustomMetadata;
export type AllUserscriptMetadata = UserscriptCustomMetadata & UserscriptDefaultMetadata & { version: string };

export function transformMBMatchURL(requireString: string): string {
    return `*://*.musicbrainz.org/${requireString}`;
}

/** Any pages on which edits can occur */
export const MB_EDIT_PAGE_PATHS = [
    'edit/*',
    // <entity>/<entity_id>/edits, user/<username>/edits/open, search/edits?condition.0=..., ...
    // TODO: This also matches /search/edits, on which no edits are shown. Should somehow be excluded
    '*/edits*',
    'user/*/votes',
    '*/open_edits',
];
