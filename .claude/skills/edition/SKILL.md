---
name: edition
description: Roll the Bilbostack site over to a new edition (new year) — change the edition accent color (with ramp + dark-theme inversion), refresh event config (hashtag, tickets, dossier, video, visibility toggles), update the edition dates and the edition number (the "Nth edition" count, derived from the editions list), archive the previous edition into the editions list, and reset/scaffold edition content (speakers, agenda, sponsors). Use when the user wants to bootstrap the site for a new year, change the edition color/date/number, or roll the site to the next edition. Does NOT rewrite marketing prose/slogans (only the factual edition number inside them) — that wording is edited by hand.
argument-hint: "<new year + accent color, or what to roll over>"
---

# Set up a new Bilbostack edition

Each year reuses this codebase with a new **accent color**, updated **event config**, the previous
edition **archived** into the timeline, and **content reset** (speakers/agenda/sponsors).

**Out of scope:** claims and marketing **prose wording** (e.g. `main_claim`, `home_slogan*`
sentences) — those are edited by hand, not by this skill. Leave the wording alone unless the user
explicitly asks. **In scope (facts, not marketing):** the **dates** (§4b) and the **edition number**
(the "Nth edition" count, §4c). Update both. For the edition number, swap **only the number** inside
the existing sentence — don't rewrite the surrounding prose.

Read `docs/ARCHITECTURE.md` and `docs/DESIGN.md` first if unsure. This skill edits:

- `assets/scss/abstracts/_variables.scss` — edition accent color (+ ramp).
- `config/_default/hugo.toml` — `editions` array, event params (incl. event date/location params).
- `i18n/*.toml`, `i18n/home/*.toml`, `content/_index.*.md`, `content/agenda.*.md` — date-bearing
  strings (§4b) and the edition-number count (§4c); not the surrounding marketing prose.
- `content/speakers/` and the sponsor blocks in `hugo.toml` — content reset.

**Config-over-code:** prefer editing params; only touch SCSS for the color.

---

## 1. Interview the user

Don't invent the color, ticket link, dossier, or video. Pull what's in `$ARGUMENTS`, then ask for
the rest in **one `AskUserQuestion` round** where possible. Collect:

| Field | For… |
|-------|------|
| New year | `editions` array, `hashtag`, ticket/dossier naming |
| Edition number | The "Nth edition" count (§4c). Default = entries in `editions[]` after appending the new one (= previous + 1). Confirm; **don't** compute from the year — some years were skipped (e.g. no 2021). |
| Edition date | Main event day (the conference Saturday). The previa is the **Friday before** it. Drives event params + all date strings (§4b). Ask for the year if not already implied. |
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
| `eventStartDate`, `eventEndDate` | Main day as ISO 8601 with Madrid offset, e.g. `2027-01-30T09:00:00+01:00` / `…T20:00:00+01:00`. Feeds the `Event` JSON-LD in `site-schema.html`. |
| `eventLocationName`, `eventLocationCity`, `eventLocationRegion` | Main venue (usually `Palacio Euskalduna` / `Bilbao` / `Bizkaia`) — change only if the venue moves. |

`baseURL`, `org`, and `links` normally stay unchanged — confirm before touching.

---

## 4b. Edition dates (factual strings)

The main event is a **Saturday**; the previa is the **Friday before it**. Work out both weekday
names and `DD/MM/YYYY` from the date collected in §1, then update every place the old date appears.
Keep each language's existing wording/format — only swap the day number, weekday, month, and year.

| Location | Key / text | Note |
|----------|-----------|------|
| `hugo.toml` `[params]` | `eventStartDate`, `eventEndDate` | ISO 8601 (§4), main day |
| `i18n/<lang>.toml` | `header_when` | Main day, long form (e.g. `30 de enero de 2027`) |
| `i18n/<lang>.toml` | `meta_title` | Date portion + `#Bilbostack<yy>` |
| `i18n/home/<lang>.toml` | `previa_date` | **Friday** before (e.g. `Viernes 29 de enero`) |
| `i18n/home/<lang>.toml` | `bilbostack_date` | Main **Saturday** (e.g. `Sábado 30 de enero`) |
| `i18n/home/<lang>.toml` | `previa_text` | Disclaimer holds `DD/MM/YYYY` (Friday) + the year twice |
| `content/_index.<lang>.md` | `description` | Main day (e.g. `30 de Enero de 2027`) |
| `content/agenda.<lang>.md` | `# === VIERNES … ===` / `# === SÁBADO … ===` | Comment headers; Friday = previa, Saturday = main |

Do all three languages (`es`, `en`, `eu`) for every i18n/content row. The `previa_compra_link` /
`bilbostack_compra_link` Eventbrite URLs follow the same `<year>` change already covered by
`ticketsLink` in §4 — update them to match.

Leave the surrounding marketing prose (slogans, claims) untouched — the edition number it contains is
handled separately in §4c.

---

## 4c. Edition number (factual)

The "Nth edition" is a **fact**, not marketing: it equals the **number of entries in the `editions`
array** (§3) *after* appending the new one — currently **15** for 2027. Increment it by one each
edition. **Don't** derive it from the year: there are gaps (no 2021 edition), so year − 2011 is wrong.

Swap **only the number**, keeping each language's existing wording and format:

| Location | Key | Format example (es / en / eu) |
|----------|-----|-------------------------------|
| `i18n/<lang>.toml` | `main_claim` | `15ª Edición…` / `15th edition…` / `…15. edizioa` |
| `i18n/<lang>.toml` | `meta_description` | `…15ª Edición…` / `…15th edition…` / `…15. edizioa.` |
| `i18n/home/<lang>.toml` | `home_slogan_short` | `Edición nº15…` / `15th edition…` / `…15. edizioa` |

Do all three languages (`es`, `en`, `eu`). Leave the rest of each sentence (the marketing wording)
untouched.

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
shows the new current year, tickets/dossier/video links resolve, and the new dates show on the home
program cards / header. Optionally validate the `Event` JSON-LD (view-source `application/ld+json`
on the home page) reflects the new `startDate`/`endDate`.

---

## Checklist

- [ ] `$current-color` **and** `generate-inverted-colors(...)` updated to the new color name.
- [ ] New color has a full 100–700 ramp (generated if needed); `-400` passes contrast in both themes.
- [ ] Previous edition archived in `editions[]` with stats + versioned URL; new `current` entry added.
- [ ] `hashtag`, `ticketsLink`, `sponsorsDossierLink`, `youtubeEmbedURL`, visibility toggles updated.
- [ ] Event dates updated everywhere (§4b): `eventStartDate`/`eventEndDate` params, `header_when`,
      `meta_title`, `previa_date` (Friday), `bilbostack_date` (Saturday), `previa_text`,
      `_index` descriptions, agenda comment headers — all three languages.
- [ ] Edition number incremented (= count of `editions[]`) in `main_claim`, `meta_description`,
      `home_slogan_short` — all three languages (§4c); number only, surrounding wording untouched.
- [ ] Speakers/sponsors reset per the user's choice; visibility toggles off until ready.
- [ ] Marketing prose / slogans left untouched (out of scope).
- [ ] `hugo --minify` builds clean; site verified in light and dark themes.
