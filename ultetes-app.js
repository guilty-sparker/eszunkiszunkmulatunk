const styles = document.createElement('style');
styles.textContent = `:root { color-scheme: dark; }
* { box-sizing: border-box; }
body {
  margin: 0;
  background: #0d1d2d;
  color: #f4f0e3;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}
header {
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 10px 12px;
  background: rgba(13, 29, 45, .97);
  border-bottom: 1px solid #2d4763;
}
h1 { margin: 0 0 8px; color: #d6b36b; font-size: 1rem; text-align: center; }
.bar { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
button {
  border: 1px solid #496985;
  border-radius: 999px;
  background: #14283d;
  color: #f4f0e3;
  font: inherit;
  font-weight: 600;
  padding: 7px 14px;
  min-height: 38px;
}
button:active { background: #28435e; }
select {
  border: 1px solid #496985;
  border-radius: 999px;
  background: #14283d;
  color: #f4f0e3;
  font: inherit;
  font-weight: 600;
  padding: 7px 12px;
  min-height: 38px;
  max-width: 100%;
}
button[aria-pressed="true"] { background: #d6b36b; color: #10243a; border-color: #d6b36b; }
.hint { margin: 8px 0 0; color: #9eb0c0; font-size: .78rem; text-align: center; }
main { padding: 12px; }
.grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); }
section {
  background: #14283d;
  border: 1px solid #2d4763;
  border-radius: 14px;
  padding: 12px 12px 8px;
}
section.target { border-color: #d6b36b; }
section h2 {
  margin: 0 0 8px;
  font-size: .95rem;
  color: #d6b36b;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
section h2 span { color: #9eb0c0; font-weight: 500; }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
li {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 10px;
  background: #10243a;
  border: 1px solid #22384f;
  font-size: 1rem;
  font-weight: 600;
  cursor: grab;
  touch-action: manipulation;
}
li.readonly { cursor: default; opacity: .85; }
.table-no { color: #9eb0c0; font-weight: 700; flex: 0 0 auto; }
.table-name {
  flex: 1 1 auto;
  min-width: 0;
  background: #10243a;
  border: 1px solid #2d4763;
  border-radius: 8px;
  color: #d6b36b;
  font: inherit;
  font-weight: 700;
  padding: 6px 9px;
}
.table-name:focus { outline: 2px solid #d6b36b; outline-offset: 1px; }
.order { display: flex; gap: 4px; flex: 0 0 auto; }
.move-table { padding: 0; width: 32px; min-height: 32px; border-radius: 8px; font-size: .8rem; }
.move-table:disabled { opacity: .35; }
.seats { display: grid; gap: 6px; }
.row { display: grid; grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1fr); gap: 5px; align-items: stretch; }
.axis { align-self: center; text-align: center; color: #4f6c88; font-size: .8rem; }
.seat {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  padding: 7px 9px;
  border-radius: 10px;
  background: #10243a;
  border: 1px solid #22384f;
  font-size: .92rem;
  font-weight: 600;
  overflow-wrap: anywhere;
  cursor: grab;
  touch-action: manipulation;
}
.seat.right { flex-direction: row-reverse; text-align: right; }
.seat.renaming { cursor: default; }
.row.edge-row { grid-template-columns: 74px 1fr; }
.edge-label {
  align-self: center;
  color: #9aa9bb;
  font-size: .68rem;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.seat.edge { border-style: dashed; border-color: #4a3d63; background: #1c1830; }
.seat.edge .dot { background: #c7b0e3; }
.seat-name {
  flex: 1 1 auto;
  min-width: 0;
  background: #16293d;
  border: 1px solid #2d4763;
  border-radius: 8px;
  color: #f4f0e3;
  font: inherit;
  font-size: .9rem;
  font-weight: 600;
  padding: 4px 7px;
}
.seat-name:focus { outline: 2px solid #d6b36b; outline-offset: 1px; }
.seat.empty { border-style: dashed; color: #61798f; font-weight: 500; justify-content: center; cursor: pointer; }
.seat.selected { border-color: #d6b36b; background: #1d354e; }
.seat.drop-here { border-color: #d6b36b; }
.seat.left .dot { background: #9bc9d5; }
.seat.right .dot { background: #efbf8c; }
.seat.empty .dot { display: none; }
.dot { width: 11px; height: 11px; border-radius: 50%; flex: 0 0 auto; background: #9bc9d5; }
li:nth-child(even) .dot { background: #efbf8c; }
#map { overflow: auto; }
#map svg { display: block; width: min(100%, 1400px); min-width: 760px; height: auto; margin: 0 auto; }
.hidden { display: none; }
.count-warn { color: #efbf8c; }

body.unlocked { background: #0d1d2d; display: block; padding: 0; }
.back-link { display: inline-flex; align-items: center; padding: 7px 14px; border: 1px solid #496985;
  border-radius: 999px; color: #f4f0e3; text-decoration: none; font-weight: 600; font-size: .95rem; }
`;
document.head.append(styles);
document.getElementById('seating-root').innerHTML = `<header>
  <h1><span id="subtitle">„A” VÁLTOZAT · KORRIGÁLT</span> · <span id="total"></span></h1>
  <div class="bar">
    <button type="button" id="tab-edit" aria-pressed="true" onclick="showView('edit')">Szerkesztés</button>
    <button type="button" id="tab-map" aria-pressed="false" onclick="showView('map')">Térkép</button>
    <button type="button" id="tab-names" aria-pressed="false" onclick="toggleNames()">Nevek</button>
    <button type="button" onclick="downloadMarkdown()">Mentés (.md)</button>
    <button type="button" onclick="document.getElementById('import-file').click()">Betöltés (.md)</button>
    <select id="base-plan" aria-label="Alapterv"><option value="A" selected>„A” változat — korrigált</option><option value="B">„B” változat — korrigált</option><option value="C">„C” változat — affinitás</option></select>
    <button type="button" onclick="resetPlan()">Alaphelyzet</button>
  </div>
  <input type="file" id="import-file" accept=".md,text/markdown" hidden onchange="importMarkdown(this)">
  <p class="hint">Húzd a nevet másik asztalra, vagy koppints rá és utána a célhelyre.</p>
  <p class="hint" id="status"></p>
</header>
<main>
  <div id="edit" class="grid"></div>
  <div id="map" class="hidden"></div>
</main>
`;
const back = document.createElement('a');
back.className = 'back-link';
back.href = './';
back.textContent = '← Vissza';
document.querySelector('.bar').append(back);
const stateNode = document.getElementById("editor-state");
const INITIAL = window.__SEATING_STATE__ || JSON.parse(stateNode.textContent);
const STORAGE_KEY = "seating-editor-sides";
const PLANS = INITIAL.plans;
const SUBTITLES = INITIAL.subtitles;
let baseVersion = PLANS[INITIAL.version] ? INITIAL.version : Object.keys(PLANS)[0];
const EVERYONE = INITIAL.head.concat(
  ...PLANS[baseVersion].map((t) => t.left.concat(t.right, t.edge || []))
).filter(Boolean);
const EDGE_SLOTS = 2;
const BY_ID = new Map(EVERYONE.map((p) => [p.id, p]));
let customNames = {};
let state = load();
let picked = null;
let renameMode = false;

