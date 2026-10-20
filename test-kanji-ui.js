const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const html = fs.readFileSync("japanese-roadmap.html", "utf8");
const start = html.indexOf("// SALMAN_KANJI_LAB_V1");
const end = html.indexOf("// END SALMAN_KANJI_LAB_V1", start);
assert.notEqual(start, -1, "Kanji Lab script marker must exist");
assert.notEqual(end, -1, "Kanji Lab end marker must exist");
const source = html.slice(start, end);

const ids = [
  "kl-level", "kl-search", "kl-card", "kl-count", "kl-stats",
  "kl-progress", "kl-quiz", "kl-q-mode", "kl-q-count", "kl-q-question",
  "kl-q-options", "kl-q-feedback", "kl-q-next"
];

function createHarness(saved = {}) {
  const elements = new Map();
  const storage = { ...saved };
  for (const id of ids) {
    elements.set(id, {
      id, value: id === "kl-level" ? "ALL" : id === "kl-q-mode" ? "mixed" : "",
      textContent: "", innerHTML: "", disabled: false,
      style: {}, listeners: {}, className: "",
      classList: (() => { const values = new Set(); return {
        add(value) { values.add(value); }, remove(value) { values.delete(value); }, contains(value) { return values.has(value); }
      }; })(),
      addEventListener(type, fn) { this.listeners[type] = fn; },
      scrollIntoView() {}
    });
  }
  const document = {
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, {
          id, value: "", textContent: "", innerHTML: "", disabled: false,
          style: {}, listeners: {}, className: "",
          classList: (() => { const values = new Set(); return {
            add(value) { values.add(value); }, remove(value) { values.delete(value); }, contains(value) { return values.has(value); }
          }; })(),
          addEventListener(type, fn) { this.listeners[type] = fn; },
          scrollIntoView() {}
        });
      }
      return elements.get(id);
    },
    querySelectorAll(selector) {
      if (selector === "#kl-q-options button") {
        const html = elements.get("kl-q-options").innerHTML;
        return [...html.matchAll(/data-answer="([^"]+)"|data-kanji="([^"]+)"/g)].map(m => ({
          dataset: { answer: m[1] || m[2], kanji: m[2] || m[1] }, disabled: false, style: {}, addEventListener() {}
        }));
      }
      return [];
    }
  };
  elements.get("kl-quiz").classList.add("kl-hidden");
  const context = {
    document,
    console: { warn() {}, log() {} },
    alert() {},
    load(key, fallback) {
      return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : fallback;
    },
    save(key, value) { storage[key] = JSON.parse(JSON.stringify(value)); },
    storage
  };
  vm.createContext(context);
  vm.runInContext(source, context, { timeout: 3000 });
  return { context, elements, storage };
}

const h = createHarness();
const el = id => h.elements.get(id);
assert.match(el("kl-count").textContent, /Kartu 1\/300/, "initial deck should contain 300 cards");
assert.match(el("kl-card").innerHTML, /Coba ingat/, "initial card should hide the answer");

el("kl-level").value = "N5";
el("kl-level").listeners.change({ target: el("kl-level") });
assert.match(el("kl-count").textContent, /\/100/, "N5 filter should contain 100 cards");

el("kl-level").value = "N4";
el("kl-level").listeners.change({ target: el("kl-level") });
assert.match(el("kl-count").textContent, /\/200/, "N4 filter should contain 200 cards");

el("kl-level").value = "ALL";
el("kl-level").listeners.change({ target: el("kl-level") });
el("kl-search").value = "no-such-kanji-result";
el("kl-search").listeners.input();
assert.match(el("kl-count").textContent, /0 kartu/, "empty search should show zero results without crashing");
el("kl-search").value = "南";
el("kl-search").listeners.input();
assert.match(el("kl-count").textContent, /Kartu 1\/1/, "search by a unique kanji should return one card");
assert.match(el("kl-card").innerHTML, /南/, "search result should render the matching kanji");

el("kl-search").value = "";
el("kl-search").listeners.input();
h.context.klFlip();
assert.match(el("kl-card").innerHTML, /Arti:/, "flip should reveal the answer");
h.context.klMark();
assert.match(el("kl-stats").textContent, /Hafal 1\/300/, "mark should update learned count");
assert.ok(h.storage.sal_kanji_progress, "progress should be saved through storage adapter");

h.context.klQuizStart();
assert.equal(el("kl-quiz").classList.contains("kl-hidden"), false, "quiz should be shown");
const options = h.context.document.querySelectorAll("#kl-q-options button");
assert.ok(options.length >= 2 && options.length <= 4, "quiz should render 2–4 answer options");
h.context.klQuizAnswer(options[0].dataset.answer || options[0].dataset.kanji);
assert.equal(el("kl-q-next").disabled, false, "answering should enable next button");
h.context.klQuizNext();
assert.match(el("kl-q-count").textContent, /Soal 2\//, "next should advance the quiz");

const reloaded = createHarness(h.storage);
assert.match(reloaded.elements.get("kl-stats").textContent, /Hafal 1\/300/, "saved progress should restore on reload");
const corrupt = createHarness({ sal_kanji_progress: null });
assert.match(corrupt.elements.get("kl-stats").textContent, /Hafal 0\/300/, "corrupt saved progress should safely reset");

el("kl-q-mode").value = "kanji-hira";
h.context.klQuizStart();
assert.ok(el("kl-q-options").innerHTML.includes("data-answer="), "selected kanji quiz mode should render answer choices");
assert.match(el("kl-q-question").innerHTML, /hiragana/i, "kanji-to-hiragana mode should use the selected prompt");
console.log("PASS: Kanji Lab runtime smoke tests (300-card deck, N5/N4 filters, search, flip, progress save/reload, empty search, corrupt storage, multi-mode quiz).");
