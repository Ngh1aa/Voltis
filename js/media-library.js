(() => {
  "use strict";

  const MEDIA_VERSION = "2026-11-12-free";

  // Free-licence photography (Wikimedia Commons: CC0, public domain, CC BY,
  // CC BY-SA), cropped and re-encoded locally in assets/photos/. Every file is
  // credited with author, source and licence on credits.html and in
  // docs/image-sources.md. Assets are centralised here so the prototype can be
  // re-skinned later without touching page markup.
  const P = "./assets/photos/";
  const IMG = {
    road: P + "road-light-trails.webp",
    aero: P + "aero-fastback.webp",
    terrain: P + "terrain-crossover.webp",
    terrainXl: P + "terrain-xl-suv.webp",
    city: P + "city-compact.webp",
    link: P + "link-van.webp",
    cockpit: P + "cockpit-display.webp",
    cabin: P + "cabin-interior.webp",
    steering: P + "steering-detail.webp",
    cluster: P + "instrument-cluster.webp",
    chargingNight: P + "charging-night.webp",
    chargingStreet: P + "charging-street-night.webp",
    chargingHub: P + "charging-hub.webp",
    connector: P + "connector-hand.webp",
    fleetDepot: P + "fleet-depot.webp",
    solarRoof: P + "solar-roof.webp",
    solarField: P + "solar-field.webp",
    storage: P + "battery-storage.webp",
    wind: P + "wind-offshore.webp",
    assembly: P + "assembly-line.webp",
    batteryLab: P + "battery-lab.webp",
    designModels: P + "design-models.webp"
  };

  const VIDEO = {
    charging: { src: "./assets/video/charging-station.webm", mp4: "./assets/video/charging-station.mp4", poster: P + "charging-station-film-poster.webp" }
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
    img.dataset.mediaSource = "commons";
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

  function upgradeProjectMap() {
    const frame = document.querySelector(".project-map");
    if (!frame) return;
    frame.classList.add("project-map--photo");
    frame.innerHTML = '<img alt=""><div class="project-map__caption"><span>CHARGING / INFRASTRUCTURE</span><strong>Infrastructure is part of the journey.</strong></div>';
    setImage(frame.querySelector("img"), IMG.chargingHub, "Rows of DC fast chargers under a clear sky at an open-air public charging hub", true);
  }

  function addGalleryFilm() {
    const grid = document.querySelector(".gallery-grid");
    if (!grid || grid.querySelector("[data-gallery-film]")) return;

    const figure = document.createElement("figure");
    figure.className = "gallery-item gallery-item--wide gallery-item--video";
    figure.dataset.galleryFilm = "true";
    figure.innerHTML = `
      <video controls muted playsinline preload="metadata" poster="${VIDEO.charging.poster}" aria-label="Short film of a public fast-charging station for electric cars">
        <source src="${VIDEO.charging.src}" type="video/webm">
        <source src="${VIDEO.charging.mp4}" type="video/mp4">
      </video>
      <figcaption>Film / charging experience / public fast-charging station</figcaption>
      <span class="film-index">FILM / 01</span>`;
    grid.prepend(figure);
  }

  function homepage() {
    const heroFrame = document.querySelector(".hero__media-frame");
    setImage(heroFrame?.querySelector("img"), IMG.road, "Long-exposure light trails of traffic on a motorway at dusk", true);

    setImage(document.querySelector('[data-model="aero"] .model-card__media img'), IMG.aero, "Dark grey electric fastback saloon in side profile, used as reference for VOLTIS AERO");
    setImage(document.querySelector('[data-model="terrain"] .model-card__media img'), IMG.terrain, "Grey electric crossover seen from the rear three-quarter, used as reference for VOLTIS TERRAIN");

    setMany(".cockpit-card img", [
      { src: IMG.cockpit, alt: "Electric car cockpit with a wide panoramic driver and infotainment display" },
      { src: IMG.cabin, alt: "Electric car cabin with tan seats, floating centre console and curved dashboard display" },
      { src: IMG.steering, alt: "Close-up of a perforated leather steering-wheel rim beside the instrument dials" }
    ]);

    setMany(".signature-card > img", [
      { src: IMG.chargingNight, alt: "Electric car plugged into a street charger on a rainy city evening" },
      { src: IMG.cockpit, alt: "Wide panoramic display in an electric car cockpit" },
      { src: IMG.wind, alt: "Offshore wind turbines standing in calm water under a pale sky" }
    ]);

    setMany(".news-card__visual img", [
      { src: IMG.designModels, alt: "Clay and painted scale models of car designs displayed in a museum" },
      { src: IMG.chargingStreet, alt: "Orange electric car at a charging station at night" },
      { src: IMG.batteryLab, alt: "Lithium-ion coin cells clamped in a laboratory test fixture under red light" }
    ]);

    const energyFrame = document.querySelector(".energy-map--photo");
    setImage(energyFrame?.querySelector("img"), IMG.storage, "Containerised utility-scale battery energy storage system on a gravel site");
  }

  function vehicles() {
    setMany(".vehicle-panel img", [
      { src: IMG.aero, alt: "Dark grey electric fastback saloon in side profile, used as reference for the VOLTIS AERO direction", priority: true },
      { src: IMG.terrain, alt: "Grey electric crossover seen from the rear three-quarter, used as reference for the VOLTIS TERRAIN direction", priority: true }
    ]);
  }

  function company() {
    setImage(document.querySelector(".media-frame img"), IMG.assembly, "Car bodies moving along a factory assembly line");
  }

  // Project and story cards are rendered from js/data.js, which carries their
  // images, so only the project hero map is upgraded here.
  function projects() {
    upgradeProjectMap();
  }

  function resources() {
    ensureHeroMedia(IMG.designModels, "Clay and painted scale models of car designs displayed in a museum", "DOCUMENTATION / SYSTEMS / EVIDENCE");
  }

  function gallery() {
    setMany(".gallery-item img", [
      { src: IMG.aero, alt: "Dark grey electric fastback saloon in side profile" },
      { src: IMG.assembly, alt: "Car bodies moving along a factory assembly line" },
      { src: IMG.cockpit, alt: "Electric car cockpit with a wide panoramic display" },
      { src: IMG.chargingNight, alt: "Electric car plugged into a street charger on a rainy city evening" },
      { src: IMG.wind, alt: "Offshore wind turbines standing in calm water" },
      { src: IMG.storage, alt: "Containerised utility-scale battery energy storage system" },
      { src: IMG.cluster, alt: "Illuminated digital instrument cluster of an electric car behind the steering wheel" },
      { src: IMG.cabin, alt: "Electric car cabin with tan seats and a curved dashboard display" }
    ]);
    addGalleryFilm();
  }

  function careers() {
    setImage(document.querySelector(".careers-hero__media img"), IMG.assembly, "Car bodies moving along a factory assembly line", true);
  }

  function contact() {
    ensureHeroMedia(IMG.chargingStreet, "Orange electric car at a charging station at night", "PRODUCT / PROJECT / PARTNERSHIP");
  }

  const handlers = {
    "index.html": homepage,
    "vehicles.html": vehicles,
    "company.html": company,
    "projects.html": projects,
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