function displayName(person) {
  return customNames[person.id] || person.name;
}

function renameGuest(personId, value) {
  const person = BY_ID.get(personId);
  const name = value.trim();
  if (!person) return;
  if (name && name !== person.name) customNames[personId] = name;
  else delete customNames[personId];
  save();
  render();
}

function toggleNames() {
  renameMode = !renameMode;
  picked = null;
  document.getElementById("tab-names").setAttribute("aria-pressed", String(renameMode));
  if (renameMode) showView("edit");
  document.getElementById("status").textContent = renameMode
    ? "Névszerkesztés: írd át a nevet, majd kattints ki. Üresen hagyva visszaáll az eredeti."
    : "";
  render();
}

function baseTables() {
  return PLANS[baseVersion];
}

function blankTables() {
  return baseTables().map((t) => ({
    name: t.name,
    left: t.left.slice(),
    right: t.right.slice(),
    edge: (t.edge || []).slice(),
  }));
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && PLANS[saved.version]) baseVersion = saved.version;
    if (saved && saved.names) customNames = saved.names;
    if (saved && saved.tables && saved.tables.length === baseTables().length) {
      const tables = saved.tables.map((t) => ({
        name: t.name || null,
        left: (t.left || []).map((id) => BY_ID.get(id) || null),
        right: (t.right || []).map((id) => BY_ID.get(id) || null),
        edge: (t.edge || []).map((id) => BY_ID.get(id) || null),
      }));
      const seated = new Set(tables.flatMap(seats).map((p) => p.id));
      baseTables().forEach((table, index) => {
        table.left.concat(table.right, table.edge || []).forEach((person) => {
          if (person && !seated.has(person.id)) sitAtFreeSeat(tables[index], person);
        });
      });
      return { head: INITIAL.head.slice(), tables };
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { head: INITIAL.head.slice(), tables: blankTables() };
}

