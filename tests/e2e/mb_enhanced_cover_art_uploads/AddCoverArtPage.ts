import { createHash } from 'crypto';
import expect from 'expect';
import { $enum } from 'ts-enum-util';
import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { assertDefined } from '@lib/util/assert';

const { I } = inject();

export interface ExpectedArtworkType {
    name: string;
    // Can be undefined for PDFs, as their payload is a static image.
    contentDigest?: string;
    types: ArtworkTypeIDs[];
    comment: string;
}

const pageObject = {

    // insert your locators and methods here
    fields: {
        pasteUrl: 'input#ROpdebee_paste_url',
        frontOnly: 'input#ROpdebee_paste_front_only',
        editNote: '[id="id-add-cover-art.edit_note"]',
    },
    addFilesContainer: '.add-files.row',

    hasNumberOfQueuedArtworks(expectedNumber: number): void {
        I.seeNumberOfElements({ css: '.uploader-preview-column' }, expectedNumber);
    },

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
            if (typeof expectedArtwork.contentDigest !== 'undefined') {
                const imgSrc = await I.grabAttributeFrom({ css: '.uploader-preview-column > img' }, 'src');
                const imgDigest = createHash('md5').update(imgSrc.split(',')[1], 'base64').digest('hex');
                expect(imgDigest).toBe(expectedArtwork.contentDigest);
            }

            // Check whether the checked types matches the ones we expect
            $enum(ArtworkTypeIDs).forEach((value) => {
                const checker = (expectedArtwork.types.includes(value)
                    ? I.seeCheckboxIsChecked
                    : I.dontSeeCheckboxIsChecked)
                    .bind(I);
                checker({ css: `.cover-art-type-checkboxes input[value="${value}"]`});
            });

            // Check that comment value matches the one we expect
            // We can't use I.seeInField because it can use the wrong method to
            // retrieve values (`getElementAttribute`), which may not work on
            // some browsers. Moreover, it does a partial match, we need a full
            // comparison.
            I.useWebDriverTo('see that comment is correct', async ({ browser }) => {
                const comment = await browser.$('input.comment').then((inp) => inp.getValue());
                expect(comment).toBe(expectedArtwork.comment);
            });
        });
    },

    async hasEditNote(expectedEditNoteBody: string | RegExp): Promise<void> {
        const footerRegex = new RegExp(`–
MB: Enhanced Cover Art Uploads [\\d\\.]+
https://github\\.com/ROpdebee/mb-userscripts$`);

        // Don't use seeInField since we need to match a regex due to the
        // script version, as well as for the reasons stated in the comment
        // check above.
        I.useWebDriverTo('see that edit note is correct', async ({ browser }) => {
            const actualEditNote = await browser.$(this.fields.editNote)
                .then((el) => el.getValue())
                .then((val) => val.trim());
            if (typeof expectedEditNoteBody === 'string') {
                const endIdx = expectedEditNoteBody.length;
                expect(actualEditNote.slice(0, endIdx)).toBe(expectedEditNoteBody);
                expect(actualEditNote.slice(endIdx).trim()).toMatch(new RegExp(`^${footerRegex.source}`));
            } else {
                const match = actualEditNote.match(footerRegex);
                expect(match).toBeTruthy();
                const endIdx = match?.index;
                assertDefined(endIdx);
                expect(actualEditNote.slice(0, endIdx).trim()).toMatch(expectedEditNoteBody);
            }
        });
    },

};

module.exports = pageObject;
export type AddCoverArtPageType = typeof pageObject;
