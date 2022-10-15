import { qsa } from '@lib/util/dom';

function setCheckboxToTargetState(checkbox: HTMLInputElement, targetState: boolean): void {
    if (checkbox.checked === targetState) return;
    checkbox.checked = targetState;
    checkbox.dispatchEvent(new Event('click'));
}

function addButtons(pElement: Element, classSelector: string): void {
    // Intended state of the checkboxes after "(de)select all" is clicked.
    let nextTargetState = true;

    function onSelectAllClicked(): void {
        qsa<HTMLInputElement>(classSelector).forEach((cbox) => {
            setCheckboxToTargetState(cbox, nextTargetState);
        });

        selectAllBtn.textContent = nextTargetState ? 'Deselect all' : 'Select all';
        nextTargetState = !nextTargetState;
    }

    function onToggleAllClicked(): void {
        qsa<HTMLInputElement>(classSelector).forEach((cbox) => {
            setCheckboxToTargetState(cbox, !cbox.checked);
        });
    }

    const selectAllBtn = <button type='button' className='ROpdebee_select_all' onClick={onSelectAllClicked}>Select all</button>;
    const toggleAllBtn = <button type='button' className='ROpdebee_update_all' onClick={onToggleAllClicked}>Toggle all</button>;

    pElement.append(selectAllBtn);
    pElement.append(toggleAllBtn);
}

function addButtonsOnLoad(): void {
    if (qsa('button.ROpdebee_select_all').length > 0) return;

    const pElements = qsa('#recordings > .changes > fieldset > p');

    if (pElements.length > 1) {
        addButtons(pElements[2], '.update-recording-title');
        addButtons(pElements[3], '.update-recording-artist');
    }
}

// Try to add the buttons periodically. If they already exist, the function
// will do nothing. Note that we're not clearing the interval since React may
// remove the element in which the buttons exist, causing us to have to re-add
// them later.
// TODO: Use a mutation observer.
setInterval(addButtonsOnLoad, 500);
