---
paths:
  - "assets/**"
  - "static/**"
---

# Assets & static files

## `assets/` (Hugo Pipes)
- **SCSS** entry point is `assets/scss/style.scss`, compiled with `toCSS` (Dart Sass via Hugo Extended). New styles go in a partial under the matching folder (`abstracts/`, `base/`, `components/`, `layout/`) and are `@import`ed from `style.scss`. `fix.scss` stays empty — fix the real partial.
- Use design tokens from `abstracts/_variables.scss` (`--space-*`, `--section-gap`, `--font-size-h*`, `--accent`, `--accent-ink`, …) instead of hardcoded values. See `docs/DESIGN.md`.
- The edition accent is `$current-color`; the dark theme is generated from it with `generate-inverted-colors`. Never hardcode a second hue for dark mode.
- Sass `max()`/`min()`/`clamp()` with `var()` arguments must be interpolated: `#{"max(var(--a), 1rem)"}`.
- `assets/scss/laprevia/style.scss` is orphaned and not built — leave it alone.
- **Images** referenced from templates/front matter/config live in `assets/img/<area>/` (`speakers/`, `sponsors/`, `org/`, `icons/`) so they can be resized to WebP. Source images should be reasonably sized (≤ ~1600px); Hugo caches the processed versions in `resources/_gen` (don't commit it).
- **JS:** `assets/js/main.js` is minified + fingerprinted. GSAP comes from the CDN in `baseof.html`; keep scroll-driven effects gated on `prefers-reduced-motion`.

## `static/`
- Copied verbatim to the site root — no processing, no fingerprinting. Only for: favicons/manifest (`static/img/`), self-hosted fonts (`static/fonts/`, referenced by absolute path from `base/_fonts.scss` and preloaded in `baseof.html`), PDFs (`static/docs/`), video, `_headers` (Netlify cache rules) and `llms.txt`.
- A file in `static/` and a generated page must never share a path.
- Renaming a font or the sponsor dossier requires updating its references (`_fonts.scss` + preload links in `baseof.html`; `sponsorsDossierLink` in `hugo.toml`).
