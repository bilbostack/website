# Design Improvement Plan — BilboStack

A design-led assessment of the BilboStack site and a prioritized roadmap to elevate
it. This is a **plan/critique**, not the rulebook — the brand rules live in
[`DESIGN.md`](DESIGN.md) and the structure in [`ARCHITECTURE.md`](ARCHITECTURE.md).
Everything below is grounded in the current `assets/scss/`, `assets/js/main.js` and
`layouts/`.

> Reviewed on the `2027` edition branch. Active accent at review time:
> `$current-color: "aqua"` (`assets/scss/abstracts/_variables.scss:61`).

---

## TL;DR

The site already has a **strong, on-brand foundation**: a confident token-based color
system with per-edition theming, light/dark support, a memorable animated-logo hero,
and tasteful hover micro-interactions (speaker shadow-stack, button offset shadow). It
does **not** look like generic SaaS — good.

The gaps are in four areas, in priority order:

1. **Accessibility & correctness** — no `prefers-reduced-motion`, likely-failing
   contrast on accent buttons, fragile hidden-`h1` pattern, doc/code drift.
2. **Design-system rigor** — magic numbers everywhere (no spacing/type scale tokens),
   a single typeface doing every job, dead/duplicated SCSS.
3. **Aesthetic energy** — the brand says "bold · colourful · geometric · technical ·
   playful", but the canvas is flat: solid fills, no texture/pattern/depth, no
   entrance choreography, conventional symmetrical layout.
4. **Performance** — heavy scroll-hijacking (GSAP ScrollSmoother) and external fonts.

---

## Current-state assessment

### Strengths (keep / protect)

- **Color architecture.** Hue ramps (`100–700`) with a swappable edition accent
  (`--current-color-*`) and a clean light/dark inversion (`generate-inverted-colors`).
  This is genuinely good system design.
- **Hero.** The layered-SVG logo reveal (`initLogoAnimation`) is distinctive and
  on-brand — a real "one thing people remember" moment.
- **Micro-interactions.** Speaker card shadow-lift + image scale, the pill button's
  sliding offset shadow, the `img-tag` rotate — characterful and consistent in spirit.
- **Geometric accents.** `.heading-square` (the coloured square bullet) is a nice
  recurring motif that ties sections together.

### Weaknesses by dimension

**Typography**
- One typeface (Plus Jakarta Sans) for display, body, numbers, and UI. The brand is
  "geometric/technical" and even references `<Tech Conference/>`, yet there is no
  display or mono voice — character comes only from size/weight.
- Type scale is not fluid for headings (only `--font-size-base` uses `clamp()`);
  headings step at breakpoints (`_typography.scss`).
- `h2` (`3.4rem`) is **larger than** `h1` (`3rem`). It works today only because `h1`
  is visually hidden on most pages — semantically fragile.
- No `text-wrap: balance`/`pretty` on headings; large display lines wrap awkwardly.

**Color & contrast**
- **Doc/code drift:** `DESIGN.md` documents the accent as `violet`; the code is `aqua`
  (`_variables.scss:61`). One source of truth should win.
