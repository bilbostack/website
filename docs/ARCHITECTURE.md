# Architecture — Bilbostack 2026 Website

This document describes the structure of the Bilbostack 2026 website for both humans
and AI agents working on the codebase. It explains how the Hugo project is organized,
the data model, and where to change things.

## Overview

- **Generator:** [Hugo](https://gohugo.io/) static site generator (Hugo **Extended**, version `0.148.2` — pinned in `netlify.toml`). The Extended build is required because SCSS is compiled with `toCSS`.
- **Hosting:** [Netlify](https://www.netlify.com/). Build command `hugo --minify`, publish directory `public/`. Deploy is automatic on push.
- **Languages:** Multilingual site — Spanish (`es`, default), English (`en`), Basque (`eu`). The default language is served at the root (no `/es/` prefix).
- **Local dev:** `hugo server` from the project root (install Hugo first).

## Directory layout

```
.
├── config/_default/        # Site configuration (split by concern)
│   ├── hugo.toml           # Main config: baseURL, languages, params, sponsors, editions, markup, security
│   ├── menus.es.toml       # Navigation menu (Spanish)
│   ├── menus.en.toml       # Navigation menu (English)
│   └── menus.eu.toml       # Navigation menu (Basque)
├── content/                # Markdown content (one file per language: <name>.<lang>.md)
│   ├── _index.<lang>.md    # Home page
│   ├── agenda.<lang>.md    # Agenda/schedule (data-driven, see below)
│   ├── info.<lang>.md      # Attendee info
│   ├── past-editions.<lang>.md
│   ├── wall-of-fame.<lang>.md
│   └── speakers/           # One file per speaker per language: <slug>.<lang>.md
├── layouts/                # Hugo templates
│   ├── _default/           # baseof, single, page, section, taxonomy, speaker-detail
│   ├── _shortcodes/        # speaker_bio, speaker_talk
│   ├── partials/           # Reusable template fragments (site-*, home-*, agenda-*, session-*)
│   ├── agenda/single.html  # Agenda page template
│   ├── info/single.html
│   ├── past-editions/single.html
│   ├── wall-of-fame/single.html
│   └── index.html          # Home page template
├── i18n/                   # Translation strings (TOML), grouped by area
│   ├── <lang>.toml         # Global strings
│   └── <area>/<lang>.toml  # home, sponsors, info, past_editions, agenda, speaker_detail
├── assets/                 # Processed by Hugo Pipes (fingerprinted/compiled)
│   ├── scss/               # SCSS source (see SCSS section)
│   ├── js/main.js          # GSAP ScrollSmoother + interactions
│   └── img/                # Images referenced via resources.Get (org, sponsors, speakers, icons)
├── static/                 # Copied verbatim to site root
│   ├── _headers            # Netlify cache headers for media assets
│   ├── docs/               # Sponsor dossier PDF
│   ├── img/                # Favicons, venue image, raw icons
│   └── video/
├── archetypes/default.md   # Template for `hugo new`
├── resources/_gen/         # Hugo build cache (gitignored)
├── public/                 # Build output (gitignored)
└── netlify.toml            # Build + Hugo version
```

## Languages & content convention

Content files use Hugo's filename-based language convention: `name.<lang>.md`
(e.g. `agenda.es.md`, `agenda.en.md`, `agenda.eu.md`). Every content page should
exist in all three languages. Languages are declared in `config/_default/hugo.toml`
under `[languages]` (`es` weight 1, `en` weight 2, `eu` weight 3).

- `defaultContentLanguage = 'es'`
- `defaultContentLanguageInSubdir = false` — Spanish is served at `/`, others at `/en/`, `/eu/`.

Translatable UI strings live in `i18n/` and are referenced in templates with
`{{ T "key" }}` or `{{ i18n "key" }}`. Strings are split into a global file per
language plus per-area files (`home`, `sponsors`, `info`, `past_editions`, `agenda`,
`speaker_detail`).

## Configuration (`config/_default/hugo.toml`)

Key `[params]` (accessed in templates via `.Site.Params.*`):

| Param | Purpose |
|-------|---------|
| `hashtag` | Event hashtag (`#Bilbostack26`) |
| `sponsorsVisible`, `agendaVisible`, `ticketsOpen` | Feature flags toggling sections |
| `ticketsLink` | Eventbrite URL |
| `youtubeEmbedURL` | Promo video embed |
| `sponsorsDossierLink`, `contactEmail` | Misc links |
| `org` | Array of organizers (`name`, `url`, `image`) |
| `links` | Social links (`title`, `url`, `image`) |
| `editions` | Array of all past/current editions (`year`, `url`, stats, `color`, `current`) |
| `sponsorBlocks` | Tiered sponsor groups (`title` → i18n key, `class` → size, `sponsors[]`) |
| `collaboratorsBlocks` | Collaborator groups (currently `display = false`) |

**To toggle a section site-wide**, flip the relevant boolean flag here rather than
editing templates. **To add a sponsor**, add an entry to the matching
`[[params.sponsorBlocks]]` tier (images live in `assets/img/sponsors/`).
**To add an edition**, append to `editions`.

Markup: Goldmark with `unsafe = true` (raw HTML allowed in Markdown) and block
attribute support. Inline shortcodes are enabled under `[security]`.

## Templates

### Rendering chain

`layouts/_default/baseof.html` is the base shell for every page. It defines blocks
`header`, `main`, and `footer`:

- `<head>`: Google Fonts (Plus Jakarta Sans), then partials `site-favicon`, `site-style`, `site-meta`.
- `header` block → defaults to `site-header.html` partial.
- `main` block → filled by each page's layout.
- `footer` block → `site-footer.html` (rendered with `partialCached`).
- Scripts: GSAP + ScrollSmoother/ScrollTrigger/ScrollToPlugin from CDN, then compiled `js/main.js`.

Page content is wrapped in `#smooth-wrapper > #smooth-content` for GSAP ScrollSmoother.

### Layout selection

Hugo picks the template by the front-matter `type`/`layout`:

| Page | `type` / `layout` | Template |
|------|-------------------|----------|
| Home | `layout = 'index'` | `layouts/index.html` |
| Speaker | `type = 'speaker'`, `layout = 'speaker-detail'` | `layouts/_default/speaker-detail.html` |
| Agenda | `type = 'agenda'` | `layouts/agenda/single.html` |
| Info | `type = 'info'` | `layouts/info/single.html` |
| Past editions | `type = 'past-editions'` | `layouts/past-editions/single.html` |
| Wall of fame | `type = 'wall-of-fame'` | `layouts/wall-of-fame/single.html` |

### Home (`layouts/index.html`)

Composes the landing page from partials in order: `home-header`, `home-cta-sponsors`,
`home-speakers`, `home-program`, `site-sponsors` (collaborators commented out).
`home-program` respects the `agendaVisible` flag.

### Partials

- **Site chrome:** `site-header`, `site-footer`, `site-meta`, `site-favicon`, `site-style`, `site-editions`, `site-sponsors`, `site-collaborators`.
- **Home sections:** `home-header`, `home-speakers`, `home-program`, `home-cta-sponsors`.
- **Agenda:** `agenda-table`, `agenda-header`, `session-full`, `session-track` (see Agenda data model).
- **Speakers:** `speaker-grid-card`.
- **CTA:** `site-cta-la-espuela` (currently commented out).

### Shortcodes (`layouts/_shortcodes/`)

Used inside speaker Markdown bodies:

- `{{< speaker_bio >}}…{{< /speaker_bio >}}` — wraps the bio (markdownified).
- `{{< speaker_talk title="…" day="…" time="…" >}}…{{< /speaker_talk >}}` — renders the talk block. `day`/`time` fall back to the page's `day`/`time` params; `title` falls back to i18n `talk_title_pending`.

## Data model

### Speakers (`content/speakers/<slug>.<lang>.md`)

Front matter (TOML):

```toml
+++
layout = 'speaker-detail'
type = 'speaker'
title = 'Marta Barrio'
tagline = 'Founder Securiters'
taglineLarge = 'Founder Securiters'
day = 'Sábado 31'
time = '12:00h'
description = 'Marta Barrio Mora hablará en el #Bilbostack26'
image = 'img/speakers/marta.jpeg'   # resolved via resources.Get (assets/img/speakers/)
[params]
  links = [
    { title = "Linkedin", url = "..." },
    { title = "Instagram", url = "..." }
  ]
+++

{{<speaker_bio>}} …bio markdown… {{</speaker_bio>}}
{{<speaker_talk title="…">}} …talk description… {{</speaker_talk>}}
```

The speaker image is resized to WebP (`q70 lanczos`) at build time. Social icons are
loaded from `assets/img/` by the `links[].image`/`title` and inlined as SVG.

### Agenda (`content/agenda.<lang>.md`)

Fully data-driven via front matter. Two day tabs (Friday "previa" / Saturday) are
rendered by `agenda-table.html`. Structure:

```toml
[schedule_config_viernes]   # and [schedule_config_sabado]
title = "…"                 # day heading
where = "…"                 # venue
show_header = false          # whether to render the track header row

[[schedule_viernes]]        # repeatable time rows (also schedule_sabado)
time = "17:00-17:40"
type = "single"             # "single" = full-width session, "parallel" = two tracks
  [[schedule_viernes.sessions]]
  title = "…"
  speaker = "…"
  speaker_title = "…"
  speaker_url = "/speakers/<slug>"
```

`agenda/single.html` passes `schedule_viernes`/`schedule_sabado` and the matching
`schedule_config_*` into `agenda-table.html`. Each row renders `session-full.html`
(type `single`) or one `session-track.html` per parallel session, with track names
pulled from i18n keys `track_1`, `track_2`. The whole page respects `agendaVisible`.

### Wall of fame & past editions

`wall-of-fame.<lang>.md` is a hand-maintained Markdown list of every past speaker with
their years. `past-editions.<lang>.md` is currently a `TBD` stub; edition stats come
from the `editions` array in `hugo.toml`.

### Navigation menus

Defined per language in `config/_default/menus.<lang>.toml` as `[[main]]` entries
(`name`, `identifier`, `url`, `weight`, plus `[main.params].desc`). Items: Home,
Agenda, Info, Past editions.

## Styling (SCSS)

Compiled by Hugo Pipes (`toCSS`) via the `site-style.html` partial — requires Hugo
Extended. Entry point `assets/scss/style.scss` imports, in order:

- `abstracts/` — `_variables`, `_mixins`, `_typography`
- `base/` — `_base`, `_images`, `_responsive`
- `components/` — `_buttons`, `_cards`, `_sponsors`, `_speakers`, `_editions`, `_agenda`, `_info`, `_breadcrumbs`
- `layout/` — `_header`, `_footer`, `_layout`
- `fix` — last-resort overrides

There is a separate `assets/scss/laprevia/style.scss` and a top-level `assets/scss/fix.scss`.
Add new component styles as a partial under the matching folder and `@import` it from `style.scss`.

## JavaScript

`assets/js/main.js` is served compiled/fingerprinted. It initializes GSAP
ScrollSmoother on `#smooth-wrapper`/`#smooth-content`, wires smooth scrolling for
in-page anchor links, and drives scroll-based effects. GSAP libraries themselves are
loaded from a CDN in `baseof.html`.

## Static assets & caching

Files in `static/` are copied verbatim to the site root (favicons, the sponsor PDF
under `static/docs/`, the venue image, raw icons). `static/_headers` sets a 7-day
`Cache-Control` for image/video assets on Netlify. Note that processed images and
SVGs referenced in templates live in `assets/img/` (run through Hugo Pipes), while
raw favicons/manifest live in `static/img/`.

## Common tasks (quick reference)

| Task | Where |
|------|-------|
| Add/edit a speaker | `content/speakers/<slug>.<lang>.md` (×3 languages) + image in `assets/img/speakers/` |
| Edit the schedule | `content/agenda.<lang>.md` front matter (`schedule_viernes` / `schedule_sabado`) |
| Add/update a sponsor | `[[params.sponsorBlocks]]` in `config/_default/hugo.toml` + image in `assets/img/sponsors/` |
| Show/hide a section | Feature flags in `[params]` (`agendaVisible`, `sponsorsVisible`, `ticketsOpen`) |
| Change a UI string | `i18n/<lang>.toml` or `i18n/<area>/<lang>.toml` |
| Edit navigation | `config/_default/menus.<lang>.toml` |
| Add an edition | `editions` array in `hugo.toml` |
| Change styles | SCSS partial under `assets/scss/*` + import in `style.scss` |
| Update Hugo version | `netlify.toml` (`HUGO_VERSION`) |

## Notes for agents

- Always create/update content in **all three languages** (`es`, `en`, `eu`) to keep the site consistent.
- Prefer editing config/data (front matter, `hugo.toml` params, i18n) over hardcoding values in templates.
- Images used in templates go in `assets/img/` and are referenced with `resources.Get` (they are processed/resized). Favicons and the sponsor PDF go in `static/`.
- The build requires **Hugo Extended** (for SCSS). Match the version in `netlify.toml` locally to avoid surprises.
- `public/` and `resources/_gen/` are build artifacts and are gitignored — never edit them by hand.
