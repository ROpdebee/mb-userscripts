# MB Userscripts
Collection of userscripts for MusicBrainz.

[Dedicated support thread](https://community.metabrainz.org/t/ropdebees-userscripts-support-thread/551947)

## MB: Blind Votes

Blinds editor and voter details before your votes are cast.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_blind_votes.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_blind_votes.user.js?raw=1)

## MB: Bulk copy-paste work codes

Quickly copy-paste work identifiers (ISWC, agency work codes) from CISAC's ISWCNet into a MusicBrainz work.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_bulk_copy_work_codes.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_bulk_copy_work_codes.user.js?raw=1)

## MB: Display CAA image dimensions

Loads and displays the image dimensions of images in the cover art archive.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_caa_dimensions.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_caa_dimensions.user.js?raw=1)

## MB: Enhanced Cover Art Uploads

Enhance the cover art uploader!

In a nutshell:
* Upload directly from an image URL
* One-click import artwork from Discogs/Spotify/Apple Music/... attached to the release (or, alternatively, paste the URL)
* Automatically retrieve the largest version of an image through [ImageMaxURL](https://github.com/qsniyg/maxurl)
* Seed the cover art upload form from a-tisket.

Full list of supported artwork providers [here](src/mb_enhanced_cover_art_uploads/supportedProviders.md).

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](src/mb_enhanced_cover_art_uploads)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](dist/mb_enhanced_cover_art_uploads.user.js?raw=1)

## MB: Supercharged Cover Art Edits

Supercharges reviewing cover art edits. Displays release information on CAA edits. Enables image comparisons on removed and added images.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_supercharged_caa_edits.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_supercharged_caa_edits.user.js?raw=1)

## MB: Validate Work Codes

Validate work attributes on various MB pages. Highlights invalid (red) or ill-formatted (yellow) work codes.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_validate_work_codes.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_validate_work_codes.user.js?raw=1)

## Smaller Quality of Life Scripts
Smaller scripts that offer minor QoL improvements.

### MB: Collapse Work Attributes

Collapses work attributes when there are too many. Workaround for MBS-11535/MBS-11537.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_collapse_work_attributes.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_collapse_work_attributes.user.js?raw=1)

### MB: QoL: Select All Update Recordings
Add buttons to release editor to select all "Update recordings" checkboxes. Differs from the built-in "Select All" checkboxes in that it doesn't lock the checkboxes to a given state, enabling you to deselect some checkboxes.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_qol_select_all_update_recordings.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_qol_select_all_update_recordings.user.js?raw=1)

### MB: QoL: Inline all recording's tracks on releases
Display all tracks and releases on which a recording appears from the release page. Makes it easier to check whether live or DJ-mix recordings are wrongly linked to other tracks.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_qol_inline_recording_tracks.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_qol_inline_recording_tracks.user.js?raw=1)

### MB: QoL: Seed the batch recording comments script
Seed the recording comments for the batch recording comments userscripts with live and DJ-mix data. Can save a bunch of keystrokes when setting live or DJ-mix disambiguation comments. DJ-mix comments are derived from the release title. Live comments are derived from "recorded at place", "recorded in area", and "recording of work" advanced relationships.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_qol_seed_recording_disambiguation.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_qol_seed_recording_disambiguation.user.js?raw=1)

### MB: QoL: Paste multiple external links at once
Paste multiple external links at once into the external link editor. Input is split on whitespace (newlines, tabs, spaces, etc.) and fed into the link editor separately.

[![Source](https://github.com/jerone/UserScripts/blob/master/_resources/Source-button.png)](mb_multi_external_links.user.js)
[![Install](https://raw.github.com/jerone/UserScripts/master/_resources/Install-button.png)](mb_multi_external_links.user.js?raw=1)
