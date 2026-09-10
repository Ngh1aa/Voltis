(() => {
  "use strict";

  const MEDIA_VERSION = "2026-09-10-2";

  // Official Tesla-hosted reference media only. These assets are intentionally
  // centralized so the prototype can be re-skinned later without touching page markup.
  const IMG = {
    modelY: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/learn_new_model_y_hero.jpg",
    cybertruck: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Learn-Cybertruck-HFS-Hero.jpg",
    model3Dark: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/service-portal-hero.jpg",
    supercharger: "https://digitalassets.tesla.com/tesla-contents/image/upload/h_1056,w_1874,c_fit,f_auto,q_auto:best/Supercharging_Vehicle_Q4_21_Image",
    charging: "https://digitalassets.tesla.com/tesla-contents/image/upload/h_635,w_1018,c_fit,f_auto,q_auto:best/Charging_3Y_MYT_Image",
    touchscreen: "https://digitalassets.tesla.com/tesla-contents/image/upload/h_526,w_846,c_fit,f_auto,q_auto:best/Touchscreen_3Y_MYT_Image",
    controls: "https://digitalassets.tesla.com/tesla-contents/image/upload/h_450,w_720,c_fit,f_auto,q_auto:best/Physical-Controls_3Y_MYT_Image",
    essentials: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto:best/Essentials_3Y_Image",
    support: "https://digitalassets.tesla.com/tesla-contents/image/upload/h_1069,w_1728,c_fit,f_auto,q_auto:best/Support_3Y_MYT_Image",
    delivery: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/support-after-taking-delivery-hero-global.jpg",
    travel: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/travel-tips-tesla-hero.jpg",
    ecosystem: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Ecosystem_Header_Image.png",
    powerwall: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Learn-Powerwall-Home-Battery-Essential-01.jpg",
    megapack: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/megapack-resources.jpg",
    teslaApp: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/support-tesla-app-hero.jpg"
  };

  const VIDEO = {
    supercharging: "https://digitalassets.tesla.com/tesla-contents/video/upload/f_auto,q_auto:best/EN---Supercharging.mp4"
  };

  function installStyles() {
    if (document.querySelector('link[data-voltis-media-library]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `./css/media-library.css?v=${MEDIA_VERSION}`;
    link.dataset.voltisMediaLibrary = "true";
    document.head.appendChild(link);
  }

  function setImage(img, src, alt, priority = false) {
    if (!img) return;
    if (!img.dataset.voltisOriginalSrc) img.dataset.voltisOriginalSrc = img.getAttribute("src") || "";
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    img.setAttribute("alt", alt);
    img.setAttribute("decoding", "async");
    img.setAttribute("referrerpolicy", "no-referrer");
    img.dataset.mediaSource = "tesla";
    if (priority) {
      img.setAttribute("fetchpriority", "high");
      img.removeAttribute("loading");
    } else {
      img.setAttribute("loading", "lazy");
    }
  }

  function setMany(selector, items) {
    document.querySelectorAll(selector).forEach((img, index) => {
      const item = items[index];
      if (item) setImage(img, item.src, item.alt, Boolean(item.priority));
    });
  }

  function ensureHeroMedia(src, alt, label) {
    const hero = document.querySelector(".page-hero");
    if (!hero) return;
    let frame = hero.querySelector(".page-media-band");
    if (!frame) {
      frame = document.createElement("div");
      frame.className = "shell page-media-band";
      frame.innerHTML = '<img alt=""><div class="page-media-band__caption"></div>';
      hero.appendChild(frame);
    }
    setImage(frame.querySelector("img"), src, alt, true);
    const caption = frame.querySelector(".page-media-band__caption");
    if (caption) caption.textContent = label;
  }

  function addTeslaSourceBadge(container) {
    if (!container || container.querySelector(".tesla-source-badge")) return;
    const badge = document.createElement("span");
    badge.className = "tesla-source-badge";
    badge.textContent = "REFERENCE MEDIA / TESLA.COM";
    container.appendChild(badge);
  }

  function upgradeProjectMap() {
    const frame = document.querySelector(".project-map");
    if (!frame) return;
    frame.classList.add("project-map--photo");
    frame.innerHTML = '<img alt=""><div class="project-map__caption"><span>CHARGING / INFRASTRUCTURE</span><strong>Infrastructure is part of the journey.</strong></div>';
    setImage(frame.querySelector("img"), IMG.supercharger, "Tesla Supercharger reference image", true);
    addTeslaSourceBadge(frame);
  }

  function addGalleryFilm() {
    const grid = document.querySelector(".gallery-grid");
    if (!grid || grid.querySelector("[data-gallery-film]")) return;

    const figure = document.createElement("figure");
    figure.className = "gallery-item gallery-item--wide gallery-item--video";
    figure.dataset.galleryFilm = "true";
    figure.innerHTML = `
      <video controls muted playsinline preload="metadata" poster="${IMG.supercharger}">
        <source src="${VIDEO.supercharging}" type="video/mp4">
      </video>
      <figcaption>Film / charging experience · Tesla reference</figcaption>
      <span class="film-index">FILM / 01</span>`;
    grid.prepend(figure);
  }

  function homepage() {
    const heroFrame = document.querySelector(".hero__media-frame");
    setImage(heroFrame?.querySelector("img"), IMG.modelY, "Tesla Model Y reference photography used for the VOLTIS hero", true);
    addTeslaSourceBadge(heroFrame);

    setImage(document.querySelector('[data-model="aero"] .model-card__media img'), IMG.model3Dark, "Tesla Model 3 reference image used for VOLTIS AERO");
    setImage(document.querySelector('[data-model="terrain"] .model-card__media img'), IMG.cybertruck, "Tesla Cybertruck reference image used for VOLTIS TERRAIN");

    setMany(".cockpit-card img", [
      { src: IMG.touchscreen, alt: "Tesla touchscreen reference for a minimal digital cockpit" },
      { src: IMG.essentials, alt: "Tesla cabin reference for interior material and spatial design" },
      { src: IMG.controls, alt: "Tesla physical-controls reference for automotive interaction design" }
    ]);

    setMany(".signature-card > img", [
      { src: IMG.supercharger, alt: "Tesla Supercharger reference used for the VOLTIS energy visual system" },
      { src: IMG.touchscreen, alt: "Tesla vehicle interface reference used for the VOLTIS digital system" },
      { src: IMG.ecosystem, alt: "Tesla energy ecosystem reference used for the VOLTIS clean-energy system" }
    ]);

    setMany(".news-card__visual img", [
      { src: IMG.modelY, alt: "Tesla Model Y exterior reference" },
      { src: IMG.supercharger, alt: "Tesla Supercharger reference" },
      { src: IMG.servicePortal || IMG.model3Dark, alt: "Tesla service and engineering reference" }
    ]);

    const energyFrame = document.querySelector(".energy-map--photo");
    setImage(energyFrame?.querySelector("img"), IMG.megapack, "Tesla Megapack reference for VOLTIS energy architecture");
    addTeslaSourceBadge(energyFrame);
  }

  function vehicles() {
    setMany(".vehicle-panel img", [
      { src: IMG.model3Dark, alt: "Tesla Model 3 reference image for the VOLTIS AERO fastback direction", priority: true },
      { src: IMG.cybertruck, alt: "Tesla Cybertruck reference image for the VOLTIS TERRAIN utility direction", priority: true }
    ]);
    document.querySelectorAll(".vehicle-panel").forEach(addTeslaSourceBadge);
  }

  function company() {
    setImage(document.querySelector(".media-frame img"), IMG.servicePortal || IMG.model3Dark, "Tesla vehicle-service environment used as a technical company reference");
    addTeslaSourceBadge(document.querySelector(".media-frame"));
  }

  function projects() {
    upgradeProjectMap();
    setMany(".project-card__media img", [
      { src: IMG.supercharger, alt: "Tesla Supercharger infrastructure reference" },
      { src: IMG.ecosystem, alt: "Tesla integrated clean-energy ecosystem reference" },
      { src: IMG.megapack, alt: "Tesla Megapack utility-scale storage reference" }
    ]);
  }

  function stories() {
    setMany(".story-card__media img", [
      { src: IMG.essentials, alt: "Tesla Model 3 cabin reference" },
      { src: IMG.touchscreen, alt: "Tesla touchscreen interface reference" },
      { src: IMG.supercharger, alt: "Tesla Supercharger reference" },
      { src: IMG.servicePortal || IMG.model3Dark, alt: "Tesla technical service reference" },
      { src: IMG.ecosystem, alt: "Tesla integrated energy ecosystem reference" },
      { src: IMG.controls, alt: "Tesla physical controls reference" }
    ]);
  }

  function resources() {
    ensureHeroMedia(IMG.teslaApp, "Tesla app reference used to frame VOLTIS digital documentation", "DOCUMENTATION / SYSTEMS / EVIDENCE");
    addTeslaSourceBadge(document.querySelector(".page-media-band"));
  }

  function gallery() {
    setMany(".gallery-item img", [
      { src: IMG.modelY, alt: "Tesla Model Y exterior reference" },
      { src: IMG.servicePortal || IMG.model3Dark, alt: "Tesla technical service reference" },
      { src: IMG.essentials, alt: "Tesla Model 3 cabin reference" },
      { src: IMG.supercharger, alt: "Tesla Supercharger reference" },
      { src: IMG.ecosystem, alt: "Tesla energy ecosystem reference" },
      { src: IMG.megapack, alt: "Tesla Megapack storage reference" },
      { src: IMG.touchscreen, alt: "Tesla touchscreen reference" },
      { src: IMG.controls, alt: "Tesla physical controls reference" }
    ]);
    addGalleryFilm();
  }

  function careers() {
    setImage(document.querySelector(".careers-hero__media img"), IMG.servicePortal || IMG.model3Dark, "Tesla technical service reference used for the VOLTIS careers page", true);
    addTeslaSourceBadge(document.querySelector(".careers-hero__media"));
  }

  function contact() {
    ensureHeroMedia(IMG.delivery, "Tesla vehicle and charging reference used for VOLTIS contact routing", "PRODUCT / PROJECT / PARTNERSHIP");
    addTeslaSourceBadge(document.querySelector(".page-media-band"));
  }

  const handlers = {
    "index.html": homepage,
    "vehicles.html": vehicles,
    "company.html": company,
    "projects.html": projects,
    "stories.html": stories,
    "resources.html": resources,
    "gallery.html": gallery,
    "careers.html": careers,
    "contact.html": contact
  };

  function apply() {
    installStyles();
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    (handlers[file] || (file === "" ? homepage : null))?.();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply, { once: true });
  else apply();
  window.addEventListener("load", apply, { once: true });
  window.addEventListener("pageshow", apply);
  [450, 1100, 2200].forEach((delay) => window.setTimeout(apply, delay));
})();
