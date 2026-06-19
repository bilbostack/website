---
name: edition
description: Roll the Bilbostack site over to a new edition (new year) — change the edition accent color (with ramp + dark-theme inversion), refresh event config (hashtag, tickets, dossier, video, visibility toggles), archive the previous edition into the editions list, and reset/scaffold edition content (speakers, agenda, sponsors). Use when the user wants to bootstrap the site for a new year, change the edition color, or roll the site to the next edition. Does NOT rewrite claims/marketing texts — those i18n strings are edited by hand.
argument-hint: "<new year + accent color, or what to roll over>"
---

# Set up a new Bilbostack edition

Each year reuses this codebase with a new **accent color**, updated **event config**, the previous
edition **archived** into the timeline, and **content reset** (speakers/agenda/sponsors).

**Out of scope:** claims and marketing texts (`i18n/*.toml`, `i18n/home/*.toml`) — those are edited
by hand, not by this skill. Leave them alone unless the user explicitly asks.

Read `docs/ARCHITECTURE.md` and `docs/DESIGN.md` first if unsure. This skill edits:

- `assets/scss/abstracts/_variables.scss` — edition accent color (+ ramp).
- `config/_default/hugo.toml` — `editions` array, event params.
- `content/speakers/` and the sponsor blocks in `hugo.toml` — content reset.

**Config-over-code:** prefer editing params; only touch SCSS for the color.

---

## 1. Interview the user

Don't invent the color, ticket link, dossier, or video. Pull what's in `$ARGUMENTS`, then ask for
the rest in **one `AskUserQuestion` round** where possible. Collect:

| Field | For… |
|-------|------|
| New year | `editions` array, `hashtag`, ticket/dossier naming |
| Accent color | One ramp name (see §2). Drives `$current-color` and the new edition's `color`. |
| Tickets link + open? | `ticketsLink`, `ticketsOpen` (Eventbrite usually `bilbostack<year>.eventbrite.es`) |
| Sponsor dossier PDF | `sponsorsDossierLink` |
| YouTube highlight video | `youtubeEmbedURL` |
| Previous edition final stats | tracks / speakers / attendees / network — to archive it (§3) |
| Reset content? | Confirm clearing speakers + sponsor tiers for the fresh edition (§5) |

---

## 2. Edition accent color

The site-wide accent is `--current-color-*`, generated in `assets/scss/abstracts/_variables.scss`.
The color name appears in **two places** — update **both**:

```scss
// ~line 61, light theme
$current-color: "violet";              // → change to the new edition color name

// ~line 114, dark theme inversion
html.dark-theme {
  ...
  @include generate-inverted-colors("violet");   // → same new color name
}
```

Also set the new edition's `color` in the `editions` array (§3) to the **same name**.

### Color must have a full 100–700 ramp

The accent generator and dark-theme inversion read `--{color}-100 … --{color}-700`. Only
`orange`, `aqua`, and `violet` ship a full ramp. The flat colors (`blue`, `cyan`, `purple`,
`pink`, `yellow`, `dark-yellow`, `red`) define only `-400`.

If the chosen color lacks a ramp, **generate it** in `_variables.scss` before using it as the
edition color. Follow the existing `violet`/`aqua`/`orange` ramps as the pattern: light tints for
100–300 (mix the `-400` toward `--color-light` #ffffff) and dark shades for 500–700 (mix toward
`--color-dark` #08262e, so the dark end suits dark-theme backgrounds). Approximate mix targets,
matching the violet ramp:

| Step | Mix |
|------|-----|
| `-100` | ~90% white |
| `-200` | ~72% white |
| `-300` | ~42% white |
| `-400` | the main hex (unchanged) |
| `-500` | ~55% toward #08262e |
| `-600` | ~78% toward #08262e |
| `-700` | ~88% toward #08262e |

Compute the hex values and add the full `--{color}-100..700` block next to the other ramps. Then
verify contrast of `-400` text/buttons on both light (`#fff`) and dark (`#08262e`) backgrounds.

---

## 3. Archive previous edition + add the new one

In `config/_default/hugo.toml`, the `editions` array lists every edition oldest→newest.

1. **Archive the outgoing current edition:** remove `current = true`, give it a versioned `url`
   (`https://<year>.bilbostack.com/`), and fill its final stats:
   `tracks`, `speakers`, `attendees`, `network` (collected in §1).
2. **Append the new edition:**
   ```toml
   { year = 2027, url = "https://bilbostack.com/", current = true, color='<new-color>' }
   ```
   `url` for the current edition is always the root `https://bilbostack.com/`.

---

## 4. Event config (`hugo.toml` `[params]`)

Update for the new year:

| Param | Update |
|-------|--------|
| `hashtag` | `#Bilbostack<yy>` (e.g. `#Bilbostack27`) |
| `ticketsLink` | New Eventbrite URL (`https://bilbostack<year>.eventbrite.es`) |
| `ticketsOpen` | `true`/`false` depending on sales status |
| `sponsorsDossierLink` | New dossier PDF path (`/docs/Bilbostack<yy>-sponsors.es.pdf`) |
| `youtubeEmbedURL` | New highlight/promo video embed |
| `sponsorsVisible`, `agendaVisible` | Toggle as the edition fills in (often `false` early) |

`baseURL`, `org`, and `links` normally stay unchanged — confirm before touching.

---

## 5. Reset / scaffold content

For a fresh edition, last year's speakers/agenda and sponsor lineup are cleared (the new lineup is
added later via the `speaker` and `sponsor` skills).

- **Speakers + agenda:** the agenda is derived from speaker front matter (`day`/`time`), so there is
  no separate agenda data file. Remove the previous edition's files in `content/speakers/`
  (`*.es.md`, `*.en.md`, `*.eu.md`). Confirm with the user before deleting — they may want to keep a
  couple already-confirmed speakers. New speakers are added with the `speaker` skill.
- **Sponsors:** clear or trim the `sponsors = [ … ]` arrays inside each `[[params.sponsorBlocks]]`
  in `hugo.toml` (keep institutional sponsors like Bilboko Udala / Diputación if they recur).
  New sponsors are added with the `sponsor` skill.
- Set `sponsorsVisible` / `agendaVisible` to `false` until the new lineup is ready.

---

## 6. Verify

Run a production build to catch SCSS/TOML errors:

```
hugo --minify
```

Then `hugo server` and check: accent color applied in light **and** dark theme, editions timeline
shows the new current year, tickets/dossier/video links resolve.

---

## Checklist

- [ ] `$current-color` **and** `generate-inverted-colors(...)` updated to the new color name.
- [ ] New color has a full 100–700 ramp (generated if needed); `-400` passes contrast in both themes.
- [ ] Previous edition archived in `editions[]` with stats + versioned URL; new `current` entry added.
- [ ] `hashtag`, `ticketsLink`, `sponsorsDossierLink`, `youtubeEmbedURL`, visibility toggles updated.
- [ ] Speakers/sponsors reset per the user's choice; visibility toggles off until ready.
- [ ] Claims/texts left untouched (out of scope).
- [ ] `hugo --minify` builds clean; site verified in light and dark themes.
