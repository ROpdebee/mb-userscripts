import { assertDefined } from '@lib/util/assert';
import { retryTimes } from '@lib/util/async';
import { qs, qsa } from '@lib/util/dom';
import type { EditNote } from '@lib/MB/EditNote';
import type { FetchedImage, FetchedImages } from './fetch';
import type { ArtworkTypeIDs } from './providers/base';

export async function enqueueImages({ images }: FetchedImages, defaultTypes: ArtworkTypeIDs[] = [], defaultComment = ''): Promise<void> {
    await Promise.all(images.map((image) => {
        return enqueueImage(image, defaultTypes, defaultComment);
    }));
}

async function enqueueImage(image: FetchedImage, defaultTypes: ArtworkTypeIDs[], defaultComment: string): Promise<void> {
    dropImage(image.content);
    await retryTimes(setImageParameters.bind(
        null,
        image.content.name,
        // Only use the defaults if the specific one is undefined
        image.types ?? defaultTypes,
        (image.comment ?? defaultComment).trim()), 5, 500);
}

function dropImage(imageData: File): void {
    // Fake event to trigger the drop event on the drag'n'drop element
    // Using jQuery because native JS cannot manually trigger such events
    // for security reasons
    const dropEvent = $.Event('drop') as JQuery.TriggeredEvent;
    dropEvent.originalEvent = {
        dataTransfer: { files: [imageData] }
    } as unknown as DragEvent;

    // Note that we're using MB's own jQuery here, not a script-local one.
    // We need to reuse MB's own jQuery to be able to trigger the event
    // handler.
    $('#drop-zone').trigger(dropEvent);
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
        .filter((cbox) => imageTypes.includes(parseInt(cbox.value)));
    checkboxesToCheck.forEach((cbox) => {
        cbox.checked = true;
        cbox.dispatchEvent(new Event('click'));
    });

    // Set comment if we should
    if (imageComment) {
        const commentInput = qs<HTMLInputElement>('div.comment > input.comment', fileRow);
        commentInput.value = imageComment;
        commentInput.dispatchEvent(new Event('change'));
    }
}

export function fillEditNote({ images, containerUrl }: FetchedImages, origin: string, editNote: EditNote): void {
    // Nothing enqueued => Skip edit note altogether
    if (!images.length) return;

    let prefix = '';
    if (containerUrl) {
        prefix = ' * ';
        editNote.addExtraInfo(containerUrl.href);
    }

    // Limiting to 3 URLs to reduce noise
    for (const queuedUrl of images.slice(0, 3)) {
        // Prevent noise from data: URLs
        if (queuedUrl.maximisedUrl.protocol === 'data:') {
            editNote.addExtraInfo(prefix + 'Uploaded from data URL');
            continue;
        }
        editNote.addExtraInfo(prefix + queuedUrl.maximisedUrl.href);
        if (queuedUrl.wasMaximised) {
            editNote.addExtraInfo(' '.repeat(prefix.length) + 'Maximised from ' + queuedUrl.originalUrl.href);
        }
    }

    if (images.length > 3) {
        editNote.addExtraInfo(prefix + `…and ${images.length - 3} additional images`);
    }

    if (origin) {
        editNote.addExtraInfo(`Seeded from ${origin}`);
    }

    editNote.addFooter();
}
