import { GMdeleteValue, GMgetValue, GMinfo, GMsetValue } from '@lib/compat';
import { difference, groupBy, intersect } from '@lib/util/array';
import { logFailure } from '@lib/util/async';
import { onAddEntityDialogLoaded } from '@lib/util/dom';

import { agencyNameToID, validateCode, VERSION as CODES_VERSION } from './identifiers';
import { validateCodes } from './validate';

//////////////
// Utils
//////////////

function findDivByText(parent: HTMLElement, text: string): HTMLElement[] {
    const divs = [...parent.querySelectorAll('div')];
    return divs.filter((n) => n.textContent?.trim() === text);
}

interface WorkCodeData {
    source: string;
    iswcs: string[];
    agencyCodes: Record<string, string[]>;
    title: string;
}

//////////////
// MB
//////////////


const LOG_STYLES = {
    'error': 'background-color: FireBrick; color: white; font-weight: bold;',
    'warning': 'background-color: Gold;',
    'info': 'background-color: GainsBoro;',
    'success': 'background-color: LightGreen;',
};

function normaliseID(id: string, agencyKey: string): string {
    const formatResult = validateCode(id, agencyKey);
    if (!formatResult.isValid) {
        return id.replace(/^0+|[.\s-]/g, '');
    }

    return formatResult.formattedCode;
}

/**
 * Convert translated agency IDs into English variant.
 * TODO: There needs to be a better way to do this without hardcoding...
 */
function normaliseAgencyId(agencyId: string): string {
    return agencyId
        .replace(/-ID$/, ' ID')  // German and Dutch use e.g. 'ASCAP-ID'.
        .replace(/^ID (.+)/, '$1 ID')  // French and Italian use 'ID ASCAP'
        .replace(/-tunniste$/, ' ID');  // Finnish
    // TODO: "PRS tune code" is heavily translated in French etc. We need a more
    // robust way of converting those.
}

function getSelectedID(select: HTMLSelectElement): string {
    return normaliseAgencyId(select.options[select.selectedIndex].text.trim());
}

function setRowKey(select: HTMLSelectElement, agencyKey: string): void {
    const idx = [...select.options].findIndex((opt) => normaliseAgencyId(opt.text.trim()) === agencyKey);
    if (idx < 0) {
        throw new Error('Unknown agency key');
    }
    select.selectedIndex = idx;
}

function computeAgencyConflicts(mbCodes: Map<string, string[]>, extCodes: Map<string, string[]>): Array<[string, string[], string[]]> {
    // Conflicting IDs when MB already has IDs for this key and the external codes
    // don't match the IDs that MB already has
    const commonKeys = intersect(Object.keys(mbCodes), Object.keys(extCodes));
    return commonKeys
        .filter((k) => mbCodes.get(k)!.length > 0) // No MB codes => no conflicts
        .filter((k) => difference(
            extCodes.get(k)!.map((c) => normaliseID(c, k)),
            mbCodes.get(k)!.map((c) => normaliseID(c, k)),
        ).length)
        .map((k) => [k, mbCodes.get(k)!, extCodes.get(k)!]);
}


function extractCodes(data: WorkCodeData): Map<string, string[]> {
    const transformed = Object.entries(data.agencyCodes)
        .map(([key, codes]): [string, string[]] => [agencyNameToID(key), codes]);
    return new Map(transformed);
}

function deduplicateCodes(codes: string[], key: string): string[] {
    const seen = new Set();
    // We can't just map with normaliseID and convert to Set and back to array,
    // since we must retain the original code value before cleanup, as the user
    // might opt not to auto-format the codes.
    const results = [];
    for (const code of codes) {
        if (seen.has(normaliseID(code, key))) continue;
        seen.add(normaliseID(code, key));
        results.push(code);
    }
    return results;
}

function fillInput(inp: HTMLInputElement, val: string): void {
    inp.value = val;
    inp.style.backgroundColor = 'yellow';
}

