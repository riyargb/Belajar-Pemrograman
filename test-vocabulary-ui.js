#!/usr/bin/env node
"use strict";

// Runtime smoke tests for the vocabulary lab using a deterministic fake DOM.
// This is not a substitute for testing in a real browser/device.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "english-roadmap.html"), "utf8");
const start = html.indexOf("// SALMAN_VOCAB_LAB_V3");
const end = html.indexOf("// END SALMAN_VOCAB_LAB_V3", start);
assert.notEqual(start, -1, "Vocabulary Lab script marker must exist");
assert.notEqual(end, -1, "Vocabulary Lab end marker must exist");
const source = html.slice(start, end);

const dataDir = path.join(__dirname, "data");
const datasets = {
  VOCAB_N5_BATCH1: require(path.join(dataDir, "vocabulary-n5-batch1.js")),
  VOCAB_N5_BATCH2: require(path.join(dataDir, "vocabulary-n5-batch2.js")),
};
for (let i = 1; i <= 16; i++) {
  datasets["VOCAB_N4_BATCH" + i] = require(path.join(dataDir, "vocabulary-n4-batch" + i + ".js"));
}

const ids = [
  "vl-card", "vl-count", "vl-mark", "vl-stats", "vl-progress", "vl-level",
  "vl-search", "vl-category", "vl-reveal", "vl-next", "vl-unlearned",
  "vl-all", "vl-list-toggle", "vl-list",
];

function createHarness(initialStorage = {}) {
  const elements = new Map();
  const storage = { ...initialStorage };
  for (const id of ids) {
    elements.set(id, {
      id,
      value: id === "vl-level" ? "N5" : id === "vl-category" ? "ALL" : "",
      textContent: "",
      innerHTML: "",
      disabled: false,
      hidden: id === "vl-list",
      style: {},
      listeners: {},
      addEventListener(type, fn) { this.listeners[type] = fn; },
    });
  }
  const document = {
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, {
          id, value: "", textContent: "", innerHTML: "", disabled: false,
          hidden: false, style: {}, listeners: {},
          addEventListener(type, fn) { this.listeners[type] = fn; },
        });
      }
      return elements.get(id);
    },
  };
  const localStorage = {
    getItem(key) { return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null; },
    setItem(key, value) { storage[key] = String(value); },
  };
  const context = { document, localStorage, console, ...datasets };
  vm.createContext(context);
  vm.runInContext(source, context, { timeout: 3000 });
  return { context, elements, storage };
}

const h = createHarness();
const el = id => h.elements.get(id);
assert.match(el("vl-stats").textContent, /N5 · Hafal 0\/800 kosakata/, "N5 should load 800 entries");
assert.match(el("vl-count").textContent, /\[N5\] Kartu 1\/800/, "initial N5 deck should contain 800 entries");
assert.match(el("vl-card").innerHTML, /Coba ingat arti kata ini/, "answer should start hidden");

el("vl-reveal").listeners.click();
assert.match(el("vl-card").innerHTML, /<b>Contoh:<\/b>/, "reveal should show example, reading, and translation");
assert.equal(el("vl-reveal").textContent, "Sembunyikan jawaban", "reveal button label should update");
el("vl-next").listeners.click();
assert.match(el("vl-count").textContent, /Kartu 2\/800/, "next should advance one card");
assert.match(el("vl-card").innerHTML, /•••/, "next should hide answer again");

el("vl-mark").listeners.click();
assert.match(el("vl-stats").textContent, /Hafal 1\/800/, "mark learned should update progress");
assert.equal(el("vl-mark").disabled, true, "learned card should disable duplicate marking");
assert.ok(h.storage.sal_vocab_n5_progress_v1, "N5 progress should persist in localStorage");

el("vl-search").value = "definitely-no-such-vocabulary";
el("vl-search").listeners.input();
assert.match(el("vl-card").innerHTML, /Kosakata tidak ditemukan/, "empty search should show empty state");
assert.equal(el("vl-mark").disabled, true, "mark must be disabled for empty results");
el("vl-all").listeners.click();
assert.equal(el("vl-search").value, "", "show all should clear search");
assert.equal(el("vl-category").value, "ALL", "show all should reset category");

el("vl-level").value = "N4";
el("vl-level").listeners.change();
assert.match(el("vl-stats").textContent, /N4 · Hafal 0\/700 kosakata/, "N4 should load 700 entries with separate progress");
assert.match(el("vl-count").textContent, /\[N4\] Kartu 1\/700/, "N4 deck should contain 700 entries");
assert.ok(h.storage.sal_vocab_n5_progress_v1, "switching level must preserve N5 progress");
assert.equal(h.storage.sal_vocab_n4_progress_v1, undefined, "switching level must not create learned N4 items");

el("vl-search").value = "赤ちゃん";
el("vl-search").listeners.input();
assert.match(el("vl-count").textContent, /Kartu 1\/1/, "N4 search should return a unique headword");
assert.match(el("vl-card").innerHTML, /赤ちゃん/, "search should render matching headword");

el("vl-search").value = "";
el("vl-search").listeners.input();
el("vl-category").value = "kata kerja";
el("vl-category").listeners.change();
assert.ok(/ditampilkan/.test(el("vl-stats").textContent), "category filter should refresh result statistics");
assert.ok(!el("vl-count").textContent.includes("赤ちゃん"), "category filter should remove non-matching headword");

el("vl-category").value = "ALL";
el("vl-category").listeners.change();
el("vl-unlearned").listeners.click();
assert.match(el("vl-stats").textContent, /ditampilkan/, "unlearned filter should render a filtered deck");

el("vl-list-toggle").listeners.click();
assert.equal(el("vl-list").hidden, false, "list toggle should reveal full list");
assert.match(el("vl-list").innerHTML, /type="checkbox"/, "full list should contain checkboxes");
const firstWord = el("vl-list").innerHTML.match(/data-word="([^"]+)"/);
assert.ok(firstWord, "full list should include a word key");
el("vl-list").listeners.change({ target: { dataset: { word: firstWord[1] }, checked: true } });
assert.ok(h.storage.sal_vocab_n4_progress_v1, "list checkbox should save progress");

const reloaded = createHarness(h.storage);
assert.match(reloaded.elements.get("vl-stats").textContent, /N5 · Hafal 1\/800/, "reload should restore N5 progress and default level");
const malformed = createHarness({ sal_vocab_n5_progress_v1: "not-json" });
assert.match(malformed.elements.get("vl-stats").textContent, /N5 · Hafal 0\/800/, "malformed saved JSON should safely reset progress");
const wrongShape = createHarness({ sal_vocab_n5_progress_v1: JSON.stringify(["私", "人"]) });
assert.match(wrongShape.elements.get("vl-stats").textContent, /N5 · Hafal 0\/800/, "array-shaped saved progress should safely reset");
const dirtyValues = createHarness({ sal_vocab_n5_progress_v1: JSON.stringify({ "私": true, "人": "yes" }) });
assert.match(dirtyValues.elements.get("vl-stats").textContent, /N5 · Hafal 1\/800/, "only true boolean progress flags should be restored");
console.log("PASS: Vocabulary Lab runtime smoke tests (N5/N4 totals, reveal/next, search empty state, filters, marking, list checkbox, per-level persistence, reload, corrupted progress recovery).");
