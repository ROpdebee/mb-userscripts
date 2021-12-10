DELETE FROM l_release_url WHERE entity1 IN (1, 2, 3);
DELETE FROM link l WHERE NOT EXISTS (SELECT 1 FROM l_release_url lru WHERE lru.link = l.id);
DELETE FROM url WHERE id IN (1, 2, 3);
