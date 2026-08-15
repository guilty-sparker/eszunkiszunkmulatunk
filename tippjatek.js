// Wedding prediction poll.
//
// The guest list arrives decrypted in window.__SEATING_STATE__, same as the
// seating editor. Nothing here ever sends a name anywhere: the backend only
// sees the seating ids ("p12", "x3").
//
// Everything below assumes venue wifi and a room full of phones: requests
// time out rather than hang, reads retry, a refresh repaints in place
// instead of blanking the page, and a response that arrives after a newer
// one has already landed is dropped rather than allowed to overwrite it.

const API = "https://tippjatek.eszunkiszunkmulatunk.workers.dev";
const GUEST_KEY = "tippjatek-guest";

const REQUEST_TIMEOUT_MS = 8000;
const READ_ATTEMPTS = 3;
const VOTE_ATTEMPTS = 3;
// A phone at a wedding foregrounds and backgrounds constantly. Refreshing on
// every one of those would be a request storm for numbers that barely move.
const MIN_REFRESH_MS = 15000;

const INITIAL = window.__SEATING_STATE__ || {};
const PLAN = (INITIAL.plans && INITIAL.plans[INITIAL.version]) || [];
const EVERYONE = (INITIAL.head || [])
  .concat(...PLAN.map((t) => (t.left || []).concat(t.right || [], t.edge || [])))
  .filter(Boolean)
  .filter((person) => !person.baby);

const BY_ID = new Map(EVERYONE.map((person) => [person.id, person]));

// Storage throws rather than no-ops in iOS private browsing, and a poll that
// dies on a thrown setItem is worse than one that forgets who you are.
const store = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* fine: the session still works, it just will not be remembered */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* as above */
    }
  },
};

// Only the languages this page actually offers, read off the flags in the
// markup. A guest whose site preference is Romanian lands on Hungarian.
const POLL_LANGS = [...document.querySelectorAll(".poll-lang")].map((b) => b.dataset.lang);
const preferred = store.get("preferredLang");
let lang = POLL_LANGS.includes(preferred) ? preferred : "hu";
let copy = window.getPoll(lang);
let guest = BY_ID.has(store.get(GUEST_KEY)) ? store.get(GUEST_KEY) : null;
let myVotes = {};
let counts = null;

// Bumped whenever a load starts. A response carrying a stale token lost the
// race — a slow /state from before a language switch must not repaint over
// the newer one.
let generation = 0;
let refreshing = false;
let lastRefresh = 0;

const root = document.getElementById("poll-root");
// Question id to its rendered card, so a refresh can swap one node instead
// of rebuilding the page and throwing away the guest's scroll position.
const cards = new Map();

