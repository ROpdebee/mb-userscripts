// Edit note helpers

import { qs } from './dom';

const separator = '\n–\n';

export class EditNote {
    #footer: string;
    #extraInfoLines: Set<string>;
    #editNoteTextArea: HTMLTextAreaElement;

    constructor(footer: string) {
        this.#footer = footer;
        this.#editNoteTextArea = qs('textarea.edit-note');
        // Maybe kept from page reload
        const existingInfoBlock = this.#editNoteTextArea.value.split(separator)[0] ?? '';
        if (existingInfoBlock) {
            this.#extraInfoLines = new Set(existingInfoBlock.split('\n').map((l) => l.trimRight()));
        } else {
            this.#extraInfoLines = new Set();
        }
    }

    addExtraInfo(infoLine: string) {
        if (this.#extraInfoLines.has(infoLine)) return;
        let [infoBlock, ...rest] = this.#editNoteTextArea.value.split(separator);
        infoBlock = infoBlock?.trim() ?? '';
        infoBlock += '\n' + infoLine;
        this.#editNoteTextArea.value = [infoBlock, ...rest].join(separator);
        this.#extraInfoLines.add(infoLine);
    }

    addFooter() {
        // Edit note content might be retained after page reload, or may have
        // already been partially filled. Search any previous content and
        // remove it
        this.#removePreviousFooter();
        const prevNote = this.#editNoteTextArea.value;
        this.#editNoteTextArea.value = [prevNote, separator, this.#footer].join('');
    }

    #removePreviousFooter() {
        const fragments = this.#editNoteTextArea.value.split(separator);
        const otherFragments = fragments.filter(
                (text) => !text.trim().startsWith(this.#footer));
        this.#editNoteTextArea.value = otherFragments.join(separator);
    }

    static withFooterFromGMInfo(): EditNote {
        const scriptMetadata = GM_info.script as unknown as { homepageURL: string, version: string, name: string };
        const footer = `${scriptMetadata.name} ${scriptMetadata.version}\n${scriptMetadata.homepageURL}`;
        return new EditNote(footer);
    }
};
