/**
 * Default metadata for userscripts.
 */

const GH_REPO_URL = 'https://github.com/ROpdebee/mb-userscripts';
const BASE_DOWNLOAD_URL = 'https://raw.github.com/ROpdebee/mb-userscripts/main/dist/';

module.exports = {
    author: 'ROpdebee',
    namespace: GH_REPO_URL,
    license: 'MIT; https://opensource.org/licenses/MIT',
    grant: ['none'],
    baseDownloadURL: BASE_DOWNLOAD_URL,
    baseUpdateURL: BASE_DOWNLOAD_URL,
    homepageURL: GH_REPO_URL,
    supportURL: `${GH_REPO_URL}/issues`,
};