// "Szőcs" must be findable by typing "szocs" on a phone keyboard, and
// "Tănase" by typing "tanase". NFD splits the accent off as a combining
// mark, which the range below then drops.
function fold(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Folded once at startup rather than on every keystroke: 150 guests times a
// normalize() per character typed is work nobody needs to do twice.
const SEARCHABLE = EVERYONE.map((person) => ({ person, folded: fold(person.name) }));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function once(path, options) {
  // AbortController rather than trusting the network to fail: a request that
  // hangs forever leaves the page stuck on "loading" with no way out.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(API + path, { ...options, signal: controller.signal });
    if (!response.ok) {
      const error = new Error("http " + response.status);
      // 4xx means this request is wrong and will stay wrong. Only 5xx and
      // transport failures are worth trying again.
      error.retryable = response.status >= 500;
      throw error;
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function api(path, options, attempts) {
  let last;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await once(path, options);
    } catch (error) {
      last = error;
      if (error.retryable === false) break;
      if (attempt < attempts - 1) {
        // Jittered, so a roomful of phones that all failed on the same dead
        // access point do not all come back in the same millisecond.
        await sleep(250 * Math.pow(2, attempt) + Math.random() * 250);
      }
    }
  }
  throw last;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// --- guest picker ----------------------------------------------------------

function renderPicker() {
  cards.clear();
  root.textContent = "";
  const card = el("div", "poll-card");
  card.append(el("p", "poll-prompt", copy.namePrompt));

  const input = el("input", "poll-input");
  input.type = "text";
  input.placeholder = copy.namePlaceholder;
  input.autocomplete = "off";
  input.spellcheck = false;
  card.append(input);

  const list = el("ul", "poll-suggestions");
  card.append(list);
  root.append(card);

  function suggest() {
    const needle = fold(input.value.trim());
    list.textContent = "";
    if (!needle) return;

    // Substring, not prefix: Hungarian puts the surname first and guests
    // type whichever half they think of.
    const hits = [];
    for (const entry of SEARCHABLE) {
      if (entry.folded.includes(needle)) {
        hits.push(entry.person);
        if (hits.length === 8) break;
      }
    }

    if (!hits.length) {
      list.append(el("li", "poll-suggestion poll-suggestion--empty", copy.noMatch));
      return;
    }
    for (const person of hits) {
      const item = el("li");
      const button = el("button", "poll-suggestion", person.name);
      button.type = "button";
      button.addEventListener("click", () => choose(person.id));
      item.append(button);
      list.append(item);
    }
  }

  input.addEventListener("input", suggest);
  input.focus();
  renderProgress();
}

async function choose(id) {
  guest = id;
  store.set(GUEST_KEY, id);
  await renderPoll();
}

function forget() {
  guest = null;
  myVotes = {};
  counts = null;
  cards.clear();
  store.remove(GUEST_KEY);
  renderPicker();
}

// --- poll ------------------------------------------------------------------

function replaceCard(question) {
  const existing = cards.get(question.id);
  const fresh = renderQuestion(question);
  if (existing && existing.isConnected) existing.replaceWith(fresh);
  cards.set(question.id, fresh);
  return fresh;
}

function renderQuestion(question) {
  const card = el("section", "poll-card");
  card.append(el("h2", "poll-question", question.text));

  const mine = myVotes[question.id];
  const error = el("p", "poll-error");
  error.hidden = true;

  if (!mine) {
    // Odds stay hidden until you commit: no herd voting, and the reveal is
    // the reward for answering.
    const options = el("div", "poll-options");
    for (const option of question.options) {
      const button = el("button", "poll-option", option.text);
      button.type = "button";
      button.addEventListener("click", async () => {
        options.querySelectorAll("button").forEach((b) => (b.disabled = true));
        error.hidden = true;
        try {
          // Safe to retry: the server dedupes on (guest, question) and
          // answers with whichever vote actually landed, so a resend after a
          // dropped connection can only ever confirm, never double-count.
          const result = await api(
            "/vote",
            {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ guest, question: question.id, choice: option.id }),
            },
            VOTE_ATTEMPTS
          );
          myVotes[question.id] = result.choice;
          counts = result.counts;
          replaceCard(question);
          repaintAnswered(question.id);
          renderProgress();
          renderDone();
        } catch {
          // Leave the question open. A vote that quietly retries an hour
          // later is worse than one that visibly failed.
          options.querySelectorAll("button").forEach((b) => (b.disabled = false));
          error.textContent = navigator.onLine === false ? copy.offline || copy.error : copy.error;
          error.hidden = false;
        }
      });
      options.append(button);
    }
    card.append(options, error);
    return card;
  }

  // Answered: the market view. Options ranked by share, biggest first, each
  // a label with its percentage set large in tabular figures over a rail.
  const tally = (counts && counts[question.id]) || {};
  const total = Object.values(tally).reduce((sum, n) => sum + n, 0);
  const results = el("div", "poll-results");

  const ranked = question.options
    .map((option) => ({ option, n: tally[option.id] || 0 }))
    .sort((a, b) => b.n - a.n);

  for (const { option, n } of ranked) {
    const share = total ? Math.round((n / total) * 100) : 0;
    const isMine = option.id === mine;

    const row = el("div", "poll-row" + (isMine ? " poll-row--mine" : ""));
    const top = el("div", "poll-row__top");
    const label = el("span", "poll-row__label", option.text);
    if (isMine) label.append(el("span", "poll-chip", copy.yourPick));
    top.append(label, el("span", "poll-row__pct", share + "%"));

    const rail = el("div", "poll-rail");
    const fill = el("span", "poll-rail__fill");
    fill.style.width = share + "%";
    rail.append(fill);

    row.append(top, rail);
    results.append(row);
  }

  card.append(results, el("p", "poll-meta", total + " " + copy.votes));
  return card;
}

// A vote returns the whole tally, so every other answered question now has
// stale percentages on screen. Repaint them, and only them.
function repaintAnswered(except) {
  for (const question of copy.questions) {
    if (question.id === except) continue;
    if (myVotes[question.id]) replaceCard(question);
  }
}

