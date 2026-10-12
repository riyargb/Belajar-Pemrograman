#!/usr/bin/env node
"use strict";

// Structural quality gate for the two curated N5 study lists.
// Run from the repository root: node audit-n5-vocabulary.js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const html = fs.readFileSync("./english-roadmap.html", "utf8");
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

const appScripts = [
  '<script src="data/vocabulary-n5-batch1.js"></script>',
  '<script src="data/vocabulary-n5-batch2.js"></script>',
];
const dataLoader = 'const data = [...(typeof VOCAB_N5_BATCH1';
const loaderIndex = html.indexOf(dataLoader);
assert.ok(loaderIndex >= 0, "Vocabulary UI data loader must exist in english-roadmap.html");
for (const scriptTag of appScripts) {
  const scriptIndex = html.indexOf(scriptTag);
  assert.ok(scriptIndex >= 0, `Missing app script reference: ${scriptTag}`);
  assert.ok(scriptIndex < loaderIndex, `Vocabulary data must load before the UI loader: ${scriptTag}`);
}
const requiredUiIds = [
  "vocab-lab", "vl-stats", "vl-progress", "vl-search", "vl-category",
  "vl-card", "vl-count", "vl-reveal", "vl-next", "vl-mark",
  "vl-unlearned", "vl-all", "vl-list-toggle", "vl-list",
];
for (const id of requiredUiIds) {
  assert.ok(html.includes('id="' + id + '"') || html.includes("id='" + id + "'"), 'Missing vocabulary UI element id="' + id + '"');
}

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
  /^(これは私の.+です。|ここは(?:学校|大学|高校|教室|図書館|会社|事務所|病院|銀行|郵便局|駅|空港|店|デパート|スーパー|コンビニ|レストラン|喫茶店|食堂|ホテル|旅館|家|部屋|台所|玄関|トイレ|庭|建物|公園|動物園|映画館|美術館|博物館|神社|寺|薬局|アパート|マンション|居間|駐車場|市場|本屋|花屋|肉屋|魚屋|八百屋|料理店|会議室|体育館|遊園地|劇場|教会|大使館|市役所|区役所|工場|農場|港|海岸|温泉|プール|運動場)です。)$/.test(contoh)
);

const repeatedCommuteTemplate = all.filter(({ contoh }) =>
  /^毎朝、.+で学校へ行きます。$/.test(contoh)
);

// These are review candidates, not an official JLPT classification.
// JLPT does not publish a definitive, exhaustive vocabulary list.
const levelReviewCandidates = new Set([
  "経済", "政治", "社会", "歴史", "科学", "経験", "習慣", "方法", "種類",
  "部分", "途中", "場合", "近所", "特に", "なるべく", "とにかく", "せっかく",
  "危険", "必要", "十分", "経験", "予約", "会議", "薬局", "警察", "台風",
  "地震", "地下鉄", "新幹線", "汽車", "運転手", "警官", "説明", "連絡",
]);
const levelReview = all.filter(({ jp }) => levelReviewCandidates.has(jp));

console.log("N5 vocabulary structural + static integration audit");
console.log("- App integration: both data files load before the UI script; required UI IDs are present.");
for (const batch of batches) {
  console.log(`- ${batch.name}: ${batch.entries.length} entries`);
}
console.log(`- Total entries: ${all.length}`);
console.log(`- Unique headwords: ${seen.size}`);
console.log(`- Repeated example sentences (review warning): ${duplicateExamples.length}`);
console.log(`- Basic template examples (review warning): ${genericExamples.length}`);
console.log(`- Repeated commute-template examples (review warning): ${repeatedCommuteTemplate.length}`);
console.log(`- Possible supplemental-level terms to review (not definitive): ${levelReview.length}`);
if (levelReview.length) {
  console.log(`  ${levelReview.map(({ jp }) => jp).join(", ")}`);
}

if (errors.length) {
  console.error(`\nFAILED: ${errors.length} issue(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("\nPASS: counts, required fields, categories, readings, punctuation, and headword uniqueness.");
}

if (genericExamples.length || duplicateExamples.length || repeatedCommuteTemplate.length || levelReview.length) {
  console.log("\nNOTE: Review warnings are advisory. The level candidates are not official JLPT classifications.");
}
console.log("NOTE: This script checks structure only; it cannot prove every meaning, reading, example, or translation is correct.");
