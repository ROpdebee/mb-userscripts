// ==UserScript==
// @name         MB: Bulk copy-paste work codes
// @version      2021.2.16
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


//////////////
// MB
//////////////

function handleMB() {

    // For agencies where the MB ID isn't just `<agency name> ID`
    const agencyKeyTransformers = {
        'BUMA': 'BUMA/STEMRA ID',
        'PRS': 'PRS tune code',
        'SESAC Inc.': 'SESAC ID',
    };

    function agencyNameToID(agencyName) {
        if (agencyKeyTransformers.hasOwnProperty(agencyName)) {
            return agencyKeyTransformers[agencyName];
        }
        return agencyName += ' ID';
    }

    function normaliseID(id) {
        // Fairly aggressive normalisation, just used for comparisons
        // https://tickets.metabrainz.org/browse/MBS-11377
        return id.replace(/(?:^0+|[\.\s-])/g, '');
    }

    function getSelectedID(select) {
        return select.options[select.selectedIndex].text.trim();
    }

    function findExistingCodes(theForm) {
        return [...theForm
            .querySelectorAll('table#work-attributes tr')]
            .map(row => ({
                    'select': row.querySelector('td > select'),
                    'input': row.querySelector('td > input'),
                }))
            .filter(({ select, input }) => select !== null && select.selectedIndex !== 0 && input !== null && input.value)
            .groupBy(
                ({ select }) => getSelectedID(select),
                ({ input: { value }}) => value);
    }

    function findISWCs(theForm) {
        return [...theForm
            .querySelectorAll('input[name*="edit-work.iswcs."]')]
            .map(({ value }) => value)
            .filter(({ length }) => length);
    }

    function getAgencyConflicts(mbCodes, extCodes) {
        // Conflicting IDs when MB already has IDs for this key and the external codes
        // don't match the IDs that MB already has
        let commonKeys = Object.keys(mbCodes).intersect(Object.keys(extCodes));
        return commonKeys.filter(k => mbCodes[k].length && extCodes[k].map(normaliseID).difference(mbCodes[k].map(normaliseID)).length);
    }

    function parse(raw) {
        try {
            return JSON.parse(raw);
        } catch(e) {
            alert('Invalid data');
            console.log(raw);
            console.log(e);
            return {};
        }
    }


    function askForConfirmation(conflicts) {
        let msg = 'Uh-oh. MB already has the following codes with conflicting data:\n';
        msg += conflicts.join(', ');
        msg += '\nAre you sure you want to fill these?';
        msg += '\nNote: New codes will be added and will not replace the existing ones.';
        return window.confirm(msg);
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


    function pasteCodes(raw, table) {
        let data = parse(raw);
        let theForm = table.closest('form.edit-work');
        console.log(data);
        let externalCodes = extractCodes(data);
        let externalISWCs = data['iswcs'];
        let mbCodes = findExistingCodes(theForm);
        let mbISWCs = findISWCs(theForm);

        // Sanity check
        let dupeAgencies = Object.entries(externalCodes)
            .filter(([key, codes]) => codes.length > 1)
            .map(([key, codes]) => key);
        if (dupeAgencies.length) {
            alert(`WARNING: Found multiple codes for ${dupeAgencies.join(', ')}. `
                + 'Please double-check whether all of these codes belong to this work.');
        }
        let newISWCs = externalISWCs.difference(mbISWCs);
        let conflicts = getAgencyConflicts(mbCodes, externalCodes);
        if (newISWCs.length && mbISWCs.length) {
            conflicts.unshift('ISWC');
        }
        if (conflicts.length && !askForConfirmation(conflicts)) {
            console.log('Refusing to input codes');
            return;
        }

        let newCodes = retainOnlyNew(externalCodes, mbCodes);

        fillData(theForm, newISWCs, newCodes, data['title'], data['source']);
    }

    function fillInput(inp, val) {
        inp.value = val;
        inp.style.backgroundColor = 'yellow';
    }


    function fillData(theForm, iswcs, codes, title, source) {
        iswcs.forEach(iswc => fillISWC(theForm, iswc));
        let entries = Object.entries(codes);
        entries.sort();
        let unknownAgencyCodes = entries.reduce(
            (acc, [agencyKey, agencyCodes]) => {
                try {
                    fillAgencyCodes(theForm, agencyKey, agencyCodes);
                } catch (e) {
                    if (e.message === 'Unknown agency key') {
                        acc.push([agencyKey, agencyCodes]);
                    } else{
                        throw e;
                    }
                }
                return acc;
            }, []);

        maybeFillTitle(theForm, title);
        fillEditNote(theForm, unknownAgencyCodes, source);
    }

    function maybeFillTitle(root, title) {
        let titleInp = root.querySelector('input[name="edit-work.name"]');
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

    function getEmptyRow(root, parentSelector, inputName) {
        let parent = root.querySelector(parentSelector);
        let rows = [...parent.querySelectorAll('input[name*="' + inputName + '"]')];
        let emptyRows = rows.filter(({value}) => !value.length);
        if (emptyRows.length) {
            return emptyRows[0];
        }

        // Need to add a new row
        let newRowBtn = parent.querySelector('button.add-item');
        newRowBtn.click();
        return getEmptyRow(root, parentSelector, inputName);
    }

    function fillISWC(theForm, iswc) {
        let row = getEmptyRow(theForm, 'div.form-row-text-list', 'edit-work.iswcs.');
        fillInput(row, iswc);
    }


    function setRowKey(select, agencyKey) {
        let idx = [...select.options].findIndex(opt => opt.text.trim() === agencyKey);
        if (idx < 0) {
            throw new Error('Unknown agency key');
        }
        select.selectedIndex = idx;
    }

    function fillAgencyCodes(theForm, agencyKey, agencyCodes) {
        agencyCodes.forEach(code => {
            let input = getEmptyRow(theForm, 'table#work-attributes', 'edit-work.attributes.');
            // Will throw when the agency isn't know the MB, handled by caller.
            setRowKey(input.closest('tr').querySelector('td > select'), agencyKey);
            fillInput(input, code);
        });
    }


    function fillEditNote(theForm, unknownAgencies, source) {
        let noteContent = unknownAgencies.reduce((acc, [agencyKey, agencyCodes]) => {
            return acc + agencyKey + ': ' + agencyCodes.join(', ') + '\n';
        }, unknownAgencies.length ? 'Unsupported agencies:\n' : '');
        noteContent += '---\n';
        noteContent += `${GM_info.script.name} v${GM_info.script.version} (with data from ${source})\n`;

        let note = theForm.querySelector('textarea[name="edit-work.edit_note"]');
        let prevVal = note.value || '';

        // Adding a newline even if there's no content to add space for an edit note.
        noteContent = prevVal + '\n' + noteContent;

        note.value = noteContent;
    }

    function readData(cb) {
        let data = GM_getValue('workCodeData');
        if (!data) {
            alert('No data found. Did you copy anything?');
            return;
        }

        cb(data);
        // Reset again to prevent filling the same data on another edit page.
        GM_deleteValue('workCodeData');
    }

    function handleChange(mutationRec) {
        // Whenever a change occurs, try to add buttons to the attr table.
        let attrTables = [...document.querySelectorAll('table#work-attributes')];
        document.querySelectorAll('iframe').forEach(iframe =>
            iframe.contentWindow.document
                .querySelectorAll('table#work-attributes')
                .forEach(table => attrTables.push(table)));

        attrTables.forEach(addBtnToAttrTable);
    }

    function addBtnToAttrTable(attrTable) {
        if (attrTable.querySelector('button#ROpdebee_MB_Paste_Work')) {
            // Already added
            return;
        }
        let btn = document.createElement('button');
        btn.innerText = 'Paste work codes';
        btn.id = 'ROpdebee_MB_Paste_Work';
        btn.onclick = (evt) => {
            evt.preventDefault();
            readData(data => pasteCodes(data, attrTable));
        };
        attrTable.prepend(btn);
    }

    let attrTable = document.querySelector('table#work-attributes');
    if (attrTable) {
        addBtnToAttrTable(attrTable);
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
