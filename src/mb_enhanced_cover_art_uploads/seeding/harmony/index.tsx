// src/mb_enhanced_cover_art_uploads/seeding/harmony/index.tsx

import { LOGGER } from '@lib/logging/logger';
import { logFailure } from '@lib/util/async';
import { qs, qsa, qsMaybe } from '@lib/util/dom';

import type { Seeder } from '../base';
import { SeedParameters } from '../parameters';

export const HarmonySeeder: Seeder = {
    supportedDomains: ['harmony.pulsewidth.org.uk'],
    supportedRegexes: [/\/release\/actions.*release_mbid=([a-f\d-]{36})/],

    insertSeedLinks(): void {
        // Extract the MBID from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const mbid = urlParams.get('release_mbid');
        if (!mbid) {
            LOGGER.error("Release MBID not found in URL.");
            return;
        }

        addSeedLinksToCovers([mbid], document.location.href);
    }
};

function addSeedLinksToCovers(mbids: string[], origin: string): void {
    // Find cover image elements on the page
    const covers = qsa<HTMLElement>('figure.cover-image');
    
    if (covers.length === 0) {
        LOGGER.warn("No cover images found on the page.");
        return;
    }

    for (const coverElement of covers) {
        addSeedLinkToCover(coverElement, mbids, origin);
    }
}

function addSeedLinkToCover(coverElement: HTMLElement, mbids: string[], origin: string): void {
    const img = qs<HTMLImageElement>('img', coverElement);
    const imgUrl = img.src.replace(/\/250x250bb\.jpg/, '/1000x1000bb.jpg'); // Get high-quality image URL

    const parameters = new SeedParameters([{
        url: new URL(imgUrl),
        // Set Front type
        types: [1]
    }], origin);

    for (const mbid of mbids) {
        const seedUrl = parameters.createSeedURL(mbid);

        // Create the link element
        const link = (
            <span className="label add-cover-art-link" onClick={() => window.open(seedUrl, '_blank')}>
                + Add Cover Art
            </span>
        );

        // Add CSS for the link
        const style = document.createElement('style');
        style.textContent = `
            .add-cover-art-link {
                min-height: 1.2em;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        // Append the link to the cover container
        coverElement.childNodes[1].appendChild(link);
    }
}