function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: baseVersion,
      names: customNames,
      tables: state.tables.map((t) => ({
        name: t.name,
        left: t.left.map((p) => (p ? p.id : null)),
        right: t.right.map((p) => (p ? p.id : null)),
        edge: t.edge.map((p) => (p ? p.id : null)),
      })),
    })
  );
}

function seats(table) {
  return table.left.concat(table.right, table.edge || []).filter(Boolean);
}

function autoLabel(table) {
  const counts = new Map();
  seats(table).forEach((p) => counts.set(p.group, (counts.get(p.group) || 0) + 1));
  let best = "Asztal";
  let top = -1;
  counts.forEach((value, key) => { if (value > top) { top = value; best = key; } });
  return best;
}

function tableTitle(table) {
  return table.name || autoLabel(table);
}

function tableHeading(table, index) {
  return (index + 1) + ". asztal — " + tableTitle(table);
}

function rowCount(table) {
  return Math.max(table.left.length, table.right.length);
}

function trimSide(side) {
  while (side.length && !side[side.length - 1]) side.pop();
}

function freeSeat(table) {
  const rows = rowCount(table);
  for (let i = 0; i < rows; i += 1) {
    if (!table.left[i]) return { side: "left", index: i };
    if (!table.right[i]) return { side: "right", index: i };
  }
  return table.left.length <= table.right.length
    ? { side: "left", index: table.left.length }
    : { side: "right", index: table.right.length };
}

function sitAtFreeSeat(table, person) {
  if (person.baby) {
    for (let i = 0; i < EDGE_SLOTS; i += 1) {
      if (!table.edge[i]) {
        while (table.edge.length <= i) table.edge.push(null);
        table.edge[i] = person;
        return;
      }
    }
  }
  const spot = freeSeat(table);
  const side = table[spot.side];
  while (side.length <= spot.index) side.push(null);
  side[spot.index] = person;
}

function moveSeat(from, to) {
  if (!from || !to) return;
  if (from.table === to.table && from.side === to.side && from.index === to.index) {
    picked = null;
    render();
    return;
  }
  const source = state.tables[from.table][from.side];
  const target = state.tables[to.table][to.side];
  while (target.length <= to.index) target.push(null);
  const mover = source[from.index] || null;
  if (!mover) return;
  source[from.index] = target[to.index] || null;
  target[to.index] = mover;
  trimSide(source);
  trimSide(target);
  picked = null;
  save();
  render();
}

function samePlace(a, b) {
  return a && b && a.table === b.table && a.side === b.side && a.index === b.index;
}

function moveTable(index, delta) {
  const target = index + delta;
  if (target < 0 || target >= state.tables.length) return;
  const [table] = state.tables.splice(index, 1);
  state.tables.splice(target, 0, table);
  picked = null;
  save();
  render();
}

function renameTable(index, value) {
  const name = value.trim();
  state.tables[index].name = name && name !== autoLabel(state.tables[index]) ? name : null;
  save();
  render();
}

