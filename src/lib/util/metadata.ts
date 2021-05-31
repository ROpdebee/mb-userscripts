/**
 * Userscript metadata helpers.
 */

export function transformMBRequires(requireString: string): string[] {
    return ['http*://musicbrainz.org/', 'http*://*.musicbrainz.org/']
        .map((prefix) => `${prefix}${requireString}`);
}
