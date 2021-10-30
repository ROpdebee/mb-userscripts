/* istanbul ignore file: Imports TSX, covered by E2E */

import { AtasketSeeder, AtisketSeeder } from './atisket';
import { registerSeeder } from './base';
import { VGMdbSeeder } from './vgmdb';

registerSeeder(AtisketSeeder);
registerSeeder(AtasketSeeder);
registerSeeder(VGMdbSeeder);

export { seederFactory } from './base';
