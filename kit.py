#!/usr/bin/env python3
"""Ritar appikoner, favicon, og-bild och manifest för Kotten och spegeln.
Ingen tredjepart. Ikonen: en streckad mittlinje med en nöt till vänster och dess
spegelbild till höger – appens mekanik – ritad med få, tjocka former så att den
överlever 48 px."""
import json
import pathlib

from PIL import Image, ImageDraw, ImageFont

P = pathlib.Path(__file__).parent / "public"
P.mkdir(exist_ok=True)
ACCENT = (47, 125, 90, 255)      # tallgrön
GULD = (232, 163, 61, 255)
VIT = (255, 255, 255, 255)
PAPPER = (250, 247, 242, 255)
BLACK = (20, 24, 31, 255)


def motiv(d, N, linjevg, prick):
    """Streckad mittlinje + två nötter som är varandras spegelbild."""
    x = N / 2
    w = N * 0.045
    y0, y1 = N * 0.22, N * 0.78
    # streckad mittlinje
    seg = (y1 - y0) / 5.0
    for i in range(0, 6, 2):
        d.rounded_rectangle([x - w / 2, y0 + i * seg, x + w / 2, y0 + (i + 1) * seg],
                            radius=w / 2, fill=linjevg)
    r = N * 0.135
    # vänster nöt högt, höger nöt högt (spegeln); vänster nöt lågt nära mitten
    d.ellipse([N * 0.27 - r, N * 0.34 - r, N * 0.27 + r, N * 0.34 + r], fill=prick)
    d.ellipse([N * 0.73 - r, N * 0.34 - r, N * 0.73 + r, N * 0.34 + r], fill=prick)
    r2 = N * 0.10
    d.ellipse([N * 0.40 - r2, N * 0.68 - r2, N * 0.40 + r2, N * 0.68 + r2], fill=prick)
    d.ellipse([N * 0.60 - r2, N * 0.68 - r2, N * 0.60 + r2, N * 0.68 + r2], fill=prick)


def ikon(N):
    ss = 4
    im = Image.new("RGBA", (N * ss, N * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, N * ss - 1, N * ss - 1], radius=N * ss * 0.23, fill=ACCENT)
    motiv(d, N * ss, VIT, GULD)
    return im.resize((N, N), Image.LANCZOS)


def favicon():
    N = 512
    im = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, N - 1, N - 1], radius=N * 0.23, fill=ACCENT)
    motiv(d, N, VIT, GULD)
    im.save(P / "favicon.png")
    (P / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
        '<rect width="100" height="100" rx="23" fill="#2f7d5a"/>'
        '<rect x="48" y="22" width="4" height="10" rx="2" fill="#fff"/>'
        '<rect x="48" y="38" width="4" height="10" rx="2" fill="#fff"/>'
        '<rect x="48" y="54" width="4" height="10" rx="2" fill="#fff"/>'
        '<rect x="48" y="70" width="4" height="10" rx="2" fill="#fff"/>'
        '<circle cx="27" cy="34" r="13.5" fill="#e8a33d"/>'
        '<circle cx="73" cy="34" r="13.5" fill="#e8a33d"/>'
        '<circle cx="40" cy="68" r="10" fill="#e8a33d"/>'
        '<circle cx="60" cy="68" r="10" fill="#e8a33d"/></svg>',
        encoding="utf-8")


def og():
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), PAPPER)
    d = ImageDraw.Draw(im)
    ico = ikon(160)
    im.paste(ico, (int(W / 2 - 80), 60), ico)
    font = small = None
    for path in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        if pathlib.Path(path).exists():
            font = ImageFont.truetype(path, 92)
            small = ImageFont.truetype(path, 38)
            break
    if font:
        for t, y, f, col in (
            ("Kotten och spegeln", 260, font, BLACK),
            ("Vilken halva är spegelvänd? · symmetri åk 1–4", 380, small, (74, 82, 96)),
            ("Gratis · ingen inloggning · skolappar.com", 460, small, (120, 126, 136)),
        ):
            d.text((W / 2 - d.textlength(t, font=f) / 2, y), t, fill=col, font=f)
    im.save(P / "og.png")


def main():
    favicon()
    ikon(192).save(P / "icon-192.png")
    ikon(512).save(P / "icon-512.png")
    ikon(512).convert("RGB").resize((512, 512), Image.LANCZOS).save(P / "icon-maskable-512.png")
    ikon(180).save(P / "apple-touch-icon.png")
    og()
    (P / "site.webmanifest").write_text(json.dumps({
        "name": "Kotten och spegeln – vilken halva är spegelvänd?",
        "short_name": "Spegeln",
        "lang": "sv",
        "start_url": "/",
        "display": "standalone",
        "orientation": "any",
        "background_color": "#faf7f2",
        "theme_color": "#2f7d5a",
        "icons": [
            {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    (P / "robots.txt").write_text(
        "User-agent: *\nAllow: /\nSitemap: https://kottenspegeln.skolappar.com/sitemap.xml\n", encoding="utf-8")
    (P / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        '<url><loc>https://kottenspegeln.skolappar.com/</loc></url>\n</urlset>\n', encoding="utf-8")
    # liten 48 px-render att granska
    ikon(48).save(P.parent / "render48.png")
    print("skrev ikoner, favicon, og.png, manifest, robots, sitemap till", P)


if __name__ == "__main__":
    main()