// Style and concept by loujine
// https://github.com/loujine/musicbrainz-scripts/blob/master/mbz-loujine-common.js (MIT license).
const mainUIHTML = `<div id="ropdebee-work-menu"
        style="background-color: white;
        padding: 8px; margin: 0px -6px 6px 550px;
        border: 5px dotted rgb(115, 109, 171);">
    <h2>ROpdebee's work code tools</h2><br/>
    <div class="buttons">
        <button type="button" id="ROpdebee_MB_Paste_Work"
                title="Fill work codes from previously copied agency data."
                style="cursor: help;"
            >Fill work codes</button>
        <button type="button" id="ROpdebee_MB_Format_Codes"
                title="Correct work code formatting (EXPERIMENTAL)."
                style="cursor: help;"
            >Format work codes</button>
        <input type="checkbox" id="ROpdebee_MB_Autoformat_Codes">
        <label for="ROpdebee_MB_Autoformat_Codes">Automatically format work codes on paste (EXPERIMENTAL)</label>
    </div>
    <div id="ROpdebee_MB_Paste_Work_Log" style="display: none; max-height: 100px; overflow: auto;"><h3>Log</h3></div>
    <div id="ROpdebee_MB_Code_Validation_Errors" style="display: none;"><h3>Validation errors</h3></div>
</div>`;

const VALIDATION_LOG_QUERY = 'div#ROpdebee_MB_Code_Validation_Errors';

abstract class BaseWorkForm {
    protected readonly form: HTMLFormElement;

    public constructor(theForm: HTMLFormElement) {
        this.form = theForm;
        this.form.ROpdebee_Work_Codes_Found = true; // Prevent processing it again

        this.addToolsUI();
        this.activateButtons();
        this.checkExistingCodes();
    }

    protected abstract addToolsUI(): void;

    private activateButtons(): void {
        // The button to paste work codes
        this.form.querySelector('button#ROpdebee_MB_Paste_Work')!
            .addEventListener('click', (evt) => {
                evt.preventDefault();
                // Since we use an arrow function, current `this` is the instance itself.
                // We need to bind it properly to give a method reference though.
                this.resetLog();
                this.readData(this.checkAndFill.bind(this));
            });

        this.form.querySelector('button#ROpdebee_MB_Format_Codes')!
            .addEventListener('click', (evt) => {
                evt.preventDefault();
                this.resetLog();
                const formattedAny = this.formatExistingCodes();
                if (formattedAny) {
                    this.fillEditNote([], 'existing', true);
                }
            });

        const autoFormatCheckbox = this.form.querySelector<HTMLInputElement>('input#ROpdebee_MB_Autoformat_Codes')!;
        autoFormatCheckbox
            .addEventListener('change', (evt) => {
                evt.preventDefault();
                const target = evt.target as HTMLInputElement;
                if (target.checked) {
                    localStorage.setItem(target.id, 'delete me to disable');
                } else {
                    localStorage.removeItem(target.id);
                }
            });
        autoFormatCheckbox.checked = !!localStorage.getItem('ROpdebee_MB_Autoformat_Codes');
    }

    private checkExistingCodes(): void {
        this.resetValidationLog();
        this.existingCodeInputs.forEach(({ select, input }) => {
            const agencyKey = getSelectedID(select);
            const agencyCode = input.value;
            const checkResult = validateCode(agencyCode, agencyKey);

            if (!checkResult.isValid) {
                input.style.backgroundColor = 'red';
                this.addValidationError(agencyKey, agencyCode, checkResult.message);
            } else if (checkResult.wasChanged) {
                input.style.backgroundColor = 'orange';
                this.addFormatWarning(agencyKey, agencyCode);
            }
        });
    }

    private formatExistingCodes(): boolean {
        let formattedAny = false;
        this.existingCodeInputs.forEach(({ select, input }) => {
            const agencyKey = getSelectedID(select);
            const agencyCode = input.value;
            const checkResult = validateCode(agencyCode, agencyKey);

            if (checkResult.isValid && checkResult.wasChanged) {
                fillInput(input, checkResult.formattedCode);
                this.log('info', `Changed ${agencyKey} ${agencyCode} to ${checkResult.formattedCode}`);
                formattedAny = true;
            }
        });

        return formattedAny;
    }

    private resetLog(): void {
        const logDiv = this.form.querySelector<HTMLDivElement>('div#ROpdebee_MB_Paste_Work_Log')!;
        logDiv.style.display = 'none';
        [...logDiv.children]
            .slice(1)  // Skip the heading
            .forEach((el) => {
                el.remove();
            });
    }

