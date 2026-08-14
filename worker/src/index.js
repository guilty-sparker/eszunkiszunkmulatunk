// Vote store for the wedding prediction poll.
//
// The worker never learns who anyone is. Guests arrive as the opaque ids the
// seating data already uses ("p12", "x3"); the id-to-name mapping stays in
// the encrypted blob on the client, behind the shared password.

// Question and choice ids, mirrored from the `poll` section of i18n.js.
// Only the ids live here — the text is translated in one place, on the site.
// Every question is "Gábor or Bea": g or b.
const QUESTIONS = Object.fromEntries(
  Array.from({ length: 10 }, (_, i) => ["q" + (i + 1), ["g", "b"]])
);

// Deliberately permissive. The seating data owns the id format and this
// worker should not encode a guess about it. Queries are parameterised, so
// this check only bounds length and keeps junk out of the table.
const GUEST_ID = /^[A-Za-z0-9_-]{1,64}$/;

const SITE = "https://beataesgabor.cc";

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

// Every question and choice starts at zero, so the client can render bars
// without special-casing options nobody has picked yet.
async function tally(db) {
  const counts = {};
  for (const [question, choices] of Object.entries(QUESTIONS)) {
    counts[question] = Object.fromEntries(choices.map((choice) => [choice, 0]));
  }
  const { results } = await db
    .prepare("SELECT question, choice, COUNT(*) AS n FROM votes GROUP BY question, choice")
    .all();
  for (const row of results) {
    if (counts[row.question] && row.choice in counts[row.question]) {
      counts[row.question][row.choice] = row.n;
    }
  }
  return counts;
}

async function existingChoice(db, guest, question) {
  const row = await db
    .prepare("SELECT choice FROM votes WHERE guest = ? AND question = ?")
    .bind(guest, question)
    .first();
  return row ? row.choice : null;
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

  // INSERT OR IGNORE is the real guard. Reading afterwards rather than
  // before means a double tap on flaky wifi still reports the vote that
  // actually landed, not the one this request happened to carry.
  await env.DB.prepare(
    "INSERT OR IGNORE INTO votes (guest, question, choice, ts) VALUES (?, ?, ?, ?)"
  )
    .bind(guest, question, choice, Date.now())
    .run();

  const stored = await existingChoice(env.DB, guest, question);
  return reply(
    { choice: stored, already: stored !== choice, counts: await tally(env.DB) },
    200,
    origin
  );
}

async function me(url, env, origin) {
  const guest = url.searchParams.get("guest");
  if (typeof guest !== "string" || !GUEST_ID.test(guest)) {
    return reply({ error: "bad_guest" }, 400, origin);
  }
  const { results } = await env.DB.prepare(
    "SELECT question, choice FROM votes WHERE guest = ?"
  )
    .bind(guest)
    .all();
  const votes = {};
  for (const row of results) votes[row.question] = row.choice;
  return reply({ votes }, 200, origin);
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
