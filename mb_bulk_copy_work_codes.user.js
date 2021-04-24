// ==UserScript==
// @name         MB: Bulk copy-paste work codes
// @version      2021.4.24
// @description  Copy work identifiers from various online repertoires and paste them into MB works with ease.
// @author       ROpdebee
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://github.com/ROpdebee/mb-userscripts
// @downloadURL  https://raw.github.com/ROpdebee/mb-userscripts/main/mb_bulk_copy_work_codes.user.js
// @updateURL    https://raw.github.com/ROpdebee/mb-userscripts/main/mb_bulk_copy_work_codes.user.js
// @match        https://iswcnet.cisac.org/*
// @match        *://musicbrainz.org/*/edit
// @match        *://*.musicbrainz.org/*/edit
// @match        *://musicbrainz.org/release/*/edit-relationships
// @match        *://*.musicbrainz.org/release/*/edit-relationships
// @match        *://musicbrainz.org/*/create
// @match        *://*.musicbrainz.org/*/create
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

// Helper for LatinNet agencies, optionally suffixed by their CISAC agency number,
// which is removed.
function latinNetID(agencyId) {
    return {
        inRegexp: new RegExp(`(\\d{0,7})(?:${agencyId})?`),
        outFormat: '$1',
        keepLeadingZeroes: false,
    }
}

/**
 * Key: Agency property name
 * Value:
 *      inRegexp: A RegExp applied on the input to validate the input. ^ and $
 *                will automatically be inserted at the start and end of the regexp,
 *                respectively.
 *      outFormat: A string applied to transform the input to a formatted output.
 *                 Captured groups of the input RegExp will be available here,
 *                 the same format can be used as String.replace. If empty or
 *                 undefined, defaults to the portion of the string that is
 *                 matched by the inRegexp. Can also be a function.
 *      keepLeadingZeroes: Boolean flag, optional, by default false. If true,
 *                         leading zeroes will not be trimmed from the input
 *                         before feeding into the input regexp.
 *      ensureLength: Integer, pads the input to the given length at the start
 *                    with the given padCharacter if the input is not of that
 *                    length.
 *      padCharacter: 1 character string, used to pad to the ensured length.
 *      message: Additional info to show when validation/formatting fails.
 * The value can also be an array of different options to try.
 */
