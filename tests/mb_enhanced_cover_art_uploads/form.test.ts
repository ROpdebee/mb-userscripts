import path from 'path';
import fs from 'fs/promises';

import $ from 'jquery';
import { enqueueImages, fillEditNote } from '@src/mb_enhanced_cover_art_uploads/form';
import { ArtworkTypeIDs } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { EditNote } from '@lib/MB/EditNote';

// @ts-expect-error need to inject a jQuery
global.$ = $;

const fakeUrl = new URL('https://example.com');
function createDummyImage(name: string): File {
    return new File([new Blob(['1234'])], name);
}

describe('enqueuing images', () => {
    const mockHtml = '<div id="drop-zone"/><table><tbody data-bind="foreach: files_to_upload"/></table>';

    async function insertFileRows(evt: JQuery.TriggeredEvent): Promise<void> {
        const files = (evt.originalEvent as (DragEvent | undefined))?.dataTransfer?.files;
        if (!files) return;

        const fileRowPath = path.resolve('.', 'tests', 'test-data', 'mb_enhanced_cover_art_uploads', 'form-row.html');
        const rowHtml = await fs.readFile(fileRowPath, 'utf-8');

        for (let i = 0; i < files.length; i++) {
            document.querySelector('tbody')?.insertAdjacentHTML('beforeend', rowHtml.replace('%file-name%', files[i].name));
        }
    }

    function getSelectedTypes(row: HTMLTableRowElement | null): ArtworkTypeIDs[] {
        return [...row?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]') ?? []]
            .filter((input) => input.checked)
            .map((input) => parseInt(input.value));
    }

    function getComment(row: HTMLTableRowElement | null): string | undefined {
        return row?.querySelector<HTMLInputElement>('input.comment')?.value;
    }

    const onDropMock = jest.fn().mockImplementation(insertFileRows);

    beforeEach(() => {
        document.body.innerHTML = mockHtml;
        onDropMock.mockClear();
        $('#drop-zone').on('drop', onDropMock);
    });

    it('triggers the correct drop event', async () => {
        const image = createDummyImage('test.png');
        await enqueueImages({
            images: [{
                content: image,
                originalUrl: fakeUrl,
                maximisedUrl: fakeUrl,
                fetchedUrl: fakeUrl,
                wasRedirected: false,
                wasMaximised: false,
            }]
        });

        expect(onDropMock).toHaveBeenCalledOnce();
        expect(onDropMock).toHaveBeenCalledWith(expect.objectContaining({
            originalEvent: {
                dataTransfer: {
                    files: expect.toIncludeAnyMembers([image]),
                },
            },
        }));
    });

    it('fills the correct parameters', async () => {
        const image = createDummyImage('test.png');
        await enqueueImages({
            images: [{
                content: image,
                originalUrl: fakeUrl,
                maximisedUrl: fakeUrl,
                wasMaximised: false,
                fetchedUrl: fakeUrl,
                wasRedirected: false,
                types: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back],
                comment: 'test comment',
            }]
        });
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([ArtworkTypeIDs.Front, ArtworkTypeIDs.Back]);
        expect(getComment(row)).toBe('test comment');
    });

    it('uses the default parameters when none are set', async () => {
        const image = createDummyImage('test.png');
        await enqueueImages({
            images: [{
                content: image,
                originalUrl: fakeUrl,
                maximisedUrl: fakeUrl,
                wasMaximised: false,
                fetchedUrl: fakeUrl,
                wasRedirected: false,
            }]
        }, [ArtworkTypeIDs.Booklet], 'default comment');
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([ArtworkTypeIDs.Booklet]);
        expect(getComment(row)).toBe('default comment');
    });

    it('does not use default parameters when specific ones are set', async () => {
        const image = createDummyImage('test.png');
        await enqueueImages({
            images: [{
                content: image,
                originalUrl: fakeUrl,
                maximisedUrl: fakeUrl,
                wasMaximised: false,
                fetchedUrl: fakeUrl,
                wasRedirected: false,
                types: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back],
                comment: 'test comment',
            }]
        }, [ArtworkTypeIDs.Booklet], 'default comment');
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([ArtworkTypeIDs.Front, ArtworkTypeIDs.Back]);
        expect(getComment(row)).toBe('test comment');
    });

    it('allows specific types and comment to be empty', async () => {
        const image = createDummyImage('test.png');
        await enqueueImages({
            images: [{
                content: image,
                originalUrl: fakeUrl,
                maximisedUrl: fakeUrl,
                wasMaximised: false,
                fetchedUrl: fakeUrl,
                wasRedirected: false,
                types: [],
                comment: '',
            }]
        }, [ArtworkTypeIDs.Booklet], 'default comment');
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([]);
        expect(getComment(row)).toBe('');
    });

    it('fills the correct parameters for multiple images', async () => {
        const image1 = createDummyImage('test.1.png');
        const image2 = createDummyImage('test.2.png');

        await enqueueImages({
            images: [{
                content: image1,
                originalUrl: fakeUrl,
                maximisedUrl: fakeUrl,
                wasMaximised: false,
                fetchedUrl: fakeUrl,
                wasRedirected: false,
                types: [ArtworkTypeIDs.Front],
                comment: 'test comment',
            }, {
                content: image2,
                originalUrl: fakeUrl,
                maximisedUrl: fakeUrl,
                wasMaximised: false,
                fetchedUrl: fakeUrl,
                wasRedirected: false,
                types: [ArtworkTypeIDs.Back],
                comment: 'test comment 2',
            }]
        });
        const rows = document.querySelectorAll('tr');
        let row1, row2;
        if (rows[0].querySelector('.file-info span')?.textContent === 'test.1.png') {
            row1 = rows[0];
            row2 = rows[1];
        } else {
            row1 = rows[1];
            row2 = rows[0];
        }

        expect(getSelectedTypes(row1))
            .toStrictEqual([ArtworkTypeIDs.Front]);
        expect(getComment(row1)).toBe('test comment');
        expect(getSelectedTypes(row2))
            .toStrictEqual([ArtworkTypeIDs.Back]);
        expect(getComment(row2)).toBe('test comment 2');
    });
});

