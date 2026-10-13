#!/usr/bin/env node
"use strict";

// Real Chromium interaction tests for the Japanese learning page.
// Run after installing Playwright and serving the repository root at http://127.0.0.1:4173.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(8000);
  const stage = name => console.log("BROWSER TEST:", name);
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  try {
    stage("Michishirube homepage and mobile layout");
    await page.goto("http://127.0.0.1:4173/index.html", { waitUntil: "domcontentloaded" });
    assert.match(await page.title(), /Michishirube/);
    assert.equal(await page.locator(".card").count(), 4, "homepage should show four learning cards");
    assert.equal(await page.getByRole("link", { name: /Hiragana & Katakana/ }).getAttribute("href"), "./english-roadmap.html#roadmap-jp");
    assert.equal(await page.getByRole("link", { name: /^Kanji/ }).getAttribute("href"), "./english-roadmap.html#kanji-lab");
    assert.equal(await page.getByRole("link", { name: /Kosakata/ }).getAttribute("href"), "./english-roadmap.html#vocab-lab");
    assert.equal(await page.getByRole("link", { name: /Latihan & Kuis/ }).getAttribute("href"), "./english-roadmap.html#kl-quiz");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false, "homepage should not overflow horizontally at mobile viewport");

    stage("open language learning page");
    await page.goto("http://127.0.0.1:4173/english-roadmap.html", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Japanese/ }).click();
    await page.locator("#vocab-lab").scrollIntoViewIfNeeded();
    await assertEventually(async () => {
      assert.match(await page.locator("#vl-stats").innerText(), /N5 · Hafal 0\/800 kosakata/);
      assert.match(await page.locator("#vl-count").innerText(), /\[N5\] Kartu 1\/800/);
    }, "N5 vocabulary should render");

    stage("vocabulary reveal/next/mark");
    await page.locator("#vl-reveal").click();
    assert.match(await page.locator("#vl-card").innerText(), /Contoh:/);
    await page.locator("#vl-next").click();
    assert.match(await page.locator("#vl-count").innerText(), /Kartu 2\/800/);
    await page.locator("#vl-mark").click();
    assert.match(await page.locator("#vl-stats").innerText(), /Hafal 1\/800 kosakata/);

    await page.locator("#vl-level").selectOption("N4");
    assert.match(await page.locator("#vl-stats").innerText(), /N4 · Hafal 0\/700 kosakata/);
    await page.locator("#vl-search").fill("definitely-no-such-vocabulary");
    assert.match(await page.locator("#vl-card").innerText(), /Kosakata tidak ditemukan/);
    assert.equal(await page.locator("#vl-mark").isDisabled(), true);
    await page.locator("#vl-all").click();
    assert.equal(await page.locator("#vl-search").inputValue(), "");

    stage("vocabulary list and persistence");
    await page.locator("#vl-list-toggle").click();
    await page.locator("#vl-list input[type=checkbox]").first().check();
    assert.ok(await page.evaluate(() => Boolean(localStorage.getItem("sal_vocab_n4_progress_v1"))));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Japanese/ }).click();
    await assertEventually(async () => {
      assert.match(await page.locator("#vl-stats").innerText(), /N5 · Hafal 1\/800 kosakata/);
    }, "N5 progress should persist after reload");
    await page.locator("#vl-level").selectOption("N4");
    assert.match(await page.locator("#vl-stats").innerText(), /N4 · Hafal 1\/700 kosakata/);

    stage("kanji filter and answer");
    await page.locator("#kl-level").selectOption("N5");
    assert.match(await page.locator("#kl-count").innerText(), /Kartu 1\/100/);
    await page.getByRole("button", { name: "Lihat jawaban", exact: true }).last().click();
    assert.match(await page.locator("#kl-card").innerText(), /Onyomi:/);
    await page.getByRole("button", { name: /Tandai hafal/ }).last().click();
    assert.match(await page.locator("#kl-stats").innerText(), /Hafal 1\/300 kanji/);
    assert.ok(await page.evaluate(() => Boolean(localStorage.getItem("sal_kanji_progress"))));
    await page.locator("#kl-search").fill("definitely-no-such-kanji");
    assert.match(await page.locator("#kl-card").innerText(), /Tidak ada hasil/);
    stage("kanji quiz");
    await page.locator("#kl-search").fill("");
    await page.getByRole("button", { name: "Mulai kuis pilihan ganda" }).click();
    assert.equal(await page.locator("#kl-q-options button").count(), 4);
    for (let i = 0; i < 10; i++) {
      await page.locator("#kl-q-options button").first().click();
      assert.equal(await page.locator("#kl-q-next").isDisabled(), false);
      await page.locator("#kl-q-next").click();
    }
    assert.match(await page.locator("#kl-q-question").innerText(), /Kuis selesai!/);

    stage("responsive viewport and JS errors");
    const mobileOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    assert.equal(mobileOverflow, false, "page should not overflow horizontally at 390px viewport");
    await page.setViewportSize({ width: 1440, height: 900 });
    const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert.equal(desktopOverflow, false, "language page should not overflow horizontally at 1440px viewport");
    await page.goto("http://127.0.0.1:4173/index.html", { waitUntil: "domcontentloaded" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false, "homepage should not overflow horizontally at desktop viewport");
    assert.deepEqual(pageErrors, [], "page should not emit uncaught JavaScript errors");
    console.log("PASS: Chromium browser tests (mobile viewport, N5/N4 vocabulary, search/empty state, progress persistence, kanji filtering, quiz flow, no horizontal overflow, no uncaught page errors).");
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

async function assertEventually(fn, message, attempts = 20) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try { await fn(); return; } catch (error) { lastError = error; await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  throw new Error(message + ": " + (lastError ? lastError.message : "condition not met"));
}
