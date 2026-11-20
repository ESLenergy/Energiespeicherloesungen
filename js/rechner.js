// Rechner: freie Anschlussleistung -> Anzahl Speicher, Festpacht oder Pacht plus Gewinnanteil
(function () {
  var PACK_KW = 125;          // Leistung je Speicher
  var PACHT_FEST = 1500;      // Modell Fest: € pro Speicher und Jahr, ohne Gewinnanteil
  var PACHT_PLUS = 750;       // Modell Plus: € pro Speicher und Jahr
  var ANTEIL = 0.15;          // Modell Plus: Anteil am Gewinn
  var GEWINN_MIN = 4000;      // erwarteter Gewinn je Speicher und Jahr (Annahme)
  var GEWINN_MAX = 8000;
  var MIN_KW = PACK_KW;       // ab einem Speicher
  var VERMITTLUNG_KW = 750;   // ab hier zusätzlich Vermittlung an Partner

  var feld = document.getElementById("kw");
  var regler = document.getElementById("kw-regler");
  var ausgabe = document.getElementById("ergebnis");
  if (!feld || !regler || !ausgabe) return;

  var euro = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });
  function rund(x) { return Math.round(x / 50) * 50; }

  function zeigen(kw) {
    if (!isFinite(kw) || kw < 0) kw = 0;

    if (kw < MIN_KW) {
      ausgabe.innerHTML =
        '<p class="ergebnis-titel">Noch unter einem Speicher</p>' +
        "<p>Für einen Speicher brauchen wir etwa " + MIN_KW +
        " kW freie Leistung. Oft ist die Reserve größer, als die Rechnung auf den ersten Blick zeigt. Wir prüfen das gern kostenlos.</p>" +
        '<a class="button" href="#kontakt">Trotzdem prüfen lassen</a>';
      return;
    }

    var packs = Math.floor(kw / PACK_KW);
    var fest = packs * PACHT_FEST;
    var plusPacht = packs * PACHT_PLUS;
    var plusMin = plusPacht + rund(packs * GEWINN_MIN * ANTEIL);
    var plusMax = plusPacht + rund(packs * GEWINN_MAX * ANTEIL);

    var html =
      '<p class="ergebnis-titel">Platz für ' + packs + " Speicher mit je " + PACK_KW + " kW</p>" +
      '<div class="modelle">' +
        '<div class="modell">' +
          '<p class="modell-name">Modell Fest</p>' +
          '<p class="modell-betrag">' + euro.format(fest) + "\u00a0€</p>" +
          "<p>im Jahr, fest vereinbart. " + euro.format(PACHT_FEST) + "\u00a0€ pro Speicher, ohne Gewinnanteil.</p>" +
        "</div>" +
        '<div class="modell">' +
          '<p class="modell-name">Modell Plus</p>' +
          '<p class="modell-betrag">' + euro.format(plusMin) + "–" + euro.format(plusMax) + "\u00a0€</p>" +
          "<p>im Jahr erwartet. Davon " + euro.format(plusPacht) + "\u00a0€ feste Pacht, dazu 15 % des Gewinns.</p>" +
        "</div>" +
      "</div>";

    if (kw >= VERMITTLUNG_KW) {
      html +=
        "<p>Bei " + euro.format(kw) +
        " kW freier Leistung kann sich auch ein großer Speicher lohnen. Dafür bringen wir Sie zusätzlich mit Partnern zusammen und vergleichen beide Wege mit Ihnen.</p>";
    }

    html +=
      '<p class="klein">Grobe Einschätzung. Der Gewinnanteil beruht auf unserer Erwartung von ' +
      euro.format(GEWINN_MIN) + " bis " + euro.format(GEWINN_MAX) +
      " € Gewinn pro Speicher und Jahr und ist nicht garantiert. Ob der Netzbetreiber zustimmt und genug Fläche da ist, klären wir im Standort-Check.</p>";
    ausgabe.innerHTML = html;
  }

  feld.addEventListener("input", function () {
    var kw = parseInt(feld.value, 10);
    regler.value = Math.min(1500, isFinite(kw) ? kw : 0);
    zeigen(kw);
  });
  regler.addEventListener("input", function () {
    feld.value = regler.value;
    zeigen(parseInt(regler.value, 10));
  });

  zeigen(parseInt(feld.value, 10));
})();
