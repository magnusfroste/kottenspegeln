# Inskick – Kotten och spegeln

- **Titel:** Kotten och spegeln
- **Kort beskrivning:** Vilken halva är spegelvänd?
- **URL:** https://kottenspegeln.shipholm.dev
- **Ämne:** Matematik
- **Årskurs:** Åk 1–3
- **Typ:** Spel
- **Enhet:** Alla enheter
- **Lgr22 (curriculum_ids):** MA.1-3.3.5 (primär), MA.1-3.3.1
- **Kortbild:** `public/kort.png` (1200×900, 4:3, spelmoment utan pålägg) →
  https://kottenspegeln.shipholm.dev/kort.png

## long_description
Kotten och spegeln är ett symmetrispel i matematik för åk 1–4. Den vänstra halvan
av en bild är fylld med färgade nötter i ett rutnät; den högra halvan är tomma
platser. Under bilden ligger tre stora brickor, och barnet pekar på den bricka som
gör hela bilden spegelvänd runt den streckade mittlinjen. Nötter, brickor och figur
ritas i koden – inga bildfiler, inga anrop till andra webbplatser.

Appen tränar spegelsymmetri, det momentet i det centrala innehållet för matematik
åk 1–3: ”Symmetri i vardagen och hur symmetri kan konstrueras.” (Skolverket,
Lgr22.) Felvalen är inte slumpade: en är samma halva förskjuten (inte speglad), en
är en lodrät vändning eller en 180°-vridning, och en är en spegelbild med två nötter
i andra färger. Barnet måste alltså skilja en riktig spegling från något som bara
liknar den. Efter två fel pulserar rätt bricka.

Svårighetsgraden stiger i små steg: först ett 3×3-rutnät med få nötter och tydliga
felval, sedan fler nötter, och på sista nivån ett 4×3-rutnät med felval som ligger
mycket nära spegelbilden. En runda är åtta uppgifter och tar ungefär 3–5 minuter.
Fel svar kostar ingenting: brickan skakar mjukt, Kotten funderar och barnet får en
ny chans – och när svaret är rätt blir bilden symmetrisk.

Allt som sägs spelas upp på svenska (webbläsarens talsyntes), så barnet behöver
inte kunna läsa. Gratis, ingen inloggning, inga annonser, inga länkar ut.

## Kontroll
- `node verify.mjs` – 12 000 genererade uppgifter kontrollerade (rätt svar =
  spegelbilden, vartdera felvalet skiljer sig från rätt svar och från varandra,
  vänsterhalvan alltid asymmetrisk), 0 fel.
- Spelat igenom en hel runda med `Input.dispatchTouchEvent` (touch): 8/8 rätt,
  8 stjärnor, resultatrutan "8 av 8 rätt". Två avsiktliga felsvar flyttade inte
  uppgiften vidare och rätt bricka började pulsera.
- Ryms utan scroll i 1024×768, 768×1024, 390×844 och 1440×900
  (`scrollHeight-innerHeight = 0`, `scrollWidth-innerWidth = 0`).
- Tryckytor: tre brickor, 123×123 px på iPad liggande (min 101×101 px på mobil).
