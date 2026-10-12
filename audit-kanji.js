#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const html = fs.readFileSync(path.join(__dirname, "english-roadmap.html"), "utf8");
const start = html.indexOf("const KL_DATA");
const end = html.indexOf("];", start);
if (start < 0 || end < 0) {
  console.error("FAIL: KL_DATA array not found.");
  process.exit(1);
}
const data = html.slice(start, end + 2);
const entries = [];
const pattern = /\{\s*k:\s*"([^"]+)"\s*,\s*l:\s*"(N5|N4)"/g;
for (const match of data.matchAll(pattern)) entries.push({ kanji: match[1], level: match[2] });
const unique = new Set(entries.map(entry => entry.kanji));
const n5 = entries.filter(entry => entry.level === "N5").length;
const n4 = entries.filter(entry => entry.level === "N4").length;
const errors = [];
if (unique.size !== entries.length) errors.push("Duplicate kanji characters detected.");
if (n5 !== 100) errors.push("N5 target is 100; found " + n5 + ".");
if (n4 !== 200) errors.push("N4 target is 200; found " + n4 + ".");
console.log("Total: " + entries.length + "; unique: " + unique.size + "; N5: " + n5 + "/100; N4: " + n4 + "/200.");
if (errors.length) {
  console.error("BLOCKED: " + errors.join(" "));
  process.exitCode = 1;
} else {
  console.log("PASS: kanji inventory targets met.");
}
console.log("Note: inventory checks do not validate linguistic accuracy or official JLPT classification.");
