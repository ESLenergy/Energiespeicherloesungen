// ESL Energy – Menü, Hell/Dunkel, Scroll-Effekte
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Hell / Dunkel ----------
  var schalter = document.querySelector(".thema");
  function istDunkel() {
    if (root.dataset.theme) return root.dataset.theme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  if (schalter) {
    schalter.addEventListener("click", function () {
      var neu = istDunkel() ? "light" : "dark";
      root.dataset.theme = neu;
      try { localStorage.setItem("esl-theme", neu); } catch (e) {}
    });
  }

  // ---------- Mobiles Menü ----------
  var menue = document.querySelector(".menue");
  var nav = document.getElementById("nav");
  function menueZu() {
    if (!menue) return;
    menue.setAttribute("aria-expanded", "false");
    menue.setAttribute("aria-label", "Menü öffnen");
    nav.classList.remove("offen");
  }
  if (menue && nav) {
    menue.addEventListener("click", function () {
      var auf = menue.getAttribute("aria-expanded") !== "true";
      menue.setAttribute("aria-expanded", String(auf));
      menue.setAttribute("aria-label", auf ? "Menü schließen" : "Menü öffnen");
      nav.classList.toggle("offen", auf);
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) menueZu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") menueZu(); });
  }

  // ---------- Scroll: Kopf, Fortschritt, Parallaxe, Ablauf-Linie ----------
  var kopf = document.querySelector(".kopf");
  var ablauf = document.querySelector(".ablauf");
  var geplant = false;
  function beimScrollen() {
    geplant = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    root.style.setProperty("--fortschritt", max > 0 ? (y / max).toFixed(4) : 0);
    if (!ruhig) root.style.setProperty("--scroll", Math.min(y, 1200));
    if (kopf) kopf.classList.toggle("gescrollt", y > 10);
    if (ablauf) {
      var r = ablauf.getBoundingClientRect();
      var p = (window.innerHeight * 0.75 - r.top) / r.height;
      ablauf.style.setProperty("--linie-fortschritt", Math.max(0, Math.min(1, p)).toFixed(3));
    }
  }
  window.addEventListener("scroll", function () {
    if (!geplant) { geplant = true; requestAnimationFrame(beimScrollen); }
  }, { passive: true });
  window.addEventListener("resize", beimScrollen);
  beimScrollen();

  // ---------- Aktiven Menüpunkt markieren ----------
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var abschnitte = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window && abschnitte.length) {
    var aktivBeob = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("aktiv", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    abschnitte.forEach(function (s) { aktivBeob.observe(s); });
  }

  // ---------- Einblenden beim Scrollen ----------
  var zeigen = document.querySelectorAll(".zeige");
  // Geschwister nacheinander einblenden
  zeigen.forEach(function (el) {
    var geschw = Array.prototype.filter.call(el.parentElement.children, function (k) { return k.classList.contains("zeige"); });
    var i = geschw.indexOf(el);
    if (i > 0) el.style.setProperty("--verz", Math.min(i * 0.08, 0.5) + "s");
  });
  function zaehlen(el) {
    var ziel = parseFloat(el.dataset.zaehle);
    if (ruhig || !ziel) { el.textContent = ziel.toLocaleString("de-DE"); return; }
    var start = null, dauer = 1400;
    function schritt(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dauer);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ziel * e).toLocaleString("de-DE");
      if (p < 1) requestAnimationFrame(schritt);
    }
    el.textContent = "0";
    requestAnimationFrame(schritt);
  }
  if ("IntersectionObserver" in window && !ruhig) {
    var beob = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("sichtbar");
        e.target.querySelectorAll("[data-zaehle]").forEach(zaehlen);
        beob.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    zeigen.forEach(function (el) { beob.observe(el); });
  } else {
    zeigen.forEach(function (el) { el.classList.add("sichtbar"); });
  }

  // ---------- Lichtschein auf Karten folgt der Maus ----------
  document.querySelectorAll(".karte").forEach(function (k) {
    k.addEventListener("pointermove", function (e) {
      var r = k.getBoundingClientRect();
      k.style.setProperty("--mx", (e.clientX - r.left) + "px");
      k.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
})();
