#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const html = fs.readFileSync(path.join(__dirname, "english-roadmap.html"), "utf8");
const start = html.indexOf("const KL_DATA = [");
const end = html.indexOf("\n];", start);
if (start < 0 || end < 0) {
  console.error("FAIL: KL_DATA array not found.");
  process.exit(1);
}
const data = html.slice(start, end + 3);
const entries = [];
const pattern = /\{\s*k:"([^"]+)",l:"(N5|N4)",m:"([^"]*)",on:"([^"]*)",kun:"([^"]*)",v:"([^"]*)",s:"([^"]*)"\s*\}/g;
for (const match of data.matchAll(pattern)) {
  entries.push({ k: match[1], l: match[2], m: match[3], on: match[4], kun: match[5], v: match[6], s: match[7] });
}
const unique = new Set(entries.map(entry => entry.k));
const n5 = entries.filter(entry => entry.l === "N5").length;
const n4 = entries.filter(entry => entry.l === "N4").length;
const errors = [];
const warnings = [];
const requiredIds = ["kl-level", "kl-search", "kl-card", "kl-count", "kl-stats", "kl-progress", "kl-quiz", "kl-q-options", "kl-q-next"];
const requiredFunctions = ["klFiltered", "klRefresh", "klRender", "klNext", "klFlip", "klMark", "klQuizStart", "klQuizAnswer", "klQuizNext", "load", "save"];
for (const id of requiredIds) {
  if (!html.includes('id="' + id + '"')) errors.push("Kanji UI element is missing: #" + id + ".");
}
for (const name of requiredFunctions) {
  if (!html.includes("function " + name + "(")) errors.push("Kanji UI function is missing: " + name + "().");
}
if (!html.includes('"sal_kanji_progress"')) errors.push("Kanji progress storage key is missing.");

if (entries.length === 0) errors.push("No kanji entries parsed; check data format.");
if (unique.size !== entries.length) errors.push("Duplicate kanji characters detected.");
if (n5 !== 100) errors.push("N5 target is 100; found " + n5 + ".");
if (n4 !== 200) errors.push("N4 target is 200; found " + n4 + ".");
for (const entry of entries) {
  if (Array.from(entry.k).length !== 1) errors.push(entry.k + ": key must be exactly one kanji character.");
  for (const field of ["m", "on", "v", "s"]) {
    if (!entry[field].trim()) errors.push(entry.k + " (" + entry.l + "): required field " + field + " is empty.");
  }
  const vocabWord = entry.v.split("（")[0].trim();
  if (vocabWord && !vocabWord.includes(entry.k)) {
    warnings.push(entry.k + ": kanji key is not present in the displayed vocabulary headword: " + entry.v);
  }
  if (!entry.kun.trim()) {
    warnings.push(entry.k + ": kunyomi field is blank; use a reading or an explicit dash after review.");
  } else if (entry.kun.trim() === "—") {
    // Explicitly marked as no kunyomi supplied; this is a review marker, not a reading.
  }
  if (/[\u3040-\u30ff\u3400-\u9fff]\s+[\u3040-\u30ff\u3400-\u9fff]/u.test(entry.s)) {
    warnings.push(entry.k + ": suspicious whitespace in example sentence: " + entry.s);
  }
  if (/[\u3040-\u30ff\u3400-\u9fff]\s+[\u3040-\u30ff\u3400-\u9fff]/u.test(entry.v)) {
    warnings.push(entry.k + ": suspicious whitespace in vocabulary reading/headword: " + entry.v);
  }
  if (/[。！？]\s*—\s*$/.test(entry.s)) warnings.push(entry.k + ": example translation appears empty.");
}
const markedNoKunyomi = entries.filter(entry => entry.kun.trim() === "—").length;
const genericExamples = entries.filter(entry => /という言葉を覚えます/u.test(entry.s)).length;
if (genericExamples > 0) errors.push("Generic template examples remain: " + genericExamples + ".");
const whitespaceExamples = entries.filter(entry => /[\u3040-\u30ff\u3400-\u9fff]\s+[\u3040-\u30ff\u3400-\u9fff]/u.test(entry.s) || /[\u3040-\u30ff\u3400-\u9fff]\s+[\u3040-\u30ff\u3400-\u9fff]/u.test(entry.v)).length;
console.log("Total: " + entries.length + "; unique: " + unique.size + "; N5: " + n5 + "/100; N4: " + n4 + "/200; kunyomi review markers: " + markedNoKunyomi + "; generic examples: " + genericExamples + "; suspicious whitespace examples: " + whitespaceExamples + ".");
if (warnings.length) {
  console.warn("WARN: " + warnings.length + " possible text issue(s):");
  for (const warning of warnings) console.warn(" - " + warning);
}
if (errors.length) {
  console.error("BLOCKED: " + errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: structural data and static UI integration checks passed.");
  console.log("Note: passing structural checks does not establish linguistic accuracy or official JLPT classification.");
}
