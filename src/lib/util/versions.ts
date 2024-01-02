type Version = number[];

export function parseVersion(vString: string): Version {
    // Can't use a bare function reference because parseInt will interpret the
    // index as the base.
    return vString.split('.').map((index) => Number.parseInt(index));
}

export function versionLessThan(v1: Version, v2: Version): boolean {
    let index = 0;
    while (index < v1.length && index < v2.length) {
        if (v1[index] < v2[index]) return true;
        if (v1[index] > v2[index]) return false;
        // Check next part
        index++;
    }

    // Same prefix. If v1 has less parts than v2, v2 is newer.
    return v1.length < v2.length;
}
