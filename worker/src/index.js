// Vote store for the wedding prediction poll.
//
// The worker never learns who anyone is. Guests arrive as the opaque ids the
// seating data already uses ("p12", "x3"); the id-to-name mapping stays in
// the encrypted blob on the client, behind the shared password.
//
// Shape of the hot path, because a wedding is a thundering herd: every guest
// opens the page within the same minute and then votes ten times. So reads
// come off a counters table the database maintains itself (see migration
// 0002), a vote is one batched round trip rather than three, and /results is
// briefly memoised per isolate.

// Question and choice ids, mirrored from the `poll` section of i18n.js.
// Only the ids live here — the text is translated in one place, on the site.
// Every question is "Gábor or Bea": g or b.
const QUESTIONS = Object.fromEntries(
  Array.from({ length: 19 }, (_, i) => ["q" + (i + 1), ["g", "b"]])
);

// Deliberately permissive. The seating data owns the id format and this
// worker should not encode a guess about it. Queries are parameterised, so
// this check only bounds length and keeps junk out of the table.
const GUEST_ID = /^[A-Za-z0-9_-]{1,64}$/;

const SITE = "https://beataesgabor.cc";

// Counts drift by at most this long for guests who are only watching. The
// guest who just voted is never served from here — their own response is
// built from the write's own read, so their pick always appears instantly.
const RESULTS_TTL_MS = 3000;

// D1 hiccups are transient far more often than they are real. Every
// statement this worker runs is idempotent (INSERT OR IGNORE plus reads),
// so a retry can never double-count.
const DB_ATTEMPTS = 3;

// Per-isolate memo. There are many isolates, so this collapses a burst
// rather than eliminating it — which is all that is needed once the read
// behind it is twenty rows instead of a table scan.
let memo = null;

// The live site, plus whatever local server is used while developing.
function allowedOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return SITE;
  if (origin === SITE || origin === "https://www.beataesgabor.cc") return origin;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  return null;
}

function reply(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "cache-control": "no-store",
      vary: "Origin",
    },
  });
}

async function withRetry(run) {
  let last;
  for (let attempt = 0; attempt < DB_ATTEMPTS; attempt++) {
    try {
      return await run();
    } catch (error) {
      last = error;
      // Short, jittered: the point is to ride out a blip, not to queue up
      // behind an outage while a guest watches a spinner.
      if (attempt < DB_ATTEMPTS - 1) {
        await new Promise((r) => setTimeout(r, 40 * (attempt + 1) + Math.random() * 40));
      }
    }
  }
  throw last;
}

// Every question and choice starts at zero, so the client can render bars
// without special-casing options nobody has picked yet.
function zeroed() {
  const counts = {};
  for (const [question, choices] of Object.entries(QUESTIONS)) {
    counts[question] = Object.fromEntries(choices.map((choice) => [choice, 0]));
  }
  return counts;
}

function shape(rows) {
  const counts = zeroed();
  for (const row of rows || []) {
    if (counts[row.question] && row.choice in counts[row.question]) {
      counts[row.question][row.choice] = row.n;
    }
  }
  return counts;
}

// Votes only ever accumulate, so the grand total doubles as a version
// number for a snapshot.
function total(counts) {
  let sum = 0;
  for (const choices of Object.values(counts)) {
    for (const n of Object.values(choices)) sum += n;
  }
  return sum;
}

// Concurrent votes resolve in a different order than they commit, so the
// response carrying an older snapshot can land last. Without this guard it
// would overwrite a newer one and the published counts would tick backwards.
function remember(counts) {
  if (memo && total(counts) < total(memo.counts)) return counts;
  memo = { at: Date.now(), counts };
  return counts;
}

const TALLY_SQL = "SELECT question, choice, n FROM tallies";

async function tally(db) {
  if (memo && Date.now() - memo.at < RESULTS_TTL_MS) return memo.counts;
  const { results } = await withRetry(() => db.prepare(TALLY_SQL).all());
  return remember(shape(results));
}