    private resetValidationLog(): void {
        const logDiv = this.form.querySelector<HTMLDivElement>(VALIDATION_LOG_QUERY)!;
        logDiv.style.display = 'none';
        [...logDiv.children]
            .slice(1)  // Skip the heading
            .forEach((el) => {
                el.remove();
            });
    }

    private get autoformatCodes(): boolean {
        return this.form.querySelector<HTMLInputElement>('input#ROpdebee_MB_Autoformat_Codes')!.checked;
    }

    private get existingCodeInputs(): Array<{ select: HTMLSelectElement; input: HTMLInputElement }> {
        return [...this.form
            .querySelectorAll('table#work-attributes tr')]
            .map((row) => ({
                'select': row.querySelector<HTMLSelectElement>('td > select'),
                'input': row.querySelector<HTMLInputElement>('td > input'),
            }))
            .filter(({ select, input }) =>
                select !== null && select.selectedIndex !== 0
                && input !== null && input.value) as Array<{ select: HTMLSelectElement; input: HTMLInputElement }>;
    }

    private get existingCodes(): Map<string, string[]> {
        return groupBy(
            this.existingCodeInputs,
            ({ select }) => getSelectedID(select),
            ({ input: { value }}) => value);
    }

    private get existingISWCs(): string[] {
        return [...this.form
            .querySelectorAll<HTMLInputElement>('input[name^="edit-work.iswcs."]')]
            .map(({ value }) => value)
            .filter(({ length }) => length);
    }

    private findEmptyRow(parentSelector: string, inputName: string): HTMLInputElement {
        const parent = this.form.querySelector(parentSelector)!;
        const rows = [...parent.querySelectorAll<HTMLInputElement>('input[name*="' + inputName + '"]')];
        const emptyRows = rows.filter(({ value }) => value.length === 0);
        if (emptyRows.length > 0) {
            return emptyRows[0];
        }

        // Need to add a new row
        const newRowBtn = parent.querySelector<HTMLButtonElement>('button.add-item')!;
        newRowBtn.click();
        return this.findEmptyRow(parentSelector, inputName);
    }

    private checkAndFill(rawData: string): void {
        const data = this.parseData(rawData);
        console.log(data);
        if (data === null) return;
        const externalCodes = extractCodes(data);
        const externalISWCs = data.iswcs;
        const mbCodes = this.existingCodes;
        const mbISWCs = this.existingISWCs;

        // Sanity check
        const dupeAgencies = [...externalCodes.entries()]
            .filter(([, codes]) => codes.length > 1)
            .map(([key]) => key);
        if (dupeAgencies.length > 0) {
            const lis = dupeAgencies.reduce((acc, agency) => {
                return acc + `<li>${agency}: ${externalCodes.get(agency)!.join(', ')}</li>`;
            }, '');
            this.log('warning', `
                Found duplicate work codes in input.
                Please double-check whether all of these codes belong to this work.
                <ul>${lis}</ul>`);
        }

        const newISWCs = difference(externalISWCs, mbISWCs);
        const conflicts = computeAgencyConflicts(mbCodes, externalCodes);
        if (newISWCs.length > 0 && mbISWCs.length > 0) {
            conflicts.unshift(['ISWC', mbISWCs, externalISWCs]);
        }

        // Confirm in case of conflicts.
        const confirmProm = conflicts.length > 0 ? this.promptForConfirmation(conflicts) : Promise.resolve();
        logFailure(confirmProm.then(() => {
            const newCodes = this.retainOnlyNew(externalCodes, mbCodes);
            this.fillData(newISWCs, newCodes, data['title'], data['source']);
            const numWarnings = this.form.querySelectorAll('div#ROpdebee_MB_Paste_Work_Log > div').length;
            this.log('success', 'Filled successfully' + (numWarnings ? ` (${numWarnings} message(s))` : ''));
        }));
    }

    private retainOnlyNew(externalCodes: Map<string, string[]>, mbCodes: Map<string, string[]>): Map<string, string[]> {
        const acc = new Map<string, string[]>();
        for (const [key, rawCodes] of externalCodes) {
            const codes = deduplicateCodes(rawCodes, key);
            if (!mbCodes.has(key)) {
                acc.set(key, codes);
            } else {
                const mbNormCodes = new Set(mbCodes.get(key)!.map((c) => normaliseID(c, key)));
                acc.set(key, codes.filter((id) => !mbNormCodes.has(normaliseID(id, key))));
            }
        }
        return acc;
    }

