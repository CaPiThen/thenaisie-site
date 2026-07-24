/* =============================================================
   ANIMATIONS — vanilla, sans dépendance (Anime.js retiré, voir
   /impeccable optimize : l'entrée du hero et la cascade des logos
   du CV avaient déjà un équivalent CSS ailleurs dans le site ;
   seul le tracé des schémas SVG (page Maladie) reste ici, en
   `stroke-dashoffset` natif.

   Dégradation : si ce script ne charge pas, les schémas s'affichent
   simplement déjà tracés (aucun état masqué codé en dur ailleurs).
   ============================================================= */

(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  /* --- Tracé des schémas SVG (page Maladie) --- */
  function drawFigure(figureEl) {
    var paths = figureEl.querySelectorAll('.svg-colon, .svg-inflamme, .svg-courbe, .svg-lien');
    paths.forEach(function (p, i) {
      var len = p.getTotalLength();
      if (!len) return;
      /* Séquence classique pour animer un tracé SVG en CSS : couper la
         transition, poser l'état "à 0%", forcer un reflow synchrone en
         LISANT une propriété de mise en page (getBoundingClientRect),
         puis rétablir la transition et poser l'état final dans le même
         tick. Plus fiable qu'un double requestAnimationFrame quand
         l'appel part d'un callback IntersectionObserver plutôt que
         d'une interaction utilisateur directe. */
      p.style.transition = 'none';
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.getBoundingClientRect();
      p.style.transition = 'stroke-dashoffset 1100ms ease-in-out ' + (i * 140) + 'ms';
      p.style.strokeDashoffset = '0';
      /* Repli sans dasharray une fois le tracé terminé : laisse la
         classe CSS reprendre la main (ex. `.svg-lien--boucle`, qui a
         son propre dasharray pointillé décoratif, jamais lié au tracé).
         Filet de sécurité au cas où `transitionend` ne se déclenche pas
         (onglet en arrière-plan, etc.) : nettoyage forcé après coup. */
      var cleanup = function () {
        p.style.strokeDasharray = '';
        p.style.strokeDashoffset = '';
        p.style.transition = '';
      };
      p.addEventListener('transitionend', cleanup, { once: true });
      setTimeout(cleanup, 1100 + i * 140 + 300);
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
