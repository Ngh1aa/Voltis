(() => {
  "use strict";

  const MEDIA_VERSION = "2026-09-10-1";
  const IMG = {
    engineering: "https://images.unsplash.com/photo-1581091212991-8891c7d4bd9b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    collaboration: "https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    chargingNight: "https://images.unsplash.com/photo-1767042286073-8b87bbbe68ff?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    interiorDark: "https://images.unsplash.com/photo-1770290405667-5586bd4431b3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    interiorLight: "https://images.unsplash.com/photo-1770287872664-f8e29eccc7d9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    dashboard: "https://images.unsplash.com/photo-1760435107992-f4714801666b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    blueprints: "https://images.unsplash.com/photo-1762146828422-50a8bd416d3c?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    roadSUV: "https://images.unsplash.com/photo-1775114501677-18ba958f38c6?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    roadEV: "https://images.unsplash.com/photo-1711921127505-f4a8727329a5?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    solar: "https://images.unsplash.com/photo-1749402676657-bb3299fdd5a5?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
    megapack: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/megapack-resources.jpg"
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
    if (priority) {
      img.setAttribute("fetchpriority", "high");
      img.removeAttribute("loading");
    } else {
      img.setAttribute("loading", "lazy");
    }
    if (!img.dataset.voltisFallbackBound) {
      img.dataset.voltisFallbackBound = "true";
      img.addEventListener("error", () => {
        const fallback = img.dataset.voltisOriginalSrc;
        if (fallback && img.getAttribute("src") !== fallback) img.setAttribute("src", fallback);
      });
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
    setImage(frame.querySelector("img"), IMG.chargingNight, "EV charging infrastructure at night", true);
  }

  function homepage() {
    setImage(document.querySelector(".hero__media-frame img"), IMG.roadEV, "Electric vehicle in motion on a winding road — reference photography for VOLTIS", true);
    setImage(document.querySelector('[data-model="aero"] .model-card__media img'), IMG.roadEV, "Electric fastback-style vehicle in motion — AERO visual reference");
    setImage(document.querySelector('[data-model="terrain"] .model-card__media img'), IMG.roadSUV, "Electric SUV in motion on a mountain road — TERRAIN visual reference");

    setMany(".cockpit-card img", [
      { src: IMG.dashboard, alt: "Digital instrument display in a modern electric vehicle" },
      { src: IMG.interiorLight, alt: "Light-toned electric vehicle cabin showing material and surface design" },
      { src: IMG.interiorDark, alt: "Modern electric vehicle cockpit with physical and digital controls" }
    ]);

    setMany(".signature-card > img", [
      { src: IMG.chargingNight, alt: "EV charging infrastructure used as an energy-system visual reference" },
      { src: IMG.dashboard, alt: "Digital vehicle instrument display used as an interface visual reference" },
      { src: IMG.solar, alt: "Solar generation field used as a clean-energy visual reference" }
    ]);

    setMany(".news-card__visual img", [
      { src: IMG.roadEV, alt: "Electric vehicle exterior in motion" },
      { src: IMG.chargingNight, alt: "Electric vehicle charging stations at night" },
      { src: IMG.engineering, alt: "Engineers collaborating in an automotive development facility" }
    ]);

    setImage(document.querySelector(".energy-map--photo > img"), IMG.megapack, "Utility-scale battery energy storage installation used as an energy architecture reference");
  }

  function vehicles() {
    setMany(".vehicle-panel img", [
      { src: IMG.roadEV, alt: "Electric performance-oriented vehicle driving on a curved road", priority: true },
      { src: IMG.roadSUV, alt: "Electric SUV driving on a winding mountain road", priority: true }
    ]);
  }

  function company() {
    setImage(document.querySelector(".media-frame img"), IMG.collaboration, "Cross-functional team collaborating around a table");
  }

  function projects() {
    upgradeProjectMap();
    setMany(".project-card__media img", [
      { src: IMG.chargingNight, alt: "Electric vehicle charging infrastructure at night" },
      { src: IMG.solar, alt: "Solar generation field supporting renewable-energy infrastructure" },
      { src: IMG.megapack, alt: "Utility-scale battery energy storage installation" }
    ]);
  }

  function stories() {
    setMany(".story-card__media img", [
      { src: IMG.interiorDark, alt: "Modern electric vehicle cabin and driver interface" },
      { src: IMG.dashboard, alt: "Digital instrument display showing vehicle information" },
      { src: IMG.chargingNight, alt: "Electric vehicle charging stations at night" },
      { src: IMG.engineering, alt: "Automotive engineers working together in a development facility" },
      { src: IMG.solar, alt: "Solar generation field" },
      { src: IMG.blueprints, alt: "Technical drawings used to represent disciplined product design" }
    ]);
  }

  function resources() {
    ensureHeroMedia(IMG.blueprints, "Technical drawings and documentation used as a VOLTIS resources visual", "DOCUMENTATION / SYSTEMS / EVIDENCE");
  }

  function gallery() {
    setMany(".gallery-item img", [
      { src: IMG.roadEV, alt: "Electric vehicle moving through a curved road" },
      { src: IMG.engineering, alt: "Automotive engineers in a development facility" },
      { src: IMG.interiorDark, alt: "Dark electric vehicle cabin and dashboard" },
      { src: IMG.chargingNight, alt: "EV charging infrastructure illuminated at night" },
      { src: IMG.solar, alt: "Solar generation field under an overcast sky" },
      { src: IMG.megapack, alt: "Utility-scale battery storage installation" },
      { src: IMG.dashboard, alt: "Close view of a digital vehicle instrument display" },
      { src: IMG.interiorLight, alt: "Light electric vehicle interior showing material detail" }
    ]);
  }

  function careers() {
    setImage(document.querySelector(".careers-hero__media img"), IMG.engineering, "Engineers collaborating in an automotive development facility", true);
  }

  function contact() {
    ensureHeroMedia(IMG.collaboration, "People in a professional project discussion", "PRODUCT / PROJECT / PARTNERSHIP");
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