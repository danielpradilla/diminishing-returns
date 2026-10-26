import { entries } from "../data/entries.js?v=4";
import { renderChart } from "./charts.js?v=4";

const byId = new Map(entries.map((entry) => [entry.id, entry]));

const defaults = {
  "fuel-economy": { start: 12, end: 14 },
  "working-hours": {},
  "daily-steps": { group: "older" },
  "practice-retention": {},
  "protein-training": {},
  "income-wellbeing": { scale: "linear" },
  "nitrogen-fertilizer": {},
  "parallel-computing": { s: 0.1 },
  "ai-training": { scale: "log" },
  "research-productivity": {},
};

const state = Object.fromEntries(
  entries.map((entry) => [entry.id, { ...(defaults[entry.id] || {}) }]),
);

const gallery = document.getElementById("gallery");
const dialog = document.getElementById("entry-dialog");
const dialogContent = document.getElementById("dialog-content");
let currentDialogId = null;
let lastTrigger = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function tableHtml(table) {
  const head = table.columns
    .map((column, index) => `<th scope="col"${index > 0 ? ' class="num"' : ""}>${escapeHtml(column)}</th>`)
    .join("");
  const body = table.rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell, index) => `<td${index > 0 ? ' class="num"' : ""}>${escapeHtml(cell)}</td>`)
          .join("")}</tr>`,
    )
    .join("");
  return `<div class="table-shell" tabindex="0" role="region" aria-label="Data table"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function csvCell(value) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function csvHref(csv) {
  const text = csv.rows.map((row) => row.map(csvCell).join(",")).join("\n");
  return `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`;
}

function chartHeight(entry, width, expanded) {
  const research = entry.id === "research-productivity";
  const aspect = research ? 0.74 : 0.52;
  const min = expanded ? (research ? 500 : 360) : research ? (width < 470 ? 390 : 350) : width < 470 ? 270 : 255;
  const max = expanded ? (research ? 640 : 520) : research ? 470 : 360;
  return Math.round(Math.max(min, Math.min(max, width * aspect)));
}

function renderEntryChart(entry, host, expanded) {
  if (!host) return;
  const width = Math.max(260, Math.round(host.clientWidth || 560));
  const measured = Math.round(host.getBoundingClientRect().height);
  const height = expanded
    ? chartHeight(entry, width, true)
    : Math.max(240, measured || 356);
  renderChart(host, entry.chart(state[entry.id]), { width, height });
}

function entryCard(entry) {
  const st = state[entry.id];
  const controls = entry.controlsHtml(st, "card-");
  const output = entry.outputHtml(st);
  return `
    <article class="entry" id="${entry.id}" aria-labelledby="${entry.id}-title">
      <header class="entry-head">
        <p class="entry-kicker">
          <span>${String(entry.index).padStart(2, "0")} · ${escapeHtml(entry.section)}</span>
          <a class="fragment" href="#${entry.id}" aria-label="Link to ${escapeHtml(entry.title)}">#</a>
        </p>
        <h2 id="${entry.id}-title">${escapeHtml(entry.title)}</h2>
        <p class="entry-dek">${escapeHtml(entry.dek)}</p>
      </header>

      <figure class="chart-figure">
        <div class="chart-frame">
          <div class="chart-canvas" id="chart-${entry.id}"></div>
          <button class="chart-hit" type="button" data-open="${entry.id}" aria-label="Enlarge chart: ${escapeHtml(entry.title)}"></button>
        </div>
        <figcaption>
          <span><strong>${escapeHtml(entry.provenance.reconstruction)}.</strong> ${escapeHtml(entry.provenance.figure)}.</span>
          <button type="button" class="figcaption-action" data-open="${entry.id}">Enlarge chart</button>
        </figcaption>
      </figure>

      ${controls ? `<div class="chart-controls" id="controls-${entry.id}">${controls}</div>` : ""}
      ${output ? `<div data-output-host="${entry.id}">${output}</div>` : ""}

      <div class="entry-body">
        <p class="finding">${escapeHtml(entry.finding)}</p>
        <p class="comparison">${escapeHtml(entry.comparison)}</p>
        <p class="caveat"><span class="caveat-label">Caveat</span>${escapeHtml(entry.caveat)}</p>
      </div>

      <footer class="entry-meta">
        <span class="authors">${escapeHtml(entry.authors)} (${entry.year})</span>
        <span class="meta-dot" aria-hidden="true">·</span>
        <span>${escapeHtml(entry.studyTypeShort || entry.studyType)}</span>
        <span class="entry-actions">
          <a href="${entry.paperUrl}" target="_blank" rel="noopener noreferrer">Read the paper <span aria-hidden="true">↗</span></a>
        </span>
      </footer>
    </article>
  `;
}

