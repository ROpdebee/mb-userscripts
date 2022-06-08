/**
 * Format a number to a human-readable file size string.
 *
 * @param      {number}  size    The file's size in bytes.
 * @return     {string}  Human-readable, formatted version.
 */
export function formatFileSize(size: number): string {
    // Thanks to https://stackoverflow.com/a/20732091
    const order = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    const suffixes = ['B', 'kB', 'MB', 'GB', 'TB'];
    const truncatedSize = Number((size / Math.pow(1024, order)).toFixed(2));
    return `${truncatedSize} ${suffixes[order]}`;
}
