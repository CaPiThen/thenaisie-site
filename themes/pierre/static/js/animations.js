/* =============================================================
   ANIMATIONS — orchestrées avec Anime.js v4 (auto-hébergé, voir
   theme/js/vendor/anime.min.js). Vient en complément du système
   de révélation CSS déjà en place (base.html) : ici, uniquement
   des effets que la bibliothèque fait particulièrement bien —
   tracé SVG, compteurs numériques, échelonnement chorégraphié.

   Aucun état initial n'est codé en dur dans le CSS : les valeurs
   « from » sont posées par Anime.js lui-même au moment du
   animate(), donc rien ne peut rester bloqué invisible si ce
   script ne charge pas (dégradation : l'état final statique du
   HTML s'affiche simplement sans animation).
   ============================================================= */

(function () {
  'use strict';
  if (!window.anime) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var animate = anime.animate;
  var stagger = anime.stagger;
  var createDrawable = anime.createDrawable;

  /* --- Entrée du héros (accueil uniquement) --- */
  var heroContenu = document.querySelector('.hero-immersif__contenu');
  if (heroContenu) {
    animate(heroContenu.children, {
      opacity: [0, 1],
      translateY: [18, 0],
      delay: stagger(110),
      duration: 900,
      ease: 'outQuad'
    });
  }

  if (!('IntersectionObserver' in window)) return;

  /* --- Tracé des schémas SVG (page Maladie) --- */
  function drawFigure(figureEl) {
    var paths = figureEl.querySelectorAll('.svg-colon, .svg-inflamme, .svg-courbe, .svg-lien');
    paths.forEach(function (p, i) {
      animate(createDrawable(p), {
        draw: ['0 0', '0 1'],
        duration: 1100,
        delay: i * 140,
        ease: 'inOutQuad'
      });
    });
  }

  /* --- Compteurs numériques (chiffres clés) --- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    if (isNaN(target)) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var proxy = { v: 0 };
    animate(proxy, {
      v: target,
      duration: 1400,
      ease: 'outExpo',
      onUpdate: function () {
        el.textContent = Math.round(proxy.v).toLocaleString('fr-FR') + suffix;
      }
    });
  }

  /* --- Logos du CV, en cascade --- */
  function staggerLogos(timelineEl) {
    var logos = timelineEl.querySelectorAll('.logo-chip');
    if (!logos.length) return;
    animate(logos, {
      scale: [0.4, 1],
      opacity: [0, 1],
      delay: stagger(110),
      duration: 700,
      ease: 'outBack'
    });
  }

  /* --- Un seul observateur pour les trois effets déclenchés au défilement.
     threshold:0 + rootMargin négatif : se déclenche dès l'entrée dans le
     viewport (utile pour .cv-timeline, souvent plus haut que l'écran). --- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      var el = entry.target;
      if (el.classList.contains('figure')) drawFigure(el);
      else if (el.hasAttribute('data-count-to')) countUp(el);
      else if (el.classList.contains('cv-timeline')) staggerLogos(el);
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.figure, .stat-n[data-count-to], .cv-timeline').forEach(function (el) {
    io.observe(el);
  });
})();
