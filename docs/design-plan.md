# BilboStack — Design Improvement Plan

Analysis of the current site (2027 edition, accent `aqua`) with a prioritized set of
design improvements. The plan **builds on** the existing system documented in
[`DESIGN.md`](./DESIGN.md) and [`ARCHITECTURE.md`](./ARCHITECTURE.md) — it does not
re-theme the brand. Every proposal stays inside the existing token system
(`assets/scss/abstracts/_variables.scss`), the three-voice typography, the dual light/dark
theme and the i18n convention.

> Scope: this is a planning document. Nothing here is implemented yet. Each item lists the
> problem, the evidence, the proposed change, the files it touches and an effort estimate.

---

## 1. What's already strong (keep — do not regress)

The site is **not** generic. It already does a lot right, and the plan protects these:

- **Distinctive hero.** The oversized `BilboStack` wordmark with the layered
  (`capa1–4`) GSAP "stack" reveal and the dot-grid texture is genuinely memorable and
  on-brand ("bold · geometric · technical"). See `layouts/partials/home-header.html`,
  `_header.scss` `.logo-header`, `main.js` `initLogoAnimation()`.
- **Mature token system.** Colour ramps + per-edition `--current-color-*`, the
  `--accent` / `--accent-ink` contrast split, a fluid modular heading scale, a spacing
  scale and `--section-gap`. This is better than most conference sites.
- **Three real type voices, self-hosted.** Plus Jakarta Sans (body) / Space Grotesk
  (display) / JetBrains Mono (technical tokens), preloaded, `font-display: swap`.
- **Dual theme + reduced-motion.** A real dark theme via ramp inversion, and *all*
  scroll choreography gated on `prefers-reduced-motion`.
- **Governance.** `DESIGN.md` is a strong source of truth; this plan keeps it valid.

The improvements below are about **fixing a few real defects**, **raising the floor in
empty/early-cycle states**, and **adding intentional polish** — not redesigning.

---

## 2. P0 — Defects & quick wins (high impact, low effort)

### 2.1 Eliminate the theme flash (FOUC)
**Problem.** Dark-theme users see a flash of the light theme on every page load.
**Evidence.** The theme is applied from `assets/js/main.js` (`applyTheme`, called by
`initThemeToggle` inside `DOMContentLoaded`), and `main.js` is loaded `defer`
(`baseof.html:34`). There is **no** theme decision in `<head>`, so the first paint is
always light; dark users get a visible flip.
**Proposal.** Add a tiny **blocking** inline script as the first thing in `<head>`
(before `site-style`) that reads the `bilbostack-theme` cookie (falling back to
`prefers-color-scheme`) and sets `html.dark-theme` / `html.light-theme` *before* CSS
paints. `main.js` keeps owning the toggle interaction; it just stops being responsible
for the *initial* class.
**Files.** `layouts/_default/baseof.html` (new inline `<script>` in `<head>`),
optional small refactor in `assets/js/main.js` so `getThemeFromCookie()` is reused.
**Effort.** ~30 min. **Impact.** High — removes the single most visible polish defect.

### 2.2 Fix the mobile hero / floating-nav overlap
**Problem.** On phones the hero slogan collides with the floating bottom action bar — the
last line of the slogan renders *behind* the hamburger button.
**Evidence.** Mobile screenshot shows "…mucha innova[≡]ción" overlapping the hamburger.
`.navbar-mobile` is `position: fixed; bottom: 2rem` (`_header.scss:39`) while
`#home-header > .content` is `justify-content: flex-start` and `height: calc(100dvh − …)`
on mobile (`_header.scss:418`), so the slogan sits in the same band.
**Proposal.** Reserve space for the floating bar: add `padding-bottom` (≈ `6rem`) to the
hero content at `≤ $breakpoint-md`, and/or give the page a `--mobile-actionbar-height`
token that the hero and any bottom-anchored content respect. Verify the slogan never sits
under the bar at the common phone heights (≤ 700px tall).
**Files.** `assets/scss/layout/_header.scss`.
**Effort.** ~30 min. **Impact.** High — current state looks broken on the most common device.

### 2.3 Decouple dark-theme inversion from a hardcoded hue
**Problem.** The dark theme inverts the **aqua** ramp regardless of the edition accent.
If a future edition sets `$current-color: "orange"` (or `violet`), the dark theme will
invert *aqua* while the light theme uses *orange* → wrong accent in dark mode.
**Evidence.** `_variables.scss:161` → `@include generate-inverted-colors("aqua");` is a
string literal, not derived from `$current-color` (defined at `:61`).
**Proposal.** Pass `$current-color` into the mixin:
`@include generate-inverted-colors($current-color);`. Confirm the `edition` skill no
longer needs to edit two places. Add a one-line comment so it's not "fixed" back.
**Files.** `assets/scss/abstracts/_variables.scss`; note in `DESIGN.md` + `edition` skill.
**Effort.** ~15 min (+ test all three ramp names in dark mode). **Impact.** Medium-high —
prevents a silent breakage at the next rollover.

