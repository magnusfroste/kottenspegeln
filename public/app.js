/* Kotten och spegeln – vilken halva är spegelvänd? Statisk app, inga beroenden.
   Tränar MA.1-3.3.5 (symmetri i vardagen och hur symmetri kan konstrueras) och
   MA.1-3.3.1 (lägesord). Allt ritas i kod: nötter och Kotten i SVG/DOM, ljud i
   WebAudio + talsyntes. Uppgiftsgeneratorn är en ren funktion (verifieras av verify.mjs). */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * 1. Ren uppgiftsgenerator                                            *
   *    Rutnätet är R rader × 3 kolumner per halva. Vänstra halvan L är   *
   *    given; rätt svar är spegelbilden spegel(L) (kolumnerna vänds).    *
   *    Felvalen byggs ur kopian (L), lodrät vändning, 180°-vridning och  *
   *    ett färgbyte, och silas så att de aldrig är rätt svar eller lika  *
   *    varandra. L är alltid asymmetrisk så att kopian är ett äkta fel.  *
   * ------------------------------------------------------------------ */
  function heltal(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

  function tom(R, C) {
    var g = [], r, c;
    for (r = 0; r < R; r++) { g.push([]); for (c = 0; c < C; c++) g[r].push(0); }
    return g;
  }
  function lika(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (var r = 0; r < a.length; r++) for (var c = 0; c < a[0].length; c++)
      if (a[r][c] !== b[r][c]) return false;
    return true;
  }
  function spegel(L) {                     /* spegling i lodrät mittlinje */
    var R = L.length, C = L[0].length, g = tom(R, C), r, c;
    for (r = 0; r < R; r++) for (c = 0; c < C; c++) g[r][c] = L[r][C - 1 - c];
    return g;
  }
  function vand(L) {                       /* vänd upp-och-ner */
    var R = L.length, C = L[0].length, g = tom(R, C), r, c;
    for (r = 0; r < R; r++) for (c = 0; c < C; c++) g[r][c] = L[R - 1 - r][c];
    return g;
  }
  function rotera(L) {                     /* 180°-vridning */
    var R = L.length, C = L[0].length, g = tom(R, C), r, c;
    for (r = 0; r < R; r++) for (c = 0; c < C; c++) g[r][c] = L[R - 1 - r][C - 1 - c];
    return g;
  }
  function fyllda(L) {
    var n = 0, r, c;
    for (r = 0; r < L.length; r++) for (c = 0; c < L[0].length; c++) if (L[r][c]) n++;
    return n;
  }
  function fargbyte(L) {                   /* spegelbilden med två nötter i andra färger */
    var g = spegel(L), par = [], r, c, i, j, t;
    for (r = 0; r < g.length; r++) for (c = 0; c < g[0].length; c++) if (g[r][c]) par.push([r, c]);
    if (par.length < 2) return g;
    /* två fyllda rutor med olika färg */
    for (i = 0; i < par.length; i++) for (j = i + 1; j < par.length; j++) {
      if (g[par[i][0]][par[i][1]] !== g[par[j][0]][par[j][1]]) {
        t = g[par[i][0]][par[i][1]];
        g[par[i][0]][par[i][1]] = g[par[j][0]][par[j][1]];
        g[par[j][0]][par[j][1]] = t;
        return g;
      }
    }
    /* annars byt en ruta till en annan färg */
    var a = par[0];
    g[a[0]][a[1]] = g[a[0]][a[1]] % 3 + 1;
    return g;
  }

  function bygg(niva) {
    var R = niva >= 3 ? 4 : 3, C = 3;
    var minD = niva === 1 ? 3 : niva === 2 ? 4 : 5;
    var maxD = niva === 1 ? 4 : niva === 2 ? 5 : 6;
    var L, n, forsok = 0, unika, i, j, t, col;
    do {
      L = tom(R, C);
      n = heltal(minD, maxD);
      var celler = [];
      for (i = 0; i < R; i++) for (j = 0; j < C; j++) celler.push([i, j]);
      for (i = celler.length - 1; i > 0; i--) { j = heltal(0, i); t = celler[i]; celler[i] = celler[j]; celler[j] = t; }
      var farg = {};
      for (i = 0; i < n; i++) { col = heltal(1, 3); L[celler[i][0]][celler[i][1]] = col; farg[col] = 1; }
      unika = 0; for (col in farg) unika++;
      forsok++;
    } while (forsok < 400 && (
      lika(L, spegel(L)) || lika(L, vand(L)) || lika(L, rotera(L)) || unika < 2));
    var ratt = spegel(L);

    var pool;
    if (niva === 1) pool = [L, vand(L)];             /* kopia + upp-och-ner */
    else if (niva === 2) pool = [L, fargbyte(L)];    /* kopia + färgbyte */
    else pool = [fargbyte(L), rotera(L)];            /* färgbyte + 180°-vridning */

    var val = [], k, unik = [];
    for (k = 0; k < pool.length; k++) {
      var p = pool[k], dubblett = lika(p, ratt);
      for (i = 0; i < unik.length && !dubblett; i++) if (lika(p, unik[i])) dubblett = true;
      if (!dubblett) unik.push(p);
    }
    /* säkerhetsnät: fyll på med kopian om något silades bort */
    var extra = [L, vand(L), rotera(L), fargbyte(L)];
    for (i = 0; i < extra.length && unik.length < 2; i++) {
      var q = extra[i], d2 = lika(q, ratt);
      for (j = 0; j < unik.length && !d2; j++) if (lika(q, unik[j])) d2 = true;
      if (!d2) unik.push(q);
    }
    val = unik.slice(0, 2);
    var svar = heltal(0, 2);
    var brickor = [val[0], val[1]];
    brickor.splice(svar, 0, ratt);

    return { L: L, brickor: brickor, svar: svar, R: R, C: C, niva: niva, antal: fyllda(ratt) };
  }

  /* ------------------------------------------------------------------ *
   * 2. Kotten (SVG, egen figur, minst fem uttryck)                      *
   * ------------------------------------------------------------------ */
  function kottenSvg(uttryck, klass) {
    var F = "#b07d4b", M = "#8a5f36", O = "#2b2118", mun, ogen = "", extra = "";
    if (uttryck === "hejar") { mun = '<path d="M22 36 q8 8 16 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    else if (uttryck === "firar") {
      mun = '<path d="M21 34 q9 12 18 0" fill="#fff"/><path d="M21 34 q9 12 18 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>';
      extra = '<path d="M10 12 l3 6M50 12 l-3 6M30 6 v5" stroke="#e8a33d" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
    }
    else if (uttryck === "tanker") { mun = '<path d="M24 37 h11" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>'; ogen = '<circle cx="46" cy="24" r="4" fill="none" stroke="' + M + '" stroke-width="1.6" opacity=".5"/>'; }
    else if (uttryck === "funderar") { mun = '<path d="M22 38 q8 -6 16 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    else { mun = '<path d="M22 34 q8 8 16 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    var oga = '<circle cx="23" cy="24" r="5.2" fill="#fff"/><circle cx="37" cy="24" r="5.2" fill="#fff"/>' +
      '<circle cx="24" cy="24.6" r="2.5" fill="' + O + '"/><circle cx="36" cy="24.6" r="2.5" fill="' + O + '"/>';
    return '<svg class="' + (klass || "kotten-svg") + '" viewBox="0 0 60 60" aria-hidden="true">' + extra +
      '<path d="M30 6 q9 4 12 12 q9 12 4 24 q-4 12 -16 14 q-12 -2 -16 -14 q-5 -12 4 -24 q3 -8 12 -12z" fill="' + F + '"/>' +
      '<path d="M19 20 q11 -5 22 0M16 30 q14 -5 28 0M16 40 q14 -4 28 0" stroke="' + M + '" stroke-width="1.7" fill="none" opacity=".85" stroke-linecap="round"/>' +
      oga + ogen + mun + '</svg>';
  }

  /* ------------------------------------------------------------------ *
   * 3. Ljud (WebAudio + talsyntes, skapas vid första gesten)            *
   * ------------------------------------------------------------------ */
  var ac = null, ljudPa = true;
  function ljud(frekvens, längd, typ) {
    if (!ljudPa) return;
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = typ || "sine"; o.frequency.value = frekvens;
      g.gain.value = 0.001; o.connect(g); g.connect(ac.destination);
      var t = ac.currentTime;
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + längd);
      o.start(t); o.stop(t + längd + 0.02);
    } catch (e) { }
  }
  function sAg(text) {
    if (!ljudPa) return;
          try { if (window.__rost && window.__rost(text, true)) return; } catch (e) { }
        console.warn('saknar mp3:', text);
  }
  function spar(namn, värde) { try { if (window.skolappar && window.skolappar.event) window.skolappar.event(namn, värde); } catch (e) { } }

  /* ------------------------------------------------------------------ *
   * 4. Rendering                                                        *
   * ------------------------------------------------------------------ */
  var RUNDA = 8;
  var S = { skärm: "start", niva: 1, runda: 1, item: 0, svarRätt: 0, stjärnor: 0, felförsök: 0, p: null, klar: false };

  function cellHtml(varde, tomKlass) {
    if (!varde) return '<span class="ruta' + (tomKlass ? " tom" : "") + '"></span>';
    return '<span class="ruta"><span class="prick c' + varde + '"></span></span>';
  }
  function halvaHtml(g, tomKlass) {
    var h = "", r, c;
    for (r = 0; r < g.length; r++) for (c = 0; c < g[0].length; c++) h += cellHtml(g[r][c], tomKlass);
    return h;
  }

  function ritaTavla() {
    var R = S.p.R, C = S.p.C;
    var vanster = document.getElementById("halva-v"), hoger = document.getElementById("halva-h");
    vanster.style.aspectRatio = C + " / " + R;
    hoger.style.aspectRatio = C + " / " + R;
    vanster.innerHTML = halvaHtml(S.p.L, false);
    if (S.klar) hoger.innerHTML = halvaHtml(S.p.brickor[S.p.svar], false);
    else hoger.innerHTML = halvaHtml(tom(R, C), true);
    hoger.classList.toggle("klar", S.klar);
  }

  function ritaBrickor() {
    var el = document.getElementById("val");
    var ar = S.p.C + " / " + S.p.R;
    el.innerHTML = S.p.brickor.map(function (g, i) {
      return '<button class="bricka" data-i="' + i + '" aria-label="halva ' + (i + 1) + ' av 3">' +
        '<span class="bricka-rutnat" style="aspect-ratio:' + ar + '">' + halvaHtml(g, false) + '</span></button>';
    }).join("");
  }

  function ritaPrickar() {
    var h = "";
    for (var i = 0; i < RUNDA; i++) h += '<i class="' + (i < S.item ? "klar" : "") + '"></i>';
    document.getElementById("prickar").innerHTML = h;
  }
  function ritaStjärnor() {
    document.getElementById("stjarnor").textContent = "★".repeat(Math.min(S.stjärnor, 12)) + (S.stjärnor > 12 ? "+" : "");
  }
  function kottenByt(uttryck) {
    var gammal = document.getElementById("kotten");
    if (!gammal) return;
    var ny = document.createElement("span");
    ny.innerHTML = kottenSvg(uttryck);
    gammal.replaceWith(ny.firstChild);
  }

  function nyUppgift() {
    S.p = bygg(S.niva);
    S.klar = false; S.felförsök = 0;
    ritaTavla(); ritaBrickor(); ritaPrickar();
  }

  function valjBricka(i) {
    if (S.skärm !== "spel" || S.klar) return;
    var b = document.querySelector('.bricka[data-i="' + i + '"]');
    if (i === S.p.svar) {
      S.klar = true; S.item++; S.svarRätt++; S.stjärnor++;
      if (b) b.classList.add("rätt");
      S.klar = true; ritaTavla(); ritaStjärnor(); ritaPrickar();
      ljud(660, 0.12, "sine");
      setTimeout(function () { ljud(880, 0.16, "sine"); }, 120);
      sAg("Rätt! Nu blev bilden likadan på båda sidor.");
      kottenByt("firar");
      spar("round_done", Math.round(100 * S.svarRätt / RUNDA));
      setTimeout(function () {
        if (S.item >= RUNDA) rundaKlar();
        else { nyUppgift(); kottenByt("glad"); }
      }, 900);
    } else {
      S.felförsök++;
      ljud(240, 0.14, "triangle");
      if (b) { b.classList.add("fel"); setTimeout(function () { b.classList.remove("fel"); }, 420); }
      kottenByt("funderar");
      spar("hint");
      if (S.felförsök >= 2) {
        var r = document.querySelector('.bricka[data-i="' + S.p.svar + '"]');
        if (r) r.classList.add("visa");
        sAg("Nästan! Titta på den som lyser.");
      } else {
        sAg("Nästan! Prova igen.");
      }
    }
  }

  function rundaKlar() {
    S.skärm = "överlägg";
    var procent = Math.round(100 * S.svarRätt / RUNDA);
    spar("round_done", procent);
    sAg("Rundan är klar. " + S.svarRätt + " av " + RUNDA + " rätt.");
    var stegUpp = S.svarRätt >= 6 && S.niva < 3;
    visaOverlay(S.svarRätt >= 6 ? "firar" : "hejar", "Rundan är klar!",
      S.svarRätt + " av " + RUNDA + " rätt. " + S.stjärnor + " stjärnor totalt." +
      (stegUpp ? " Nu blir det svårare!" : ""),
      "En runda till →", function () {
        if (stegUpp) { S.niva++; spar("level", S.niva); }
        S.runda++; startaRunda(S.niva);
      }, true);
  }

  function visaOverlay(uttryck, titel, text, knapptext, vidare, medNiva) {
    var ov = document.getElementById("overlay");
    document.getElementById("ov-bild").innerHTML = kottenSvg(uttryck, "ov-kotten");
    document.getElementById("ov-titel").textContent = titel;
    document.getElementById("ov-text").textContent = text;
    var b = document.getElementById("ov-nasta");
    b.textContent = knapptext;
    b.onclick = function () { ov.hidden = true; vidare(); };
    var n = document.getElementById("ov-niva");
    n.hidden = !medNiva;
    n.onclick = function () { ov.hidden = true; S.niva = S.niva >= 3 ? 1 : S.niva + 1; S.runda++; startaRunda(S.niva); };
    ov.hidden = false;
  }

  function startaRunda(niva) {
    S.niva = niva; S.skärm = "spel"; S.item = 0; S.svarRätt = 0; S.felförsök = 0;
    document.getElementById("startskarm").hidden = true;
    document.getElementById("spel").hidden = false;
    document.getElementById("overlay").hidden = true;
    ritaStjärnor(); nyUppgift(); kottenByt("glad");
    spar("round_start"); spar("level", niva);
    sAg(niva === 1 ? "Välj den halva som gör bilden spegelvänd."
      : niva === 2 ? "Vilken halva är spegelbilden? Titta noga."
      : "Nu är halvorna mycket lika. Vilken är spegelvänd?");
  }

  function tipsa() {
    if (S.skärm !== "spel" || S.klar) return;
    var r = document.querySelector('.bricka[data-i="' + S.p.svar + '"]');
    if (r) r.classList.add("visa");
    sAg("Den som lyser är spegelbilden.");
    spar("hint"); kottenByt("tanker");
  }

  /* ------------------------------------------------------------------ *
   * 5. Händelser och start                                              *
   * ------------------------------------------------------------------ */
  function ritaLjudIkon() {
    document.getElementById("ljudikon").innerHTML = ljudPa
      ? '<path d="M4 9h3l4-3v12l-4-3H4z"/><path d="M15 8a5 5 0 0 1 0 8"/>'
      : '<path d="M4 9h3l4-3v12l-4-3H4z"/><path d="M15 9l5 6M20 9l-5 6"/>';
  }

  function bind() {
    document.getElementById("val").addEventListener("click", function (e) {
      var b = e.target.closest(".bricka");
      if (b) valjBricka(Number(b.dataset.i));
    });
    document.getElementById("spela").addEventListener("click", function () { ljud(600, 0.1); startaRunda(1); });
    document.getElementById("hjalp").addEventListener("click", tipsa);
    document.getElementById("ljud").addEventListener("click", function () {
      ljudPa = !ljudPa;
      if (!ljudPa && window.__rostStopp) window.__rostStopp();
      ritaLjudIkon(); spar("sound_off");
    });
    document.addEventListener("keydown", function (e) {
      if (S.skärm !== "spel") return;
      if (e.key === "1" || e.key === "ArrowLeft") valjBricka(0);
      if (e.key === "2" || e.key === "ArrowDown") valjBricka(1);
      if (e.key === "3" || e.key === "ArrowRight") valjBricka(2);
    });
  }

  function init() {
    bind(); ritaLjudIkon(); ritaStjärnor(); ritaPrickar();
    var hud = document.querySelector(".kotten-hud");
    if (hud) hud.outerHTML = kottenSvg("glad", "kotten-hud");
    var k = document.getElementById("kotten");
    if (k) k.outerHTML = kottenSvg("glad", "kotten-svg");
    window.__game = {
      S: S, bygg: bygg, valjBricka: valjBricka, startaRunda: startaRunda,
      nyUppgift: nyUppgift, ritaTavla: ritaTavla, ritaBrickor: ritaBrickor, tipsa: tipsa,
      spegel: spegel, vand: vand, rotera: rotera, lika: lika
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
