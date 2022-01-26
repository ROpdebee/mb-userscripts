// Seeder for provider buttons on /cover-art pages
import { getURLsForRelease } from '@lib/MB/URLs';
import { filterNonNull } from '@lib/util/array';
import { assertHasValue } from '@lib/util/assert';
import { qs } from '@lib/util/dom';

import type { Seeder } from './base';
import { getProvider } from '../providers';
import { SeedParameters } from './parameters';

export const MusicBrainzSeeder: Seeder = {
    supportedDomains: ['musicbrainz.org', 'beta.musicbrainz.org'],
    supportedRegexes: [/release\/[a-f0-9-]{36}\/cover-art/],

    async insertSeedLinks(): Promise<void> {
        const mbid = window.location.href.match(/musicbrainz\.org\/release\/([a-f0-9-]+)\//)?.[1];
        assertHasValue(mbid);
        const attachedURLs = await getURLsForRelease(mbid, {
            excludeEnded: true,
            excludeDuplicates: true,
        });

        const buttons = await Promise.all(attachedURLs
            .map(async (url): Promise<HTMLElement | undefined> => {
                const provider = getProvider(url);
                if (!provider?.allowButtons) return;

                const favicon = await provider.favicon;
                const seedUrl = new SeedParameters([{
                    url,
                }]).createSeedURL(mbid);

                return <a
                    title={url.href}
                    href={seedUrl}
                >
                    <img src={favicon} alt={provider.name} />
                    <span>{'Import from ' + provider.name}</span>
                </a>;
            }));

        const buttonRow = qs('#content > .buttons');
        filterNonNull(buttons).forEach(buttonRow.appendChild.bind(buttonRow));
    },
};
