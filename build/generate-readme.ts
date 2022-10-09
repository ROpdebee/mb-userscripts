import fs from 'node:fs/promises';

import dedent from 'ts-dedent';

import { MetadataGenerator } from './plugin-userscript';

const PREAMBLE = dedent`
  # MB Userscripts

  ![GitHub Test Workflow Status](https://img.shields.io/github/workflow/status/ROpdebee/mb-userscripts/nightly%20tests?label=tests)
  ![GitHub Deployment Workflow Status](https://img.shields.io/github/workflow/status/ROpdebee/mb-userscripts/deploy?label=deployment)
  ![Codecov](https://img.shields.io/codecov/c/gh/ROpdebee/mb-userscripts)
  [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
  [![GitHub license](https://img.shields.io/github/license/ROpdebee/mb-userscripts)](https://github.com/ROpdebee/mb-userscripts/blob/main/LICENSE)

  Collection of userscripts for MusicBrainz.

  [Dedicated support thread](https://community.metabrainz.org/t/ropdebees-userscripts-support-thread/551947)

  ## Installing

  To use these userscripts, you need a userscript add-on or extension such as [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), or [Greasemonkey](https://addons.mozilla.org/en-GB/firefox/addon/greasemonkey/) installed in your browser. More information can be found [here](https://stackapps.com/tags/script/info), [here](https://openuserjs.org/about/Userscript-Beginners-HOWTO), or [here](https://userscripts-mirror.org/about/installing.html).

  _Note: Although we aim to support all browsers and userscript add-ons, we currently cannot guarantee universal compatibility. If you discover a compatibility problem, please [submit an issue](https://github.com/ROpdebee/mb-userscripts/issues/new) and state your browser and userscript engine versions._
`;

interface UserscriptData {
    id: string;
    name: string;
    blurb: string;
    urls?: {
        metadata: string;
        install: string;
        source: string;
        changelog: string;
    };
}

const LEGACY_SCRIPT_DATA: UserscriptData[] = [
    {
        id: 'mb_blind_votes',
        name: 'MB: Blind Votes',
        blurb: 'Blinds editor and voter details before your votes are cast.',
    },
    {
        id: 'mb_bulk_copy_work_codes',
        name: 'MB: Bulk copy-paste work codes',
        blurb: 'Quickly copy-paste work identifiers (ISWC, agency work codes) from [CISAC\'s ISWCNet](https://iswcnet.cisac.org/search) or [GEMA repertoire search](https://online.gema.de/werke/search.faces?lang=en) into a MusicBrainz work.',
    },
    {
        id: 'mb_supercharged_caa_edits',
        name: 'MB: Supercharged Cover Art Edits',
        blurb: 'Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.',
    },
    {
        id: 'mb_validate_work_codes',
        name: 'MB: Validate Work Codes',
        blurb: 'Validate work attributes on various MB pages. Highlights invalid (red) or ill-formatted (yellow) work codes.',
    },
    {
        id: 'mb_qol_select_all_update_recordings',
        name: 'MB: QoL: Select All Update Recordings',
        blurb: 'Add buttons to release editor to select all "Update recordings" checkboxes. Differs from the built-in "Select All" checkboxes in that it doesn\'t lock the checkboxes to a given state, enabling you to deselect some checkboxes.',
    },
    {
        id: 'mb_qol_inline_recording_tracks',
        name: "MB: QoL: Inline all recording's tracks on releases",
        blurb: 'Display all tracks and releases on which a recording appears from the release page. Makes it easier to check whether live or DJ-mix recordings are wrongly linked to other tracks.',
    },
    {
        id: 'mb_qol_seed_recording_disambiguation',
        name: 'MB: QoL: Seed the batch recording comments script',
        blurb: 'Seed the recording comments for the batch recording comments userscripts with live and DJ-mix data. Can save a bunch of keystrokes when setting live or DJ-mix disambiguation comments. DJ-mix comments are derived from the release title. Live comments are derived from "recorded at place", "recorded in area", and "recording of work" advanced relationships.',
    },
];

async function getUserscriptData(): Promise<UserscriptData[]> {
    const srcDirs = await fs.readdir('./src');
    const userscriptIds = srcDirs
        .filter((name) => name.startsWith('mb'));

    return Promise.all(userscriptIds
        .map(async (userscriptId) => {
            const metaGen = await MetadataGenerator.create({
                userscriptName: userscriptId,
                branchName: 'dist',
                version: '',
            });
            const userscriptMeta = await metaGen.loadMetadata();

            return {
                id: userscriptId,
                name: userscriptMeta.name,
                blurb: userscriptMeta.blurb,
                urls: {
                    metadata: metaGen.gitURLs.constructRawURL('dist', `${userscriptId}.metadata.json`),
                    install: metaGen.gitURLs.constructRawURL('dist', `${userscriptId}.user.js`),
                    source: `src/${userscriptId}`,
                    changelog: metaGen.gitURLs.constructBlobURL('dist', `${userscriptId}.changelog.md`),
                },
            };
        }));
}

function generateSection(data: UserscriptData): string {
    const badgeBase = 'https://img.shields.io/badge';
    const installBadge = data.urls
        ? `${badgeBase}/dynamic/json?label=install&query=%24.version&url=${encodeURIComponent(data.urls.metadata)}&logo=tampermonkey&style=for-the-badge&color=informational`
        : `${badgeBase}/install-latest-informational?style=for-the-badge&logo=tampermonkey`;
    const installUrl = data.urls?.install ?? `${data.id}.user.js?raw=1`;
    const sourceBadge = `${badgeBase}/source-grey?style=for-the-badge&logo=github`;
    const sourceUrl = data.urls?.source ?? `${data.id}.user.js`;

    let links = dedent`
      [![Install](${installBadge})](${installUrl})
      [![Source](${sourceBadge})](${sourceUrl})
    `;
    if (data.urls?.changelog) {
        links += `\n[![Changelog](${badgeBase}/changelog-grey?style=for-the-badge)](${data.urls.changelog})`;
    }

    return dedent`
      ## ${data.name}

      ${data.blurb}

      ${links}

    `;
}

export async function generateReadmeContent(): Promise<string> {
    const userscriptData = await getUserscriptData();
    userscriptData.push(...LEGACY_SCRIPT_DATA);
    userscriptData.sort((a, b) => a.name < b.name ? -1 : 1);

    return dedent`
      ${PREAMBLE}

      ${userscriptData.map((data) => generateSection(data)).join('\n\n')}
    `;
}

async function generateReadme(): Promise<void> {
    await fs.writeFile('README.md', await generateReadmeContent());
}

// eslint-disable-next-line unicorn/prefer-module
if (require.main === module) {
    generateReadme()
        .catch(console.error);
}
