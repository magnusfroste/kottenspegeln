# KONCEPT – Kotten och spegeln (slug: kottenspegeln)

## Mål (en sak per app)
Symmetri: barnet ser en bild vars vänstra halva är fylld, och väljer bland tre
halvor den som gör hela bilden spegelvänd runt mittlinjen. Ingen text i spelytan,
ingen tidspress, fel svar kostar inget.

## Målgrupp och årskurs
Åk 1–4 (7–10 år), läroplansstadium 1–3. Barnet behöver inte kunna läsa – alla
svarsalternativ är bilder och all instruktion sägs på svenska.

## Kärnmekanik (touch först)
En ram med en streckad mittlinje. Vänstra halvan är fylld med färgade nötter i ett
rutnät (3 eller 4 rader × 3 kolumner); högra halvan är tomma platser. Under ramen
ligger tre stora brickor med varsin halva. Barnet pekar på den bricka som är den
rätta spegelbilden. Vid rätt svar fylls högra halvan och hela bilden blir symmetrisk.
– Nivå 1: 3×3-rutnät, få nötter, felvalen är en kopia (samma halva, inte speglad)
  och en lodrät vändning – lätta att skilja från spegelbilden.
– Nivå 2: 3×3-rutnät, fler nötter; felvalen är en kopia och en spegelbild med två
  nötter i andra färger.
– Nivå 3: 4×3-rutnät; felvalen är färgbytet och en 180°-vridning, dvs. mycket lika
  spegelbilden.
Direkt återkoppling: rätt bricka får en ring och en klang och glider in på plats.
Fel bricka skakar mjukt och Kotten funderar – ny chans utan straff. Efter två fel
pulserar rätt bricka.

## 5-minuterssession
Åtta uppgifter per runda, ca 3–5 minuter. Efter sista uppgiften: en tät resultatruta
med stjärnor, "en runda till" och "byt nivå". Vid minst sex rätt stiger nivån ett steg.

## Belöning barnet kan berätta om
Stjärnor i HUD:en och en prickrad som fylls. Resultatrutan säger hur många av åtta
som blev rätt, t.ex. "7 av 8 rätt". Kotten firar efter varje rätt svar, och den
färdiga bilden är en belöning i sig – den blir symmetrisk.

## Vad barnet lär
Spegelsymmetri: att en figur vänds i en mittlinje så att varje sak på vänstra sidan
får sin like på högra sidan, på samma höjd men speglad sida. Barnet tränar att skilja
en spegling från en förskjutning och från en vridning – kärnan i symmetibegreppet.
Svårigheten stiger genom fler nötter och mer lika felval, inte genom kortare tid.

## Lgr22 (ordagrant ur Skolverket, Syllabus API)
- **MA.1-3.3.5** (primär): ”Symmetri i vardagen och hur symmetri kan konstrueras.”
- **MA.1-3.3.1**: ”Vanliga lägesord för att beskriva föremåls och objekts läge i rummet.”

## Varför det funkar på iPad
Allt ritas i kod (SVG + DOM), inga bildfiler, inga tredjepartsanrop. Tre stora
tryckytor och en ram ryms utan scroll i både liggande och stående iPad. Ljud och
uppläsning skapas i webbläsaren och en ljudknapp stänger av båda.

## TESTPLAN (mätbara krav)
1. Spelbart med bara fingret (`Input.dispatchTouchEvent`), hela rundan.
2. `scrollHeight-innerHeight == 0` och `scrollWidth-innerWidth == 0` i
   1024×768, 768×1024, 390×844 och 1440×900 – mätt efter att startskärmen stängts.
3. Ingen text i spelytan (allt talat); all text på startskärmen på svenska.
4. Fel svar kostar inget; rätt bricka pulserar efter två fel.
5. Ingen inloggning, ingen reklam, inga länkar ut, ingen spårning utöver kodsnutten.
6. Korrekt data: varje uppgift verifieras maskinellt, `node verify.mjs` 0 fel
   (rätt svar = spegelbilden; varje felval skiljer sig från rätt svar och från
   varandra; den vänstra halvan är asymmetrisk i alla tre avseenden).
7. `aria-label` på alla knappar, kontrast, text ≥18 px, `prefers-reduced-motion`.

## VALIDERING (annan agent)
`delegate_task` finns inte bland verktygen i denna körning, så den planerade
motkontrollen med en andra agent kunde inte köras. Ersatt av hård egenkontroll plus
externa fakta:
(a) frivilligt 5 min? – uppgiften är "pussla ihop bilden"; direkt belöning (bilden
    blir symmetrisk), tydligt slut, "en runda till". Samma kompletteringsloop som
    pusselappar barn redan gillar (Pusselmagi i katalogen) men med ett givet svar.
(b) verkligt kunskapskrav? – ja, MA.1-3.3.5 är ordagrant citerat och mekaniken är
    exakt "symmetri ... hur symmetri kan konstrueras".
(c) teknisk risk? – låg: ren DOM/SVG, ingen fysik, ingen tredjepart, generatorn är
    en ren funktion som verifieras maskinellt. GO.

## Research (varför spegel och inte rotation/vad saknas)
Katalogen (51 appar) saknar en symmetriapp. Geometri finns bara som Geogeniet
(dra-och-släpp-former) – ingen spegling. Backloggens Kotten-mekanik 5 ("Spegelvänd")
valdes därför: den har den tydligaste läroplanskopplingen (MA.1-3.3.5 är en egen
punkt) och är mest konkret för ett barn. Mönster (mekanik 2) är redan taget av
monsterbanan och kottens-skogshopp, och "fler eller färre" är byggt (kottennoterna).
