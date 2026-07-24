/* =============================================================
   ANIMATIONS — vanilla, sans dépendance (Anime.js retiré, voir
   /impeccable optimize). Tracé des schémas SVG (page Maladie) :
   piloté par une boucle `requestAnimationFrame` qui pose
   `stroke-dashoffset` image par image, plutôt qu'une transition CSS
   déclenchée par un changement de classe. Chaque tracé porte
   `pathLength="1"` dans le HTML (voir maladie.md), donc `0` et `1`
   représentent toujours « invisible » et « tracé complet », quelle
   que soit la longueur géométrique réelle du tracé.

   Dégradation : aucun style n'est jamais posé sur un tracé avant que
   ce script ne l'anime réellement (pas de dasharray/dashoffset codé
   en dur en CSS) — si le script ne charge pas, les schémas restent
   pleinement visibles par défaut. */

(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var DURATION = 1100;
  var SELECTORS = [
    { selector: '.svg-colon', delay: 0 },
    { selector: '.svg-inflamme', delay: 150 },
    { selector: '.svg-courbe', delay: 100 },
    { selector: '.svg-lien:not(.svg-lien--boucle)', delay: 200 }
  ];

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function animatePath(p, delay) {
    p.style.strokeDasharray = '1';
    p.style.strokeDashoffset = '1';
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var elapsed = now - start - delay;
      if (elapsed < 0) { requestAnimationFrame(frame); return; }
      var t = elapsed >= DURATION ? 1 : elapsed / DURATION;
      p.style.strokeDashoffset = String(1 - easeInOutQuad(t));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function drawFigure(figureEl) {
    SELECTORS.forEach(function (group) {
      figureEl.querySelectorAll(group.selector).forEach(function (p) {
        animatePath(p, group.delay);
      });
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      drawFigure(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.figure').forEach(function (el) { io.observe(el); });
})();
