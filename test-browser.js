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
  // Local-only mock session: browser tests never create real Supabase users.
  await page.addInitScript(() => {
    const key = "sb-tckhlrauxlwfyujejeiz-auth-token";
    if (location.pathname.endsWith("/auth.html")) { localStorage.removeItem(key); return; }
    localStorage.setItem(key, JSON.stringify({
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJleHAiOjQxMDAwMDAwMDB9.signature",
      token_type: "bearer", expires_in: 3600, expires_at: 4100000000,
      refresh_token: "local-browser-test-refresh-token",
      user: { id: "local-browser-test-user", aud: "authenticated", role: "authenticated", email: "learner@example.com", app_metadata: { provider: "email", providers: ["email"] }, user_metadata: {} }
    }));
  });
  const stage = name => console.log("BROWSER TEST:", name);
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  try {
    stage("Michishirube homepage and mobile layout");
    await page.goto("http://127.0.0.1:4173/index.html", { waitUntil: "domcontentloaded" });
    assert.match(await page.title(), /Michishirube/);
    assert.equal(await page.locator(".card").count(), 4, "homepage should show four learning cards");
    assert.equal(await page.locator(".hero .actions a.primary").getAttribute("href"), "./japanese-roadmap.html#kana-lab", "top hero button should link directly to the separate kana page");
    assert.equal(await page.locator('.card[href="./japanese-roadmap.html#kanji-lab"]').getAttribute("href"), "./japanese-roadmap.html#kanji-lab");
    assert.equal(await page.locator('.card[href="./japanese-roadmap.html#vocab-lab"]').getAttribute("href"), "./japanese-roadmap.html#vocab-lab");
    assert.equal(await page.locator('.card[href="./quiz.html"]').getAttribute("href"), "./quiz.html");
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
    await page.goto("http://127.0.0.1:4173/auth.html", { waitUntil: "domcontentloaded" });
    assert.match(await page.title(), /Michishirube/);
    assert.doesNotMatch(await page.locator("body").innerText(), /Salman/);
    await page.locator("#registerTab").click();
    assert.equal(await page.locator("#name").isVisible(), true);
    assert.equal(await page.locator("#name").getAttribute("required"), "");
    assert.equal(await page.locator("#password").getAttribute("autocomplete"), "new-password");
    await page.locator("#name").fill("Test Learner");
    await page.locator("#email").fill("learner@example.com");
    await page.locator("#password").fill("safe-test-password");
    assert.equal(await page.locator("#googleLogin").isVisible(), true, "Google OAuth sign-in should be available");
    assert.match(await page.locator(".fine").innerText(), /jangan pernah memasukkan service_role/);
    const authConfig = await page.evaluate(() => window.MICHISHIRUBE_SUPABASE_CONFIG);
    assert.match(authConfig.url, /^https:\/\//, "Supabase project URL should be configured");
    assert.match(authConfig.publishableKey, /^sb_publishable_/, "only a publishable key should be used in the browser");
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
      const offlineShell = await page.evaluate(async () => {
        const [pythonResponse, quizResponse] = await Promise.all([
          fetch("./python-roadmap.html"),
          fetch("./quiz.html")
        ]);
        const [pythonHtml, quizHtml] = await Promise.all([pythonResponse.text(), quizResponse.text()]);
        return {
          pythonOk: pythonResponse.ok,
          pythonContains: /Python Basic|Python/.test(pythonHtml),
          quizOk: quizResponse.ok,
          quizContains: /Pusat Kuis|quiz-picker/.test(quizHtml)
        };
      });
      assert.equal(offlineShell.pythonOk, true, "Python page source should be served by the offline app shell");
      assert.equal(offlineShell.pythonContains, true, "offline app shell should return the cached Python page");
      assert.equal(offlineShell.quizOk, true, "quiz page source should be served by the offline app shell");
      assert.equal(offlineShell.quizContains, true, "offline app shell should return the cached quiz page");
    } finally { await page.context().setOffline(false); }



    stage("homepage Japanese cards route to separate pages");
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "load" });
    await page.getByRole("link", { name: /Belajar Hiragana & Katakana/ }).click();
    await page.waitForURL("**/japanese-roadmap.html#kana-lab");
    await page.waitForFunction(() => document.querySelector("#pane-jp")?.classList.contains("active") && getComputedStyle(document.body).visibility !== "hidden");
    assert.equal(await page.locator("#pane-jp").isVisible(), true, "Japanese page should show the Japanese learning pane");
    assert.equal(await page.locator("#kana-lab").isVisible(), true, "kana deep link should land on its lab");
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "load" });
    await page.locator('a.card[href="./japanese-roadmap.html#kana-lab"]').click();
    await page.waitForURL("**/japanese-roadmap.html#kana-lab");
    await page.waitForFunction(() => document.querySelector("#pane-jp")?.classList.contains("active") && getComputedStyle(document.body).visibility !== "hidden");
    assert.equal(await page.locator("#kana-lab").isVisible(), true, "Kana home card should open the dedicated Japanese page");
    await page.goto("http://127.0.0.1:4173/japanese-roadmap.html#kanji-lab", { waitUntil: "load" });
    assert.equal(await page.locator("#kanji-lab").isVisible(), true, "Kanji deep link should land on the Kanji lab");

    stage("English roadmap is a separate page");
    await page.goto("http://127.0.0.1:4173/english-roadmap.html", { waitUntil: "domcontentloaded" });
    assert.match(await page.title(), /Michishirube.*English Roadmap/);
    assert.equal(await page.locator("#pane-jp").isVisible(), false, "English page must not display Japanese learning content");
    assert.equal(await page.locator(".topbar-title").innerText().then(t => t.includes("道標") && t.includes("Michishirube")), true);
    assert.equal(await page.locator(".topbar-title span").evaluate(el => getComputedStyle(el).display), "block");
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--en").trim()), "#173653");
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--jp").trim()), "#c8434b");
    assert.equal(await page.locator(".back-btn").innerText(), "← Beranda");
    assert.equal(await page.locator(".phase:visible").count(), 5, "English roadmap should render only its own five phases");
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "light");
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()), "#f8f5ed");

    stage("Japanese roadmap has its own visual and learning pane");
    await page.goto("http://127.0.0.1:4173/japanese-roadmap.html", { waitUntil: "domcontentloaded" });
    assert.match(await page.title(), /Michishirube.*Japanese Learning/);
    assert.equal(await page.locator(".topbar-title").innerText().then(t => t.includes("道標") && t.includes("Michishirube")), true);
    assert.equal(await page.locator(".topbar-title span").evaluate(el => getComputedStyle(el).display), "block");
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "light");
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()), "#f8f5ed");
    assert.equal(await page.locator("#jp-hero-title").innerText(), "日本語の学び");
    assert.equal(await page.locator("#pane-jp .jp-hero-art").count(), 1);
    assert.equal(await page.locator("#pane-jp .jp-learning-hub").count(), 1, "Japanese page should show its dedicated learning hub");
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
    await page.locator("#vl-q-mode").selectOption("jp-romaji");
    await page.locator("#vl-q-start").click();
    assert.equal(await page.locator("#vl-q-options button").count(), 4, "kana-to-romaji vocabulary quiz should show four choices");
    await page.locator("#vl-q-options button").first().click();
    assert.match(await page.locator("#vl-q-feedback").innerText(), /Benar!|Belum tepat/);

    stage("vocabulary list and persistence");
    await page.locator("#vl-list-toggle").click();
    await page.locator("#vl-list input[type=checkbox]").first().check();
    assert.ok(await page.evaluate(() => Boolean(localStorage.getItem("sal_vocab_n4_progress_v1"))));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.goto("http://127.0.0.1:4173/japanese-roadmap.html", { waitUntil: "domcontentloaded" });
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
    assert.equal(await page.locator("#kl-all-list").isVisible(), true, "Tampilkan semua should visibly open the complete kanji list");
    assert.equal(await page.locator("#kl-all-list label").count(), 300, "Tampilkan semua should display all 300 kanji");
    assert.equal(await page.locator("#kl-list-toggle").innerText(), "Sembunyikan daftar kanji");
    await page.locator("#kl-list-toggle").click();
    assert.equal(await page.locator("#kl-all-list").isVisible(), false, "kanji checklist should close when toggled");
    await page.locator("#kl-list-toggle").click();
    assert.equal(await page.locator("#kl-all-list").isVisible(), true, "kanji checklist should reopen when toggled");
    assert.equal(await page.locator("#kl-all-list label").count(), 300, "kanji checklist should list all 300 kanji");
    await page.locator("#kl-list-toggle").click();
    stage("dedicated quiz hub routes to Kanji and Kosakata engines");
    await page.goto("http://127.0.0.1:4173/quiz.html", { waitUntil: "domcontentloaded" });
    assert.match(await page.title(), /Pusat Kuis/);
    assert.equal(await page.locator("#quiz-picker .quiz-choice").count(), 2, "quiz hub should have exactly two categories");
    assert.equal(await page.locator("#quiz-kanji").isVisible(), false);
    assert.equal(await page.locator("#quiz-kosakata").isVisible(), false);
    await page.locator('[data-open-quiz="kanji"]').click();
    assert.equal(await page.locator("#quiz-kanji").isVisible(), true, "Kanji choice should open the Kanji quiz panel");
    await page.locator("#kl-q-mode").selectOption("kanji-hira");
    await page.locator("#quiz-kanji-start").click();
    assert.equal(await page.locator("#kl-q-options button").count(), 4, "Kanji quiz should render answer choices from the existing engine");
    await page.locator("#kl-q-options button").first().click();
    assert.equal(await page.locator("#kl-q-next").isDisabled(), false, "Kanji quiz answer should unlock next question");
    await page.locator("#quiz-back-choice").click();
    assert.equal(await page.locator("#quiz-picker").isVisible(), true, "back action should return to the category picker");
    await page.locator('[data-open-quiz="vocab"]').click();
    assert.equal(await page.locator("#quiz-kosakata").isVisible(), true, "Kosakata choice should open the vocabulary quiz panel");
    await page.locator("#vl-level").selectOption("N4");
    await page.locator("#vl-q-mode").selectOption("jp-id");
    await page.locator("#vl-q-start").click();
    assert.equal(await page.locator("#vl-q-options button").count(), 4, "vocabulary quiz should render four answer choices");
    await page.locator("#vl-q-options button").first().click();
    assert.match(await page.locator("#vl-q-feedback").innerText(), /Benar!|Belum tepat/);
    await page.locator("#vl-q-next").click();
    assert.match(await page.locator("#vl-q-count").innerText(), /Soal 2/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false, "quiz hub should not overflow horizontally on mobile");

    await page.goto("http://127.0.0.1:4173/japanese-roadmap.html", { waitUntil: "domcontentloaded" });

    stage("kanji quiz");
    await page.locator("#kl-search").fill("");
    await page.getByRole("button", { name: "Mulai kuis pilihan ganda" }).click();
    await page.locator("#kl-q-mode").selectOption("kanji-hira");
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
