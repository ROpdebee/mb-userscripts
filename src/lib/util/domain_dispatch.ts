import { assert } from './assert';

function splitDomain(domain: string): string[] {
    // Split e.g. 'itunes.apple.com' into ['itunes', 'apple.com'], 'a.b.c.d'
    // into ['a', 'b', 'c.d'].
    // We keep base and TLD together to avoid unnecessary common lookups.
    const parts = domain.split('.');
    let splitIdx = -2;
    // Watch out for e.g. amazon.co.uk or amazon.com.au. Our handling of this is
    // pretty naive (co.be is a valid site for example), but it works well enough.
    if (['org', 'co', 'com'].includes(parts[parts.length - 2])) {
        splitIdx = -3;
    }
    return [
        // ['sub', 'domain']
        ...parts.slice(0, splitIdx),
        // 'site.com'
        parts.slice(splitIdx).join('.'),
    ];
}

export class DispatchMap<Leaf> {
    /*
    Tree structure to implement mapping domain name patterns to arbitrary
    objects. There are two types of nodes:
      1. Internal nodes, which are themselves DispatchMap instances pointing
         to different subtrees.
      2. Leaf nodes, which are the leaf objects.

    Internal nodes map keys to subtrees. Keys can take one of three forms:
      1. A part of a domain name, e.g. `b` from `a.b.example.com`. These point
         to subtrees (which can be leafs). Top-level keys include the TLD, e.g.
         `example.com`.
      2. The wildcard `*`, pointing to a leaf. This matches a prefix of the
         domain name.
      3. The empty string, pointing to a leaf. These are used to match e.g.
         `a.example.com` when another pattern like `b.a.example.com` exists
         alongside it.

    Matching domain names always prefers the most specific pattern if multiple
    matching patterns are available. For example, for the domain `a.b.example.com`,
    the pattern precedence is as follows (first match wins):
      1. a.b.example.com
      2. *.b.example.com
      3. *.example.com

    Example tree:
      'discogs.com' -> DiscogsProvider
      'qobuz.com'
         |-> '' -> QobuzProvider
         |-> 'open' -> QobuzProvider
      'bandcamp.com'
         |-> '*' -> BandcampProvider
      'example.com'
         |-> 'a'
         |    |-> '' -> Provider for 'a.example.com'
         |    |-> 'b' -> Provider for 'b.a.example.com'
         |-> '*' -> Provider for '*.example.com', excluding 'a.example.com' and 'b.a.example.com'
    */

    // Using composition over inheritance because our interface is semantically
    // different from that of a standard map
    private readonly map: Map<string, Leaf | DispatchMap<Leaf>> = new Map();

    public set(domainPattern: string, leaf: Leaf): this {
        // Don't allow e.g. sub*.domain.com or *.com or domain.* or a.*.c.com.
        const domainParts = splitDomain(domainPattern);
        if (domainPattern === '*'
            || (domainParts[0].includes('*') && domainParts[0] !== '*')
            || domainParts.slice(1).some((part) => part.includes('*'))) {
            throw new Error('Invalid pattern: ' + domainPattern);
        }

        this.insert([...domainParts].reverse(), leaf);
        return this;
    }

    public get(domain: string): Leaf | undefined {
        return this.retrieve([...splitDomain(domain)].reverse());
    }

    // Workaround for https://github.com/babel/babel/issues/13875
    private _get(domainPart: '' | '*'): Leaf | undefined;
    private _get(domainPart: string): Leaf | DispatchMap<Leaf> | undefined;
    private _get(domainPart: string): Leaf | DispatchMap<Leaf> | undefined {
        return this.map.get(domainPart);
    }

    private _set(domainPart: '' | '*', value: Leaf): this;
    private _set(domainPart: string, value: Leaf | DispatchMap<Leaf>): this;
    private _set(domainPart: string, value: Leaf | DispatchMap<Leaf>): this {
        this.map.set(domainPart, value);
        return this;
    }

    private insertLeaf(key: string, leaf: Leaf): void {
        const existing = this._get(key);
        if (!existing) {
            this._set(key, leaf);
        } else {
            assert(existing instanceof DispatchMap && !existing.map.has(''), 'Duplicate leaf!');
            existing._set('', leaf);
        }
    }

    private insertInternal(keyPath: string[], leaf: Leaf): void {
        const firstKey = keyPath[0];
        const existing = this._get(firstKey);

        let subMap: DispatchMap<Leaf>;
        if (existing instanceof DispatchMap) {
            subMap = existing;
        } else {
            // Either no entry yet, or a bare entry -> Create a submap
            subMap = new DispatchMap();
            this._set(firstKey, subMap);
            if (existing !== undefined) {
                // existing instanceof Leaf -> Add it to the new submap
                subMap._set('', existing);
            }
        }

        subMap.insert(keyPath.slice(1), leaf);
    }

    private insert(keyPath: string[], leaf: Leaf): void {
        if (keyPath.length > 1) {
            this.insertInternal(keyPath, leaf);
        } else {
            assert(keyPath.length === 1, 'Empty domain parts?!');
            this.insertLeaf(keyPath[0], leaf);
        }
    }

    private retrieveLeaf(key: string): Leaf | undefined {
        let child = this._get(key);
        if (child instanceof DispatchMap) {
            let newChild = child._get('');
            if (newChild === undefined) {
                // Also match *.example.com to example.com
                newChild = child._get('*');
            }
            child = newChild;
        }

        return child;
    }

    private retrieveInternal(keyPath: string[]): Leaf | undefined {
        const child = this._get(keyPath[0]);
        if (!(child instanceof DispatchMap)) {
            // following the path may have led us to a leaf, but we need to
            // match additional subdomains, which can't be done with a leaf.
            // Note that this won't work if Leaf is a subtype of DispatchMap
            // itself, e.g. DispatchMap<DispatchMap<string>>, as leafs will
            // be instances of DispatchMap themselves. That shouldn't ever be
            // done, though.
            return;
        }

        return child.retrieve(keyPath.slice(1));
    }

    private retrieve(keyPath: string[]): Leaf | undefined {
        const child = (keyPath.length === 1
            ? this.retrieveLeaf(keyPath[0])
            : this.retrieveInternal(keyPath));

        // Fall back to wildcard if there is one
        // Could still be undefined in case a wildcard doesn't exist, in which case
        // the recursive caller will try a wildcard themselves.
        return child ?? this._get('*');
    }
}