### 2.4 Reconcile button token drift with the docs
**Problem.** `DESIGN.md` documents `.btn` background as `--current-color-400`, but the
implementation uses `--accent-ink` (= `--current-color-500`).
**Evidence.** `_buttons.scss:5` `background-color: var(--accent-ink);` vs `DESIGN.md`
§Components.
**Proposal.** Decide the intended shade (recommend keeping `--accent-ink` for AA contrast
with `--color-primary-light` text, which is the safer choice) and make the **docs match
the code** (or vice-versa). Single source of truth wins.
**Files.** `DESIGN.md` (or `_buttons.scss`). **Effort.** ~10 min. **Impact.** Low, but
keeps the design system trustworthy.

---

## 3. P1 — High-impact design improvements

### 3.1 Give the hero an information scent + a primary action
**Problem.** On desktop the hero is a full `100dvh` with the wordmark at the top, the
slogan pinned to the bottom, and a **large empty middle**. There's no in-hero CTA and no
scroll affordance — the date/location live only as small text in the header. A first-time
visitor sees a beautiful logo but no obvious next step above the fold.
**Evidence.** Desktop capture: wordmark + dot grid, then ~50% empty viewport, slogan at
the very bottom. The first CTA encountered on scroll is the *sponsors* dossier
(`home-cta-sponsors.html`), not tickets/agenda.
**Proposal (conservative, on-brand):**
- Promote the **date + location** into the hero composition as a `.mono` technical token
  block (reusing the `header_when` / `header_where` strings), near the slogan.
- Add a clear **primary CTA** in the hero — *Tickets* when `ticketsOpen`, else *Agenda*
  / *Newsletter* — using the existing `.btn` pill. (Today the tickets CTA only lives in
  the header bar and is `hide-on-mobile`.)
- Add a subtle **scroll-down indicator** (animated chevron / "↓ programa"), gated on
  `prefers-reduced-motion`, to signal there's more below.
- Tighten the empty middle: let the wordmark + slogan + CTA breathe as one bottom-aligned
  stack rather than max-distance top/bottom split.
**Files.** `layouts/partials/home-header.html`, `_header.scss` (`#home-header`),
`i18n/home/*` (CTA + scroll labels), maybe `main.js` (chevron fade on scroll).
**Effort.** ~half day. **Impact.** High — turns a striking-but-static hero into a
converting one.

### 3.2 Design the empty / early-cycle states
**Problem.** The site is checked in here in a **fresh-edition reset** (no speakers,
agenda unpublished). In that state the speakers section **silently disappears**
(`{{ with $speakers }}`) and `/agenda` shows a bare line of text. Early in the cycle the
page looks unfinished rather than "coming soon".
**Evidence.** `content/speakers/` is empty; `home-speakers.html` renders nothing when so;
the agenda page shows only "La agenda no está publicada aún." with no visual treatment.
**Proposal.** Add **designed placeholders** that keep momentum and capture intent:
- Speakers: a "Speakers coming soon — `<Tech Conference/>` line-up in progress" block
  using the dot-grid + a CTA (tickets / call-for-papers / notify-me), instead of an
  empty void. Show it only when there are 0 speakers.
- Agenda: style the "not published yet" state as a proper empty-state card (icon, short
  copy, CTA back to tickets) rather than a naked sentence.
- Consider a tasteful skeleton/placeholder grid so the speakers section keeps its rhythm.
**Files.** `home-speakers.html`, `layouts/agenda/single.html` (+ partials),
`i18n/home/*` & `i18n/agenda/*`, `_speakers.scss` / new `_emptystate.scss`.
**Effort.** ~half day. **Impact.** High for the many months the site lives in this state.

### 3.3 Standardise the sponsors wall (tiles + dark-theme handling)
**Problem.** Logos come in mixed formats and aspect ratios (PNG/SVG, wide/tall) and are
laid out as free-floating images sized only by tier height. The result is uneven optical
weight, and in **dark theme** the whole section is a hard, full-width **white slab**
(`#sponsors` forces `background: --color-light; color: --color-dark`).
**Evidence.** `_sponsors.scss:1–80`: tier sizes set `img` height only; section background
is permanently white.
**Proposal.**
- Put each logo in a consistent **neutral tile** (fixed box, centered, uniform padding,
  `--border-radius`) so varying logo shapes read as an even grid. This also gives a clean,
  intentional surface for both themes without altering any sponsor logo (brand rule).
