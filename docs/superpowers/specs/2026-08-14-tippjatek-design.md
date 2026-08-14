# Tippjáték — wedding prediction poll

**Date:** 2026-08-14
**Wedding:** 2026-08-22 (8 days out)
**Status:** approved design, ready for implementation planning

## Goal

Guests answer a handful of funny prediction questions about the wedding
("who cries first", "when does the last guest leave"). Each guest votes once
per question, votes are locked in, and the vote reveals live percentages for
that question. Results persist beyond any one browser.

## Constraints

- The site is static, served by GitHub Pages at `beataesgabor.cc`. No build
  step, no server, no framework.
- The guest list is confidential. It ships as `ultetes-data.enc.json`
  (AES-GCM, PBKDF2-SHA256, 310k iterations) and is decrypted client-side with
  a shared password.
- Budget is effectively zero. The backend must sit inside a free tier with
  room to spare.
- Eight days to the wedding. Prefer boring and finishable over clever.

## Decisions

| Question | Decision |
|---|---|
| Trust model | Honor system. Any guest could pick another guest's name. Accepted. |
| Guest list exposure | None. Reuse the existing password gate and encrypted blob. |
| Mechanics | Poll with live odds. No stakes, no play money, no leaderboard. |
| Changing a vote | No. First vote is final. |
| Question content | Trilingual (hu/en/ro), alongside the existing translations. |
| Backend | Cloudflare Worker + D1, on `workers.dev`. |

### Why Cloudflare Worker + D1

Rejected alternatives:

- **Workers KV** — free tier allows 1,000 writes/day. Worst case here is
  ~150 guests × 8 questions ≈ 1,200 writes. Too close to the ceiling.
- **Google Apps Script + Sheet** — free and needs no new account, but writes
  serialize through `LockService`, which is the wrong property when a hundred
  guests vote inside the same five minutes at the reception.
- **Supabase** — nicest developer story, but free projects pause after 7 days
  of inactivity, and the wedding is 8 days out. Wrong risk on the one date
  that matters.

D1's free tier is 100k row-writes/day against a worst case of ~1,200 total.
No inactivity pause. No cold start worth worrying about.

## Architecture

```
Browser (GitHub Pages, beataesgabor.cc)
  tippjatek.html   password gate + shell
  tippjatek.js     decrypt, guest picker, voting UI
  i18n.js          question + option text, 3 languages
        │
        │  fetch, CORS-restricted to https://beataesgabor.cc
        ▼
Cloudflare Worker (*.workers.dev)
  validates guest id shape and question/choice allowlist
        │
        ▼
D1 (SQLite)
  votes(guest, question, choice, ts)  PRIMARY KEY (guest, question)
```

### Privacy property

The backend never learns a guest's name. Votes are keyed by the stable id
already present in the seating data (`p12`, `x3`), so a row reads
`p12 → q3 → "b"`. The id↔name mapping lives only inside the encrypted blob,
decrypted client-side, behind the password. A full dump of the database
reveals voting patterns but no identities.

## Components

### 1. `tippjatek.html` — page shell and gate

Reuses `ultetes.html`'s gate verbatim: same encrypted blob, same PBKDF2 →
AES-GCM unlock, same `sessionStorage` key `seating-pass`. Unlocking either
page unlocks the other. Same CSP header. Same `noindex, nofollow`.

On successful unlock it exposes the decrypted state and imports
`tippjatek.js`.

Linked from the main nav in `index.html`, alongside the seating link.

### 2. Guest picker

- Search input, filtering the decrypted guest list as you type.
- Matching is accent-insensitive and case-insensitive: `á é í ó ö ő ú ü ű`
  and Romanian `ă â î ș ț` fold to their base letters, via
  `String.normalize("NFD")` with combining marks stripped. Typing `szocs`
  must match `Szőcs`.
- Substring match, not prefix — surnames come first in Hungarian and guests
  may type either part of their name.
- Shows at most 8 suggestions. Selection only; there is no code path that
  accepts a typed name.
- Guests with `baby: true` are excluded.
- The chosen id is written to `localStorage` under `tippjatek-guest`, purely
  so the picker doesn't reappear on every visit. A "Nem te vagy?" link clears
  it and returns to the picker.

`localStorage` is a convenience, never an authority. On load, the page calls
`GET /me` and renders locked state from the server's answer.

### 3. Questions and translations

`i18n.js` embeds its translations inline as `translationsData` (the comment
says "embedded directly to avoid CORS issues"); the `translations/*.json`
files are not what the page reads. Questions therefore go into `i18n.js`
under a `poll` key, and the JSON files are mirrored to stay consistent.

Shape, per language:

```js
poll: {
  title: "…",
  questions: [
    { id: "q1", text: "…", options: [ { id: "a", text: "…" }, … ] },
    …
  ]
}
```

Ids (`q1`, `a`) are stable across languages; only `text` is translated.

### 4. Worker API

