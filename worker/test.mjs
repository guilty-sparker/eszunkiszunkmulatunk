// Endpoint tests against a running `wrangler dev`.
// Usage: node test.mjs [baseUrl]

const BASE = process.argv[2] || "http://127.0.0.1:8787";
const ORIGIN = "http://localhost:8000";

let failures = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function post(body, origin = ORIGIN) {
  const response = await fetch(`${BASE}/vote`, {
    method: "POST",
    headers: { "content-type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json().catch(() => null) };
}

async function get(path, origin = ORIGIN) {
  const response = await fetch(`${BASE}${path}`, { headers: { Origin: origin } });
  return { status: response.status, body: await response.json().catch(() => null) };
}

console.log("first vote");
const first = await post({ guest: "p1", question: "q1", choice: "g" });
check("returns 200", first.status === 200, `got ${first.status}`);
check("echoes the choice", first.body?.choice === "g");
check("not flagged as already voted", first.body?.already === false);
check("counts p1", first.body?.counts?.q1?.g === 1);
check("zero-fills the other choice", first.body?.counts?.q1?.b === 0);

console.log("duplicate vote, different choice");
const second = await post({ guest: "p1", question: "q1", choice: "b" });
check("returns 200, not an error", second.status === 200, `got ${second.status}`);
check("returns the original choice", second.body?.choice === "g", `got ${second.body?.choice}`);
check("flagged as already voted", second.body?.already === true);
check("count for g unchanged", second.body?.counts?.q1?.g === 1);
check("count for b still zero", second.body?.counts?.q1?.b === 0);

console.log("other guests accumulate");
await post({ guest: "p2", question: "q1", choice: "b" });
const third = await post({ guest: "x3", question: "q1", choice: "b" });
check("g=1", third.body?.counts?.q1?.g === 1);
check("b=2", third.body?.counts?.q1?.b === 2, JSON.stringify(third.body?.counts?.q1));

console.log("validation");
check("guest id with illegal characters", (await post({ guest: "p1; drop", question: "q1", choice: "g" })).status === 400);
check("guest id too long", (await post({ guest: "p".repeat(65), question: "q1", choice: "g" })).status === 400);
check("empty guest id", (await post({ guest: "", question: "q1", choice: "g" })).status === 400);
check("unknown question", (await post({ guest: "p4", question: "q99", choice: "g" })).status === 400);
check("invalid choice", (await post({ guest: "p4", question: "q1", choice: "z" })).status === 400);
check("missing fields", (await post({ guest: "p4" })).status === 400);

console.log("/me");
const mine = await get("/me?guest=p1");
check("returns this guest's vote", mine.body?.votes?.q1 === "g");
const stranger = await get("/me?guest=p77");
check("empty for a guest who has not voted", Object.keys(stranger.body?.votes || {}).length === 0);
check("rejects a bad guest id", (await get("/me?guest=..")).status === 400);

console.log("/results");
const results = await get("/results");
check("matches the votes cast", results.body?.counts?.q1?.b === 2);
check("includes every question", Object.keys(results.body?.counts || {}).length === 10);

console.log("CORS");
const preflight = await fetch(`${BASE}/vote`, {
  method: "OPTIONS",
  headers: { Origin: ORIGIN, "Access-Control-Request-Method": "POST" },
});
check("preflight returns 204", preflight.status === 204, `got ${preflight.status}`);
check(
  "preflight echoes the origin",
  preflight.headers.get("access-control-allow-origin") === ORIGIN
);
const evil = await fetch(`${BASE}/results`, { headers: { Origin: "https://evil.example" } });
check("foreign origin rejected", evil.status === 403, `got ${evil.status}`);

console.log("404");
check("unknown path", (await get("/nope")).status === 404);

console.log(failures ? `\n${failures} check(s) failed` : "\nall checks passed");
process.exit(failures ? 1 : 0);
