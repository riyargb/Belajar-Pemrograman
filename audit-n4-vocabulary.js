#!/usr/bin/env node
"use strict";

// Structural and cross-level audit for curated N4 vocabulary batches.
// Run from repository root: node audit-n4-vocabulary.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const dataDir = path.join(__dirname, "data");
const n4Files = fs.readdirSync(dataDir)
  .filter(name => /^vocabulary-n4-batch\\d+\\.js$/.test(name))
  .sort((a, b) => Number(a.match(/batch(\\d+)/)[1]) - Number(b.match(/batch(\\d+)/)[1]));
assert.ok(n4Files.length > 0, "At least one N4 vocabulary batch must exist.");

const n5Files = ["vocabulary-n5-batch1.js", "vocabulary-n5-batch2.js"];
const n5 = n5Files.flatMap(file => require(path.join(dataDir, file)));
const n5Headwords = new Set(n5.map(entry => entry.jp));
const required = ["jp", "kana", "arti", "kelas", "contoh", "bacaan", "terjemahan"];
const allowed = new Set([
  "kata ganti", "kata benda", "kata tanya", "kata tunjuk", "ungkapan",
  "kata keterangan", "kata waktu", "kata kerja", "kata sifat-i", "kata sifat-na"
]);
const all = [];
const errors = [];
const warnings = [];

for (const file of n4Files) {
  const entries = require(path.join(dataDir, file));
  if (!Array.isArray(entries) || entries.length === 0) {
    errors.push(file + ": export must be a non-empty array");
    continue;
  }
  console.log("- " + file + ": " + entries.length + " entries");
  for (const [i, e] of entries.entries()) {
    const where = file + ", entry " + (i + 1) + " (" + (e.jp || "no headword") + ")";
    for (const field of required) {
      if (typeof e[field] !== "string" || !e[field].trim()) errors.push(where + ": missing " + field);
    }
    if (!allowed.has(e.kelas)) errors.push(where + ": unknown category " + e.kelas);
    if (/[一-龯]/u.test(e.kana || "")) errors.push(where + ": kana contains kanji");
    if (/[A-Za-z]/u.test(e.kana || "")) errors.push(where + ": kana contains Latin letters");
    if (/[一-龯]/u.test(e.bacaan || "")) errors.push(where + ": example reading contains kanji");
    if (/[A-Za-z]/u.test(e.bacaan || "")) errors.push(where + ": example reading contains Latin letters");
    if (/^[ァ-ヺー]+$/u.test(e.jp || "") && e.kana !== e.jp) errors.push(where + ": katakana headword must retain katakana in kana field");
    if (!/[。？！]$/.test(e.contoh || "")) errors.push(where + ": example needs Japanese sentence punctuation");
    for (const mark of ["、", "。", "？", "！", "「", "」"]) {
      const ec = (e.contoh.match(new RegExp(mark, "g")) || []).length;
      const rc = (e.bacaan.match(new RegExp(mark, "g")) || []).length;
      if (ec !== rc) errors.push(where + ": punctuation count differs for " + mark);
    }
    if (n5Headwords.has(e.jp)) errors.push(where + ": headword overlaps N5; resolve explicitly before release");
    all.push(e);
  }
}
const seen = new Set();
for (const e of all) {
  if (seen.has(e.jp)) errors.push("duplicate N4 headword: " + e.jp);
  seen.add(e.jp);
}
const sentenceCounts = new Map();
for (const e of all) sentenceCounts.set(e.contoh, (sentenceCounts.get(e.contoh) || 0) + 1);
for (const [sentence, count] of sentenceCounts) if (count > 1) warnings.push("repeated example (" + count + "): " + sentence);

console.log("N4 total: " + all.length);
console.log("Unique N4 headwords: " + seen.size);
console.log("N5 overlap: " + all.filter(e => n5Headwords.has(e.jp)).length);
console.log("Repeated example warnings: " + warnings.length);
if (warnings.length) warnings.forEach(w => console.warn("WARN: " + w));
if (errors.length) {
  console.error("\nFAIL: " + errors.length + " error(s)");
  errors.forEach(e => console.error("- " + e));
  process.exitCode = 1;
} else {
  console.log("\nPASS: schema, category, readings, punctuation, uniqueness, and N5 overlap checks.");
}
console.log("NOTE: structural checks do not prove every reading, meaning, example, translation, or JLPT level is linguistically correct.");