describe('filling edit notes', () => {
    let textarea: HTMLTextAreaElement;
    let editNote: EditNote;

    beforeEach(() => {
        document.body.innerHTML = '<textarea class="edit-note" />';
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        textarea = document.querySelector('textarea')!;
        editNote = new EditNote('test footer');
    });

    interface SharedSpecArgs {
        containerUrl?: URL
        prefix: string
    }

    const sharedSpec = (args: SharedSpecArgs): void => {
        const baseExpectedLines = args.containerUrl ? [args.containerUrl.href] : [];

        function createExpectedContent(expectedLines: string[]): string {
            const allExpectedLines = baseExpectedLines.concat(expectedLines).concat(['–', 'test footer']);
            return allExpectedLines.join('\n');
        }

        it('does not fill an edit note if no images were queued', () => {
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [],
            };

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe('');
        });

        it('fills information for non-maximised URL', () => {
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [{
                    originalUrl: fakeUrl,
                    maximisedUrl: fakeUrl,
                    wasMaximised: false,
                    fetchedUrl: fakeUrl,
                    wasRedirected: false,
                    content: createDummyImage('test.png'),
                }],
            };
            const expectedLines = [args.prefix + fakeUrl.href];

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills information for maximised URL', () => {
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [{
                    originalUrl: fakeUrl,
                    maximisedUrl: new URL('https://example.com/max'),
                    wasMaximised: true,
                    fetchedUrl: new URL('https://example.com/max'),
                    wasRedirected: false,
                    content: createDummyImage('test.png'),
                }],
            };
            const expectedLines = [
                args.prefix + fakeUrl.href,
                ' '.repeat(args.prefix.length) + '→ Maximised to https://example.com/max',
            ];

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills information for redirected URL', () => {
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [{
                    originalUrl: fakeUrl,
                    maximisedUrl: fakeUrl,
                    wasMaximised: false,
                    fetchedUrl: new URL('https://example.com/redirected'),
                    wasRedirected: true,
                    content: createDummyImage('test.png'),
                }],
            };
            const expectedLines = [
                args.prefix + fakeUrl.href,
                ' '.repeat(args.prefix.length) + '→ Redirected to https://example.com/redirected',
            ];

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills information for maximised and redirected URL', () => {
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [{
                    originalUrl: fakeUrl,
                    maximisedUrl: new URL('https://example.com/max'),
                    wasMaximised: true,
                    fetchedUrl: new URL('https://example.com/redirected'),
                    wasRedirected: true,
                    content: createDummyImage('test.png'),
                }],
            };
            const expectedLines = [
                args.prefix + fakeUrl.href,
                ' '.repeat(args.prefix.length) + '→ Maximised to https://example.com/max',
                ' '.repeat(args.prefix.length) + '→ Redirected to https://example.com/redirected',
            ];

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('skips data URLs', () => {
            const dataUrl = new URL('data:testtesttest');
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [{
                    originalUrl: dataUrl,
                    maximisedUrl: dataUrl,
                    wasMaximised: false,
                    fetchedUrl: dataUrl,
                    wasRedirected: false,
                    content: createDummyImage('test.png'),
                }],
            };
            const expectedLines = [
                args.prefix + 'Uploaded from data URL',
            ];

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills for multiple URLs', () => {
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [{
                    originalUrl: fakeUrl,
                    maximisedUrl: new URL('https://example.com/max'),
                    wasMaximised: true,
                    fetchedUrl: new URL('https://example.com/max'),
                    wasRedirected: false,
                    content: createDummyImage('test.png'),
                }, {
                    originalUrl: new URL('https://example.com/2'),
                    maximisedUrl: new URL('https://example.com/max2'),
                    wasMaximised: true,
                    fetchedUrl: new URL('https://example.com/max2'),
                    wasRedirected: false,
                    content: createDummyImage('test.png'),
                }],
            };
            const expectedLines = [
                args.prefix + fakeUrl.href,
                ' '.repeat(args.prefix.length) + '→ Maximised to https://example.com/max',
                args.prefix + 'https://example.com/2',
                ' '.repeat(args.prefix.length) + '→ Maximised to https://example.com/max2',
            ];

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills at most 3 URLs', () => {
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [{
                    originalUrl: new URL('https://example.com/1'),
                    maximisedUrl: new URL('https://example.com/1'),
                    fetchedUrl: new URL('https://example.com/1'),
                    wasRedirected: false,
                    wasMaximised: false,
                    content: createDummyImage('test.png'),
                }, {
                    originalUrl: new URL('https://example.com/2'),
                    maximisedUrl: new URL('https://example.com/2'),
                    fetchedUrl: new URL('https://example.com/2'),
                    wasRedirected: false,
                    wasMaximised: false,
                    content: createDummyImage('test.png'),
                }, {
                    originalUrl: new URL('https://example.com/3'),
                    maximisedUrl: new URL('https://example.com/3'),
                    fetchedUrl: new URL('https://example.com/3'),
                    wasRedirected: false,
                    wasMaximised: false,
                    content: createDummyImage('test.png'),
                }, {
                    originalUrl: new URL('https://example.com/4'),
                    maximisedUrl: new URL('https://example.com/4'),
                    fetchedUrl: new URL('https://example.com/4'),
                    wasRedirected: false,
                    wasMaximised: false,
                    content: createDummyImage('test.png'),
                }],
            };
            const expectedLines = [
                args.prefix + 'https://example.com/1',
                args.prefix + 'https://example.com/2',
                args.prefix + 'https://example.com/3',
                args.prefix + '…and 1 additional image(s)',
            ];

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('includes seeding origin if provided', () => {
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [{
                    originalUrl: fakeUrl,
                    maximisedUrl: fakeUrl,
                    fetchedUrl: fakeUrl,
                    wasRedirected: false,
                    wasMaximised: false,
                    content: createDummyImage('test.png'),
                }],
            };
            const expectedLines = [
                args.prefix + fakeUrl.href,
                'Seeded from seeding-origin',
            ];

            fillEditNote(fetchedImages, 'seeding-origin', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });
    };

    // eslint-disable-next-line jest/valid-describe
    describe('without container URL', sharedSpec.bind(null, {
        prefix: '',
    }));

    // eslint-disable-next-line jest/valid-describe
    describe('with container URL', sharedSpec.bind(null, {
        containerUrl: new URL('https://example.com/container'),
        prefix: ' * ',
    }));
});
