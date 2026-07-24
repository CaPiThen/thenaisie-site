/* =============================================================
   ETHEREAL — fond animé en filtre SVG natif (bruit + rotation de
   teinte), réimplémentation vanilla du composant « Etheral Shadow »
   de 21st.dev (React + framer-motion), sans aucune de ces deux
   dépendances. L'animation est pilotée par une boucle rAF maison
   (voir plus bas) — GSAP a été retiré du site (voir /impeccable
   optimize) : il ne servait plus qu'à ce seul tween, déjà dupliqué
   ici par un repli vanilla équivalent.

   Pourquoi cette technique plutôt que les shaders WebGL précédents
   (warp.js / mesh.js, retirés) : ceux-ci étaient rendus sur un
   canevas sous-échantillonné (jusqu'à 45 % de la résolution réelle)
   pour limiter le coût — d'où l'aspect pixellisé reproché. Un filtre
   SVG est rendu nativement par le moteur du navigateur, toujours à
   pleine résolution : jamais de pixellisation, quelle que soit la
   taille d'écran.

   La rotation de teinte (feColorMatrix type="hueRotate") appliquée
   en continu sur un bruit statique (feTurbulence) fait défiler les
   canaux de couleur du bruit les uns dans les autres : c'est ce qui
   donne l'impression de mouvement fluide sans jamais recalculer le
   bruit lui-même — la même astuce que le composant de référence.

   Réglable depuis le HTML, sans toucher à ce fichier :
     <div class="ethereal"
          data-color="230,230,230"   RGB 0-255, séparés par des virgules
          data-scale="60"            1-100 — échelle/grain du bruit
          data-speed="90"            1-100 — vitesse de l'écoulement
          data-seed="2"
          data-alpha="0.75"></div>   0-1.4 environ — densité du voile de couleur

   Si les filtres SVG sont indisponibles, l'élément reste vide et la
   couleur de fond du conteneur suffit.
   ============================================================= */

