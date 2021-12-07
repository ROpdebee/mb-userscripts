import { createHash } from 'crypto';
import expect from 'expect';
import { $enum } from 'ts-enum-util';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';

const { I } = inject();

export interface ExpectedArtworkType {
    name: string;
    contentDigest: string;
    types: ArtworkTypeIDs[];
    comment: string;
}

const pageObject = {

    // insert your locators and methods here
    fields: {
        pasteUrl: 'input#ROpdebee_paste_url',
        frontOnly: 'input#ROpdebee_paste_front_only',
    },
    addFilesContainer: '.add-files.row',

    async hasQueuedArtwork(expectedArtwork: ExpectedArtworkType): Promise<void> {
        // Ambiguity should not arise as we inject unique names.
        const nameLocator = locate('span')
            .withAttr({ 'data-bind': 'text: name' })
            .withText(expectedArtwork.name);
        const rowLocator = locate('tr')
            .withDescendant(nameLocator)
            .as('queued artwork named ' + expectedArtwork.name);
        I.seeElement(rowLocator);

        await within(rowLocator, async () => {
            // We found the image, now check its payload
            const imgSrc = await I.grabAttributeFrom({ css: '.uploader-preview-column > img' }, 'src');
            const imgDigest = createHash('md5').update(imgSrc.split(',')[1], 'base64').digest('hex');
            expect(imgDigest).toBe(expectedArtwork.contentDigest);

            // Check whether the checked types matches the ones we expect
            $enum(ArtworkTypeIDs).forEach((value) => {
                const checker = (expectedArtwork.types.includes(value)
                    ? I.seeCheckboxIsChecked
                    : I.dontSeeCheckboxIsChecked)
                    .bind(I);
                checker({ css: `.cover-art-type-checkboxes input[value="${value}"]`});
            });

            // Check that comment value matches the one we expect
            // We can't use I.seeInField because it errors if the value is unset.
            I.useWebDriverTo('see that comment is correct', async ({ browser }) => {
                const comment = await browser.$('input.comment').then((inp) => inp.getValue());
                // Some browsers might return null in getValue
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                expect(comment ?? '').toBe(expectedArtwork.comment);
            });
        });
    }

};

module.exports = pageObject;
export type AddCoverArtPageType = typeof pageObject;
