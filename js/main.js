(() => {
  "use strict";

  const root = document.documentElement;
  const LEGACY_COMMIT = "6123cc2026dc6630edec2fb293be1073bb416a27";

  // English-only release. Set the document language before the legacy interaction
  // bundle runs so every refinement resolves to English.
  root.lang = "en";
  root.dataset.locale = "en";
  try { localStorage.setItem("voltis-locale", "en"); } catch (_) {}

  // Load the shared typography/media refinement layer with an explicit version
  // so GitHub Pages and browsers do not keep the previous cached styling.
  const refinementStyle = document.createElement("link");
  refinementStyle.rel = "stylesheet";
  refinementStyle.href = "./css/refinement.css?v=5";
  document.head.appendChild(refinementStyle);

  // Immediate release overrides: hide the retired language control and turn the
  // remaining Energy Architecture diagram into a photographic editorial frame.
  const releaseStyle = document.createElement("style");
  releaseStyle.textContent = `
    .locale-switch{display:none!important}
    .energy-map.energy-map--photo{position:relative;min-height:clamp(440px,52vw,680px);padding:0!important;overflow:hidden;background:#101512;border:1px solid rgba(248,250,246,.14)}
    .energy-map.energy-map--photo::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(9,12,11,.03) 38%,rgba(9,12,11,.88) 100%)}
    .energy-map--photo>img{display:block;width:100%;height:100%;min-height:clamp(440px,52vw,680px);object-fit:cover}
    .energy-map__photo-caption{position:absolute;z-index:2;left:clamp(20px,4vw,48px);right:clamp(20px,4vw,48px);bottom:clamp(20px,4vw,44px);display:grid;gap:8px;max-width:560px;color:#f8faf6}
    .energy-map__photo-caption span,.energy-map__photo-caption small{font-size:.6875rem;line-height:1.4;letter-spacing:.14em;text-transform:uppercase}
    .energy-map__photo-caption span{color:#8dff63;font-weight:820}
    .energy-map__photo-caption strong{font-size:clamp(1.8rem,3vw,3.4rem);line-height:.98;letter-spacing:-.04em}
    .energy-map__photo-caption small{color:rgba(248,250,246,.72)}
  `;
  document.head.appendChild(releaseStyle);

  function forceEnglish() {
    root.lang = "en";
    root.dataset.locale = "en";
    try { localStorage.setItem("voltis-locale", "en"); } catch (_) {}

    // The legacy bundle owns the complete EN dictionary. Triggering its EN
    // control translates every data-i18n/data-i18n-aria/data-i18n-alt node.
    const englishButton = document.querySelector('.locale-switch__btn[data-locale="en"]');
    if (englishButton) englishButton.click();

    // The product is now English-only, so the language selector is removed.
    document.querySelector(".locale-switch")?.remove();
    document.title = "VOLTIS — Electric mobility, designed around experience";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = "VOLTIS — electric mobility brand and product experience concept.";
  }

  function replaceEnergyArchitectureVisual() {
    const frame = document.querySelector(".energy-map");
    if (!frame || frame.classList.contains("energy-map--photo")) return;

    frame.className = "energy-map energy-map--photo";
    frame.removeAttribute("data-i18n-aria");
    frame.setAttribute("aria-label", "Reference image of utility-scale battery energy storage architecture");
    frame.innerHTML = `
      <img
        src="https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/megapack-resources.jpg"
        alt="Utility-scale battery energy storage system used as reference imagery for VOLTIS energy architecture"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
      >
      <div class="energy-map__photo-caption">
        <span>ENERGY / STORAGE / CONVERSION</span>
        <strong>From stored energy to motion.</strong>
        <small>Reference image: Tesla Megapack. Used for visual direction only.</small>
      </div>`;
  }

  function loadRefinement() {
    const existing = document.querySelector('script[data-voltis-refinement]');
    if (existing) return;

    const refinement = document.createElement("script");
    refinement.src = "./js/refinement.js?v=5";
    refinement.dataset.voltisRefinement = "true";
    refinement.onload = () => {
      forceEnglish();
      replaceEnergyArchitectureVisual();
    };
    refinement.onerror = () => {
      forceEnglish();
      replaceEnergyArchitectureVisual();
    };
    document.head.appendChild(refinement);
  }

  const legacy = document.createElement("script");
  legacy.src = `https://cdn.jsdelivr.net/gh/Ngh1aa/Voltis@${LEGACY_COMMIT}/js/main.js`;
  legacy.onload = () => {
    forceEnglish();
    replaceEnergyArchitectureVisual();
    loadRefinement();
  };
  legacy.onerror = () => {
    // Refined photography and English release metadata still apply if the CDN
    // is temporarily unavailable; the local page never loses its core layout.
    forceEnglish();
    replaceEnergyArchitectureVisual();
    loadRefinement();
  };
  document.head.appendChild(legacy);

  window.addEventListener("pageshow", () => {
    forceEnglish();
    replaceEnergyArchitectureVisual();
  });
})();