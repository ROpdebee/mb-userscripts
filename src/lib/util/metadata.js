/**
 * Userscript metadata helpers.
 */

export function transformMBRequires(requireString) {
    return ['http*://', 'http*://*.']
        .map((prefix) => `${prefix}${requireString}`);
}
