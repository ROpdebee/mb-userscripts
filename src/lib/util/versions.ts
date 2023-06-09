/**
 * Utilities for version numbers.
 */

type Version = number[];

/**
 * Parse a version into its components.
 *
 * @param      {string}   vString  Version string.
 * @return     {Version}  Array of version numbers.
 */
export function parseVersion(vString: string): Version {
    // Can't use a bare function reference because parseInt will interpret the
    // index as the base.
    return vString.split('.').map((i) => parseInt(i));
}

/**
 * Determine whether `v1` is an earlier version than `v2`.
 *
 * @param      {Version}  v1      The left-hand side version.
 * @param      {Version}  v2      The right-hand side version.
 * @return     {boolean}  `true` if `v1 < v2`, `false` otherwise.
 */
export function versionLessThan(v1: Version, v2: Version): boolean {
    let i = 0;
    while (i < v1.length && i < v2.length) {
        if (v1[i] < v2[i]) return true;
        if (v1[i] > v2[i]) return false;
        // Check next part
        i++;
    }

    // Same prefix. If v1 has less parts than v2, v2 is newer.
    return v1.length < v2.length;
}

