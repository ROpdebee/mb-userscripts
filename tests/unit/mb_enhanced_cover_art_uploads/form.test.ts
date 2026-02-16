import fs from 'node:fs/promises';
import path from 'node:path';

import { ArtworkTypeIDs } from '@lib/MB/cover-art';
import { EditNote } from '@lib/MB/edit-note';
import { qs } from '@lib/util/dom';
import { enqueueImage, fillEditNote } from '@src/mb_enhanced_cover_art_uploads/form';

import { createImageFile, createQueuedImage } from './test-utils/dummy-data';

beforeAll(() => {
    // Need to mock DataTransfer and DragEvent.
    class DataTransfer {
        public readonly files: File[];

        public constructor(files: File[]) {
            this.files = files;
        }
    }

    class DragEvent {
        public readonly dataTransfer: DataTransfer;

        public constructor(_type: string, initializationOptions: { dataTransfer: DataTransfer }) {
            this.dataTransfer = initializationOptions.dataTransfer;
        }
    }

    global.DataTransfer = DataTransfer as unknown as typeof window.DataTransfer;
    global.DragEvent = DragEvent as unknown as typeof window.DragEvent;
});

async function insertFileRows(event: DragEvent): Promise<void> {
    const files = event.dataTransfer?.files;
    if (!files) return;

    const fileRowPath = path.resolve('.', 'tests', 'test-data', 'mb_enhanced_cover_art_uploads', 'form-row.html');
    const rowHtml = await fs.readFile(fileRowPath, 'utf8');

    for (const file of files) {
        document.querySelector('tbody')
            ?.insertAdjacentHTML('beforeend', rowHtml.replace('%file-name%', file.name));
    }
}

function getSelectedTypes(row: HTMLTableRowElement | null): ArtworkTypeIDs[] {
    return [...row?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]') ?? []]
        .filter((input) => input.checked)
        .map((input) => Number.parseInt(input.value));
}

function getComment(row: HTMLTableRowElement | null): string | undefined {
    return row?.querySelector<HTMLInputElement>('input.comment')?.value;
}