- In dark theme, instead of a raw white band, use a softly rounded light **panel** with
  `--section-gap` margin so it reads as a deliberate "sponsor board", not a flash of white.
- Keep tiers, keep logos untouched (no grayscale/recolour — that violates `DESIGN.md`).
**Files.** `_sponsors.scss`, possibly `site-sponsors.html` (tile wrapper markup).
**Effort.** ~half day. **Impact.** Medium-high — sponsors are a key stakeholder surface.

### 3.4 Program cards: clarify hierarchy & the giant numerals
**Problem.** The two program cards use very large `h3` (`4.4rem`, the date/number) which
can crowd the copy, and the light vs accent-500 card pairing is strong but the CTA
hierarchy shifts between them. Worth a deliberate pass.
**Evidence.** `_cards.scss` `.card-programa h3 { font-size: 4.4rem }`, the inverted button
treatment in `.card-programa-2`.
**Proposal.** Audit the type scale inside the cards (use the heading tokens rather than a
one-off `4.4rem`), ensure the primary CTA reads as primary on *both* card backgrounds, and
confirm the "cómo llegar" footer doesn't compete with the main CTA. Verify alignment of
CTAs across cards (the `margin-top:auto` trick) at all breakpoints.
**Files.** `_cards.scss`, possibly `home-program.html`. **Effort.** ~2–3h.
**Impact.** Medium.

---

## 4. P2 — Polish & micro-interactions

These are the "delight" layer. All must remain gated on `prefers-reduced-motion`.

- **4.1 Link & nav underline motion.** Animated underline (left-to-right) on footer/menu
  links and in-content links, replacing the instant `text-decoration: underline`.
  Files: `_typography.scss`, `_footer.scss`.
- **4.2 Consistent `:focus-visible`.** The `.btn` and theme switch have focus rings via
  the `focus-ring` mixin; sweep the rest (speaker cards, sponsor links, language switch,
  footer links) so keyboard focus is uniformly visible in both themes.
  Files: `abstracts/_mixins.scss` usage across components.
- **4.3 Speaker card hover.** The offset accent shadow + image zoom is nice; consider a
  subtle accent label/tag reveal on hover and ensure the reveal animation's at-rest state
  (opacity 0 + `--bs-reveal-y`) never hides content if JS fails (graceful fallback already
  partially handled — verify).
- **4.4 Header logo / scroll behaviour.** The hide-on-scroll / show-on-scroll-up header is
  good; make the transition spring-ier and confirm it never traps the in-hero CTA.
- **4.5 Atmosphere depth.** The dot-grid is tasteful. Optionally add one restrained
  geometric motif (an accent square/line echoing `.heading-square`) at section seams to
  reinforce "geometric/technical" without rainbow noise — exactly what `_atmosphere.scss`
  was scaffolded for.
- **4.6 Editions footer timeline.** Verify the per-edition coloured dots/markers (one
  entry renders with what looks like a stray emoji in the mono timeline) are intentional;
  consider making the current edition pill and the hover states more clearly interactive.
  Files: `_footer.scss` `#editions`, `site-editions.html`.

---

## 5. Accessibility & quality pass (cross-cutting)

- **Contrast in both themes.** Re-verify `--accent` vs background and white-on-accent for
  the active edition hue at `-400`/`-500`, especially warm hues (orange/yellow) flagged in
  `DESIGN.md`. Add a quick checklist run per edition rollover.
- **Hero `h1` is visually-hidden** (logo carries the visual title) — good for SEO/AT; keep.
- **Tap targets.** Ensure the floating mobile actions and language switch meet 44×44px.
- **Reduced motion.** Confirm any *new* hero CTA chevron and underline animations respect
  the existing guard.

---

## 6. Suggested sequencing

| Phase | Items | Rough effort |
|-------|-------|--------------|
| **Sprint 1 — defects** | 2.1 FOUC, 2.2 mobile overlap, 2.3 dark inversion, 2.4 token drift | ~1 day |
| **Sprint 2 — impact** | 3.1 hero CTA/scent, 3.2 empty states | ~1.5 days |
| **Sprint 3 — surfaces** | 3.3 sponsors wall, 3.4 program cards | ~1 day |
| **Sprint 4 — polish** | §4 micro-interactions, §5 a11y pass | ~1 day |

---

## 7. Guardrails (apply to every change)

- Stay inside the token system; **no new hex** for theme-sensitive surfaces/text. Use
  `--accent` for decoration, `--accent-ink` for text-bearing fills.
- Every user-facing string via `{{ T "key" }}` in **all three** languages (es/en/eu).
- Verify **light + dark** themes and **reduced-motion** for each item.
- Never recolour/distort logos (BilboStack or sponsors).
- Update `DESIGN.md` whenever a token or component contract changes.