function renderGallery() {
  gallery.innerHTML = entries.map(entryCard).join("");
  for (const entry of entries) {
    renderEntryChart(entry, document.getElementById(`chart-${entry.id}`), false);
  }
}

function alignEntryHeaders() {
  const entries = [...document.querySelectorAll(".entry")];
  for (const entry of entries) {
    const head = entry.querySelector(".entry-head");
    const title = entry.querySelector(".entry-head h2");
    if (head) head.style.minHeight = "";
    if (title) title.style.minHeight = "";
  }
  if (window.innerWidth <= 980) return;

  for (let i = 0; i < entries.length; i += 2) {
    const pair = entries
      .slice(i, i + 2)
      .map((entry) => ({
        head: entry.querySelector(".entry-head"),
        title: entry.querySelector(".entry-head h2"),
      }))
      .filter((item) => item.head && item.title);
    if (pair.length < 2) continue;

    const titleHeight = Math.ceil(Math.max(...pair.map((item) => item.title.getBoundingClientRect().height)));
    for (const item of pair) item.title.style.minHeight = `${titleHeight}px`;

    const headHeight = Math.ceil(Math.max(...pair.map((item) => item.head.getBoundingClientRect().height)));
    for (const item of pair) item.head.style.minHeight = `${headHeight}px`;
  }
}

function renderProvenance() {
  const body = document.getElementById("provenance-rows");
  body.innerHTML = entries
    .map(
      (entry) => `
        <tr>
          <td><a href="#${entry.id}">${String(entry.index).padStart(2, "0")} · ${escapeHtml(entry.section)}</a></td>
          <td>${escapeHtml(entry.journal)}</td>
          <td>${escapeHtml(entry.provenance.figure)}</td>
          <td>${escapeHtml(entry.provenance.reconstruction)}</td>
        </tr>
      `,
    )
    .join("");
}

function sourceRecord(entry) {
  const rows = [
    ["Authors", `${entry.authors} (${entry.year})`],
    ["Paper", entry.paperTitle],
    ["Publication", entry.journal],
    ["Study type", entry.studyType],
    ["Figure / table", entry.provenance.figure],
    ["Reconstruction", entry.provenance.reconstruction],
    ["Baseline", entry.provenance.baseline],
    ["Verified", entry.provenance.verified],
    ["Reuse", entry.provenance.reuse],
    ["Note", entry.provenance.note],
  ];
  return `<dl>${rows.map(([term, value]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl>`;
}