describe('enqueuing images', () => {
    const mockHtml = '<div id="drop-zone"/><table><tbody data-bind="foreach: files_to_upload"/></table>';

    beforeEach(() => {
        document.body.innerHTML = mockHtml;
        jest.spyOn(qs<HTMLElement>('#drop-zone'), 'dispatchEvent').mockImplementation((event) => {
            void insertFileRows(event as unknown as DragEvent);
            return true;
        });
    });

    it('triggers the correct drop event', async () => {
        const image = createImageFile();
        await enqueueImage(createQueuedImage({
            content: image,
        }));

        expect(document.querySelector('tr')).not.toBeNil();
    });

    it('fills the correct parameters', async () => {
        await enqueueImage(createQueuedImage({
            types: [ArtworkTypeIDs.Front, ArtworkTypeIDs.Back],
            comment: 'test comment',
        }));
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([ArtworkTypeIDs.Front, ArtworkTypeIDs.Back]);
        expect(getComment(row)).toBe('test comment');
    });

    it('uses the default parameters when none are set', async () => {
        await enqueueImage(createQueuedImage({ types: [ArtworkTypeIDs.Booklet], comment: 'default comment' }));
        const row = document.querySelector('tr');

        expect(getSelectedTypes(row))
            .toStrictEqual([ArtworkTypeIDs.Booklet]);
        expect(getComment(row)).toBe('default comment');
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

    interface SharedSpecificationArguments {
        containerUrl?: URL;
        prefix: string;
    }

    const sharedSpec = (arguments_: SharedSpecificationArguments): void => {
        const baseExpectedLines = arguments_.containerUrl ? [arguments_.containerUrl.href] : [];

        function createExpectedContent(expectedLines: string[]): string {
            const allExpectedLines = [...baseExpectedLines, ...expectedLines, '–', 'test footer'];
            return allExpectedLines.join('\n');
        }

        it('does not fill an edit note if no images were queued', () => {
            const fetchedImages = {
                containerUrl: arguments_.containerUrl,
                jobUrl: arguments_.containerUrl ?? new URL('https://example.com/'),
                images: [],
            };

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe('');
        });

        it('fills information for non-maximised URL', () => {
            const image = createQueuedImage();
            const fetchedImages = {
                containerUrl: arguments_.containerUrl,
                jobUrl: arguments_.containerUrl ?? image.originalUrl,
                images: [image],
            };
            const expectedLines = [arguments_.prefix + image.originalUrl.href];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills information for maximised URL', () => {
            const image = createQueuedImage({
                wasMaximised: true,
            });
            const fetchedImages = {
                containerUrl: arguments_.containerUrl,
                jobUrl: arguments_.containerUrl ?? image.originalUrl,
                images: [image],
            };
            const expectedLines = [
                arguments_.prefix + image.originalUrl.href,
                ' '.repeat(arguments_.prefix.length) + '→ Maximised to ' + image.maximisedUrl.href,
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills information for redirected URL', () => {
            const image = createQueuedImage({
                wasRedirected: true,
            });
            const fetchedImages = {
                containerUrl: arguments_.containerUrl,
                jobUrl: arguments_.containerUrl ?? image.originalUrl,
                images: [image],
            };
            const expectedLines = [
                arguments_.prefix + image.originalUrl.href,
                ' '.repeat(arguments_.prefix.length) + '→ Redirected to ' + image.finalUrl.href,
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills information for maximised and redirected URL', () => {
            const image = createQueuedImage({
                wasMaximised: true,
                wasRedirected: true,
            });
            const fetchedImages = {
                containerUrl: arguments_.containerUrl,
                jobUrl: arguments_.containerUrl ?? image.originalUrl,
                images: [image],
            };
            const expectedLines = [
                arguments_.prefix + image.originalUrl.href,
                ' '.repeat(arguments_.prefix.length) + '→ Maximised to ' + image.maximisedUrl.href,
                ' '.repeat(arguments_.prefix.length) + '→ Redirected to ' + image.finalUrl.href,
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('skips data URLs', () => {
            const image = createQueuedImage({
                originalUrl: new URL('data:testtesttest'),
            });
            const fetchedImages = {
                containerUrl: arguments_.containerUrl,
                jobUrl: arguments_.containerUrl ?? image.originalUrl,
                images: [image],
            };
            const expectedLines = [
                arguments_.prefix + 'Uploaded from data URL',
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills for multiple URLs', () => {
            const images = [
                createQueuedImage({
                    wasMaximised: true,
                }),
                createQueuedImage({
                    wasMaximised: true,
                }),
            ];
            const fetchedImages = {
                containerUrl: arguments_.containerUrl,
                jobUrl: arguments_.containerUrl ?? images[0].originalUrl,
                images,
            };
            const expectedLines = [
                arguments_.prefix + images[0].originalUrl.href,
                ' '.repeat(arguments_.prefix.length) + '→ Maximised to ' + images[0].maximisedUrl.href,
                arguments_.prefix + images[1].originalUrl.href,
                ' '.repeat(arguments_.prefix.length) + '→ Maximised to ' + images[1].maximisedUrl.href,
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills at most 3 URLs', () => {
            const images = [
                createQueuedImage(),
                createQueuedImage(),
                createQueuedImage(),
                createQueuedImage(),
            ];
            const fetchedImages = {
                containerUrl: arguments_.containerUrl,
                jobUrl: arguments_.containerUrl ?? images[0].originalUrl,
                images,
            };
            const expectedLines = [
                arguments_.prefix + images[0].originalUrl.href,
                arguments_.prefix + images[1].originalUrl.href,
                arguments_.prefix + images[2].originalUrl.href,
                '…and 1 additional image(s)',
            ];

            fillEditNote([fetchedImages], '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('fills at most 3 URLs with separate fetch results', () => {
            const images = [
                createQueuedImage(),
                createQueuedImage(),
                createQueuedImage(),
                createQueuedImage(),
            ];
            const fetchedImages = images.map((image) => {
                return {
                    containerUrl: arguments_.containerUrl,
                    jobUrl: arguments_.containerUrl ?? images[0].originalUrl,
                    images: [image],
                };
            });
            // The edit note filler removes the duplicate container URL.
            const expectedLines = [
                arguments_.prefix + images[0].originalUrl.href,
                arguments_.prefix + images[1].originalUrl.href,
                arguments_.prefix + images[2].originalUrl.href,
                '…and 1 additional image(s)',
            ];

            fillEditNote(fetchedImages, '', editNote);

            expect(textarea.value).toBe(createExpectedContent(expectedLines));
        });

        it('includes seeding origin if provided', () => {
            const image = createQueuedImage();
            const fetchedImages = {
                containerUrl: arguments_.containerUrl,
                jobUrl: arguments_.containerUrl ?? image.originalUrl,
                images: [image],
            };
            const expectedLines = [
                arguments_.prefix + image.originalUrl.href,
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
