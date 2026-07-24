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
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = 'stroke-dashoffset 1100ms ease-in-out ' + (i * 140) + 'ms';
      /* Un reflow forcé (lecture de getTotalLength juste avant) sépare
         l'état "à 0%" de l'état "à 100%" en deux frames distinctes,
         sinon le navigateur applique directement l'état final sans
         jouer la transition. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { p.style.strokeDashoffset = '0'; });
      });
      /* Repli sans dasharray une fois le tracé terminé : laisse la
         classe CSS reprendre la main (ex. `.svg-lien--boucle`, qui a
         son propre dasharray pointillé décoratif, jamais lié au tracé). */
      p.addEventListener('transitionend', function () {
        p.style.strokeDasharray = '';
        p.style.strokeDashoffset = '';
        p.style.transition = '';
      }, { once: true });
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
