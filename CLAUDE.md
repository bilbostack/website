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

## Conventions

- **Trilingual:** every content page exists in `es` (default), `en`, and `eu` as `name.<lang>.md`. Always update all three.
- **UI strings** live in `i18n/` (`{{ T "key" }}`), not hardcoded in templates.
- **Config over code:** prefer editing front matter, `config/_default/hugo.toml` params, and i18n over hardcoding values in templates.
- **Images:** templated/processed images go in `assets/img/` (referenced via `resources.Get`); favicons and PDFs go in `static/`.
- Never edit `public/` or `resources/_gen/` — they are gitignored build artifacts.
