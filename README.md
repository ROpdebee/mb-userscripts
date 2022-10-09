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

## MB: Blind Votes

Blinds editor and voter details before your votes are cast.

[![Install](https://img.shields.io/badge/install-latest-informational?style=for-the-badge&logo=tampermonkey)](mb_blind_votes.user.js?raw=1)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](mb_blind_votes.user.js)


## MB: Bulk copy-paste work codes

Quickly copy-paste work identifiers (ISWC, agency work codes) from [CISAC's ISWCNet](https://iswcnet.cisac.org/search) or [GEMA repertoire search](https://online.gema.de/werke/search.faces?lang=en) into a MusicBrainz work.

[![Install](https://img.shields.io/badge/install-latest-informational?style=for-the-badge&logo=tampermonkey)](mb_bulk_copy_work_codes.user.js?raw=1)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](mb_bulk_copy_work_codes.user.js)


## MB: Display CAA image dimensions

Loads and displays the image dimensions of images in the cover art archive.

[![Install](https://img.shields.io/badge/dynamic/json?label=install&query=%24.version&url=https%3A%2F%2Fraw.github.com%2FROpdebee%2Fmb-userscripts%2Fdist%2Fmb_caa_dimensions.metadata.json&logo=tampermonkey&style=for-the-badge&color=informational)](https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_caa_dimensions.user.js)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](src/mb_caa_dimensions)
[![Changelog](https://img.shields.io/badge/changelog-grey?style=for-the-badge)](https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_caa_dimensions.changelog.md)


## MB: Enhanced Cover Art Uploads

Enhance the cover art uploader!

In a nutshell:

* Upload directly from an image URL
* One-click import artwork from Discogs/Spotify/Apple Music/... attached to the release (or, alternatively, paste the URL)
* Automatically retrieve the largest version of an image through [ImageMaxURL](https://github.com/qsniyg/maxurl)
* Seed the cover art upload form from a-tisket.

Full list of supported artwork providers [here](src/mb_enhanced_cover_art_uploads/docs/supported_providers.md).

[![Install](https://img.shields.io/badge/dynamic/json?label=install&query=%24.version&url=https%3A%2F%2Fraw.github.com%2FROpdebee%2Fmb-userscripts%2Fdist%2Fmb_enhanced_cover_art_uploads.metadata.json&logo=tampermonkey&style=for-the-badge&color=informational)](https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.user.js)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](src/mb_enhanced_cover_art_uploads)
[![Changelog](https://img.shields.io/badge/changelog-grey?style=for-the-badge)](https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_enhanced_cover_art_uploads.changelog.md)


## MB: QoL: Inline all recording's tracks on releases

Display all tracks and releases on which a recording appears from the release page. Makes it easier to check whether live or DJ-mix recordings are wrongly linked to other tracks.

[![Install](https://img.shields.io/badge/install-latest-informational?style=for-the-badge&logo=tampermonkey)](mb_qol_inline_recording_tracks.user.js?raw=1)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](mb_qol_inline_recording_tracks.user.js)


## MB: QoL: Paste multiple external links at once

Paste multiple external links at once into the external link editor. Input is split on whitespace (newlines, tabs, spaces, etc.) and fed into the link editor separately.

[![Install](https://img.shields.io/badge/dynamic/json?label=install&query=%24.version&url=https%3A%2F%2Fraw.github.com%2FROpdebee%2Fmb-userscripts%2Fdist%2Fmb_multi_external_links.metadata.json&logo=tampermonkey&style=for-the-badge&color=informational)](https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_multi_external_links.user.js)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](src/mb_multi_external_links)
[![Changelog](https://img.shields.io/badge/changelog-grey?style=for-the-badge)](https://github.com/ROpdebee/mb-userscripts/blob/dist/mb_multi_external_links.changelog.md)


## MB: QoL: Seed the batch recording comments script

Seed the recording comments for the batch recording comments userscripts with live and DJ-mix data. Can save a bunch of keystrokes when setting live or DJ-mix disambiguation comments. DJ-mix comments are derived from the release title. Live comments are derived from "recorded at place", "recorded in area", and "recording of work" advanced relationships.

[![Install](https://img.shields.io/badge/install-latest-informational?style=for-the-badge&logo=tampermonkey)](mb_qol_seed_recording_disambiguation.user.js?raw=1)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](mb_qol_seed_recording_disambiguation.user.js)


## MB: QoL: Select All Update Recordings

Add buttons to release editor to select all "Update recordings" checkboxes. Differs from the built-in "Select All" checkboxes in that it doesn't lock the checkboxes to a given state, enabling you to deselect some checkboxes.

[![Install](https://img.shields.io/badge/install-latest-informational?style=for-the-badge&logo=tampermonkey)](mb_qol_select_all_update_recordings.user.js?raw=1)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](mb_qol_select_all_update_recordings.user.js)


## MB: Supercharged Cover Art Edits

Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.

[![Install](https://img.shields.io/badge/install-latest-informational?style=for-the-badge&logo=tampermonkey)](mb_supercharged_caa_edits.user.js?raw=1)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](mb_supercharged_caa_edits.user.js)


## MB: Validate Work Codes

Validate work attributes on various MB pages. Highlights invalid (red) or ill-formatted (yellow) work codes.

[![Install](https://img.shields.io/badge/install-latest-informational?style=for-the-badge&logo=tampermonkey)](mb_validate_work_codes.user.js?raw=1)
[![Source](https://img.shields.io/badge/source-grey?style=for-the-badge&logo=github)](mb_validate_work_codes.user.js)
