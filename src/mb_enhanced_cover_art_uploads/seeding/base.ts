export interface Seeder {
    supportedDomains: string[];
    supportedRegexes: RegExp[];
    insertSeedLinks(): Promise<void> | void;
}

export function seederSupportsURL(seeder: Seeder, url: Location | URL): boolean {
    return seeder.supportedDomains.includes(url.hostname.replace(/^www\./, ''))
        && seeder.supportedRegexes.some((rgx) => rgx.test(url.href));
}

const SEEDER_DISPATCH_MAP = new Map<string, Seeder[]>();

export function registerSeeder(seeder: Seeder): void {
    for (const domain of seeder.supportedDomains) {
        if (!SEEDER_DISPATCH_MAP.has(domain)) {
            SEEDER_DISPATCH_MAP.set(domain, []);
        }

        SEEDER_DISPATCH_MAP.get(domain)!.push(seeder);
    }
}

export function seederFactory(url: Location | URL): Seeder | undefined {
    return SEEDER_DISPATCH_MAP.get(url.hostname.replace(/^www\./, ''))
        ?.find((seeder) => seederSupportsURL(seeder, url));
}
