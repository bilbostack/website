---
name: sponsor
description: Add a new sponsor (or update/move an existing one) on the Bilbostack site. Use when the user wants to add a sponsor logo, place a sponsor in a tier (main/platinum/gold/silver/bronze), change a sponsor's link or logo, or move a sponsor between tiers. Edits the sponsorBlocks config in hugo.toml and the logo in assets/img/sponsors/.
argument-hint: "<sponsor name + tier + URL, or what to change>"
---

# Add / Update a Sponsor

Sponsors are **config-driven**, not content files. A sponsor is one entry inside a tier in
`config/_default/hugo.toml` under `[[params.sponsorBlocks]]`, plus a logo image in
`assets/img/sponsors/`. **There are no per-language sponsor files** — tier headings come from
already-translated i18n keys, so adding a sponsor touches only the config and the image.

See `docs/ARCHITECTURE.md` → "Configuration" and the `site-sponsors.html` partial for how these
render. This skill writes only `config/_default/hugo.toml` and files under `assets/img/sponsors/`.

## 1. Figure out the intent

From `$ARGUMENTS` and the conversation, decide:

- **Add** a new sponsor, **update** one (logo/URL), or **move** one between tiers.
- For updates/moves, find the existing entry: search `sponsorBlocks` in
  `config/_default/hugo.toml` for the sponsor `name`.

## 2. Interview the user

**Always collect the sponsor's data from the user before editing** — don't invent the URL, tier,
or logo. Pull what's already given in `$ARGUMENTS`, then ask for the rest. Prefer a single
`AskUserQuestion` round (the tier is a perfect multiple-choice question) over a long back-and-forth.

Collect:

| Field | Ask for… | Notes |
|-------|----------|-------|
| Name | The sponsor's display name | → `name`. Shown as the logo's `title`/`alt`. |
| URL | The link the logo points to | → `url`. May include UTM params (existing sponsors do). |
| Tier | Which sponsorship level | One of the tiers below. Offer them as choices. |
| Logo | A logo image file or path | Goes in `assets/img/sponsors/`. PNG or SVG (see logo notes). |

### Tiers (each is a `[[params.sponsorBlocks]]`)

| Tier | `title` (i18n key) | `class` | Heading (es / en / eu) |
|------|--------------------|---------|------------------------|
| Main | `sponsors_main` | `sponsors-xxl` | Patrocinadores Principales / Main Sponsors / Babesle nagusiak |
| Platinum | `sponsors_platino` | `sponsors-xl` | Patrocinadores Platino / Platinum Sponsors / Platino babesleak |
| Gold | `sponsors_oro` | `sponsors-l` | Patrocinadores Oro / Gold Sponsors / Urrezko babesleak |
| Silver | `sponsors_plata` | `sponsors-m` | Patrocinadores Plata / Silver Sponsors / Zilarrezko babesleak |
| Bronze | `sponsors_bronce` | `sponsors-s` | Patrocinadores Bronce / Bronze Sponsors / Brontzezko babesleak |

The blocks are already defined in `hugo.toml` in this order (xxl → s). To add a sponsor you append
to the `sponsors = [ … ]` array of the matching block — **do not create a new block** unless the
user asks for a tier that doesn't exist yet.

## 3. Entry format

Each sponsor is an inline TOML table inside a tier's `sponsors` array:

```toml
{ name = "Manfred", url = "https://getmanfred.com", image = "img/sponsors/manfred.svg" }
```

- `name` — display name (logo `alt`/`title`).
- `url` — destination; opens in a new tab. Keep any UTM/campaign params the user provides.
- `image` — path **relative to `assets/`** (always starts `img/sponsors/`), resolved via
  `resources.Get`. PNG/JPG logos are auto-resized to WebP `q70 lanczos` at build; SVGs are used
  as-is. So the path here points at the source file you place in `assets/img/sponsors/`.

## 4. Logo image

1. Put the logo file in `assets/img/sponsors/` (this is the **processed** assets dir — not
   `static/`). Keep the original extension.
2. Prefer **SVG** when available (sharper, no resize); otherwise a reasonably large PNG with a
   transparent background. The grid normalizes display size via the tier `class`, so exact pixel
   dimensions don't need to match other logos.
3. If the user hasn't provided a logo yet, ask for one — the entry needs a real file or the build
   shows an empty link. Don't point `image` at a file that doesn't exist.
4. `image` is the same regardless of language.

## 5. Procedure

1. Complete the **interview (step 2)** first.
2. **Read the current `sponsorBlocks`** in `config/_default/hugo.toml` to match the live format
   and find the right block. Trust the file over this doc if they differ.
3. **Save the logo** into `assets/img/sponsors/` (see step 4).
4. **Edit the config**: append the sponsor's `{ name, url, image }` table to the `sponsors` array
   of the chosen tier. Match the existing indentation and trailing-comma style of that block.
   - For an **update**, edit the existing table in place.
   - For a **move**, remove it from the old tier and add it to the new one.
5. Keep TOML valid — inline tables on their own line, comma-separated within the array.

## 6. Verify

- `sponsorsVisible = true` in `[params]` controls whether the section shows at all; mention it if
  it's currently `false`. New sponsors then appear automatically — no other registration needed.
- If Hugo is available, `hugo --quiet` (or a running `hugo server`) builds without TOML errors and
  resolves the logo. A missing image path is the most common mistake — double-check it exists.

## 7. Report

State which tier the sponsor was added to/moved to, the logo file used, and call out anything left
pending (e.g. logo still needed, or `sponsorsVisible` is off so it won't display yet).
