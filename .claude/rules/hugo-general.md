# Hugo — general rules (Bilbostack)

- **Version:** Hugo **Extended 0.161.0**, pinned by `HUGO_VERSION` in `netlify.toml`. Only use features available in that version; if you bump it, bump `netlify.toml` too and re-run the clean build.
- **Docs:** for any Hugo function, method, config key or template-lookup question, fetch current docs via Context7 (`/gohugoio/hugo`) instead of relying on memory — Hugo deprecates and renames APIs often (e.g. `.Site.Data` → `hugo.Data`, `.Scratch` → `.Store`, the `_shortcodes`/`_partials` template layout introduced in 0.146).
- **Source of truth:** `docs/ARCHITECTURE.md` describes the structure and data model. If a change alters the structure, a param, a partial or a content convention, update that doc in the same change.
- **Where things go:**

  | Change | Location |
  |---|---|
  | Site-wide value, feature flag, sponsors, editions | `config/_default/hugo.toml` `[params]` |
  | Navigation | `config/_default/menus.<lang>.toml` (×3) |
  | UI text | `i18n/<lang>.toml` or `i18n/<area>/<lang>.toml` (×3) |
  | Page content / per-page data | `content/**/<name>.<lang>.md` front matter (×3) |
  | Structured, non-translated data | `data/*.yaml` (e.g. `walloffame.yaml`) |
  | Markup | `layouts/` (partials, `_shortcodes/`, section layouts) |
  | Styles / JS / processed images | `assets/` (Hugo Pipes) |
  | Files served verbatim (favicons, PDFs, fonts, video, `_headers`, `llms.txt`) | `static/` |

- **Never edit** `public/`, `resources/_gen/` or `.hugo_build.lock` (build artifacts). `config/development/` is gitignored and local-only — don't put anything there that production needs.
- **Prefer the project skills** for their workflows: `speaker` (speaker pages), `sponsor` (sponsor tiers/logos), `edition` (yearly rollover, accent color, dates).
- **Verify** after any template, config, content-structure or SCSS change:
  1. `rm -rf public resources/_gen && hugo --minify` — must exit 0 with no `ERROR`/`WARN` lines you introduced. The clean step is mandatory (cached SCSS can hide a broken source).
  2. When the change is visual or affects routing, run `hugo server` and check the affected page(s) in **all three languages** (`/`, `/en/`, `/eu/`) return 200.
  3. When adding/removing templates, content or i18n keys, build with `hugo --printI18nWarnings --printPathWarnings --printUnusedTemplates -d <scratch dir>` and compare against the warnings present before your change. `--printUnusedTemplates` gives false positives here (layouts used only when a feature flag is on, e.g. the agenda partials while `agendaVisible = false`, and `_default/speaker-detail.html`) — don't delete templates based on it alone.
