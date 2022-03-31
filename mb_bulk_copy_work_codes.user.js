// ==UserScript==
// @name         MB: Bulk copy-paste work codes
// @version      2022.3.31
// @description  Copy work identifiers from various online repertoires and paste them into MB works with ease.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_bulk_copy_work_codes.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_bulk_copy_work_codes.user.js
// @match        https://iswcnet.cisac.org/*
// @match        https://online.gema.de/werke/search.faces*
// @match        *://musicbrainz.org/*/edit
// @match        *://*.musicbrainz.org/*/edit
// @match        *://musicbrainz.org/release/*/edit-relationships
// @match        *://*.musicbrainz.org/release/*/edit-relationships
// @match        *://musicbrainz.org/*/create
// @match        *://*.musicbrainz.org/*/create
// @require      https://raw.github.com/ROpdebee/mb-userscripts/main/lib/work_identifiers.js?v=2021.5.27
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_info
// ==/UserScript==


//////////////
// Utils
//////////////

// Taken from https://stackoverflow.com/a/44622467
class DefaultDict {
  constructor(defaultInit) {
    return new Proxy({}, {
      get: (target, name) => name in target ?
        target[name] :
        (target[name] = typeof defaultInit === 'function' ?
          new defaultInit().valueOf() :
          defaultInit)
    });
  }
};


Array.prototype.groupBy = function(keyFn, valTransform) {
    return Object.assign({}, this.reduce(
        (acc, el) => {
            acc[keyFn(el)].push((valTransform || (e => e))(el));
            return acc;
        },
        new DefaultDict(Array)));
};

Array.prototype.intersect = function(other) {
    return this.filter(el => other.includes(el));
};

Array.prototype.difference = function(other) {
    return this.filter(el => !other.includes(el));
};

