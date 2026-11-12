/* VOLTIS vehicles: model list with filters, detail page with configurator, compare. */
(() => {
  "use strict";

  const V = window.Voltis;
  const { esc, fmt, catalogue, states } = V;
  const page = document.body.dataset.page;
  const MAX_COMPARE = 3;

  const RANGE_OPTIONS = { any: 0, "400": 400, "500": 500, "600": 600 };
  const PRICE_OPTIONS = { any: Infinity, "1000": 1e9, "1500": 1.5e9, "2000": 2e9 };
  const BADGE = '<span class="tesla-source-badge">REFERENCE MEDIA / TESLA.COM</span>';

  function rangeLabel(vehicle) {
    const min = catalogue.minRange(vehicle);
    const max = catalogue.maxRange(vehicle);
    return min === max ? fmt.km(max) : `${min}–${fmt.km(max)}`;
  }

  /* ---------- compare selection (shared) ---------- */
  function compareIds() {
    return V.store.get().compare.filter((id) => catalogue.vehicle(id));
  }

  function toggleCompare(id) {
    const current = compareIds();
    if (current.includes(id)) {
      V.store.update((s) => { s.compare = s.compare.filter((x) => x !== id); });
      return true;
    }
    if (current.length >= MAX_COMPARE) {
      V.toast(`You can compare up to ${MAX_COMPARE} models. Remove one first.`, { tone: "warning" });
      return false;
    }
    V.store.update((s) => { s.compare = [...s.compare.filter((x) => x !== id), id]; });
    return true;
  }

  /* =========================================================
     vehicles.html — list, filters, sort, compare tray
     ========================================================= */
  function initList() {
    const form = document.querySelector("[data-vehicle-filters]");
    const grid = document.querySelector("[data-vehicle-grid]");
    const count = document.querySelector("[data-result-count]");
    const tray = document.querySelector("[data-compare-tray]");
    if (!form || !grid) return;

    const params = new URLSearchParams(location.search);
    const setValue = (name, value) => {
      const field = form.elements[name];
      if (!field || value === null) return;
      if (field instanceof RadioNodeList) {
        const match = [...field].find((r) => r.value === value);
        if (match) match.checked = true;
      } else if ([...field.options].some((o) => o.value === value)) {
        field.value = value;
      }
    };
    ["type", "range", "price", "sort"].forEach((name) => setValue(name, params.get(name)));

    let loaded = false;

    function currentFilters() {
      return {
        type: form.elements.type.value || "all",
        range: form.elements.range.value,
        price: form.elements.price.value,
        sort: form.elements.sort.value
      };
    }

    function filtered() {
      const f = currentFilters();
      const list = V.data.vehicles.filter((v) =>
        (f.type === "all" || v.type === f.type)
        && catalogue.maxRange(v) >= (RANGE_OPTIONS[f.range] ?? 0)
        && catalogue.priceFrom(v) < (PRICE_OPTIONS[f.price] ?? Infinity));
      const sorters = {
        recommended: () => 0,
        "price-asc": (a, b) => catalogue.priceFrom(a) - catalogue.priceFrom(b),
        "price-desc": (a, b) => catalogue.priceFrom(b) - catalogue.priceFrom(a),
        "range-desc": (a, b) => catalogue.maxRange(b) - catalogue.maxRange(a)
      };
      return [...list].sort(sorters[f.sort] || sorters.recommended);
    }

    function tile(v, selected) {
      return `
        <article class="model-tile" data-model-id="${esc(v.id)}">
          <a class="model-tile__media" href="./vehicle.html?id=${esc(v.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(v.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">${BADGE}</a>
          <div class="model-tile__body">
            <span class="rail-label">${esc(v.index)} / ${esc(v.typeLabel)}</span>
            <h3><a href="./vehicle.html?id=${esc(v.id)}">${esc(v.name)}</a></h3>
            <p>${esc(v.summary)}</p>
            <dl class="stat-list">
              <div><dt>Range target</dt><dd>${esc(rangeLabel(v))}</dd></div>
              <div><dt>From</dt><dd>${esc(fmt.vndShort(catalogue.priceFrom(v)))}</dd></div>
              <div><dt>Seats</dt><dd>${v.seats}</dd></div>
            </dl>
            <div class="model-tile__actions">
              <a class="btn btn--dark" href="./vehicle.html?id=${esc(v.id)}#configure">Configure ${esc(v.name)}</a>
              <button type="button" class="btn btn--outline-dark" data-compare-toggle="${esc(v.id)}" aria-pressed="${selected}">${selected ? "Remove from compare" : "Add to compare"}</button>
            </div>
          </div>
        </article>`;
    }

    function render() {
      const f = currentFilters();
      V.setQuery({ type: f.type, range: f.range === "any" ? null : f.range, price: f.price === "any" ? null : f.price, sort: f.sort === "recommended" ? null : f.sort });
      if (!loaded) return;
      const list = filtered();
      const selected = compareIds();
      count.textContent = `${list.length} of ${V.data.vehicles.length} models`;
      grid.innerHTML = list.length
        ? list.map((v) => tile(v, selected.includes(v.id))).join("")
        : states.empty({
          title: "No models match these filters",
          message: "Try a wider price band or a lower range target. Every concept model can still be configured.",
          actions: '<button type="button" class="btn btn--dark" data-clear-filters>Clear all filters</button>'
        });
      renderTray();
    }

    function renderTray() {
      if (!tray) return;
      const ids = compareIds();
      tray.hidden = ids.length === 0;
      document.body.classList.toggle("has-tray", ids.length > 0);
      if (!ids.length) { tray.innerHTML = ""; return; }
      const chips = ids.map((id) => {
        const v = catalogue.vehicle(id);
        return `<li><span>${esc(v.name)}</span><button type="button" class="chip-remove" data-compare-toggle="${esc(id)}" aria-label="Remove ${esc(v.name)} from compare">Remove</button></li>`;
      }).join("");
      const ready = ids.length >= 2;
      tray.innerHTML = `
        <div class="shell compare-tray__inner">
          <div><strong>Compare ${ids.length} of ${MAX_COMPARE}</strong><ul class="compare-tray__chips">${chips}</ul></div>
          <div class="compare-tray__actions">
            ${ready ? `<a class="btn btn--energy" href="./compare.html?ids=${ids.map(encodeURIComponent).join(",")}" data-compare-go>Compare models</a>` : '<p class="compare-tray__hint">Select one more model to compare.</p>'}
            <button type="button" class="btn btn--outline btn--small" data-compare-clear>Clear</button>
          </div>
        </div>`;
    }

    form.addEventListener("change", render);
    form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
    form.addEventListener("reset", () => window.setTimeout(render, 0));

    document.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-compare-toggle]");
      if (toggle) {
        toggleCompare(toggle.dataset.compareToggle);
        render();
        return;
      }
      if (event.target.closest("[data-clear-filters]")) {
        form.reset();
      }
      if (event.target.closest("[data-compare-clear]")) {
        V.store.update((s) => { s.compare = []; });
        render();
      }
    });

    V.loadInto(grid, {
      work: () => V.data.vehicles,
      loadingHtml: states.skeleton(3, "model-grid"),
      errorTitle: "The model range could not load",
      render: () => { loaded = true; render(); }
    });
    render();
  }

  /* =========================================================
     vehicle.html — detail page + configurator
     ========================================================= */
  function initDetail() {
    const root = document.querySelector("[data-vehicle-root]");
    if (!root) return;
    const id = V.query("id");

    V.loadInto(root, {
      work: () => catalogue.vehicle(id),
      errorTitle: "This model could not load",
      render: (vehicle) => {
        if (!vehicle) return renderNotFound(root, id);
        renderDetail(root, vehicle);
      }
    });
  }

  function renderNotFound(root, id) {
    document.title = "Model not found — VOLTIS";
    root.innerHTML = `<section class="section section--paper"><div class="shell">${states.notFound({
      title: "We could not find that model.",
      message: id ? `There is no VOLTIS model with the reference “${id}”. It may have been renamed or removed from the concept range.` : "No model was specified in the link.",
      actions: `<a class="btn btn--dark" href="./vehicles.html">See all models</a>${V.data.vehicles.map((v) => `<a class="btn btn--outline-dark" href="./vehicle.html?id=${esc(v.id)}">${esc(v.name)}</a>`).join("")}`
    })}</div></section>`;
  }

  function renderDetail(root, vehicle) {
    document.title = `${vehicle.name} — VOLTIS`;
    const inCompare = compareIds().includes(vehicle.id);
    root.innerHTML = `
      <section class="page-hero detail-hero">
        <div class="shell detail-hero__grid">
          <div>
            <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./vehicles.html">Vehicles</a><span aria-hidden="true">/</span><span aria-current="page">${esc(vehicle.name)}</span></nav>
            <span class="eyebrow eyebrow--light">${esc(vehicle.index)} / ${esc(vehicle.typeLabel.toUpperCase())}</span>
            <h1>${esc(vehicle.name)}</h1>
            <p>${esc(vehicle.tagline)} ${esc(vehicle.summary)}</p>
            <div class="page-hero__actions">
              <a class="btn btn--energy" href="#configure">Configure ${esc(vehicle.name)}</a>
              <a class="btn btn--outline" href="./test-drive.html?model=${esc(vehicle.id)}">Book a test drive</a>
              <button type="button" class="btn btn--outline" data-detail-compare aria-pressed="${inCompare}">${inCompare ? "Remove from compare" : "Add to compare"}</button>
            </div>
          </div>
          <dl class="stat-list stat-list--hero">
            <div><dt>Range target</dt><dd>${esc(rangeLabel(vehicle))}</dd></div>
            <div><dt>From</dt><dd>${esc(fmt.vndShort(catalogue.priceFrom(vehicle)))}</dd></div>
            <div><dt>Seats</dt><dd>${vehicle.seats}</dd></div>
            <div><dt>Charging 10 to 80%</dt><dd>${vehicle.chargeMinutes} min target</dd></div>
          </dl>
        </div>
        <div class="shell detail-hero__media"><img src="${esc(vehicle.image)}" alt="${esc(vehicle.imageAlt)}" referrerpolicy="no-referrer" fetchpriority="high">${BADGE}</div>
      </section>
      <section class="section section--white">
        <div class="shell">
          <div class="section-head"><div><span class="eyebrow">DESIGN INTENT</span><h2>What ${esc(vehicle.name)} is built around.</h2></div><p>Range, price and charging values on this page are concept targets for the prototype, not homologated figures or a commercial offer.</p></div>
          <div class="spec-ledger">${vehicle.highlights.map(([title, text], i) => `<div class="spec-row"><span class="index-number">0${i + 1}</span><div><strong>${esc(title)}</strong><p>${esc(text)}</p></div></div>`).join("")}</div>
        </div>
      </section>
      <section class="section section--paper" id="configure">
        <div class="shell" data-configurator></div>
      </section>
      <section class="section section--dark">
        <div class="shell">
          <div class="section-head"><div><span class="eyebrow eyebrow--light">TECHNICAL SUMMARY</span><h2>Specification targets.</h2></div><p>Every value is a planning target and will change as engineering validation progresses.</p></div>
          <div class="technical-band technical-band--4">
            <div class="technical-cell"><span>01 / DRIVE</span><strong>${esc(vehicle.driveShort)}</strong><p>${esc(vehicle.drive)}.</p></div>
            <div class="technical-cell"><span>02 / BATTERY</span><strong>${vehicle.batteries.map((b) => b.kwh).join(" / ")} kWh</strong><p>${vehicle.batteries.map((b) => esc(b.name)).join(" and ")}.</p></div>
            <div class="technical-cell"><span>03 / RANGE</span><strong>${catalogue.maxRange(vehicle)} km</strong><p>Best-case target with the largest battery.</p></div>
            <div class="technical-cell"><span>04 / SEATS</span><strong>${vehicle.seats}</strong><p>${vehicle.trims.length} trims from ${esc(fmt.vndShort(catalogue.priceFrom(vehicle)))}.</p></div>
          </div>
          <div class="detail-next"><a class="btn btn--energy" href="./compare.html?ids=${esc(vehicle.id)}">Compare ${esc(vehicle.name)} with another model</a><a class="btn btn--outline" href="./vehicles.html">Back to all models</a></div>
        </div>
      </section>`;

    root.querySelector("[data-detail-compare]").addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (!toggleCompare(vehicle.id)) return;
      const on = compareIds().includes(vehicle.id);
      button.setAttribute("aria-pressed", String(on));
      button.textContent = on ? "Remove from compare" : "Add to compare";
      V.toast(on ? `${vehicle.name} added to compare.` : `${vehicle.name} removed from compare.`, { action: on ? { label: "Open compare", href: `./compare.html?ids=${compareIds().join(",")}` } : null });
    });

    initConfigurator(root.querySelector("[data-configurator]"), vehicle);
    if (location.hash === "#configure") document.getElementById("configure").scrollIntoView();
  }

  function initConfigurator(container, vehicle) {
    const configId = V.query("config");
    let editing = null;
    if (configId) {
      editing = V.store.get().garage.find((c) => c.id === configId && c.vehicleId === vehicle.id) || null;
      if (!editing) V.toast("That saved configuration is no longer in your garage. Starting from the default build.", { tone: "warning" });
    }
    const config = editing ? { ...editing, optionIds: [...editing.optionIds] } : catalogue.defaultConfig(vehicle);

    const choice = (group, item, checked, extra, absolute) => `
      <label class="choice">
        <input type="radio" name="${group}" value="${esc(item.id)}" ${checked ? "checked" : ""}>
        <span class="choice__body"><strong>${esc(item.name)}</strong>${extra ? `<small>${extra}</small>` : ""}</span>
        <span class="choice__price">${absolute ? esc(fmt.vndShort(item.price)) : item.price ? `+ ${esc(fmt.vndShort(item.price))}` : "Included"}</span>
      </label>`;

    container.innerHTML = `
      <div class="section-head"><div><span class="eyebrow">CONFIGURATOR</span><h2>Build your ${esc(vehicle.name)}.</h2></div><p>Choose a trim, paint, battery and options. The indicative price and range target update as you go. Save the build to My garage to come back to it later in this tab.</p></div>
      <div class="configurator">
        <div class="configurator__visual">
          <figure class="config-preview">
            <img src="${esc(vehicle.image)}" alt="${esc(vehicle.imageAlt)}" referrerpolicy="no-referrer" loading="lazy">
            ${BADGE}
          </figure>
          <div class="paint-sample"><span class="paint-sample__chip" data-paint-chip></span><div><small>Selected paint</small><strong data-paint-name></strong></div></div>
        </div>
        <form class="configurator__form" data-config-form novalidate>
          <fieldset class="choice-group"><legend><span>01</span>Trim</legend>
            ${vehicle.trims.map((t) => choice("trimId", t, t.id === config.trimId, esc(t.note), true)).join("")}
          </fieldset>
          <fieldset class="choice-group"><legend><span>02</span>Paint</legend>
            <div class="swatch-grid">
              ${vehicle.colours.map((c) => `
                <label class="swatch">
                  <input type="radio" name="colourId" value="${esc(c.id)}" ${c.id === config.colourId ? "checked" : ""}>
                  <span class="swatch__chip" style="--chip:${esc(c.hex)}"></span>
                  <span class="swatch__label">${esc(c.name)}<small>${c.price ? `+ ${esc(fmt.vndShort(c.price))}` : "Included"}</small></span>
                </label>`).join("")}
            </div>
          </fieldset>
          <fieldset class="choice-group"><legend><span>03</span>Battery</legend>
            ${vehicle.batteries.map((b) => choice("batteryId", b, b.id === config.batteryId, `${b.kwh} kWh, range target ${esc(fmt.km(b.rangeKm))}`)).join("")}
          </fieldset>
          <fieldset class="choice-group"><legend><span>04</span>Options</legend>
            ${vehicle.options.map((o) => `
              <label class="choice choice--check">
                <input type="checkbox" name="optionIds" value="${esc(o.id)}" ${config.optionIds.includes(o.id) ? "checked" : ""}>
                <span class="choice__body"><strong>${esc(o.name)}</strong></span>
                <span class="choice__price">+ ${esc(fmt.vndShort(o.price))}</span>
              </label>`).join("")}
          </fieldset>
        </form>
        <aside class="config-summary" aria-labelledby="config-summary-title">
          <span class="eyebrow">SUMMARY</span>
          <h3 id="config-summary-title">${editing ? `Editing “${esc(editing.name)}”` : `Your ${esc(vehicle.name)}`}</h3>
          <dl class="summary-lines" data-summary-lines></dl>
          <div class="config-summary__total"><span>Indicative total</span><strong data-config-total aria-live="polite"></strong></div>
          <p class="config-summary__range">Range target <strong data-config-range></strong></p>
          <form class="config-save" data-config-save novalidate>
            <div class="field"><label for="config-name">Configuration name</label><input id="config-name" name="name" maxlength="40" autocomplete="off" value="${esc(editing ? editing.name : `My ${vehicle.name}`)}"></div>
            <div data-config-feedback></div>
            <div class="config-save__actions">
              <button class="btn btn--energy" type="submit" data-save-config>${editing ? "Update saved build" : "Save to My garage"}</button>
              ${editing ? '<button class="btn btn--outline-dark" type="button" data-save-new>Save as new build</button>' : ""}
              <a class="btn btn--outline-dark" data-config-testdrive href="./test-drive.html?model=${esc(vehicle.id)}">Book a test drive</a>
            </div>
          </form>
          <p class="fine-print">Indicative prices in VND for a concept vehicle. This is not an offer and nothing is ordered or reserved.</p>
        </aside>
      </div>`;

    const form = container.querySelector("[data-config-form]");
    const saveForm = container.querySelector("[data-config-save]");
    const feedback = container.querySelector("[data-config-feedback]");

    function readForm() {
      config.trimId = form.elements.trimId.value;
      config.colourId = form.elements.colourId.value;
      config.batteryId = form.elements.batteryId.value;
      config.optionIds = [...form.querySelectorAll('input[name="optionIds"]:checked')].map((i) => i.value);
    }

    function update() {
      readForm();
      const r = catalogue.resolve(config);
      container.querySelector("[data-paint-chip]").style.setProperty("--chip", r.colour.hex);
      container.querySelector("[data-paint-name]").textContent = r.colour.name;
      container.querySelector("[data-summary-lines]").innerHTML = [
        [`${r.trim.name} trim`, r.trim.price],
        [r.colour.name, r.colour.price],
        [`${r.battery.name}, ${r.battery.kwh} kWh`, r.battery.price],
        ...r.options.map((o) => [o.name, o.price])
      ].map(([label, price]) => `<div><dt>${esc(label)}</dt><dd>${price ? esc(fmt.vnd(price)) : "Included"}</dd></div>`).join("");
      container.querySelector("[data-config-total]").textContent = fmt.vnd(r.total);
      container.querySelector("[data-config-range]").textContent = fmt.km(r.rangeKm);
    }

    form.addEventListener("change", update);
    update();

    async function save(asNew) {
      readForm();
      const nameInput = saveForm.elements.name;
      const name = nameInput.value.trim() || `My ${vehicle.name}`;
      if (name.length > 40) { V.setFieldError(nameInput, "Use 40 characters or fewer."); nameInput.focus(); return; }
      const button = asNew ? saveForm.querySelector("[data-save-new]") : saveForm.querySelector("[data-save-config]");
      feedback.innerHTML = "";
      V.setBusy(button, true, "Saving");
      try {
        const saved = await V.request(() => V.store.update((s) => {
          const now = new Date().toISOString();
          if (editing && !asNew) {
            const target = s.garage.find((c) => c.id === editing.id);
            if (!target) throw new Error("This build was removed from your garage in another view. Save it as a new build instead.");
            Object.assign(target, { name, trimId: config.trimId, colourId: config.colourId, batteryId: config.batteryId, optionIds: [...config.optionIds], updatedAt: now });
            return target;
          }
          const entry = { id: V.reference("CFG"), name, vehicleId: vehicle.id, trimId: config.trimId, colourId: config.colourId, batteryId: config.batteryId, optionIds: [...config.optionIds], createdAt: now, updatedAt: now };
          s.garage.unshift(entry);
          return entry;
        }));
        const wasEditing = editing && !asNew;
        editing = saved;
        nameInput.value = saved.name;
        V.setQuery({ config: saved.id });
        container.querySelector("#config-summary-title").textContent = `Editing “${saved.name}”`;
        const primary = saveForm.querySelector("[data-save-config]");
        primary.dataset.label = "Update saved build";
        if (!saveForm.querySelector("[data-save-new]")) {
          primary.insertAdjacentHTML("afterend", '<button class="btn btn--outline-dark" type="button" data-save-new>Save as new build</button>');
        }
        feedback.innerHTML = `<div class="inline-success" role="status" data-state="saved"><strong>${wasEditing ? "Build updated." : "Saved to My garage."}</strong> <span>“${esc(saved.name)}” is stored in this browser tab only.</span> <a class="text-link" href="./account.html?tab=garage">Open My garage</a></div>`;
      } catch (error) {
        V.inlineError(feedback, error.message, () => save(asNew));
      } finally {
        V.setBusy(button, false);
      }
    }

    saveForm.addEventListener("submit", (event) => { event.preventDefault(); save(false); });
    saveForm.addEventListener("click", (event) => { if (event.target.closest("[data-save-new]")) save(true); });
  }

  /* =========================================================
     compare.html
     ========================================================= */
  function initCompare() {
    const root = document.querySelector("[data-compare-root]");
    if (!root) return;
    const fromUrl = (V.query("ids") || "").split(",").map((s) => s.trim()).filter(Boolean);
    let ids = (fromUrl.length ? fromUrl : compareIds()).filter((id, i, arr) => catalogue.vehicle(id) && arr.indexOf(id) === i).slice(0, MAX_COMPARE);
    const unknown = fromUrl.filter((id) => !catalogue.vehicle(id));
    if (unknown.length) V.toast(`Skipped unknown model reference: ${unknown.join(", ")}.`, { tone: "warning" });

    function persist() {
      V.store.update((s) => { s.compare = [...ids]; });
      V.setQuery({ ids: ids.length ? ids.join(",") : null });
    }

    function picker() {
      const remaining = V.data.vehicles.filter((v) => !ids.includes(v.id));
      if (ids.length >= MAX_COMPARE) return `<p class="compare-picker__note">Comparing the maximum of ${MAX_COMPARE} models. Remove one to add another.</p>`;
      return `
        <form class="compare-picker" data-compare-add>
          <div class="field"><label for="compare-add">Add a model</label>
            <select id="compare-add" name="model">${remaining.map((v) => `<option value="${esc(v.id)}">${esc(v.name)} / ${esc(v.typeLabel)}</option>`).join("")}</select>
          </div>
          <button class="btn btn--dark" type="submit">Add to comparison</button>
        </form>`;
    }

    function render() {
      persist();
      const vehicles = ids.map(catalogue.vehicle);
      if (vehicles.length < 2) {
        root.innerHTML = `${states.empty({
          title: vehicles.length ? `Add one more model to compare with ${vehicles[0].name}` : "Choose at least two models to compare",
          message: "Comparisons work side by side for two or three models. Pick from the list below or from the model range.",
          actions: '<a class="btn btn--outline-dark" href="./vehicles.html#range">Browse the range</a>'
        })}${vehicles.length ? `<p class="compare-current">Selected: <strong>${esc(vehicles[0].name)}</strong> <button type="button" class="text-link text-link--button" data-compare-remove="${esc(vehicles[0].id)}">Remove</button></p>` : ""}${picker()}`;
        return;
      }
      const rows = [
        ["Body type", (v) => esc(v.typeLabel)],
        ["Seats", (v) => v.seats],
        ["Range target", (v) => esc(rangeLabel(v))],
        ["Battery options", (v) => v.batteries.map((b) => `${b.kwh} kWh`).join(" / ")],
        ["Charging 10 to 80%", (v) => `${v.chargeMinutes} min target`],
        ["Drive", (v) => esc(v.drive)],
        ["Trims", (v) => v.trims.map((t) => esc(t.name)).join(", ")],
        ["Price from", (v) => esc(fmt.vnd(catalogue.priceFrom(v)))]
      ];
      const best = {
        "Range target": Math.max(...vehicles.map(catalogue.maxRange)),
        "Price from": Math.min(...vehicles.map(catalogue.priceFrom))
      };
      const isBest = (label, v) => (label === "Range target" && catalogue.maxRange(v) === best[label]) || (label === "Price from" && catalogue.priceFrom(v) === best[label]);

      root.innerHTML = `
        <div class="compare-scroll" tabindex="0" role="region" aria-label="Model comparison table">
          <table class="compare-table" style="--cols:${vehicles.length}">
            <caption class="visually-hidden">Comparison of ${vehicles.map((v) => esc(v.name)).join(", ")}</caption>
            <thead><tr><th scope="col"><span class="visually-hidden">Specification</span></th>${vehicles.map((v) => `
              <th scope="col">
                <div class="compare-head">
                  <div class="compare-head__media"><img src="${esc(v.image)}" alt="" loading="lazy" referrerpolicy="no-referrer"></div>
                  <span class="rail-label">${esc(v.typeLabel)}</span>
                  <a class="compare-head__name" href="./vehicle.html?id=${esc(v.id)}">${esc(v.name)}</a>
                  <button type="button" class="text-link text-link--button" data-compare-remove="${esc(v.id)}" aria-label="Remove ${esc(v.name)} from comparison">Remove</button>
                </div>
              </th>`).join("")}</tr></thead>
            <tbody>${rows.map(([label, cell]) => `<tr><th scope="row">${esc(label)}</th>${vehicles.map((v) => `<td${isBest(label, v) ? ' class="is-best"' : ""}>${cell(v)}${isBest(label, v) ? '<span class="best-tag">Best in selection</span>' : ""}</td>`).join("")}</tr>`).join("")}
              <tr><th scope="row">Next step</th>${vehicles.map((v) => `<td><div class="compare-actions"><a class="btn btn--dark btn--small" href="./vehicle.html?id=${esc(v.id)}#configure">Configure</a><a class="btn btn--outline-dark btn--small" href="./test-drive.html?model=${esc(v.id)}">Test drive</a></div></td>`).join("")}</tr>
            </tbody>
          </table>
        </div>
        ${picker()}
        <p class="fine-print">Range, charging and price values are concept targets for this prototype, not homologated figures or offers.</p>`;
    }

    root.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-compare-remove]");
      if (!remove) return;
      ids = ids.filter((id) => id !== remove.dataset.compareRemove);
      render();
    });
    root.addEventListener("submit", (event) => {
      if (!event.target.matches("[data-compare-add]")) return;
      event.preventDefault();
      const value = event.target.elements.model.value;
      if (value && !ids.includes(value) && ids.length < MAX_COMPARE) ids.push(value);
      render();
    });

    V.loadInto(root, { work: () => true, errorTitle: "The comparison could not load", render });
  }

  if (page === "vehicles") initList();
  if (page === "vehicle") initDetail();
  if (page === "compare") initCompare();
})();
