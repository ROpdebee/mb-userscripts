/**
 * Userscript metadata helpers.
 */

function transformMBRequires(requireString) {
    return ['http*://', 'http*://*.']
        .map((prefix) => `${prefix}${requireString}`);
}

module.exports = {
    transformMBRequires,
};