function findDivByText(parent, text) {
    let divs = [...parent.querySelectorAll("div")];
    return divs.filter(n => n.innerText === text);
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

function normaliseID(id, agencyKey) {
    let formatResult = MBWorkIdentifiers.validateCode(id, agencyKey)
    if (!formatResult.isValid) {
        return id.replace(/(?:^0+|[\.\s-])/g, '');
    }

    return formatResult.formattedCode;
}

/**
 * Convert translated agency IDs into English variant.
 * TODO: There needs to be a better way to do this without hardcoding...
 */
function normaliseAgencyId(agencyId) {
    return agencyId
        .replace(/-ID$/, ' ID')  // German and Dutch use e.g. 'ASCAP-ID'.
        .replace(/^ID (.+)/, '$1 ID')  // French and Italian use 'ID ASCAP'
        .replace(/-tunniste$/, ' ID');  // Finnish
    // TODO: "PRS tune code" is heavily translated in French etc. We need a more
    // robust way of converting those.
}

function getSelectedID(select) {
    return normaliseAgencyId(select.options[select.selectedIndex].text.trim());
}

function setRowKey(select, agencyKey) {
    let idx = [...select.options].findIndex(opt => normaliseAgencyId(opt.text.trim()) === agencyKey);
    if (idx < 0) {
        throw new Error('Unknown agency key');
    }
    select.selectedIndex = idx;
}

function computeAgencyConflicts(mbCodes, extCodes) {
    // Conflicting IDs when MB already has IDs for this key and the external codes
    // don't match the IDs that MB already has
    let commonKeys = Object.keys(mbCodes).intersect(Object.keys(extCodes));
    return commonKeys
        .filter(k => mbCodes[k].length) // No MB codes => no conflicts
        .filter(k => extCodes[k].map(c => normaliseID(c, k)).difference(mbCodes[k].map(c => normaliseID(c, k))).length)
        .map(k => [k, mbCodes[k], extCodes[k]]);
}


function extractCodes(data) {
    let agencyCodes = data['agencyCodes'];
    return Object.entries(agencyCodes).reduce(
        (acc, [key, codes]) => {
            acc[MBWorkIdentifiers.agencyNameToID(key)] = codes;
            return acc;
        }, {});
}

function deduplicateCodes(codes, key) {
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

function fillInput(inp, val) {
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
</div>`

class BaseWorkForm {
    constructor(theForm) {
        this.form = theForm;
        this.form.ROpdebee_Work_Codes_Found = true; // Prevent processing it again

        this.addToolsUI();
        this.activateButtons();
        this.checkExistingCodes();
    }

    activateButtons() {
        // The button to paste work codes
        this.form.querySelector('button#ROpdebee_MB_Paste_Work')
            .addEventListener('click', (evt) => {
                evt.preventDefault();
                // Since we use an arrow function, current `this` is the instance itself.
                // We need to bind it properly to give a method reference though.
                this.resetLog();
                this.readData(this.checkAndFill.bind(this));
            });

        this.form.querySelector('button#ROpdebee_MB_Format_Codes')
            .addEventListener('click', (evt) => {
                evt.preventDefault();
                this.resetLog();
                let formattedAny = this.formatExistingCodes();
                if (formattedAny) {
                    this.fillEditNote([], 'existing', true);
                }
            });

        let autoFormatCheckbox = this.form.querySelector('input#ROpdebee_MB_Autoformat_Codes');
        autoFormatCheckbox
            .addEventListener('change', (evt) => {
                evt.preventDefault();
                if (evt.currentTarget.checked) {
                    localStorage.setItem(evt.currentTarget.id, 'delete me to disable');
                } else {
                    localStorage.removeItem(evt.currentTarget.id);
                }
            });
        autoFormatCheckbox.checked = !!localStorage.getItem('ROpdebee_MB_Autoformat_Codes');
    }

    checkExistingCodes() {
        this.resetValidationLog();
        this.existingCodeInputs.forEach(({ select, input }) => {
            let agencyKey = getSelectedID(select);
            let agencyCode = input.value;
            let checkResult = MBWorkIdentifiers.validateCode(agencyCode, agencyKey);

            if (!checkResult.isValid) {
                input.style.backgroundColor = 'red';
                this.addValidationError(agencyKey, agencyCode, checkResult.message);
            } else if (checkResult.wasChanged) {
                input.style.backgroundColor = 'orange';
                this.addFormatWarning(agencyKey, agencyCode);
            }
        })
    }

    formatExistingCodes() {
        let formattedAny = false;
        this.existingCodeInputs.forEach(({ select, input }) => {
            let agencyKey = getSelectedID(select);
            let agencyCode = input.value;
            let checkResult = MBWorkIdentifiers.validateCode(agencyCode, agencyKey);

            if (checkResult.isValid && checkResult.wasChanged) {
                fillInput(input, checkResult.formattedCode);
                this.log('info', `Changed ${agencyKey} ${agencyCode} to ${checkResult.formattedCode}`);
                formattedAny = true;
            }
        });

        return formattedAny;
    }

    resetLog() {
        let logDiv = this.form.querySelector('div#ROpdebee_MB_Paste_Work_Log');
        logDiv.style.display = 'none';
        [...logDiv.children]
            .slice(1)  // Skip the heading
            .forEach(el => el.remove());
    }

    resetValidationLog() {
        let logDiv = this.form.querySelector('div#ROpdebee_MB_Code_Validation_Errors');
        logDiv.style.display = 'none';
        [...logDiv.children]
            .slice(1)  // Skip the heading
            .forEach(el => el.remove());
    }

    get autoformatCodes() {
        return this.form.querySelector('input#ROpdebee_MB_Autoformat_Codes').checked;
    }

    get existingCodeInputs() {
        return [...this.form
            .querySelectorAll('table#work-attributes tr')]
            .map(row => ({
                    'select': row.querySelector('td > select'),
                    'input': row.querySelector('td > input'),
                }))
            .filter(({ select, input }) => select !== null && select.selectedIndex !== 0 && input !== null && input.value);
    }

    get existingCodes() {
        return this.existingCodeInputs
            .groupBy(
                ({ select }) => getSelectedID(select),
                ({ input: { value }}) => value);
    }

    get existingISWCs() {
        return [...this.form
            .querySelectorAll('input[name^="edit-work.iswcs."]')]
            .map(({ value }) => value)
            .filter(({ length }) => length);
    }

    findEmptyRow(parentSelector, inputName) {
        let parent = this.form.querySelector(parentSelector);
        let rows = [...parent.querySelectorAll('input[name*="' + inputName + '"]')];
        let emptyRows = rows.filter(({value}) => !value.length);
        if (emptyRows.length) {
            return emptyRows[0];
        }

        // Need to add a new row
        let newRowBtn = parent.querySelector('button.add-item');
        newRowBtn.click();
        return this.findEmptyRow(parentSelector, inputName);
    }

    checkAndFill(rawData) {
        let data = this.parseData(rawData);
        console.log(data);
        let externalCodes = extractCodes(data);
        let externalISWCs = data['iswcs'];
        let mbCodes = this.existingCodes;
        let mbISWCs = this.existingISWCs;

        // Sanity check
        let dupeAgencies = Object.entries(externalCodes)
            .filter(([key, codes]) => codes.length > 1)
            .map(([key, codes]) => key);
        if (dupeAgencies.length) {
            const lis = dupeAgencies.reduce((acc, agency) => {
                return acc + `<li>${agency}: ${externalCodes[agency].join(', ')}</li>`
            }, '');
            this.log('warning', `
                Found duplicate work codes in input.
                Please double-check whether all of these codes belong to this work.
                <ul>${lis}</ul>`);
        }
        let newISWCs = externalISWCs.difference(mbISWCs);
        let conflicts = computeAgencyConflicts(mbCodes, externalCodes);
        if (newISWCs.length && mbISWCs.length) {
            conflicts.unshift(['ISWC', mbISWCs, externalISWCs]);
        }

        // Confirm in case of conflicts.
        let confirmProm = conflicts.length ? this.promptForConfirmation(conflicts) : new Promise((resolve, reject) => resolve());
        confirmProm.then(() => {
            let newCodes = this.retainOnlyNew(externalCodes, mbCodes);
            this.fillData(newISWCs, newCodes, data['title'], data['source']);
            let numWarnings = this.form.querySelectorAll('div#ROpdebee_MB_Paste_Work_Log > div').length;
            this.log('success', 'Filled successfully' + (numWarnings ? ` (${numWarnings} message(s))` : ''));
        });
    }

    retainOnlyNew(externalCodes, mbCodes) {
        return Object.entries(externalCodes).reduce((acc, [key, rawCodes]) => {
            const codes = deduplicateCodes(rawCodes, key);
            if (!mbCodes.hasOwnProperty(key)) {
                acc[key] = codes;
            } else {
                const mbNormCodes = mbCodes[key].map(c => normaliseID(c, key))
                acc[key] = codes
                    .filter(id => !mbNormCodes.includes(normaliseID(id, key)));
            }
            return acc;
        }, {});
    }

    fillData(iswcs, codes, title, source) {
        iswcs.forEach(this.fillISWC.bind(this));
        let entries = Object.entries(codes);
        entries.sort();
        let unknownAgencyCodes = entries.reduce(
            (acc, [agencyKey, agencyCodes]) => {
                try {
                    this.fillAgencyCodes(agencyKey, agencyCodes);
                } catch (e) {
                    if (e.message === 'Unknown agency key') {
                        acc.push([agencyKey, agencyCodes]);
                    } else {
                        throw e;
                    }
                }
                return acc;
            }, []);

        if (unknownAgencyCodes.length) {
            const lis = unknownAgencyCodes.reduce((acc, [agency, codes]) => {
                return acc + `<li>${agency}: ${codes.join(', ')}</li>`
            }, '');
            this.log('warning', `
                Encountered unsupported agencies.
                If you encounter these a lot, please consider filing a ticket.
                <ul>${lis}</ul>`);
        }
        if (this.autoformatCodes) {
            this.formatExistingCodes();
        }
        this.checkExistingCodes();
        this.maybeFillTitle(title);
        this.fillEditNote(unknownAgencyCodes, source, this.autoformatCodes);
    }

    maybeFillTitle(title) {
        let titleInp = this.form.querySelector('input[name="edit-work.name"]');
        if (titleInp.value) {
            // Not filling if already filled.
            return;
        }

        // Completely lowercase the title before adding it. ISWCNet has completely
        // uppercased titles. Depending on the guesscase_keepuppercase cookie,
        // guess case might not properly transform it.
        fillInput(titleInp, title.toLowerCase());
        titleInp.closest('div.row')
            .querySelector('button.guesscase-title')
            .click();
    }

    fillISWC(iswc) {
        let row = this.findEmptyRow('div.form-row-text-list', 'edit-work.iswcs.');
        fillInput(row, iswc);
    }

    fillAgencyCodes(agencyKey, agencyCodes) {
        agencyCodes.forEach(code => {
            let input = this.findEmptyRow('table#work-attributes', 'edit-work.attributes.');
            // Will throw when the agency isn't know the MB, handled by caller.
            setRowKey(input.closest('tr').querySelector('td > select'), agencyKey);
            fillInput(input, code);
        });
    }


    fillEditNote(unknownAgencies, source, wasFormatted) {
        let noteContent = unknownAgencies.reduce((acc, [agencyKey, agencyCodes]) => {
            return acc + agencyKey + ': ' + agencyCodes.join(', ') + '\n';
        }, unknownAgencies.length ? 'Unsupported agencies:\n' : '');

        if (noteContent) {
            this.fillEditNoteTop(noteContent);
        }

        let fmtAppliedStr = wasFormatted ? MBWorkIdentifiers.VERSION : 'not applied';
        let editNoteBottom = `${GM_info.script.name} v${GM_info.script.version} (source: ${source}, formatting: ${fmtAppliedStr})`;

        this.fillEditNoteBottom(editNoteBottom);
    }

    fillEditNoteTop(content) {
        let note = this.form.querySelector('textarea[name="edit-work.edit_note"]');
        let noteParts = note.value.split('–\n');
        let top = noteParts[0];
        if (!top) {
            top = content + '\n';
        } else {
            top += content;
        }
        noteParts[0] = top;
        note.value = noteParts.join('–\n');
    }

    fillEditNoteBottom(content) {
        let note = this.form.querySelector('textarea[name="edit-work.edit_note"]');
        let noteParts = note.value.split('–\n');
        let bottom = noteParts[1];
        if (!bottom) {
            bottom = content;
        } else {
            bottom += '\n' + content;
        }
        noteParts[0] = noteParts[0] ? noteParts[0] : '\n';
        noteParts[1] = bottom;
        note.value = noteParts.join('–\n');
    }

    readData(cb) {
        let data = GM_getValue('workCodeData');
        if (!data) {
            this.log('error', 'No data found. Did you copy anything?');
            return;
        }

        cb(data);
        // Reset again to prevent filling the same data on another edit page.
        GM_deleteValue('workCodeData');
    }

    parseData(raw) {
        try {
            return JSON.parse(raw);
        } catch(e) {
            this.log('error', 'Invalid data');
            console.log(raw);
            console.log(e);
            return {};
        }
    }

    promptForConfirmation(conflicts) {
        const lis = conflicts.reduce((acc, [agency, mbCodes, extCodes]) => {
            return acc + `<li>${agency}: [${mbCodes.join(', ')}] vs [${extCodes.join(', ')}]</li>`
        }, '');
        let msg = `Uh-oh. MB already has the following codes with conflicting data:
        Are you sure you want to fill these?
        Note: New codes will be added and will not replace the existing ones.<br/>
        <ul>${lis}</ul>
        <button type="button" class="conflict-confirm">Confirm</button>`;
        this.log('warning', msg);
        return new Promise((resolve, reject) => {
            this.form.querySelector('.conflict-confirm').addEventListener('click', (evt) => {
                evt.target.disabled = true;
                evt.preventDefault();
                resolve();
            });
        });
    }

    log(level, html) {
        let logDiv = this.form.querySelector('div#ROpdebee_MB_Paste_Work_Log');
        logDiv.insertAdjacentHTML('beforeend', `
            <div style="border: 1px dashed gray; padding: 2px 2px 5px 5px; margin-top: 2px; ${LOG_STYLES[level]}">${html}</div>`);
        logDiv.style.display = 'block';
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    addValidationError(agencyKey, code, message) {
        let logDiv = this.form.querySelector('div#ROpdebee_MB_Code_Validation_Errors');
        let msg = `${code} does not look like a valid ${agencyKey}.`;
        if (message) {
            msg += ' ' + message;
        }
        logDiv.insertAdjacentHTML('beforeend',
            `<div style="border: 1px dashed gray; padding: 2px 2px 5px 5px; margin-top: 2px; ${LOG_STYLES['error']}">${msg}</div>`);
        logDiv.style.display = 'block';
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    addFormatWarning(agencyKey, code) {
        let logDiv = this.form.querySelector('div#ROpdebee_MB_Code_Validation_Errors');
        let msg = `${code} is not a well-formatted ${agencyKey}.`;
        logDiv.insertAdjacentHTML('beforeend',
            `<div style="border: 1px dashed gray; padding: 2px 2px 5px 5px; margin-top: 2px; ${LOG_STYLES['warning']}">${msg}</div>`);
        logDiv.style.display = 'block';
        logDiv.scrollTop = logDiv.scrollHeight;
    }
}

class WorkEditForm extends BaseWorkForm {
    addToolsUI() {
        this.form.querySelector('.documentation').insertAdjacentHTML('beforebegin', mainUIHTML);
    }
}

class IframeEditForm extends BaseWorkForm {
    addToolsUI() {
        this.form.querySelector('.half-width').insertAdjacentHTML('beforebegin', mainUIHTML);
        this.form.querySelector('#ropdebee-work-menu').style['margin-left'] = 0;
    }
}


function editFormFactory(theForm, inIframe) {
    if (inIframe) {
        return new IframeEditForm(theForm);
    }

    return new WorkEditForm(theForm);
}

function handleMB() {

    function handleChange(mutationRec) {
        // Whenever a change occurs, try to add buttons to the attr table.
        let workForms = [...document.querySelectorAll('form.edit-work')].map(f => [f, false]);
        document.querySelectorAll('iframe').forEach(iframe =>
            iframe.contentWindow.document
                .querySelectorAll('form.edit-work')
                .forEach(form => workForms.push([form, true])));

        workForms
            .filter(f => !f[0].ROpdebee_Work_Codes_Found)
            .forEach(([f, inIframe]) => editFormFactory(f, inIframe));
    }

    let theForm = document.querySelector('form.edit-work');
    if (theForm && !theForm.ROpdebee_Work_Codes_Found) {
        editFormFactory(theForm, false);
    }

    let observer = new MutationObserver(handleChange);
    observer.observe(document, {
        subtree: true,
        childList: true
    });

}


//////////////
// Repertoires
//////////////

const iswcRegex = /\bT-\d{3}\.\d{3}\.\d{3}-\d\b/;

function storeData(source, iswcs, codes, title) {
    let obj = {
        'source': source,
        'iswcs': iswcs,
        'agencyCodes': codes,
        'title': title,
    };

    console.log(obj);

    // Use GM functions rather than clipboard because reading clipboard in a portable manner is difficult
    GM_setValue('workCodeData', JSON.stringify(obj));
}


//////////////
// ISWCNet
//////////////

let translateStrings = (function() {
    let strings;
    const stringsDefaults = {
        AGENCY_NAME_FIELD: 'Agency Name',
        AGENCY_WORK_CODES: 'Agency Work Codes',
        AGENCY_WORK_CODE_FIELD: 'Agency Work Code',
        ARCHIVED_ISWCS: 'Archived ISWCs',
        ORIGINAL_TITLE_FIELD: 'Original Title',
        PREFERRED_ISWC_FIELD: 'Preferred ISWC',
    };

    return function(text) {
        if (!strings) {
            const stringsJson = localStorage.getItem('strings');
            if (!stringsJson) {
                console.error('Could not extract translations!');
                // Return as-is
                return stringsDefaults[text];
            }

            strings = JSON.parse(stringsJson);
        }

        return strings[text] || stringsDefaults[text];
    }
})();

function handleISWCNet() {

    function findAgencyWorkCodes(table) {
        let codeTable = findDivByText(table, `${translateStrings('AGENCY_WORK_CODES')}:`).map(div => div.nextSibling);
        if (!codeTable.length) return {};

        let rows = [...codeTable[0].querySelectorAll('tbody > tr')];
        let groupedCodes = rows.groupBy(
                row => row.querySelector(`td[id="${translateStrings('AGENCY_NAME_FIELD')}:"]`).innerText,
                row => row.querySelector(`td[id="${translateStrings('AGENCY_WORK_CODE_FIELD')}:"]`).innerText);

        // CASH IDs always start with "C-", but this prefix is not stored on ISWCNet.
        // The prefix indicates the originating agency from the DIVA family, which
        // also includes MUST, MACP, MCSC, and MCT. Those codes are stored under
        // their respective agency in ISWCNet.
        if ('CASH' in groupedCodes) {
            groupedCodes['CASH'] = groupedCodes['CASH'].map(code => `C-${code}`);
        }

        return groupedCodes;
    }

    function findIswcs(table) {
        iswcs = [table.querySelector(`td[id="${translateStrings('PREFERRED_ISWC_FIELD')}:"]`).innerText];
        findDivByText(table, translateStrings('ARCHIVED_ISWCS')).forEach(archivedTitle => {
            let archivedISWCsDiv = archivedTitle.nextSibling;
            iswcs = iswcs.concat(archivedISWCsDiv.childNodes[0].textContent.split(', '));
        });
        return iswcs;
    }

    function findTitle(table) {
        return table.querySelector(`td[id="${translateStrings('ORIGINAL_TITLE_FIELD')}:"]`).innerText;
    }

    function parseAndCopy(table) {
        let workCodes = findAgencyWorkCodes(table);
        let iswcs = findIswcs(table);
        let title = findTitle(table);

        storeData('CISAC ISWCNet', iswcs, workCodes, title);
    }

    function handleChangeCisac(mutationRec) {
        if (mutationRec.length == 0 || mutationRec[0].addedNodes.length == 0) return; // Not an addition
        if (mutationRec[0].addedNodes[0].nodeName !== "TR") return; // Not an expand of an entry

        let viewMoreDiv = mutationRec[0].addedNodes[0].querySelector("[class^='ViewMore_viewMoreContainer']");
        if (!viewMoreDiv) return;

        let entry = viewMoreDiv.parentNode.parentNode.parentNode;

        let button = document.createElement('button');
        button.innerText = 'Copy work codes';
        button.onclick = (() => parseAndCopy(entry));
        viewMoreDiv.prepend(button);
    }

    let observer = new MutationObserver(handleChangeCisac);
    observer.observe(document, {
        subtree: true,
        childList: true
    });
}


//////////////
// GEMA
//////////////

function handleGEMA() {

    function findAgencyWorkCodes(tr) {
        return {
            'GEMA': [
                tr.querySelector('.workSocworkcde').innerText.match(/(\d{0,8})[\-‐](\d{3})/)[0],
            ],
        };
    }

    function findIswcs(tr) {
        return [
            tr.querySelector('.workIswc').innerText.match(iswcRegex)[0],
        ];
    }

    function findTitle(tr) {
        return tr.querySelector('.workSearchedTitle').innerText;
    }

    function parseAndCopy(tr) {
        let workCodes = findAgencyWorkCodes(tr);
        let iswcs = findIswcs(tr);
        let title = findTitle(tr);

        storeData('GEMA Repertoire Search', iswcs, workCodes, title);
    }

    function injectButtons(parentNode = document) {
        parentNode.querySelectorAll('[id="auswahlForm:searchResultItems:tb"] > tr').forEach((tr) => {
            let button = document.createElement('button');
            button.innerText = 'Copy work codes';
            button.addEventListener('click', (event) => {
                event.preventDefault();
                parseAndCopy(tr);
            });
            tr.querySelector('.empty').prepend(button);
        });
    }

    /** @type {MutationCallback} */
    function handleChangeGEMA(mutationRec) {
        if (mutationRec.length == 0 || mutationRec[0].addedNodes.length == 0) return; // Not an addition

        const searchResults = mutationRec[0].addedNodes[0];
        if (searchResults.nodeType !== Node.ELEMENT_NODE) return;

        injectButtons(searchResults);
    }

    // GEMA overwrites `JSON.stringify()` with a custom implementation which causes `JSON.parse()` to fail on MB.
    // Restore it again using the original implementation which seems to be backed up as `Object.toJSON()`.
    if (Object.toJSON) {
        JSON.stringify = Object.toJSON;
    }

    const observer = new MutationObserver(handleChangeGEMA);
    observer.observe(document.querySelector('div.body'), {
        childList: true,
    });

    injectButtons(); // initial loading might remember the last search
}


const repertoireToHandler = {
    'iswcnet.cisac.org': handleISWCNet,
    'online.gema.de': handleGEMA,
};

if (document.location.hostname === 'musicbrainz.org' || document.location.hostname.endsWith('.musicbrainz.org')) {
    handleMB();
} else {
    repertoireToHandler[document.location.hostname]();
}
