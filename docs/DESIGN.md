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
$current-color: "violet"; // 2026 edition accent → generates --current-color-100..700
```

To re-theme a new edition, change `$current-color` to one of the ramp names that has a full 100–700 ramp (`orange`, `aqua`, `violet`). The dark theme inverts the ramp via `generate-inverted-colors()`.

Each past edition also carries its own `color` name in the `editions` array of `config/_default/hugo.toml` (`orange`, `blue`, `purple`, `violet`, `pink`, `aqua`, `red`, `dark-yellow`, `cyan`); the editions timeline applies it inline as `--color: var(--{color}-400)`.

**Do:** use `--current-color-400` for edition accents/highlights; use ramp shades for depth; keep clear hierarchy.
**Don't:** invent new brand colours; hardcode hex for theme-sensitive surfaces/text; use accent colours for long body text; low-contrast pairs.

## Typography

**Plus Jakarta Sans** (`--font-family: "Plus Jakarta Sans", sans-serif`). Loaded weights, fluid base size:

```css
--font-size-base: clamp(0.875rem, 0.8182rem + 0.1515vw, 1rem);
--line-height-base: 1.4;
```

Heading scale (from `_typography.scss`):

| El | Size | Notes |
|----|------|-------|
| `h1` / `.h1` | `3rem` | |
| `h2` / `.h2` | `3.4rem` | line-height 1.1; ↓ `2.5rem` @md, `2rem` @sm |
| `h3` / `.h3` | `2rem` | weight 700, **coloured `--current-color-400`** |
| `h4` / `.h4` | `1.5rem` | weight 500 |
| `h5` / `.h5` | `1.25rem` | |
| `h6` / `.h6` | `1rem` | |

Note `h2` is intentionally larger than `h1` (h2 is the dominant section display size). `h3` is the coloured accent heading. Never replace logo typography with live text.

## Components (real classes)

```css
/* Square-bullet heading — coloured 1rem square before the text, in --current-color-400.
   Used for slogans and section subtitles (class "heading-square"). Square hidden @sm. */

/* Pill button — fully rounded (50px), accent fill, sliding offset shadow on hover */
.btn {
  padding: 1rem 2rem; border-radius: 50px; font-size: 1.25rem;
  background: var(--current-color-400);
  color: var(--color-light);
  border: 2px solid var(--current-color-400);
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

- [ ] Plus Jakarta Sans via `--font-family`.
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
