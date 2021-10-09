/* istanbul ignore file: Imports TSX, covered by E2E */

import { AtasketSeeder, AtisketSeeder } from './atisket';
import { registerSeeder } from './base';

registerSeeder(AtisketSeeder);
registerSeeder(AtasketSeeder);

export { seederFactory } from './base';
