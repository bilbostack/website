---
paths:
  - "config/**"
  - "i18n/**"
  - "data/**"
---

# Hugo config, i18n and data

## `config/_default/hugo.toml`
- Single config file split by concern via sibling files (`menus.<lang>.toml`). Don't add `config.toml`/`hugo.yaml` at the root.
- Keep `defaultContentLanguage = 'es'`, `defaultContentLanguageInSubdir = false`, `relativeURLs = true` unless explicitly asked — URLs and deploys depend on them.
- Param keys are camelCase (`speakersVisible`, `eventStartDate`). Hugo lowercases them internally; reference them in templates with the same spelling used in the config.
- Feature flags (`sponsorsVisible`, `agendaVisible`, `speakersVisible`, `ticketsOpen`) are the way to show/hide sections. Toggle here, not in templates.
- `editions`: exactly one entry has `current = true`; past editions keep their stats. `sponsorBlocks` titles are i18n keys (`sponsors_*`) and images are `assets/` paths.
- Dates are ISO 8601 with the Europe/Madrid offset (`+01:00` in winter) — they feed JSON-LD.
- Run a clean build after any config change; TOML errors fail the whole site.

## Menus
- `menus.es.toml`, `menus.en.toml`, `menus.eu.toml` must have the same `identifier`s and `weight`s; only `name`, `url` (language prefix) and `params.desc` change.

## i18n (`i18n/`)
- Global strings in `i18n/<lang>.toml`; area strings in `i18n/<area>/<lang>.toml` (`home`, `sponsors`, `info`, `past_editions`, `agenda`, `speaker_detail`). Put new keys in the area of the template that uses them, grouped under the `# <partial>.html` comment.
- Every key must exist in `es`, `en` **and** `eu`. Keys are snake_case and unique across all files (Hugo merges them; duplicates silently override).
- Values may contain inline HTML only when the template outputs them with `safeHTML`.
- Missing translations: check with `hugo --printI18nWarnings` and fix any warnings you introduce.

## Data (`data/`)
- `data/walloffame.yaml` is the single source of truth for the Wall of Fame. Use `data/` for non-translated structured lists; translated content belongs in front matter or i18n.
