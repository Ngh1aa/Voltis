/* VOLTIS content: stories, projects and resources (list + detail). */
(() => {
  "use strict";

  const V = window.Voltis;
  const { esc, fmt, catalogue, states } = V;
  const page = document.body.dataset.page;
  const D = V.data;

  const label = (list, id) => (list.find((x) => x.id === id) || { label: id }).label;

  function chips(name, items, active) {
    return [{ id: "all", label: "All" }, ...items].map((item) =>
      `<button type="button" class="filter-btn ${item.id === active ? "is-active" : ""}" data-${name}="${esc(item.id)}" aria-pressed="${item.id === active}">${esc(item.label)}</button>`).join("");
  }

  /* =========================================================
     Stories
     ========================================================= */
  function storyCard(story, feature) {
    const href = `./story.html?id=${esc(story.id)}`;
    const media = `<a class="story-card__media" href="${href}" tabindex="-1" aria-hidden="true"><img src="${esc(story.image)}" alt="" loading="lazy" referrerpolicy="no-referrer"></a>`;
    const meta = `<div class="story-card__meta"><span>${esc(label(D.storyCategories, story.category).toUpperCase())}</span><time datetime="${esc(story.date)}">${esc(fmt.date(story.date).toUpperCase())}</time></div>`;
    const heading = feature ? `<h2><a href="${href}">${esc(story.title)}</a></h2>` : `<h3><a href="${href}">${esc(story.title)}</a></h3>`;
    if (feature) {
      return `<article class="story-card story-card--feature" data-story-id="${esc(story.id)}">${media}<div>${meta}${heading}<p>${esc(story.excerpt)}</p><a class="text-link" href="${href}">Read story ↗</a></div></article>`;
    }
    return `<article class="story-card" data-story-id="${esc(story.id)}">${media}${meta}${heading}<p>${esc(story.excerpt)}</p><a class="text-link" href="${href}" aria-label="Read story: ${esc(story.title)}">Read story ↗</a></article>`;
  }

  function initStories() {
    const toolbar = document.querySelector("[data-story-toolbar]");
    const grid = document.querySelector("[data-story-grid]");
    const search = document.querySelector("[data-story-search]");
    const count = document.querySelector("[data-result-count]");
    if (!grid) return;
    let category = D.storyCategories.some((c) => c.id === V.query("category")) ? V.query("category") : "all";
    search.elements.q.value = V.query("q") || "";
    let loaded = false;

    function render() {
      const q = search.elements.q.value.trim().toLowerCase();
      V.setQuery({ category, q: q || null });
      toolbar.innerHTML = chips("story-filter", D.storyCategories, category);
      if (!loaded) return;
      const list = [...D.stories].sort((a, b) => b.date.localeCompare(a.date)).filter((s) =>
        (category === "all" || s.category === category)
        && (!q || `${s.title} ${s.excerpt} ${s.body.join(" ")}`.toLowerCase().includes(q)));
      count.textContent = `${list.length} ${list.length === 1 ? "story" : "stories"}`;
      grid.innerHTML = list.length
        ? list.map((s, i) => storyCard(s, i === 0 && category === "all" && !q)).join("")
        : states.empty({
          title: "No stories match",
          message: q ? `Nothing in ${category === "all" ? "any category" : label(D.storyCategories, category)} mentions “${search.elements.q.value.trim()}”. Try another word or clear the search.` : "There are no stories in this category yet.",
          actions: '<button type="button" class="btn btn--dark" data-clear-stories>Show all stories</button>'
        });
    }

    toolbar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-story-filter]");
      if (!button) return;
      category = button.dataset.storyFilter;
      render();
    });
    search.addEventListener("submit", (event) => { event.preventDefault(); render(); });
    search.addEventListener("input", render);
    grid.addEventListener("click", (event) => {
      if (!event.target.closest("[data-clear-stories]")) return;
      category = "all";
      search.elements.q.value = "";
      render();
    });

    render();
    V.loadInto(grid, { work: () => D.stories, loadingHtml: states.skeleton(3, "story-grid"), errorTitle: "Stories could not load", render: () => { loaded = true; render(); } });
  }

  function initStory() {
    const root = document.querySelector("[data-story-root]");
    if (!root) return;
    const id = V.query("id");
    V.loadInto(root, {
      work: () => catalogue.story(id),
      errorTitle: "This story could not load",
      render: (story) => {
        if (!story) {
          document.title = "Story not found — VOLTIS";
          root.innerHTML = `<section class="section section--paper"><div class="shell">${states.notFound({
            title: "We could not find that story.",
            message: id ? `No story matches “${id}”. It may have been moved or unpublished.` : "No story was specified in the link.",
            actions: '<a class="btn btn--dark" href="./stories.html">Browse all stories</a>'
          })}</div></section>`;
          return;
        }
        document.title = `${story.title} — VOLTIS Stories`;
        const sorted = [...D.stories].sort((a, b) => b.date.localeCompare(a.date));
        const index = sorted.findIndex((s) => s.id === story.id);
        const newer = sorted[index - 1];
        const older = sorted[index + 1];
        const related = [...D.stories.filter((s) => s.id !== story.id && s.category === story.category), ...D.stories.filter((s) => s.id !== story.id && s.category !== story.category)].slice(0, 3);
        root.innerHTML = `
          <section class="page-hero article-hero">
            <div class="shell">
              <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./stories.html">Stories</a><span aria-hidden="true">/</span><a href="./stories.html?category=${esc(story.category)}">${esc(label(D.storyCategories, story.category))}</a></nav>
              <div class="article-hero__meta"><span>${esc(label(D.storyCategories, story.category).toUpperCase())}</span><time datetime="${esc(story.date)}">${esc(fmt.date(story.date))}</time><span>${story.readMinutes} min read</span></div>
              <h1>${esc(story.title)}</h1>
              <p>${esc(story.excerpt)}</p>
            </div>
            <div class="shell detail-hero__media"><img src="${esc(story.image)}" alt="${esc(story.imageAlt)}" referrerpolicy="no-referrer"></div>
          </section>
          <section class="section section--white">
            <div class="shell article-layout">
              <div class="article-body">${story.body.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
              <aside class="article-aside">
                <span class="eyebrow">VOLTIS EDITORIAL</span>
                <p>Stories explain design, technology, energy and company decisions. Concept content; figures are not product claims.</p>
                <a class="text-link" href="./contact.html?topic=media#form">Media enquiries ↗</a>
              </aside>
            </div>
            <nav class="shell article-pager" aria-label="More stories">
              ${newer ? `<a href="./story.html?id=${esc(newer.id)}"><small>Newer story</small><strong>${esc(newer.title)}</strong></a>` : "<span></span>"}
              ${older ? `<a href="./story.html?id=${esc(older.id)}" class="article-pager__next"><small>Older story</small><strong>${esc(older.title)}</strong></a>` : "<span></span>"}
            </nav>
          </section>
          <section class="section section--paper">
            <div class="shell">
              <div class="section-head"><div><span class="eyebrow">KEEP READING</span><h2>Related stories.</h2></div><p><a class="text-link" href="./stories.html">All stories ↗</a></p></div>
              <div class="story-grid">${related.map((s) => storyCard(s, false)).join("")}</div>
            </div>
          </section>`;
      }
    });
  }

  /* =========================================================
     Projects
     ========================================================= */
  function projectCard(p) {
    const href = `./project.html?id=${esc(p.id)}`;
    return `<article class="project-card" data-project-id="${esc(p.id)}">
      <a class="project-card__media" href="${href}" tabindex="-1" aria-hidden="true"><img src="${esc(p.image)}" alt="" loading="lazy" referrerpolicy="no-referrer"></a>
      <div class="project-card__body">
        <div class="project-card__meta"><span class="index-number">${esc(p.index)}</span><span class="status-pill status-pill--${p.status === "pilot" ? "ok" : "neutral"}">${esc(label(D.projectStatuses, p.status))}</span></div>
        <h3><a href="${href}">${esc(p.title)}</a></h3>
        <p>${esc(p.summary)}</p>
        <a class="text-link" href="${href}" aria-label="View project: ${esc(p.title)}">View project ↗</a>
      </div>
    </article>`;
  }

  function initProjects() {
    const toolbar = document.querySelector("[data-project-toolbar]");
    const grid = document.querySelector("[data-project-grid]");
    const statusSelect = document.querySelector("[data-project-status]");
    const count = document.querySelector("[data-result-count]");
    if (!grid) return;
    let layer = D.projectLayers.some((l) => l.id === V.query("layer")) ? V.query("layer") : "all";
    if (D.projectStatuses.some((s) => s.id === V.query("status"))) statusSelect.value = V.query("status");
    let loaded = false;

    function render() {
      const status = statusSelect.value;
      V.setQuery({ layer, status });
      toolbar.innerHTML = chips("project-filter", D.projectLayers, layer);
      if (!loaded) return;
      const list = D.projects.filter((p) => (layer === "all" || p.layer === layer) && (status === "all" || p.status === status));
      count.textContent = `${list.length} ${list.length === 1 ? "project" : "projects"}`;
      grid.classList.toggle("project-mosaic--even", list.length !== D.projects.length);
      grid.innerHTML = list.length ? list.map(projectCard).join("") : states.empty({
        title: "No projects in this combination",
        message: `There is no ${label(D.projectStatuses, status).toLowerCase()} project in ${label(D.projectLayers, layer).toLowerCase()} yet.`,
        actions: '<button type="button" class="btn btn--dark" data-clear-projects>Show all projects</button>'
      });
    }

    toolbar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-project-filter]");
      if (!button) return;
      layer = button.dataset.projectFilter;
      render();
    });
    statusSelect.addEventListener("change", render);
    grid.addEventListener("click", (event) => {
      if (!event.target.closest("[data-clear-projects]")) return;
      layer = "all";
      statusSelect.value = "all";
      render();
    });
    render();
    V.loadInto(grid, { work: () => D.projects, loadingHtml: states.skeleton(3, "project-mosaic"), errorTitle: "Projects could not load", render: () => { loaded = true; render(); } });
  }

  function initProject() {
    const root = document.querySelector("[data-project-root]");
    if (!root) return;
    const id = V.query("id");
    V.loadInto(root, {
      work: () => catalogue.project(id),
      errorTitle: "This project could not load",
      render: (p) => {
        if (!p) {
          document.title = "Project not found — VOLTIS";
          root.innerHTML = `<section class="section section--paper"><div class="shell">${states.notFound({
            title: "We could not find that project.",
            message: id ? `No project matches “${id}”.` : "No project was specified in the link.",
            actions: '<a class="btn btn--dark" href="./projects.html">Browse all projects</a>'
          })}</div></section>`;
          return;
        }
        document.title = `${p.title} — VOLTIS Projects`;
        const others = D.projects.filter((x) => x.id !== p.id).slice(0, 2);
        root.innerHTML = `
          <section class="page-hero detail-hero">
            <div class="shell detail-hero__grid">
              <div>
                <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./projects.html">Projects</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.title)}</span></nav>
                <span class="eyebrow eyebrow--light">${esc(p.index)} / ${esc(label(D.projectLayers, p.layer).toUpperCase())}</span>
                <h1>${esc(p.title)}</h1>
                <p>${esc(p.summary)}</p>
                <div class="page-hero__actions"><a class="btn btn--energy" href="./contact.html?topic=project&amp;ref=${esc(p.id)}#form">Discuss this project</a><a class="btn btn--outline" href="./projects.html">All projects</a></div>
              </div>
              <dl class="stat-list stat-list--hero">
                <div><dt>Status</dt><dd>${esc(label(D.projectStatuses, p.status))}</dd></div>
                <div><dt>Layer</dt><dd>${esc(label(D.projectLayers, p.layer))}</dd></div>
                <div><dt>Location</dt><dd>${esc(p.location)}</dd></div>
              </dl>
            </div>
            <div class="shell detail-hero__media"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" referrerpolicy="no-referrer"></div>
          </section>
          <section class="section section--white">
            <div class="shell manifesto"><p class="manifesto__statement manifesto__statement--small">${esc(p.overview)}</p>
              <div class="manifesto__aside"><span class="eyebrow">OUTCOMES WE ARE TESTING</span><ul class="tick-list">${p.outcomes.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>
            </div>
          </section>
          <section class="section section--dark">
            <div class="shell">
              <div class="section-head"><div><span class="eyebrow eyebrow--light">DELIVERY PLAN</span><h2>From pilot to repeatable system.</h2></div><p>Every project moves through the same four phases so evidence is agreed before anything scales.</p></div>
              <div class="company-timeline">${p.phases.map(([phase, text], i) => `<div class="timeline-row"><time>0${i + 1} / ${esc(phase.toUpperCase())}</time><h3>${esc(phase)}</h3><p>${esc(text)}</p></div>`).join("")}</div>
            </div>
          </section>
          <section class="section section--paper">
            <div class="shell">
              <div class="section-head"><div><span class="eyebrow">MORE PROJECTS</span><h2>Other layers of the ecosystem.</h2></div><p><a class="text-link" href="./projects.html">All projects ↗</a></p></div>
              <div class="project-mosaic project-mosaic--even">${others.map(projectCard).join("")}</div>
            </div>
          </section>`;
      }
    });
  }

  /* =========================================================
     Resources
     ========================================================= */
  const today = () => new Date().toISOString().slice(0, 10);
  const generators = {
    principles: () => `# VOLTIS Product Principles\n\nGenerated ${today()} from the VOLTIS prototype. Concept material.\n\n## 1. Clarity is a constraint\nEvery feature, message and interaction must help someone understand, decide or move with less friction.\n\n## 2. One primary action per decision zone\nEnergy Green marks the main action. Secondary actions stay quieter.\n\n## 3. No invented performance claims\nRange, price and charging values are labelled as targets until validated.\n\n## 4. Physical controls for driving tasks\nAnything used while moving has a physical or glanceable control.\n\n## Concept boundaries\n${D.vehicles.map((v) => `- ${v.name} (${v.typeLabel}): ${v.summary}`).join("\n")}\n`,
    energy: () => `# Energy Architecture Overview\n\nGenerated ${today()} from the VOLTIS prototype. Concept material.\n\n## Layers\n1. Source: battery and energy management\n2. Conversion: electrical energy into motion\n3. Feedback: clear data, fewer actions\n\n## Charging journey states\nFind, arrive, connect, charge, recover from a fault, leave.\n\n## Battery options by model (targets)\n${D.vehicles.map((v) => `- ${v.name}: ${v.batteries.map((b) => `${b.name} ${b.kwh} kWh / ${b.rangeKm} km`).join("; ")}`).join("\n")}\n`,
    impact: () => `# Impact Disclosure Framework\n\nGenerated ${today()} from the VOLTIS prototype. Concept material.\n\nEvery performance or sustainability statement must state:\n\nA. Scope: which vehicle, component, project or lifecycle stage the claim covers.\nB. Method: the test, calculation or reporting framework, in plain language.\nC. Source: the primary evidence and the date it was last updated.\n\nClaims without all three are not published.\n`,
    interface: () => `# Digital Interface Guidelines\n\nGenerated ${today()} from the VOLTIS prototype. Concept material.\n\n- Typography: one family, clear scale, labels never below 12 px.\n- Colour: Energy Green (#8dff63) for primary actions and energy state; Motion Orange (#ff7a1a) for movement.\n- Focus: visible 3 px focus ring on every interactive element.\n- Touch targets: at least 44 x 44 px.\n- Feedback: every action shows loading, success or a recoverable error.\n- Empty states explain what is missing and offer the next action.\n`,
    profile: () => `VOLTIS CORPORATE PROFILE\nGenerated ${today()} from the VOLTIS prototype. Concept material.\n\nVOLTIS is a concept for an electric mobility company that treats the vehicle, software, charging experience and brand as one connected system.\n\nConcept range: ${D.vehicles.map((v) => v.name).join(", ")}.\nStudios (concept locations): ${D.showrooms.map((s) => s.city).join(", ")}.\nProject directions: ${D.projects.map((p) => p.title).join(", ")}.\n\nContact: hello@voltis.example (placeholder address).\n`,
    specs: () => {
      const rows = [["model", "type", "seats", "trim", "trim_price_vnd", "battery", "battery_kwh", "range_target_km", "battery_price_vnd"]];
      D.vehicles.forEach((v) => v.trims.forEach((t) => v.batteries.forEach((b) => rows.push([v.name, v.typeLabel, v.seats, t.name, t.price, b.name, b.kwh, b.rangeKm, b.price]))));
      return rows.map((r) => r.map((c) => (/[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c)).join(",")).join("\r\n");
    }
  };
  const MIME = { md: "text/markdown", txt: "text/plain", csv: "text/csv" };

  function initResources() {
    const form = document.querySelector("[data-resource-form]");
    const toolbar = document.querySelector("[data-resource-toolbar]");
    const table = document.querySelector("[data-resource-table]");
    const count = document.querySelector("[data-result-count]");
    if (!table) return;
    let category = D.resourceCategories.some((c) => c.id === V.query("category")) ? V.query("category") : "all";
    form.elements.q.value = V.query("q") || "";
    let loaded = false;

    function render() {
      const q = form.elements.q.value.trim().toLowerCase();
      V.setQuery({ category, q: q || null });
      toolbar.innerHTML = chips("resource-filter", D.resourceCategories, category);
      if (!loaded) return;
      const list = D.resources.filter((r) => (category === "all" || r.category === category) && (!q || `${r.title} ${r.summary} ${r.format}`.toLowerCase().includes(q)));
      count.textContent = `${list.length} of ${D.resources.length} documents`;
      table.innerHTML = list.length ? list.map((r, i) => `
        <div class="resource-row" data-resource-row="${esc(r.id)}">
          <span class="index-number">${String(i + 1).padStart(2, "0")}</span>
          <div><strong>${esc(r.title)}</strong><small>${esc(r.summary)}</small></div>
          <div class="resource-row__end">
            <span class="format">${esc(r.format.toUpperCase())} / ${esc(label(D.resourceCategories, r.category).toUpperCase())}</span>
            ${r.file
              ? `<a class="btn btn--outline-dark btn--small" href="${esc(r.file)}" download data-resource-download="${esc(r.id)}">Download <span class="visually-hidden">${esc(r.title)}</span></a>`
              : `<button type="button" class="btn btn--outline-dark btn--small" data-resource-generate="${esc(r.id)}">Download <span class="visually-hidden">${esc(r.title)}</span></button>`}
          </div>
        </div>`).join("") : states.empty({
        title: "No documents found",
        message: `Nothing matches “${form.elements.q.value.trim()}”${category === "all" ? "" : ` in ${label(D.resourceCategories, category)}`}. Try a broader term such as “energy” or “design”.`,
        actions: '<button type="button" class="btn btn--dark" data-clear-resources>Clear search</button>'
      });
    }

    toolbar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-resource-filter]");
      if (!button) return;
      category = button.dataset.resourceFilter;
      render();
    });
    form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
    form.addEventListener("input", render);

    table.addEventListener("click", async (event) => {
      if (event.target.closest("[data-clear-resources]")) {
        form.elements.q.value = "";
        category = "all";
        render();
        return;
      }
      const link = event.target.closest("[data-resource-download]");
      if (link) {
        V.toast("Download started.", { tone: "success" });
        return;
      }
      const button = event.target.closest("[data-resource-generate]");
      if (!button) return;
      const resource = D.resources.find((r) => r.id === button.dataset.resourceGenerate);
      V.setBusy(button, true, "Preparing");
      const row = button.closest(".resource-row");
      row.querySelector(".inline-alert")?.parentElement?.remove();
      try {
        const content = await V.request(() => generators[resource.generator](), { delay: 380 });
        V.download(`voltis-${resource.id}.${resource.format}`, content, MIME[resource.format]);
        V.toast(`${resource.title} downloaded. The file was generated in your browser.`, { tone: "success" });
      } catch (error) {
        const holder = document.createElement("div");
        holder.className = "resource-row__error";
        row.appendChild(holder);
        V.inlineError(holder, error.message, () => { holder.remove(); button.click(); });
      } finally {
        V.setBusy(button, false);
      }
    });

    render();
    V.loadInto(table, { work: () => D.resources, loadingHtml: states.loading("Loading documents"), errorTitle: "The library could not load", render: () => { loaded = true; render(); } });
  }

  if (page === "stories") initStories();
  if (page === "story") initStory();
  if (page === "projects") initProjects();
  if (page === "project") initProject();
  if (page === "resources") initResources();
})();