const CODE_FORMATS = {
    'AACIMH ID': {
        inRegexp: /\d{0,7}/,
    },
    'ACAM ID': latinNetID('107'),
    'ACDAM ID': latinNetID('103'),
    'AEI ID': latinNetID('250'),
    'AGADU ID': latinNetID('004'),
    'AKKA/LAA ID': [{
        inRegexp: /\d{0,8}/,
    }, {
        inRegexp: /\d{5}M/,
        keepLeadingZeroes: true,
    }],
    'AKM ID': {
        // FIXME: This cannot distinguish between bare work codes and work codes with revision numbers.
        // E.g. 649501
        inRegexp: /\d{0,8}(?:-?\d{2})?/,
    },
    'AMRA ID': {
        inRegexp: /AWK\d{0,7}/,
    },
    'APA ID': latinNetID('015'),
    'APDAYC ID': [
        latinNetID('007'),
        {
            inRegexp: /\d{8}/,
        }],
    'APRA ID': {
        inRegexp: /(?:GW|BG|JG|PM)\d{8}/,
    },
    'ARTISJUS ID': {
        inRegexp: /4\d{9}/,
    },
    'ASCAP ID': {
        inRegexp: /\d{0,14}/,
    },
    'BMI ID': {
        inRegexp: /\d{0,8}/,
    },
    'BUMA/STEMRA ID': {
        inRegexp: /W-\d{9}/,
    },
    'CASH ID': {
        inRegexp: /[CMPU]-\d{10}/,
        message: 'CISAC ISWCNet does not include the letter prefix, this has to be retrieved from CASH\'s repertory itself.'
    },
    'CCLI ID': {
        inRegexp: /\d{0,7}/,
    },
    'COMPASS ID': {
        inRegexp: /\d{0,8}/,
    },
    'COTT ID': {
        inRegexp: /\d{0,7}/,
    },
    'ECAD ID': {
        inRegexp: /\d{0,8}/,
    },
    'GEMA ID': {
        inRegexp: /(\d{0,8})[\-‐](\d{3})/,
        outFormat: '$1-$2',
    },
    'HFA ID': {
        inRegexp: /[A-Z0-9]{6}/,
    },
    'ICE ID': {
        inRegexp: /\d{0,8}/,
    },
    'IMRO ID': {
        inRegexp: /R\d{0,8}/,
    },
    'JASRAC ID': {
        inRegexp: /(\d[0-9A-Z]\d)-?(\d{4})-?(\d)/,
        outFormat: '$1-$2-$3',
        keepLeadingZeroes: true,
    },
    'KODA ID': {
        inRegexp: /\d{0,8}/,
    },
    'KOMCA ID': [{
        inRegexp: /\d{12}/,
    }, {
        inRegexp: /0000M\d{5,7}/,
        keepLeadingZeroes: true,
    }],
    'LatinNet ID': {
        inRegexp: /\d{3,4}/,
    },
    'MACP ID': {
        inRegexp: /1\d{9}/,
    },
    'MÜST ID': {
        inRegexp: /1\d{9}/,
    },
    'NexTone ID': {
        inRegexp: /N\d{8}/,
    },
    'NICAUTOR ID': {
        inRegexp: /\d{0,7}/,
    },
    'OSA ID': {
        inRegexp: /(I\d{3})\.?(\d{2})\.?(\d{2})\.?(\d{2})/,
        outFormat: '$1.$2.$3.$4',
    },
    'PRS tune code': {
        inRegexp: /\d{4,6}[0-9A-Z][A-Z]/,
    },
    'SABAM ID': {
        inRegexp: /\d{0,9}|[A-Z0-9]{7}\d{2}/,
    },
    'SACEM ID': {
        inRegexp: /(\d{2})\s?(\d{3})\s?(\d{3})\s?(\d{2})/,
        outFormat: '$1 $2 $3 $4',
    },
    'SACM ID': {
        // NOTE: Keeping all leading zeroes here, because without the leading
        // zeroes, their own repertory search doesn't find the work.
        inRegexp: /[0-9A-Z]\d{8}/,
        ensureLength: 9,
        padCharacter: '0',
        message: 'SACM IDs are required to be zero-padded until 9 characters.'
    },
    'SACIM ID': {
        inRegexp: /\d{0,7}/,
    },
    'SACVEN ID': latinNetID('060'),
    'SADAIC ID': latinNetID('061'),
    'SAYCE ID': {
        inRegexp: /(\d{0,8})(?:065)?/,
        outFormat: '$1',
    },
    'SAYCO ID': {
        inRegexp: /(\d{0,8})(?:084)?/,
        outFormat: '$1',
    },
    'SESAC ID': {
        inRegexp: /\d{0,9}/,
    },
    'SGACEDOM ID': {
        inRegexp: /\d{0,7}/,
    },
    'SGAE ID': {
        inRegexp: /(\d{1,3})(?:\.?(\d{3}))?(?:\.?(\d{3}))?/,
        outFormat: (match, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join('.'),
    },
    'SIAE ID': {
        inRegexp: /\d{7,9}0[01]/,
    },
    'SOBODAYCOM ID': {
        inRegexp: /\d{0,7}/,
    },
    'SOCAN ID': {
        inRegexp: /2?\d{8}/,
    },
    'SODRAC ID': {
        inRegexp: /\d{0,7}/,
    },
    'SPA ID': {
        inRegexp: /\d{0,7}/,
    },
    'SPAC ID': {
        inRegexp: /\d{0,7}/,
    },
    'STEF ID': {
        inRegexp: /\d{0,8}/,
    },
    'STIM ID': {
        inRegexp: /\d{0,8}/,
    },
    'SUISA ID': {
        inRegexp: /(\d{6})\s?(\d{3})\s?(\d{2})/,
        outFormat: '$1 $2 $3',
        ensureLength: 13,  // Account for possible spaces too
        padCharacter: '0',  // Extraneous spaces inserted here will be removed
    },
    'TEOSTO ID': {
        inRegexp: /\d{8,9}/,
    },
    'ZAiKS ID': {
        inRegexp: /\d{0,7}/,
    },
};

function wrapRegex(start, regexp, end) {
    return new RegExp(start + regexp.source + end);
}

function validateCode(code, agencyId) {
    let rules = CODE_FORMATS[agencyId];
    if (!rules) {
        // We don't have a validator for this agency, assume it's valid.
        return {
            isValid: true,
            input: code,
        };
    }

    if (rules instanceof Array) {
        let partialResult;
        for (let i = 0; i < rules.length; i++) {
            partialResult = validateCodeSingleRule(code, rules[i]);
            if (partialResult.isValid) {
                break;
            }
        }

        return partialResult;
    }
    return validateCodeSingleRule(code, rules);
}

function validateCodeSingleRule(code, rule) {
    let inputRegexp = rule.inRegexp;
    let outFormat = rule.outFormat;
    if (!outFormat) {
        // Insert a capture group
        inputRegexp = wrapRegex('(', inputRegexp, ')');
        outFormat = '$1';
    } else {
        inputRegexp = wrapRegex('(?:', inputRegexp, ')');
    }

    if (!rule.keepLeadingZeroes) {
        inputRegexp = wrapRegex('0*', inputRegexp, '');
    }

    inputRegexp = wrapRegex('^', inputRegexp, '$');

    if (rule.ensureLength && rule.padCharacter) {
        code = code.padStart(rule.ensureLength, rule.padCharacter);
    }

    let result = {
        input: code,
    };

    if (!inputRegexp.test(code)) {
        result.isValid = false;
        if (rule.message) {
            result.message = rule.message;
        }
        return result;
    }

    result.isValid = true;

    // Try formatting
    let formatted = code.replace(inputRegexp, outFormat);

    if (!formatted) {
        console.error(`Failed to format ${code}`);
        formatted = code;
    }

    result.formattedCode = formatted;
    result.wasChanged = formatted != code;

    return result;
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

function normaliseID(id) {
    // Fairly aggressive normalisation, just used for comparisons
    // https://tickets.metabrainz.org/browse/MBS-11377
    return id.replace(/(?:^0+|[\.\s-])/g, '');
}

// For agencies where the MB ID isn't just `<agency name> ID`
const agencyKeyTransformations = {
    'BUMA': 'BUMA/STEMRA ID',
    'PRS': 'PRS tune code',
    'SESAC Inc.': 'SESAC ID',
    'ZAIKS': 'ZAiKS ID',
};

function agencyNameToID(agencyName) {
    if (agencyKeyTransformations.hasOwnProperty(agencyName)) {
        return agencyKeyTransformations[agencyName];
    }
    return agencyName += ' ID';
}

function getSelectedID(select) {
    return select.options[select.selectedIndex].text.trim();
}

function setRowKey(select, agencyKey) {
    let idx = [...select.options].findIndex(opt => opt.text.trim() === agencyKey);
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
        .filter(k => extCodes[k].map(normaliseID).difference(mbCodes[k].map(normaliseID)).length)
        .map(k => [k, mbCodes[k], extCodes[k]]);
}


function extractCodes(data) {
    let agencyCodes = data['agencyCodes'];
    return Object.entries(agencyCodes).reduce(
        (acc, [key, codes]) => {
            acc[agencyNameToID(key)] = codes;
            return acc;
        }, {});
}


function retainOnlyNew(externalCodes, mbCodes) {
    return Object.entries(externalCodes).reduce((acc, [key, codes]) => {
        if (!mbCodes.hasOwnProperty(key)) {
            acc[key] = codes;
        } else {
            let mbNormCodes = mbCodes[key].map(normaliseID)
            acc[key] = codes
                .filter(id => !mbNormCodes.includes(normaliseID(id)));
        }
        return acc;
    }, {});
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
                this.formatExistingCodes();
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
    }

    checkExistingCodes() {
        this.existingCodeInputs.forEach(({ select, input }) => {
            let agencyKey = getSelectedID(select);
            let agencyCode = input.value;
            let checkResult = validateCode(agencyCode, agencyKey);

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
            let checkResult = validateCode(agencyCode, agencyKey);

            if (checkResult.isValid && checkResult.wasChanged) {
                fillInput(input, checkResult.formattedCode);
                this.log('info', `Changed ${agencyKey} ${agencyCode} to ${checkResult.formattedCode}`);
                formattedAny = true;
            }
        });

        if (formattedAny) {
            this.fillEditNote([], 'existing', true);
        }
    }

    resetLog() {
        let logDiv = this.form.querySelector('div#ROpdebee_MB_Paste_Work_Log');
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
            let newCodes = retainOnlyNew(externalCodes, mbCodes);
            this.fillData(newISWCs, newCodes, data['title'], data['source']);
            let numWarnings = this.form.querySelectorAll('div#ROpdebee_MB_Paste_Work_Log > div').length;
            this.log('success', 'Filled successfully' + (numWarnings ? ` (${numWarnings} message(s))` : ''));
        });
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
            let formatResult = validateCode(code, agencyKey);
            let fillCode = formatResult.isValid && this.autoformatCodes ? formatResult.formattedCode : formatResult.input;
            let input = this.findEmptyRow('table#work-attributes', 'edit-work.attributes.');
            // Will throw when the agency isn't know the MB, handled by caller.
            setRowKey(input.closest('tr').querySelector('td > select'), agencyKey);
            fillInput(input, fillCode);
            if (!formatResult.isValid) {
                input.style.backgroundColor = 'red';
                this.addValidationError(agencyKey, fillCode, formatResult.message);
            } else if (formatResult.wasChanged && this.autoformatCodes) {
                this.log('info', `Changed ${agencyKey} ${code} to ${fillCode}`);
            } else if (formatResult.wasChanged) {
                this.addFormatWarning(agencyKey, fillCode);
            }
        });
    }


    fillEditNote(unknownAgencies, source, wasFormatted) {
        let noteContent = unknownAgencies.reduce((acc, [agencyKey, agencyCodes]) => {
            return acc + agencyKey + ': ' + agencyCodes.join(', ') + '\n';
        }, unknownAgencies.length ? 'Unsupported agencies:\n' : '');

        if (noteContent) {
            this.fillEditNoteTop(noteContent);
        }

        let editNoteBottom = `${GM_info.script.name} v${GM_info.script.version} (source: ${source}, formatting applied: ${wasFormatted})`;

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
// ISWCNet
//////////////

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

function handleISWCNet() {

    function findAgencyWorkCodes(table) {
        let codeTable = findDivByText(table, 'Agency Work Codes:').map(div => div.nextSibling);
        if (!codeTable.length) return {};

        let rows = [...codeTable[0].querySelectorAll('tbody > tr')];
        return rows.groupBy(
                row => row.querySelector('td[id="Agency Name:"]').innerText,
                row => row.querySelector('td[id="Agency Work Code:"]').innerText);
    }

    function findIswc(table) {
        return table.querySelector('td[id="Preferred ISWC:"]').innerText;
    }

    function findTitle(table) {
        return table.querySelector('td[id="Original Title:"]').innerText;
    }

    function parseAndCopy(table) {
        let workCodes = findAgencyWorkCodes(table);
        let iswcs = [findIswc(table)];
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

const repertoireToHandler = {
    'iswcnet.cisac.org': handleISWCNet,
};

if (document.location.hostname.endsWith('musicbrainz.org')) {
    handleMB();
} else {
    repertoireToHandler[document.location.hostname]();
}
