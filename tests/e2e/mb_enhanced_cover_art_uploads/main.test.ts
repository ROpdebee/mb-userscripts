Feature('MB: Enhanced Cover Art Uploads GUI');

Scenario('it adds GUI elements', ({ I, login }) => {
    login('user');
    I.amOnPage('/release/d925018e-b4e2-4553-99a4-47f35fcd9766/add-cover-art');
    within('.add-files.row', () => {
        I.seeAttributesOnElements('input#ROpdebee_paste_url', {placeholder: 'or paste one or more URLs here'});
        I.see('Supported providers');
        I.see('Fetch front image only');
    });
});

Scenario('it adds provider import buttons', ({ I, login }) => {
    login('user');
    I.amOnPage('/release/d925018e-b4e2-4553-99a4-47f35fcd9766/add-cover-art');
    within('.add-files.row', () => {
        I.see('Import from Amazon');
        I.see('Import from VGMdb');
    });
});
