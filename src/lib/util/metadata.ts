/**
 * Userscript metadata helpers.
 */

/**
 * Customisable userscript metadata.
 */
export interface UserscriptCustomMetadata {
    /** Name of the script. */
    name: string;
    /** Script description. */
    description: string;
    /** Page matching rules, corresponding to `@match` stanzas. */
    match: readonly string[] | string;
    /** Page exclusion rules, corresponding to `@exclude` stanzas. */
    exclude?: readonly string[] | string;
    /** Other JS sources that are required to execute this script. */
    require?: readonly string[] | string;
    /**
     * When the script needs to run.
     * @see https://wiki.greasespot.net/Metadata_Block#.40run-at
     */
    'run-at'?: 'document-start' | 'document-end' | 'document-idle';
    /** GreaseMonkey APIs that need to be granted. */
    grant?: readonly string[] | string;
    /** Domains to which the script will connect. */
    connect?: readonly string[] | string;
    /** Resource URLs that the script needs. */
    resource?: readonly string[] | string;
    /** Short description to be rendered in the README. */
    blurb: string;
}

/**
 * Userscript metadata which has defaults provided.
 */
export interface UserscriptDefaultMetadata {
    /** Author of the script. */
    author: string;
    /** License of the script. */
    license?: string;
    /** Script namespace to prevent naming conflicts. */
    namespace: string;
    /** URL to script homepage. */
    homepageURL: string;
    /** URL to script support page. */
    supportURL: string;
    /** Direct URL to script sources. */
    downloadURL: string;
    /** URL to check for script updates. */
    updateURL: string;
}

/** Userscript metadata that can be set by the author. */
export type UserscriptMetadata = UserscriptCustomMetadata & Partial<UserscriptDefaultMetadata>;
/** All possible userscript metadata. */
export type AllUserscriptMetadata = UserscriptCustomMetadata & UserscriptDefaultMetadata & { version: string };

/**
 * Given a MusicBrainz relative path, create a match URL for this path.
 *
 * @example
 *   transformMBMatchURL("edit/") // -> *://*.musicbrainz.org/edit/
 *
 * @param      {string}  requireString  The relative path.
 * @return     {string}  Constructed match URL for the relative path on any MB
 *                       domain.
 */
export function transformMBMatchURL(requireString: string): string {
    return `*://*.musicbrainz.org/${requireString}`;
}

/** Any pages on which edits can occur. */
export const MB_EDIT_PAGE_PATHS = [
    'edit/*',
    // <entity>/<entity_id>/edits, user/<username>/edits/open, search/edits?condition.0=..., ...
    // TODO: This also matches /search/edits, on which no edits are shown. Should somehow be excluded
    '*/edits*',
    'user/*/votes',
    '*/open_edits',
];
