"""Generate lightweight versions of the site's photos and video posters.

Run after adding or replacing a photo/video:

    python scripts/media.py

Requires Pillow (pip install pillow) and ffmpeg on PATH.

Outputs:
  public/images/thumbs/<name>-<width>.webp   resized photos used through srcset
  public/images/posters/<video>.jpg          first frame of each video (poster)
  src/lib/media.json                         dimensions/paths consumed by the React pages
"""

import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "public" / "images"
THUMBS = IMAGES / "thumbs"
POSTERS = IMAGES / "posters"
VIDEOS = ROOT / "videos"
MANIFEST = ROOT / "src" / "lib" / "media.json"

# Photos shown in galleries; they are displayed at <= ~460 CSS px wide.
PHOTOS = [
    "self.webp",
    "pico.webp",
    "beach.webp",
    "mito.webp",
    "paragliding.webp",
    "morro.webp",
    "azulita.webp",
    "alambique.webp",
    "bodegon.webp",
    "tobby.webp",
    "tobby2.webp",
    "tobby3.webp",
    "moto.png",
    "about.png",
]
WIDTHS = [480, 960]
WEBP_QUALITY = 80
POSTER_WIDTH = 640

# Page background: smaller copies picked by media queries in style.css.
BACKGROUND = "bg.webp"
BACKGROUND_WIDTHS = [1280, 1920]
BACKGROUND_QUALITY = 75

# Header logo (pixel art with transparency): lossless WebP copy of the PNG.
LOGO = "welcum.png"


def make_background_and_logo() -> None:
    with Image.open(IMAGES / BACKGROUND) as original:
        image = original.convert("RGB")
        for width in BACKGROUND_WIDTHS:
            height = round(image.height * width / image.width)
            out = IMAGES / f"{Path(BACKGROUND).stem}-{width}.webp"
            image.resize((width, height), Image.LANCZOS).save(
                out, "WEBP", quality=BACKGROUND_QUALITY, method=6
            )
            print(f"  {out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")

    with Image.open(IMAGES / LOGO) as logo:
        out = IMAGES / f"{Path(LOGO).stem}.webp"
        logo.save(out, "WEBP", lossless=True, method=6)
        print(f"  {out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")


def make_thumbs() -> dict:
    THUMBS.mkdir(parents=True, exist_ok=True)
    photos = {}
    for name in PHOTOS:
        src = IMAGES / name
        stem = src.stem
        with Image.open(src) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            variants = []
            for width in WIDTHS:
                if width >= image.width:
                    continue
                height = round(image.height * width / image.width)
                out = THUMBS / f"{stem}-{width}.webp"
                image.resize((width, height), Image.LANCZOS).save(
                    out, "WEBP", quality=WEBP_QUALITY, method=6
                )
                variants.append({"src": f"/images/thumbs/{out.name}", "width": width})
                print(f"  {out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")
            photos[stem] = {
                "src": f"/images/{name}",
                "width": image.width,
                "height": image.height,
                "variants": variants,
            }
    return photos


def make_posters() -> dict:
    if shutil.which("ffmpeg") is None:
        sys.exit("ffmpeg not found on PATH")
    POSTERS.mkdir(parents=True, exist_ok=True)
    posters = {}
    for video in sorted(VIDEOS.glob("*.mp4")):
        out = POSTERS / f"{video.stem}.jpg"
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-i", str(video),
                "-frames:v", "1",
                "-vf", f"scale='min({POSTER_WIDTH},iw)':-2",
                "-q:v", "4",
                str(out),
            ],
            check=True,
        )
        posters[video.stem] = f"/images/posters/{out.name}"
        print(f"  {out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")
    return posters


def main() -> None:
    print("Photos:")
    photos = make_thumbs()
    print("Video posters:")
    posters = make_posters()
    print("Background and logo:")
    make_background_and_logo()
    MANIFEST.write_text(
        json.dumps({"photos": photos, "posters": posters}, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
