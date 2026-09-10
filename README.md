# VOLTIS — Electric Mobility Website Prototype

Static HTML/CSS/JS prototype for the VOLTIS electric vehicle corporate/product website.

## Structure

```text
Voltis/
├─ index.html
├─ css/
│  ├─ style.css
│  └─ refinement.css
├─ js/
│  ├─ main.js
│  └─ refinement.js
├─ assets/
│  ├─ voltis-aero.svg
│  └─ voltis-terrain.svg
└─ docs/
   ├─ research-brief.md
   ├─ design-reference-benchmark.md
   ├─ visual-direction.md
   ├─ visual-signature.md
   ├─ real-world-artifact-design.md
   ├─ decision-log.md
   ├─ ux-review.md
   ├─ responsive-strategy.md
   ├─ localization-strategy.md
   ├─ prototype-qa.md
   └─ image-sources.md
```

## Prototype features

- Vietnamese-first interface with an English language switch.
- Consistent responsive typography for section titles, product names, card titles, body copy, labels and CTAs.
- Professional automotive-oriented copy benchmarked against current premium EV websites without copying their brand language.
- Real reference photography for vehicles, cockpit/HMI, controls, charging, energy, engineering and editorial stories.
- Tesla imagery is treated as reference/demo material; Unsplash imagery is selected from source pages stating use under the Unsplash License. See `docs/image-sources.md`.
- Google Images and Pinterest are used for visual discovery only; repost/cache/watermarked image URLs are not embedded.
- Responsive mobile-first layout with accessible native controls, visible focus states and Escape-close mobile navigation.
- Reduced-motion support and one deliberate hero interaction.
- Relative project paths suitable for GitHub Pages; no build step or package manager is required.

## Run locally

Use any static server from this repository root. Example:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

## GitHub Pages

Deploy from the repository `main` branch and `/ (root)`. GitHub Pages will serve the static prototype directly.

## Content / reality notice

This is a UI/UX prototype. `AERO`, `TERRAIN` and qualitative product characteristics are concept material; they do not represent announced commercial VOLTIS products. Photography is reference material and may show third-party products or brands. Replace all concept information and reference-only photography with verified/licensed production assets before commercial release.

## Design documentation

Start with `docs/research-brief.md`. The supporting docs capture reference synthesis, visual grammar, visual signature, automotive artifact transfer, UX decisions, responsive strategy, localization rules, QA and image-source notes.
