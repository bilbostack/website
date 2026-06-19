---
name: speaker
description: Create a new speaker or update an existing one across all three languages (es, en, eu) for the Bilbostack site. Use when the user wants to add a speaker, edit a speaker's bio/talk/tagline/links/schedule, or fix a speaker page. Keeps the es/en/eu Markdown files in content/speakers/ consistent.
argument-hint: "<speaker name or slug, plus what to create/change>"
---

# Manage a Speaker (es / en / eu)

Create or update a speaker for the Bilbostack site. **Every speaker exists as three
Markdown files** — `content/speakers/<slug>.es.md`, `.en.md`, `.eu.md` — and they must
stay in sync. The default language is Spanish (`es`); `en` and `eu` are translations.

See `docs/ARCHITECTURE.md` → "Speakers" for the data model. This skill writes only files
under `content/speakers/` and `assets/img/speakers/`.

## 1. Figure out the intent

From `$ARGUMENTS` and the conversation, decide:

- **Create** a brand-new speaker, or **update** an existing one.
- The **slug**: lowercase, ASCII, hyphenated, derived from the name
  (e.g. "Marta Barrio" → `marta-barrio`). For updates, find the existing slug with
  `ls content/speakers/`.

## 2. Interview the user

**Always interview the user to collect the speaker's data before writing any file** — do not
invent or guess bios, talk content, taglines, links, or scheduling. The user is the source of
truth for this information.

Run the interview as a short conversation:

1. First pull whatever is already given in `$ARGUMENTS`/the conversation, and (for updates) read
   the existing files — so you don't re-ask what you already know.
2. Then ask for everything still missing. Prefer one `AskUserQuestion` round that batches the
   open fields (it can hold up to 4 questions) over a long back-and-forth; fall back to plain
   prose questions for free-text fields like the bio and talk description.
3. Confirm anything ambiguous (e.g. exact spelling/accents of the name, which day/time).

Collect every field below. Mark a field as "unknown" only if the user explicitly says it isn't
decided yet — then use the documented fallback (omit the talk `title`, omit `day`/`time`).

| Field | Ask the user for… | Notes |
|-------|-------------------|-------|
| Full name | Their full name | → `title` (same in all three languages) |
| Tagline / role | Their job title / role / company | → `tagline` and `taglineLarge`. **You translate per language** (see examples below). |
| Day & time | Which day and time they speak | `day` is translated per language; `time` (e.g. `12:00h`) is the same. May be "not decided yet". |
| Photo | A photo file or path | Goes in `assets/img/speakers/`. If none yet, ask them to provide one; `image` is the same path in all three files. |
| Social links | Their LinkedIn / Instagram / BlueSky / X / GitHub / web URLs | `title` + `url` pairs. URLs identical across languages; normalize `title` casing (see below). |
| Bio | Their bio text (ask for at least one language) | Prose. You translate it into the other two languages. |
| Talk title + description | The talk title and abstract (ask for at least one language) | You translate per language. If undecided, omit `title` so it falls back to the i18n "talk pending" string. |

You only need the bio and talk text in **one** language from the user — produce faithful es/en/eu
translations yourself (see the translation conventions below). If the user supplies text in
several languages, use theirs verbatim instead of re-translating.

## 3. File format

Each file is TOML front matter + body with two shortcodes. Use this exact shape:

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
image = 'img/speakers/marta.jpeg'
[params]
  links = [
    { title = "Linkedin", url = "https://www.linkedin.com/in/..."},
    { title = "Instagram", url = "https://www.instagram.com/..."}
  ]
+++

{{<speaker_bio>}}

…bio paragraph(s) in this language…

{{</speaker_bio>}}

{{<speaker_talk title="Talk title in this language">}}
…talk description in this language…
{{</speaker_talk>}}
```

Rules:

- `layout`, `type`, `title`, `time`, `image`, and the link `url`s are **identical** in all three files.
- `tagline`, `taglineLarge`, `day`, `description`, the bio, the talk `title`, and the talk
  body are **language-specific** — translate them.
- `tagline` and `taglineLarge` are usually the same string; keep them equal unless the user
  wants a different short/long form.
- Omit `title="…"` from `speaker_talk` when the talk title isn't known yet (it falls back to
  the i18n `talk_title_pending` string). Omit `day`/`time` from front matter when unknown —
  the talk block simply won't show those tags.

### Per-language conventions (from existing speakers)

- **`description`** follows a fixed pattern, hashtag `#Bilbostack26`:
  - es: `'<Name> hablará en el #Bilbostack26'`
  - en: `'<Name> will speak at #Bilbostack26'`
  - eu: `'<Name>(e)k #Bilbostack26ean hitz egingo du'` (apply Basque declension to the name)
- **`day`** translates the weekday, number unchanged:
  - es: `Sábado 31` / `Viernes 30` · en: `Saturday 31` / `Friday 30` · eu: `Larunbata 31` / `Ostirala 30`
- **Link `title` casing**: the `es` file often uses `"Linkedin"`; `en`/`eu` use `"LinkedIn"`.
  `Instagram`, `BlueSky`, `Twitter`/`X`, `GitHub` keep their canonical casing in all three.
  Match the casing seen in existing files.
- **Tagline translation** example: `Founder Securiters` (es) → `Founder, Securiters` (en) →
  `Securiters-en sortzailea` (eu). Translate naturally; don't leave English in the eu file.

## 4. Procedure

1. Complete the **interview (step 2)** first — don't start writing until you have the data.
2. **Read a current example** for the live format before writing — e.g.
   `content/speakers/marta-barrio.{es,en,eu}.md`. Conventions drift; trust the files over this doc.
3. **For updates**, read all three existing files for that slug first, then apply the change
   consistently to each language. If the user gives the change in one language, translate it
   for the others.
4. **Image**: confirm `image` points to a file that exists in `assets/img/speakers/`. If a new
   photo was provided, save it there first (keep the original extension; it's resized to WebP at
   build time). Reuse the same path in all three files.
5. **Write/edit** `content/speakers/<slug>.es.md`, `.en.md`, `.eu.md`. Never create only one or two.
6. **Translations**: produce real es/en/eu translations of tagline, bio, talk title, and talk
   body. If you're unsure of a Basque translation, say so rather than leaving a placeholder or
   another language's text.

## 5. Verify

- Confirm all three files exist: `ls content/speakers/<slug>.*.md` → expect `.es.md`, `.en.md`, `.eu.md`.
- If Hugo is available, `hugo --quiet` (or check a running `hugo server`) builds without errors.
- Speakers auto-appear on the home page and get a `/speakers/<slug>` detail page — no extra
  registration needed. If this speaker also has an agenda slot, remind the user that the agenda
  is edited separately in `content/agenda.<lang>.md` (it references `/speakers/<slug>`); update it
  only if the user asks.

## 6. Report

List the files created/updated and note anything you left as a fallback (e.g. talk title pending,
missing photo) or any translation you weren't confident about, so the user can review it.
