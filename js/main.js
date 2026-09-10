(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const copy = {
    vi: {
      skip: "Bỏ qua điều hướng",
      announcement: "Bản mẫu thương hiệu xe điện thế hệ mới — trải nghiệm số song ngữ Việt / Anh.",
      announcementCta: "Đăng ký trải nghiệm",
      navProducts: "Sản phẩm",
      navCompany: "Công ty",
      navProjects: "Dự án",
      navNews: "Tin tức",
      navResources: "Tài liệu",
      navContact: "Liên hệ",
      navGallery: "Thư viện ảnh / video",
      navCareers: "Tuyển dụng",
      headerCta: "Hẹn lái thử",
      mobileMeta: "Điện hóa chuyển động. Giảm nhiễu, tăng trải nghiệm.",

      brandHome: "VOLTIS — Trang chủ",
      mainNavLabel: "Điều hướng chính",
      languageLabel: "Chọn ngôn ngữ",
      menuOpen: "Mở menu",
      menuClose: "Đóng menu",
      mobileNavLabel: "Điều hướng di động",
      heroMetaLabel: "Thông tin bản mẫu",
      heroVisualLabel: "Minh họa mẫu ý tưởng VOLTIS AERO",
      motionAria: "Kích hoạt chuyển động minh họa",
      specsLabel: "Đặc tính minh họa",
      energyMapLabel: "Sơ đồ minh họa luồng năng lượng",
      impactLedgerLabel: "Khung minh họa cho dữ liệu bền vững",
      readArticleLabel: "Đọc bài viết",
      aeroAlt: "Minh họa mẫu ý tưởng fastback điện VOLTIS AERO",
      terrainAlt: "Minh họa mẫu ý tưởng SUV điện VOLTIS TERRAIN",
      heroEnergyFlow: "DÒNG NĂNG LƯỢNG",
      ticker: "VOLTIS / ĐIỆN / CÓ TRÁCH NHIỆM / TIẾN VỀ PHÍA TRƯỚC /",
      hmiTag: "01 / GIAO DIỆN",
      clusterReady: "SẴN SÀNG",
      materialTag: "02 / VẬT LIỆU",
      driveLabel: "LÁI / P",
      controlTag: "03 / ĐIỀU KHIỂN",
      impactLedgerTag: "VOLTIS / SỔ TÁC ĐỘNG",
      revisionTag: "BẢN 01",
      signatureLabel1: "DÒNG NĂNG LƯỢNG / 01",
      signatureLabel2: "CHỈ MỤC / 02",
      signatureLabel3: "TÍN HIỆU / 03",
      footerCopyright: "© 2026 VOLTIS — BẢN MẪU UI/UX",

      heroKicker: "VOLTIS / DI CHUYỂN ĐIỆN / VIỆT NAM",
      heroLine1: "Năng lượng sạch.",
      heroLine2: "Cảm giác lái không thỏa hiệp.",
      heroLead: "Một thương hiệu xe điện mới được thiết kế từ tư duy năng lượng, công nghệ và trải nghiệm con người — không chỉ thay động cơ xăng bằng pin.",
      heroPrimary: "Khám phá dòng xe",
      heroSecondary: "Tìm hiểu VOLTIS",
      heroMetaModels: "mẫu xe concept",
      heroMetaPlatform: "nền tảng thuần điện",
      heroMetaLocale: "trải nghiệm song ngữ",
      heroVisualNote: "Ý TƯỞNG / KHÔNG PHẢI SẢN PHẨM THƯƠNG MẠI",
      motionTrigger: "Kích hoạt",

      eyebrowModels: "01 / DÒNG XE",
      modelsTitle: "Hai cách bước vào kỷ nguyên điện.",
      modelsIntro: "Dải sản phẩm bản mẫu tập trung vào hai nhu cầu khác nhau: một fastback hiệu suất cao và một SUV linh hoạt cho hành trình dài.",
      modelConcept: "Ý TƯỞNG",
      aeroType: "FASTBACK ĐIỆN",
      aeroDesc: "Tỷ lệ thân xe thấp, khoang lái tập trung người lái và ngôn ngữ khí động học liền mạch.",
      aeroSpec1K: "Ưu tiên",
      aeroSpec1V: "Hiệu suất",
      aeroSpec2K: "Dẫn động",
      aeroSpec2V: "Thuần điện",
      aeroSpec3K: "Thiết kế",
      aeroSpec3V: "Khí động học",
      terrainType: "SUV ĐIỆN",
      terrainDesc: "Tư thế vững chãi, không gian linh hoạt và hệ thống năng lượng được tối ưu cho những hành trình đa địa hình.",
      terrainSpec1K: "Ưu tiên",
      terrainSpec1V: "Đa dụng",
      terrainSpec2K: "Không gian",
      terrainSpec2V: "Linh hoạt",
      terrainSpec3K: "Thiết kế",
      terrainSpec3V: "Vững chãi",
      prototypeNote: "Tên xe, hình minh họa và đặc tính trên trang này là nội dung ý tưởng phục vụ bản mẫu UI/UX; không đại diện cho sản phẩm thương mại đã công bố.",

      eyebrowEnergy: "02 / KIẾN TRÚC NĂNG LƯỢNG",
      energyTitle: "Thiết kế chiếc xe như một hệ năng lượng chuyển động.",
      energyLead: "VOLTIS lấy “dòng năng lượng” làm cấu trúc thị giác lẫn tư duy sản phẩm: năng lượng đi đâu, người lái cảm nhận gì và dữ liệu nào cần được hiểu ngay.",
      energyCta: "Xem hồ sơ năng lực",
      energyNode1Title: "Nguồn",
      energyNode1Text: "Pin & quản trị năng lượng",
      energyNode2Title: "Chuyển đổi",
      energyNode2Text: "Điện năng thành chuyển động",
      energyNode3Title: "Phản hồi",
      energyNode3Text: "Dữ liệu rõ, thao tác ít",
      energyMeterLabel: "Hiệu quả trải nghiệm",
      energyMeterNote: "Minh họa định hướng, không phải số liệu đo lường.",

      eyebrowExperience: "03 / TRẢI NGHIỆM",
      experienceTitle: "Ít nhiễu hơn. Nhiều cảm nhận hơn.",
      experienceIntro: "Thay vì “màn hình hóa” mọi thứ, giao diện trong xe được hình dung như một bảng điều khiển ưu tiên đúng thông tin ở đúng thời điểm.",
      experienceCard1Title: "Cụm đồng hồ tối giản",
      experienceCard1Text: "Tốc độ, trạng thái năng lượng và cảnh báo quan trọng được tách lớp theo mức ưu tiên.",
      experienceCard2Title: "Vật liệu có chủ đích",
      experienceCard2Text: "Tương phản mờ – bóng và điểm nhấn màu được dùng có tiết chế để giảm cảm giác “thiết bị công nghệ”.",
      experienceCard3Title: "Phản hồi tức thì",
      experienceCard3Text: "Mọi trạng thái tương tác có phản hồi rõ ràng, nhanh và không phụ thuộc hiệu ứng phô trương.",

      eyebrowResponsibility: "04 / TRÁCH NHIỆM",
      sustainabilityTitle: "Bền vững không phải một màu xanh trên giao diện.",
      sustainabilityLead: "Định hướng nội dung của VOLTIS đặt bằng chứng, vòng đời sản phẩm và tính minh bạch lên trước các khẩu hiệu môi trường.",
      sustainabilityPrimary: "Đọc nguyên tắc phát triển",
      sustainabilitySecondary: "Yêu cầu tài liệu",
      impact1Title: "Nguồn vật liệu",
      impact1Text: "Công bố xuất xứ, tiêu chuẩn và phạm vi dữ liệu khi có nguồn xác thực.",
      impact2Title: "Vòng đời pin",
      impact2Text: "Trình bày vòng đời, bảo dưỡng và phương án tái sử dụng bằng ngôn ngữ dễ hiểu.",
      impact3Title: "Dữ liệu phát thải",
      impact3Text: "Không đưa con số marketing khi chưa có phương pháp đo và nguồn kiểm chứng rõ ràng.",
      impactFoot: "Khung nội dung bản mẫu — dữ liệu thực tế sẽ thay thế ở giai đoạn sản xuất.",

      eyebrowVisual: "05 / NGÔN NGỮ HÌNH ẢNH",
      galleryTitle: "Một ngôn ngữ hình ảnh có thể nhận ra ngay cả khi bỏ logo.",
      galleryIntro: "Đường năng lượng, chỉ số kỹ thuật, nền carbon và điểm nhấn cam – xanh tạo một hệ nhận diện số lặp lại có chủ đích.",
      signature1: "Dòng năng lượng làm nhịp dẫn mắt.",
      signature2: "Số thứ tự như bảng đồng hồ, không dùng badge trang trí.",
      signature3: "Cam cho chuyển động; xanh cho năng lượng và trạng thái.",

      eyebrowStories: "06 / CÂU CHUYỆN",
      newsTitle: "Từ phòng thiết kế đến hạ tầng năng lượng.",
      newsAll: "Xem tất cả bài viết ↗",
      newsTopicDesign: "THIẾT KẾ",
      newsTopicEnergy: "NĂNG LƯỢNG",
      newsTopicCompany: "CÔNG TY",
      news1Title: "Tại sao xe điện cần một ngôn ngữ thiết kế riêng?",
      news1Text: "Từ tỷ lệ thân xe đến giao diện số: những gì thay đổi khi nền tảng năng lượng thay đổi.",
      news2Title: "Thiết kế trải nghiệm sạc: nhanh không chỉ là kW.",
      news2Text: "Khả năng tìm trạm, hiểu trạng thái và dự đoán hành trình cũng là một phần của hiệu suất.",
      news3Title: "VOLTIS: xây thương hiệu từ hệ thống, không từ hiệu ứng.",
      news3Text: "Một ngôn ngữ thị giác có thể mở rộng từ trang web sang hồ sơ năng lực, không gian trưng bày và trải nghiệm trong xe.",
      readMore: "Đọc thêm ↗",

      eyebrowCareers: "07 / TUYỂN DỤNG",
      careersTitle: "Tương lai di chuyển cần nhiều góc nhìn.",
      careersText: "VOLTIS đang ở giai đoạn ý tưởng trong bản mẫu này. Khu vực tuyển dụng được thiết kế để sau này có thể kể rõ giá trị dành cho nhân sự, vai trò và quy trình ứng tuyển thay vì chỉ là danh sách vị trí.",
      careersCta: "Quan tâm cơ hội hợp tác",

      eyebrowContact: "08 / BƯỚC TIẾP THEO",
      contactTitle: "Sẵn sàng cho bước chuyển động tiếp theo?",
      contactLead: "Đăng ký để nhận bản giới thiệu sản phẩm, thông tin dự án hoặc lịch trải nghiệm khi VOLTIS sẵn sàng.",
      contactPrimary: "Liên hệ VOLTIS",
      contactSecondary: "Về đầu trang ↑",
      contactNote: "Địa chỉ email “.example” là địa chỉ minh họa an toàn cho bản mẫu; thay bằng thông tin thật trước khi phát hành.",

      footerTagline: "Di chuyển điện, được thiết kế như một hệ thống.",
      footerExplore: "Khám phá",
      footerCompany: "Công ty",
      footerProfile: "Hồ sơ năng lực",
      footerKnowledge: "Thông tin",
      footerDisclaimer: "Hình ảnh xe là minh họa ý tưởng nguyên bản; không sử dụng logo/hình ảnh đối thủ."
    },

    en: {
      skip: "Skip navigation",
      announcement: "A next-generation electric mobility brand prototype — bilingual Vietnamese / English digital experience.",
      announcementCta: "Register interest",
      navProducts: "Vehicles",
      navCompany: "Company",
      navProjects: "Projects",
      navNews: "Stories",
      navResources: "Resources",
      navContact: "Contact",
      navGallery: "Photo / video gallery",
      navCareers: "Careers",
      headerCta: "Book a test drive",
      mobileMeta: "Electrify motion. Reduce noise. Increase experience.",

      brandHome: "VOLTIS — Home",
      mainNavLabel: "Main navigation",
      languageLabel: "Choose language",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      mobileNavLabel: "Mobile navigation",
      heroMetaLabel: "Prototype information",
      heroVisualLabel: "VOLTIS AERO concept illustration",
      motionAria: "Activate concept motion",
      specsLabel: "Illustrative characteristics",
      energyMapLabel: "Illustrative energy-flow diagram",
      impactLedgerLabel: "Illustrative sustainability data framework",
      readArticleLabel: "Read article",
      aeroAlt: "Original illustration of the VOLTIS AERO electric fastback concept",
      terrainAlt: "Original illustration of the VOLTIS TERRAIN electric SUV concept",
      heroEnergyFlow: "ENERGY FLOW",
      ticker: "VOLTIS / ELECTRIC / RESPONSIBLE / FORWARD /",
      hmiTag: "01 / INTERFACE",
      clusterReady: "READY",
      materialTag: "02 / MATERIAL",
      driveLabel: "DRIVE / P",
      controlTag: "03 / CONTROL",
      impactLedgerTag: "VOLTIS / IMPACT LEDGER",
      revisionTag: "REV. 01",
      signatureLabel1: "ENERGY RAIL / 01",
      signatureLabel2: "INDEX / 02",
      signatureLabel3: "SIGNAL / 03",
      footerCopyright: "© 2026 VOLTIS — UI/UX PROTOTYPE",

      heroKicker: "VOLTIS / ELECTRIC MOBILITY / VIETNAM",
      heroLine1: "Clean energy.",
      heroLine2: "Driving feel without compromise.",
      heroLead: "A new electric vehicle brand designed around energy, technology and human experience — not simply replacing a combustion engine with a battery.",
      heroPrimary: "Explore vehicles",
      heroSecondary: "Discover VOLTIS",
      heroMetaModels: "concept vehicles",
      heroMetaPlatform: "electric-first platform",
      heroMetaLocale: "bilingual experience",
      heroVisualNote: "CONCEPT / NOT A COMMERCIAL PRODUCT",
      motionTrigger: "Activate",

      eyebrowModels: "01 / VEHICLES",
      modelsTitle: "Two ways into the electric era.",
      modelsIntro: "This prototype range addresses two different needs: a performance-focused fastback and a versatile SUV for longer journeys.",
      modelConcept: "CONCEPT",
      aeroType: "ELECTRIC FASTBACK",
      aeroDesc: "A low body proportion, driver-focused cockpit and a continuous aerodynamic design language.",
      aeroSpec1K: "Priority",
      aeroSpec1V: "Performance",
      aeroSpec2K: "Powertrain",
      aeroSpec2V: "All-electric",
      aeroSpec3K: "Design",
      aeroSpec3V: "Aerodynamic",
      terrainType: "ELECTRIC SUV",
      terrainDesc: "A planted stance, flexible space and an energy system conceived for varied terrain and longer trips.",
      terrainSpec1K: "Priority",
      terrainSpec1V: "Versatility",
      terrainSpec2K: "Space",
      terrainSpec2V: "Flexible",
      terrainSpec3K: "Design",
      terrainSpec3V: "Confident",
      prototypeNote: "Vehicle names, artwork and characteristics on this page are concept content for a UI/UX prototype and do not represent announced commercial products.",

      eyebrowEnergy: "02 / ENERGY ARCHITECTURE",
      energyTitle: "Design the vehicle as a moving energy system.",
      energyLead: "VOLTIS uses “energy flow” as both a visual structure and a product idea: where energy goes, what the driver feels and which information must be understood immediately.",
      energyCta: "View capability profile",
      energyNode1Title: "Source",
      energyNode1Text: "Battery & energy management",
      energyNode2Title: "Convert",
      energyNode2Text: "Electrical energy into motion",
      energyNode3Title: "Feedback",
      energyNode3Text: "Clear data, fewer actions",
      energyMeterLabel: "Experience efficiency",
      energyMeterNote: "Directional illustration, not measured data.",

      eyebrowExperience: "03 / EXPERIENCE",
      experienceTitle: "Less noise. More sensation.",
      experienceIntro: "Instead of putting a screen on everything, the in-car interface is imagined as an instrument panel that prioritizes the right information at the right moment.",
      experienceCard1Title: "Minimal instrument cluster",
      experienceCard1Text: "Speed, energy state and critical warnings are layered by priority.",
      experienceCard2Title: "Purposeful materials",
      experienceCard2Text: "Matte–gloss contrast and restrained accent color reduce the feeling of a disposable gadget.",
      experienceCard3Title: "Immediate feedback",
      experienceCard3Text: "Every interactive state responds clearly and quickly without depending on showy effects.",

      eyebrowResponsibility: "04 / RESPONSIBILITY",
      sustainabilityTitle: "Sustainability is not a green color on a screen.",
      sustainabilityLead: "VOLTIS content direction places evidence, product lifecycle and transparency ahead of environmental slogans.",
      sustainabilityPrimary: "Read development principles",
      sustainabilitySecondary: "Request documents",
      impact1Title: "Material sourcing",
      impact1Text: "Publish origin, standards and data scope when verified sources exist.",
      impact2Title: "Battery lifecycle",
      impact2Text: "Explain lifecycle, maintenance and reuse pathways in language people can understand.",
      impact3Title: "Emissions data",
      impact3Text: "Do not publish marketing numbers without a clear measurement method and verifiable source.",
      impactFoot: "Prototype content framework — real verified data replaces this in production.",

      eyebrowVisual: "05 / VISUAL LANGUAGE",
      galleryTitle: "A visual language that remains recognizable even without the logo.",
      galleryIntro: "The energy rail, technical indexing, carbon surfaces and controlled orange–green signals form a repeatable digital signature.",
      signature1: "Energy flow creates a directional reading rhythm.",
      signature2: "Instrument-style indexing instead of decorative badges.",
      signature3: "Orange signals motion; green signals energy and state.",

      eyebrowStories: "06 / STORIES",
      newsTitle: "From the design studio to energy infrastructure.",
      newsAll: "View all stories ↗",
      newsTopicDesign: "DESIGN",
      newsTopicEnergy: "ENERGY",
      newsTopicCompany: "COMPANY",
      news1Title: "Why should electric vehicles have their own design language?",
      news1Text: "From body proportions to digital interfaces: what changes when the energy platform changes.",
      news2Title: "Charging experience design: speed is more than kW.",
      news2Text: "Finding a charger, understanding state and predicting a journey are also part of performance.",
      news3Title: "VOLTIS: building a brand from systems, not effects.",
      news3Text: "A look and feel that can extend from the website to capability documents, showrooms and the in-car experience.",
      readMore: "Read more ↗",

      eyebrowCareers: "07 / CAREERS",
      careersTitle: "The future of mobility needs more perspectives.",
      careersText: "VOLTIS is represented as a concept at this prototype stage. The careers area is structured to later explain EVP, roles and the hiring process — not only list openings.",
      careersCta: "Explore collaboration",

      eyebrowContact: "08 / NEXT MOVE",
      contactTitle: "Ready for the next move?",
      contactLead: "Register to receive vehicle introductions, project information or future experience schedules when VOLTIS is ready.",
      contactPrimary: "Contact VOLTIS",
      contactSecondary: "Back to top ↑",
      contactNote: "The “.example” email address is a safe prototype address; replace it with verified contact information before release.",

      footerTagline: "Electric mobility, designed as a system.",
      footerExplore: "Explore",
      footerCompany: "Company",
      footerProfile: "Capability profile",
      footerKnowledge: "Information",
      footerDisclaimer: "Vehicle visuals are original concept artwork; no competitor logos or imagery are used."
    }
  };

  const locales = ["vi", "en"];
  const localeButtons = [...document.querySelectorAll(".locale-switch__btn[data-locale]")];
  const i18nNodes = [...document.querySelectorAll("[data-i18n]")];
  const ariaNodes = [...document.querySelectorAll("[data-i18n-aria]")];
  const altNodes = [...document.querySelectorAll("[data-i18n-alt]")];

  function setLocale(locale) {
    if (!locales.includes(locale)) return;

    i18nNodes.forEach((node) => {
      const key = node.dataset.i18n;
      const value = copy[locale][key];
      if (typeof value === "string") node.textContent = value;
    });

    ariaNodes.forEach((node) => {
      const key = node.dataset.i18nAria;
      const value = copy[locale][key];
      if (typeof value === "string") node.setAttribute("aria-label", value);
    });

    altNodes.forEach((node) => {
      const key = node.dataset.i18nAlt;
      const value = copy[locale][key];
      if (typeof value === "string") node.setAttribute("alt", value);
    });

    root.lang = locale;
    root.dataset.locale = locale;
    document.title = locale === "vi"
      ? "VOLTIS — Chuyển động bằng điện, thiết kế cho tương lai"
      : "VOLTIS — Electric motion, designed for the future";

    localeButtons.forEach((button) => {
      const active = button.dataset.locale === locale;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    try {
      localStorage.setItem("voltis-locale", locale);
    } catch (_) {
      // Storage may be unavailable in strict privacy/sandbox contexts; locale still works for this session.
    }
  }

  localeButtons.forEach((button) => {
    button.addEventListener("click", () => setLocale(button.dataset.locale));
  });

  let storedLocale = null;
  try {
    storedLocale = localStorage.getItem("voltis-locale");
  } catch (_) {
    storedLocale = null;
  }
  setLocale(locales.includes(storedLocale) ? storedLocale : "vi");

  // Mobile navigation: native buttons/links, Escape close, focus return.
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  let menuOpen = false;

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuOpen = open;
    menuToggle.setAttribute("aria-expanded", String(open));
    const activeLocale = locales.includes(root.lang) ? root.lang : "vi";
    menuToggle.setAttribute("aria-label", copy[activeLocale][open ? "menuClose" : "menuOpen"]);
    mobileMenu.hidden = !open;
    document.body.classList.toggle("menu-open", open);

    if (open) {
      const firstLink = mobileMenu.querySelector("a");
      window.setTimeout(() => firstLink?.focus(), 10);
    } else {
      menuToggle.focus();
    }
  }

  menuToggle?.addEventListener("click", () => setMenu(!menuOpen));

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuOpen = false;
      menuToggle?.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
      document.body.classList.remove("menu-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) setMenu(false);
  });

  // Header surface becomes more solid after leaving the first screen.
  const header = document.querySelector("[data-header]");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // One deliberate hero interaction: activate the concept object's energy state.
  const spinTrigger = document.querySelector("[data-spin-trigger]");
  const heroFrame = document.querySelector(".hero__media-frame");
  spinTrigger?.addEventListener("click", () => {
    const active = heroFrame?.classList.toggle("is-activated");
    spinTrigger.classList.toggle("is-active", Boolean(active));
  });

  // Restricted one-time reveal: only major composition groups, never every text line.
  const revealTargets = [
    ...document.querySelectorAll(
      ".section-head, .energy__copy, .energy-map, .sustainability__copy, .impact-ledger, .news-card, .careers__inner"
    )
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion && "IntersectionObserver" in window) {
    revealTargets.forEach((node) => node.setAttribute("data-reveal", ""));
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealTargets.forEach((node) => observer.observe(node));
  } else {
    revealTargets.forEach((node) => node.classList.add("is-visible"));
  }

  // Main page-load moment. It runs once and does not block interaction.
  requestAnimationFrame(() => root.classList.add("is-loaded"));
})();
