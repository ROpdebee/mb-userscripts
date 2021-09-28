import { transformMBMatchURL } from '@lib/util/metadata';


test('transforming match URLs should prefix MB domain', () => {
    expect(transformMBMatchURL('release/add'))
        .toStrictEqual('*://*.musicbrainz.org/release/add');
});
