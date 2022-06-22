/**
 * Userscript metadata helpers.
 */

export interface UserscriptCustomMetadata {
    name: string;
    description: string;
    include: readonly string[] | string;
    exclude?: readonly string[] | string;
    require?: readonly string[] | string;
    // https://wiki.greasespot.net/Metadata_Block#.40run-at
    'run-at'?: 'document-start' | 'document-end' | 'document-idle';
    grant?: readonly string[] | string;
    connect?: readonly string[] | string;
    resource?: readonly string[] | string;
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

export type UserscriptMetadata = UserscriptCustomMetadata & Partial<UserscriptDefaultMetadata>;
export type AllUserscriptMetadata = UserscriptCustomMetadata & UserscriptDefaultMetadata & { version: string };

// Borrowed and adapted from kellnerd
// https://github.com/kellnerd/musicbrainz-bookmarklets/blob/730ed0f96a81ef9bb239ed564f247bd68f84bee3/tools/userscriptMetadata.js#L68
interface CreateURLRuleRegexOptions {
    query?: 'mandatory' | 'forbidden' | 'allowed';
    fragment?: 'mandatory' | 'forbidden' | 'allowed';
}

const MB_DOMAIN_REGEX = /(\w+\.)?musicbrainz\.org/;

function constructSuffix({
    query = 'allowed',
    fragment = 'allowed',
}: CreateURLRuleRegexOptions): string {
    // Short circuit for shorter regexes
    if (query === 'allowed' && fragment === 'allowed') {
        return '([?#]|$)';
    }

    let suffix = '';
    if (query === 'mandatory') {
        suffix += String.raw`\?.+?`;
    } else if (query === 'allowed') {
        suffix += String.raw`(\?.+?)?`;
    }

    if (fragment === 'mandatory') {
        suffix += '#.+?';
    } else if (fragment === 'allowed') {
        suffix += '(#.+?)?';
    }

    return suffix + '$';
}

export function createURLRuleRegex(domainPattern: string | RegExp, pathRegex: string | RegExp, options: CreateURLRuleRegexOptions = {}): string {
    const domainRegex = typeof domainPattern !== 'string' ? domainPattern.source : domainPattern.replaceAll('.', '\\.');
    pathRegex = (typeof pathRegex === 'string') ? pathRegex : pathRegex.source;

    return `/^https?://${domainRegex}/${pathRegex}${constructSuffix(options)}/`;
}

function removeTemplateAndCreateRule(options: CreateURLRuleRegexOptions, pattern: string): string;
function removeTemplateAndCreateRule(options: CreateURLRuleRegexOptions, template: TemplateStringsArray, ...values: string[]): string;
function removeTemplateAndCreateRule(options: CreateURLRuleRegexOptions, pattern: string | TemplateStringsArray, ...values: string[]): string {
    if (typeof pattern === 'string') {
        return createURLRuleRegex(MB_DOMAIN_REGEX, pattern, options);
    } else {
        const fullPattern = pattern.raw[0] + pattern.raw.slice(1)
            .map((lit, idx) => `${values[idx]}${lit}`)
            .join('');
        return createURLRuleRegex(MB_DOMAIN_REGEX, fullPattern, options);
    }
}

// To be used with a tagged template literal
export function createMBRegex(options: CreateURLRuleRegexOptions): (pattern: string | TemplateStringsArray) => string;
export function createMBRegex(pattern: string): string;
export function createMBRegex(pattern: TemplateStringsArray, ...values: string[]): string;
export function createMBRegex(patternOrOptions: CreateURLRuleRegexOptions | string | TemplateStringsArray, ...values: string[]): ((pattern: string) => string) | ((pattern: TemplateStringsArray, ...values2: string[]) => string) | string {
    // The two first branches could in practice be merged, but TypeScript struggles with that.
    if (typeof patternOrOptions === 'string') {
        return removeTemplateAndCreateRule({}, patternOrOptions);
    } else if (Array.isArray(patternOrOptions)) {
        return removeTemplateAndCreateRule({}, patternOrOptions as TemplateStringsArray, ...values);
    } else {
        return removeTemplateAndCreateRule.bind(undefined, patternOrOptions as CreateURLRuleRegexOptions);
    }
}

const mb = createMBRegex;
export const MBID_REGEX_PART = String.raw`[a-f\d-]{36}`;
const mbid = MBID_REGEX_PART;

// List again -stolen- borrowed from kellnerd. Genre doesn't have an edit history.
export const MB_EDITABLE_ENTITIES = [
    'area',
    'artist',
    'collection',
    'event',
    'instrument',
    'label',
    'place',
    'recording',
    'release',
    'release-group',
    'series',
    'work',
    'url',
];

/** Any pages on which edits can occur */
export const MB_EDIT_DISPLAY_PAGE_PATTERNS = [
    mb`edit/\d+`,
    // <entity>/<entity_id>/edits, <entity>/<entity_id>/open_edits
    mb`(${MB_EDITABLE_ENTITIES.join('|')})/${mbid}/(open_)?edits`,
    // user/<username>/edits/...
    mb`user/[^/]+/edits(/\w+)?`,
    // user/<username>/votes
    mb`user/[^/]+/votes`,
    // Edit search
    mb({ query: 'mandatory' })`search/edits`,
];
