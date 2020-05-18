TRUNCATE notes;

INSERT INTO  notes (note_name, modified, folderId, content)
VALUES 
  ('Dogs', now() - '3 days'::INTERVAL, 1, 'I like dogs a lot man...'),
  ('Cats', now() - '32 days'::INTERVAL, 1, 'I guess I like cats too'),
  ('Pigs', now() - '2 days'::INTERVAL, 1, 'I guess I like pigs too'),
  ('Birds', now() - '1 days'::INTERVAL, 2, 'I do not like birds'),
  ('Bears', now() - '3 days'::INTERVAL, 2, 'I do not like bears'),
  ('Horses', now() - '8 days'::INTERVAL, 2, 'I do not mind horses'),
  ('Bats', now() - '11 days'::INTERVAL, 3, 'I do not mind bats'),
  ('Turtles', now() - '5 days'::INTERVAL, 3, 'I like turtles'),
  ('Zebras', now() - '1 days'::INTERVAL, 3, 'I do not mind zebras')
;