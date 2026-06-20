# BilboStack Design Guidelines

Practical design rules for the BilboStack site. Brand direction derives from the
BilboStack 2024 Brandbook (CRISIS Design Studio); the technical sections below reflect
the **actual implementation** in `assets/scss/`. Use official logo/brand assets from the
repo — never recreate them.

> Source of truth for tokens: `assets/scss/abstracts/_variables.scss` and
> `assets/scss/abstracts/_typography.scss`. If you change a token, update this file.

## Brand in one line

Bilbao's annual tech conference, grown into a community. The site must feel **technical, colourful, diverse, inclusive and fun** — never generic SaaS, never grey-corporate.

- Tagline: **"Come for the talks. Return for the experience."**
- Playful local variant (social/landing only, use sparingly): "Come for the pintxos."
- Audience: anyone building software, all experience levels — incl. students, companies hiring, speakers/attendees seeking a great experience.

## Visual personality

Bold · Colourful · Geometric · Technical · Inclusive · Playful.
Subtle code references OK (e.g. `<Tech Conference/>`). Avoid: minimalism that kills energy, rainbow-everywhere with no hierarchy, heavy shadows/glossy effects, generic stock imagery.

## Theming (light + dark)

The site ships **both light and dark themes**. A toggle (`#theme-toggle-checkbox`, JS in `assets/js/main.js`) sets `html.dark-theme` / `html.light-theme` and persists choice in the `bilbostack-theme` cookie.

Never hardcode `#08262e`/`#ffffff` for text or backgrounds. Use the theme-aware aliases so both themes work:

```css
--color-dark: #08262e;   /* fixed, never changes with theme */
--color-light: #ffffff;  /* fixed, never changes with theme */

--color-primary-dark:  var(--color-dark);  /* flips to light in dark theme */
--color-primary-light: var(--color-light); /* flips to dark in dark theme  */
--font-color:          var(--color-primary-dark); /* default text colour */
```

Default page background is `--color-primary-light` (white in light theme, `#08262e` in dark theme) — **not** a grey surface.

## Colour

Each hue is a token ramp; `-400` is the "main" shade. Tokens (verbatim from `_variables.scss`):

```css
:root {
  --orange-400: #f08a17;       /* ramp: orange-100..700 */
  --aqua-400:   #00a199;       /* ramp: aqua-100..700   */
  --violet-400: #7e31a2;       /* ramp: violet-100..700 */
  --blue-400:   #2e2e83;
  --cyan-400:   #019cd1;
  --purple-400: #991b80;
  --yellow-400: #fcb817;
  --dark-yellow-400: #f08a17;
  --red-400:    #2e2e83;       /* NOTE: currently overridden to blue; original #e2241b is commented out */
  --pink-400:   #e1287c;
}
```

### Edition / active accent — `--current-color-*`

The site-wide accent (headings `h3`, link hover, buttons, `.heading-square`) is **not** a fixed colour — it's `--current-color-400`, generated from the Sass variable `$current-color` in `_variables.scss`:

```scss
// File scope (top of _variables.scss), so light + dark themes both read it.
$current-color: "aqua"; // 2027 edition accent → generates --current-color-100..700
```

The current edition accent is **per-edition** — it changes each year (see the `edition`
skill). Always read the live value from `_variables.scss`; don't assume a fixed hue.

To re-theme a new edition, change `$current-color` (one place) to any colour that ships a full 100–700 ramp. The dark theme inverts the **same** ramp via `generate-inverted-colors($current-color)` — it's derived from `$current-color`, not a hardcoded hue, so there's nothing else to update.

**Colours available as a full edition accent** — every design-system colour now qualifies:

| Colour | Ramp | Seed `-400` |
|--------|------|-------------|
| `aqua` | hand-tuned | `#00a199` |
| `orange` | hand-tuned | `#f08a17` |
| `violet` | hand-tuned | `#7e31a2` |
| `blue` | generated | `#2e2e83` |
| `cyan` | generated | `#019cd1` |
| `purple` | generated | `#991b80` |
| `yellow` | generated | `#fcb817` |
| `dark-yellow` | generated | `#d97a06` |
| `red` | generated | `#e2241b` |
| `pink` | generated | `#e1287c` |

`aqua` / `orange` / `violet` carry hand-tuned ramps; the rest are generated from their single `-400` seed by the `make-ramp()` mixin + `$ramp-seeds` map in `_variables.scss` (tints mix toward white, shades toward `--color-dark`, so the dark-theme inversion gets coherent dark surfaces). To add a **new** colour, append one `"name": #hex` seed to `$ramp-seeds` — ramp and inversion are generated automatically. Always re-check `--accent-ink` (`-500`) for AA on white, especially warm hues.

