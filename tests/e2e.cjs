/*
 * VOLTIS end-to-end test. Plain Node + Playwright (no test runner needed).
 *
 *   py -3 -m http.server 8905 --bind 127.0.0.1     (from the repo root)
 *   NODE_PATH=<dir with playwright> node tests/e2e.cjs
 *
 * Covers every flow, the hidden demo tools (?demo=1), reset, console errors,
 * href="#" checks and the absence of prototype wording on product pages.
 * Console errors from third-party image hosts are reported but not failed,
 * because reference photography is loaded from external CDNs.
 */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://127.0.0.1:8905/";
const ROOT = path.resolve(__dirname, "..");
const results = [];
const consoleErrors = [];
const externalErrors = [];

async function step(name, fn) {
  const started = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - started });
    console.log(`  PASS  ${name}`);
  } catch (error) {
    results.push({ name, ok: false, error });
    console.log(`  FAIL  ${name}\n        ${error.message.split("\n").join("\n        ")}`);
  }
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const where = msg.location().url || "";
    const line = `${page.url()} :: ${msg.text()} ${where}`;
    if (where && !where.startsWith(BASE)) externalErrors.push(line);
    else consoleErrors.push(line);
  });
  page.on("pageerror", (error) => consoleErrors.push(`${page.url()} :: PAGEERROR ${error.message}`));

  const go = (url) => page.goto(BASE + url, { waitUntil: "domcontentloaded" });
  const text = (sel) => page.locator(sel).first().innerText();
  const confirmDialog = async () => {
    await page.waitForSelector(".v-dialog [data-dialog-confirm]");
    await page.click(".v-dialog [data-dialog-confirm]");
  };
  const openDemoTools = async () => {
    await page.waitForSelector("[data-demo-tools]", { state: "attached" });
    await page.evaluate(() => { document.querySelector("[data-demo-tools]").open = true; });
  };
  const failNext = async () => {
    await openDemoTools();
    await page.check("[data-fail-toggle]");
    await page.waitForFunction(() => JSON.parse(sessionStorage.getItem("voltis.demo.v1")).failNext === true);
  };

  /* ---------- static + rendered link hygiene on every page ---------- */
  const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
  await step(`no href="#" in source of ${htmlFiles.length} HTML files`, async () => {
    const offenders = htmlFiles.filter((f) => /href=["']#["']/.test(fs.readFileSync(path.join(ROOT, f), "utf8")));
    assert.deepEqual(offenders, []);
  });

  const renderedPages = [
    "index.html", "vehicles.html", "vehicle.html?id=aero", "compare.html?ids=aero,city", "test-drive.html", "account.html",
    "credits.html", "stories.html", "story.html?id=one-brief", "projects.html", "project.html?id=energy-sites", "resources.html",
    "careers.html", "job.html?id=exterior-designer", "apply.html?job=exterior-designer", "contact.html", "company.html", "gallery.html",
    ...htmlFiles.filter((f) => f.startsWith("figma-"))
  ];
  await step(`no href="#" or empty links after render on ${renderedPages.length} pages`, async () => {
    for (const url of renderedPages) {
      await go(url);
      await page.waitForLoadState("load");
      await page.waitForTimeout(400);
      const bad = await page.$$eval("a", (as) => as.filter((a) => { const h = a.getAttribute("href"); return h === null || h === "" || h === "#" || /^javascript:/i.test(h); }).map((a) => a.outerHTML.slice(0, 80)));
      assert.deepEqual(bad, [], `${url} has dead links`);
    }
  });

  /* ---------- no prototype wording, demo tools hidden unless ?demo=1 ---------- */
  const productPages = renderedPages.filter((u) => !u.startsWith("figma-"));
  const PROTO = /prototype|demo data|sandbox|simulat|fictional|state lab|portfolio review/i;
  await step(`no prototype wording and no demo tools on ${productPages.length} product pages`, async () => {
    await go("index.html");
    await page.evaluate(() => sessionStorage.clear());
    for (const url of productPages) {
      await go(url);
      await page.waitForLoadState("load");
      await page.waitForTimeout(url.startsWith("index") ? 1200 : 600);
      const body = await page.evaluate(() => document.body.innerText);
      const hit = body.match(PROTO);
      assert.equal(hit, null, `${url} shows "${hit && body.slice(Math.max(0, hit.index - 60), hit.index + 60)}"`);
      assert.equal(await page.locator("[data-demo-tools]").count(), 0, `${url} shows demo tools`);
      const title = await page.title();
      assert.doesNotMatch(title, PROTO, `${url} title`);
    }
  });

  await step("demo tools appear with ?demo=1, persist in the tab and turn off with ?demo=0", async () => {
    await go("contact.html?demo=1");
    await page.waitForSelector("[data-demo-tools] > summary");
    assert.ok(await page.locator("[data-demo-tools] > summary").isVisible());
    await go("vehicles.html");
    await page.waitForSelector("[data-demo-tools] > summary");
    await page.click("[data-demo-tools] > summary");
    assert.ok(await page.locator("[data-demo-tools] [data-reset-demo]").isVisible());
    assert.ok(await page.locator("[data-demo-tools] [data-fail-toggle]").isVisible());
    await go("index.html");
    await page.waitForSelector("[data-demo-tools] > summary");
    await go("vehicles.html?demo=0");
    await page.waitForLoadState("load");
    assert.equal(await page.locator("[data-demo-tools]").count(), 0);
  });

  /* ---------- start clean (demo tools on for the rest of the run) ---------- */
  await go("vehicles.html");
  await page.evaluate(() => sessionStorage.clear());
  await go("vehicles.html?demo=1");

  /* ---------- vehicles list ---------- */
  await step("vehicles: loading state then 5 models", async () => {
    await go("vehicles.html");
    await page.waitForSelector(".model-tile");
    assert.equal(await page.locator(".model-tile").count(), 5);
    assert.match(await text("[data-result-count]"), /5 of 5/);
  });

  await step("vehicles: filter by type, range and price, empty state and clear", async () => {
    await page.check('input[name="type"][value="suv"]', { force: true });
    await page.waitForSelector('.model-tile[data-model-id="terrain-xl"]');
    assert.equal(await page.locator(".model-tile").count(), 2);
    await page.selectOption("#f-range", "600");
    await page.waitForFunction(() => document.querySelectorAll(".model-tile").length === 1);
    assert.equal(await page.getAttribute(".model-tile", "data-model-id"), "terrain-xl");
    await page.selectOption("#f-price", "1000");
    await page.waitForSelector('[data-state="empty"]');
    assert.match(page.url(), /type=suv/);
    await page.reload();
    await page.waitForSelector('[data-state="empty"]');
    await page.click("[data-clear-filters]");
    await page.waitForFunction(() => document.querySelectorAll(".model-tile").length === 5);
  });

  await step("vehicles: sort by price ascending puts CITY first", async () => {
    await page.selectOption("#f-sort", "price-asc");
    await page.waitForFunction(() => document.querySelector(".model-tile")?.dataset.modelId === "city");
  });

  await step("compare: select 2 from list, open, add a third, remove one", async () => {
    await page.click('[data-compare-toggle="aero"]');
    await page.waitForSelector("[data-compare-tray]:not([hidden]) .compare-tray__hint");
    await page.click('.model-tile [data-compare-toggle="terrain"]');
    await page.waitForSelector("[data-compare-go]");
    await page.click("[data-compare-go]");
    await page.waitForSelector(".compare-table");
    assert.equal(await page.locator(".compare-table thead th").count(), 3);
    await page.selectOption("#compare-add", "city");
    await page.click('[data-compare-add] button[type="submit"]');
    await page.waitForFunction(() => document.querySelectorAll(".compare-table thead th").length === 4);
    assert.match(page.url(), /ids=aero%2Cterrain%2Ccity|ids=aero,terrain,city/);
    assert.ok(await page.locator(".compare-picker__note").isVisible());
    await page.click('[data-compare-remove="terrain"]');
    await page.waitForFunction(() => document.querySelectorAll(".compare-table thead th").length === 3);
    await page.click('[data-compare-remove="city"]');
    await page.waitForSelector('[data-state="empty"]');
  });

  /* ---------- detail + configurator + garage ---------- */
  await step("vehicle detail: not-found state for unknown id", async () => {
    await go("vehicle.html?id=does-not-exist");
    await page.waitForSelector('[data-state="not-found"]');
    assert.match(await text('[data-state="not-found"] h1'), /could not find/i);
  });

  let savedId = "";
  await step("configurator: live price, save to garage, survives reload", async () => {
    await go("vehicle.html?id=terrain");
    await page.waitForSelector("[data-config-total]");
    assert.equal(await text("[data-config-total]"), "1,490,000,000 VND");
    await page.check('input[name="trimId"][value="adventure"]');
    await page.check('input[name="colourId"][value="sand"]', { force: true });
    await page.check('input[name="batteryId"][value="long"]');
    await page.check('input[name="optionIds"][value="tow"]');
    await page.waitForFunction(() => document.querySelector("[data-config-total]").textContent === "1,910,000,000 VND");
    assert.equal(await text("[data-config-range]"), "590 km");
    await page.fill("#config-name", "Family TERRAIN");
    await page.click("[data-save-config]");
    await page.waitForSelector('[data-state="saved"]');
    savedId = new URL(page.url()).searchParams.get("config");
    assert.match(savedId, /^CFG-/);
    await page.reload();
    await page.waitForSelector("#config-summary-title");
    assert.match(await text("#config-summary-title"), /Editing “Family TERRAIN”/);
    assert.ok(await page.isChecked('input[name="optionIds"][value="tow"]'));
  });

  await step("garage: view, edit (update) and delete a saved build", async () => {
    await go("account.html");
    await page.waitForSelector(`[data-record="${savedId}"]`);
    assert.equal(await page.locator(".record").count(), 2);
    assert.match(await text(`[data-record="${savedId}"] .record__price`), /1,910,000,000 VND/);
    await page.click(`[data-record="${savedId}"] [data-edit-config]`);
    await page.waitForSelector('input[name="optionIds"][value="rails"]');
    await page.check('input[name="optionIds"][value="rails"]');
    await page.click("[data-save-config]");
    await page.waitForSelector('[data-state="saved"]');
    assert.match(await text('[data-state="saved"]'), /Build updated/);
    await go("account.html?tab=garage");
    await page.waitForSelector(`[data-record="${savedId}"]`);
    assert.match(await text(`[data-record="${savedId}"] .record__price`), /1,928,000,000 VND/);
    await page.click(`[data-record="${savedId}"] [data-delete-config]`);
    await confirmDialog();
    await page.waitForSelector(`[data-record="${savedId}"]`, { state: "detached" });
    assert.equal(await page.locator(".record").count(), 1);
  });

  /* ---------- test drive ---------- */
  let bookingRef = "";
  await step("test drive: multi-step booking with taken slots, validation and confirmation", async () => {
    await go("test-drive.html?model=link");
    await page.waitForSelector('[data-step="showroom"]');
    assert.ok(await page.isDisabled('input[name="showroomId"][value="danang"]'), "Da Nang has no LINK on display");
    await page.click('[data-step="showroom"] button[type="submit"]');
    await page.waitForSelector("#showroom-field .field-error");
    await page.check('input[name="showroomId"][value="hanoi"]');
    await page.click('[data-step="showroom"] button[type="submit"]');
    await page.waitForSelector('[data-step="slot"]');
    assert.ok(await page.locator(".date-cell.is-disabled").count() > 0, "closed days are disabled");
    const dates = await page.$$eval("input[data-date-input]:not([disabled])", (els) => els.map((e) => e.value));
    let picked = false;
    for (const date of dates) {
      await page.check(`input[data-date-input][value="${date}"]`, { force: true });
      await page.waitForSelector("#slot-field .slot");
      const taken = await page.locator(".slot.is-disabled").count();
      if (taken > 0) {
        assert.match(await text(".slot.is-disabled small"), /Taken/);
        await page.check('input[name="slot"]:not([disabled])', { force: true });
        picked = true;
        break;
      }
    }
    assert.ok(picked, "found a date with taken slots");
    await page.click('[data-step="slot"] button[type="submit"]');
    await page.waitForSelector('[data-step="details"]');
    await page.click('[data-step="details"] button[type="submit"]');
    await page.waitForSelector(".error-summary");
    assert.equal(await page.locator(".error-summary li").count(), 5);
    await page.fill("#firstName", "Linh");
    await page.fill("#lastName", "Tran");
    await page.fill("#email", "linh@example");
    await page.fill("#phone", "12345");
    await page.check("#licence");
    await page.click('[data-step="details"] button[type="submit"]');
    await page.waitForSelector("#email-error");
    assert.ok(await page.locator("#phone-error").isVisible());
    await page.fill("#email", "linh@example.com");
    await page.fill("#phone", "0912 345 678");
    await page.click('[data-step="details"] button[type="submit"]');
    await page.waitForSelector('[data-step="review"]');
    assert.match(await text(".review-list"), /LINK/);
    assert.match(await text(".notice"), /driving licence/);
    await page.click("[data-confirm-booking]");
    await page.waitForSelector('[data-state="confirmed"]');
    bookingRef = await text("[data-booking-ref]");
    assert.match(bookingRef, /^TD-[A-Z0-9]{6}$/);
    assert.match(await text(".confirmation h2"), /Test drive booked/);
    assert.match(await text(".confirmation .notice"), /emailed the details to linh@example\.com/);
    await page.reload();
    await page.waitForSelector("[data-booking-ref]");
    assert.equal(await text("[data-booking-ref]"), bookingRef);
  });

  await step("test drive: calendar file download", async () => {
    const [download] = await Promise.all([page.waitForEvent("download"), page.click("[data-ics]")]);
    assert.equal(download.suggestedFilename(), `voltis-test-drive-${bookingRef}.ics`);
  });

  await step("my bookings: reschedule then cancel", async () => {
    await go("account.html?tab=bookings");
    await page.waitForSelector(`[data-record="${bookingRef}"]`);
    const before = await text(`[data-record="${bookingRef}"] .record__body p`);
    await page.click(`[data-record="${bookingRef}"] a:has-text("Reschedule")`);
    await page.waitForSelector('[data-step="slot"]');
    await page.click('[data-step="slot"] button[type="submit"]');
    await page.waitForSelector("#slot-field .field-error");
    const dates = await page.$$eval("input[data-date-input]:not([disabled])", (els) => els.map((e) => e.value));
    await page.check(`input[data-date-input][value="${dates[dates.length - 1]}"]`, { force: true });
    await page.waitForSelector("#slot-field .slot");
    await page.check('input[name="slot"]:not([disabled])', { force: true });
    await page.click('[data-step="slot"] button[type="submit"]');
    await page.waitForSelector('[data-step="review"]');
    await page.click("[data-confirm-booking]");
    await page.waitForSelector('[data-state="confirmed"]');
    assert.match(await text(".confirmation h2"), /new time/);
    await go("account.html?tab=bookings");
    await page.waitForSelector(`[data-record="${bookingRef}"]`);
    assert.notEqual(await text(`[data-record="${bookingRef}"] .record__body p`), before);
    assert.match(await text(`[data-record="${bookingRef}"]`), /Rescheduled 1 time/);
    await page.click(`[data-cancel-booking="${bookingRef}"]`);
    await confirmDialog();
    await page.waitForSelector(`[data-record="${bookingRef}"].is-inactive`);
    assert.match(await text(`[data-record="${bookingRef}"] .status-pill`), /Cancelled/i);
    await go(`test-drive.html?reschedule=${bookingRef}`);
    await page.waitForSelector('[data-state="not-found"]');
  });

  /* ---------- stories ---------- */
  await step("stories: category filter, search empty state, detail and not-found", async () => {
    await go("stories.html");
    await page.waitForSelector(".story-card");
    assert.equal(await page.locator(".story-card").count(), 6);
    await page.click('[data-story-filter="energy"]');
    await page.waitForFunction(() => document.querySelectorAll(".story-card").length === 2);
    await page.fill("#story-q", "zzzz");
    await page.waitForSelector('[data-state="empty"]');
    await page.click("[data-clear-stories]");
    await page.waitForFunction(() => document.querySelectorAll(".story-card").length === 6);
    await page.click('.story-card[data-story-id="one-brief"] h3 a');
    await page.waitForSelector(".article-body");
    assert.match(await text("h1"), /One brief, many disciplines/);
    assert.ok(await page.locator(".article-pager a").count() >= 1);
    await go("story.html?id=missing");
    await page.waitForSelector('[data-state="not-found"]');
  });

  /* ---------- projects ---------- */
  await step("projects: layer + status filters, empty state, detail and not-found", async () => {
    await go("projects.html");
    await page.waitForSelector(".project-card");
    assert.equal(await page.locator(".project-card").count(), 5);
    await page.click('[data-project-filter="charging"]');
    await page.waitForFunction(() => document.querySelectorAll(".project-card").length === 2);
    await page.selectOption("[data-project-status]", "research");
    await page.waitForSelector('[data-state="empty"]');
    await page.click("[data-clear-projects]");
    await page.waitForFunction(() => document.querySelectorAll(".project-card").length === 5);
    await page.click('.project-card[data-project-id="fleet-depot"] h3 a');
    await page.waitForSelector(".company-timeline");
    assert.match(await text("h1"), /Fleet Depot/);
    await page.click('a:has-text("Discuss this project")');
    await page.waitForSelector("#message");
    assert.equal(await page.inputValue("#topic"), "Project collaboration");
    assert.match(await page.inputValue("#message"), /Fleet Depot/);
    await go("project.html?id=missing");
    await page.waitForSelector('[data-state="not-found"]');
  });

  /* ---------- resources ---------- */
  await step("resources: search, empty state and two kinds of download", async () => {
    await go("resources.html");
    await page.waitForSelector(".resource-row");
    assert.equal(await page.locator(".resource-row").count(), 7);
    await page.fill("#resource-q", "qqqq");
    await page.waitForSelector('[data-state="empty"]');
    await page.click("[data-clear-resources]");
    await page.fill("#resource-q", "energy");
    await page.click('[data-resource-form] button[type="submit"]');
    await page.waitForSelector('[data-resource-row="energy-architecture"]');
    const [generated] = await Promise.all([page.waitForEvent("download"), page.click('[data-resource-generate="energy-architecture"]')]);
    assert.equal(generated.suggestedFilename(), "voltis-energy-architecture.md");
    const body = fs.readFileSync(await generated.path(), "utf8");
    assert.match(body, /Energy Architecture Overview/);
    await page.fill("#resource-q", "");
    await page.click('[data-resource-filter="source"]');
    await page.waitForSelector('[data-resource-download="image-sources"]');
    const [file] = await Promise.all([page.waitForEvent("download"), page.click('[data-resource-download="image-sources"]')]);
    assert.equal(file.suggestedFilename(), "image-sources.md");
    await page.click('[data-resource-filter="all"]');
    await page.waitForSelector('[data-resource-generate="vehicle-specs"]');
    const [csv] = await Promise.all([page.waitForEvent("download"), page.click('[data-resource-generate="vehicle-specs"]')]);
    assert.match(fs.readFileSync(await csv.path(), "utf8"), /^model,type,seats/);
  });

  /* ---------- careers ---------- */
  let appRef = "";
  await step("careers: filters, empty state and job detail", async () => {
    await go("careers.html");
    await page.waitForSelector(".job-row");
    assert.equal(await page.locator(".job-row").count(), 6);
    await page.selectOption("#job-location", "Da Nang");
    await page.waitForFunction(() => document.querySelectorAll(".job-row").length === 1);
    await page.selectOption("#job-type", "Internship");
    await page.waitForSelector('[data-state="empty"]');
    await page.click("[data-clear-jobs]");
    await page.waitForFunction(() => document.querySelectorAll(".job-row").length === 6);
    await page.click('.job-row[data-job-id="exterior-designer"] h3 a');
    await page.waitForSelector(".job-body");
    assert.match(await text("h1"), /Exterior Designer/);
    await go("job.html?id=nope");
    await page.waitForSelector('[data-state="not-found"]');
  });

  await step("apply: validation, local CV file name, review and confirmation", async () => {
    await go("job.html?id=exterior-designer");
    await page.waitForSelector('a:has-text("Apply for this role")');
    await page.click('a:has-text("Apply for this role")');
    await page.waitForSelector('[data-apply-step="details"]');
    await page.click('[data-apply-step="details"] button[type="submit"]');
    await page.waitForSelector(".error-summary");
    await page.fill("#fullName", "Minh Nguyen");
    await page.fill("#email", "minh@example.com");
    await page.fill("#phone", "+84 912 345 678");
    await page.fill("#city", "Hanoi");
    await page.fill("#link", "not a link");
    await page.click('[data-apply-step="details"] button[type="submit"]');
    await page.waitForSelector("#link-error");
    await page.fill("#link", "https://portfolio.example.com");
    await page.click('[data-apply-step="details"] button[type="submit"]');
    await page.waitForSelector('[data-apply-step="cv"]');
    await page.setInputFiles("#cv", { name: "cv.exe", mimeType: "application/octet-stream", buffer: Buffer.from("x") });
    await page.fill("#motivation", "Too short");
    await page.click('[data-apply-step="cv"] button[type="submit"]');
    await page.waitForSelector("#cv-error");
    assert.match(await text("#cv-error"), /PDF, DOC/);
    assert.ok(await page.locator("#motivation-error").isVisible());
    assert.ok(await page.locator("#consent-error").isVisible());
    await page.setInputFiles("#cv", { name: "Minh-Nguyen-CV.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(2048, 1) });
    await page.fill("#motivation", "I want to shape efficient, calm vehicles and I have six years of surfacing work to show.");
    await page.check("#consent");
    await page.click('[data-apply-step="cv"] button[type="submit"]');
    await page.waitForSelector('[data-apply-step="review"]');
    assert.match(await text(".review-list"), /Minh-Nguyen-CV\.pdf/);
    await page.click("[data-submit-application]");
    await page.waitForSelector('[data-state="confirmed"]');
    appRef = await text("[data-application-ref]");
    assert.match(appRef, /^AP-/);
    assert.match(await text(".confirmation .notice"), /emailed a confirmation to minh@example\.com/);
    await go("apply.html?job=exterior-designer");
    await page.waitForSelector('[data-state="empty"]');
    assert.match(await text('[data-state="empty"] h2'), /already applied/);
  });

  await step("my applications: withdraw", async () => {
    await go("account.html?tab=applications");
    await page.waitForSelector(`[data-record="${appRef}"]`);
    await page.click(`[data-withdraw="${appRef}"]`);
    await confirmDialog();
    await page.waitForSelector(`[data-record="${appRef}"].is-inactive`);
    assert.match(await text(`[data-record="${appRef}"] .status-pill`), /Withdrawn/i);
  });

  /* ---------- contact + simulated failure ---------- */
  await step("contact: validation, failed request with retry, success state", async () => {
    await go("contact.html");
    await page.waitForSelector("[data-contact-form]");
    await page.click('[data-contact-form] button[type="submit"]');
    await page.waitForSelector(".error-summary");
    assert.equal(await page.locator(".error-summary li").count(), 4);
    await page.fill("#name", "An Pham");
    await page.fill("#email", "an@example.com");
    await page.selectOption("#topic", "Partnership");
    await page.fill("#message", "We operate a depot fleet in Da Nang and would like to talk.");
    await page.check("#consent");
    await failNext();
    await page.click('[data-contact-form] button[type="submit"]');
    await page.waitForSelector('[data-form-feedback] [data-state="error"]');
    assert.match(await text('[data-form-feedback] [data-state="error"]'), /nothing was saved/i);
    assert.equal(await page.inputValue("#message"), "We operate a depot fleet in Da Nang and would like to talk.");
    assert.equal(await page.isChecked("[data-fail-toggle]"), false);
    await page.click("[data-form-feedback] [data-retry]");
    await page.waitForSelector('[data-state="confirmed"]');
    assert.match(await text("[data-enquiry-ref]"), /^EN-/);
    assert.match(await text(".confirmation .notice"), /emailed a copy to an@example\.com/);
    await go("account.html?tab=enquiries");
    await page.waitForSelector(".record");
    assert.match(await text(".record"), /Partnership/);
  });

  await step("failure path: list load error shows retry and recovers", async () => {
    await go("vehicles.html");
    await page.waitForSelector(".model-tile");
    await failNext();
    await page.reload();
    await page.waitForSelector('[data-vehicle-grid] [data-state="error"]');
    await page.click("[data-vehicle-grid] [data-retry]");
    await page.waitForSelector(".model-tile");
  });

  await step("failure path: configurator save error is recoverable", async () => {
    await go("vehicle.html?id=city");
    await page.waitForSelector("[data-save-config]");
    await failNext();
    await page.click("[data-save-config]");
    await page.waitForSelector('[data-config-feedback] [data-state="error"]');
    await page.click("[data-config-feedback] [data-retry]");
    await page.waitForSelector('[data-state="saved"]');
  });

  /* ---------- reset ---------- */
  await step("reset demo data restores the seed", async () => {
    await go("account.html");
    await page.waitForSelector(".record");
    assert.equal(await page.locator(".record").count(), 2);
    await openDemoTools();
    await page.click("[data-demo-tools] [data-reset-demo]");
    await confirmDialog();
    await page.waitForLoadState("load");
    await page.waitForSelector(".toast--success");
    await page.waitForSelector(".record");
    assert.equal(await page.locator(".record").count(), 1);
    const state = await page.evaluate(() => JSON.parse(sessionStorage.getItem("voltis.demo.v1")));
    assert.equal(state.bookings.length, 0);
    assert.equal(state.applications.length, 0);
    assert.equal(state.enquiries.length, 0);
    assert.equal(state.garage[0].id, "cfg-sample");
    assert.equal(await text("[data-account-count]"), "1");
  });

  await step("mobile navigation opens and closes at 390px", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go("vehicles.html");
    await page.click("[data-menu-toggle]");
    await page.waitForSelector("[data-mobile-nav].is-open");
    await page.keyboard.press("Escape");
    await page.waitForSelector("[data-mobile-nav]:not(.is-open)", { state: "attached" });
  });

  await step("no local console errors on any visited page", async () => {
    assert.deepEqual(consoleErrors, []);
  });

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (externalErrors.length) console.log(`(${externalErrors.length} console errors from external media hosts ignored)`);
  process.exit(failed.length ? 1 : 0);
})().catch((error) => { console.error(error); process.exit(2); });
