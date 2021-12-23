export interface Seeder {
    supportedDomains: string[];
    supportedRegexes: RegExp[];
    insertSeedLinks(): void;
}

export function seederSupportsURL(seeder: Seeder, url: URL | Location): boolean {
    return seeder.supportedDomains.includes(url.hostname.replace(/^www\./, ''))
        && seeder.supportedRegexes.some((rgx) => rgx.test(url.href));
}

const SEEDER_DISPATCH_MAP: Map<string, Seeder[]> = new Map();

export function registerSeeder(seeder: Seeder): void {
    seeder.supportedDomains.forEach((domain) => {
        if (!SEEDER_DISPATCH_MAP.has(domain)) {
            SEEDER_DISPATCH_MAP.set(domain, []);
        }

        SEEDER_DISPATCH_MAP.get(domain)!.push(seeder);
    });
}

export function seederFactory(url: URL | Location): Seeder | undefined {
    return SEEDER_DISPATCH_MAP.get(url.hostname.replace(/^www\./, ''))
        ?.find((seeder) => seederSupportsURL(seeder, url));
}
