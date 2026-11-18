# -*- coding: utf-8 -*-
"""Generate PWA PNG icons from code so no binary assets need to be committed."""
from pathlib import Path
import os

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "assets" / "icons"
OUT.mkdir(parents=True, exist_ok=True)
S = 512
BG = "#0a0e17"
img = Image.new("RGB", (S, S), BG)
d = ImageDraw.Draw(img)

for r in range(250, 40, -3):
    a = int(18 * (1 - (r - 40) / 210))
    d.ellipse((256 - r, 256 - r, 256 + r, 256 + r), outline=(16 + a, 32 + a, 48 + a))

for width, color in [(7, (34, 211, 238)), (2, (103, 232, 249))]:
    d.ellipse((38, 38, 474, 474), outline=color, width=width)
d.ellipse((78, 78, 434, 434), outline=(201, 169, 97), width=2)

for x, y, dx, dy in [
    (38, 38, 22, 0), (38, 38, 0, 22), (474, 38, -22, 0), (474, 38, 0, 22),
    (38, 474, 22, 0), (38, 474, 0, -22), (474, 474, -22, 0), (474, 474, 0, -22),
]:
    d.line((x, y, x + dx, y + dy), fill=(201, 169, 97), width=2)

candidates = [
    r"C:\Windows\Fonts\georgiab.ttf",
    r"C:\Windows\Fonts\georgia.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
]
font_path = next((p for p in candidates if os.path.exists(p)), None)
if not font_path:
    font_path = ImageFont.load_default().path
font_e = ImageFont.truetype(font_path, 250)
font_small = ImageFont.truetype(font_path, 25)
font_tiny = ImageFont.truetype(font_path, 16)


def center(text, font, y, fill):
    box = d.textbbox((0, 0), text, font=font)
    d.text(((S - (box[2] - box[0])) / 2, y), text, font=font, fill=fill)


center("E", font_e, 118, (232, 213, 163))
center("EUROPA", font_small, 370, (34, 211, 238))
center("1500 — 1900", font_tiny, 404, (201, 169, 97))

img.save(OUT / "icon-512.png", optimize=True)
for size in (192, 180, 32):
    img.resize((size, size), Image.LANCZOS).save(OUT / f"icon-{size}.png", optimize=True)
print("PWA icons generated in", OUT)
