-- Nine more questions, and a trigger that cannot lose a vote to a missing row.
--
-- The counter rows have to exist before a vote arrives: the old trigger
-- incremented with an UPDATE, which quietly does nothing when there is no
-- row to update. A vote for a question nobody had seeded would have landed
-- in `votes` and never reached the tally — right the first time it mattered
-- and silently wrong afterwards.
INSERT OR IGNORE INTO tallies (question, choice, n) VALUES
  ('q11','g',0), ('q11','b',0),
  ('q12','g',0), ('q12','b',0),
  ('q13','g',0), ('q13','b',0),
  ('q14','g',0), ('q14','b',0),
  ('q15','g',0), ('q15','b',0),
  ('q16','g',0), ('q16','b',0),
  ('q17','g',0), ('q17','b',0),
  ('q18','g',0), ('q18','b',0),
  ('q19','g',0), ('q19','b',0);

-- Upsert instead of update, so seeding is a convenience rather than a
-- correctness requirement from here on.
DROP TRIGGER IF EXISTS votes_tally_insert;
CREATE TRIGGER votes_tally_insert
AFTER INSERT ON votes
BEGIN
  INSERT INTO tallies (question, choice, n) VALUES (NEW.question, NEW.choice, 1)
  ON CONFLICT(question, choice) DO UPDATE SET n = n + 1;
END;
