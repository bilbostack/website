---
paths:
  - "content/**"
  - "archetypes/**"
---

# Hugo content (`content/`)

- **Trilingual, filename-based:** every page is `<name>.es.md`, `<name>.en.md`, `<name>.eu.md`. Create/update/delete all three together and keep front matter keys and structure identical across them — only the translated values differ. (`info` and `past-editions` may still be `es`-only stubs; don't invent translations, flag it instead.)
- **Front matter is TOML** (`+++`). Keep it TOML; don't mix YAML.
- **Layout selection** is by front matter: speakers `type = 'speaker'` + `layout = 'speaker-detail'`; agenda `type = 'agenda'`; info `type = 'info'`; past editions `type = 'past-editions'`; home `_index.<lang>.md`.
- **Speakers** (`content/speakers/<slug>.<lang>.md`): slug is the kebab-case name, identical across languages. `image` is a path under `assets/` (`img/speakers/<file>`). Body uses `{{< speaker_bio >}}` and `{{< speaker_talk >}}`. Use the `speaker` skill for these.
- **Parked pages:** files ending in `.md.tpl` (e.g. `marta-barrio.*.md.tpl`) are intentionally not rendered by Hugo. To publish, rename all three to `.md`; to unpublish without deleting, rename back. Don't delete them.
- **Agenda** (`agenda.<lang>.md`) is pure data: `[schedule_config_viernes|sabado]` + `[[schedule_viernes|sabado]]` rows with `type = "single" | "parallel"` and `[[…sessions]]`. Times, row order and `speaker_url` must match across the three languages; only titles/descriptions are translated. `speaker_url` points to `/speakers/<slug>` (Hugo localizes the link).
- **Raw HTML** in Markdown is allowed (`unsafe = true`), but prefer shortcodes/partials for anything reused.
- Use `draft = true` or the `.md.tpl` convention to hide content — never comment content out.
- Don't put site-wide values (dates, ticket links, hashtag) in content; they belong in `hugo.toml` params.