    private fillData(iswcs: string[], codes: Map<string, string[]>, title: string, source: string): void {
        iswcs.forEach(this.fillISWC.bind(this));
        const entries = [...codes.entries()];
        entries.sort(([k1], [k2]) => k1.localeCompare(k2));
        const unknownAgencyCodes: Array<[string, string[]]> = [];
        for (const [agencyKey, agencyCodes] of entries) {
            try {
                this.fillAgencyCodes(agencyKey, agencyCodes);
            } catch (err) {
                if (err instanceof Error && err.message === 'Unknown agency key') {
                    unknownAgencyCodes.push([agencyKey, agencyCodes]);
                } else {
                    throw err;
                }
            }
        }

        if (unknownAgencyCodes.length > 0) {
            const lis = unknownAgencyCodes.reduce((acc, [agency, unknownCodes]) => {
                return acc + `<li>${agency}: ${unknownCodes.join(', ')}</li>`;
            }, '');
            this.log('warning', `
                Encountered unsupported agencies.
                If you encounter these a lot, please consider filing an MBS ticket.
                <ul>${lis}</ul>`);
        }
        if (this.autoformatCodes) {
            this.formatExistingCodes();
        }
        this.checkExistingCodes();
        this.maybeFillTitle(title);
        this.fillEditNote(unknownAgencyCodes, source, this.autoformatCodes);
    }

    private maybeFillTitle(title: string): void {
        const titleInp = this.form.querySelector<HTMLInputElement>('input[name="edit-work.name"]')!;
        if (titleInp.value) {
            // Not filling if already filled.
            return;
        }

        // Completely lowercase the title before adding it. ISWCNet has completely
        // uppercased titles. Depending on the guesscase_keepuppercase cookie,
        // guess case might not properly transform it.
        fillInput(titleInp, title.toLowerCase());
        titleInp.closest('div.row')!
            .querySelector<HTMLButtonElement>('button.guesscase-title')!
            .click();
    }

    private fillISWC(iswc: string): void {
        const row = this.findEmptyRow('div.form-row-text-list', 'edit-work.iswcs.');
        fillInput(row, iswc);
    }

    private fillAgencyCodes(agencyKey: string, agencyCodes: string[]): void {
        agencyCodes.forEach((code) => {
            const input = this.findEmptyRow('table#work-attributes', 'edit-work.attributes.');
            // Will throw when the agency isn't know the MB, handled by caller.
            setRowKey(input.closest('tr')!.querySelector('td > select')!, agencyKey);
            fillInput(input, code);
        });
    }

    private fillEditNote(unknownAgencies: Array<[string, string[]]>, source: string, wasFormatted: boolean): void {
        const noteContent = unknownAgencies.reduce((acc, [agencyKey, agencyCodes]) => {
            return acc + agencyKey + ': ' + agencyCodes.join(', ') + '\n';
        }, unknownAgencies.length > 0 ? 'Unsupported agencies:\n' : '');

        if (noteContent) {
            this.fillEditNoteTop(noteContent);
        }

        const fmtAppliedStr = wasFormatted ? CODES_VERSION : 'not applied';
        const editNoteBottom = `${GMinfo.script.name} v${GMinfo.script.version} (source: ${source}, formatting: ${fmtAppliedStr})`;

        this.fillEditNoteBottom(editNoteBottom);
    }

    private fillEditNoteTop(content: string): void {
        const note = this.form.querySelector<HTMLTextAreaElement>('textarea[name="edit-work.edit_note"]')!;
        const noteParts = note.value.split('–\n');
        let top = noteParts[0];
        if (!top) {
            top = content + '\n';
        } else {
            top += content;
        }
        noteParts[0] = top;
        note.value = noteParts.join('–\n');
    }

    private fillEditNoteBottom(content: string): void {
        const note = this.form.querySelector<HTMLTextAreaElement>('textarea[name="edit-work.edit_note"]')!;
        const noteParts = note.value.split('–\n');
        let bottom = noteParts[1];
        if (!bottom) {
            bottom = content;
        } else {
            bottom += '\n' + content;
        }
        noteParts[0] = noteParts[0] || '\n';
        noteParts[1] = bottom;
        note.value = noteParts.join('–\n');
    }

