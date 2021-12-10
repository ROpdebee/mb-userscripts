-- This should work for all provider tests whose test data adds exactly one URL
-- and (possibly many) links with that URL. The URL must be added with ID 1.
DELETE FROM l_release_url WHERE entity1 = 1;
DELETE FROM link l WHERE NOT EXISTS (SELECT 1 FROM l_release_url lru WHERE lru.link = l.id);
DELETE FROM url WHERE id = 1;
