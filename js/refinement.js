(() => {
  "use strict";

  const copy = {
    headerCta: "Register interest",
    heroLine1: "Pure electric motion.",
    heroLine2: "Designed around the driving experience.",
    heroLead: "VOLTIS is an electric-mobility brand concept combining design, technology and systems thinking to create a clear, efficient and responsible driving experience.",
    heroVisualLabel: "Tesla reference photography for the VOLTIS visual direction",
    heroVisualNote: "REFERENCE IMAGE / NOT A VOLTIS PRODUCT",
    modelsTitle: "Two directions. One electric platform.",
    modelsIntro: "Two vehicle directions serve distinct needs: a fastback focused on an agile driving experience and a utility-focused vehicle prioritising space and versatility.",
    prototypeNote: "AERO/TERRAIN names and characteristics are conceptual. Photography is sourced from Tesla as visual reference and does not represent VOLTIS products.",
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
    careersText: "VOLTIS is currently a concept. The careers area is designed to communicate the working environment, roles and application process as the project develops.",
    careersCta: "Explore opportunities",
    contactTitle: "Start your journey with VOLTIS.",
    footerDisclaimer: "Reference media is sourced from Tesla.com and remains the property of Tesla, Inc.",
    heroPhotoAlt: "Tesla Model Y used as reference photography for the VOLTIS visual direction",
    aeroPhotoAlt: "Tesla Model 3 used as reference photography for the VOLTIS AERO direction",
    terrainPhotoAlt: "Tesla Cybertruck used as reference photography for the VOLTIS TERRAIN direction",
    cockpitAlt: "Tesla central touchscreen used as an HMI reference",
    materialAlt: "Tesla cabin used as an interior material reference",
    controlsAlt: "Tesla steering-wheel controls used as an interaction reference",
    galleryEnergyAlt: "Tesla Supercharger used as an energy-system reference",
    galleryInteriorAlt: "Tesla touchscreen used as an interface reference",
    gallerySolarAlt: "Tesla integrated energy ecosystem used as a clean-energy reference",
    newsDesignAlt: "Tesla Model Y used as an exterior design reference",
    newsChargingAlt: "Tesla Supercharger used as a charging reference",
    newsCompanyAlt: "Tesla service environment used as a technical company reference"
  };

  const media = {
    hero: {
      selector: ".hero__media-frame img",
      src: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/learn_new_model_y_hero.jpg",
      altKey: "heroPhotoAlt",
      fallback: "./assets/voltis-aero.svg"
    },
    aero: {
      selector: '[data-model="aero"] .model-card__media img',
      src: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/service-portal-hero.jpg",
      altKey: "aeroPhotoAlt",
      fallback: "./assets/voltis-aero.svg"
    },
    terrain: {
      selector: '[data-model="terrain"] .model-card__media img',
      src: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Learn-Cybertruck-HFS-Hero.jpg",
      altKey: "terrainPhotoAlt",
      fallback: "./assets/voltis-terrain.svg"
    }
  };

  const cockpitMedia = [
    [".cluster-visual", "https://digitalassets.tesla.com/tesla-contents/image/upload/h_526,w_846,c_fit,f_auto,q_auto:best/Touchscreen_3Y_MYT_Image", "cockpitAlt", "TESLA / HMI"],
    [".material-visual", "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto:best/Essentials_3Y_Image", "materialAlt", "TESLA / CABIN"],
    [".switch-visual", "https://digitalassets.tesla.com/tesla-contents/image/upload/h_450,w_720,c_fit,f_auto,q_auto:best/Physical-Controls_3Y_MYT_Image", "controlsAlt", "TESLA / CONTROLS"]
  ];

  const signatureMedia = [
    [".signature-card--rail", "https://digitalassets.tesla.com/tesla-contents/image/upload/h_1056,w_1874,c_fit,f_auto,q_auto:best/Supercharging_Vehicle_Q4_21_Image", "galleryEnergyAlt"],
    [".signature-card--index", "https://digitalassets.tesla.com/tesla-contents/image/upload/h_526,w_846,c_fit,f_auto,q_auto:best/Touchscreen_3Y_MYT_Image", "galleryInteriorAlt"],
    [".signature-card--signal", "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Ecosystem_Header_Image.png", "gallerySolarAlt"]
  ];

  const newsMedia = [
    [".news-card__visual--a", "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/learn_new_model_y_hero.jpg", "newsDesignAlt", "01"],
    [".news-card__visual--b", "https://digitalassets.tesla.com/tesla-contents/image/upload/h_1056,w_1874,c_fit,f_auto,q_auto:best/Supercharging_Vehicle_Q4_21_Image", "newsChargingAlt", "02"],
    [".news-card__visual--c", "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/service-portal-hero.jpg", "newsCompanyAlt", "03"]
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
    if (meta) meta.content = "VOLTIS — electric mobility brand and product experience prototype.";
  }

  upgradeMedia();
  applyCopy();
  window.addEventListener("pageshow", () => {
    upgradeMedia();
    applyCopy();
  });
})();
