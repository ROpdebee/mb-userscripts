# MB Userscripts
![GitHub Test Workflow Status](https://img.shields.io/github/workflow/status/ROpdebee/mb-userscripts/nightly_tests?label=tests)
![GitHub Deployment Workflow Status](https://img.shields.io/github/workflow/status/ROpdebee/mb-userscripts/deploy?label=deployment)
![Codecov](https://img.shields.io/codecov/c/gh/ROpdebee/mb-userscripts)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![GitHub license](https://img.shields.io/github/license/ROpdebee/mb-userscripts)](https://github.com/ROpdebee/mb-userscripts/blob/main/LICENSE)

Collection of userscripts for MusicBrainz.

[Dedicated support thread](https://community.metabrainz.org/t/ropdebees-userscripts-support-thread/551947)

## MB: Blind Votes

Blinds editor and voter details before your votes are cast.

[![Source](https://img.shields.io/badge/source-2021.3.30-informational?style=for-the-badge&logo=github)](mb_blind_votes.user.js)
[![Install](https://img.shields.io/badge/install-2021.3.30-green?style=for-the-badge&logo=github)](mb_blind_votes.user.js?raw=1)

## MB: Bulk copy-paste work codes

Quickly copy-paste work identifiers (ISWC, agency work codes) from CISAC's ISWCNet into a MusicBrainz work.

[![Source](https://img.shields.io/badge/source-2021.9.25-informational?style=for-the-badge&logo=github)](mb_bulk_copy_work_codes.user.js)
[![Install](https://img.shields.io/badge/install-2021.9.25-green?style=for-the-badge&logo=github)](mb_bulk_copy_work_codes.user.js?raw=1)

## MB: Display CAA image dimensions

Loads and displays the image dimensions of images in the cover art archive.

[![Source](https://img.shields.io/badge/source-2021.9.25-informational?style=for-the-badge&logo=github)](mb_caa_dimensions.user.js)
[![Install](https://img.shields.io/badge/install-2021.9.25-green?style=for-the-badge&logo=github)](mb_caa_dimensions.user.js?raw=1)

## MB: Enhanced Cover Art Uploads

Enhance the cover art uploader!

In a nutshell:

* Upload directly from an image URL
* One-click import artwork from Discogs/Spotify/Apple Music/... attached to the release (or, alternatively, paste the URL)
* Automatically retrieve the largest version of an image through [ImageMaxURL](https://github.com/qsniyg/maxurl)
* Seed the cover art upload form from a-tisket.

Full list of supported artwork providers [here](src/mb_enhanced_cover_art_uploads/supportedProviders.md).

[![Source](https://img.shields.io/badge/dynamic/json?label=source&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2FROpdebee%2Fmb-userscripts%2Fdist%2Fmb_enhanced_cover_art_uploads.metadata.json&logo=github&style=for-the-badge)](src/mb_enhanced_cover_art_uploads)
[![Install](https://img.shields.io/badge/dynamic/json?label=install&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2FROpdebee%2Fmb-userscripts%2Fdist%2Fmb_enhanced_cover_art_uploads.metadata.json&logo=github&style=for-the-badge&color=green)](https://raw.github.com/ROpdebee/mb-userscripts/dist/mb_enhanced_cover_art_uploads.user.js)

## MB: Supercharged Cover Art Edits

Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.

[![Source](https://img.shields.io/badge/source-2021.4.29-informational?style=for-the-badge&logo=github)](mb_supercharged_caa_edits.user.js)
[![Install](https://img.shields.io/badge/install-2021.4.29-green?style=for-the-badge&logo=github)](mb_supercharged_caa_edits.user.js?raw=1)

## MB: Validate Work Codes

Validate work attributes on various MB pages. Highlights invalid (red) or ill-formatted (yellow) work codes.

[![Source](https://img.shields.io/badge/source-2021.5.27-informational?style=for-the-badge&logo=github)](mb_validate_work_codes.user.js)
[![Install](https://img.shields.io/badge/install-2021.5.27-green?style=for-the-badge&logo=github)](mb_validate_work_codes.user.js?raw=1)

## Smaller Quality of Life Scripts
Smaller scripts that offer minor QoL improvements.

### MB: Collapse Work Attributes

Collapses work attributes when there are too many. Workaround for MBS-11535/MBS-11537.

[![Source](https://img.shields.io/badge/source-2021.9.25-informational?style=for-the-badge&logo=github)](mb_collapse_work_attributes.user.js)
[![Install](https://img.shields.io/badge/install-2021.9.25-green?style=for-the-badge&logo=github)](mb_collapse_work_attributes.user.js?raw=1)

### MB: QoL: Select All Update Recordings
Add buttons to release editor to select all "Update recordings" checkboxes. Differs from the built-in "Select All" checkboxes in that it doesn't lock the checkboxes to a given state, enabling you to deselect some checkboxes.

[![Source](https://img.shields.io/badge/source-2021.5.22-informational?style=for-the-badge&logo=github)](mb_qol_select_all_update_recordings.user.js)
[![Install](https://img.shields.io/badge/install-2021.5.22-green?style=for-the-badge&logo=github)](mb_qol_select_all_update_recordings.user.js?raw=1)

### MB: QoL: Inline all recording's tracks on releases
Display all tracks and releases on which a recording appears from the release page. Makes it easier to check whether live or DJ-mix recordings are wrongly linked to other tracks.

[![Source](https://img.shields.io/badge/source-2021.5.23-informational?style=for-the-badge&logo=github)](mb_qol_inline_recording_tracks.user.js)
[![Install](https://img.shields.io/badge/install-2021.5.23-green?style=for-the-badge&logo=github)](mb_qol_inline_recording_tracks.user.js?raw=1)

### MB: QoL: Seed the batch recording comments script
Seed the recording comments for the batch recording comments userscripts with live and DJ-mix data. Can save a bunch of keystrokes when setting live or DJ-mix disambiguation comments. DJ-mix comments are derived from the release title. Live comments are derived from "recorded at place", "recorded in area", and "recording of work" advanced relationships.

[![Source](https://img.shields.io/badge/source-2021.6.7-informational?style=for-the-badge&logo=github)](mb_qol_seed_recording_disambiguation.user.js)
[![Install](https://img.shields.io/badge/install-2021.6.7-green?style=for-the-badge&logo=github)](mb_qol_seed_recording_disambiguation.user.js?raw=1)

### MB: QoL: Paste multiple external links at once
Paste multiple external links at once into the external link editor. Input is split on whitespace (newlines, tabs, spaces, etc.) and fed into the link editor separately.

[![Source](https://img.shields.io/badge/source-2021.9.19-informational?style=for-the-badge&logo=github)](mb_multi_external_links.user.js)
[![Install](https://img.shields.io/badge/install-2021.9.19-green?style=for-the-badge&logo=github)](mb_multi_external_links.user.js?raw=1)
