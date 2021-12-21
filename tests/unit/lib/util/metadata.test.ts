import { transformMBMatchURL } from '@lib/util/metadata';

describe('transforming match URLs', () => {
    it('should prefix MB domain', () => {
        expect(transformMBMatchURL('release/add'))
            .toBe('*://*.musicbrainz.org/release/add');
    });
});