    private readData(cb: (data: string) => void): void {
        logFailure(GMgetValue<string>('workCodeData')
            .then((data) => {
                if (!data) {
                    this.log('error', 'No data found. Did you copy anything?');
                    return;
                }

                // eslint-disable-next-line promise/no-callback-in-promise -- FIXME
                cb(data);

                // Reset again to prevent filling the same data on another edit page.
                return GMdeleteValue('workCodeData');
            }));
    }

    private parseData(raw: string): WorkCodeData | null {
        try {
            return JSON.parse(raw) as WorkCodeData;
        } catch (err) {
            this.log('error', 'Invalid data');
            console.log(raw);
            console.log(err);
            return null;
        }
    }

    private promptForConfirmation(conflicts: Array<[string, string[], string[]]>): Promise<void> {
        const lis = conflicts.reduce((acc, [agency, mbCodes, extCodes]) => {
            return acc + `<li>${agency}: [${mbCodes.join(', ')}] vs [${extCodes.join(', ')}]</li>`;
        }, '');
        const msg = `Uh-oh. MB already has the following codes with conflicting data:
        Are you sure you want to fill these?
        Note: New codes will be added and will not replace the existing ones.<br/>
        <ul>${lis}</ul>
        <button type="button" class="conflict-confirm">Confirm</button>`;
        this.log('warning', msg);
        return new Promise((resolve) => {
            this.form.querySelector('.conflict-confirm')!.addEventListener('click', (evt) => {
                (evt.target as HTMLButtonElement).disabled = true;
                evt.preventDefault();
                resolve();
            });
        });
    }

