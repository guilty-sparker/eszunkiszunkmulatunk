-- Running counts, so reading the odds never scans the votes table.
--
-- The votes table stays the source of truth; this is a derived cache that
-- SQLite maintains itself. A trigger fires only on a row that actually
-- landed, so the INSERT OR IGNORE that rejects a double vote also, for
-- free, fails to move the count. The application is never trusted for it.
CREATE TABLE IF NOT EXISTS tallies (
  question TEXT NOT NULL,
  choice   TEXT NOT NULL,
  n        INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (question, choice)
);

-- Every question/choice pair exists from the start at zero, so a read
-- returns a complete grid and the client never special-cases a missing row.
INSERT OR IGNORE INTO tallies (question, choice, n) VALUES
  ('q1','g',0),  ('q1','b',0),
  ('q2','g',0),  ('q2','b',0),
  ('q3','g',0),  ('q3','b',0),
  ('q4','g',0),  ('q4','b',0),
  ('q5','g',0),  ('q5','b',0),
  ('q6','g',0),  ('q6','b',0),
  ('q7','g',0),  ('q7','b',0),
  ('q8','g',0),  ('q8','b',0),
  ('q9','g',0),  ('q9','b',0),
  ('q10','g',0), ('q10','b',0);

-- Backfill from whatever has already been voted, so this migration is safe
-- to run against a live table mid-wedding.
UPDATE tallies SET n = (
  SELECT COUNT(*) FROM votes
  WHERE votes.question = tallies.question AND votes.choice = tallies.choice
);

-- Created after the backfill so the two can never both count the same row.
CREATE TRIGGER IF NOT EXISTS votes_tally_insert
AFTER INSERT ON votes
BEGIN
  UPDATE tallies SET n = n + 1
  WHERE question = NEW.question AND choice = NEW.choice;
END;

-- No delete path exists in the worker, but a hand-run cleanup should not
-- silently leave the counts overstated.
CREATE TRIGGER IF NOT EXISTS votes_tally_delete
AFTER DELETE ON votes
BEGIN
  UPDATE tallies SET n = MAX(n - 1, 0)
  WHERE question = OLD.question AND choice = OLD.choice;
END;
