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
    assert.equal(await page.locator('.card[href="./english-roadmap.html#kanji-lab"]').getAttribute("href"), "./english-roadmap.html#kanji-lab");
    assert.equal(await page.getByRole("link", { name: /Kosakata/ }).getAttribute("href"), "./english-roadmap.html#vocab-lab");
    assert.equal(await page.locator('.card[href="./english-roadmap.html#kl-quiz"]').getAttribute("href"), "./english-roadmap.html#kl-quiz");
    assert.equal(await page.locator("#install-app").isVisible(), true, "PWA install guidance button should be visible");
    await page.locator("#install-app").click();
    assert.equal(await page.locator("#install-help").isVisible(), true, "install instructions should appear when native install prompt is unavailable");
    assert.match(await page.locator("#install-help").innerText(), /Install page as app|Install Michishirube/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false, "homepage should not overflow horizontally at mobile viewport");
    stage("PWA manifest and authentication UI safety");
    const manifest = await page.evaluate(async () => { const href = document.querySelector('link[rel="manifest"]')?.href; const response = await fetch(href); return { ok: response.ok, data: await response.json() }; });
    assert.equal(manifest.ok, true, "PWA manifest should load");
    assert.equal(manifest.data.name, "Michishirube — Japanese Learning Journey");
    assert.equal(manifest.data.start_url, "./index.html");
    const publicConfig = await page.evaluate(async () => {
      const response = await fetch("./supabase-config.js");
      return { ok: response.ok, text: await response.text() };
    });
    assert.equal(publicConfig.ok, true, "Supabase browser config should load");
    assert.match(publicConfig.text, /https:\/\/tckhlrauxlwfyujejeiz\.supabase\.co/);
    assert.match(publicConfig.text, /sb_publishable_/);
    assert.doesNotMatch(publicConfig.text, /(?:["\']?service_role["\']?\s*:|sb_secret_[A-Za-z0-9]+)/i, "server secrets must never be in frontend config");

    // Exercise the safe unconfigured-state UI without starting a real Google OAuth redirect.
    await page.route("**/supabase-config.js", route => route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: 'window.MICHISHIRUBE_SUPABASE_CONFIG = { url: "", publishableKey: "" };'
    }));
    await page.goto("http://127.0.0.1:4173/auth.html", { waitUntil: "domcontentloaded" });
    assert.match(await page.title(), /Michishirube/);
    assert.doesNotMatch(await page.locator("body").innerText(), /Salman/);
    assert.equal(await page.locator("#googleLogin").isVisible(), true, "Google sign-in should be the primary passwordless option");
    assert.match(await page.locator("#googleLogin").innerText(), /Lanjutkan dengan Google/);
    await page.locator("#googleLogin").click();
    await page.waitForFunction(() => /Supabase belum dikonfigurasi|Login Google belum aktif/.test(document.querySelector("#status")?.innerText || ""));
    assert.match(await page.locator("#status").innerText(), /Supabase belum dikonfigurasi|Login Google belum aktif/);
    await page.locator("#registerTab").click();
    assert.equal(await page.locator("#name").isVisible(), true);
    assert.equal(await page.locator("#name").getAttribute("required"), "");
    assert.equal(await page.locator("#password").getAttribute("autocomplete"), "new-password");
    await page.locator("#name").fill("Test Learner");
    await page.locator("#email").fill("learner@example.com");
    await page.locator("#password").fill("safe-test-password");
    await page.locator("#submit").click();
    await page.waitForFunction(() => /Supabase belum dikonfigurasi/.test(document.querySelector("#status")?.innerText || ""));
    assert.match(await page.locator("#status").innerText(), /Supabase belum dikonfigurasi/);
    assert.match(await page.locator(".fine").innerText(), /Michishirube tidak menerima atau menyimpan kata sandi Google/);
    await page.locator("#loginTab").click();
    assert.equal(await page.locator("#name").isVisible(), false);
    assert.equal(await page.locator("#password").getAttribute("autocomplete"), "current-password");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false, "auth page should not overflow horizontally at mobile viewport");
    stage("service worker offline app shell");
    await page.goto("http://127.0.0.1:4173/index.html", { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => { await navigator.serviceWorker.register("./sw.js"); await navigator.serviceWorker.ready; });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await page.context().setOffline(true);
    try {
      await page.goto("http://127.0.0.1:4173/python-roadmap.html", { waitUntil: "domcontentloaded" });
      assert.match(await page.locator("body").innerText(), /Python Basic|Python/, "Python roadmap should be available from the offline app shell");
    } finally { await page.context().setOffline(false); }



    stage("Michishirube English/Japanese redesign and light theme");
    await page.goto("http://127.0.0.1:4173/english-roadmap.html", { waitUntil: "domcontentloaded" });
    assert.match(await page.title(), /Michishirube.*Language Learning/);
    assert.equal(await page.locator(".topbar-title").innerText().then(t => t.includes("道標") && t.includes("Michishirube")), true);
    assert.equal(await page.locator(".topbar-title span").evaluate(el => getComputedStyle(el).display), "block", "Japanese 道標 wordmark should sit above Michishirube");
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--en").trim()), "#173653", "English accent should use Michishirube midnight navy, not green");
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--jp").trim()), "#c8434b", "Japanese accent should use Michishirube vermilion");
    assert.equal(await page.locator(".back-btn").innerText(), "← Beranda");
    assert.equal(await page.locator(".phase").count(), 13, "English and Japanese learning roadmap phases should render");
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "light", "language page should default to light theme regardless of OS theme");
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()), "#f8f5ed", "language page should use Michishirube ivory palette");
    assert.equal(await page.locator(".dp-card").first().evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 253, 248)", "progress cards should use warm light surfaces");
    await page.getByRole("button", { name: /Japanese/ }).click();
    await page.locator("#pane-jp").waitFor({ state: "visible" });
    assert.equal(await page.locator("#jp-hero-title").innerText(), "日本語の学び", "Japanese tab should show its dedicated redesigned learning hero");
    assert.equal(await page.locator("#pane-jp .jp-hero-art").count(), 1, "Japanese tab should show the Japanese landscape artwork");
    assert.equal(await page.locator("#pane-jp .jp-section-heading").innerText().then(t => t.includes("Jalur Belajar")), true, "Japanese roadmap should have its own section heading");
    stage("Hiragana/Katakana lab and kana quiz regression");
    await page.locator("#kana-lab").waitFor({ state: "attached" });
    assert.match(await page.locator("#klab-stats").innerText(), /kana/i);
    await page.locator("#klab-script").selectOption("K");
    assert.match(await page.locator("#klab-card").innerText(), /KATAKANA/);
    await page.locator("#klab-romaji-toggle").click();
    assert.match(await page.locator("#klab-romaji-toggle").innerText(), /Tampilkan romaji/);
    await page.locator("#klab-show-all").click();
    assert.equal(await page.locator("#klab-list").isVisible(), true, "show-all should reveal the kana reference grid");
    assert.ok(await page.locator("#klab-list .klab-cell").count() >= 50, "kana reference grid should include many kana entries");
    await page.locator("#klab-q-mode").selectOption("mixed");
    await page.locator("#klab-q-start").click();
    assert.equal(await page.locator("#klab-q-options button").count(), 4, "kana quiz should show four choices");
    await page.locator("#klab-q-options button").first().click();
    await page.locator("#klab-q-next").click();
    assert.match(await page.locator("#klab-q-count").innerText(), /Soal 2/);
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
    await page.locator("#vl-unlearned").click();
    assert.match(await page.locator("#vl-count").innerText(), /Kartu 1\/700/);
    await page.locator("#vl-all").click();
    assert.match(await page.locator("#vl-count").innerText(), /Kartu 1\/700/);

    stage("vocabulary quiz modes regression");
    await page.locator("#vl-q-mode").selectOption("jp-id");
    await page.locator("#vl-q-start").click();
    assert.equal(await page.locator("#vl-q-options button").count(), 4, "vocabulary quiz should show four choices");
    await page.locator("#vl-q-options button").first().click();
    assert.match(await page.locator("#vl-q-feedback").innerText(), /Benar!|Belum tepat/);
    await page.locator("#vl-q-next").click();
    assert.match(await page.locator("#vl-q-count").innerText(), /Soal 2/);

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

    stage("combined N5 + N4 vocabulary list");
    await page.locator("#vl-all-levels").click();
    assert.equal(await page.locator("#vl-list label").count(), 1500, "combined vocabulary list should include 800 N5 and 700 N4 words");
    assert.equal(await page.locator("#vl-list").isVisible(), true);
    await page.locator("#vl-all-levels").click();
    assert.equal(await page.locator("#vl-list label").count(), 700, "switching back should show the selected level only");

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
    await page.locator("#kl-search").fill("");
    await page.locator("#kanji-lab").getByRole("button", { name: "Belum hafal", exact: true }).click();
    assert.match(await page.locator("#kl-count").innerText(), /Kartu 1\/99/);
    await page.locator("#kanji-lab").getByRole("button", { name: "Tampilkan semua", exact: true }).click();
    assert.equal(await page.locator("#kl-level").inputValue(), "ALL", "Tampilkan semua should reset the level filter");
    assert.match(await page.locator("#kl-count").innerText(), /Kartu 1\/300/);
    await page.locator("#kl-list-toggle").click();
    assert.equal(await page.locator("#kl-all-list").isVisible(), true, "kanji checklist should open");
    assert.equal(await page.locator("#kl-all-list label").count(), 300, "kanji checklist should list all 300 kanji");
    await page.locator("#kl-list-toggle").click();
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
