Feature('MB: Enhanced Cover Art Uploads GUI');

Scenario('it adds GUI elements', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');
    within(AddCoverArtPage.addFilesContainer, () => {
        I.seeAttributesOnElements(AddCoverArtPage.fields.pasteUrl, {placeholder: 'or paste one or more URLs here'});
        I.see('Supported providers');
        I.see('Fetch front image only');
    });
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it adds provider import buttons', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/1bda2f85-0576-4077-b3fa-0fc939079b61/add-cover-art');
    within(AddCoverArtPage.addFilesContainer, () => {
        I.see('Import from Bandcamp');
    });
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});
