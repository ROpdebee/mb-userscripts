# Supported Cover Art Providers

The following table describes the types of links supported by MB: Upload to CAA From URL and its accompanying behaviour. For example, pasting a link to an Apple Music album will automatically extract the cover artwork from the album, fetch the largest possible version of the image, queue it for addition, and fill the types.

| Provider | Maximised images | Types filled | Notes |
|----------|------------------|--------------|-------|
| Direct links to JPG/PNG/GIF/PDF | Partial (see [maxurl sites.txt](https://github.com/qsniyg/maxurl/blob/master/sites.txt)) | ❌ |
| Apple Music/iTunes | ✔️ | ✔️ |
| Bandcamp | ✔️ | ✔️ | No custom domains |
| Deezer | ✔️ | ✔️ |
| Discogs | ❌ | ❌ | maxurl support broken, largest versions are retrieved when pasting a release link, but not for direct links |
| Spotify | ✔️ | ✔️ |
| Tidal | ✔️ | ✔️ | listen.tidal.com/store.tidal.com are converted to tidal.com prior to fetching |
