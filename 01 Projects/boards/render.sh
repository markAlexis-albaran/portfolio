#!/bin/sh
# Renders one board page to a JPG at twice the size, for sharp images on high-density screens.
# Usage: sh render.sh tvguideplus-search ../../02\ Site/images/tvguideplus/search-board.jpg
here="$(cd "$(dirname "$0")" && pwd)"
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
tmp="$(mktemp -d)/board.png"
"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1800,1400 --virtual-time-budget=4000 --screenshot="$tmp" "file://$here/$1.html" 2>/dev/null
sips -s format jpeg -s formatOptions 82 "$tmp" --out "$2" >/dev/null
echo "$2"
