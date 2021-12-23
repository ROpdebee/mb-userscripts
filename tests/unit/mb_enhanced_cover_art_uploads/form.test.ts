import fs from 'fs/promises';
import path from 'path';

import $ from 'jquery';

import { ArtworkTypeIDs } from '@lib/MB/CoverArt';
import { EditNote } from '@lib/MB/EditNote';
import { enqueueImages, fillEditNote } from '@src/mb_enhanced_cover_art_uploads/form';

import { createFetchedImage, createImageFile } from './test-utils/dummy-data';

// @ts-expect-error need to inject a jQuery
global.$ = $;

describe('enqueuing images', () => {
    const mockHtml = '<div id="drop-zone"/><table><tbody data-bind="foreach: files_to_upload"/></table>';

    async function insertFileRows(evt: JQuery.TriggeredEvent): Promise<void> {
        const files = (evt.originalEvent as (DragEvent | undefined))?.dataTransfer?.files;
        if (!files) return;

        const fileRowPath = path.resolve('.', 'tests', 'test-data', 'mb_enhanced_cover_art_uploads', 'form-row.html');
        const rowHtml = await fs.readFile(fileRowPath, 'utf-8');

        for (const file of files) {
            document.querySelector('tbody')
                ?.insertAdjacentHTML('beforeend', rowHtml.replace('%file-name%', file.name));
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
        const image = createImageFile();
        await enqueueImages({
            images: [createFetchedImage({
                content: image,
            })],
        });

        expect(onDropMock).toHaveBeenCalledOnce();
        expect(onDropMock).toHaveBeenCalledWith(expect.objectContaining({
            originalEvent: {
                dataTransfer: {
                    files: [image],
                },
            },
        }));
    });

    it('fills the correct parameters', async () => {
        await enqueueImages({
            images: [createFetchedImage({
                types: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back],
                comment: 'test comment',
            })],
        });
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([ArtworkTypeIDs.Front, ArtworkTypeIDs.Back]);
        expect(getComment(row)).toBe('test comment');
    });

    it('uses the default parameters when none are set', async () => {
        await enqueueImages({
            images: [createFetchedImage()],
        }, [ArtworkTypeIDs.Booklet], 'default comment');
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([ArtworkTypeIDs.Booklet]);
        expect(getComment(row)).toBe('default comment');
    });

    it('does not use default parameters when specific ones are set', async () => {
        await enqueueImages({
            images: [createFetchedImage({
                types: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back],
                comment: 'test comment',
            })],
        }, [ArtworkTypeIDs.Booklet], 'default comment');
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([ArtworkTypeIDs.Front, ArtworkTypeIDs.Back]);
        expect(getComment(row)).toBe('test comment');
    });

    it('allows specific types and comment to be empty', async () => {
        await enqueueImages({
            images: [createFetchedImage({
                types: [],
                comment: '',
            })],
        }, [ArtworkTypeIDs.Booklet], 'default comment');
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([]);
        expect(getComment(row)).toBe('');
    });

    it('fills the correct parameters for multiple images', async () => {
        await enqueueImages({
            images: [
                createFetchedImage({
                    content: createImageFile({
                        name: 'test.1.png',
                    }),
                    types: [ArtworkTypeIDs.Front],
                    comment: 'test comment',
                }),
                createFetchedImage({
                    content: createImageFile({
                        name: 'test.2.png',
                    }),
                    types: [ArtworkTypeIDs.Back],
                    comment: 'test comment 2',
                }),
            ],
        });
        const rows = document.querySelectorAll('tr');
        let row1: HTMLTableRowElement, row2: HTMLTableRowElement;
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
        textarea = document.querySelector('textarea')!;
        editNote = new EditNote('test footer');
    });

    interface SharedSpecArgs {
        containerUrl?: URL;
        prefix: string;
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

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe('');
        });

        it('fills information for non-maximised URL', () => {
            const image = createFetchedImage();
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [image],
            };
            const expectedLines = [args.prefix + image.originalUrl.href];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills information for maximised URL', () => {
            const image = createFetchedImage({
                wasMaximised: true,
            });
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [image],
            };
            const expectedLines = [
                args.prefix + image.originalUrl.href,
                ' '.repeat(args.prefix.length) + '→ Maximised to ' + image.maximisedUrl.href,
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills information for redirected URL', () => {
            const image = createFetchedImage({
                wasRedirected: true,
            });
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [image],
            };
            const expectedLines = [
                args.prefix + image.originalUrl.href,
                ' '.repeat(args.prefix.length) + '→ Redirected to ' + image.fetchedUrl.href,
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills information for maximised and redirected URL', () => {
            const image = createFetchedImage({
                wasMaximised: true,
                wasRedirected: true,
            });
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [image],
            };
            const expectedLines = [
                args.prefix + image.originalUrl.href,
                ' '.repeat(args.prefix.length) + '→ Maximised to ' + image.maximisedUrl.href,
                ' '.repeat(args.prefix.length) + '→ Redirected to ' + image.fetchedUrl.href,
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('skips data URLs', () => {
            const image = createFetchedImage({
                originalUrl: new URL('data:testtesttest'),
            });
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [image],
            };
            const expectedLines = [
                args.prefix + 'Uploaded from data URL',
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills for multiple URLs', () => {
            const images = [
                createFetchedImage({
                    wasMaximised: true,
                }),
                createFetchedImage({
                    wasMaximised: true,
                }),
            ];
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images,
            };
            const expectedLines = [
                args.prefix + images[0].originalUrl.href,
                ' '.repeat(args.prefix.length) + '→ Maximised to ' + images[0].maximisedUrl.href,
                args.prefix + images[1].originalUrl.href,
                ' '.repeat(args.prefix.length) + '→ Maximised to ' + images[1].maximisedUrl.href,
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills at most 3 URLs', () => {
            const images = [
                createFetchedImage(),
                createFetchedImage(),
                createFetchedImage(),
                createFetchedImage(),
            ];
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images,
            };
            const expectedLines = [
                args.prefix + images[0].originalUrl.href,
                args.prefix + images[1].originalUrl.href,
                args.prefix + images[2].originalUrl.href,
                '…and 1 additional image(s)',
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills at most 3 URLs with separate fetch results', () => {
            const images = [
                createFetchedImage(),
                createFetchedImage(),
                createFetchedImage(),
                createFetchedImage(),
            ];
            const fetchedImages = images.map((img) => {
                return {
                    containerUrl: args.containerUrl,
                    images: [img],
                };
            });
            // The edit note filler removes the duplicate container URL.
            const expectedLines = [
                args.prefix + images[0].originalUrl.href,
                args.prefix + images[1].originalUrl.href,
                args.prefix + images[2].originalUrl.href,
                '…and 1 additional image(s)',
            ];

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('includes seeding origin if provided', () => {
            const image = createFetchedImage();
            const fetchedImages = {
                containerUrl: args.containerUrl,
                images: [image],
            };
            const expectedLines = [
                args.prefix + image.originalUrl.href,
                'Seeded from seeding-origin',
            ];

            fillEditNote([fetchedImages], 'seeding-origin', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });
    };

    // eslint-disable-next-line jest/valid-describe-callback
    describe('without container URL', sharedSpec.bind(null, {
        prefix: '',
    }));

    // eslint-disable-next-line jest/valid-describe-callback
    describe('with container URL', sharedSpec.bind(null, {
        containerUrl: new URL('https://example.com/container'),
        prefix: ' * ',
    }));
});