> **Why aqua / orange / violet are NOT in `$ramp-seeds` (deliberate).** Their **shades**
> (`-500/-600/-700`) are *exactly* what `make-ramp()` produces (the 50/80/90% mixes toward
> `--color-dark` were reverse-engineered from them), but their **light tints**
> (`-100/-200/-300`) were hand-neutralised to be greyer than the formula. Example, aqua-100:
> hand-tuned `#e6eef0` vs generated `#d1eeed` (more saturated/teal). Since the `@each` loop runs
> *after* the explicit blocks inside `:root`, adding these three to `$ramp-seeds` would **override**
> their hand-tuned tints and visibly shift the live edition — so they stay as explicit overrides.
> If you ever want a fully uniform system, move all three into `$ramp-seeds` and delete their
> explicit blocks, accepting the small tint shift on the current edition.

Each past edition also carries its own `color` name in the `editions` array of `config/_default/hugo.toml` (`orange`, `blue`, `purple`, `violet`, `pink`, `aqua`, `red`, `dark-yellow`, `cyan`); the editions timeline applies it inline as `--color: var(--{color}-400)`.

**Accent contrast tokens** (in `_variables.scss`): use the right one or you'll fail AA.

- `--accent` (= `--current-color-400`): **decorative only** — the square bullet, shapes,
  logo layers, drop-shadows. Never put text on it or use it *as* text.
- `--accent-ink` (= `--current-color-500`): the accent **as text** or as a **text-bearing
  fill** (buttons, tags, agenda headers, accent headings/links). It keeps AA contrast
  against `--color-primary-light` in both themes; pair text-bearing fills with
  `color: var(--color-primary-light)`.

**Do:** use `--accent` for decoration and `--accent-ink` for anything carrying/being text;
use ramp shades for depth; keep clear hierarchy.
**Don't:** invent new brand colours; hardcode hex for theme-sensitive surfaces/text; use
`--accent` (the bright -400) for text or text-bearing fills; low-contrast pairs.

## Typography

Three voices (tokens in `_variables.scss`):

- **Body — Plus Jakarta Sans** (`--font-family`). The default for all running text.
- **Display — Space Grotesk** (`--font-family-display`). Geometric/technical; applied to
  `h1`/`.h1` and `h2`/`.h2` (hero + section headings) only.
- **Mono — JetBrains Mono** (`--font-family-mono`). Reserved for genuinely *technical*
  tokens — agenda times (`.time-slot`), edition years + per-edition stats, the footer
  `<Tech Conference/>` motif, and the speaker day/time `.tag`s. Use the `.mono` utility
  (it also enables tabular figures) for new cases; **never** for body copy.

All three faces are **self-hosted** variable woff2 (latin + latin-ext; Plus Jakarta Sans
also ships an italic) in `static/fonts/`, declared in `assets/scss/base/_fonts.scss` with
`font-display: swap` and preloaded in `baseof.html` — no third-party font request. Fluid
base size:

```css
--font-size-base: clamp(0.875rem, 0.8182rem + 0.1515vw, 1rem);
--line-height-base: 1.4;
```

Heading scale — a single fluid modular scale (`--font-size-h*` in `_variables.scss`,
applied in `_typography.scss`). Each step `clamp()`s between a mobile min and desktop max,
so headings scale smoothly with no breakpoint jumps:

| El | Token (min → max) | Notes |
|----|-------------------|-------|
| `h1` / `.h1` | `2.5rem → 4rem` | **dominant display size**; Space Grotesk |
| `h2` / `.h2` | `2rem → 3.4rem` | section display, line-height 1.1; Space Grotesk |
| `h3` / `.h3` | `1.5rem → 2rem` | weight 700, **coloured `--accent-ink`** |
| `h4` / `.h4` | `1.25rem → 1.5rem` | weight 500 |
| `h5` / `.h5` | `1.25rem` | |
| `h6` / `.h6` | `1rem` | |

`h1` is the dominant display size and `h2` the section size just below it (the earlier
`h1 < h2` inversion was fixed in P1). `h1`/`h2` use the Space Grotesk display voice; `h3`
is the coloured accent heading. Headings use `text-wrap: balance`. Never replace logo
typography with live text.

## Components (real classes)

