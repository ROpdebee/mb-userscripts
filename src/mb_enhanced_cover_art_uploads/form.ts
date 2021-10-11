import { assert } from '@lib/util/assert';
import { qs, qsa } from '@lib/util/dom';
import type { EditNote } from '@lib/MB/EditNote';
import type { FetchedImage, FetchedImages } from './fetch';
import type { ArtworkTypeIDs } from './providers/base';

export function enqueueImages({ images }: FetchedImages, defaultTypes: ArtworkTypeIDs[] = [], defaultComment = ''): void {
    images.forEach((image) => {
        enqueueImage(image, defaultTypes, defaultComment);
    });
}

function enqueueImage(image: FetchedImage, defaultTypes: ArtworkTypeIDs[], defaultComment: string): void {
    dropImage(image.content);
    // Calling this asynchronously to allow the event to be handled first. This
    // will also retry if it hasn't been handled yet.
    setTimeout(setImageParameters.bind(
        null,
        image.content.name,
        // Only use the defaults if the specific one is undefined
        image.types ?? defaultTypes,
        (image.comment ?? defaultComment).trim()));
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

function setImageParameters(imageName: string, imageTypes: ArtworkTypeIDs[], imageComment: string, triesRemaining = 5): void {
    // Find the row for this added image. We can't be 100% sure it's the last
    // added image, since another image may have been added in the meantime
    // as we're called asynchronously. We find the correct image via the file
    // name, which is guaranteed to be unique since we embed a unique ID into it.
    const pendingUploadRows = qsa<HTMLTableRowElement>('tbody[data-bind="foreach: files_to_upload"] > tr');
    const fileRow = pendingUploadRows.find((row) =>
        qs<HTMLSpanElement>('.file-info span[data-bind="text: name"]', row).innerText == imageName);

    // Try again if the artwork hasn't been queued yet
    if (!fileRow) {
        // This is likely an error on our part, so just assert here.
        assert(triesRemaining !== 0, `Could not find image ${imageName} in queued uploads`);
        setTimeout(setImageParameters.bind(null, imageName, imageTypes, imageComment, triesRemaining - 1), 500);
        return;
    }

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
