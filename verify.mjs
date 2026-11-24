// Kontrollerar uppgiftsgeneratorn i app.js:
//  – rätt svar är spegelbilden av den vänstra halvan (kolumnerna vända),
//  – vartdera felvalet skiljer sig från rätt svar och från varandra,
//  – den vänstra halvan är asymmetrisk (kopian är alltså ett äkta fel),
//  – rutnätets storlek, värden och nivå stämmer.
//   node verify.mjs
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("./public/app.js", import.meta.url), "utf8");
const start = src.indexOf("function heltal(");
const end = src.indexOf("* 2. Kotten");
if (start < 0 || end < 0) throw new Error("hittar inte den rena generatorn i app.js");
const ren = src.slice(start, src.lastIndexOf("/*", end));
const G = eval("(function(){" + ren + "\nreturn {bygg:bygg, spegel:spegel, lika:lika, fyllda:fyllda};})()");

let seed = 20261124;
Math.random = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

let fel = 0;
const antal = { 1: 0, 2: 0, 3: 0 };
const kolla = (c, m, p) => { if (!c) { fel++; if (fel <= 25) console.log("FEL", m, JSON.stringify(p)); } };
const värdenOk = (g) => g.every(r => r.every(v => Number.isInteger(v) && v >= 0 && v <= 3));

for (const niva of [1, 2, 3]) {
  const R = niva >= 3 ? 4 : 3;
  for (let k = 0; k < 4000; k++) {
    const p = G.bygg(niva);
    antal[niva]++;
    kolla(Array.isArray(p.brickor) && p.brickor.length === 3, "fel antal brickor", p.niva);
    kolla(p.svar >= 0 && p.svar <= 2, "svar utanför 0–2", p.svar);
    kolla(p.R === R && p.C === 3, "fel rutnätsstorlek", { R: p.R, C: p.C });
    kolla(p.L.length === R && p.L[0].length === 3, "vänsterhalvan har fel storlek", p.L.length);
    kolla(värdenOk(p.L), "otillåtet värde i vänsterhalvan", p.L);
    kolla(p.brickor.every(värdenOk), "otillåtet värde i en bricka");
    kolla(p.brickor.every(g => g.length === R && g[0].length === 3), "bricka har fel storlek");
    kolla(!G.lika(p.L, G.spegel(p.L)), "vänsterhalvan är symmetrisk – kopian blir inget fel");
    const ratt = G.spegel(p.L);
    kolla(G.lika(p.brickor[p.svar], ratt), "rätt svar är inte spegelbilden", { svar: p.svar });
    kolla(G.fyllda(ratt) === p.antal, "antalet nötter stämmer inte", { a: p.antal, b: G.fyllda(ratt) });
    const andra = [0, 1, 2].filter(i => i !== p.svar);
    kolla(!G.lika(p.brickor[andra[0]], ratt), "felval 1 är lika med rätt svar", p.niva);
    kolla(!G.lika(p.brickor[andra[1]], ratt), "felval 2 är lika med rätt svar", p.niva);
    kolla(!G.lika(p.brickor[andra[0]], p.brickor[andra[1]]), "felvalen är lika varandra", p.niva);
    kolla(p.niva === niva, "fel nivå", p.niva);
  }
}

console.log(`\n${antal[1] + antal[2] + antal[3]} uppgifter (nivå 1: ${antal[1]}, 2: ${antal[2]}, 3: ${antal[3]}). ${fel} fel.`);
process.exit(fel ? 1 : 0);