function nameField(person) {
  const field = document.createElement("input");
  field.className = "seat-name";
  field.value = customNames[person.id] || "";
  field.placeholder = person.name;
  field.setAttribute("aria-label", person.name + " neve");
  field.addEventListener("change", () => renameGuest(person.id, field.value));
  field.addEventListener("click", (event) => event.stopPropagation());
  return field;
}

function seatCell(person, place) {
  const cell = document.createElement("div");
  cell.className = "seat " + place.side + (person ? "" : " empty");
  if (samePlace(picked, place)) cell.classList.add("selected");
  if (person && renameMode) {
    cell.classList.add("renaming");
    const dot = document.createElement("span");
    dot.className = "dot";
    cell.append(dot, nameField(person));
    return cell;
  }
  if (person) {
    cell.draggable = true;
    const dot = document.createElement("span");
    dot.className = "dot";
    cell.append(dot, document.createTextNode(displayName(person)));
    cell.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", JSON.stringify(place));
      event.dataTransfer.effectAllowed = "move";
    });
  } else {
    cell.textContent = "üres";
  }
  cell.addEventListener("dragover", (event) => {
    event.preventDefault();
    cell.classList.add("drop-here");
  });
  cell.addEventListener("dragleave", () => cell.classList.remove("drop-here"));
  cell.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    cell.classList.remove("drop-here");
    const payload = event.dataTransfer.getData("text/plain");
    if (payload) moveSeat(JSON.parse(payload), place);
  });
  cell.addEventListener("click", (event) => {
    event.stopPropagation();
    if (picked) moveSeat(picked, place);
    else if (person) { picked = place; render(); }
  });
  return cell;
}

function headSection() {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  const title = document.createElement("span");
  title.textContent = "Főasztal";
  const count = document.createElement("span");
  count.textContent = state.head.length + " fő";
  heading.append(title, count);
  const list = document.createElement("ul");
  state.head.forEach((person) => {
    const item = document.createElement("li");
    item.className = "readonly";
    const dot = document.createElement("span");
    dot.className = "dot";
    item.append(dot, renameMode ? nameField(person) : document.createTextNode(displayName(person)));
    list.append(item);
  });
  section.append(heading, list);
  return section;
}

function edgeRow(table, index, slot) {
  const row = document.createElement("div");
  row.className = "row edge-row";
  const label = document.createElement("span");
  label.className = "edge-label";
  label.textContent = "asztalvég";
  row.append(label, seatCell(table.edge[slot] || null, { table: index, side: "edge", index: slot }));
  return row;
}

function tableSection(table, index) {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  const number = document.createElement("span");
  number.className = "table-no";
  number.textContent = index + 1 + ".";
  const input = document.createElement("input");
  input.className = "table-name";
  input.value = table.name || "";
  input.placeholder = autoLabel(table);
  input.setAttribute("aria-label", index + 1 + ". asztal neve");
  input.addEventListener("change", () => renameTable(index, input.value));
  input.addEventListener("click", (event) => event.stopPropagation());
  const count = document.createElement("span");
  const total = seats(table).length;
  count.textContent = total + " fő";
  if (total > 16 || total < 14) count.className = "count-warn";
  const order = document.createElement("span");
  order.className = "order";
  [["◀", -1, "előrébb"], ["▶", 1, "hátrébb"]].forEach(([glyph, delta, what]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "move-table";
    button.textContent = glyph;
    button.title = "Asztal " + what;
    button.setAttribute("aria-label", index + 1 + ". asztal " + what);
    button.disabled = index + delta < 0 || index + delta >= state.tables.length;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      moveTable(index, delta);
    });
    order.append(button);
  });
  heading.append(number, input, order, count);

  const grid = document.createElement("div");
  grid.className = "seats";
  grid.append(edgeRow(table, index, 0));
  const rows = rowCount(table) + 1;
  for (let i = 0; i < rows; i += 1) {
    const row = document.createElement("div");
    row.className = "row";
    const axis = document.createElement("span");
    axis.className = "axis";
    axis.textContent = "↔";
    row.append(
      seatCell(table.left[i] || null, { table: index, side: "left", index: i }),
      axis,
      seatCell(table.right[i] || null, { table: index, side: "right", index: i })
    );
    grid.append(row);
  }
  grid.append(edgeRow(table, index, 1));
  section.append(heading, grid);
  return section;
}

