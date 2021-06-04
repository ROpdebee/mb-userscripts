/**
 * Userscript metadata helpers.
 */

export function transformMBMatchURL(requireString: string): string {
    return `*://*.musicbrainz.org/${requireString}`;
}
