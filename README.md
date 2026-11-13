# VOLTIS — Electric Mobility Website

Static HTML/CSS/JS website for VOLTIS, a fictional electric vehicle brand (concept product designed by Đỗ Anh Nghĩa).

**Live / portfolio entry URL:** https://voltis-one.vercel.app/ (opens the homepage; My VOLTIS starts with one saved build).

## Structure

```text
Voltis/
├─ index.html, vehicles.html, company.html, projects.html, stories.html,
│  resources.html, gallery.html, careers.html, contact.html   (main pages)
├─ vehicle.html      model detail + configurator (?id=aero, ?config=CFG-…)
├─ compare.html      compare 2–3 models (?ids=aero,terrain)
├─ test-drive.html   booking wizard (?model=, ?reschedule=TD-…)
├─ account.html      My VOLTIS: garage, bookings, applications, enquiries (?tab=)
├─ story.html, project.html, job.html, apply.html   detail pages (?id= / ?job=)
├─ credits.html      image credits (author, source, licence)
├─ figma-*.html      design documentation pages
├─ css/   style.css, refinement.css (home) · pages.css, app.css, media-library.css (subpages)
├─ js/    data.js (catalogue + seed) · app-core.js (store, requests, UI states)
│         vehicles.js · test-drive.js · account.js · content.js · careers.js · contact.js
├─ tests/e2e.cjs     end-to-end test (Playwright)
├─ assets/  photos/ (WebP) · video/ · concept SVGs
├─ docs/
```

## Features

- English interface (the home page keeps Vietnamese source copy, switched to English at runtime by `js/main.js`).
- Consistent responsive typography for section titles, product names, card titles, body copy, labels and CTAs.
- Professional automotive-oriented copy benchmarked against current premium EV websites without copying their brand language.
- Free-licence reference photography for vehicles, cockpit/HMI, controls, charging, energy, engineering and editorial stories, stored locally in `assets/photos/` (WebP) with a short charging film in `assets/video/`.
- All photography and film comes from Wikimedia Commons under public-domain, CC0, CC BY or CC BY-SA licences. Every file is credited with title, author, source and licence on `credits.html` (linked from every footer) and in `docs/image-sources.md`.
- Google Images and Pinterest are used for visual discovery only; repost/cache/watermarked image URLs are not embedded.
- Responsive mobile-first layout with accessible native controls, visible focus states and Escape-close mobile navigation.
- Reduced-motion support and one deliberate hero interaction.
- Relative project paths suitable for GitHub Pages; no build step or package manager is required.

## Working flows (no server)

Every main workflow runs end to end in the browser, with loading, empty, not-found and recoverable error states:

- **Vehicles:** filter by body type, range target and price, sort, compare up to three models, model detail pages with a configurator (trim, paint, battery, options, live price) and saving to **My garage** (view, edit, delete).
- **Test drive:** model → studio → date and time (closed days and taken slots disabled) → details with validation → review → confirmation with a reference and a calendar (.ics) file. **My bookings** supports reschedule and cancel.
- **Stories / projects:** category filters, search, empty states and detail pages.
- **Resources:** search and category filters; downloads are generated in the browser (Markdown, text, CSV) or served from `docs/`.
- **Careers:** role filters, job detail, application wizard (CV is read as a local file name only), **My applications** with withdraw.
- **Contact:** validated enquiry form that reaches a success state.

**Data rule.** There is no server. Catalogue content and the starting user data live in `js/data.js`. On the first visit in a tab, `app-core.js` copies the seed into `sessionStorage` (`voltis.demo.v1`), so saved items survive navigation and reload in that tab only. Prices and ranges are fictional targets, presented as product copy ("From 1.19 billion VND", "Up to 610 km (target)", "Specifications are targets and may change"). Every footer carries one honest line: "Concept product designed by Đỗ Anh Nghĩa." plus the Image credits link.

**Demo tools (hidden).** Add `?demo=1` to any URL to show a small floating **Demo tools** menu with **Simulate a failed request** (the next request fails once, showing the error state and a retry) and **Reset demo data**. The flag stays on for that tab (sessionStorage); `?demo=0` turns it off. The `figma-*.html` documentation pages are not linked from the site but remain available by direct URL.

## Run locally

Use any static server from this repository root. Example:

```bash
py -3 -m http.server 8905 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8905`.

## End-to-end test

With the server running on port 8905 and Playwright installed somewhere on `NODE_PATH`:

```bash
NODE_PATH=/path/to/node_modules node tests/e2e.cjs
```

It walks every flow above plus reset (via `?demo=1`), checks that no product page shows prototype wording or demo tools without `?demo=1`, and fails on local console errors or any `href="#"`. Set `BASE_URL` to test another host.

## Deployment

Vercel deploys `main` as a static site (`vercel.json`).

## GitHub Pages

Deploy from the repository `main` branch and `/ (root)`. GitHub Pages will serve the static prototype directly.

## Content / reality notice

This is a UI/UX prototype. `AERO`, `TERRAIN` and qualitative product characteristics are concept material; they do not represent announced commercial VOLTIS products. Photography is free-licence reference material from Wikimedia Commons (see `credits.html`) and shows third-party products and brands. Replace all concept information and reference-only photography with verified/licensed production assets before commercial release.

## Design documentation

Start with `docs/research-brief.md`. The supporting docs capture reference synthesis, visual grammar, visual signature, automotive artifact transfer, UX decisions, responsive strategy, localization rules, QA and image-source notes.