function renderEditor() {
  const root = document.getElementById("edit");
  root.replaceChildren();
  root.append(headSection());
  state.tables.forEach((table, index) => root.append(tableSection(table, index)));
}

function svgText(x, y, text, size, color, anchor, weight) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" fill="' + color +
    '" font-size="' + size + '" text-anchor="' + anchor + '" font-weight="' + weight +
    '" font-family="system-ui, Arial, sans-serif">' + escaped + '</text>';
}

function mapTable(index, table) {
  const angle = (index % 2 === 0 ? -38 : 38) * Math.PI / 180;
  const cx = index % 2 === 0 ? 650 : 1750;
  const cy = 1080 + Math.floor(index / 2) * 700;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  const length = 830;
  let out = '<line x1="' + (cx - dx * length / 2).toFixed(1) + '" y1="' + (cy - dy * length / 2).toFixed(1) +
    '" x2="' + (cx + dx * length / 2).toFixed(1) + '" y2="' + (cy + dy * length / 2).toFixed(1) +
    '" stroke="#f2edd9" stroke-width="82" stroke-linecap="round"/>';
  out += svgText(cx, cy - 350, tableHeading(table, index), 26, "#d6b36b", "middle", "700");
  [table.left, table.right].forEach((guests, sideIndex) => {
    const side = sideIndex === 0 ? -1 : 1;
    guests.forEach((person, seat) => {
      if (!person) return;
      const fraction = guests.length === 1 ? 0.5 : seat / (guests.length - 1);
      const along = (fraction - 0.5) * length * 0.88;
      const mx = cx + dx * along + nx * side * 92;
      const my = cy + dy * along + ny * side * 92;
      const outward = nx * side;
      const anchor = outward >= 0 ? "start" : "end";
      out += '<circle cx="' + mx.toFixed(1) + '" cy="' + my.toFixed(1) + '" r="20" fill="' +
        (sideIndex === 0 ? "#9bc9d5" : "#efbf8c") + '" stroke="#102033" stroke-width="3"/>';
      out += svgText(mx + outward * 34, my + 8, displayName(person), 25, "#f4f0e3", anchor, "600");
    });
  });
  (table.edge || []).slice(0, 2).forEach((person, slot) => {
    if (!person) return;
    const direction = slot === 0 ? -1 : 1;
    const reach = length / 2 + 62;
    const bx = cx + dx * direction * reach;
    const by = cy + dy * direction * reach;
    out += '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) +
      '" r="16" fill="#c7b0e3" stroke="#102033" stroke-width="3"/>';
    out += svgText(bx, by + (direction < 0 ? -26 : 37), displayName(person) + " (baba)", 22, "#e6dcf6", "middle", "600");
  });
  return '<g>' + out + '</g>';
}

function seatedTotal() {
  return state.head.length + state.tables.reduce((sum, table) => sum + seats(table).length, 0);
}

function renderMap() {
  const total = seatedTotal();
  let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 4600">';
  svg += '<rect width="2400" height="4600" fill="#0d1d2d"/>';
  svg += '<rect x="64" y="230" width="2272" height="4250" rx="12" fill="#10243a" stroke="#243d56" stroke-width="4"/>';
  svg += svgText(1200, 92, "ÜLTETÉSI TÉRKÉP", 54, "#d6b36b", "middle", "700");
  svg += svgText(1200, 160, SUBTITLES[baseVersion], 28, "#f4f0e3", "middle", "400");
  svg += svgText(1200, 300, "FŐASZTAL", 27, "#d6b36b", "middle", "700");
  svg += '<line x1="650" y1="580" x2="1750" y2="580" stroke="#f2edd9" stroke-width="92" stroke-linecap="round"/>';
  state.head.forEach((person, index) => {
    const x = 500 + index * 280;
    svg += '<circle cx="' + x + '" cy="485" r="22" fill="' + (index % 2 === 0 ? "#9bc9d5" : "#efbf8c") +
      '" stroke="#102033" stroke-width="3"/>';
    svg += svgText(x, 440, displayName(person), 25, "#f4f0e3", "middle", "600");
  });
  state.tables.forEach((table, index) => { svg += mapTable(index, table); });
  svg += svgText(1200, 4520, total + " fő", 28, "#d6b36b", "middle", "700");
  svg += '</svg>';
  document.getElementById("map").innerHTML = svg;
}