    private log(level: keyof typeof LOG_STYLES, html: string): void {
        const logDiv = this.form.querySelector<HTMLDivElement>('div#ROpdebee_MB_Paste_Work_Log')!;
        // eslint-disable-next-line no-unsanitized/method -- Fine.
        logDiv.insertAdjacentHTML('beforeend', `
            <div style="border: 1px dashed gray; padding: 2px 2px 5px 5px; margin-top: 2px; ${LOG_STYLES[level]}">${html}</div>`);
        logDiv.style.display = 'block';
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    private addValidationError(agencyKey: string, code: string, message?: string): void {
        const logDiv = this.form.querySelector<HTMLDivElement>(VALIDATION_LOG_QUERY)!;
        let msg = `${code} does not look like a valid ${agencyKey}.`;
        if (message) {
            msg += ' ' + message;
        }
        // eslint-disable-next-line no-unsanitized/method -- Fine.
        logDiv.insertAdjacentHTML('beforeend',
            `<div style="border: 1px dashed gray; padding: 2px 2px 5px 5px; margin-top: 2px; ${LOG_STYLES['error']}">${msg}</div>`);
        logDiv.style.display = 'block';
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    private addFormatWarning(agencyKey: string, code: string): void {
        const logDiv = this.form.querySelector<HTMLDivElement>(VALIDATION_LOG_QUERY)!;
        const msg = `${code} is not a well-formatted ${agencyKey}.`;
        // eslint-disable-next-line no-unsanitized/method -- Fine.
        logDiv.insertAdjacentHTML('beforeend',
            `<div style="border: 1px dashed gray; padding: 2px 2px 5px 5px; margin-top: 2px; ${LOG_STYLES['warning']}">${msg}</div>`);
        logDiv.style.display = 'block';
        logDiv.scrollTop = logDiv.scrollHeight;
    }
}

class WorkEditForm extends BaseWorkForm {
    protected addToolsUI(): void {
        // eslint-disable-next-line no-unsanitized/method -- Fine.
        this.form.querySelector('.documentation')!.insertAdjacentHTML('beforebegin', mainUIHTML);
    }
}

class IframeEditForm extends BaseWorkForm {
    protected addToolsUI(): void {
        // eslint-disable-next-line no-unsanitized/method -- Fine.
        this.form.querySelector('.half-width')!.insertAdjacentHTML('beforebegin', mainUIHTML);
        this.form.querySelector<HTMLElement>('#ropdebee-work-menu')!.style.marginLeft = '0px';
    }
}


function editFormFactory(theForm: HTMLFormElement, inIframe: boolean): BaseWorkForm {
    if (inIframe) {
        return new IframeEditForm(theForm);
    }

    return new WorkEditForm(theForm);
}

function handleMB(): void {
    const editWorkFormQuery = 'form.edit-work';

    function handleChange(): void {
        // Whenever a change occurs, try to add buttons to the attr table.
        // FIXME: We should check the changes in more detail before querying.
        const workForms: Array<[HTMLFormElement, boolean]> = [...document.querySelectorAll<HTMLFormElement>(editWorkFormQuery)].map((f) => [f, false]);
        document.querySelectorAll('iframe').forEach((iframe) => {
            onAddEntityDialogLoaded(iframe, () => {
                iframe.contentWindow!.document
                    .querySelectorAll<HTMLFormElement>(editWorkFormQuery)
                    .forEach((form) => workForms.push([form, true]));
            });
        });

        workForms
            .filter((f) => !f[0].ROpdebee_Work_Codes_Found)
            .forEach(([f, inIframe]) => editFormFactory(f, inIframe));
    }

    const theForm = document.querySelector<HTMLFormElement>(editWorkFormQuery);
    if (theForm && !theForm.ROpdebee_Work_Codes_Found) {
        editFormFactory(theForm, false);
    }

    const observer = new MutationObserver(handleChange);
    observer.observe(document, {
        subtree: true,
        childList: true,
    });
}


//////////////
// Repertoires
//////////////

const iswcRegex = /\bT-(?:\d{3}\.){2}\d{3}-\d\b/;

function storeData(source: string, iswcs: string[], codes: Map<string, string[]>, title: string): Promise<void> {
    const obj: WorkCodeData = {
        source,
        iswcs,
        title,
        agencyCodes: Object.fromEntries(codes),
    };

    console.log(obj);

    // Use GM functions rather than clipboard because reading clipboard in a portable manner is difficult
    return GMsetValue('workCodeData', JSON.stringify(obj));
}

type RepertoireHandler = () => void;

//////////////
// ISWCNet
//////////////

const stringsDefaults: Record<string, string> = {
    AGENCY_NAME_FIELD: 'Agency Name',
    AGENCY_WORK_CODES: 'Agency Work Codes',
    AGENCY_WORK_CODE_FIELD: 'Agency Work Code',
    ARCHIVED_ISWCS: 'Archived ISWCs',
    ORIGINAL_TITLE_FIELD: 'Original Title',
    PREFERRED_ISWC_FIELD: 'Preferred ISWC',
};

const translateStrings = (function(): (text: keyof typeof stringsDefaults) => string {
    let strings: Record<string, string | undefined>;

    return function(text: keyof typeof stringsDefaults): string {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!strings) {
            const stringsJson = localStorage.getItem('strings');
            if (!stringsJson) {
                console.error('Could not extract translations!');
                // Return as-is
                return stringsDefaults[text];
            }

            strings = JSON.parse(stringsJson) as Record<string, string | undefined>;
        }

        return strings[text] ?? stringsDefaults[text];
    };
})();

function handleISWCNet(): void {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    function findAgencyWorkCodes(table: HTMLElement): Map<string, string[]> {
        const codeTable = findDivByText(table, `${translateStrings('AGENCY_WORK_CODES')}:`).map((div) => div.nextSibling!);
        if (codeTable.length === 0) return new Map();

        const rows = [...(codeTable[0] as HTMLElement).querySelectorAll('tbody > tr')!];
        const groupedCodes = groupBy(
            rows,
            (row) => row.querySelector(`td[id="${translateStrings('AGENCY_NAME_FIELD')}:"]`)!.textContent!,
            (row) => row.querySelector(`td[id="${translateStrings('AGENCY_WORK_CODE_FIELD')}:"]`)!.textContent!);

        // CASH IDs always start with "C-", but this prefix is not stored on ISWCNet.
        // The prefix indicates the originating agency from the DIVA family, which
        // also includes MUST, MACP, MCSC, and MCT. Those codes are stored under
        // their respective agency in ISWCNet.
        if (groupedCodes.has('CASH')) {
            groupedCodes.set('CASH', groupedCodes.get('CASH')!.map((code) => `C-${code}`));
        }

        return groupedCodes;
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping
    function findIswcs(table: HTMLElement): string[] {
        const iswcs = [table.querySelector(`td[id="${translateStrings('PREFERRED_ISWC_FIELD')}:"]`)!.textContent!];
        findDivByText(table, translateStrings('ARCHIVED_ISWCS')).forEach((archivedTitle) => {
            const archivedISWCsDiv = archivedTitle.nextSibling;
            iswcs.push(...archivedISWCsDiv!.childNodes[0]!.textContent!.split(', '));
        });
        return iswcs;
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping
    function findTitle(table: HTMLElement): string {
        return table.querySelector(`td[id="${translateStrings('ORIGINAL_TITLE_FIELD')}:"]`)!.textContent!;
    }

    function parseAndCopy(table: HTMLElement): void {
        const workCodes = findAgencyWorkCodes(table);
        const iswcs = findIswcs(table);
        const title = findTitle(table);

        logFailure(storeData('CISAC ISWCNet', iswcs, workCodes, title));
    }

    function handleChangeCisac(mutationRec: MutationRecord[]): void {
        if (mutationRec.length === 0 || mutationRec[0].addedNodes.length === 0) return; // Not an addition
        if (mutationRec[0].addedNodes[0].nodeName !== 'TR') return; // Not an expand of an entry

        const viewMoreDiv = (mutationRec[0].addedNodes[0] as HTMLElement).querySelector('[class^="ViewMore_viewMoreContainer"]');
        if (!viewMoreDiv) return;

        const entry = viewMoreDiv.parentNode!.parentNode!.parentNode! as HTMLElement;

        const button = document.createElement('button');
        button.textContent = 'Copy work codes';
        button.addEventListener('click', () => {
            parseAndCopy(entry);
        });
        viewMoreDiv.prepend(button);
    }

    const observer = new MutationObserver(handleChangeCisac);
    observer.observe(document, {
        subtree: true,
        childList: true,
    });
}


//////////////
// GEMA
//////////////

function handleGEMA(): void {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    function findAgencyWorkCodes(tr: HTMLTableRowElement): Map<string, string[]> {
        return new Map([['GEMA', [tr.querySelector('.workSocworkcde')!.textContent!.match(/(\d{0,8})[-‐](\d{3})/)![0]]]]);
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping
    function findIswcs(tr: HTMLTableRowElement): string[] {
        return [
            tr.querySelector('.workIswc')!.textContent!.match(iswcRegex)![0],
        ];
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping
    function findTitle(tr: HTMLTableRowElement): string {
        return tr.querySelector('.workSearchedTitle')!.textContent!;
    }

    function parseAndCopy(tr: HTMLTableRowElement): void {
        const workCodes = findAgencyWorkCodes(tr);
        const iswcs = findIswcs(tr);
        const title = findTitle(tr);

        logFailure(storeData('GEMA Repertoire Search', iswcs, workCodes, title));
    }

    function injectButtons(parentNode: ParentNode = document): void {
        parentNode.querySelectorAll<HTMLTableRowElement>('[id="auswahlForm:searchResultItems:tb"] > tr').forEach((tr) => {
            const button = document.createElement('button');
            button.textContent = 'Copy work codes';
            button.addEventListener('click', (event) => {
                event.preventDefault();
                parseAndCopy(tr);
            });
            tr.querySelector('.empty')!.prepend(button);
        });
    }

    /** @type {MutationCallback} */
    function handleChangeGEMA(mutationRec: MutationRecord[]): void {
        if (mutationRec.length === 0 || mutationRec[0].addedNodes.length === 0) return; // Not an addition

        const searchResults = mutationRec[0].addedNodes[0];
        if (searchResults.nodeType !== Node.ELEMENT_NODE) return;

        injectButtons(searchResults as HTMLElement);
    }

    // GEMA overwrites `JSON.stringify()` with a custom implementation which causes `JSON.parse()` to fail on MB.
    // Restore it again using the original implementation which seems to be backed up as `Object.toJSON()`.
    // @ts-expect-error GEMA bs
    if (Object.toJSON) {
        // @ts-expect-error GEMA bs
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        JSON.stringify = Object.toJSON;
    }

    const observer = new MutationObserver(handleChangeGEMA);
    observer.observe(document.querySelector('div.body')!, {
        childList: true,
    });

    injectButtons(); // initial loading might remember the last search
}


const repertoireToHandler: Record<string, RepertoireHandler> = {
    'iswcnet.cisac.org': handleISWCNet,
    'online.gema.de': handleGEMA,
};

if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    // FIXME: It should be either validate or fill, not both.
    validateCodes();
    handleMB();
} else {
    repertoireToHandler[document.location.hostname]();
}
