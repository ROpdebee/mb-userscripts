/* eslint-disable jest/no-export, jest/consistent-test-it */

import type { Context } from 'setup-polly-jest';

import type { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { setupPolly } from '@test-utils/pollyjs';

import type { ExpectedCoverArt } from '../test-utils/matchers';
import { registerMatchers } from '../test-utils/matchers';

export interface ExtractionCase {
    description: string;
    url: string;
    imageCount: number;
    expectedImages: Array<ExpectedCoverArt & { index: number }>;
}

// Arguments for the "throws on 404 releases" spec
export interface ExtractionFailedCase {
    description: string;
    url: string;
    errorMessage?: string | RegExp;
}

interface SpecificationArguments {
    provider: CoverArtProvider;
    extractionCases: ExtractionCase[];
    extractionFailedCases: ExtractionFailedCase[];
    pollyContext?: Context;
}

export const findImagesSpec = ({ provider, extractionCases, extractionFailedCases, pollyContext }: SpecificationArguments): void => {
    if (pollyContext === undefined) {
        pollyContext = setupPolly();
    }

    beforeAll(() => {
        registerMatchers();
    });

    if (extractionCases.length > 0) {
        it.each(extractionCases)('extracts covers for $description', async (extractionCase) => {
            const covers = await provider.findImages(new URL(extractionCase.url), false);

            expect(covers).toBeArrayOfSize(extractionCase.imageCount);

            for (const expectedImage of extractionCase.expectedImages) {
                expect(covers[expectedImage.index]).toMatchCoverArt(expectedImage);
            }
        });
    }

    if (extractionFailedCases.length > 0) {
        it.each(extractionFailedCases)('throws on $description', async (extractionFailedCase) => {
            pollyContext!.polly.configure({
                recordFailedRequests: true,
            });

            await expect(provider.findImages(new URL(extractionFailedCase.url), false))
                .rejects.toThrowWithMessage(Error, extractionFailedCase.errorMessage ?? `${provider.name} release does not exist`);
        });
    }
};
