# Supported Cover Art Providers

The following table describes the types of links supported by MB: Upload to CAA From URL and its accompanying behaviour. For example, pasting a link to an Apple Music album will automatically extract the cover artwork from the album, fetch the largest possible version of the image, queue it for addition, and fill the types.

| Provider | Maximised images | Types filled | Notes |
|----------|------------------|--------------|-------|
| Direct links to JPG/PNG/GIF/PDF | Partial (see [maxurl sites.txt](https://github.com/qsniyg/maxurl/blob/master/sites.txt)) | ❌ |
| 7digital | ✔️ | ✔️ |
| AllMusic | ✔️ | ❌ |
| Amazon | ✔️ | Partial | Supports digital and physical music and audiobook products. Not all Amazon image types can be mapped to CAA cover art types. **Digital Music releases are currently not supported, see issue [#611](https://github.com/ROpdebee/mb-userscripts/issues/611).** |
| Amazon Music | ✔️ | ✔️ | ~~Converted into main Amazon MP3/Streaming product links, these tend to give larger images.~~ Currently not supported, see issue [#611](https://github.com/ROpdebee/mb-userscripts/issues/611) |
| Apple Music/iTunes | ✔️ | ✔️ | Maximised to the original source image. See issue [#80](https://github.com/ROpdebee/mb-userscripts/issues/80). |
| Archive.org | ✔️ | ❌ |
| Audiomack | ✔️ | ✔️ | Doesn't check for track images, these may be singles.
| Bandcamp | ✔️ | ✔️ | Grabs custom track images. For non-square covers, a square thumbnail will be added too. Custom domains currently not supported. |
| Beatport | ✔️ | ✔️ | Beware of upscales. 1400x1400 on older releases is probably upscaled. |
| Booth | ✔️ | ❌ | Types only filled for the first image. Note that Booth also contains products that aren't music albums (comics, stickers, etc.). |
| Bugs! | ✔️ | ✔️ |
| Deezer | ✔️ | ✔️ |
| Discogs | Partial | ❌ | Images are limited to 600x600, see [qsniyg/maxurl#689](https://github.com/qsniyg/maxurl/issues/689) |
| Free Music Archive | ✔️ | ✔️ |
| Jamendo | ✔️ | ✔️ |
| Juno Download | ✔️ | ✔️ | Likely limited to 700x700. |
| Melon | ✔️ | ✔️ |
| Metal Archives | ✔️ | ✔️ |
| Monstercat | ✔️ | ✔️ | Quality is bad for some releases, Bandcamp may have better artwork for those. |
| MusicBrainz/Cover Art Archive | ✔️ | ✔️ | To copy images from one release to another. |
| MusicCircle | ✔️ | ❌ |
| Musik-Sammler | ✔️ | ❌ |
| NetEase | ✔️ | ✔️ | A.k.a. music.163.com |
| Qobuz | ✔️ | ✔️ | Goodies are grabbed whenever possible. Back covers might not be supported at this time, if you have a release with a back cover, please let me know. Maximised to original source image. |
| RateYourMusic | ✔️ | ✔️ | Fetched images are limited to 1200px. Better quality images are available but require manually solving a captcha. |
| Rockipedia | ✔️ | ❌ |
| SoundCloud | ✔️ | ✔️ | Grabs custom track images. |
| Spotify | ✔️ | ✔️ |
| Tidal | ✔️ | ✔️ | listen.tidal.com/store.tidal.com are converted to tidal.com prior to fetching |
| Traxsource | ✔️ | ✔️ | Limited to 600x600. |
| VGMdb | ✔️ | ✔️ | Types are filled on a best-effort basis, make sure to double-check. Some images may be missed if you are not logged in to a VGMdb account. If you are logged in, the script _should_ be able to fetch those images, but support may depend on your userscript engine. |
| VK Music | ✔️ | ✔️ | Likely limited to 1184px.
| Yandex Music | ✔️ | ✔️ |
| YouTube | ✔️ | ✔️ | Video cover for music videos.
| YouTube Music | ✔️ | ✔️ |