function render() {
  document.getElementById("total").textContent = seatedTotal() + " fő";
  document.getElementById("subtitle").textContent = SUBTITLES[baseVersion];
  const picker = document.getElementById("base-plan");
  if (picker) picker.value = baseVersion;
  renderEditor();
  if (!document.getElementById("map").classList.contains("hidden")) renderMap();
}

function showView(view) {
  const edit = document.getElementById("edit");
  const map = document.getElementById("map");
  edit.classList.toggle("hidden", view !== "edit");
  map.classList.toggle("hidden", view !== "map");
  document.getElementById("tab-edit").setAttribute("aria-pressed", String(view === "edit"));
  document.getElementById("tab-map").setAttribute("aria-pressed", String(view === "map"));
  if (view === "map") renderMap();
}

function markdown() {
  const stamp = new Date().toLocaleString("hu-HU");
  const lines = [
    "# Ültetési terv — " + SUBTITLES[baseVersion],
    "",
    "Mentve: " + stamp,
    "Összesen: " + seatedTotal() + " fő",
    "",
    "Az asztaloknál a két oldal egymással szemben ül, soronként párba állítva.",
    "",
    "## Főasztal (" + state.head.length + " fő)",
    "",
  ];
  state.head.forEach((person) => lines.push("- " + displayName(person)));
  state.tables.forEach((table, index) => {
    lines.push("", "## " + tableHeading(table, index) + " (" + seats(table).length + " fő)", "");
    const rows = rowCount(table);
    for (let i = 0; i < rows; i += 1) {
      const left = table.left[i] ? displayName(table.left[i]) : "—";
      const right = table.right[i] ? displayName(table.right[i]) : "—";
      lines.push(i + 1 + ". " + left + " ↔ " + right);
    }
    const babies = (table.edge || []).filter(Boolean).map(displayName);
    if (babies.length) lines.push("- Asztalvég: " + babies.join(" · "));
  });
  lines.push("");
  return lines.join("\n");
}

