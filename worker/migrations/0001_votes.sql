-- One row per guest per question. The primary key is what makes double
-- voting impossible; the application never has to be trusted for it.
CREATE TABLE IF NOT EXISTS votes (
  guest    TEXT NOT NULL,
  question TEXT NOT NULL,
  choice   TEXT NOT NULL,
  ts       INTEGER NOT NULL,
  PRIMARY KEY (guest, question)
);
