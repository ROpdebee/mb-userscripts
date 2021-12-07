-- The editor our tests will log in to
INSERT INTO editor (id, name, password, privs, ha1, email, email_confirm_date)
    VALUES (1, 'TestBot', '{CLEARTEXT}sekrit', 2, '16a4862191803cb596ee4b16802bb7ee', 'testbot@ropdeb.ee', '2013-07-26 11:48:31.088042+00');

-- t/initial.sql doesn't include this one
INSERT INTO cover_art_archive.art_type
    VALUES (14, 'Raw/Unedited', NULL, 0, 'Use for images that need work to be used for tagging (but can possibly already be used for reference)', 'c76e83e2-d175-4487-9e58-d960eb6fad4f');