- **Likely AA failures:** white text on `--aqua-400` (#00a199 ≈ 2.8:1) and on
  `--yellow-400`/`--orange-400` for normal-size text. Buttons (`.btn`) put
  `--color-light` text on `--current-color-400` — this needs a contrast audit per
  edition accent and per theme.
- Backgrounds are flat `--color-primary-light` everywhere — color is used as labels
  but never as *atmosphere*, leaving the "colourful" brand promise under-delivered.

**Motion**
- **No `prefers-reduced-motion` handling anywhere** (`main.js`, SCSS). ScrollSmoother,
  pins, logo timeline, and hover transforms all run regardless — an accessibility and
  comfort problem.
- `ScrollSmoother({ smooth: 1.5, normalizeScroll: true })` hijacks native scrolling for
  everyone; it can feel laggy and fights assistive tech / trackpads.
- No entrance choreography for content (speakers grid, program cards, sponsors): the
  skill's "one orchestrated load with staggered reveals" is missing.
- The pinning logic (`initHomeAnimation`, `initSpeakerAnimation`, `initAgendaAnimation`,
  the disabled `initStickyCards`) is complex, breakpoint-gated at 768px, and fragile.

**Layout & spatial composition**
- After the hero, sections are conventional: centered, symmetrical, stacked. The brand
  asks for "geometric / grid-breaking"; there's little asymmetry, overlap, diagonal
  flow, or oversized editorial type below the fold.
- Speaker grid is a flat uniform grid with no rhythm.
- **No spacing scale.** Section rhythm is hardcoded and inconsistent
  (`margin-bottom: 4rem / 5rem / 8rem`, repeated `font-size: 1.25rem`, ad-hoc paddings)
  across `_layout`, `_footer`, `_cards`, `_sponsors`, `_speakers`.

**Backgrounds & visual detail**
- Almost entirely flat fills. No grain/noise, no dot/grid pattern, no geometric shapes
  echoing the logo layers, no depth beyond the single speaker shadow-stack. This is the
  biggest "energy" gap relative to the stated personality.

**Code health (affects design velocity)**
- `assets/scss/fix.scss` is effectively empty/dead; a separate
  `assets/scss/laprevia/style.scss` exists with unclear scope.
- The visually-hidden `h1` (`visibility:hidden; height:0; font-size:0`) is duplicated in
  `_agenda`, `_info`, `_editions`, `_header` — should be one `.visually-hidden` utility
  using the standard clip pattern (current one is a sub-optimal SR experience).
- Magic numbers (above) make consistent change expensive.

**Accessibility (cross-cutting)**
- Reduced motion (above).
- Theme toggle is a bare checkbox+label with no accessible name describing its purpose.
- Language switcher links sit at `opacity: 0.6` with thin borders — low contrast.
- Focus-visible states are not defined for `.btn`, `.tab-button`, `.theme-switch`,
  hamburger — only `:hover` is styled.
- Hidden-`h1` pattern (above) weakens the document outline for screen readers.

**Performance**
- Four GSAP scripts + ScrollSmoother from CDN; Google Fonts loaded externally
  (render path + privacy). Fonts could be self-hosted via Hugo Pipes; the
  smooth-scroll cost should be weighed against its benefit.

---

## Roadmap

Effort: **S** ≈ <½ day · **M** ≈ 1–2 days · **L** ≈ 3+ days. Do P0 first; it's mostly
cheap and high-impact.

### P0 — Accessibility & correctness (do first) — ✅ done (2026-06-19)

Implemented: semantic `--accent` / `--accent-ink` tokens, reduced-motion guards in
JS + SCSS, AA-safe accent fills/text on buttons/tags/agenda, a `visually-hidden`
mixin/utility replacing the hidden-`h1` hacks, `:focus-visible` rings, theme-toggle
`aria-label` (+ `theme_toggle` i18n), higher language-switcher contrast, and the
DESIGN.md accent drift resolved to `aqua`.

1. **Respect `prefers-reduced-motion`.** _(S)_
   - In `main.js`: if `matchMedia('(prefers-reduced-motion: reduce)').matches`, skip
     `ScrollSmoother.create`, the logo timeline, and all pin `ScrollTrigger`s (fall
     back to native scroll + static layout).
   - In SCSS: a global `@media (prefers-reduced-motion: reduce)` block neutralizing
     `transition`/`transform`/`animation` and the hover transforms.
   - **Done when:** with reduced motion on, the site is fully usable with no
     scroll-jacking, no pinning, no transforms.

2. **Fix accent/text contrast on buttons & accent surfaces.** _(S–M)_
   - Audit `--current-color-400` + `--color-light` text for every edition accent in
     both themes (target WCAG AA: 4.5:1 body, 3:1 large/UI).
   - Options: introduce a dedicated `--accent-on-strong` text token per ramp, or use a
     darker ramp shade (`-500`) as the text-bearing button fill, or bump button text
     size to qualify as "large."
   - **Done when:** `.btn`, `.tag`, `.agenda-header`, `.session .speaker` accent
     pairings pass AA in light and dark for `aqua`/`orange`/`violet`.

3. **Add visible `:focus-visible` states.** _(S)_
   - `.btn`, `.btn-outline`, `.tab-button`, `.theme-switch`, `.hamburger`, sidenav
     links, language switcher. Use a 2px accent/foreground outline with offset.
   - **Done when:** every interactive element is keyboard-traceable.

4. **Replace the hidden-`h1` hack with a real utility.** _(S)_
   - Add `.visually-hidden` (clip-rect pattern) in a base partial; apply to the page
     `h1`s in `_agenda`/`_info`/`_editions` and `#home-header h1`. Remove the
     duplicated `visibility:hidden;height:0;font-size:0` blocks.
   - **Done when:** the document outline is correct and the heading is still
     visually absent.

5. **Label the theme toggle + lift language-switcher contrast.** _(S)_
   - Give the toggle an accessible name (`aria-label` describing light/dark) in
     `site-header.html`; raise the inactive language link opacity / contrast.

6. **Resolve the accent doc/code drift.** _(S)_
   - Decide the canonical 2027 accent and make `DESIGN.md` and `_variables.scss`
     agree (and note this is per-edition in `DESIGN.md`).

### P1 — Design-system foundation (unblocks everything else) — ✅ done (2026-06-19)

Implemented: a `--space-1…--space-10` spacing scale + fluid `--section-gap`, a fluid
heading scale (`--font-size-h*` with `clamp()`) that fixes the `h1 < h2` inversion and
adds `text-wrap: balance`, a `--font-size-lead` token for intro copy, the hardcoded
margins/paddings in `_layout`/`_footer`/`_cards`/`_sponsors`/`_speakers` replaced with
tokens, and SCSS cleanup (the one real `fix.scss` rule folded into `_sponsors`, `fix.scss`
emptied, `laprevia/style.scss` documented as orphaned in `ARCHITECTURE.md`).

7. **Introduce a spacing scale.** _(M)_
   - Add tokens (e.g. `--space-1…--space-12` on a 4/8px base, plus a
     `--section-gap` fluid token). Replace the hardcoded `4rem/5rem/8rem` margins and
     repeated paddings in `_layout`, `_footer`, `_cards`, `_sponsors`, `_speakers`.
   - **Done when:** vertical rhythm is consistent and driven by tokens.

8. **Make the type scale fluid and coherent.** _(M)_
   - Define heading sizes with `clamp()` (a single modular scale), fix the
     `h1 < h2` inversion (decide which is the display size and apply intentionally),
     add `text-wrap: balance` to headings.
   - **Done when:** headings scale smoothly with no breakpoint jumps and the outline
     makes sense.

9. **SCSS cleanup.** _(S)_
   - Remove/repurpose dead `fix.scss`; document or fold in `laprevia/style.scss`;
     extract the repeated `font-size: 1.25rem` "lead" size into a token/utility.

### P2 — Aesthetic elevation (the "energy" the brand asks for) — ✅ done (2026-06-20)

Implemented: a self-hosted display + mono voice — **Space Grotesk** for `h1`/`h2`/hero
(`--font-family-display`) and **JetBrains Mono** for the technical details
(`--font-family-mono`: agenda times, edition years, per-edition stats, the
`<Tech Conference/>` motif), both as variable woff2 in `static/fonts/` with
`font-display: swap` + preload (Plus Jakarta Sans stays the body voice). Atmosphere via
a new `base/_atmosphere.scss`: a theme-aware dot-grid texture (`.bs-texture-dots`, behind
the hero + speakers) and a layered-squares motif (`.bs-stack`) echoing the logo's
`capa1–4` layers (the accent color-blocks already lived in the program cards + sponsors
CTA). Motion via `initRevealAnimations()` in `main.js`: reduced-motion-guarded staggered
scroll-reveal of the speakers grid (through `--bs-reveal-y` so it composes with the
grid-break) and the program cards, plus a static asymmetric grid-break that offsets
alternate speaker cards (`--bs-grid-offset`).

10. **Add a distinctive display + mono voice.** _(M)_  → see [Open questions](#open-questions)
    - Pair a characterful geometric display face for `h2`/hero with a mono accent for
      "technical" details (agenda times, edition years, stats, the `<Tech Conference/>`
      motif). Keep Plus Jakarta Sans for body. Self-host via Hugo Pipes (also a perf win).
    - **Done when:** headings/numbers have a recognizable voice beyond weight changes.

11. **Give sections atmosphere & depth.** _(M)_
    - Introduce *restrained* background texture: a subtle dot/grid pattern or geometric
      shapes echoing the logo's layered `capa1–4`, an accent color-block behind one or
      two sections, optional grain overlay. Stay within the ramp; no off-brand neon
      gradients (`DESIGN.md` anti-patterns).
    - **Done when:** the page reads "colourful/geometric" even on a screenshot, with
      hierarchy intact.

12. **Choreographed entrances + grid-breaking moments.** _(M)_
    - Staggered scroll-reveal for the speakers grid and program cards (guarded by
      reduced-motion). Introduce one or two intentional asymmetric/overlapping layouts
      (e.g. offset speaker cards, oversized section number, diagonal accent band) so the
      page isn't uniformly centered.
    - **Done when:** scrolling in feels orchestrated, not static; at least one
      memorable grid-break exists below the hero.

### P3 — Performance & polish

13. **Reconsider scroll-hijacking & self-host fonts.** _(M)_
    - Evaluate dropping/softening ScrollSmoother (native scroll is faster and more
      accessible; keep anchor-link smoothing only). Self-host Plus Jakarta Sans (and any
      new faces) through Hugo Pipes with `font-display: swap` and preload.
    - **Done when:** no third-party font request, lighter main-thread cost, smoother
      low-end scroll.

14. **Consistency sweep.** _(S)_
    - Unify card radii/padding via tokens, align tag/button radii intent, verify both
      themes on every page, re-run the `DESIGN.md` agent checklist.

---

## Suggested sequencing

1. **Sprint 1 (P0):** items 1–6 — accessibility + correctness. Cheap, high trust.
2. **Sprint 2 (P1):** items 7–9 — tokens + type scale + cleanup. Foundation.
3. **Sprint 3 (P2):** items 10–12 — type voice, atmosphere, motion. The visible glow-up.
4. **Sprint 4 (P3):** items 13–14 — performance + final consistency.

Keep each change token-driven and verified in **light and dark** and across `es/en/eu`,
per the existing conventions in `CLAUDE.md` and `DESIGN.md`.

## Open questions

- **Type direction (item 10):** ✅ resolved (2026-06-20) — **Space Grotesk** (display) +
  **JetBrains Mono** (mono), self-hosted, with Plus Jakarta Sans kept for body.
- **Scroll-hijacking (item 13):** is ScrollSmoother a deliberate signature effect to
  preserve, or acceptable to drop for performance/accessibility?
- **Per-edition accent:** confirm the canonical 2027 accent so item 6 closes the drift.