(function () {
  'use strict';

  var list = document.querySelectorAll('.ethereal');
  if (!list.length) return;

  var reducedQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var uid = 0;

  /* Mesure réelle (22/07) : 4 filtres SVG animés en simultané (bruit +
     hueRotate + matrice + flou, recalculés à chaque frame) faisaient
     chuter le navigateur à ~25fps, ralentissant la boucle d'animation
     (le premier pilote testé, GSAP, compensait alors avec son « lag
     smoothing » par défaut — la config demandait des cycles de
     0,7-1,1s mais le rendu réel en affichait ~2,2s). Ce n'était pas un
     mauvais réglage de durée : c'était le rendu qui ne suivait pas. La
     boucle rAF ci-dessous calcule la teinte à partir du temps écoulé
     réel (pas d'un compteur de frames), donc elle reste fidèle à la
     durée configurée même si des frames sont sautées ; on ne fait par
     ailleurs tourner qu'un seul calque animé par section (voir plus
     bas) pour ramener le coût réel sous la barre des 60fps. */

  function mapRange(v, a, b, c, d) { return c + ((v - a) / (b - a)) * (d - c); }

  /* Grain filmique : un unique motif de bruit SVG, généré une fois,
     tuilé en CSS — pas d'image externe, pas de coût JS par image. */
  var GRAIN_SVG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E" +
    "%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E" +
    "%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

  function init(el) {
    uid += 1;
    var id = 'ethereal-' + uid;
    var d = el.dataset;
    var scale = parseFloat(d.scale || '60');
    var speed = parseFloat(d.speed || '85');
    var seed = d.seed || '2';
    var alphaParam = parseFloat(d.alpha || '0.75');
    var rgb = (d.color || '230,230,230').split(',').map(function (n) {
      return (parseFloat(n) / 255).toFixed(3);
    });

    /* mêmes plages que le composant de référence (mapRange 1-100) */
    var fx = mapRange(scale, 1, 100, 0.0065, 0.0016).toFixed(5);
    var fy = mapRange(scale, 1, 100, 0.0110, 0.0038).toFixed(5);
    /* Rythme de base (26s→2,6s) repris, en un peu plus rapide : le passage
       à 3,2s→0,45s s'est révélé trop marqué une fois le vrai goulot de
       rendu corrigé (lag smoothing, calque unique animé — voir plus haut).
       On revient donc près du rythme d'origine, avec une marge modeste
       (~15%) pour rester légèrement plus vif que la toute première version. */
    var durationSec = mapRange(speed, 1, 100, 22, 2.2);

    /* Étirement de contraste, calé empiriquement (mesure directe de la
       plage réelle de sortie de feTurbulence en espace sRGB, très
       différente d'une hypothèse théorique) : la moyenne des 3 canaux
       de bruit varie entre ~0,29 et ~0,57. Le poids 1,2 et le biais -1,0
       étirent cette plage étroite jusqu'à couvrir 0 → 255 en entier
       (vérifié : histogramme réparti sur toute la plage). `data-alpha`
       déplace ce biais pour ajuster la densité globale. */
    var weight = 1.2;
    var bias = -1.0 + (alphaParam - 0.75);

    el.innerHTML =
      '<svg class="ethereal-defs" aria-hidden="true"><defs>' +
        '<filter id="' + id + '" color-interpolation-filters="sRGB" x="-20%" y="-20%" width="140%" height="140%">' +
        '<feTurbulence type="fractalNoise" numOctaves="2" seed="' + seed + '" baseFrequency="' + fx + ' ' + fy + '" result="noise"/>' +
        '<feColorMatrix class="ethereal-hue" in="noise" type="hueRotate" values="0" result="flow"/>' +
        '<feColorMatrix in="flow" type="matrix" result="colored" values="' +
          '0 0 0 0 ' + rgb[0] + ' ' +
          '0 0 0 0 ' + rgb[1] + ' ' +
          '0 0 0 0 ' + rgb[2] + ' ' +
          weight + ' ' + weight + ' ' + weight + ' 0 ' + bias + '"/>' +
      '</filter></defs></svg>' +
      '<div class="ethereal-fill" style="filter:url(#' + id + ') blur(5px)"></div>' +
      '<div class="ethereal-grain" style="background-image:url(&quot;' + GRAIN_SVG + '&quot;)"></div>';

    var hueNode = el.querySelector('.ethereal-hue');
    if (!hueNode) return;

    if (reducedQ.matches) { hueNode.setAttribute('values', '140'); return; }

    /* Le calque « accent » (touche de vert) reste fixe : il n'a pas
       besoin de bouger pour se voir, et geler son filtre évite de le
       recalculer à chaque frame — ce qui libère le budget de rendu
       pour que le calque mono, lui, tourne à vitesse réelle et pleine
       fluidité (cf. note plus haut sur le lag smoothing). */
    if (el.classList.contains('ethereal--accent')) {
      var fixedHue = (parseInt(seed, 10) * 37) % 360;
      hueNode.setAttribute('values', fixedHue.toFixed(1));
      return;
    }

    var proxy = { hue: 0 };
    var applyHue = function () { hueNode.setAttribute('values', proxy.hue.toFixed(1)); };

    /* Boucle rAF : la teinte est recalculée à partir du temps écoulé réel
       (pas d'un compteur de frames), donc un cycle dure toujours
       `durationSec`, même si des frames sont sautées sous charge. */
    var t0 = null, raf = 0;
    var frame = function (now) {
      if (t0 === null) t0 = now;
      proxy.hue = ((now - t0) / (durationSec * 1000)) * 360 % 360;
      applyHue();
      raf = requestAnimationFrame(frame);
    };
    var tween = {
      pause: function () { if (raf) { cancelAnimationFrame(raf); raf = 0; } },
      play: function () { if (!raf) raf = requestAnimationFrame(frame); }
    };

    /* Pause hors écran / onglet caché : même économie de calcul. */
    var visible = true;
    function sync() { if (visible && !document.hidden) tween.play(); else tween.pause(); }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(el);
    }
    document.addEventListener('visibilitychange', sync);
  }

  list.forEach(init);
})();
