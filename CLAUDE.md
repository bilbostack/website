# CLAUDE.md

Bilbostack 2026 — Hugo (Extended) static site, deployed to Netlify.

## Context

This is the base for **Bilbostack.com**, the annual tech conference held in Bilbao.
Each year's edition reuses this codebase with a different theme color and refreshed
agenda, speakers, and sponsors. Past editions are listed in the `editions` array in
`config/_default/hugo.toml`.

See `docs/ARCHITECTURE.md` for the full structure, data model, and common tasks.

## Commands

- `hugo server` — local dev server.
- `hugo --minify` — production build (output in `public/`). Requires **Hugo Extended** (SCSS); match `HUGO_VERSION` in `netlify.toml`.

## Verify before finishing

After any SCSS or template change, confirm the site **builds and starts** before considering the task done:

- **Clean build:** `rm -rf public resources/_gen && hugo --minify`. The clean step is mandatory — Hugo caches compiled SCSS partials in `resources/_gen`, so a plain `hugo --minify` can return **exit 0 from cache while the real source is broken**. A failed SCSS transform (e.g. a Sass error) breaks `style.scss` and leaves the whole site unstyled.
- **Server boots:** `hugo server` should start and serve HTTP 200 with no `ERROR`/`failed to transform` lines in its output.
- **SCSS gotcha:** Dart Sass evaluates `max()`/`min()`/`clamp()` as Sass functions; with `var()` arguments interpolate them (`#{"max(var(--a), …)"}`) so they emit as literal CSS.

## Conventions

- **Trilingual:** every content page exists in `es` (default), `en`, and `eu` as `name.<lang>.md`. Always update all three.
- **UI strings** live in `i18n/` (`{{ T "key" }}`), not hardcoded in templates.
- **Config over code:** prefer editing front matter, `config/_default/hugo.toml` params, and i18n over hardcoding values in templates.
- **Images:** templated/processed images go in `assets/img/` (referenced via `resources.Get`); favicons and PDFs go in `static/`.
- Never edit `public/` or `resources/_gen/` — they are gitignored build artifacts.
