// Rechner: freie Anschlussleistung -> Anzahl Speicher und feste Pacht
(function () {
  var PACK_KW = 125;        // Leistung je Speicher
  var PACHT = 750;          // € pro Speicher und Jahr
  var MIN_KW = 250;         // ab hier eigener Standort (2 Speicher)
  var MAX_PACKS = 4;        // mehr stellen wir an einem Standort nicht selbst auf
  var VERMITTLUNG_KW = 750; // ab hier zusätzlich Vermittlung an Partner

  var feld = document.getElementById("kw");
  var regler = document.getElementById("kw-regler");
  var ausgabe = document.getElementById("ergebnis");
  if (!feld || !regler || !ausgabe) return;

  var euro = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });

  function zeigen(kw) {
    if (!isFinite(kw) || kw < 0) kw = 0;

    if (kw < MIN_KW) {
      ausgabe.innerHTML =
        '<p class="ergebnis-titel">Knapp unter unserer Mindestgröße</p>' +
        "<p>Für einen eigenen Speicher brauchen wir etwa " + MIN_KW +
        " kW freie Leistung. Oft ist die Reserve größer, als die Rechnung auf den ersten Blick zeigt. Wir prüfen das gern kostenlos.</p>" +
        '<a class="button" href="#kontakt">Trotzdem prüfen lassen</a>';
      return;
    }

    var packs = Math.min(MAX_PACKS, Math.floor(kw / PACK_KW));
    var pacht = packs * PACHT;
    var html =
      '<p class="ergebnis-titel">Platz für ' + packs + " Speicher mit je " + PACK_KW + " kW</p>" +
      '<p class="ergebnis-betrag">' + euro.format(pacht) + " €</p>" +
      "<p>feste Pacht im Jahr, dazu 15 % des Gewinns, den die Speicher an Ihrem Standort machen.</p>";

    if (kw >= VERMITTLUNG_KW) {
      html +=
        "<p>Bei " + euro.format(kw) +
        " kW freier Leistung lohnt sich auch ein größerer Speicher. Dafür bringen wir Sie mit Partnern zusammen und vergleichen beide Wege mit Ihnen.</p>";
    }

    html +=
      '<p class="klein">Grobe Einschätzung. Ob der Netzbetreiber zustimmt und genug Fläche da ist, klären wir im Standort-Check.</p>';
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
