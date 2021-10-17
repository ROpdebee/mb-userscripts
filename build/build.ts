// Need to use .js in module names because of ts-node
import { buildUserscripts } from './rollup.js';
import { getVersionForToday } from './versions.js';

await buildUserscripts(getVersionForToday());
