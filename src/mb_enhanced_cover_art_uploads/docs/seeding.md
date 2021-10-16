# Cover Art Seeding

"MB: Enhanced Cover Art Uploads" comes with a neat feature that allows seeding
cover art uploads through URL parameters, enabling one-click cover art uploads.
This document describes these seeding parameters.

Seeding parameters are provided through URL query parameters, where the name
of each parameter is prefixed by `x_seed.` to distinguish them from MB's own
query parameters. Two top-level parameters are supported:

* `x_seed.image.*`: Data for the images to be seeded. Each image has its own
  index, e.g. `x_seed.image.0.*` for data of the first image,
  `x_seed.image.1.*` for the second, and so on.
* `x_seed.origin`: The origin of the seeded data. This is a free-form string to
  be used in the edit note. If you're seeding from a web page, it is
  recommended to set this to the origin page's URL. Make sure to properly
  URL-encode it.

## Image data

Each `x_seed.image.*` group can contain the following parameters:

* `url` (mandatory): The URL to seed, URL-encoded. This can be a direct link
  to an image, or the URL to a release from one of the supported providers.
* `types` (optional): The default cover art type IDs to use for the image, as a
  JSON-encoded array of integers. E.g., `[1]` would add the image with a single
  type "Front", `[1,2]` would add the image with types "Front" and "Back". For
  direct image links, the default types provided here will be used as the type
  of the image. For provider links, these default types will only be used if it
  is not possible to determine more specific types per image extracted from the
  provider.
* `comment` (optional): A free-form, URL-encoded default comment to set for the
  seeded image(s). As with `types`, this comment is always used for direct
  image links, but for provider links, it is only used when no specific comment
  can be determined.

## Example

Given the following URL:

```
https://musicbrainz.org/release/[…]/add-cover-art?x_seed.image.0.url=https://example.com/123.jpg&x_seed.image.0.types=[1,2]&x_seed.image.0.comment=a%20comment&x_seed.origin=https://example.com/
```

_Note: For legibility, the `x_seed.image.0.url` value has not been URL-encoded.
In practice, it should always be URL-encoded._

The script will automatically fetch and enqueue the image at `https://example.com/123.jpg`
with types "Front" and "Back" and comment "a comment". The edit note will specify
that the image has been seeded from `https://example.com`.

For more examples, check out the seeders defined in `src/mb_enhanced_cover_art_uploads/seeding`
and the `SeedParameters.encode()` method in `seeding/parameters.ts`.
