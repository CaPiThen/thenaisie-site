/* =============================================================
   ANIMATIONS — vanilla, sans dépendance (Anime.js retiré, voir
   /impeccable optimize). Deux effets, tous deux pilotés par une
   boucle `requestAnimationFrame` en JS direct (pas de transition CSS
   déclenchée par classe) :
   - tracé des schémas SVG (page Maladie), via `pathLength="1"` posé
     sur chaque tracé dans le HTML (maladie.md) — `stroke-dashoffset`
     va toujours de 1 à 0, quelle que soit la longueur géométrique
     réelle du tracé ;
   - compteurs numériques sur les chiffres clés (page Maladie),
     `data-count-to`/`data-suffix` posés dans le HTML.

   Dégradation : aucun style n'est jamais posé avant que ce script ne
   s'exécute réellement (pas de dasharray codé en dur en CSS) — si le
   script ne charge pas, schémas et chiffres restent dans leur état
   final normal par défaut. */

(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /* Observe chaque élément de `selector` et appelle `onEnter(el)` une
     seule fois, à l'entrée dans le viewport. */
  function observeOnce(selector, onEnter) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        onEnter(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* --- Tracé des schémas SVG --- */
  var DRAW_DURATION = 1100;
  var DRAW_GROUPS = [
    { selector: '.svg-colon', delay: 0 },
    { selector: '.svg-inflamme', delay: 150 },
    { selector: '.svg-courbe', delay: 100 },
    { selector: '.svg-lien:not(.svg-lien--boucle)', delay: 200 }
  ];

  function animatePath(p, delay) {
    p.style.strokeDasharray = '1';
    p.style.strokeDashoffset = '1';
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var elapsed = now - start - delay;
      if (elapsed < 0) { requestAnimationFrame(frame); return; }
      var t = elapsed >= DRAW_DURATION ? 1 : elapsed / DRAW_DURATION;
      p.style.strokeDashoffset = String(1 - easeInOutQuad(t));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  observeOnce('.figure', function (figureEl) {
    DRAW_GROUPS.forEach(function (group) {
      figureEl.querySelectorAll(group.selector).forEach(function (p) {
        animatePath(p, group.delay);
      });
    });
  });

  /* --- Compteurs numériques --- */
  var COUNT_DURATION = 1400;

  observeOnce('[data-count-to]', function (el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    if (isNaN(target)) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / COUNT_DURATION, 1);
      var value = Math.round(target * easeInOutQuad(t));
      el.textContent = value.toLocaleString('fr-FR') + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
})();
