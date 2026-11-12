/* VOLTIS My VOLTIS: garage, bookings, applications and enquiries. */
(() => {
  "use strict";

  const V = window.Voltis;
  const { esc, fmt, catalogue, states } = V;
  if (document.body.dataset.page !== "account") return;

  const root = document.querySelector("[data-account-root]");
  const tabs = [...document.querySelectorAll("[data-tab]")];
  const TAB_IDS = tabs.map((t) => t.dataset.tab);
  let current = TAB_IDS.includes(V.query("tab")) ? V.query("tab") : "garage";

  function counts(state) {
    return {
      garage: state.garage.length,
      bookings: state.bookings.filter((b) => b.status === "requested").length,
      applications: state.applications.filter((a) => a.status === "submitted").length,
      enquiries: state.enquiries.length
    };
  }

  function syncTabs() {
    const c = counts(V.store.get());
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === current;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const badge = tab.querySelector("[data-tab-count]");
      if (badge) badge.textContent = c[tab.dataset.tab];
    });
    root.setAttribute("aria-labelledby", `tab-${current}`);
  }

  function select(tabId, focus = false) {
    current = tabId;
    V.setQuery({ tab: tabId === "garage" ? null : tabId });
    syncTabs();
    if (focus) document.getElementById(`tab-${tabId}`).focus();
    load();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => select(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
      const i = TAB_IDS.indexOf(tab.dataset.tab);
      if (event.key === "ArrowRight") { event.preventDefault(); select(TAB_IDS[(i + 1) % TAB_IDS.length], true); }
      if (event.key === "ArrowLeft") { event.preventDefault(); select(TAB_IDS[(i - 1 + TAB_IDS.length) % TAB_IDS.length], true); }
    });
  });

  /* ---------- renderers ---------- */
  function garage(state) {
    if (!state.garage.length) {
      return states.empty({
        title: "Your garage is empty",
        message: "Configure a model and save it to keep the build here while this tab is open.",
        actions: '<a class="btn btn--dark" href="./vehicles.html">Configure a model</a>'
      });
    }
    return `<div class="record-list">${state.garage.map((cfg) => {
      const r = catalogue.resolve(cfg);
      if (!r) return "";
      return `
      <article class="record" data-record="${esc(cfg.id)}">
        <div class="record__media"><img src="${esc(r.vehicle.image)}" alt="" loading="lazy" referrerpolicy="no-referrer"><span class="record__paint" style="--chip:${esc(r.colour.hex)}" aria-hidden="true"></span></div>
        <div class="record__body">
          <span class="rail-label">${esc(r.vehicle.name)} / ${esc(r.vehicle.typeLabel)}</span>
          <h3>${esc(cfg.name)}</h3>
          <p>${esc(r.trim.name)} trim, ${esc(r.colour.name)}, ${esc(r.battery.name)} (${r.battery.kwh} kWh)${r.options.length ? `, ${r.options.length} ${r.options.length === 1 ? "option" : "options"}` : ""}.</p>
          <details class="record__details"><summary>Full build</summary>
            <dl class="summary-lines">
              <div><dt>${esc(r.trim.name)} trim</dt><dd>${esc(fmt.vnd(r.trim.price))}</dd></div>
              <div><dt>${esc(r.colour.name)}</dt><dd>${r.colour.price ? esc(fmt.vnd(r.colour.price)) : "Included"}</dd></div>
              <div><dt>${esc(r.battery.name)}</dt><dd>${r.battery.price ? esc(fmt.vnd(r.battery.price)) : "Included"}</dd></div>
              ${r.options.map((o) => `<div><dt>${esc(o.name)}</dt><dd>${esc(fmt.vnd(o.price))}</dd></div>`).join("")}
            </dl>
          </details>
          <p class="record__meta">Saved ${esc(fmt.dateTime(cfg.updatedAt))}. Range target ${esc(fmt.km(r.rangeKm))}.</p>
        </div>
        <div class="record__side">
          <strong class="record__price">${esc(fmt.vnd(r.total))}</strong>
          <div class="record__actions">
            <a class="btn btn--dark btn--small" href="./vehicle.html?id=${esc(r.vehicle.id)}&config=${esc(cfg.id)}#configure" data-edit-config>Edit build</a>
            <a class="btn btn--outline-dark btn--small" href="./test-drive.html?model=${esc(r.vehicle.id)}">Test drive</a>
            <button type="button" class="btn btn--danger-ghost btn--small" data-delete-config="${esc(cfg.id)}">Delete</button>
          </div>
        </div>
      </article>`;
    }).join("")}</div>`;
  }

  function bookings(state) {
    if (!state.bookings.length) {
      return states.empty({
        title: "No test drives booked",
        message: "Book a test drive and it will appear here, ready to reschedule or cancel.",
        actions: '<a class="btn btn--dark" href="./test-drive.html">Book a test drive</a>'
      });
    }
    return `<div class="record-list">${state.bookings.map((b) => {
      const vehicle = catalogue.vehicle(b.modelId);
      const showroom = catalogue.showroom(b.showroomId);
      const active = b.status === "requested";
      return `
      <article class="record ${active ? "" : "is-inactive"}" data-record="${esc(b.ref)}">
        <div class="record__media"><img src="${esc(vehicle.image)}" alt="" loading="lazy" referrerpolicy="no-referrer"></div>
        <div class="record__body">
          <span class="rail-label">TEST DRIVE / ${esc(b.ref)}</span>
          <h3>${esc(vehicle.name)} at ${esc(showroom.city)}</h3>
          <p>${esc(fmt.longDate(b.date))} at ${esc(b.slot)}, ${esc(showroom.name)}.</p>
          <p class="record__meta">${esc(b.contact.firstName)} ${esc(b.contact.lastName)}, ${esc(b.contact.email)}.${b.history && b.history.length ? ` Rescheduled ${b.history.length} ${b.history.length === 1 ? "time" : "times"}.` : ""}</p>
        </div>
        <div class="record__side">
          <span class="status-pill status-pill--${active ? "ok" : "off"}">${active ? "Requested" : "Cancelled"}</span>
          ${active ? `<div class="record__actions">
            <a class="btn btn--dark btn--small" href="./test-drive.html?reschedule=${esc(b.ref)}">Reschedule</a>
            <button type="button" class="btn btn--danger-ghost btn--small" data-cancel-booking="${esc(b.ref)}">Cancel booking</button>
          </div>` : `<div class="record__actions"><a class="btn btn--outline-dark btn--small" href="./test-drive.html?model=${esc(vehicle.id)}">Book again</a></div>`}
        </div>
      </article>`;
    }).join("")}</div>`;
  }

  function applications(state) {
    if (!state.applications.length) {
      return states.empty({
        title: "No applications yet",
        message: "Applications you submit from the careers pages appear here, where you can withdraw them.",
        actions: '<a class="btn btn--dark" href="./careers.html#roles">See open roles</a>'
      });
    }
    return `<div class="record-list">${state.applications.map((a) => {
      const job = catalogue.job(a.jobId);
      const active = a.status === "submitted";
      return `
      <article class="record record--text ${active ? "" : "is-inactive"}" data-record="${esc(a.ref)}">
        <div class="record__body">
          <span class="rail-label">APPLICATION / ${esc(a.ref)}</span>
          <h3>${esc(job ? job.title : "Role no longer listed")}</h3>
          <p>${job ? `${esc(job.location)}, ${esc(job.type)}.` : ""} CV file: ${esc(a.cv.name)} (${esc(fmt.bytes(a.cv.size))}, not uploaded).</p>
          <p class="record__meta">Submitted ${esc(fmt.dateTime(a.createdAt))}${a.withdrawnAt ? `. Withdrawn ${esc(fmt.dateTime(a.withdrawnAt))}` : ""}.</p>
        </div>
        <div class="record__side">
          <span class="status-pill status-pill--${active ? "ok" : "off"}">${active ? "Submitted" : "Withdrawn"}</span>
          <div class="record__actions">
            ${job ? `<a class="btn btn--outline-dark btn--small" href="./job.html?id=${esc(job.id)}">View role</a>` : ""}
            ${active ? `<button type="button" class="btn btn--danger-ghost btn--small" data-withdraw="${esc(a.ref)}">Withdraw</button>` : ""}
          </div>
        </div>
      </article>`;
    }).join("")}</div>`;
  }

  function enquiries(state) {
    if (!state.enquiries.length) {
      return states.empty({
        title: "No enquiries sent",
        message: "Messages from the contact form are kept here for this tab so you can check what you wrote.",
        actions: '<a class="btn btn--dark" href="./contact.html#form">Write to VOLTIS</a>'
      });
    }
    return `<div class="record-list">${state.enquiries.map((e) => `
      <article class="record record--text" data-record="${esc(e.ref)}">
        <div class="record__body">
          <span class="rail-label">ENQUIRY / ${esc(e.ref)}</span>
          <h3>${esc(e.topic)}</h3>
          <p>${esc(e.message)}</p>
          <p class="record__meta">${esc(e.name)}, ${esc(e.email)}. Recorded ${esc(fmt.dateTime(e.createdAt))}. Not sent.</p>
        </div>
      </article>`).join("")}</div>`;
  }

  const renderers = { garage, bookings, applications, enquiries };

  function load() {
    V.loadInto(root, {
      work: () => V.store.get(),
      loadingHtml: states.skeleton(2, "record-skeleton"),
      errorTitle: "Your saved items could not load",
      render: (state) => { root.innerHTML = renderers[current](state); }
    });
  }

  /* ---------- actions ---------- */
  async function act({ button, confirm, work, done }) {
    const ok = await V.confirm(confirm);
    if (!ok) return;
    V.setBusy(button, true, "Working");
    try {
      await V.request(work);
      V.toast(done, { tone: "success" });
      syncTabs();
      root.innerHTML = renderers[current](V.store.get());
    } catch (error) {
      V.setBusy(button, false);
      V.toast(error.message, { tone: "error" });
      const record = button.closest(".record");
      const holder = document.createElement("div");
      holder.className = "record__error";
      record.appendChild(holder);
      V.inlineError(holder, error.message, () => { holder.remove(); button.click(); });
    }
  }

  root.addEventListener("click", (event) => {
    const del = event.target.closest("[data-delete-config]");
    if (del) {
      const cfg = V.store.get().garage.find((c) => c.id === del.dataset.deleteConfig);
      return act({
        button: del,
        confirm: { title: `Delete “${cfg ? cfg.name : "this build"}”?`, body: "The saved build is removed from My garage in this tab. This cannot be undone.", confirmLabel: "Delete build", cancelLabel: "Keep build", danger: true },
        work: () => V.store.update((s) => { s.garage = s.garage.filter((c) => c.id !== del.dataset.deleteConfig); }),
        done: "Build deleted from My garage."
      });
    }
    const cancel = event.target.closest("[data-cancel-booking]");
    if (cancel) {
      const ref = cancel.dataset.cancelBooking;
      return act({
        button: cancel,
        confirm: { title: `Cancel booking ${ref}?`, body: "The request is marked as cancelled in this tab. Nothing is sent to a studio because nothing was reserved.", confirmLabel: "Cancel booking", cancelLabel: "Keep booking", danger: true },
        work: () => V.store.update((s) => {
          const b = s.bookings.find((x) => x.ref === ref);
          if (!b || b.status !== "requested") throw new Error("This booking is already cancelled.");
          b.status = "cancelled";
          b.updatedAt = new Date().toISOString();
        }),
        done: `Booking ${ref} cancelled.`
      });
    }
    const withdraw = event.target.closest("[data-withdraw]");
    if (withdraw) {
      const ref = withdraw.dataset.withdraw;
      return act({
        button: withdraw,
        confirm: { title: `Withdraw application ${ref}?`, body: "The application is marked as withdrawn in this tab. You can apply for the role again later.", confirmLabel: "Withdraw application", cancelLabel: "Keep application", danger: true },
        work: () => V.store.update((s) => {
          const a = s.applications.find((x) => x.ref === ref);
          if (!a || a.status !== "submitted") throw new Error("This application is already withdrawn.");
          a.status = "withdrawn";
          a.withdrawnAt = new Date().toISOString();
        }),
        done: `Application ${ref} withdrawn.`
      });
    }
    return undefined;
  });

  V.store.subscribe(syncTabs);
  syncTabs();
  load();
})();
