/* VOLTIS careers: role list with filters, job detail, application wizard. */
(() => {
  "use strict";

  const V = window.Voltis;
  const { esc, fmt, catalogue, states } = V;
  const page = document.body.dataset.page;
  const D = V.data;
  const disciplineLabel = (id) => (D.disciplines.find((d) => d.id === id) || { label: id }).label;
  const activeApplication = (jobId) => V.store.get().applications.find((a) => a.jobId === jobId && a.status === "submitted");

  /* =========================================================
     careers.html — role board
     ========================================================= */
  function initCareers() {
    const form = document.querySelector("[data-job-filters]");
    const list = document.querySelector("[data-job-list]");
    const count = document.querySelector("[data-result-count]");
    if (!form || !list) return;

    const locations = [...new Set(D.jobs.map((j) => j.location))];
    const types = [...new Set(D.jobs.map((j) => j.type))];
    form.elements.discipline.innerHTML = `<option value="all">All disciplines</option>${D.disciplines.map((d) => `<option value="${esc(d.id)}">${esc(d.label)}</option>`).join("")}`;
    form.elements.location.innerHTML = `<option value="all">All locations</option>${locations.map((l) => `<option value="${esc(l)}">${esc(l)}</option>`).join("")}`;
    form.elements.type.innerHTML = `<option value="all">All contract types</option>${types.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join("")}`;
    ["discipline", "location", "type"].forEach((name) => {
      const value = V.query(name);
      if (value && [...form.elements[name].options].some((o) => o.value === value)) form.elements[name].value = value;
    });
    form.elements.q.value = V.query("q") || "";
    let loaded = false;

    function render() {
      const f = { discipline: form.elements.discipline.value, location: form.elements.location.value, type: form.elements.type.value, q: form.elements.q.value.trim() };
      V.setQuery({ ...f, q: f.q || null });
      if (!loaded) return;
      const q = f.q.toLowerCase();
      const jobs = D.jobs.filter((j) =>
        (f.discipline === "all" || j.discipline === f.discipline)
        && (f.location === "all" || j.location === f.location)
        && (f.type === "all" || j.type === f.type)
        && (!q || `${j.title} ${j.summary} ${disciplineLabel(j.discipline)}`.toLowerCase().includes(q)));
      count.textContent = `${jobs.length} ${jobs.length === 1 ? "role" : "roles"}`;
      list.innerHTML = jobs.length ? jobs.map((j) => {
        const applied = activeApplication(j.id);
        return `<div class="job-row" data-job-id="${esc(j.id)}">
          <div><h3><a href="./job.html?id=${esc(j.id)}">${esc(j.title)}</a></h3><p>${esc(disciplineLabel(j.discipline))}${applied ? ' <span class="status-pill status-pill--ok">Applied</span>' : ""}</p></div>
          <p>${esc(j.location)} / ${esc(j.workMode)} / ${esc(j.type)}</p>
          <a class="text-link" href="./job.html?id=${esc(j.id)}" aria-label="View role: ${esc(j.title)}">View role ↗</a>
        </div>`;
      }).join("") : states.empty({
        title: "No roles match these filters",
        message: "Try another location or discipline, or register interest for future roles.",
        actions: '<button type="button" class="btn btn--dark" data-clear-jobs>Clear filters</button><a class="btn btn--outline-dark" href="./contact.html?topic=careers#form">Register future interest</a>'
      });
    }

    form.addEventListener("change", render);
    form.addEventListener("input", render);
    form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
    list.addEventListener("click", (event) => {
      if (!event.target.closest("[data-clear-jobs]")) return;
      form.reset();
      render();
    });

    render();
    V.loadInto(list, { work: () => D.jobs, loadingHtml: states.loading("Loading roles"), errorTitle: "Roles could not load", render: () => { loaded = true; render(); } });
  }

  /* =========================================================
     job.html — role detail
     ========================================================= */
  function initJob() {
    const root = document.querySelector("[data-job-root]");
    if (!root) return;
    const id = V.query("id");
    V.loadInto(root, {
      work: () => catalogue.job(id),
      errorTitle: "This role could not load",
      render: (job) => {
        if (!job) return renderJobNotFound(root, id);
        document.title = `${job.title} — VOLTIS Careers`;
        const applied = activeApplication(job.id);
        const list = (items) => `<ul class="tick-list">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
        root.innerHTML = `
          <section class="page-hero detail-hero">
            <div class="shell detail-hero__grid">
              <div>
                <nav class="breadcrumb" aria-label="Breadcrumb"><a href="./careers.html#roles">Careers</a><span aria-hidden="true">/</span><span aria-current="page">${esc(disciplineLabel(job.discipline))}</span></nav>
                <span class="eyebrow eyebrow--light">${esc(disciplineLabel(job.discipline).toUpperCase())}</span>
                <h1 class="detail-hero__title--long">${esc(job.title)}</h1>
                <p>${esc(job.summary)}</p>
                <div class="page-hero__actions">
                  ${applied
                    ? `<a class="btn btn--energy" href="./account.html?tab=applications">View your application</a>`
                    : `<a class="btn btn--energy" href="./apply.html?job=${esc(job.id)}">Apply for this role</a>`}
                  <a class="btn btn--outline" href="./careers.html#roles">All roles</a>
                </div>
              </div>
              <dl class="stat-list stat-list--hero">
                <div><dt>Location</dt><dd>${esc(job.location)}</dd></div>
                <div><dt>Work mode</dt><dd>${esc(job.workMode)}</dd></div>
                <div><dt>Contract</dt><dd>${esc(job.type)}</dd></div>
                <div><dt>Posted</dt><dd>${esc(fmt.date(job.posted))}</dd></div>
              </dl>
            </div>
          </section>
          <section class="section section--white">
            <div class="shell job-layout">
              <div class="job-body">
                ${applied ? `<div class="notice notice--ok">You applied for this role on ${esc(fmt.dateTime(applied.createdAt))} (reference ${esc(applied.ref)}).</div>` : ""}
                <h2>What you will do</h2>${list(job.responsibilities)}
                <h2>What you bring</h2>${list(job.requirements)}
                <h2>Nice to have</h2>${list(job.niceToHave)}
              </div>
              <aside class="job-aside">
                <span class="eyebrow">HOW WE HIRE</span>
                <ol class="process-list"><li>Application review</li><li>Conversation with the hiring lead</li><li>Portfolio or work review</li><li>Team conversation and decision</li></ol>
                <p class="fine-print">VOLTIS is an equal-opportunity employer. We reply to every application within ten working days.</p>
                ${applied ? "" : `<a class="btn btn--dark" href="./apply.html?job=${esc(job.id)}">Apply now</a>`}
              </aside>
            </div>
          </section>`;
      }
    });
  }

  function renderJobNotFound(root, id) {
    document.title = "Role not found — VOLTIS";
    root.innerHTML = `<section class="section section--paper"><div class="shell">${states.notFound({
      title: "This role is not listed.",
      message: id ? `No role matches “${id}”. It may have closed or been renamed.` : "No role was specified in the link.",
      actions: '<a class="btn btn--dark" href="./careers.html#roles">See open roles</a><a class="btn btn--outline-dark" href="./contact.html?topic=careers#form">Register future interest</a>'
    })}</div></section>`;
  }

  /* =========================================================
     apply.html — application wizard
     ========================================================= */
  function initApply() {
    const root = document.querySelector("[data-apply-root]");
    if (!root) return;
    const jobId = V.query("job");
    const confirmed = V.query("confirmed");
    const MAX_CV = 5 * 1024 * 1024;
    const CV_TYPES = /\.(pdf|docx?|odt)$/i;

    if (confirmed) {
      const app = V.store.get().applications.find((a) => a.ref === confirmed);
      if (app) return renderDone(app);
    }

    const job = catalogue.job(jobId);
    if (!job) return renderJobNotFound(root, jobId);
    document.title = `Apply: ${job.title} — VOLTIS Careers`;

    const existing = activeApplication(job.id);
    if (existing) {
      root.innerHTML = `<section class="section section--paper"><div class="shell">${states.empty({
        title: "You have already applied for this role",
        message: `Application ${existing.ref} was submitted on ${fmt.dateTime(existing.createdAt)}. Withdraw it from My applications if you want to apply again.`,
        actions: '<a class="btn btn--dark" href="./account.html?tab=applications">Go to My applications</a><a class="btn btn--outline-dark" href="./careers.html#roles">See other roles</a>'
      })}</div></section>`;
      return;
    }

    const drafts = V.store.get().drafts;
    let draft = drafts.apply && drafts.apply.jobId === job.id ? drafts.apply : { jobId: job.id, step: "details", fullName: "", email: "", phone: "", city: "", link: "", cv: null, motivation: "", consent: false };
    const save = () => V.store.update((s) => { s.drafts.apply = draft; });
    const STEPS = [["details", "Your details"], ["cv", "CV and motivation"], ["review", "Review"]];

    function stepper() {
      const idx = STEPS.findIndex(([id]) => id === draft.step);
      return `<ol class="stepper" aria-label="Application progress">${STEPS.map(([id, text], i) => {
        const st = i < idx ? "done" : i === idx ? "current" : "todo";
        const inner = `<span class="stepper__index">0${i + 1}</span><span class="stepper__label">${text}</span>`;
        return `<li class="stepper__item is-${st}">${st === "done" ? `<button type="button" data-goto="${id}" aria-label="Back to ${text}">${inner}</button>` : `<span ${st === "current" ? 'aria-current="step"' : ""}>${inner}</span>`}</li>`;
      }).join("")}</ol>`;
    }

    function body() {
      if (draft.step === "details") {
        return `<h3>Your details</h3>
          <div class="form-grid">
            <div class="field"><label for="fullName">Full name</label><input id="fullName" name="fullName" autocomplete="name" value="${esc(draft.fullName)}"></div>
            <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" value="${esc(draft.email)}"></div>
          </div>
          <div class="form-grid">
            <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="0912 345 678" value="${esc(draft.phone)}"></div>
            <div class="field"><label for="city">City you live in</label><input id="city" name="city" autocomplete="address-level2" value="${esc(draft.city)}"></div>
          </div>
          <div class="field"><label for="link">Portfolio or LinkedIn link (optional)</label><input id="link" name="link" type="url" inputmode="url" placeholder="https://" value="${esc(draft.link)}"></div>
          <div class="wizard-nav"><a class="btn btn--outline-dark" href="./job.html?id=${esc(job.id)}">Back to role</a><button type="submit" class="btn btn--dark">Continue</button></div>`;
      }
      if (draft.step === "cv") {
        return `<h3>CV and motivation</h3>
          <div class="field">
            <label for="cv">CV file (PDF, DOC, DOCX or ODT, up to 5 MB)</label>
            <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx,.odt">
            <p class="field-hint" data-cv-current>${draft.cv ? `Selected: <strong>${esc(draft.cv.name)}</strong> (${esc(fmt.bytes(draft.cv.size))}). Choose another file to replace it.` : "The file stays on your device. PDF, DOC or DOCX, up to 10 MB."}</p>
          </div>
          <div class="field"><label for="motivation">Why this role at VOLTIS?</label><textarea id="motivation" name="motivation" rows="6" maxlength="1500" placeholder="Two or three sentences are enough.">${esc(draft.motivation)}</textarea><p class="field-hint"><span data-char-count>${draft.motivation.length}</span> of 1500 characters, at least 40.</p></div>
          <div class="check-field"><input id="consent" name="consent" type="checkbox" ${draft.consent ? "checked" : ""}><label for="consent">I agree that VOLTIS may store my application and CV for this and similar roles for 12 months.</label></div>
          <div class="wizard-nav"><button type="button" class="btn btn--outline-dark" data-goto="details">Back</button><button type="submit" class="btn btn--dark">Continue</button></div>`;
      }
      return `<h3>Review your application</h3>
        <dl class="review-list">
          <div><dt>Role</dt><dd>${esc(job.title)}<br><small>${esc(job.location)}, ${esc(job.type)}</small></dd><dd></dd></div>
          <div><dt>Contact</dt><dd>${esc(draft.fullName)}<br><small>${esc(draft.email)}, ${esc(draft.phone)}, ${esc(draft.city)}</small>${draft.link ? `<br><small>${esc(draft.link)}</small>` : ""}</dd><dd><button type="button" class="text-link text-link--button" data-goto="details">Change</button></dd></div>
          <div><dt>CV</dt><dd>${esc(draft.cv.name)} <small>(${esc(fmt.bytes(draft.cv.size))})</small></dd><dd><button type="button" class="text-link text-link--button" data-goto="cv">Change</button></dd></div>
          <div><dt>Motivation</dt><dd>${esc(draft.motivation)}</dd><dd><button type="button" class="text-link text-link--button" data-goto="cv">Change</button></dd></div>
        </dl>
        <div class="notice">Check your details before you submit. You can withdraw your application at any time from My applications.</div>
        <div data-submit-feedback></div>
        <div class="wizard-nav"><button type="button" class="btn btn--outline-dark" data-goto="cv">Back</button><button type="submit" class="btn btn--dark" data-submit-application>Submit application</button></div>`;
    }

    function render() {
      save();
      root.innerHTML = `
        <section class="section section--paper"><div class="shell">
          <div class="wizard">
            <div class="wizard__head"><nav class="breadcrumb breadcrumb--dark" aria-label="Breadcrumb"><a href="./careers.html#roles">Careers</a><span aria-hidden="true">/</span><a href="./job.html?id=${esc(job.id)}">${esc(job.title)}</a></nav><span class="eyebrow">APPLICATION</span><h2>Apply: ${esc(job.title)}</h2></div>
            ${stepper()}
            <form class="wizard__panel" novalidate data-apply-step="${draft.step}">${body()}</form>
          </div>
        </div></section>`;
      const form = root.querySelector("form");
      V.clearErrorsOnInput(form);
      const counter = form.querySelector("[data-char-count]");
      if (counter) form.elements.motivation.addEventListener("input", () => { counter.textContent = form.elements.motivation.value.length; });
    }

    root.addEventListener("click", (event) => {
      const goto = event.target.closest("[data-goto]");
      if (!goto) return;
      const form = root.querySelector("form");
      if (draft.step === "cv" && form) { draft.motivation = form.elements.motivation.value; draft.consent = form.elements.consent.checked; }
      draft.step = goto.dataset.goto;
      render();
    });

    root.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      if (draft.step === "details") {
        const ok = V.validateForm(form, {
          fullName: [V.validators.required, V.validators.minLength(2)],
          email: [V.validators.required, V.validators.email],
          phone: [V.validators.required, V.validators.phone],
          city: [V.validators.required],
          link: [V.validators.url]
        });
        Object.assign(draft, { fullName: form.elements.fullName.value.trim(), email: form.elements.email.value.trim(), phone: form.elements.phone.value.trim(), city: form.elements.city.value.trim(), link: form.elements.link.value.trim() });
        save();
        if (ok) { draft.step = "cv"; render(); }
        return;
      }
      if (draft.step === "cv") {
        const file = form.elements.cv.files[0];
        const cvRule = () => {
          if (!file && !draft.cv) return "Choose your CV file.";
          if (file && !CV_TYPES.test(file.name)) return "Use a PDF, DOC, DOCX or ODT file.";
          if (file && file.size > MAX_CV) return `This file is ${fmt.bytes(file.size)}. Use a file up to 5 MB.`;
          if (file && file.size === 0) return "This file is empty. Choose another file.";
          return "";
        };
        const ok = V.validateForm(form, {
          cv: [cvRule],
          motivation: [V.validators.required, V.validators.minLength(40)],
          consent: [V.validators.checked("Confirm that VOLTIS may store your application.")]
        });
        if (file && !cvRule()) draft.cv = { name: file.name, size: file.size, type: file.type || "" };
        draft.motivation = form.elements.motivation.value.trim();
        draft.consent = form.elements.consent.checked;
        save();
        if (ok) { draft.step = "review"; render(); }
        return;
      }
      const button = form.querySelector("[data-submit-application]");
      const feedback = form.querySelector("[data-submit-feedback]");
      feedback.innerHTML = "";
      V.setBusy(button, true, "Submitting");
      try {
        const app = await V.request(() => V.store.update((s) => {
          if (s.applications.some((a) => a.jobId === job.id && a.status === "submitted")) throw new Error("You already have an active application for this role.");
          const entry = { ref: V.reference("AP"), jobId: job.id, status: "submitted", fullName: draft.fullName, email: draft.email, phone: draft.phone, city: draft.city, link: draft.link, cv: draft.cv, motivation: draft.motivation, createdAt: new Date().toISOString() };
          s.applications.unshift(entry);
          delete s.drafts.apply;
          return entry;
        }));
        V.setQuery({ job: null, confirmed: app.ref });
        renderDone(app);
      } catch (error) {
        V.setBusy(button, false);
        V.inlineError(feedback, error.message, () => button.click());
      }
    });

    render();
  }

  function renderDone(app) {
    const root = document.querySelector("[data-apply-root]");
    const job = catalogue.job(app.jobId);
    document.title = "Application received — VOLTIS Careers";
    root.innerHTML = `<section class="section section--paper"><div class="shell">
      <div class="confirmation" data-state="confirmed" tabindex="-1">
        <span class="eyebrow">APPLICATION RECEIVED</span>
        <h2>Thank you, ${esc(app.fullName.split(" ")[0])}.</h2>
        <p class="confirmation__ref">Reference <strong data-application-ref>${esc(app.ref)}</strong></p>
        <dl class="review-list">
          <div><dt>Role</dt><dd>${esc(job ? job.title : "Role no longer listed")}</dd></div>
          <div><dt>CV</dt><dd>${esc(app.cv.name)}</dd></div>
          <div><dt>Submitted</dt><dd>${esc(fmt.dateTime(app.createdAt))}</dd></div>
        </dl>
        <div class="notice">Application received. We've emailed a confirmation to <strong>${esc(app.email)}</strong>. The hiring team replies within ten working days. You can follow or withdraw it in My applications.</div>
        <div class="confirmation__actions">
          <a class="btn btn--dark" href="./account.html?tab=applications">View My applications</a>
          <a class="btn btn--outline-dark" href="./careers.html#roles">See other roles</a>
        </div>
      </div></div></section>`;
    root.querySelector(".confirmation").focus();
  }

  if (page === "careers") initCareers();
  if (page === "job") initJob();
  if (page === "apply") initApply();
})();
