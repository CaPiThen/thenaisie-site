/* =============================================================
   ANIMATIONS — vanilla, sans dépendance (Anime.js retiré, voir
   /impeccable optimize). Tracé des schémas SVG (page Maladie) :
   l'animation elle-même vit entièrement en CSS (stroke-dashoffset,
   voir style.css) grâce à `pathLength="1"` posé sur chaque tracé
   dans le HTML — plus de calcul de longueur ni de manipulation de
   style ici. Ce script ajoute `.draw` sur `.figure` (état masqué,
   prêt à s'animer) puis `.in` à l'entrée dans le viewport (déclenche
   la transition définie en CSS).

   Dégradation : si ce script ne charge pas, `.draw` n'est jamais
   ajoutée — les tracés restent dans leur état CSS par défaut,
   pleinement visibles, jamais masqués sans un JS pour les révéler
   (même principe que `.reveal`/`.in` dans base.html). Même chose si
   l'utilisateur demande `prefers-reduced-motion`. */

(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var figures = document.querySelectorAll('.figure');
  if (!figures.length) return;
  figures.forEach(function (el) { el.classList.add('draw'); });

  if (!('IntersectionObserver' in window)) {
    figures.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      entry.target.classList.add('in');
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  figures.forEach(function (el) { io.observe(el); });
})();
