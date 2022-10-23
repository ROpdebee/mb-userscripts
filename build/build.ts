import { buildUserscripts } from './rollup';
import { getVersionForToday } from './versions';

// Don't use await at the top level, this is incompatible with node and
// CommonJS modules.
buildUserscripts(getVersionForToday())
    .catch((err) => {
        console.error(err);
        throw err;
    });
