// Load probe: the wedding's worst minute.
//
// Everyone is told about the poll at once, so every guest opens the page in
// the same few seconds and then answers ten questions. Usage:
//   node load.mjs [baseUrl] [guests]

const BASE = process.argv[2] || "http://127.0.0.1:8787";
const GUESTS = Number(process.argv[3] || 150);
const ORIGIN = "http://localhost:8000";
const QUESTIONS = Array.from({ length: 10 }, (_, i) => "q" + (i + 1));

const latencies = [];
let failures = 0;

async function timed(run) {
  const started = performance.now();
  try {
    const response = await run();
    if (!response.ok) failures++;
    await response.json().catch(() => null);
  } catch {
    failures++;
  }
  latencies.push(performance.now() - started);
}

function pct(sorted, p) {
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
}

// "legacy" reproduces the original client's two-request page load, so an
// A/B against the old worker compares like with like.
const MODE = process.argv[4] || "state";

async function guestSession(n) {
  const guest = `load${n}`;
  if (MODE === "legacy") {
    await Promise.all([
      timed(() => fetch(`${BASE}/me?guest=${guest}`, { headers: { Origin: ORIGIN } })),
      timed(() => fetch(`${BASE}/results`, { headers: { Origin: ORIGIN } })),
    ]);
  } else {
    // One request for the whole page, the way the client now loads.
    await timed(() => fetch(`${BASE}/state?guest=${guest}`, { headers: { Origin: ORIGIN } }));
  }
  for (const question of QUESTIONS) {
    await timed(() =>
      fetch(`${BASE}/vote`, {
        method: "POST",
        headers: { "content-type": "application/json", Origin: ORIGIN },
        body: JSON.stringify({ guest, question, choice: Math.random() < 0.5 ? "g" : "b" }),
      })
    );
  }
}

console.log(`${GUESTS} guests arriving at once, 10 votes each\n`);
const started = performance.now();
await Promise.all(Array.from({ length: GUESTS }, (_, i) => guestSession(i)));
const elapsed = (performance.now() - started) / 1000;

const sorted = latencies.slice().sort((a, b) => a - b);
console.log(`requests    ${latencies.length}`);
console.log(`failures    ${failures}`);
console.log(`wall clock  ${elapsed.toFixed(1)}s`);
console.log(`throughput  ${(latencies.length / elapsed).toFixed(0)} req/s`);
console.log(`p50         ${pct(sorted, 50).toFixed(0)}ms`);
console.log(`p95         ${pct(sorted, 95).toFixed(0)}ms`);
console.log(`p99         ${pct(sorted, 99).toFixed(0)}ms`);
console.log(`max         ${sorted[sorted.length - 1].toFixed(0)}ms`);
