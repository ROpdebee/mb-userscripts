import type { ArtworkTypeIDs } from '@lib/MB/cover-art';
import type { EditNote } from '@lib/MB/edit-note';
import { cloneIntoPageContext, getFromPageContext } from '@lib/compat';
import { assertDefined } from '@lib/util/assert';
import { retryTimes } from '@lib/util/async';
import { qs, qsa } from '@lib/util/dom';

import type { QueuedImage, QueuedImageBatch } from './types';

export async function enqueueImage(image: QueuedImage): Promise<void> {
    dropImage(image.content);
    await retryTimes(setImageParameters.bind(
        null,
        image.content.name,
        image.types,
        image.comment.trim()), 5, 500);
}

function dropImage(imageData: File): void {
    // Greasemonkey acts up unless we use the page context `DataTransfer`.
    const DataTransfer = getFromPageContext('DataTransfer');
    const dataTransfer = new DataTransfer();

    // `files` is a readonly property, but we can circumvent that with Object.defineProperty.
    Object.defineProperty(dataTransfer, 'files', {
        value: cloneIntoPageContext([imageData]),
    });

    const dropEvent = new DragEvent('drop', { dataTransfer });

    qs('#drop-zone').dispatchEvent(dropEvent);
}

function setImageParameters(imageName: string, imageTypes: ArtworkTypeIDs[], imageComment: string): void {
    // Find the row for this added image. We can't be 100% sure it's the last
    // added image, since another image may have been added in the meantime
    // as we're called asynchronously. We find the correct image via the file
    // name, which is guaranteed to be unique since we embed a unique ID into it.
    const pendingUploadRows = qsa<HTMLTableRowElement>('tbody[data-bind="foreach: files_to_upload"] > tr');
    const fileRow = pendingUploadRows.find((row) =>
        qs<HTMLSpanElement>('.file-info span[data-bind="text: name"]', row).textContent == imageName);

    assertDefined(fileRow, `Could not find image ${imageName} in queued uploads`);

    // Set image types
    const checkboxesToCheck = qsa<HTMLInputElement>('ul.cover-art-type-checkboxes input[type="checkbox"]', fileRow)
        .filter((cbox) => imageTypes.includes(Number.parseInt(cbox.value)));
    for (const cbox of checkboxesToCheck) {
        cbox.checked = true;
        cbox.dispatchEvent(new Event('click'));
    }

    // Set comment if we should
    if (imageComment) {
        const commentInput = qs<HTMLInputElement>('div.comment > input.comment', fileRow);
        commentInput.value = imageComment;
        commentInput.dispatchEvent(new Event('change'));
    }
}

function fillEditNoteFragment(editNote: EditNote, images: QueuedImage[], containerUrl?: URL): void {
    const prefix = containerUrl ? ' * ' : '';

    if (containerUrl) {
        editNote.addExtraInfo(decodeURI(containerUrl.href));
    }

    for (const queuedUrl of images) {
        // Prevent noise from data: URLs
        if (queuedUrl.maximisedUrl.protocol === 'data:') {
            editNote.addExtraInfo(prefix + 'Uploaded from data URL');
            continue;
        }
        editNote.addExtraInfo(prefix + decodeURI(queuedUrl.originalUrl.href));
        if (queuedUrl.wasMaximised) {
            editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Maximised to ' + decodeURI(queuedUrl.maximisedUrl.href));
        }
        if (queuedUrl.wasRedirected) {
            editNote.addExtraInfo(' '.repeat(prefix.length) + '→ Redirected to ' + decodeURI(queuedUrl.finalUrl.href));
        }
    }
}

export function fillEditNote(allFetchedImages: QueuedImageBatch[], origin: string, editNote: EditNote): void {
    const totalNumberImages = allFetchedImages.reduce((accumulator, fetched) => accumulator + fetched.images.length, 0);
    // Nothing enqueued => Skip edit note altogether
    if (!totalNumberImages) return;

    // Limiting to 3 URLs to reduce noise
    const maxFilled = 3;
    let numberFilled = 0;
    for (const { containerUrl, images } of allFetchedImages) {
        const imagesToFill = images.slice(0, maxFilled - numberFilled);
        fillEditNoteFragment(editNote, imagesToFill, containerUrl);

        numberFilled += imagesToFill.length;
        if (numberFilled >= maxFilled) break;
    }

    if (totalNumberImages > maxFilled) {
        editNote.addExtraInfo(`…and ${totalNumberImages - maxFilled} additional image(s)`);
    }

    if (origin) {
        editNote.addExtraInfo(`Seeded from ${origin}`);
    }

    editNote.addFooter();
}
