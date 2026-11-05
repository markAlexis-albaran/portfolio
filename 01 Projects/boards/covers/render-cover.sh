#!/bin/sh
# Renders one cover page to a JPG at twice the size. Usage: sh render-cover.sh yumm ../../../02\ Site/images/yumm/splash.jpg
here="$(cd "$(dirname "$0")" && pwd)"
tmp="$(mktemp -d)/cover.png"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=930,600 --virtual-time-budget=3000 --screenshot="$tmp" "file://$here/$1.html" 2>/dev/null
sips -s format jpeg -s formatOptions 88 "$tmp" --out "$2" >/dev/null
echo "$2"
