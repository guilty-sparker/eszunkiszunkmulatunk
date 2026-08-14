// Wedding prediction poll.
//
// The guest list arrives decrypted in window.__SEATING_STATE__, same as the
// seating editor. Nothing here ever sends a name anywhere: the backend only
// sees the seating ids ("p12", "x3").

const API = "https://tippjatek.eszunkiszunkmulatunk.workers.dev";
const GUEST_KEY = "tippjatek-guest";

const INITIAL = window.__SEATING_STATE__;
const EVERYONE = INITIAL.head
  .concat(...INITIAL.plans[INITIAL.version].map((t) => t.left.concat(t.right, t.edge || [])))
  .filter(Boolean)
  .filter((person) => !person.baby);

const BY_ID = new Map(EVERYONE.map((person) => [person.id, person]));

let lang = localStorage.getItem("preferredLang") || "hu";
let copy = window.getPoll(lang);
let guest = BY_ID.has(localStorage.getItem(GUEST_KEY)) ? localStorage.getItem(GUEST_KEY) : null;
let myVotes = {};
let counts = null;

const root = document.getElementById("poll-root");

// "Szőcs" must be findable by typing "szocs" on a phone keyboard, and
// "Tănase" by typing "tanase". NFD splits the accent off as a combining
// mark, which the range below then drops.
function fold(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function api(path, options) {
  const response = await fetch(API + path, options);
  if (!response.ok) throw new Error("http " + response.status);
  return response.json();
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// --- guest picker ----------------------------------------------------------

function renderPicker() {
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
    const hits = EVERYONE.filter((person) => fold(person.name).includes(needle)).slice(0, 8);

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
  localStorage.setItem(GUEST_KEY, id);
  await renderPoll();
}

function forget() {
  guest = null;
  myVotes = {};
  localStorage.removeItem(GUEST_KEY);
  renderPicker();
}

// --- poll ------------------------------------------------------------------

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
          const result = await api("/vote", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ guest, question: question.id, choice: option.id }),
          });
          myVotes[question.id] = result.choice;
          counts = result.counts;
          card.replaceWith(renderQuestion(question));
          renderProgress();
          renderDone();
        } catch {
          // Leave the question open. A vote that quietly retries an hour
          // later is worse than one that visibly failed.
          options.querySelectorAll("button").forEach((b) => (b.disabled = false));
          error.textContent = copy.error;
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

function renderProgress() {
  const done = copy.questions.filter((q) => myVotes[q.id]).length;
  const node = document.getElementById("poll-progress");
  node.textContent = "";
  if (!guest) return;
  const value = el("b", null, done + "/" + copy.questions.length);
  node.append(value, document.createTextNode(" " + copy.answered));
}

async function renderPoll() {
  root.textContent = "";
  root.append(el("p", "poll-prompt", copy.loading));

  try {
    const [mine, all] = await Promise.all([api("/me?guest=" + guest), api("/results")]);
    myVotes = mine.votes;
    counts = all.counts;
  } catch {
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

  root.textContent = "";

  const who = el("p", "poll-who");
  who.append(document.createTextNode(copy.greeting + ", " + BY_ID.get(guest).name + ". "));
  const change = el("button", "poll-link", copy.notYou);
  change.type = "button";
  change.addEventListener("click", forget);
  who.append(change);
  root.append(who);

  for (const question of copy.questions) root.append(renderQuestion(question));
  renderProgress();
  renderDone();
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
  // renderPoll re-reads both /me and /results, so this is the whole refresh.
  if (document.visibilityState === "visible" && guest) renderPoll();
});

document.getElementById("poll-title").textContent = copy.title;
document.getElementById("poll-intro").textContent = copy.intro;

if (guest) renderPoll();
else renderPicker();
