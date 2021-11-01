/* eslint-disable jest/no-export, jest/consistent-test-it */

import type { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';

import { setupPolly } from '@test-utils/pollyjs';

import type { ExpectedCoverArt } from '../test-utils/matchers';
import { registerMatchers } from '../test-utils/matchers';

export interface ExtractionCase {
    desc: string;
    url: string;
    numImages: number;
    expectedImages: Array<ExpectedCoverArt & { index: number }>;
}

// Arguments for the "throws on 404 releases" spec
export interface ExtractionFailedCase {
    desc: string;
    url: string;
    errorMessage?: string | RegExp;
}

interface SpecArgs {
    provider: CoverArtProvider;
    extractionCases: ExtractionCase[];
    extractionFailedCases: ExtractionFailedCase[];
}

export const findImagesSpec = ({ provider, extractionCases, extractionFailedCases }: SpecArgs): void => {
    const pollyContext = setupPolly();

    beforeAll(() => {
        registerMatchers();
    });

    it.each(extractionCases)('extracts covers for $desc', async (extractionCase) => {
        const covers = await provider.findImages(new URL(extractionCase.url), false);

        expect(covers).toBeArrayOfSize(extractionCase.numImages);

        for (const expectedImage of extractionCase.expectedImages) {
            expect(covers[expectedImage.index]).toMatchCoverArt(expectedImage);
        }
    });

    if (extractionFailedCases.length) {
        it.each(extractionFailedCases)('throws on $desc', async (extractionFailedCase) => {
            pollyContext.polly.configure({
                recordFailedRequests: true,
            });

            await expect(provider.findImages(new URL(extractionFailedCase.url), false))
                .rejects.toThrowWithMessage(Error, extractionFailedCase.errorMessage ?? 'HTTP error 404: Not Found');
        });
    }
};
