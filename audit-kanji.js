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
if (entries.length === 0) errors.push("No kanji entries parsed; check data format.");
if (unique.size !== entries.length) errors.push("Duplicate kanji characters detected.");
if (n5 !== 100) errors.push("N5 target is 100; found " + n5 + ".");
if (n4 !== 200) errors.push("N4 target is 200; found " + n4 + ".");
for (const entry of entries) {
  for (const field of ["m", "on", "v", "s"]) {
    if (!entry[field].trim()) errors.push(entry.k + " (" + entry.l + "): required field " + field + " is empty.");
  }
  if (/\s[一-龯]|[一-龯]\s[一-龯]|[ぁ-んァ-ン]\s+[ぁ-んァ-ン]/u.test(entry.s)) {
    warnings.push(entry.k + ": suspicious whitespace in example sentence: " + entry.s);
  }
  if (/[。！？]\s*—\s*$/.test(entry.s)) warnings.push(entry.k + ": example translation appears empty.");
}
console.log("Total: " + entries.length + "; unique: " + unique.size + "; N5: " + n5 + "/100; N4: " + n4 + "/200.");
if (warnings.length) {
  console.warn("WARN: " + warnings.length + " possible text issue(s):");
  for (const warning of warnings) console.warn(" - " + warning);
}
if (errors.length) {
  console.error("BLOCKED: " + errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: structural checks passed.");
  console.log("Note: passing structural checks does not establish linguistic accuracy or official JLPT classification.");
}
