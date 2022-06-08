type Version = number[];

export function parseVersion(vString: string): Version {
    // Can't use a bare function reference because parseInt will interpret the
    // index as the base.
    return vString.split('.').map((i) => parseInt(i));
}

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