function renderProgress() {
  const done = copy.questions.filter((q) => myVotes[q.id]).length;
  const node = document.getElementById("poll-progress");
  node.textContent = "";
  if (!guest) return;
  const value = el("b", null, done + "/" + copy.questions.length);
  node.append(value, document.createTextNode(" " + copy.answered));
}

async function loadState(token) {
  const data = await api("/state?guest=" + encodeURIComponent(guest), undefined, READ_ATTEMPTS);
  // Lost the race to a newer load: drop it rather than repaint backwards.
  if (token !== generation) return false;
  myVotes = data.votes || {};
  counts = data.counts || null;
  lastRefresh = Date.now();
  return true;
}

async function renderPoll() {
  const token = ++generation;
  cards.clear();
  root.textContent = "";
  root.append(el("p", "poll-prompt", copy.loading));

  try {
    if (!(await loadState(token))) return;
  } catch {
    if (token !== generation) return;
    root.textContent = "";
    const card = el("div", "poll-card");
    card.append(el("p", "poll-error", copy.error));
    const retry = el("button", "poll-option", copy.retry);
    retry.type = "button";
    retry.addEventListener("click", renderPoll);
    card.append(retry);
    root.append(card);
    return;
  }

  paint();
}

// Build the whole poll from the state already in hand. No network: callers
// that need fresh numbers fetch first, and a language switch needs none.
function paint() {
  cards.clear();
  root.textContent = "";

  const person = BY_ID.get(guest);
  const who = el("p", "poll-who");
  who.append(document.createTextNode(copy.greeting + ", " + (person ? person.name : "") + ". "));
  const change = el("button", "poll-link", copy.notYou);
  change.type = "button";
  change.addEventListener("click", forget);
  who.append(change);
  root.append(who);

  for (const question of copy.questions) {
    const card = renderQuestion(question);
    cards.set(question.id, card);
    root.append(card);
  }
  renderProgress();
  renderDone();
}

// Background refresh. Unlike renderPoll this never blanks the page: it
// fetches, then swaps the cards whose numbers changed.
async function refresh() {
  if (!guest || refreshing) return;
  if (Date.now() - lastRefresh < MIN_REFRESH_MS) return;
  if (navigator.onLine === false) return;
  // Nothing is rendered yet, so there is nothing to refresh in place.
  if (!cards.size) return;

  refreshing = true;
  const token = generation;
  try {
    if (!(await loadState(token))) return;
    for (const question of copy.questions) replaceCard(question);
    renderProgress();
    renderDone();
  } catch {
    // Silent: the numbers on screen are merely stale, which is not worth
    // interrupting anyone over. The next foreground will try again.
  } finally {
    refreshing = false;
  }
}

// Closing note, once every question is answered.
function renderDone() {
  const existing = document.getElementById("poll-done");
  if (existing) existing.remove();
  if (copy.questions.some((q) => !myVotes[q.id])) return;
  const note = el("p", "poll-done", copy.allDone);
  note.id = "poll-done";
  root.append(note);
}

// --- lifecycle -------------------------------------------------------------

// Cheap freshness: the counts move while a guest has the page backgrounded,
// so re-read on return rather than burning venue wifi on a timer.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refresh();
});

// Coming back from a dead spot is the other moment the numbers are stale.
window.addEventListener("online", refresh);

// --- language ---------------------------------------------------------------

function applyLanguage() {
  copy = window.getPoll(lang);
  document.documentElement.lang = lang;
  document.getElementById("poll-title").textContent = copy.title;
  document.getElementById("poll-intro").textContent = copy.intro;
  for (const button of document.querySelectorAll(".poll-lang")) {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  }
  // Question ids are language-independent, so a switch is a pure re-render:
  // votes already cast stay locked and the counts stay put. The state in
  // hand is already correct, so repaint from it rather than paying for a
  // round trip just to change the words.
  if (!guest) renderPicker();
  else if (counts) paint();
  else renderPoll();
}

for (const button of document.querySelectorAll(".poll-lang")) {
  button.addEventListener("click", () => {
    lang = button.dataset.lang;
    // Shared with the rest of the site, so the choice follows the guest back.
    store.set("preferredLang", lang);
    applyLanguage();
  });
}

applyLanguage();
