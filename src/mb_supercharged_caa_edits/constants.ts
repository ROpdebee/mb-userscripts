export const LOADING_GIF = 'data:image/gif;base64,R0lGODlhEAAQAPMPALu7u5mZmTMzM93d3REREQAAAHd3d1VVVWZmZqqqqoiIiO7u7kRERCIiIgARAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAPACwAAAAAEAAQAEAEcPDJtyg6dUrFetDTIopMoSyFcxxD1krD8AwCkASDIlPaUDQLR6G1Cy0SgqIkE1IQGMrFAKCcGWSBzwPAnAwarcKQ15MpTMJYd1ZyUDXSDGelBY0qIoBh/ZoYGgELCjoxCRRvIQcGD1kzgSAgAACQDxEAIfkEBQcADwAsAAAAAA8AEAAABF3wyfkMkotOJpscRKJJwtI4Q1MAoxQ0RFBw0xEvhGAVRZZJh4JgMAEQW7TWI4EwGFjKR+CAQECjn8DoN0kwDtvBT8FILAKJgfoo1iAGAPNVY9DGJXNMIHN/HJVqIxEAIfkEBQcADwAsAAAAABAADwAABFrwyfmColgiydpaQiY5x9Ith7hURdIl0wBIhpCAjKIIxaAUPQ0hFQsAC7MJALFSFi4SgC4wyHyuCYNWxH3AuhSEotkNGAALAPqqkigG8MWAjAnM4A8594vPUyIAIfkEBQcADwAsAAAAABAAEAAABF3wySkDvdKsddg+APYIWrcg2DIRQAcU6DJICjIsjBEETLEEBYLqYSDdJoCGiHgZwG4LQCCRECEIBAdoF5hdEIWwgBJqDs7DgcKyRHZl3uUwuhm2AbNNW+LV7yd+FxEAIfkEBQcACAAsAAAAABAADgAABEYQyYmMoVgeWQrP3NYhBCgZBdAFRUkdBIAUguVVo1ZsWFcEGB5GMBkEjiCBL2a5ZAi+m2SAURExwKqPiuCafBkvBSCcmiYRACH5BAUHAA4ALAAAAAAQABAAAARs0MnpAKDYrbSWMp0xZIvBKYrXjNmADOhAKBiQDF5gGcICNAyJTwFYTBaDQ0HAkgwSmAUj0OkMrkZM4HBgKK7YTKDRICAo2clAEIheKc9CISjEVTuEQrJASGcSBQcSUFEUDQUXJBgDBW0Zj34RACH5BAUHAA8ALAAAAAAQABAAAARf8Mn5xqBYgrVC4EEmBcOSfAEjSopJMglmcQlgBYjE5NJgZwjCAbO4YBAJjpIjSiAQh5ayyRAIDKvJIbnIagoFRFdkQDQKC0RBsCIUFAWsT7RwG410R8HiiK0WBwJjFBEAIfkEBQcADgAsAQABAA8ADwAABFrQybEWADXJLUHHAMJxIDAgnrOo2+AOibEMh1LN62gIxphzitRoCDAYNcNN6FBLShao4WzwHDQKvVGhoFAwGgtFgQHENhoB7nCwHRAIC0EyUcC8Zw1ha3NIRgAAIfkEBQcADwAsAAAAABAAEAAABGDwyfnWoljaNYYFV+Zx3hCEGEcuypBtMJBISpClAWLfWODymIFiCJwMDMiZBNAAYFqUAaNQ2E0YBIXGURAMCo1AAsFYBBoIScBJEwgSVcmP0li4FwcHz+FpCCQMPCFINxEAIfkEBQcADgAsAAABABAADwAABFzQyemWXYNqaSXY2vVtw3UNmROM4JQowKKlFOsgRI6ASQ8IhSADFAjAMIMAgSYJtByxyQIhcEoaBcSiwegpDgvAwSBJ0AIHBoCQqIAEi/TCIAABGhLG8MbcKBQgEQAh+QQFBwAPACwAAAEAEAAPAAAEXfDJSd+qeK5RB8fDRRWFspyotAAfQBbfNLCVUSSdKDV89gDAwcFBIBgywMRnkWBgcJUDKSZRIKAPQcGwYByAAYTEEJAAJIGbATEQ+B4ExmK9CDhBd8ThdHw/AmUYEQAh+QQFBwAPACwAAAEADwAPAAAEXvBJQIa8+ILSspdHkXxS9wxF4Q3L2aTBeC0sFjhAtuyLIjAMhYc2GBgaSKGuyNoBDp7czFAgeBIKwC6kWCAMxUSAFjtNCAAFGGF5tCQLAaJnWCTqHoREvQuQJAkyGBEAOw==';

