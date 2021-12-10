import { ArtworkTypeIDs } from '@lib/MB/CoverArt';

Feature('MB: Enhanced Cover Art Uploads: 7digital Provider').config('DB', {
    extraSql: './sql/7digital.sql',
    revertSql: './sql/revertProviderReleaseUrls.sql',
});

Scenario('it can grab cover art', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');
    I.click('Import from 7digital');

    I.waitForText('Successfully added 1 image(s)', 5);
    AddCoverArtPage.hasQueuedArtwork({
        name: '0005666885_800.0.jpeg',
        types: [ArtworkTypeIDs.Front],
        comment: '',
        contentDigest: '1ef2484dddb098f223a8c0cada6c8807',
    });
    AddCoverArtPage.hasEditNote(`https://us.7digital.com/artist/vanessa-verduga/release/owner-of-my-heart-5666885
 * https://artwork-cdn.7static.com/static/img/sleeveart/00/056/668/0005666885_200.jpg
   → Maximised to https://artwork-cdn.7static.com/static/img/sleeveart/00/056/668/0005666885_800.jpg`);
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

///////////////////////////////////////////////////////////////////////////////

Feature('MB: Enhanced Cover Art Uploads: AllMusic Provider').config('DB', {
    extraSql: './sql/allmusic.sql',
    revertSql: './sql/revertProviderReleaseUrls.sql',
});

Scenario('it can grab cover art', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');
    I.click('Import from AllMusic');

    I.waitForText('Successfully added 2 image(s)', 10);
    AddCoverArtPage.hasNumberOfQueuedArtworks(2);
    AddCoverArtPage.hasQueuedArtwork({
        name: 'image.0.jpeg',
        types: [],
        comment: '',
        contentDigest: '60d49463ef134b81173249eb06e583ab',
    });
    AddCoverArtPage.hasQueuedArtwork({
        name: 'image.1.jpeg',
        types: [],
        comment: '',
        contentDigest: '023398de4974f548860fe0d01be16ad6',
    });
    AddCoverArtPage.hasEditNote(`https://www.allmusic.com/album/release/mr0003384948
 * https://rovimusic.rovicorp.com/image.jpg?c=lED1leTKqZwcBOMMluG6Cj6KsMttLlyBmmVTZ6_CLs0=&f=0
 * https://rovimusic.rovicorp.com/image.jpg?c=lWGxyp3QhbbilnskY3pjvASijaXJlYnq0St31qpAJWo=&f=0`);
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

///////////////////////////////////////////////////////////////////////////////

Feature('MB: Enhanced Cover Art Uploads: Amazon Provider').config('DB', {
    extraSql: './sql/amazon.sql',
    revertSql: './sql/revertAmazon.sql',
});

Scenario('it can grab cover art for physical products', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/dd245091-b21e-48a3-b59a-f9b8ed8a0469/add-cover-art');
    I.click('Import from Amazon');

    I.waitForText('Successfully added 5 image(s)', 15);
    AddCoverArtPage.hasNumberOfQueuedArtworks(5);
    AddCoverArtPage.hasQueuedArtwork({
        name: '81bqssuW6LL.0.jpeg',
        types: [ArtworkTypeIDs.Front],
        comment: '',
        contentDigest: 'f4c8ef8ef8c5b1a64ca010a53d70cd80',
    });
    AddCoverArtPage.hasQueuedArtwork({
        name: '61jZYB6BJYL.1.jpeg',
        types: [ArtworkTypeIDs.Back],
        comment: '',
        contentDigest: '6896fbda10175df61e7c8fc760b71216',
    });
    AddCoverArtPage.hasEditNote(`https://www.amazon.de/gp/product/B07QWNQT8X
 * https://m.media-amazon.com/images/I/81bqssuW6LL._SL1500_.jpg
   → Maximised to https://m.media-amazon.com/images/I/81bqssuW6LL.jpg
 * https://m.media-amazon.com/images/I/61jZYB6BJYL._SL1200_.jpg
   → Maximised to https://m.media-amazon.com/images/I/61jZYB6BJYL.jpg
 * https://m.media-amazon.com/images/I/71TLgC33KgL._SL1500_.jpg
   → Maximised to https://m.media-amazon.com/images/I/71TLgC33KgL.jpg
…and 2 additional image(s)`);
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it can grab cover art for digital products', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/24d4159a-99d9-425d-a7b8-1b9ec0261a33/add-cover-art');
    I.click('Import from Amazon');

    I.waitForText('Successfully added 1 image(s)', 10);
    AddCoverArtPage.hasNumberOfQueuedArtworks(1);
    AddCoverArtPage.hasQueuedArtwork({
        name: '819w7BrMFgL.0.jpeg',
        types: [ArtworkTypeIDs.Front],
        comment: '',
        contentDigest: '7bda9289ce68b6190925254417b81fa9',
    });
    AddCoverArtPage.hasEditNote(`https://www.amazon.de/dp/B07RC3958J
 * https://m.media-amazon.com/images/I/819w7BrMFgL._SS500_.jpg
   → Maximised to https://m.media-amazon.com/images/I/819w7BrMFgL.jpg`);
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});

Scenario('it can grab cover art for audiobooks', ({ I, login, AddCoverArtPage }) => {
    login('user');
    I.amOnPage('/release/1bda2f85-0576-4077-b3fa-0fc939079b61/add-cover-art');
    I.click('Import from Amazon');

    I.waitForText('Successfully added 2 image(s)', 10);
    AddCoverArtPage.hasNumberOfQueuedArtworks(2);
    AddCoverArtPage.hasQueuedArtwork({
        name: '91OEsuYoClL.0.jpeg',
        types: [],
        comment: '',
        contentDigest: '21d694c0e067c4a64388929b097df79a',
    });
    AddCoverArtPage.hasQueuedArtwork({
        name: '91NVbKDHCWL.1.jpeg',
        types: [],
        comment: '',
        contentDigest: 'f78416288f87258c2438e31a81a9a9a4',
    });
    AddCoverArtPage.hasEditNote(`https://www.amazon.de/dp/0563504196
 * https://images-na.ssl-images-amazon.com/images/I/91OEsuYoClL.jpg
 * https://images-na.ssl-images-amazon.com/images/I/91NVbKDHCWL.jpg`);
}).inject({
    AddCoverArtPage: require('./AddCoverArtPage'),
});
