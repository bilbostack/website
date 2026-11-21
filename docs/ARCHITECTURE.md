# Architecture — Bilbostack Website

This document describes the structure of the Bilbostack website for both humans
and AI agents working on the codebase. It explains how the Hugo project is organized,
the data model, and where to change things. The codebase is **reused each year** — the
current edition is **2027** (accent `aqua`). See [`DESIGN.md`](./DESIGN.md) for the design
system and tokens, and [`design-plan.md`](./design-plan.md) for the standing design backlog.

## Overview

- **Generator:** [Hugo](https://gohugo.io/) static site generator (Hugo **Extended**, version `0.161.0` — pinned in `netlify.toml`). The Extended build is required because SCSS is compiled with `toCSS`.
- **Hosting:** [Netlify](https://www.netlify.com/). Build command `hugo --minify`, publish directory `public/`. Deploy is automatic on push.
- **Languages:** Multilingual site — Spanish (`es`, default), English (`en`), Basque (`eu`). The default language is served at the root (no `/es/` prefix).
- **URLs:** `relativeURLs = true` (links are emitted relative, so the build works from any host/path). `enableRobotsTXT = true` generates `robots.txt`.
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
│   ├── sponsorship.<lang>.md  # Sponsor packages page (data-driven front matter)
│   ├── networking.<lang>.md   # Afternoon networking landing (San Mamés)
│   └── speakers/           # One file per speaker per language: <slug>.<lang>.md
├── layouts/                # Hugo templates
│   ├── _default/           # baseof, single, page, section, taxonomy, speaker-detail
│   ├── _shortcodes/        # speaker_bio, speaker_talk
│   ├── partials/           # Reusable template fragments (site-*, home-*, agenda-*, session-*)
│   ├── agenda/single.html  # Agenda page template
│   ├── agenda/single.json  # Agenda JSON output (/agenda/index.json)
│   ├── info/single.html
│   ├── past-editions/single.html
│   ├── sponsorship/single.html
│   ├── networking/single.html
│   └── index.html          # Home page template
├── i18n/                   # Translation strings (TOML), grouped by area
│   ├── <lang>.toml         # Global strings
│   └── <area>/<lang>.toml  # home, sponsors, sponsorship, info, past_editions, agenda, speaker_detail
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
under `[languages]` (`es` weight 1, `en` weight 2, `eu` weight 3). (A couple of pages —
`info` and `past-editions` — currently ship `es` only; add the `en`/`eu` translations when
that content is finalized.)

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
| `hashtag` | Event hashtag (`#Bilbostack27`) |
| `eventStartDate`, `eventEndDate` | ISO 8601 event datetimes — feed the JSON-LD `Event` schema (`site-schema.html`) |
| `eventLocationName`, `eventLocationCity`, `eventLocationRegion` | Venue — feed the JSON-LD `Place`/`PostalAddress` |
| `sponsorsVisible`, `agendaVisible`, `speakersVisible`, `ticketsOpen` | Feature flags toggling sections |
| `ticketsLink` | Ticket sales URL (Entradium event page) |
| `networkingVisible` | Turns the `/networking/` page on/off: `false` hides its menu entries (via the menu `flag` param) and the home teaser card (`home-networking`), and makes the page an instant `noindex` redirect to the home. Build-time, needs a deploy |
| `networking` | `{ start, end, walkMinutes, walkMeters, mapLink }` for the `/networking/` landing — ISO datetimes feed the scoreboard and its live match clock; `walkMinutes`/`walkMeters` the walk from the conference venue on the "getting there" ticket (`0` = pending, shown as a `nw_tbd` tag); `mapLink` the "how to get there" button |
| `merchVisible`, `merch` | Edition t-shirt showcase on the home (`home-merch`): list of `{ image, fit, alt }` — `image` in `assets/img/merch/`, `fit`/`alt` are i18n keys |
| `recapVideo` | `{ year, src, poster, start }` highlights reel in `static/` (`<src>.webm` + `<src>.mp4`); home sponsors CTA and sponsorship page. `poster` is an `assets/` frame shown while it loads (grab it at `start`); `start` is the second it plays and loops from (skips the reel's white fade-in, which otherwise blinks on every loop — looping is done by `initLoopStart` in `main.js`) |
| `youtubeEmbedURL` | Promo video embed |
| `sponsorsDossierLink`, `contactEmail` | Misc links |
| `sponsorsContactEmail`, `sponsorsPaymentDeadline` | Sponsorship page contact and payment deadline (ISO date) |
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

- `<head>`: a `cdn.jsdelivr.net` preconnect, self-hosted font preloads (the three latin subsets that paint above the fold; see `base/_fonts.scss`), then partials `site-favicon`, `site-style`, `site-meta`, `site-schema`.
- `header` block → defaults to `site-header.html` partial.
- `main` block → filled by each page's layout.
- `footer` block → `site-footer.html` (rendered with `partialCached`).
- Scripts: GSAP + ScrollSmoother/ScrollTrigger/ScrollToPlugin from CDN, then compiled `js/main.js`.

Page content is wrapped in `#smooth-wrapper > #smooth-content` for GSAP ScrollSmoother.

### SEO & structured data

- `site-meta.html` emits the per-page `<title>`, meta description, canonical, `hreflang`
  alternates (`x-default` = the default-language version of the page) and social
  (OpenGraph/Twitter) tags. By default the title is `<title> | meta_title` and the
  description `<description>. meta_description`; front matter `seoTitle` /
  `seoDescription` replace them verbatim (used by the sponsorship page). `image` in front
  matter sets `og:image` (falls back to the logo).
- `site-schema.html` emits JSON-LD: an `Organization` block site-wide, an `Event`
  block **only on the home page**, and a `BreadcrumbList` (Home › page) on every other page. The `Event` is assembled from the `eventStartDate` /
  `eventEndDate` params and the `eventLocationName` / `eventLocationCity` /
  `eventLocationRegion` params, the `current` edition's `year`, and — when `ticketsOpen` —
  an `Offer` pointing at `ticketsLink`. Keep these params accurate at each rollover.
  When `agendaVisible` is on, the home `Event` also gets a `subEvent` per agenda talk (and
  per session with its own `location` + `address`, e.g. La Espuela), built from
  `agenda-days.html`: `startDate`/`endDate`, `Place`, and a `performer` `Person` whose `url`
  is the speaker page (only when `speaker_url` resolves to a published page).
- `site-meta.html` adds `<link rel="alternate" type="application/json">` on pages that
  have a `json` output (currently only the agenda).

### Layout selection

Hugo picks the template by the front-matter `type`/`layout`:

| Page | `type` / `layout` | Template |
|------|-------------------|----------|
| Home | `layout = 'index'` | `layouts/index.html` |
| Speaker | `type = 'speaker'`, `layout = 'speaker-detail'` | `layouts/_default/speaker-detail.html` |
| Agenda | `type = 'agenda'` | `layouts/agenda/single.html` |
| Info | `type = 'info'` | `layouts/info/single.html` |
| Past editions | `type = 'past-editions'` | `layouts/past-editions/single.html` |
| Sponsorship | `type = 'sponsorship'` | `layouts/sponsorship/single.html` |
| Networking | `type = 'networking'` | `layouts/networking/single.html` |

### Home (`layouts/index.html`)

Composes the landing page from partials in order: `home-header`, `home-cta-sponsors`,
`home-speakers`, `home-program`, `home-networking`, `home-merch`, `site-sponsors` (collaborators commented out).
`home-program` respects the `agendaVisible` flag. `home-networking` is the teaser card for
`/networking/` right under the program cards (pulled up over `#programa`'s section margin so it
reads as the program's third beat): copy + CTA on the left, the inlined San Mamés illustration
(reusing `.nw-stadium`) with the kick-off/whistle scoreboard on the right, the line-up on a
perimeter board below. It reads the landing's own `heading`, `lead` and `lineup` front matter and
`site.Params.networking` times, so it needs no copy of its own beyond `home_nw_cta`; hidden with
`networkingVisible = false`. Styles: `components/_home-networking.scss`.

### Partials

- **Site chrome:** `site-header`, `site-footer`, `site-meta`, `site-schema`, `site-favicon`, `site-style`, `site-editions`, `site-sponsors`, `site-collaborators`, `site-wall-of-fame`.
- **Home sections:** `home-header`, `home-speakers`, `home-program`, `home-networking`, `home-merch`, `home-cta-sponsors`.
- **Agenda:** `agenda-table`, `agenda-header`, `session-full`, `session-track` (see Agenda data model); `agenda-days` returns the normalized agenda for JSON-LD and the JSON output.
- **Speakers:** `speaker-grid-card`.
- **Networking:** `networking-icon` (inline stroke icon by name: `drinks`, `food`, `networking`, `music`, `raffle`, plus `ticket` and `check` for the admission stub/note).
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
description = 'Marta Barrio Mora hablará en el #Bilbostack27'
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

**Machine-readable agenda.** `outputs = ['html', 'json']` in the agenda front matter (×3)
also publishes `/agenda/index.json` (and `/en/…`, `/eu/…`) from `layouts/agenda/single.json`:
event metadata, `published` (= `agendaVisible`), `days[]` with their `sessions[]`, and the
URLs of the other languages' JSON. Both this file and the JSON-LD `subEvent`s read the
normalized data from the `agenda-days.html` partial (it `return`s the days; empty while
`agendaVisible = false`, so draft agenda data never leaks). Dates come from
`eventStartDate`: `sabado` is that day, `viernes` the day before; times must be
`HH:MM-HH:MM` to get ISO `start`/`end` (others keep only the raw `time`). Advertised in
`static/llms.txt`.

### Wall of fame & past editions

The Wall of Fame is rendered from `data/walloffame.yaml` (single source of truth) via
the `site-wall-of-fame.html` partial, which is embedded in `past-editions/single.html`
and anchored as `#wall-of-fame` (the sponsorship page links to it under the chart).
`past-editions.<lang>.md` is currently a `TBD` stub; edition stats come from the
`editions` array in `hugo.toml`.

### Sponsorship page (`content/sponsorship.<lang>.md`)

Sponsor-facing page at `/sponsorship/` (×3 languages). Translated, page-specific data lives
in front matter: `lead`, `reasons[]` (`title`, `text` — rendered as `<Title/>`),
`packages[]` (`name`, `icon`, `price` as a localized string, `max`, `featured`, `benefits[]`),
`extras[]` (`icon`, `label`, `pending`) and `conditions[]`. Keep the arrays in the same order
across languages. Section headings are i18n keys in `i18n/sponsorship/`. Site-wide values come
from params: event date/venue, `sponsorsDossierLink`, `sponsorsContactEmail`,
`sponsorsPaymentDeadline`. The hero's key-facts strip derives its calendar sheet (day, month,
weekday, localized by Hugo) from `eventStartDate`; the deadline card's "N days left" pill is
filled client-side by `initSponsorCountdown()` in `main.js` (strings `sp_deadline_left/last/closed`,
hidden without JS). The headline numbers and the attendees bar chart are computed at
build time from the `editions` array (editions with `attendees`), so they update when an
edition is archived; the chart is pure HTML/CSS (each bar is a stack of 100-person blocks,
gaps between years are drawn as a dashed placeholder) with a `<details>` data table. Bars grow
in via `initRevealAnimations()` in `main.js`.
The "En imágenes" media sheet shows the `recapVideo` reel, `assets/img/bilbostack_publico.webp`
and the venue loop (`static/video/euskalduna.*`), plus links to the latest edition in `editions`
that has `videos` / `photos`. Videos keep native controls without JS; `initSponsorMedia()` in
`main.js` swaps them for one play/pause toggle and only plays them while on screen (starts
paused with reduced motion).

### Networking page (`content/networking.<lang>.md`)

Attendee-facing landing at `/networking/` (×3 languages) for the afternoon networking inside
San Mamés stadium, staged as the "second half" of a match. Times come from the `networking`
param (shared by the three languages); translated copy lives in front matter: `heading`,
`lead`, `venueText`, `transport`, `access` (`{ gate, space }`: entrance gate and the space inside
the stadium; empty = a "pending" tag on the page), `schedule[]` (`time`, `title`, `text`: the afternoon
programme shown beside the headline, closed automatically by a final-whistle row at
`networking.end`) and `lineup[]` (`position`, `icon`, `title`,
`text`, optional `captain`, optional `notIncluded`, optional `note`; `icon` is drawn in the round magnet token on the card's corner).
Drinks are not part of the ticket: every "included with your ticket" claim on the page (hero stub,
venue note, perimeter board) and each line-up item with `notIncluded = true` carries an asterisk
(`.nw-asterisk`, aria-hidden) with the `nw_drinks_note` fine print (`.nw-fineprint`) beside it;
an item with `note` gets the same asterisk with its own fine print instead (e.g. food).
The line-up is a magnetic tactics board: cards hang slightly askew from their magnet
(straighten on hover), drop onto the board when it scrolls in (`main.js` toggles
`.is-armed`/`.is-in`, skipped under reduced motion), and on desktop a chalk passing move
(inline SVG, path data in the template) carries a looping ball into the goal with a
`nw_goal` flash. The captain (`captain = true`) gets the larger centre card. `position` places each item on the pitch on desktop
(`left-top`, `left-bottom`, `center`, `right-top`, `right-bottom`); on mobile the cards stack
in front-matter order, so keep the captain third (on the halfway line) and the same order in
all languages. Labels are i18n keys in `i18n/networking/` (`nw_*`, incl. the translated venue
name `nw_venue_name`). The hero opens with a full-bleed band (edge to edge): the stadium picture
with the scoreboard strip at its base, then the perimeter LED board as a separator; below
it, back in the content column, the headline and lead on the left and the schedule card on
the right (kicker = the date, no buttons: the header carries the tickets CTA and the route
lives in the venue section). Under the lead, an "included with your ticket" stub (`nw_included_title` /
`nw_included_text`) makes clear the afternoon comes with the conference ticket; the same
message repeats on the perimeter board and as a note under the venue CTAs (`nw_included_note`). The picture is by default
the inline night illustration `assets/img/networking/san-mames.svg` (five-tier facade on the
edition ramp, fins animate as an LED wave; alt text `nw_stadium_alt`); set `venueImage` (path under
`assets/`) + `venueImageAlt` in front matter to show a real photo instead. The illustration keeps its ratio at the band's height, centred, and
the band continues its sky/river gradient past the sides. The scoreboard
is a strip built into the picture's base (kick-off │ match clock │ final whistle); its status
line shows the date without JS, and `initNetworkingClock()` in `main.js` turns it into a day
countdown, "today" kick-off, live "minute N'" with a progress bar running from kick-off to
whistle, or full time. The venue section carries the page's tickets CTA (only when
`ticketsOpen`) beside "how to get there"; there is no closing CTA section.
Styles: `components/_networking.scss`.

Social preview (`og:image` / X `summary_large_image`): front matter `image =
'img/networking/og-la-espuela.jpg'` in the three languages — a 1200×630 still of the San Mamés
illustration over an LED scoreboard ("La Espuela", 14:00 → 20:00, date, venue). Its text is
language-neutral, so one image serves es/en/eu. It is a baked render (edition accent, date and
times are in the pixels): regenerate it when the edition color, `networking.start`/`end` or the
date change.

### Navigation menus

Defined per language in `config/_default/menus.<lang>.toml` as `[[main]]` entries
(`name`, `identifier`, `url`, `weight`, plus `[main.params].desc` and an optional
`[main.params].flag`: the name of a boolean site param; the header and footer skip the entry
while it is false, e.g. `flag = "networkingVisible"`). Items: Home,
Agenda, Networking, Info, Past editions, Sponsorship.

## Styling (SCSS)

Compiled by Hugo Pipes (`toCSS`) via the `site-style.html` partial — requires Hugo
Extended. Entry point `assets/scss/style.scss` imports, in order:

- `abstracts/` — `_variables` (design tokens: colour ramps + accent semantics, the font
  voices `--font-family` Plus Jakarta Sans / `--font-family-display` Space Grotesk /
  `--font-family-mono` JetBrains Mono, the fluid heading scale `--font-size-h*`, the spacing
  scale `--space-*` / `--section-gap`), `_mixins` (`visually-hidden`, `focus-ring`,
  `generate-inverted-colors`), `_typography` (heading voices + the `.mono` utility)
- `base/` — `_fonts` (self-hosted `@font-face` for Plus Jakarta Sans + Space Grotesk + JetBrains Mono),
  `_base` (visually-hidden utility, default focus ring, reduced-motion block),
  `_atmosphere` (dot-grid texture `.bs-texture-dots`),
  `_images`, `_responsive`
- `components/` — `_buttons`, `_cards`, `_sponsors`, `_speakers`, `_editions`, `_agenda`, `_info`, `_breadcrumbs`, `_sponsorship`, `_merch`, `_networking`, `_home-networking`
- `layout/` — `_header`, `_footer`, `_layout`
- `fix` — last-resort overrides (kept empty by default; fix the real partial instead)

**Spacing & type:** prefer the tokens — `--space-1…--space-10` and `--section-gap` for
margins/padding/gaps, `--font-size-h*` for headings, `--font-size-lead` for intro/lead body
copy — over hardcoded `rem` values, so rhythm stays consistent.

**Colour & theming (light/dark):** each edition picks an accent via the `$current-color`
SCSS var in `_variables.scss` (e.g. `"aqua"`), which maps the chosen colour ramp onto the
`--current-color-*` (and `--current-color-fixed-*`) custom properties. Components use the
semantic split: `--accent` (= `--current-color-400`, decorative only) and `--accent-ink`
(= `--current-color-500`, accent used as text or text-bearing fill). The site ships a real
**dark theme**: `html.dark-theme` re-runs the `generate-inverted-colors($color)` mixin to
invert the ramp (`--current-color-N` ← ramp `(8−i)*100`), so the same `--accent` tokens stay
legible in both themes. The theme is toggled at runtime via cookie (see JavaScript). When
rolling editions, change `$current-color` — keep the dark-theme inversion driven by the same
value rather than a second hardcoded hue. See `DESIGN.md` for the full token contract.

`assets/scss/laprevia/style.scss` is a **standalone, orphaned** stylesheet (self-contained,
no `@import`, not referenced by any template or the `style.scss` entry point) — a leftover
from an old "la previa" page. It is **not** part of the current build; leave it alone unless
reviving that page.

Add new component styles as a partial under the matching folder and `@import` it from `style.scss`.

## JavaScript

`assets/js/main.js` is served minified/fingerprinted (with a Subresource Integrity hash).
It initializes GSAP ScrollSmoother on `#smooth-wrapper`/`#smooth-content`, wires smooth
scrolling for in-page anchor links, the mobile menu, the agenda day tabs (`initAgendaTabs`),
and drives scroll-based effects — including `initRevealAnimations()`, the staggered
scroll-reveal of the speakers grid and program cards, plus the logo "stack" timeline and
sticky program cards. All scroll-driven choreography (smoother, pins, logo timeline, reveals)
is gated on `prefers-reduced-motion`. GSAP libraries themselves are loaded from a CDN in
`baseof.html`.

**Theme toggle:** `initThemeToggle()` reads/writes the `bilbostack-theme` cookie
(`getThemeFromCookie` / `setThemeCookie`, defaulting to `prefers-color-scheme`) and calls
`applyTheme()` to set `html.dark-theme` / `html.light-theme`, which drives the SCSS ramp
inversion described above. (Note: the theme is applied from `main.js`, which is `defer`-loaded,
so there is currently an initial light-theme paint for dark users — see `design-plan.md` §2.1.)

## Static assets & caching

Files in `static/` are copied verbatim to the site root (favicons, the sponsor PDF
under `static/docs/`, the venue image, raw icons, the self-hosted fonts under
`static/fonts/` — referenced by absolute path from `base/_fonts.scss` — and `static/llms.txt`,
the [llmstxt.org](https://llmstxt.org) site summary served at `/llms.txt`). `static/_headers` sets a 7-day
`Cache-Control` for image/video assets on Netlify. Note that processed images and
SVGs referenced in templates live in `assets/img/` (run through Hugo Pipes), while
raw favicons/manifest live in `static/img/`.

## Common tasks (quick reference)

| Task | Where |
|------|-------|
| Add/edit a speaker | `content/speakers/<slug>.<lang>.md` (×3 languages) + image in `assets/img/speakers/` |
| Edit the schedule | `content/agenda.<lang>.md` front matter (`schedule_viernes` / `schedule_sabado`) |
| Add/update a sponsor | `[[params.sponsorBlocks]]` in `config/_default/hugo.toml` + image in `assets/img/sponsors/` |
| Show/hide a section | Feature flags in `[params]` (`agendaVisible`, `sponsorsVisible`, `speakersVisible`, `networkingVisible`, `ticketsOpen`) |
| Change a UI string | `i18n/<lang>.toml` or `i18n/<area>/<lang>.toml` |
| Edit navigation | `config/_default/menus.<lang>.toml` |
| Add an edition | `editions` array in `hugo.toml` |
| Change the edition accent / roll a new edition | `$current-color` in `assets/scss/abstracts/_variables.scss` + the `current` edition flag in `hugo.toml` (use the `edition` skill) |
| Update event date / venue (also feeds JSON-LD) | `eventStartDate` / `eventEndDate` / `eventLocation*` in `[params]` |
| Change styles | SCSS partial under `assets/scss/*` + import in `style.scss` |
| Update Hugo version | `netlify.toml` (`HUGO_VERSION`) |

## Notes for agents

- Always create/update content in **all three languages** (`es`, `en`, `eu`) to keep the site consistent.
- Prefer editing config/data (front matter, `hugo.toml` params, i18n) over hardcoding values in templates.
- Images used in templates go in `assets/img/` and are referenced with `resources.Get` (they are processed/resized). Favicons and the sponsor PDF go in `static/`.
- The build requires **Hugo Extended** (for SCSS). Match the version in `netlify.toml` locally to avoid surprises.
- `public/` and `resources/_gen/` are build artifacts and are gitignored — never edit them by hand.