export const STATUSES: Record<number, string | undefined> = {
    1: 'Official',
    2: 'Promotion',
    3: 'Bootleg',
    4: 'Pseudo-Release',
    5: 'Withdrawn',
    6: 'Cancelled',
};

export const PACKAGING_TYPES: Record<number, string | undefined> = {
    1: 'Jewel Case',
    2: 'Slim Jewel Case',
    3: 'Digipak',
    4: 'Cardboard/Paper Sleeve',
    5: 'Other',
    6: 'Keep Case',
    7: 'None',
    8: 'Cassette Case',
    9: 'Book',
    10: 'Fatbox',
    11: 'Snap Case',
    12: 'Gatefold Cover',
    13: 'Discbox Slider',
    16: 'Super Jewel Box',
    17: 'Digibook',
    18: 'Plastic Sleeve',
    19: 'Box',
    20: 'Slidepack',
    21: 'SnapPack',
    54: 'Metal Tin',
    55: 'Longbox',
    56: 'Clamshell Case',
};

export const NONSQUARE_PACKAGING_TYPES = new Set([
    3, // Digipak
    6, // Keep case
    8, // Cassette
    9, // Book
    10, // Fatbox
    11, // Snap case
    17, // Digibook
    55, // Longbox
]);

export const NONSQUARE_PACKAGING_COVER_TYPES = new Set([
    'Front',
    'Back',
]);

// Non-exhaustive
export const LIKELY_DIGITAL_DIMENSIONS = new Set([
    '640x640',  // Spotify, Tidal (?)
    '1400x1400', // Deezer, iTunes (?)
    '3000x3000', // iTunes, Bandcamp (?)
]);

export const SHADY_REASONS = {
    releaseDate: 'The release date occurs after the end of the voting period for this edit. The cover art may not be accurate at this time.',
    incorrectDimensions: 'This packaging is typically non-square, but this cover art is square. It likely belongs to another release.',
    nonsquareDigital: 'This is a digital media release with non-square cover art. Although this is possible, it is uncommon.',
    digitalDimensions: 'This is a physical release but the added cover art has dimensions typical of digital store fronts. Care should be taken to ensure the cover matches the actual physical release.',
    digitalNonFront: 'This type of artwork is very uncommon on digital releases, and might not belong here.',
    trackOnPhysical: 'Covers of type “track” should not appear on physical releases.',
    linerOnNonVinyl: 'Covers of type “liner” typically appear on Vinyl releases. Although it can appear on other releases, this is uncommon.',
    noTypesSet: 'This cover has no types set. This is not ideal.',
    obiOutsideJapan: 'Covers of type “obi” typically occur on Japanese releases only. JP is not in the release countries.',
    watermark: 'This cover may contain watermarks, and should ideally be superseded by one without watermarks.',
    pseudoRelease: 'Pseudo-releases typically should not have cover art attached.',
    urlInComment: 'The comment appears to contain a URL. This is often unnecessary clutter.',
};

export const MB_FORMAT_TRANSLATIONS = {
    '%A': 'dddd',  // Monday, Tuesday, ...
    '%a': 'ddd',   // mon, tue, ...
    '%B': 'MMMM',  // January, February, ...
    '%b': 'MMM',   // Jan, Feb, ...
    '%d': 'DD',    // 2-digit day
    '%e': 'D',     // 1/2-digit day
    '%m': 'MM',    // 2-digit month
    '%Y': 'YYYY',  // 4-digit year
    '%H': 'HH',    // 00-23 hour
    '%M': 'mm',    // 00-59 minutes
    '%c': 'DD/MM/YYYY, hh:mm:ss a',
    '%x': 'DD/MM/YYYY',
    '%X': 'hh:mm:ss a',
};
