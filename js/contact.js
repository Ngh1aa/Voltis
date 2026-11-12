/* VOLTIS contact: routed enquiry form with validation, loading, error and success states. */
(() => {
  "use strict";

  const V = window.Voltis;
  const { esc, fmt } = V;
  if (document.body.dataset.page !== "contact") return;

  const wrap = document.querySelector("[data-contact-wrap]");
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const feedback = form.querySelector("[data-form-feedback]");
  const topicMap = { vehicle: "Vehicle interest", project: "Project collaboration", partnership: "Partnership", media: "Media / information", careers: "Careers", other: "Other" };

  function applyTopic(key, ref) {
    if (!topicMap[key]) return;
    form.elements.topic.value = topicMap[key];
    if (ref && !form.elements.message.value) {
      const project = V.catalogue.project(ref);
      if (project) form.elements.message.value = `I would like to discuss the ${project.title} project.`;
    }
  }
  applyTopic(V.query("topic"), V.query("ref"));

  document.querySelectorAll("[data-topic-link]").forEach((link) => {
    link.addEventListener("click", () => {
      applyTopic(link.dataset.topicLink);
      V.setQuery({ topic: link.dataset.topicLink });
      window.setTimeout(() => form.elements.name.focus({ preventScroll: true }), 300);
    });
  });

  V.clearErrorsOnInput(form);
  const counter = form.querySelector("[data-char-count]");
  form.elements.message.addEventListener("input", () => { counter.textContent = form.elements.message.value.length; });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    feedback.innerHTML = "";
    const ok = V.validateForm(form, {
      name: [V.validators.required, V.validators.minLength(2)],
      email: [V.validators.required, V.validators.email],
      message: [V.validators.required, V.validators.minLength(20)],
      consent: [V.validators.checked("Confirm that you understand this message stays in this browser tab.")]
    });
    if (!ok) return;
    const button = form.querySelector("[type=submit]");
    V.setBusy(button, true, "Sending");
    const values = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      topic: form.elements.topic.value,
      organisation: form.elements.organisation.value.trim(),
      message: form.elements.message.value.trim()
    };
    try {
      const entry = await V.request(() => V.store.update((s) => {
        const item = { ref: V.reference("EN"), ...values, createdAt: new Date().toISOString() };
        s.enquiries.unshift(item);
        return item;
      }));
      renderSuccess(entry);
    } catch (error) {
      V.setBusy(button, false);
      V.inlineError(feedback, `${error.message} Your message is still in the form.`, () => form.requestSubmit());
    }
  });

  function renderSuccess(entry) {
    form.hidden = true;
    const panel = document.createElement("div");
    panel.className = "confirmation confirmation--inline";
    panel.dataset.state = "confirmed";
    panel.tabIndex = -1;
    panel.innerHTML = `
      <span class="eyebrow">MESSAGE RECORDED</span>
      <h3>Thanks, ${esc(entry.name.split(" ")[0])}. Your message is saved.</h3>
      <p class="confirmation__ref">Reference <strong data-enquiry-ref>${esc(entry.ref)}</strong></p>
      <dl class="review-list">
        <div><dt>Topic</dt><dd>${esc(entry.topic)}</dd></div>
        <div><dt>Reply to</dt><dd>${esc(entry.email)}</dd></div>
        <div><dt>Recorded</dt><dd>${esc(fmt.dateTime(entry.createdAt))}</dd></div>
      </dl>
      <div class="notice"><strong>This is a prototype.</strong> Nothing was sent and no one will reply. The message is kept in this browser tab so you can review it under My VOLTIS.</div>
      <div class="confirmation__actions">
        <a class="btn btn--dark" href="./account.html?tab=enquiries">View my enquiries</a>
        <button type="button" class="btn btn--outline-dark" data-new-message>Write another message</button>
      </div>`;
    wrap.appendChild(panel);
    panel.focus();
    panel.querySelector("[data-new-message]").addEventListener("click", () => {
      panel.remove();
      form.reset();
      counter.textContent = "0";
      form.hidden = false;
      V.setBusy(form.querySelector("[type=submit]"), false);
      form.elements.name.focus();
    });
  }
})();
