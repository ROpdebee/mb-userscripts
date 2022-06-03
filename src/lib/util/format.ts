/**
 * Format a number to a human-readable size string.
 *
 * @param      {number}  size    The size.
 * @return     {string}  Human-readable, formatted version.
 */
export function formatSize(size: number): string {
    // Thanks to https://stackoverflow.com/a/20732091
    const order = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    const suffixes = ['B', 'kB', 'MB', 'GB', 'TB'];
    const truncatedSize = Number((size / Math.pow(1024, order)).toFixed(2));
    return `${truncatedSize} ${suffixes[order]}`;
}
