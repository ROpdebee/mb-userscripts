Feature('MB: Enhanced Cover Art Uploads: Direct URL Upload');

Scenario('it accepts PNGs', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');

    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://via.placeholder.com/150.png');

    I.see('Successfully added 1 image(s)');
    AddCoverArtPage.hasQueuedArtwork({
        name: '150.0.png',
        types: [],
        comment: '',
        contentDigest: '39eab4af850c0db4a3c32f582873b2c2',
    });
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it accepts JPEGs', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');

    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://via.placeholder.com/150.jpeg');

    I.see('Successfully added 1 image(s)');
    AddCoverArtPage.hasQueuedArtwork({
        name: '150.0.jpeg',
        types: [],
        comment: '',
        contentDigest: 'b02ba78507170f38f9a2550ab094e3e8',
    });
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});
