#!/usr/bin/env bash

AUTHOR="DIGITALAX - DX.COMPUTER"
LOCATION="haiti"
DIR="$(cd "$(dirname "$0")/.." && pwd)/public/images"

exiftool -overwrite_original \
  -Author="$AUTHOR" \
  -Artist="$AUTHOR" \
  -XMP-dc:Creator="$AUTHOR" \
  -XMP-dc:Rights="$AUTHOR" \
  -XMP-photoshop:Country="$LOCATION" \
  -XMP-iptcExt:LocationCreatedCountryName="$LOCATION" \
  -XMP-iptcExt:LocationShownCountryName="$LOCATION" \
  "$DIR"/*.png

echo "---- verification ----"
exiftool -Author -Artist -Creator -Rights -Country -LocationShownCountryName "$DIR"/*.png
