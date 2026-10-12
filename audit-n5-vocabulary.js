#!/usr/bin/env node
"use strict";

// Structural quality gate for the two curated N5 study lists.
// Run from the repository root: node audit-n5-vocabulary.js
const assert = require("node:assert/strict");
const batch1 = require("./data/vocabulary-n5-batch1.js");
const batch2 = require("./data/vocabulary-n5-batch2.js");

const batches = [
  { name: "batch 1", expected: 400, entries: batch1 },
  { name: "batch 2", expected: 400, entries: batch2 },
];
const required = ["jp", "kana", "arti", "kelas", "contoh", "bacaan", "terjemahan"];
const allowedCategories = new Set([
  "kata ganti", "kata benda", "kata tanya", "kata tunjuk", "ungkapan",
  "kata keterangan", "kata waktu", "kata kerja", "kata sifat-i", "kata sifat-na",
]);
const all = [];
const errors = [];

for (const batch of batches) {
  assert.ok(Array.isArray(batch.entries), `${batch.name} must export an array`);
  assert.equal(batch.entries.length, batch.expected,
    `${batch.name} should contain exactly ${batch.expected} entries`);

  for (const [index, entry] of batch.entries.entries()) {
    const label = `${batch.name}, entry ${index + 1}`;
    for (const field of required) {
      if (typeof entry[field] !== "string" || entry[field].trim() === "") {
        errors.push(`${label}: missing/empty field "${field}"`);
      }
    }
    if (!allowedCategories.has(entry.kelas)) {
      errors.push(`${label} (${entry.jp}): unknown category "${entry.kelas}"`);
    }
    if (/[一-龯]/u.test(entry.bacaan || "")) {
      errors.push(`${label} (${entry.jp}): reading contains kanji`);
    }
    if (!/[。？！]$/.test(entry.contoh || "")) {
      errors.push(`${label} (${entry.jp}): example lacks Japanese sentence punctuation`);
    }
    all.push({ ...entry, _batch: batch.name, _index: index + 1 });
  }
}

const seen = new Map();
for (const entry of all) {
  if (seen.has(entry.jp)) {
    errors.push(`duplicate headword "${entry.jp}" (${seen.get(entry.jp)} and ${entry._batch})`);
  } else {
    seen.set(entry.jp, entry._batch);
  }
}

const exampleCounts = new Map();
for (const entry of all) {
  exampleCounts.set(entry.contoh, (exampleCounts.get(entry.contoh) || 0) + 1);
}
const duplicateExamples = [...exampleCounts].filter(([, count]) => count > 1);
const genericExamples = all.filter(({ contoh }) =>
  /^(これは私の.+です。|ここは.+です。|あの人は.+です。)$/.test(contoh)
);

console.log("N5 vocabulary structural audit");
for (const batch of batches) {
  console.log(`- ${batch.name}: ${batch.entries.length} entries`);
}
console.log(`- Total entries: ${all.length}`);
console.log(`- Unique headwords: ${seen.size}`);
console.log(`- Repeated example sentences (review warning): ${duplicateExamples.length}`);
console.log(`- Basic template examples (review warning): ${genericExamples.length}`);

if (errors.length) {
  console.error(`\nFAILED: ${errors.length} issue(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("\nPASS: counts, required fields, categories, readings, punctuation, and headword uniqueness.");
}

if (genericExamples.length) {
  console.log("\nNOTE: Structural checks do not verify every Japanese meaning, JLPT level, or translation.");
  console.log("Review template examples manually before treating the learning content as final.");
}