Base URL: `https://<name>.<subdomain>.workers.dev`

| Method | Path | Body / query | Response |
|---|---|---|---|
| `POST` | `/vote` | `{guest, question, choice}` | `{choice, already, counts}` |
| `GET` | `/me` | `?guest=p12` | `{votes: {q1: "a", …}}` |
| `GET` | `/results` | — | `{q1: {a: 12, b: 3}, …}` |

Behaviour:

- `/vote` runs `INSERT OR IGNORE`. If a row already exists, it returns the
  **existing** choice with `already: true` and HTTP 200 — not an error. A
  second vote from a fresh browser is structurally impossible, not merely
  discouraged.
- `/vote` returns fresh counts for that question so the odds render without a
  second round trip.
- `/me` lets a new device see which questions are already answered.
- `/results` is used on load and on window focus.

Validation, all rejected with 400:

- `guest` must match `^[px][0-9]{1,3}$`.
- `question` must be in the worker's allowlist.
- `choice` must be in that question's allowlist.

CORS: `Access-Control-Allow-Origin: https://beataesgabor.cc` only, plus an
`OPTIONS` handler. Methods limited to `GET, POST`.

**Accepted duplication:** the question/choice ids exist in both `i18n.js` and
the worker. The worker holds ids only — no text — so adding a question means
editing two files but translating in one. The alternative (worker fetches the
question list from the site) adds a network dependency and a failure mode to
save one small edit; not worth it.

### 5. Schema

```sql
CREATE TABLE IF NOT EXISTS votes (
  guest    TEXT NOT NULL,
  question TEXT NOT NULL,
  choice   TEXT NOT NULL,
  ts       INTEGER NOT NULL,
  PRIMARY KEY (guest, question)
);
```

Counts come from `SELECT question, choice, COUNT(*) FROM votes GROUP BY
question, choice`. At this scale there is no index worth adding beyond the
primary key.

### 6. Odds UI

- Before voting on a question, options are buttons and no percentages are
  shown. Committing first prevents herd voting and makes voting feel earned.
- After voting, the question renders as horizontal bars: percentage, count,
  and the guest's own pick highlighted. The choice is visibly locked.
- Counts refresh on load and on `visibilitychange` to visible. No polling
  timer — the venue's wifi is not a resource to waste, and a wedding poll
  does not need sub-minute freshness.

### 7. Error handling

The venue is a rural resort; assume flaky wifi.

- A failed vote leaves the question unlocked, shows an error line, and offers
  retry. Nothing is queued offline — a vote that silently fires an hour later
  is worse than a vote that visibly failed.
- A failed `/results` leaves the last known counts on screen rather than
  blanking them.
- A wrong password is already handled by the existing gate.

## Testing

- Worker endpoints against `wrangler dev` with a local D1: first vote
  succeeds; duplicate vote returns the original choice with `already: true`
  and does not change counts; unknown guest id rejected; invalid choice
  rejected; counts match after a batch of mixed votes; CORS preflight
  returns the expected headers.
- Accent folding, unit-tested: `szocs` → `Szőcs`, `Tanase` → `Tănase`.
- Manual browser pass: gate unlock, shared session with the seating page,
  picker excludes babies, vote locks, reload keeps the lock, second browser
  with the same guest id sees the lock.

## Draft questions

Hungarian source text, to be edited before translation. Ids are fixed.

1. **q1** Ki sír először a ceremónián? — a: A vőlegény · b: A menyasszony ·
   c: Az anyukák · d: Senki
2. **q2** Mikor megy haza az utolsó vendég? — a: Éjfél előtt · b: 01:00–03:00 ·
   c: 03:00–05:00 · d: Napfelkelte után
3. **q3** Mennyit késik a ceremónia kezdete? — a: Pontosan kezdődik ·
   b: 1–10 perc · c: 11–30 perc · d: Több mint fél óra
4. **q4** Ki mondja a leghosszabb pohárköszöntőt? — a: A násznagy · b: Az apuka ·
   c: A tanú · d: A vőlegény
5. **q5** Ki marad utoljára a táncparketten? — a: A vőlegény · b: A menyasszony ·
   c: A tanúk · d: Egy nagyszülő
6. **q6** Melyik zenére táncol a legtöbb ember? — a: Mulatós · b: 2000-es évek
   slágerei · c: Lassú, romantikus · d: Modern pop
7. **q7** Hányan alszanak el az asztalnál? — a: Senki · b: 1–2 ·
   c: 3–5 · d: Több mint 5
8. **q8** Ki kapja el a menyasszonyi csokrot? — a: Egy egyedülálló barátnő ·
   b: Egy rokon · c: Valaki, aki már foglalt · d: Senki nem kapja el

## Out of scope

Play-money stakes, leaderboards, settling questions against a correct answer,
changing a vote, an admin UI, closing voting at a deadline, real-time push
updates, and per-guest secret codes. Any of these can follow later; none is
needed for the 22nd.
