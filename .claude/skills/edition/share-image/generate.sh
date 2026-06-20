#!/usr/bin/env bash
#
# generate.sh — regenerate the Bilbostack social share / oembed image (og:image)
# with the current edition's date.
#
# The image referenced by layouts/partials/site-meta.html is
# assets/img/bilbostack-logo-permalink.png. It is the BilboStack wordmark on the
# dark brand background with the edition date in a pink box at the bottom
# ("DD.MM.YYYY <location>"). This script keeps the existing wordmark artwork
# (rainbow lettering only exists baked into that PNG) and only repaints the
# bottom date band, so the look stays identical year to year — just the date
# changes.
#
# How it works: build an SVG that (1) embeds the current PNG as the canvas,
# (2) covers the old date band with a brand-dark rectangle, (3) draws the new
# pink box + date + location, then rasterize it with rsvg-convert. The date font
# is the bundled Space Grotesk (fonts/SpaceGrotesk.ttf), wired in via a private
# fontconfig file so nothing needs to be installed system-wide.
#
# Requirements: rsvg-convert (librsvg) and base64 — both standard on the build
# machine. No ImageMagick / PIL needed.
#
# Usage:
#   ./generate.sh --date 30.01.2027 [--location "en Bilbao"] \
#                 [--input  assets/img/bilbostack-logo-permalink.png] \
#                 [--output assets/img/bilbostack-logo-permalink.png]
#
# --date is DD.MM.YYYY (the main event Saturday). Default in/out is the
# committed permalink PNG, so the common case is just: ./generate.sh --date …
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Repo root = three levels up from .claude/skills/edition/share-image
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

DATE=""
LOCATION="en Bilbao"
INPUT="$REPO_ROOT/assets/img/bilbostack-logo-permalink.png"
OUTPUT="$REPO_ROOT/assets/img/bilbostack-logo-permalink.png"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --date)     DATE="$2";     shift 2 ;;
    --location) LOCATION="$2"; shift 2 ;;
    --input)    INPUT="$2";    shift 2 ;;
    --output)   OUTPUT="$2";   shift 2 ;;
    -h|--help)  grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

[[ -n "$DATE" ]] || { echo "error: --date DD.MM.YYYY is required" >&2; exit 2; }
[[ "$DATE" =~ ^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$ ]] || \
  { echo "error: --date must be DD.MM.YYYY (got '$DATE')" >&2; exit 2; }
command -v rsvg-convert >/dev/null || { echo "error: rsvg-convert not found" >&2; exit 1; }
[[ -f "$INPUT" ]] || { echo "error: input not found: $INPUT" >&2; exit 1; }

# --- Canvas geometry (matches the 2470x1090 permalink artwork) ----------------
W=2470; H=1090
BG="#08262e"      # --color-dark brand background
PINK="#e1287c"    # --pink-400 (the date highlight box)
INK="#ffffff"     # date + location text
FS=62             # date font size (px)
LOC_FS=58         # location font size (px)
YC=905            # vertical centre of the date band
PADX=30           # horizontal padding inside the pink box
GAP=24            # gap between pink box and location text
RADIUS=14         # pink box corner radius
FONT="Space Grotesk"

# --- Approximate text widths (Space Grotesk Medium em advances) ---------------
# rsvg exposes no text metrics, so widths are estimated per character class.
text_width() { # $1 = string, $2 = font size  -> echoes width in px
  awk -v s="$1" -v fs="$2" 'BEGIN{
    n=split(s,c,""); w=0;
    for(i=1;i<=n;i++){ ch=c[i];
      if(ch ~ /[0-9]/)            adv=0.556;
      else if(ch=="." )          adv=0.28;
      else if(ch==" " )          adv=0.30;
      else if(ch ~ /[ilIjt]/)    adv=0.33;
      else if(ch ~ /[mwMW]/)     adv=0.82;
      else if(ch ~ /[A-Z]/)      adv=0.66;
      else                       adv=0.54;
      w+=adv*fs;
    }
    printf "%d", w;
  }'
}

DATE_W=$(text_width "$DATE" "$FS")
LOC_W=$(text_width "$LOCATION" "$LOC_FS")
BOX_W=$(( DATE_W + 2*PADX ))
BOX_H=$(( FS + 30 ))
HAS_LOC=0; [[ -n "$LOCATION" ]] && HAS_LOC=1
GROUP_W=$BOX_W
[[ $HAS_LOC -eq 1 ]] && GROUP_W=$(( BOX_W + GAP + LOC_W ))

START_X=$(( W/2 - GROUP_W/2 ))
BOX_X=$START_X
BOX_Y=$(( YC - BOX_H/2 ))
DATE_CX=$(( BOX_X + BOX_W/2 ))           # date text centre x
DATE_BY=$(( YC + FS*36/100 ))            # baseline ~ centre + 0.36*fs
LOC_X=$(( BOX_X + BOX_W + GAP ))         # location left x
LOC_BY=$(( YC + LOC_FS*36/100 ))

# Cover the old date band generously (full-width strip) before redrawing, so no
# remnant of the previous edition's pink box/date shows through. The strip stays
# well below the wordmark (which ends ~y=740), so this only clears the date area.
COVER_Y=$(( YC - 120 ))
COVER_H=240

# --- Private fontconfig so rsvg sees the bundled TTF --------------------------
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cat > "$TMP/fonts.conf" <<EOF
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>$SCRIPT_DIR/fonts</dir>
  <cachedir>$TMP/cache</cachedir>
</fontconfig>
EOF

# --- Build the SVG ------------------------------------------------------------
B64="$(base64 < "$INPUT" | tr -d '\n')"
LOC_SVG=""
if [[ $HAS_LOC -eq 1 ]]; then
  LOC_SVG="<text x=\"$LOC_X\" y=\"$LOC_BY\" font-family=\"$FONT\" font-weight=\"500\" font-size=\"$LOC_FS\" fill=\"$INK\">$LOCATION</text>"
fi

cat > "$TMP/share.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="$W" height="$H" viewBox="0 0 $W $H">
  <image x="0" y="0" width="$W" height="$H" xlink:href="data:image/png;base64,$B64"/>
  <rect x="0" y="$COVER_Y" width="$W" height="$COVER_H" fill="$BG"/>
  <rect x="$BOX_X" y="$BOX_Y" width="$BOX_W" height="$BOX_H" rx="$RADIUS" ry="$RADIUS" fill="$PINK"/>
  <text x="$DATE_CX" y="$DATE_BY" text-anchor="middle" font-family="$FONT" font-weight="500" font-size="$FS" fill="$INK">$DATE</text>
  $LOC_SVG
</svg>
EOF

# --- Rasterize ----------------------------------------------------------------
FONTCONFIG_FILE="$TMP/fonts.conf" rsvg-convert -w "$W" -h "$H" "$TMP/share.svg" -o "$OUTPUT"
echo "Wrote $OUTPUT  ($DATE $LOCATION)"