async function vote(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ error: "bad_json" }, 400, origin);
  }

  const { guest, question, choice } = body || {};
  if (typeof guest !== "string" || !GUEST_ID.test(guest)) {
    return reply({ error: "bad_guest" }, 400, origin);
  }
  if (typeof question !== "string" || !(question in QUESTIONS)) {
    return reply({ error: "bad_question" }, 400, origin);
  }
  if (typeof choice !== "string" || !QUESTIONS[question].includes(choice)) {
    return reply({ error: "bad_choice" }, 400, origin);
  }

  // One round trip, one transaction. INSERT OR IGNORE is the real guard
  // against a double vote, and the trigger on it means the counts move only
  // when a row actually lands. Reading the choice back afterwards rather
  // than before means a double tap on flaky wifi still reports the vote that
  // landed, not the one this particular request happened to carry.
  const [, stored, counted] = await withRetry(() =>
    env.DB.batch([
      env.DB.prepare(
        "INSERT OR IGNORE INTO votes (guest, question, choice, ts) VALUES (?, ?, ?, ?)"
      ).bind(guest, question, choice, Date.now()),
      env.DB.prepare("SELECT choice FROM votes WHERE guest = ? AND question = ?").bind(
        guest,
        question
      ),
      env.DB.prepare(TALLY_SQL),
    ])
  );

  const mine = stored.results[0] ? stored.results[0].choice : null;
  // This read is at least as fresh as anything memoised, so let the
  // watchers have it too.
  const counts = remember(shape(counted.results));

  return reply({ choice: mine, already: mine !== choice, counts }, 200, origin);
}

async function myVotes(db, guest) {
  const { results } = await withRetry(() =>
    db.prepare("SELECT question, choice FROM votes WHERE guest = ?").bind(guest).all()
  );
  const votes = {};
  for (const row of results) votes[row.question] = row.choice;
  return votes;
}

async function me(url, env, origin) {
  const guest = url.searchParams.get("guest");
  if (typeof guest !== "string" || !GUEST_ID.test(guest)) {
    return reply({ error: "bad_guest" }, 400, origin);
  }
  return reply({ votes: await myVotes(env.DB, guest) }, 200, origin);
}

// What a page load actually needs, in one request instead of two. Everyone
// arrives at once, so halving the load-time request count is the cheapest
// win available.
async function state(url, env, origin) {
  const guest = url.searchParams.get("guest");
  if (typeof guest !== "string" || !GUEST_ID.test(guest)) {
    return reply({ error: "bad_guest" }, 400, origin);
  }

  const [mine, counted] = await withRetry(() =>
    env.DB.batch([
      env.DB.prepare("SELECT question, choice FROM votes WHERE guest = ?").bind(guest),
      env.DB.prepare(TALLY_SQL),
    ])
  );

  const votes = {};
  for (const row of mine.results) votes[row.question] = row.choice;
  const counts = remember(shape(counted.results));

  return reply({ votes, counts }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request);
    if (!origin) return new Response("forbidden origin", { status: 403 });

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "content-type",
          "access-control-max-age": "86400",
          vary: "Origin",
        },
      });
    }

    const url = new URL(request.url);

    try {
      if (request.method === "POST" && url.pathname === "/vote") {
        return await vote(request, env, origin);
      }
      if (request.method === "GET" && url.pathname === "/state") {
        return await state(url, env, origin);
      }
      if (request.method === "GET" && url.pathname === "/me") {
        return await me(url, env, origin);
      }
      if (request.method === "GET" && url.pathname === "/results") {
        return reply({ counts: await tally(env.DB) }, 200, origin);
      }
    } catch (error) {
      console.error(error);
      return reply({ error: "server" }, 500, origin);
    }

    return reply({ error: "not_found" }, 404, origin);
  },
};
