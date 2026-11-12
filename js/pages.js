(() => {
  "use strict";

  if (!document.querySelector('script[data-voltis-media-library]')) {
    const media = document.createElement("script");
    media.src = "./js/media-library.js?v=2026-11-12";
    media.dataset.voltisMediaLibrary = "true";
    document.head.appendChild(media);
  }

  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = !mobileNav.classList.contains("is-open");
      mobileNav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !mobileNav || !mobileNav.classList.contains("is-open")) return;
    mobileNav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    toggle.focus();
  });
})();
