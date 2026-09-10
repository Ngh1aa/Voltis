(() => {
  "use strict";

  const LEGACY_COMMIT = "6123cc2026dc6630edec2fb293be1073bb416a27";

  const refinementStyle = document.createElement("link");
  refinementStyle.rel = "stylesheet";
  refinementStyle.href = "./css/refinement.css?v=2";
  document.head.appendChild(refinementStyle);

  const loadRefinement = () => {
    if (document.querySelector('script[data-voltis-refinement]')) return;
    const refinement = document.createElement("script");
    refinement.src = "./js/refinement.js?v=2";
    refinement.dataset.voltisRefinement = "true";
    document.head.appendChild(refinement);
  };

  const legacy = document.createElement("script");
  legacy.src = `https://cdn.jsdelivr.net/gh/Ngh1aa/Voltis@${LEGACY_COMMIT}/js/main.js`;
  legacy.onload = loadRefinement;
  legacy.onerror = loadRefinement;
  document.head.appendChild(legacy);
})();