function dialogHtml(entry, st) {
  const controls = entry.controlsHtml(st, "dialog-");
  const output = entry.outputHtml(st);
  const csv = entry.csv(st);
  const table = entry.table(st);
  const related = entry.related
    ? `<p><a href="${entry.related}" target="_blank" rel="noopener noreferrer">${escapeHtml(entry.relatedLabel || "Related reading")} ↗</a></p>`
    : "";
  const dataLink = entry.dataUrl
    ? `<a href="${entry.dataUrl}" target="_blank" rel="noopener noreferrer">Data ↗</a>`
    : "";
  return `
    <header class="dialog-head">
      <div>
        <p class="eyebrow">Entry ${String(entry.index).padStart(2, "0")} · ${escapeHtml(entry.section)} · ${entry.year}</p>
        <h2 id="dialog-title">${escapeHtml(entry.title)}</h2>
      </div>
      <button class="dialog-close" type="button" data-close aria-label="Close the expanded chart">
        <span>Close</span><span class="x" aria-hidden="true">×</span>
      </button>
    </header>

    <div class="dialog-chart">
      <figure class="chart-figure">
        <div class="chart-frame">
          <div class="chart-canvas" id="dialog-chart-${entry.id}"></div>
        </div>
      </figure>
    </div>

    ${
      controls
        ? `<div class="dialog-controls">
             <div class="chart-controls">${controls}</div>
             ${output ? `<div data-output-host="${entry.id}">${output}</div>` : ""}
           </div>`
        : ""
    }

    <div class="dialog-copy">
      <section>
        <h3>Finding</h3>
        <p>${escapeHtml(entry.finding)}</p>
        <p>${escapeHtml(entry.comparison)}</p>
        ${related}
      </section>

      <section class="source-record">
        <h3>Study</h3>
        <dl>
          <dt>Population</dt><dd>${escapeHtml(entry.population)}</dd>
          <dt>Setting</dt><dd>${escapeHtml(entry.setting)}</dd>
          <dt>Method</dt><dd>${escapeHtml(entry.method)}</dd>
        </dl>
      </section>

      <section>
        <h3>Limitation</h3>
        <p>${escapeHtml(entry.limitation)}</p>
        <p><strong>Does not establish:</strong> ${escapeHtml(entry.notEstablished)}</p>
      </section>

      <section>
        <h3>Stopping point</h3>
        <p>${escapeHtml(entry.stopping)}</p>
      </section>

      <section class="source-record">
        <h3>Source record</h3>
        ${sourceRecord(entry)}
      </section>

      <section class="dialog-table">
        <h3>Data used in the chart</h3>
        <div data-dialog-table>${tableHtml(table)}</div>
        <div class="dialog-actions">
          <a href="${entry.paperUrl}" target="_blank" rel="noopener noreferrer">Read the paper ↗</a>
          ${dataLink}
          <a data-dialog-csv href="${csvHref(csv)}" download="${csv.filename}">Download plotted data (CSV)</a>
        </div>
        <p class="dialog-note">Values are the same in the card and the expanded view. The CSV contains the plotted series, including approximate digitized values where the source record says so.</p>
      </section>
    </div>
  `;
}

function openDialog(id, trigger) {
  const entry = byId.get(id);
  if (!entry) return;
  if (dialog.open) dialog.close();
  currentDialogId = id;
  lastTrigger = trigger || document.activeElement;
  dialogContent.innerHTML = dialogHtml(entry, state[id]);
  document.documentElement.classList.add("dialog-open");
  dialog.showModal();
  const host = document.getElementById(`dialog-chart-${id}`);
  renderEntryChart(entry, host, true);
  const close = dialog.querySelector(".dialog-close");
  if (close) close.focus();
}

function closeDialog() {
  if (dialog.open) dialog.close();
}

function syncControls(entryId) {
  const st = state[entryId];
  for (const el of document.querySelectorAll(`[data-entry="${entryId}"]`)) {
    if (el.tagName === "SELECT") {
      if (el.dataset.control === "fuel-start") el.value = String(st.start);
      if (el.dataset.control === "fuel-end") el.value = String(st.end);
    }
    if (el.tagName === "INPUT" && el.type === "range" && el.dataset.control === "amdahl-s") {
      el.value = String(st.s);
    }
  }
  for (const button of document.querySelectorAll(`[data-entry="${entryId}"][data-control][data-value]`)) {
    const value = button.dataset.value;
    let active = false;
    if (button.dataset.control === "steps-group") active = st.group === value;
    if (button.dataset.control === "income-scale" || button.dataset.control === "scaling-scale") {
      active = st.scale === value;
    }
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }
  for (const node of document.querySelectorAll(`[data-value="${entryId}"]`)) {
    node.textContent = st.s.toFixed(2);
  }
  for (const host of document.querySelectorAll(`[data-output-host="${entryId}"]`)) {
    host.innerHTML = byId.get(entryId).outputHtml(st);
  }
}