```css
/* Square-bullet heading — coloured 1rem square before the text, in --current-color-400.
   Used for slogans and section subtitles (class "heading-square"). Square hidden @sm. */

/* Pill button — fully rounded (50px), accent fill, sliding offset shadow on hover.
   Fill is --accent-ink (= --current-color-500), the text-bearing accent shade, so the
   white label keeps AA contrast in BOTH themes (see "Accent semantics" above). */
.btn {
  padding: 1rem 2rem; border-radius: 50px; font-size: 1.25rem;
  background: var(--accent-ink);
  color: var(--color-primary-light);
  border: 2px solid var(--accent-ink);
}
.btn-outline {           /* outlined variant: text/border in --font-color, accent slides up on hover */
  border-color: var(--font-color); color: var(--font-color);
  background: var(--color-primary-light);
}
/* .btn-primary is used in templates as an alias of the base .btn */

/* Tag pill — used for speaker talk day/time (classes "tag", "tag-day") */
```

```html
<p class="heading-square">{{ T "home_slogan_short" }}</p>
<a href="…" class="btn btn-primary">{{ T "cta_tickets" }}</a>
<a href="/agenda" class="btn btn-outline">{{ T "agenda" }}</a>
<span class="tag tag-day">{{ .day }}</span><span class="tag">{{ .time }}</span>
```

`--border-radius: 0.5rem` / `--border-radius-xs: 0.25rem` exist for cards/blocks; buttons and tags are full pills. Section blocks use `.block-heading` (sticky-ish heading band). Cards are structured and clean — use colour as a label/accent border, not as a fill on every card.

## Imagery

Real event moments over stock: talks, attendees, networking, learning, diverse/inclusive groups, Bilbao atmosphere. Keep natural; no palette-fighting filters; pair with colour blocks/labels. Don't pass off packed-room photos as diversity.

## Copy & tone

Technical but accessible, confident not arrogant, friendly, inclusive, international, playful when fitting. Short direct statements ("The annual tech conference in Bilbao."). Inclusive language, no developer/student/company stereotypes, no insider-only jokes; Bilbao/pintxos for warmth not gimmick.

## Accessibility

- Sufficient contrast in **both** themes; never colour alone to convey meaning.
- Visible focus states; clear labels on buttons/links (icon buttons already have `aria-label`).
- Useful alt text (decorative excepted); logo alt usually `BilboStack`; no hover-only interactions; readable on mobile.
- Verify accent-on-background contrast, especially orange/yellow with white text and the active `--current-color-400` against the current theme background.

## Logo

Always use official assets in `assets/img/` (`bilbostack-logo*.svg`, `logo-header-light/dark.png`, `tech_conference.svg`, `year-*.svg`). **Never** redraw, recolour, distort, crop, stretch, add shadows/effects, or use incomplete versions. Don't separate `<Tech Conference/>` from the logo unless an official asset does. Provide both light/dark header logos so theming stays legible.

## Page priorities

- **Home:** positioning → date+location → primary CTA → experience (talks, networking, community, Bilbao) → speakers/schedule/sponsors → practical info. One strong hero with a `heading-square` slogan.
- **Speakers:** clean readable cards, accent labels for day/time, consistent crops, not overloaded with colour.
- **Agenda/schedule:** structured/technical; time, room, speaker, title scannable.
- **Sponsors:** legible logos, ample whitespace, neutral backgrounds, never alter sponsor logos.
- **Venue/Bilbao (info):** lean into local experience and photography; warm, practical tone.

## Agent checklist

- [ ] Body in Plus Jakarta Sans (`--font-family`); `h1`/`h2`/hero in the display voice
  (`--font-family-display`); mono (`--font-family-mono` / `.mono`) only on technical
  tokens (times, years, stats, `<Tech Conference/>`), never body copy.
- [ ] Colours from the official tokens; no new/random hex; no hardcoded theme-sensitive colours.
- [ ] Accents via `--current-color-400`; both light and dark themes verified.
- [ ] Logo from official asset; not recoloured/distorted/cropped/shadowed.
- [ ] Strong hierarchy, intentional highlights (not everywhere), enough whitespace.
- [ ] UI strings via `{{ T "key" }}` (i18n), not hardcoded.
- [ ] CTAs findable; focus states + contrast pass; mobile not an afterthought.
- [ ] Sponsor areas don't overpower the attendee experience.

## Anti-patterns

Generic dark dev conference · off-brand neon gradients · logo as plain text · full rainbow in every component · hardcoded `#08262e`/`#fff` instead of theme tokens · sponsors louder than the community · "diversity" as a word only · too formal to feel alive.

## Assets & legal

Brandbook/assets by CRISIS Design Studio for BilboStack — don't redistribute outside the authorised project. Use official exported logo files; don't recreate protected assets; ask maintainers before changing core identity elements.
