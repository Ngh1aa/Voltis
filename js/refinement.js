(() => {
  "use strict";

  const copy = {
    headerCta: "Book a test drive",
    heroLine1: "Pure electric motion.",
    heroLine2: "Designed around the driving experience.",
    heroLead: "VOLTIS is an electric-mobility brand combining design, technology and systems thinking to create a clear, efficient and responsible driving experience.",
    heroVisualLabel: "Motorway light trails used as mood photography for the VOLTIS visual direction",
    heroVisualNote: "ON THE ROAD / AFTER DARK",
    modelsTitle: "Two directions. One electric platform.",
    modelsIntro: "Two vehicle directions serve distinct needs: a fastback focused on an agile driving experience and a utility-focused vehicle prioritising space and versatility.",
    prototypeNote: "Specifications are targets and may change. Images are for illustration; see image credits.",
    energyTitle: "Energy architecture, designed as a system.",
    energyLead: "VOLTIS structures the experience around energy flow — from storage and conversion to driver feedback — with clear information and fewer unnecessary interactions.",
    energyCta: "Explore the technology",
    experienceTitle: "Technology that serves the driver, not the distraction.",
    experienceIntro: "The in-car interface is designed to surface the right information at the right time, reduce unnecessary actions and keep attention on the journey.",
    sustainabilityTitle: "Transparency is the foundation of responsible development.",
    sustainabilityLead: "VOLTIS puts evidence, product lifecycle thinking and transparency ahead of environmental claims.",
    sustainabilityPrimary: "View development direction",
    sustainabilitySecondary: "Get the documents",
    galleryTitle: "One visual system across every touchpoint.",
    galleryIntro: "Vehicle, interior, charging and energy imagery follow one visual language: clear contrast, technical composition and deliberate accents.",
    newsTitle: "Design, technology and the electric ecosystem.",
    newsAll: "View all stories ↗",
    news3Text: "One visual system can scale consistently from the website and brand materials to retail spaces and the in-car experience.",
    careersTitle: "Build the next generation of mobility with us.",
    careersText: "Join the teams building VOLTIS vehicles, software and charging. Roles are open in Hanoi, Ho Chi Minh City and Da Nang.",
    careersCta: "Explore opportunities",
    contactTitle: "Start your journey with VOLTIS.",
    footerDisclaimer: "Concept product designed by Đỗ Anh Nghĩa.",
    heroPhotoAlt: "Long-exposure light trails of traffic on a motorway at dusk",
    aeroPhotoAlt: "Dark grey electric fastback saloon in side profile, used as reference for VOLTIS AERO",
    terrainPhotoAlt: "Grey electric crossover seen from the rear three-quarter, used as reference for VOLTIS TERRAIN",
    cockpitAlt: "Electric car cockpit with a wide panoramic driver and infotainment display",
    materialAlt: "Electric car cabin with tan seats, floating centre console and curved dashboard display",
    controlsAlt: "Close-up of a perforated leather steering-wheel rim beside the instrument dials",
    galleryEnergyAlt: "Electric car plugged into a street charger on a rainy city evening",
    galleryInteriorAlt: "Wide panoramic display in an electric car cockpit",
    gallerySolarAlt: "Offshore wind turbines standing in calm water under a pale sky",
    newsDesignAlt: "Clay and painted scale models of car designs displayed in a museum",
    newsChargingAlt: "Orange electric car at a charging station at night",
    newsCompanyAlt: "Lithium-ion coin cells clamped in a laboratory test fixture under red light"
  };

  const media = {
    hero: {
      selector: ".hero__media-frame img",
      src: "./assets/photos/road-light-trails.webp",
      altKey: "heroPhotoAlt",
      fallback: "./assets/voltis-aero.svg"
    },
    aero: {
      selector: '[data-model="aero"] .model-card__media img',
      src: "./assets/photos/aero-fastback.webp",
      altKey: "aeroPhotoAlt",
      fallback: "./assets/voltis-aero.svg"
    },
    terrain: {
      selector: '[data-model="terrain"] .model-card__media img',
      src: "./assets/photos/terrain-crossover.webp",
      altKey: "terrainPhotoAlt",
      fallback: "./assets/voltis-terrain.svg"
    }
  };

  const cockpitMedia = [
    [".cluster-visual", "./assets/photos/cockpit-display.webp", "cockpitAlt", "COCKPIT / HMI"],
    [".material-visual", "./assets/photos/cabin-interior.webp", "materialAlt", "CABIN / MATERIAL"],
    [".switch-visual", "./assets/photos/steering-detail.webp", "controlsAlt", "CONTROLS / TOUCH"]
  ];

  const signatureMedia = [
    [".signature-card--rail", "./assets/photos/charging-night.webp", "galleryEnergyAlt"],
    [".signature-card--index", "./assets/photos/cockpit-display.webp", "galleryInteriorAlt"],
    [".signature-card--signal", "./assets/photos/wind-offshore.webp", "gallerySolarAlt"]
  ];

  const newsMedia = [
    [".news-card__visual--a", "./assets/photos/design-models.webp", "newsDesignAlt", "01"],
    [".news-card__visual--b", "./assets/photos/charging-street-night.webp", "newsChargingAlt", "02"],
    [".news-card__visual--c", "./assets/photos/battery-lab.webp", "newsCompanyAlt", "03"]
  ];

  function imageMarkup(src, altKey) {
    return `<img src="${src}" alt="" data-i18n-alt="${altKey}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
  }

  function upgradeMedia() {
    Object.values(media).forEach(item => {
      const img = document.querySelector(item.selector);
      if (!img) return;
      img.src = item.src;
      img.setAttribute("data-i18n-alt", item.altKey);
      img.setAttribute("decoding", "async");
      img.setAttribute("referrerpolicy", "no-referrer");
      if (item.fallback) img.onerror = function () { this.onerror = null; this.src = item.fallback; };
    });

    cockpitMedia.forEach(([selector, src, altKey, credit]) => {
      const frame = document.querySelector(selector);
      if (!frame) return;
      frame.classList.remove("cluster-visual", "material-visual", "switch-visual");
      frame.classList.add("media-visual");
      frame.innerHTML = `${imageMarkup(src, altKey)}<span class="media-credit">${credit}</span>`;
    });

    signatureMedia.forEach(([selector, src, altKey]) => {
      const card = document.querySelector(selector);
      if (!card || card.querySelector(":scope > img")) return;
      card.insertAdjacentHTML("afterbegin", imageMarkup(src, altKey));
    });

    newsMedia.forEach(([selector, src, altKey, index]) => {
      const frame = document.querySelector(selector);
      if (!frame) return;
      frame.innerHTML = `${imageMarkup(src, altKey)}<span>${index}</span>`;
    });
  }

  function applyCopy() {
    document.documentElement.lang = "en";
    document.documentElement.dataset.locale = "en";
    Object.entries(copy).forEach(([key, value]) => {
      document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el => { el.textContent = value; });
      document.querySelectorAll(`[data-i18n-aria="${key}"]`).forEach(el => { el.setAttribute("aria-label", value); });
      document.querySelectorAll(`[data-i18n-alt="${key}"]`).forEach(el => { el.setAttribute("alt", value); });
    });
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = "VOLTIS — electric vehicles, charging and energy, designed as one system.";
  }

  upgradeMedia();
  applyCopy();
  window.addEventListener("pageshow", () => {
    upgradeMedia();
    applyCopy();
  });
})();
