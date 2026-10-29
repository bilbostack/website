---
paths:
  - "layouts/**"
---

# Hugo templates (`layouts/`)

## Structure
- `_default/baseof.html` is the only shell. It defines blocks `header`, `main`, `footer`; page layouts fill `{{ define "main" }}` and must keep content inside `#smooth-wrapper > #smooth-content` (GSAP ScrollSmoother depends on it).
- Keep the existing locations: partials in `layouts/partials/` (not `_partials/`), shortcodes in `layouts/_shortcodes/`. Don't migrate folders as a side effect of another task.
- New page type → `layouts/<type>/single.html` and set `type = '<type>'` in the content front matter. Speakers use `layout = 'speaker-detail'` → `_default/speaker-detail.html`.
- Partial naming by area: `site-*` (chrome, shared), `home-*` (home sections, composed in `index.html`), `agenda-*` / `session-*` (agenda), `speaker-*`. Reusable UI blocks (e.g. `empty-state.html`) take a `dict` and document their params in a leading `{{- /* … */ -}}` comment.

## Idioms used in this codebase
- **Strings:** always `{{ T "key" }}` — never hardcode visible text (Spanish or otherwise). Add the key to all three language files.
- **Site values:** read from `.Site.Params.*` (`speakersVisible`, `agendaVisible`, `sponsorsVisible`, `ticketsOpen`, …). Gate whole sections with these flags instead of commenting markup out.
- **Empty collections:** wrap with `{{ with $items }}…{{ end }}` so the section disappears when empty (e.g. `home-speakers.html`); use the `empty-state.html` partial when a designed placeholder is wanted.
- **Images:** `{{ with resources.Get .Params.image }}{{ with .Resize "…x webp q70 lanczos" }}…{{ end }}{{ end }}` — paths are relative to `assets/` (e.g. `img/speakers/x.jpg`). Always guard with `with` so a missing image doesn't break the build. Emit `width`/`height` and `alt`.
- **Inline SVG icons:** `{{ with resources.Get .image }}{{ .Content | safeHTML }}{{ end }}`.
- **CSS/JS:** go through Pipes with `fingerprint` and the SRI `integrity` attribute (see `site-style.html` and `baseof.html`). Don't add `<link>`/`<script>` to `/assets/...` paths directly.
- **URLs:** use `.RelPermalink` / `relURL` / `relLangURL` (the site uses `relativeURLs = true`); never hardcode `https://bilbostack.com` or a `/en/` prefix.
- **Language:** `.Site.Pages`, menus and i18n are already scoped to the current language — don't filter by language manually. For language switchers use `.Translations` / `.AllTranslations`.
- **`partialCached`:** only for output identical on every page *of the same language* (currently the footer). Anything that depends on the page must use `partial`.
- **Safety:** use `safeHTML` / `markdownify` only on trusted, author-controlled values (front matter, i18n, config). Prefer `{{- … -}}` trimming in partials/shortcodes that output inline.
- **SEO:** `site-meta.html` and `site-schema.html` own `<head>` metadata and JSON-LD; extend those instead of adding meta tags in page layouts. JSON-LD `Event` data comes from `eventStartDate`/`eventEndDate`/`eventLocation*` params.

## Shortcodes
- `speaker_bio` and `speaker_talk` are used inside speaker Markdown. Changing their parameters means updating every `content/speakers/*.md` (×3 languages) and the `speaker` skill.
- Shortcode params should fall back to page params / i18n like `speaker_talk.html` does (`or (.Get "x") $.Page.Params.x`).
