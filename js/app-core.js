/*
 * VOLTIS prototype core: session store, simulated requests, formatting and
 * shared UI (toasts, confirm dialog, page states, form validation, footer
 * prototype controls). Feature scripts use window.Voltis.
 *
 * There is no server. Every "request" resolves locally after a short delay
 * and all user data lives in sessionStorage for the current tab only.
 */
(() => {
  "use strict";

  const DATA = window.VOLTIS_DATA;
  const KEY = "voltis.demo.v1";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  let memoryState = null;
  const listeners = new Set();

  /* ---------- store ---------- */
  function read() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === DATA.seed.version) return parsed;
      }
    } catch (_) {
      if (memoryState) return memoryState;
    }
    const fresh = clone(DATA.seed);
    write(fresh);
    return fresh;
  }

  function write(state) {
    memoryState = state;
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* memory fallback */ }
  }

  function emit() {
    const state = read();
    listeners.forEach((fn) => { try { fn(state); } catch (error) { console.warn(error); } });
  }

  const store = {
    get: () => read(),
    update(mutator) {
      const state = read();
      const result = mutator(state);
      write(state);
      emit();
      return result;
    },
    reset() {
      write(clone(DATA.seed));
      emit();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };

  window.addEventListener("storage", (event) => { if (event.key === KEY) emit(); });

  /* ---------- simulated requests ---------- */
  class RequestError extends Error {
    constructor(message) {
      super(message);
      this.name = "RequestError";
    }
  }

  function request(work, options = {}) {
    const delay = options.delay ?? 450;
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        const state = read();
        if (state.failNext) {
          state.failNext = false;
          write(state);
          emit();
          reject(new RequestError(options.failMessage || "The VOLTIS service did not respond, so nothing was saved. Check your connection and try again."));
          return;
        }
        try {
          resolve(typeof work === "function" ? work() : work);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  /* ---------- formatting ---------- */
  const numberFormat = new Intl.NumberFormat("en-US");
  const fmt = {
    vnd: (value) => `${numberFormat.format(Math.round(value))} VND`,
    vndShort(value) {
      if (value >= 1e9) return `${(value / 1e9).toFixed(2).replace(/\.?0+$/, "")} billion VND`;
      return `${Math.round(value / 1e6)} million VND`;
    },
    km: (value) => `${numberFormat.format(value)} km`,
    date(iso) {
      if (!iso) return "";
      const date = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? parseLocalDate(iso) : new Date(iso);
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    },
    longDate(iso) {
      const date = parseLocalDate(iso);
      return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    },
    dateTime(iso) {
      const date = new Date(iso);
      return `${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
    },
    bytes(size) {
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  function parseLocalDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function isoDate(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  /* ---------- utilities ---------- */
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function reference(prefix) {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    const bytes = new Uint8Array(6);
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    bytes.forEach((b) => { out += alphabet[b % alphabet.length]; });
    return `${prefix}-${out}`;
  }

  function query(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function setQuery(params, { replace = true } = {}) {
    const url = new URL(location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || value === "all") url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    history[replace ? "replaceState" : "pushState"](null, "", url.pathname + url.search + url.hash);
  }

  function download(filename, content, mime = "text/plain") {
    const blob = content instanceof Blob ? content : new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => { URL.revokeObjectURL(url); link.remove(); }, 1000);
  }

  /* ---------- catalogue helpers ---------- */
  const catalogue = {
    vehicle: (id) => DATA.vehicles.find((v) => v.id === id) || null,
    showroom: (id) => DATA.showrooms.find((s) => s.id === id) || null,
    job: (id) => DATA.jobs.find((j) => j.id === id) || null,
    story: (id) => DATA.stories.find((s) => s.id === id) || null,
    project: (id) => DATA.projects.find((p) => p.id === id) || null,
    priceFrom: (vehicle) => Math.min(...vehicle.trims.map((t) => t.price)) + Math.min(...vehicle.batteries.map((b) => b.price)),
    maxRange: (vehicle) => Math.max(...vehicle.batteries.map((b) => b.rangeKm)),
    minRange: (vehicle) => Math.min(...vehicle.batteries.map((b) => b.rangeKm)),
    defaultConfig(vehicle) {
      return { vehicleId: vehicle.id, trimId: vehicle.trims[0].id, colourId: vehicle.colours[0].id, batteryId: vehicle.batteries[0].id, optionIds: [] };
    },
    resolve(config) {
      const vehicle = catalogue.vehicle(config && config.vehicleId);
      if (!vehicle) return null;
      const trim = vehicle.trims.find((t) => t.id === config.trimId) || vehicle.trims[0];
      const colour = vehicle.colours.find((c) => c.id === config.colourId) || vehicle.colours[0];
      const battery = vehicle.batteries.find((b) => b.id === config.batteryId) || vehicle.batteries[0];
      const options = vehicle.options.filter((o) => (config.optionIds || []).includes(o.id));
      const total = trim.price + colour.price + battery.price + options.reduce((sum, o) => sum + o.price, 0);
      return { vehicle, trim, colour, battery, options, total, rangeKm: battery.rangeKm };
    }
  };

  /* ---------- UI: toasts ---------- */
  function toastRegion() {
    let region = document.querySelector("[data-toast-region]");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.dataset.toastRegion = "";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    return region;
  }

  function toast(message, { tone = "info", action = null, timeout = 5200 } = {}) {
    const item = document.createElement("div");
    item.className = `toast toast--${tone}`;
    item.innerHTML = `<p>${esc(message)}</p>${action ? `<a class="toast__action" href="${esc(action.href)}">${esc(action.label)}</a>` : ""}<button type="button" class="toast__close" aria-label="Dismiss notification">Close</button>`;
    item.querySelector(".toast__close").addEventListener("click", () => item.remove());
    toastRegion().appendChild(item);
    window.setTimeout(() => item.remove(), timeout);
    return item;
  }

  /* ---------- UI: confirm dialog ---------- */
  function confirmDialog({ title, body, confirmLabel = "Confirm", cancelLabel = "Keep it", danger = false }) {
    return new Promise((resolve) => {
      const dialog = document.createElement("dialog");
      dialog.className = "v-dialog";
      dialog.setAttribute("aria-labelledby", "v-dialog-title");
      dialog.innerHTML = `
        <form method="dialog" class="v-dialog__body">
          <h2 id="v-dialog-title">${esc(title)}</h2>
          <p>${esc(body)}</p>
          <div class="v-dialog__actions">
            <button class="btn btn--outline-dark" value="cancel" type="submit">${esc(cancelLabel)}</button>
            <button class="btn ${danger ? "btn--danger" : "btn--dark"}" value="confirm" type="submit" data-dialog-confirm>${esc(confirmLabel)}</button>
          </div>
        </form>`;
      document.body.appendChild(dialog);
      dialog.addEventListener("close", () => {
        resolve(dialog.returnValue === "confirm");
        dialog.remove();
      });
      dialog.showModal();
      dialog.querySelector('[value="cancel"]').focus();
    });
  }

  /* ---------- UI: page states ---------- */
  const states = {
    loading(label = "Loading") {
      return `<div class="state-block state-block--loading" role="status" aria-live="polite" data-state="loading"><span class="spinner" aria-hidden="true"></span><p>${esc(label)}…</p></div>`;
    },
    skeleton(count = 3, className = "") {
      return `<div class="skeleton-grid ${className}" role="status" aria-label="Loading" data-state="loading">${Array.from({ length: count }, () => '<div class="skeleton"><span></span><span></span><span></span></div>').join("")}</div>`;
    },
    empty({ title, message, actions = "" }) {
      return `<div class="state-block state-block--empty" data-state="empty"><span class="state-block__index">00 / NOTHING HERE</span><h2>${esc(title)}</h2><p>${esc(message)}</p>${actions ? `<div class="state-block__actions">${actions}</div>` : ""}</div>`;
    },
    error({ title = "Something went wrong", message, retryLabel = "Try again" }) {
      return `<div class="state-block state-block--error" role="alert" data-state="error"><span class="state-block__index">ERROR / RECOVERABLE</span><h2>${esc(title)}</h2><p>${esc(message)}</p><div class="state-block__actions"><button type="button" class="btn btn--dark" data-retry>${esc(retryLabel)}</button></div></div>`;
    },
    notFound({ title, message, actions }) {
      return `<div class="state-block state-block--empty" data-state="not-found"><span class="state-block__index">404 / NOT FOUND</span><h1>${esc(title)}</h1><p>${esc(message)}</p><div class="state-block__actions">${actions}</div></div>`;
    }
  };

  /* Loads data through the simulated request layer and renders loading,
     error (with retry) and success states into a container. */
  function loadInto(container, { work, render, loadingHtml, errorTitle = "This content could not load" }) {
    const run = () => {
      container.setAttribute("aria-busy", "true");
      container.innerHTML = loadingHtml || states.loading();
      return request(work, { delay: 320 }).then((result) => {
        container.removeAttribute("aria-busy");
        render(result);
      }).catch((error) => {
        container.removeAttribute("aria-busy");
        container.innerHTML = states.error({ title: errorTitle, message: error.message });
        container.querySelector("[data-retry]").addEventListener("click", run);
      });
    };
    return run();
  }

  /* ---------- UI: forms ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE = /^(\+84|0)[\s.-]?\d{2,3}([\s.-]?\d{3}){2}\d?$/;

  const validators = {
    required: (value) => (String(value ?? "").trim() ? "" : "This field is required."),
    email: (value) => (!value || EMAIL.test(String(value).trim()) ? "" : "Enter an email address like name@example.com."),
    phone: (value) => (!value || PHONE.test(String(value).replace(/\s+/g, " ").trim()) ? "" : "Enter a Vietnamese phone number, for example 0912 345 678 or +84 912 345 678."),
    minLength: (min) => (value) => (!value || String(value).trim().length >= min ? "" : `Write at least ${min} characters.`),
    checked: (message) => (value) => (value ? "" : message),
    url: (value) => {
      if (!value) return "";
      try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? "" : "Enter a link starting with https://"; } catch (_) { return "Enter a full link starting with https://"; }
    }
  };

  /* rules: { fieldName: [validatorFn, ...] }. Returns true when valid. */
  function validateForm(form, rules, { summary = true } = {}) {
    const errors = [];
    Object.entries(rules).forEach(([name, fns]) => {
      const field = form.elements[name];
      if (!field) return;
      const input = field instanceof RadioNodeList ? field[0] : field;
      const value = field.type === "checkbox" ? field.checked : field.type === "file" ? (field.files && field.files[0]) : field.value;
      let message = "";
      for (const fn of fns) { message = fn(value, field); if (message) break; }
      setFieldError(input, message);
      if (message) errors.push({ input, message, label: labelFor(input) });
    });
    if (summary) renderSummary(form, errors);
    if (errors.length) {
      const target = summary ? form.querySelector(".error-summary") : errors[0].input;
      (target || errors[0].input).focus();
    }
    return errors.length === 0;
  }

  function labelFor(input) {
    const label = input.id && document.querySelector(`label[for="${input.id}"]`);
    return (label ? label.textContent : input.name).replace(/\s*\(optional\)\s*/i, "").trim();
  }

  function setFieldError(input, message) {
    const wrap = input.closest(".field, .check-field, fieldset") || input.parentElement;
    let error = wrap.querySelector(":scope > .field-error");
    if (message) {
      if (!error) {
        error = document.createElement("p");
        error.className = "field-error";
        error.id = `${input.id || input.name}-error`;
        wrap.appendChild(error);
      }
      error.textContent = message;
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", error.id);
    } else {
      if (error) error.remove();
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }

  function renderSummary(form, errors) {
    let box = form.querySelector(".error-summary");
    if (!errors.length) { if (box) box.remove(); return; }
    if (!box) {
      box = document.createElement("div");
      box.className = "error-summary";
      box.setAttribute("role", "alert");
      box.tabIndex = -1;
      form.prepend(box);
    }
    box.innerHTML = `<h3>Check ${errors.length === 1 ? "1 field" : `${errors.length} fields`}</h3><ul>${errors.map((e) => `<li><a href="#${esc(e.input.id)}">${esc(e.label)}: ${esc(e.message)}</a></li>`).join("")}</ul>`;
  }

  function clearErrorsOnInput(form) {
    form.addEventListener("input", (event) => {
      const input = event.target;
      if (input.getAttribute("aria-invalid") === "true") setFieldError(input, "");
    });
    form.addEventListener("change", (event) => {
      const input = event.target;
      if (input.getAttribute("aria-invalid") === "true") setFieldError(input, "");
    });
  }

  function setBusy(button, busy, busyLabel = "Working") {
    if (!button) return;
    if (busy) {
      button.dataset.label = button.innerHTML;
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      button.innerHTML = `<span class="spinner spinner--small" aria-hidden="true"></span>${esc(busyLabel)}…`;
    } else {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      if (button.dataset.label) button.innerHTML = button.dataset.label;
    }
  }

  function inlineError(container, message, onRetry) {
    container.innerHTML = `<div class="inline-alert" role="alert" data-state="error"><div><strong>Request failed.</strong> <span>${esc(message)}</span></div>${onRetry ? '<button type="button" class="btn btn--dark btn--small" data-retry>Try again</button>' : ""}</div>`;
    if (onRetry) container.querySelector("[data-retry]").addEventListener("click", () => { container.innerHTML = ""; onRetry(); });
    container.querySelector(".inline-alert").focus?.();
  }

  /* ---------- chrome: header count, prototype controls ---------- */
  function accountCount(state) {
    return state.garage.length
      + state.bookings.filter((b) => b.status === "requested").length
      + state.applications.filter((a) => a.status === "submitted").length;
  }

  function syncChrome(state) {
    document.querySelectorAll("[data-account-count]").forEach((badge) => {
      const count = accountCount(state);
      badge.textContent = String(count);
      badge.hidden = count === 0;
      badge.setAttribute("aria-label", `${count} saved ${count === 1 ? "item" : "items"}`);
    });
    document.querySelectorAll("[data-fail-toggle]").forEach((toggle) => { toggle.checked = Boolean(state.failNext); });
  }

  function initChrome() {
    syncChrome(read());
    store.subscribe(syncChrome);

    document.querySelectorAll("[data-fail-toggle]").forEach((toggle) => {
      toggle.addEventListener("change", () => {
        store.update((state) => { state.failNext = toggle.checked; });
        toast(toggle.checked ? "The next request will fail so you can see the error state." : "Failure simulation turned off.", { tone: toggle.checked ? "warning" : "info" });
      });
    });

    document.querySelectorAll("[data-reset-demo]").forEach((button) => {
      button.addEventListener("click", async () => {
        const ok = await confirmDialog({
          title: "Reset demo data?",
          body: "This clears saved configurations, bookings, applications and enquiries in this tab and restores the starting data.",
          confirmLabel: "Reset demo data",
          cancelLabel: "Cancel",
          danger: true
        });
        if (!ok) return;
        store.reset();
        try { sessionStorage.setItem("voltis.flash", "Demo data reset. Everything is back to the starting state."); } catch (_) { /* ignore */ }
        location.reload();
      });
    });

    try {
      const flash = sessionStorage.getItem("voltis.flash");
      if (flash) {
        sessionStorage.removeItem("voltis.flash");
        toast(flash, { tone: "success" });
      }
    } catch (_) { /* ignore */ }
  }

  window.Voltis = {
    data: DATA, store, request, RequestError, fmt, esc, reference, query, setQuery, download,
    catalogue, toast, confirm: confirmDialog, states, loadInto, validators, validateForm, setFieldError,
    clearErrorsOnInput, setBusy, inlineError, isoDate, parseLocalDate
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initChrome, { once: true });
  else initChrome();
})();
