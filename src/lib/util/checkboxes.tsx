/**
 * Create a checkbox whose status will be saved in local storage, and will be
 * initialised to the last-saved status.
 *
 * @param      {string}                                id         The checkbox ID and local storage key.
 * @param      {string}                                label      The label text to use.
 * @param      {EventListener}                         changedCb  Callback to be called when checked status changes.
 * @return     {[HTMLInputElement, HTMLLabelElement]}  Checkbox and its label.
 */
export function createPersistentCheckbox(id: string, label: string, changedCallback: EventListener): [HTMLInputElement, HTMLLabelElement] {
    const checkbox = <input
        type='checkbox'
        id={id}
        onChange={(event_): void => {
            if (event_.currentTarget.checked) {
                localStorage.setItem(id, 'delete_to_disable');
            } else {
                localStorage.removeItem(id);
            }
            changedCallback(event_);
        }}
        defaultChecked={!!localStorage.getItem(id)}
    /> as HTMLInputElement;
    const labelElement = <label
        htmlFor={id}
    >{label}</label> as HTMLLabelElement;

    return [checkbox, labelElement];
}
