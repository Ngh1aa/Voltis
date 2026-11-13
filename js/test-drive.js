/* VOLTIS test drive: multi-step booking, reschedule, confirmation. */
(() => {
  "use strict";

  const V = window.Voltis;
  const { esc, fmt, catalogue, states } = V;
  if (document.body.dataset.page !== "test-drive") return;

  const root = document.querySelector("[data-booking-root]");
  if (!root) return;

  const STEP_LABELS = { model: "Model", showroom: "Studio", slot: "Date and time", details: "Your details", review: "Review" };
  const DAYS_AHEAD = 14;

  /* ---------- availability ---------- */
  function hash(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }

  function upcomingDates() {
    const out = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 1; i <= DAYS_AHEAD; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(d);
    }
    return out;
  }

  function slotStatus(showroomId, date, slot, ignoreRef) {
    const mine = V.store.get().bookings.some((b) => b.status === "requested" && b.ref !== ignoreRef && b.showroomId === showroomId && b.date === date && b.slot === slot);
    if (mine) return "yours";
    return hash(`${showroomId}|${date}|${slot}`) % 10 < 4 ? "taken" : "open";
  }

  function dayStatus(showroomId, date, ignoreRef) {
    const day = V.parseLocalDate(date).getDay();
    if (day === 1) return "closed";
    const open = V.data.slots.some((s) => slotStatus(showroomId, date, s, ignoreRef) === "open");
    return open ? "open" : "full";
  }

  /* ---------- draft ---------- */
  function loadDraft() {
    return V.store.get().drafts.testDrive || null;
  }
  function saveDraft(draft) {
    V.store.update((s) => { s.drafts.testDrive = draft; });
  }
  function clearDraft() {
    V.store.update((s) => { delete s.drafts.testDrive; });
  }
  function newDraft(modelId) {
    return { mode: "new", step: modelId ? "showroom" : "model", modelId: modelId || "", showroomId: "", date: "", slot: "", contact: { firstName: "", lastName: "", email: "", phone: "", licence: false, notes: "" } };
  }

  let draft = null;

  function steps() {
    return draft.mode === "reschedule" ? ["slot", "review"] : ["model", "showroom", "slot", "details", "review"];
  }

  /* ---------- boot ---------- */
  function boot() {
    const confirmed = V.query("confirmed");
    const rescheduleRef = V.query("reschedule");
    const modelParam = V.query("model");

    if (confirmed) {
      const booking = V.store.get().bookings.find((b) => b.ref === confirmed);
      if (booking) return renderConfirmation(booking, false);
      V.setQuery({ confirmed: null });
    }

    if (rescheduleRef) {
      const booking = V.store.get().bookings.find((b) => b.ref === rescheduleRef);
      if (!booking || booking.status !== "requested") {
        root.innerHTML = states.notFound({
          title: booking ? "This booking was cancelled." : "We could not find that booking.",
          message: booking ? `Booking ${rescheduleRef} is cancelled, so it cannot be rescheduled. You can request a new test drive instead.` : `There is no active booking with reference ${rescheduleRef}.`,
          actions: '<a class="btn btn--dark" href="./account.html?tab=bookings">Go to My bookings</a><a class="btn btn--outline-dark" href="./test-drive.html">Book a new test drive</a>'
        });
        return;
      }
      const existing = loadDraft();
      draft = existing && existing.mode === "reschedule" && existing.ref === booking.ref
        ? existing
        : { mode: "reschedule", ref: booking.ref, step: "slot", modelId: booking.modelId, showroomId: booking.showroomId, date: booking.date, slot: booking.slot, original: { date: booking.date, slot: booking.slot }, contact: { ...booking.contact } };
      saveDraft(draft);
      return render();
    }

    const existing = loadDraft();
    if (modelParam && !catalogue.vehicle(modelParam)) {
      V.toast(`“${modelParam}” is not a VOLTIS model. Choose one from the list.`, { tone: "warning" });
    }
    const validModel = catalogue.vehicle(modelParam) ? modelParam : "";
    if (existing && existing.mode === "new" && (!validModel || existing.modelId === validModel)) {
      draft = existing;
    } else {
      draft = newDraft(validModel);
    }
    if (draft.mode === "new" && V.query("reschedule") === null) V.setQuery({ model: null });
    saveDraft(draft);
    render();
  }

  /* ---------- render ---------- */
  function stepper() {
    const list = steps();
    const currentIndex = list.indexOf(draft.step);
    return `<ol class="stepper" aria-label="Booking progress">${list.map((step, i) => {
      const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "todo";
      const label = `<span class="stepper__index">${String(i + 1).padStart(2, "0")}</span><span class="stepper__label">${STEP_LABELS[step]}</span>`;
      return `<li class="stepper__item is-${state}">${state === "done" ? `<button type="button" data-goto="${step}" aria-label="Back to ${STEP_LABELS[step]}">${label}</button>` : `<span ${state === "current" ? 'aria-current="step"' : ""}>${label}</span>`}</li>`;
    }).join("")}</ol>`;
  }

  function nav({ back = true, next = "Continue", nextAttr = "" } = {}) {
    const list = steps();
    const first = list.indexOf(draft.step) === 0;
    return `<div class="wizard-nav">
      ${back && !first ? '<button type="button" class="btn btn--outline-dark" data-back>Back</button>' : draft.mode === "reschedule" ? '<a class="btn btn--outline-dark" href="./account.html?tab=bookings">Back to My bookings</a>' : '<a class="btn btn--outline-dark" href="./vehicles.html">Back to vehicles</a>'}
      <button type="submit" class="btn btn--dark" ${nextAttr}>${next}</button>
    </div>`;
  }

  function render() {
    saveDraft(draft);
    const title = draft.mode === "reschedule" ? `Reschedule booking ${esc(draft.ref)}` : "Book a test drive";
    const body = {
      model: stepModel,
      showroom: stepShowroom,
      slot: stepSlot,
      details: stepDetails,
      review: stepReview
    }[draft.step]();
    root.innerHTML = `
      <div class="wizard">
        ${draft.mode === "reschedule" ? `<div class="wizard__head"><span class="eyebrow">RESCHEDULE</span><h2>${title}</h2></div>` : `<h2 class="visually-hidden">${title}</h2>`}
        ${stepper()}
        <form class="wizard__panel" data-step="${draft.step}" novalidate>
          ${body}
        </form>
      </div>`;
    const form = root.querySelector("form");
    V.clearErrorsOnInput(form);
    const heading = form.querySelector("h3");
    if (heading && document.activeElement && document.activeElement !== document.body) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }

  function stepModel() {
    return `
      <h3>Which model would you like to drive?</h3>
      <fieldset class="choice-group" id="model-field"><legend class="visually-hidden">Model</legend>
        <div class="pick-grid">
          ${V.data.vehicles.map((v) => `
            <label class="pick-card">
              <input type="radio" name="modelId" value="${esc(v.id)}" ${draft.modelId === v.id ? "checked" : ""} ${v.id === V.data.vehicles[0].id ? 'id="modelId"' : ""}>
              <span class="pick-card__media"><img src="${esc(v.image)}" alt="" loading="lazy" referrerpolicy="no-referrer"></span>
              <span class="pick-card__body"><strong>${esc(v.name)}</strong><small>${esc(v.typeLabel)}, ${v.seats} seats</small></span>
            </label>`).join("")}
        </div>
      </fieldset>
      ${nav()}`;
  }

  function stepShowroom() {
    const vehicle = catalogue.vehicle(draft.modelId);
    return `
      <h3>Choose a VOLTIS studio</h3>
      <p class="wizard__lead">Showing availability for <strong>${esc(vehicle.name)}</strong>. Studios are open Tuesday to Sunday.</p>
      <fieldset class="choice-group" id="showroom-field"><legend class="visually-hidden">Studio</legend>
        ${V.data.showrooms.map((s, i) => {
          const available = s.models.includes(vehicle.id);
          return `
          <label class="choice ${available ? "" : "is-disabled"}">
            <input type="radio" name="showroomId" value="${esc(s.id)}" ${draft.showroomId === s.id ? "checked" : ""} ${available ? "" : "disabled"} ${i === 0 ? 'id="showroomId"' : ""}>
            <span class="choice__body"><strong>${esc(s.name)}</strong><small>${esc(s.address)}. ${esc(s.hours)}.</small>${available ? "" : `<small class="choice__reason">${esc(vehicle.name)} is not on display at this studio.</small>`}</span>
            <span class="choice__price">${esc(s.city)}</span>
          </label>`;
        }).join("")}
      </fieldset>
      ${nav()}`;
  }

  function stepSlot() {
    const showroom = catalogue.showroom(draft.showroomId);
    const ignore = draft.mode === "reschedule" ? draft.ref : null;
    const dates = upcomingDates().map(V.isoDate);
    if (draft.date && (!dates.includes(draft.date) || dayStatus(showroom.id, draft.date, ignore) !== "open")) {
      draft.date = "";
      draft.slot = "";
    }
    const dayLabel = (iso) => {
      const d = V.parseLocalDate(iso);
      return { dow: d.toLocaleDateString("en-GB", { weekday: "short" }), day: d.getDate(), month: d.toLocaleDateString("en-GB", { month: "short" }) };
    };
    const slotsHtml = draft.date ? `
      <fieldset class="choice-group" id="slot-field"><legend>Available times on ${esc(fmt.longDate(draft.date))}</legend>
        <div class="slot-grid">
          ${V.data.slots.map((slot, i) => {
            const status = slotStatus(showroom.id, draft.date, slot, ignore);
            const disabled = status !== "open";
            return `<label class="slot ${disabled ? "is-disabled" : ""}">
              <input type="radio" name="slot" value="${slot}" ${draft.slot === slot && !disabled ? "checked" : ""} ${disabled ? "disabled" : ""} ${i === 0 ? 'id="slot"' : ""}>
              <span>${slot}</span><small>${status === "taken" ? "Taken" : status === "yours" ? "Your other booking" : "45 min"}</small>
            </label>`;
          }).join("")}
        </div>
      </fieldset>` : '<p class="wizard__hint" id="slot-field">Choose a date to see available times.</p>';

    return `
      <h3>Pick a date and time</h3>
      <p class="wizard__lead">${esc(showroom.name)}. Closed on Mondays. Taken times cannot be selected.${draft.mode === "reschedule" ? ` Current booking: <strong>${esc(fmt.longDate(draft.original.date))} at ${esc(draft.original.slot)}</strong>.` : ""}</p>
      <fieldset class="choice-group" id="date-field"><legend>Date</legend>
        <div class="date-grid">
          ${dates.map((iso, i) => {
            const status = dayStatus(showroom.id, iso, ignore);
            const l = dayLabel(iso);
            const disabled = status !== "open";
            return `<label class="date-cell ${disabled ? "is-disabled" : ""}">
              <input type="radio" name="date" value="${iso}" ${draft.date === iso ? "checked" : ""} ${disabled ? "disabled" : ""} ${i === 0 ? 'id="date"' : ""} data-date-input>
              <span class="date-cell__dow">${l.dow}</span><strong>${l.day}</strong><span class="date-cell__month">${l.month}</span>
              ${disabled ? `<small>${status === "closed" ? "Closed" : "Full"}</small>` : ""}
            </label>`;
          }).join("")}
        </div>
      </fieldset>
      <div data-slot-area>${slotsHtml}</div>
      ${nav()}`;
  }

  function stepDetails() {
    const c = draft.contact;
    return `
      <h3>Your details</h3>
      <p class="wizard__lead">Your studio uses these details to confirm the booking and reach you if anything changes.</p>
      <div class="form-grid">
        <div class="field"><label for="firstName">First name</label><input id="firstName" name="firstName" autocomplete="given-name" value="${esc(c.firstName)}"></div>
        <div class="field"><label for="lastName">Last name</label><input id="lastName" name="lastName" autocomplete="family-name" value="${esc(c.lastName)}"></div>
      </div>
      <div class="form-grid">
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" value="${esc(c.email)}"></div>
        <div class="field"><label for="phone">Mobile phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="0912 345 678" value="${esc(c.phone)}"></div>
      </div>
      <div class="field"><label for="notes">Anything we should know? (optional)</label><textarea id="notes" name="notes" maxlength="400" rows="3">${esc(c.notes)}</textarea></div>
      <div class="check-field"><input id="licence" name="licence" type="checkbox" ${c.licence ? "checked" : ""}><label for="licence">I hold a valid driving licence and will bring it to the test drive.</label></div>
      ${nav()}`;
  }

  function stepReview() {
    const vehicle = catalogue.vehicle(draft.modelId);
    const showroom = catalogue.showroom(draft.showroomId);
    const c = draft.contact;
    const change = (step) => (steps().includes(step) ? `<button type="button" class="text-link text-link--button" data-goto="${step}">Change</button>` : "");
    return `
      <h3>Review your request</h3>
      <dl class="review-list">
        <div><dt>Model</dt><dd>${esc(vehicle.name)}, ${esc(vehicle.typeLabel)}</dd><dd>${change("model")}</dd></div>
        <div><dt>Studio</dt><dd>${esc(showroom.name)}<br><small>${esc(showroom.address)}</small></dd><dd>${change("showroom")}</dd></div>
        <div><dt>Date and time</dt><dd>${esc(fmt.longDate(draft.date))} at ${esc(draft.slot)}${draft.mode === "reschedule" ? `<br><small>Was ${esc(fmt.longDate(draft.original.date))} at ${esc(draft.original.slot)}</small>` : ""}</dd><dd>${change("slot")}</dd></div>
        <div><dt>Contact</dt><dd>${esc(c.firstName)} ${esc(c.lastName)}<br><small>${esc(c.email)}, ${esc(c.phone)}</small>${c.notes ? `<br><small>Note: ${esc(c.notes)}</small>` : ""}</dd><dd>${change("details")}</dd></div>
      </dl>
      <div class="notice">Test drives last about 45 minutes, including a short walk-through. Bring your driving licence. You can reschedule or cancel at any time from My bookings.</div>
      <div data-submit-feedback></div>
      ${nav({ next: draft.mode === "reschedule" ? "Confirm new time" : "Confirm request", nextAttr: "data-confirm-booking" })}`;
  }

  /* ---------- confirmation ---------- */
  function renderConfirmation(booking, rescheduled) {
    const vehicle = catalogue.vehicle(booking.modelId);
    const showroom = catalogue.showroom(booking.showroomId);
    root.innerHTML = `
      <div class="confirmation" data-state="confirmed" tabindex="-1">
        <span class="eyebrow">${rescheduled ? "RESCHEDULED" : "BOOKING CONFIRMED"}</span>
        <h2>${rescheduled ? "Your test drive is moved to the new time." : "Test drive booked."}</h2>
        <p class="confirmation__ref">Reference <strong data-booking-ref>${esc(booking.ref)}</strong></p>
        <dl class="review-list">
          <div><dt>Model</dt><dd>${esc(vehicle.name)}</dd></div>
          <div><dt>Studio</dt><dd>${esc(showroom.name)}</dd></div>
          <div><dt>Date and time</dt><dd>${esc(fmt.longDate(booking.date))} at ${esc(booking.slot)}</dd></div>
          <div><dt>Contact</dt><dd>${esc(booking.contact.firstName)} ${esc(booking.contact.lastName)}, ${esc(booking.contact.email)}</dd></div>
        </dl>
        <div class="notice">We've emailed the details to <strong>${esc(booking.contact.email)}</strong>. ${esc(showroom.name)} will call ${esc(booking.contact.phone)} the day before to confirm.</div>
        <div class="confirmation__actions">
          <a class="btn btn--dark" href="./account.html?tab=bookings">View My bookings</a>
          <button type="button" class="btn btn--outline-dark" data-ics>Download calendar file</button>
          <a class="btn btn--outline-dark" href="./vehicle.html?id=${esc(vehicle.id)}#configure">Configure ${esc(vehicle.name)}</a>
        </div>
      </div>`;
    root.querySelector("[data-ics]").addEventListener("click", () => downloadIcs(booking));
    root.querySelector(".confirmation").focus();
  }

  function downloadIcs(booking) {
    const vehicle = catalogue.vehicle(booking.modelId);
    const showroom = catalogue.showroom(booking.showroomId);
    const [h, m] = booking.slot.split(":");
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//VOLTIS//Test Drive//EN", "BEGIN:VEVENT",
      `UID:${booking.ref}@voltis.vn`, `DTSTAMP:${stamp}`,
      `DTSTART:${booking.date.replace(/-/g, "")}T${h}${m}00`, "DURATION:PT45M",
      `SUMMARY:VOLTIS ${vehicle.name} test drive`,
      `LOCATION:${showroom.name}\\, ${showroom.address.replace(/,/g, "\\,")}`,
      `DESCRIPTION:Reference ${booking.ref}. Bring your driving licence. Reschedule or cancel from My VOLTIS.`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    V.download(`voltis-test-drive-${booking.ref}.ics`, ics, "text/calendar");
    V.toast("Calendar file downloaded.", { tone: "success" });
  }

  /* ---------- events ---------- */
  function go(step) {
    draft.step = step;
    render();
  }

  function stepIndex(delta) {
    const list = steps();
    return list[list.indexOf(draft.step) + delta];
  }

  root.addEventListener("click", (event) => {
    const goto = event.target.closest("[data-goto]");
    if (goto) { go(goto.dataset.goto); return; }
    if (event.target.closest("[data-back]")) go(stepIndex(-1));
  });

  root.addEventListener("change", (event) => {
    if (!draft) return;
    const input = event.target;
    if (input.matches("[data-date-input]")) {
      draft.date = input.value;
      draft.slot = "";
      saveDraft(draft);
      const showroomStep = stepSlot();
      const tmp = document.createElement("div");
      tmp.innerHTML = showroomStep;
      root.querySelector("[data-slot-area]").innerHTML = tmp.querySelector("[data-slot-area]").innerHTML;
      const error = root.querySelector("#date-field .field-error");
      if (error) error.remove();
      root.querySelector(".error-summary")?.remove();
    }
    if (input.name === "slot") {
      draft.slot = input.value;
      saveDraft(draft);
      root.querySelector("#slot-field .field-error")?.remove();
    }
  });

  function groupError(fieldsetId, message) {
    const fieldset = root.querySelector(`#${fieldsetId}`);
    fieldset.querySelector(":scope > .field-error")?.remove();
    if (!message) return;
    const p = document.createElement("p");
    p.className = "field-error";
    p.setAttribute("role", "alert");
    p.textContent = message;
    fieldset.appendChild(p);
    const first = fieldset.querySelector("input:not([disabled])");
    if (first) first.focus();
  }

  root.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const step = draft.step;

    if (step === "model") {
      const value = form.elements.modelId.value;
      if (!value) return groupError("model-field", "Choose a model to continue.");
      if (value !== draft.modelId) {
        draft.modelId = value;
        const showroom = catalogue.showroom(draft.showroomId);
        if (showroom && !showroom.models.includes(value)) { draft.showroomId = ""; draft.date = ""; draft.slot = ""; }
      }
      return go(stepIndex(1));
    }

    if (step === "showroom") {
      const value = form.elements.showroomId.value;
      if (!value) return groupError("showroom-field", "Choose a studio to continue.");
      if (value !== draft.showroomId) { draft.date = ""; draft.slot = ""; }
      draft.showroomId = value;
      return go(stepIndex(1));
    }

    if (step === "slot") {
      if (!draft.date) return groupError("date-field", "Choose a date to continue.");
      const ignore = draft.mode === "reschedule" ? draft.ref : null;
      if (!draft.slot || slotStatus(draft.showroomId, draft.date, draft.slot, ignore) !== "open") {
        draft.slot = "";
        return groupError("slot-field", "Choose an available time. Taken times cannot be booked.");
      }
      if (draft.mode === "reschedule" && draft.date === draft.original.date && draft.slot === draft.original.slot) {
        return groupError("slot-field", "This is your current time. Choose a different date or time to reschedule.");
      }
      return go(stepIndex(1));
    }

    if (step === "details") {
      const ok = V.validateForm(form, {
        firstName: [V.validators.required],
        lastName: [V.validators.required],
        email: [V.validators.required, V.validators.email],
        phone: [V.validators.required, V.validators.phone],
        licence: [V.validators.checked("Confirm that you hold a valid driving licence.")]
      });
      const c = draft.contact;
      c.firstName = form.elements.firstName.value.trim();
      c.lastName = form.elements.lastName.value.trim();
      c.email = form.elements.email.value.trim();
      c.phone = form.elements.phone.value.trim();
      c.notes = form.elements.notes.value.trim();
      c.licence = form.elements.licence.checked;
      saveDraft(draft);
      if (!ok) return;
      return go(stepIndex(1));
    }

    if (step === "review") {
      const button = form.querySelector("[data-confirm-booking]");
      const feedback = form.querySelector("[data-submit-feedback]");
      feedback.innerHTML = "";
      V.setBusy(button, true, "Confirming");
      try {
        const booking = await V.request(() => V.store.update((s) => {
          const clash = s.bookings.some((b) => b.status === "requested" && b.ref !== draft.ref && b.showroomId === draft.showroomId && b.date === draft.date && b.slot === draft.slot);
          if (clash) throw new Error("That time was just taken by another of your bookings. Go back and choose another time.");
          const now = new Date().toISOString();
          if (draft.mode === "reschedule") {
            const target = s.bookings.find((b) => b.ref === draft.ref);
            if (!target || target.status !== "requested") throw new Error("This booking is no longer active, so it cannot be rescheduled.");
            target.history = [...(target.history || []), { date: target.date, slot: target.slot, changedAt: now }];
            target.date = draft.date;
            target.slot = draft.slot;
            target.updatedAt = now;
            return { ...target };
          }
          const entry = { ref: V.reference("TD"), status: "requested", modelId: draft.modelId, showroomId: draft.showroomId, date: draft.date, slot: draft.slot, contact: { ...draft.contact }, createdAt: now, updatedAt: now, history: [] };
          s.bookings.unshift(entry);
          return entry;
        }));
        const rescheduled = draft.mode === "reschedule";
        clearDraft();
        V.setQuery({ reschedule: null, model: null, confirmed: booking.ref });
        renderConfirmation(booking, rescheduled);
      } catch (error) {
        V.setBusy(button, false);
        V.inlineError(feedback, error.message, () => button.click());
      }
    }
  });

  boot();
})();
