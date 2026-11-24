# Kotten och spegeln

Statisk webbapp (åk 1–4, matematik): symmetri. Den vänstra halvan av en bild är
fylld med färgade nötter; barnet väljer bland tre halvor den som gör hela bilden
spegelvänd runt mittlinjen. Felvalen är en förskjutning, en vändning eller en
vridning. Tränar MA.1-3.3.5 (symmetri) och MA.1-3.3.1 (lägesord).

Inga beroenden, inga konton, ingen spårning utöver skolappar-kodsnutten.

- `public/` – hela appen (serveras av nginx i containern)
- `verify.mjs` – maskinell kontroll av uppgiftsgeneratorn (`node verify.mjs`)
- `kit.py` – ritar ikoner, favicon och og-bild