function downloadMarkdown() {
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  const blob = new Blob([markdown()], { type: "text/markdown;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ultetes-" + baseVersion + "-" + stamp + ".md";
  link.click();
  URL.revokeObjectURL(link.href);
}

function parseMarkdown(text) {
  const headIds = new Set(INITIAL.head.map((p) => p.id));
  const pool = new Map();
  EVERYONE.forEach((p) => {
    [p.name, displayName(p)].forEach((label) => {
      if (!pool.has(label)) pool.set(label, []);
      if (!pool.get(label).includes(p.id)) pool.get(label).push(p.id);
    });
  });
  const used = new Set();
  const unknown = [];
  const clean = (raw) => raw.replace(/[*_`]/g, "").trim();
  const take = (name) => {
    if (!name || /^[—–-]$/.test(name)) return null;
    const ids = pool.get(name) || [];
    while (ids.length) {
      const id = ids.shift();
      if (!used.has(id)) {
        used.add(id);
        return BY_ID.get(id);
      }
    }
    unknown.push(name);
    return null;
  };
  const sections = [];
  let current = null;
  text.split(/\r?\n/).forEach((line) => {
    const heading = line.match(/^#{2,6}\s+(.*)$/);
    if (heading) {
      const title = clean(heading[1]).replace(/\s*\(\s*\d+\s*fő\s*\)\s*$/i, "").trim();
      current = /^főasztal/i.test(title) ? null : { title, rows: [], flat: [], edge: [] };
      if (current) sections.push(current);
      return;
    }
    if (!current) return;
    const item = line.match(/^\s*(?:[-*+]|\d+[.)])\s+(.*)$/);
    if (!item) return;
    const body = clean(item[1]);
    if (!body) return;
    const edge = body.match(/^asztalvég\s*:\s*(.*)$/i);
    if (edge) {
      edge[1].split(/[·,;]/).forEach((raw) => {
        const person = take(clean(raw).replace(/\s*\(baba\)\s*$/i, ""));
        if (person) current.edge.push(person);
      });
      return;
    }
    if (body.includes("↔")) {
      const pair = body.split("↔");
      current.rows.push([take(clean(pair[0])), take(clean(pair[1] || ""))]);
    } else {
      const person = take(clean(body.split("(")[0]));
      if (person) current.flat.push(person);
    }
  });
  if (!sections.length) return { error: "A fájlban nem találtam asztalokat." };

  const tables = sections.slice(0, baseTables().length).map((section) => {
    const edge = section.edge.slice(0, EDGE_SLOTS);
    if (section.rows.length) {
      return {
        name: section.title,
        left: section.rows.map((row) => row[0]),
        right: section.rows.map((row) => row[1]),
        edge,
      };
    }
    const split = Math.ceil(section.flat.length / 2);
    return {
      name: section.title,
      left: section.flat.slice(0, split),
      right: section.flat.slice(split),
      edge,
    };
  });
  while (tables.length < baseTables().length) tables.push({ name: null, left: [], right: [], edge: [] });
  sections.slice(baseTables().length).forEach((extra) => {
    const last = tables[tables.length - 1];
    extra.rows.forEach((row) => row.forEach((person) => person && sitAtFreeSeat(last, person)));
    extra.flat.forEach((person) => sitAtFreeSeat(last, person));
    extra.edge.forEach((person) => sitAtFreeSeat(last, person));
  });

  const missing = [];
  baseTables().forEach((table, index) => {
    table.left.concat(table.right, table.edge || []).forEach((person) => {
      if (person && !used.has(person.id) && !headIds.has(person.id)) {
        used.add(person.id);
        sitAtFreeSeat(tables[index], person);
        missing.push(displayName(person));
      }
    });
  });

  tables.forEach((table) => {
    ["left", "right"].forEach((side) => {
      table[side].forEach((person, i) => {
        if (person && person.baby) {
          table[side][i] = null;
          sitAtFreeSeat(table, person);
        }
      });
    });
    trimSide(table.left);
    trimSide(table.right);
    trimSide(table.edge);
    const custom = (table.name || "").replace(/^\d+\.\s*asztal\s*[—–·:-]?\s*/i, "").trim();
    table.name = custom && custom !== autoLabel(table) ? custom : null;
  });
  return { tables, unknown, missing };
}

function importMarkdown(input) {
  const file = input.files && input.files[0];
  input.value = "";
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const result = parseMarkdown(String(reader.result));
    const status = document.getElementById("status");
    if (result.error) {
      status.textContent = result.error;
      return;
    }
    state = { head: INITIAL.head.slice(), tables: result.tables };
    save();
    picked = null;
    render();
    const notes = [file.name + " betöltve"];
    if (result.missing.length) notes.push(result.missing.length + " hiányzó vendég az eredeti asztalára került");
    if (result.unknown.length) notes.push("ismeretlen név kihagyva: " + result.unknown.join(", "));
    status.textContent = notes.join(" · ");
  };
  reader.readAsText(file, "utf-8");
}

function resetPlan() {
  const picker = document.getElementById("base-plan");
  if (picker && PLANS[picker.value]) baseVersion = picker.value;
  state = { head: INITIAL.head.slice(), tables: blankTables() };
  picked = null;
  save();
  document.getElementById("status").textContent = SUBTITLES[baseVersion] + " betöltve";
  render();
}

Object.assign(window, { showView, toggleNames, downloadMarkdown, importMarkdown, resetPlan });
render();
