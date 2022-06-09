// Edit note helpers

import { GMinfo } from '@lib/compat';
import { qs } from '@lib/util/dom';

const separator = '\n–\n';

export class EditNote {
    private readonly footer: string;
    private readonly extraInfoLines: Set<string>;
    private readonly editNoteTextArea: HTMLTextAreaElement;

    constructor(footer: string) {
        this.footer = footer;
        this.editNoteTextArea = qs('textarea.edit-note');
        // Maybe kept from page reload
        const existingInfoBlock = this.editNoteTextArea.value.split(separator)[0];
        this.extraInfoLines = new Set(
            existingInfoBlock
                ? existingInfoBlock.split('\n').map((l) => l.trimEnd())
                : null);
    }

    addExtraInfo(infoLine: string): void {
        if (this.extraInfoLines.has(infoLine)) return;
        // eslint-disable-next-line prefer-const
        let [infoBlock, ...rest] = this.editNoteTextArea.value.split(separator);
        infoBlock = (infoBlock + '\n' + infoLine).trim();
        this.editNoteTextArea.value = [infoBlock, ...rest].join(separator);
        this.extraInfoLines.add(infoLine);
    }

    addFooter(): void {
        // Edit note content might be retained after page reload, or may have
        // already been partially filled. Search any previous content and
        // remove it
        this.removePreviousFooter();
        const prevNote = this.editNoteTextArea.value;
        this.editNoteTextArea.value = [prevNote, separator, this.footer].join('');
    }

    private removePreviousFooter(): void {
        const fragments = this.editNoteTextArea.value.split(separator);
        const otherFragments = fragments.filter(
            (text) => text.trim() !== this.footer);
        this.editNoteTextArea.value = otherFragments.join(separator);
    }

    static withFooterFromGMInfo(): EditNote {
        const scriptMetadata = GMinfo.script;
        // namespace should be the homepage URL (homepageURL and homepage are not available in all userscript managers)
        const footer = `${scriptMetadata.name} ${scriptMetadata.version}\n${scriptMetadata.namespace}`;
        return new EditNote(footer);
    }
}
