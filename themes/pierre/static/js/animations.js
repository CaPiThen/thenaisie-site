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

/* =============================================================
   QUADRILLAGE DE POINTS MAGNÉTIQUE (accueil, .index-section) —
   voir BDR-041. Un seul <canvas> repeint chaque frame plutôt que des
   centaines d'éléments DOM individuels. Le suivi de la souris est posé
   sur .index-section (jamais sur le canvas, `pointer-events: none` en
   CSS), donc les liens du sommaire restent cliquables sans arbitrage.
   La boucle rAF s'arrête d'elle-même une fois les points revenus au
   repos — aucun calcul en continu une fois la souris repartie. */
(function () {
  'use strict';
  var section = document.querySelector('.index-section');
  var canvas = document.querySelector('.dot-field');
  if (!section || !canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SPACING = 40;
  var DOT_COLOR = '#e3d8c8';
  var R_REST = 1.9, R_MAX = 2.8;
  var INFLUENCE = 130, PULL = 0.38, EASE = 0.18;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0, h = 0, dots = [];
  var mouse = { x: -9999, y: -9999, active: false };
  var raf = null;

  function build() {
    w = section.offsetWidth; h = section.offsetHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (var y = SPACING / 2; y < h; y += SPACING) {
      for (var x = SPACING / 2; x < w; x += SPACING) {
        dots.push({ ox: x, oy: y, x: x, y: y });
      }
    }
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = DOT_COLOR;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var tx = d.ox, ty = d.oy, r = R_REST;
      if (mouse.active) {
        var dx = mouse.x - d.ox, dy = mouse.y - d.oy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < INFLUENCE) {
          var t = 1 - dist / INFLUENCE;
          tx = d.ox + dx * t * PULL;
          ty = d.oy + dy * t * PULL;
          r = R_REST + (R_MAX - R_REST) * t;
        }
      }
      d.x += (tx - d.x) * EASE;
      d.y += (ty - d.y) * EASE;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function settled() {
    if (mouse.active) return false;
    for (var i = 0; i < dots.length; i++) {
      if (Math.abs(dots[i].x - dots[i].ox) > 0.05 || Math.abs(dots[i].y - dots[i].oy) > 0.05) return false;
    }
    return true;
  }

  function loop() {
    draw();
    raf = settled() ? null : requestAnimationFrame(loop);
  }

  function ensureLoop() { if (!raf) raf = requestAnimationFrame(loop); }

  build();
  if (reduceMotion) return;

  section.addEventListener('pointermove', function (e) {
    var rect = section.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
    ensureLoop();
  });
  section.addEventListener('pointerleave', function () {
    mouse.active = false;
    ensureLoop();
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
})();
