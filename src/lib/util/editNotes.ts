// Edit note helpers

import type { UserscriptMetadata } from 'userscriptMetadata';
import { qs } from './dom';

const separator = '\n–\n';

export class EditNote {
    #preamble: string;
    #extraInfoLines: string[];  // Could be a Set too, but we need the ordering
    #editNoteTextArea: HTMLTextAreaElement;

    constructor(preamble: string) {
        this.#preamble = preamble;
        this.#extraInfoLines = [];
        this.#editNoteTextArea = qs('textarea.edit-note');
    }

    addExtraInfo(infoLine: string) {
        if (this.#extraInfoLines.includes(infoLine)) return;
        this.#extraInfoLines.push(infoLine);
    }

    fill() {
        // Edit note content might be retained after page reload, or may have
        // already been partially filled. Search any previous content and
        // remove it
        this.#removePreviousFragment();
        const fragment = [this.#preamble, ...this.#extraInfoLines].join('\n');
        let prevNote = this.#editNoteTextArea.value;
        this.#editNoteTextArea.value = [prevNote, separator, fragment].join('');
    }

    #removePreviousFragment() {
        const fragments = this.#editNoteTextArea.value.split(separator);
        const otherFragments = fragments.filter(
                (text) => !text.trim().startsWith(this.#preamble));
        this.#editNoteTextArea.value = otherFragments.join(separator);
    }

    static withPreambleFromGMInfo(): EditNote {
        const preamble = `${GM_info.script.name} ${GM_info.script.version}`;
        return new EditNote(preamble);
    }
};
