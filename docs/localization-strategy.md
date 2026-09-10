# VOLTIS — Localization Strategy

## Locales

- `vi` — default.
- `en` — equivalent English locale.

The prototype keeps one URL and switches DOM text client-side because it is a static concept page. A production SEO site should use locale routes such as `/vi/...` and `/en/...` if both versions are intended to be indexed.

## Translation architecture

- User-facing strings use stable `data-i18n` keys.
- `js/main.js` owns the two locale dictionaries.
- No sentence fragments are concatenated.
- Product concept names `VOLTIS`, `AERO`, `TERRAIN` remain untranslated.
- Short technical marks like `EV`, `400V`, `REV. 01` are treated as domain notation, not prose.

## Locale switch behavior

- Default is Vietnamese.
- VI/EN buttons expose pressed state with `aria-pressed`.
- Choice is persisted with `localStorage`.
- Current scroll/page context is preserved; switch does not send user back to top/home.

## Vietnamese checks

- UTF-8 declared.
- System font stack includes Vietnamese-capable fonts.
- Heading/body line heights leave room for diacritics.
- Avoid uppercase long-form Vietnamese paragraphs.

## Layout resilience

Test:
- English nav expansion.
- Vietnamese diacritics at large display sizes.
- Button labels at 320px.
- 30–50% pseudo-expansion before production.

## SEO future state

When routes are split:
- localized title + description;
- self-referencing canonical per locale;
- valid `hreflang` only for equivalent pages;
- locale-specific sitemap references.
