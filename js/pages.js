(() => {
  "use strict";

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

  const filterButtons = document.querySelectorAll("[data-story-filter]");
  const storyCards = document.querySelectorAll("[data-story-category]");
  filterButtons.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.storyFilter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    storyCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.storyCategory !== filter;
    });
  }));

  const resourceSearch = document.querySelector("[data-resource-search]");
  if (resourceSearch) {
    resourceSearch.addEventListener("input", () => {
      const query = resourceSearch.value.trim().toLowerCase();
      document.querySelectorAll("[data-resource-row]").forEach((row) => {
        row.hidden = query && !row.textContent.toLowerCase().includes(query);
      });
    });
  }
})();