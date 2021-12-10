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
    AddCoverArtPage.hasEditNote('https://via.placeholder.com/150.png');
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
    AddCoverArtPage.hasEditNote('https://via.placeholder.com/150.jpeg');
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it accepts GIFs', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');

    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_selective.gif');

    I.see('Successfully added 1 image(s)');
    AddCoverArtPage.hasQueuedArtwork({
        name: 'cupertino_activity_indicator_selective.0.gif',
        types: [],
        comment: '',
        contentDigest: 'dae3921355ceba50d5edfae98f4170bd',
    });
    AddCoverArtPage.hasEditNote('https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_selective.gif');
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it accepts PDFs', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');

    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://www.tagg.org/pdftest.pdf');

    I.see('Successfully added 1 image(s)');
    AddCoverArtPage.hasQueuedArtwork({
        name: 'pdftest.0.pdf',
        types: [],
        comment: '',
        // Don't check digest, this is a PDF and there's no preview.
    });
    AddCoverArtPage.hasEditNote('https://www.tagg.org/pdftest.pdf');
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it accepts multiple images', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');

    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://via.placeholder.com/150.png');
    I.see('Successfully added 1 image(s)');
    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://via.placeholder.com/151.png');
    I.see('Successfully added 1 image(s)');

    AddCoverArtPage.hasNumberOfQueuedArtworks(2);
    AddCoverArtPage.hasQueuedArtwork({
        name: '150.0.png',
        types: [],
        comment: '',
        contentDigest: '39eab4af850c0db4a3c32f582873b2c2',
    });
    AddCoverArtPage.hasQueuedArtwork({
        name: '151.1.png',
        types: [],
        comment: '',
        contentDigest: '0840c43d36b6e0b2258979a13f48f970',
    });
    AddCoverArtPage.hasEditNote('https://via.placeholder.com/150.png\nhttps://via.placeholder.com/151.png');
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it does not accept same image twice', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');

    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://via.placeholder.com/150.png');
    I.see('Successfully added 1 image(s)');
    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://via.placeholder.com/150.png');
    I.see('150.png has already been added');

    AddCoverArtPage.hasNumberOfQueuedArtworks(1);
    AddCoverArtPage.hasQueuedArtwork({
        name: '150.0.png',
        types: [],
        comment: '',
        contentDigest: '39eab4af850c0db4a3c32f582873b2c2',
    });
    AddCoverArtPage.hasEditNote('https://via.placeholder.com/150.png');
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it maximises images', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');

    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://f4.bcbits.com/img/a0445850066_16.jpg');
    I.see('Successfully added 1 image(s)');

    AddCoverArtPage.hasQueuedArtwork({
        name: 'a0445850066_0.0.jpeg',
        types: [],
        comment: '',
        contentDigest: 'dd4882d6d0d003d1a75e7177d62fb41f',
    });
    AddCoverArtPage.hasEditNote('https://f4.bcbits.com/img/a0445850066_16.jpg\n→ Maximised to https://f4.bcbits.com/img/a0445850066_0.jpg');
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it recognises redirects', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');

    I.pasteText(AddCoverArtPage.fields.pasteUrl, 'https://archive.org/download/mbid-9370fe78-42f6-4ec2-9843-da86c6269f39/mbid-9370fe78-42f6-4ec2-9843-da86c6269f39-28553861546_thumb.jpg');
    // Can take a while to load this image
    I.waitForText('Successfully added 1 image(s)', 5);

    AddCoverArtPage.hasQueuedArtwork({
        name: 'mbid-9370fe78-42f6-4ec2-9843-da86c6269f39-28553861546_thumb.0.jpeg',
        types: [],
        comment: '',
        contentDigest: '48820510391c6213ffba5f2ce988e3d2',
    });
    AddCoverArtPage.hasEditNote('https://archive.org/download/mbid-9370fe78-42f6-4ec2-9843-da86c6269f39/mbid-9370fe78-42f6-4ec2-9843-da86c6269f39-28553861546_thumb.jpg\n→ Redirected to https://ia\\d+.us.archive.org/\\d+/items/mbid-9370fe78-42f6-4ec2-9843-da86c6269f39/mbid-9370fe78-42f6-4ec2-9843-da86c6269f39-28553861546_thumb.jpg');
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});