function refreshEntry(entryId) {
  const entry = byId.get(entryId);
  syncControls(entryId);
  renderEntryChart(entry, document.getElementById(`chart-${entryId}`), false);
  if (currentDialogId === entryId && dialog.open) {
    const host = document.getElementById(`dialog-chart-${entryId}`);
    renderEntryChart(entry, host, true);
    const table = dialog.querySelector("[data-dialog-table]");
    if (table) table.innerHTML = tableHtml(entry.table(state[entryId]));
    const link = dialog.querySelector("[data-dialog-csv]");
    if (link) {
      const csv = entry.csv(state[entryId]);
      link.href = csvHref(csv);
      link.setAttribute("download", csv.filename);
    }
  }
}

function handleControl(entryId, control, value) {
  const st = state[entryId];
  if (!st) return;
  if (control === "fuel-start") st.start = Number(value);
  else if (control === "fuel-end") st.end = Number(value);
  else if (control === "steps-group") st.group = value;
  else if (control === "income-scale" || control === "scaling-scale") st.scale = value;
  else if (control === "amdahl-s") st.s = Number(value);
  else return;
  refreshEntry(entryId);
}

document.addEventListener("click", (event) => {
  const open = event.target.closest("[data-open]");
  if (open) {
    event.preventDefault();
    openDialog(open.dataset.open, open);
    return;
  }

  if (event.target.closest("[data-close]")) {
    closeDialog();
    return;
  }

  const action = event.target.closest("[data-action]");
  if (action && action.dataset.action === "fuel-preset") {
    const entryId = action.dataset.entry;
    state[entryId].start = 28;
    state[entryId].end = 40;
    refreshEntry(entryId);
    return;
  }

  const segmented = event.target.closest("[data-control][data-value]");
  if (segmented && segmented.tagName === "BUTTON") {
    handleControl(segmented.dataset.entry, segmented.dataset.control, segmented.dataset.value);
  }
});

document.addEventListener("change", (event) => {
  const el = event.target.closest("select[data-control]");
  if (!el) return;
  handleControl(el.dataset.entry, el.dataset.control, el.value);
});

document.addEventListener("input", (event) => {
  const el = event.target.closest('input[type="range"][data-control]');
  if (!el) return;
  handleControl(el.dataset.entry, el.dataset.control, el.value);
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

dialog.addEventListener("close", () => {
  document.documentElement.classList.remove("dialog-open");
  currentDialogId = null;
  dialogContent.innerHTML = "";
  if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  lastTrigger = null;
});

function scrollToHash() {
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (!id) return;
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ block: "start" });
}

let resizeTimer = null;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    for (const entry of entries) {
      renderEntryChart(entry, document.getElementById(`chart-${entry.id}`), false);
    }
    if (currentDialogId && dialog.open) {
      const entry = byId.get(currentDialogId);
      renderEntryChart(entry, document.getElementById(`dialog-chart-${entry.id}`), true);
    }
    alignEntryHeaders();
  }, 140);
});

window.addEventListener("hashchange", scrollToHash);

for (const link of document.querySelectorAll(".dp-navbar-menu nav a")) {
  link.addEventListener("click", () => {
    const menu = link.closest("details");
    if (menu) menu.open = false;
  });
}

renderGallery();
alignEntryHeaders();
renderProvenance();
window.setTimeout(scrollToHash, 0);
