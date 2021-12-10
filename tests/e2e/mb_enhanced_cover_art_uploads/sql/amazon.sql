-- Physical product
INSERT INTO url(id, gid, url) VALUES
    (1, 'af166a29-a530-4266-a7ad-9e951fe89dcf', 'https://www.amazon.de/gp/product/B07QWNQT8X');
INSERT INTO link(id, link_type) VALUES
    (1, 77);
INSERT INTO l_release_url(id, link, entity0, entity1) VALUES
    (1, 1, 26, 1);

-- Digital product
INSERT INTO url(id, gid, url) VALUES
    (2, 'bf166a29-a530-4266-a7ad-9e951fe89dcf', 'https://www.amazon.de/dp/B07RC3958J');
INSERT INTO link(id, link_type) VALUES
    (2, 77);
INSERT INTO l_release_url(id, link, entity0, entity1) VALUES
    (2, 2, 1693299, 2);

-- Audiobook
INSERT INTO url(id, gid, url) VALUES
    (3, 'cf166a29-a530-4266-a7ad-9e951fe89dcf', 'https://www.amazon.de/dp/0563504196');
INSERT INTO link(id, link_type) VALUES
    (3, 77);
INSERT INTO l_release_url(id, link, entity0, entity1) VALUES
    (3, 3, 2154808, 3);
