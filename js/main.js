(() => {
  "use strict";

  const root = document.documentElement;
  const LEGACY_COMMIT = "6123cc2026dc6630edec2fb293be1073bb416a27";

  root.lang = "en";
  root.dataset.locale = "en";
  try { localStorage.setItem("voltis-locale", "en"); } catch (_) {}

  if (!document.querySelector('script[data-voltis-media-library]')) {
    const media = document.createElement("script");
    media.src = "./js/media-library.js?v=2026-09-10-1";
    media.dataset.voltisMediaLibrary = "true";
    document.head.appendChild(media);
  }

  const refinementStyle = document.createElement("link");
  refinementStyle.rel = "stylesheet";
  refinementStyle.href = "./css/refinement.css?v=6";
  document.head.appendChild(refinementStyle);

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
    const englishButton = document.querySelector('.locale-switch__btn[data-locale="en"]');
    if (englishButton) englishButton.click();
    document.querySelector(".locale-switch")?.remove();
    document.title = "VOLTIS — Electric mobility, designed around experience";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = "VOLTIS — electric mobility brand and product experience concept.";
  }

  function wireSiteNavigation() {
    const destinations = {
      "#models": "./vehicles.html",
      "#company": "./company.html",
      "#projects": "./projects.html",
      "#news": "./stories.html",
      "#resources": "./resources.html",
      "#contact": "./contact.html",
      "#gallery": "./gallery.html",
      "#careers": "./careers.html"
    };
    Object.entries(destinations).forEach(([hash, path]) => {
      document.querySelectorAll(`a[href="${hash}"]`).forEach((link) => link.setAttribute("href", path));
    });
  }

  function replaceEnergyArchitectureVisual() {
    const frame = document.querySelector(".energy-map");
    if (!frame || frame.classList.contains("energy-map--photo")) return;
    frame.className = "energy-map energy-map--photo";
    frame.removeAttribute("data-i18n-aria");
    frame.setAttribute("aria-label", "Reference image of utility-scale battery energy storage architecture");
    frame.innerHTML = `
      <img src="https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/megapack-resources.jpg" alt="Utility-scale battery energy storage system used as reference imagery for VOLTIS energy architecture" loading="lazy" decoding="async" referrerpolicy="no-referrer">
      <div class="energy-map__photo-caption">
        <span>ENERGY / STORAGE / CONVERSION</span>
        <strong>From stored energy to motion.</strong>
        <small>Reference image: Tesla Megapack. Used for visual direction only.</small>
      </div>`;
  }

  function loadRefinement() {
    if (document.querySelector('script[data-voltis-refinement]')) return;
    const refinement = document.createElement("script");
    refinement.src = "./js/refinement.js?v=6";
    refinement.dataset.voltisRefinement = "true";
    refinement.onload = () => { forceEnglish(); replaceEnergyArchitectureVisual(); wireSiteNavigation(); };
    refinement.onerror = () => { forceEnglish(); replaceEnergyArchitectureVisual(); wireSiteNavigation(); };
    document.head.appendChild(refinement);
  }

  const legacy = document.createElement("script");
  legacy.src = `https://cdn.jsdelivr.net/gh/Ngh1aa/Voltis@${LEGACY_COMMIT}/js/main.js`;
  legacy.onload = () => { forceEnglish(); replaceEnergyArchitectureVisual(); wireSiteNavigation(); loadRefinement(); };
  legacy.onerror = () => { forceEnglish(); replaceEnergyArchitectureVisual(); wireSiteNavigation(); loadRefinement(); };
  document.head.appendChild(legacy);

  wireSiteNavigation();
  window.addEventListener("pageshow", () => { forceEnglish(); replaceEnergyArchitectureVisual(); wireSiteNavigation(); });
})();