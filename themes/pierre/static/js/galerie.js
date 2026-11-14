/* Visionneuse de la galerie : ouvre la photo dans la page (élément
   <dialog> natif) au lieu de suivre le lien. Sans ce script, le lien
   ouvre simplement la photo dans le même onglet.
   Flèches du clavier et glissement du doigt pour passer d'une photo à
   l'autre, Échap ou clic sur le fond pour fermer. */
(function () {
  'use strict';
  var liens = Array.prototype.slice.call(document.querySelectorAll('.photo-item a'));
  if (!liens.length || !window.HTMLDialogElement) return;

  var boite = document.createElement('dialog');
  boite.className = 'visionneuse';
  boite.setAttribute('aria-label', 'Photo en grand');
  boite.tabIndex = -1;
  boite.innerHTML =
    '<img class="visionneuse__image" alt="">' +
    '<div class="visionneuse__barre">' +
    '<button type="button" class="visionneuse__btn" data-pas="-1">Précédente</button>' +
    '<span class="visionneuse__compte" aria-live="polite"></span>' +
    '<button type="button" class="visionneuse__btn" data-pas="1">Suivante</button>' +
    '<button type="button" class="visionneuse__btn visionneuse__fermer">Fermer</button>' +
    '</div>';
  document.body.appendChild(boite);

  var image = boite.querySelector('.visionneuse__image');
  var compte = boite.querySelector('.visionneuse__compte');
  var courant = 0;

  function montrer(i) {
    courant = (i + liens.length) % liens.length;
    var lien = liens[courant];
    var vignette = lien.querySelector('img');
    var grande = lien.href;
    /* La vignette, déjà chargée, s'affiche tout de suite ; la grande
       version la remplace dès qu'elle est prête. */
    image.src = vignette.currentSrc || vignette.src;
    image.alt = vignette.alt;
    boite.classList.add('charge');
    var pre = new Image();
    pre.onload = function () {
      if (liens[courant] === lien) { image.src = grande; boite.classList.remove('charge'); }
    };
    pre.onerror = function () { boite.classList.remove('charge'); };
    pre.src = grande;
    compte.textContent = (courant + 1) + ' / ' + liens.length;
  }

  /* Une photo retirée de l'album entre deux publications ne charge plus :
     on retire sa case plutôt que d'afficher une image cassée. */
  function retirer(lien) {
    var i = liens.indexOf(lien);
    if (i > -1) liens.splice(i, 1);
    lien.parentNode.hidden = true;
  }
  liens.slice().forEach(function (lien) {
    var img = lien.querySelector('img');
    if (img.complete && !img.naturalWidth && img.loading !== 'lazy') retirer(lien);
    else img.addEventListener('error', function () { retirer(lien); });
  });

  liens.forEach(function (lien) {
    lien.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      montrer(liens.indexOf(lien));
      boite.showModal();
      boite.focus();
    });
  });

  boite.addEventListener('click', function (e) {
    var pas = e.target.getAttribute && e.target.getAttribute('data-pas');
    if (pas) { montrer(courant + parseInt(pas, 10)); return; }
    if (e.target === boite || e.target.classList.contains('visionneuse__fermer')) boite.close();
  });
  boite.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') montrer(courant + 1);
    if (e.key === 'ArrowLeft') montrer(courant - 1);
  });
  boite.addEventListener('close', function () { liens[courant].focus(); });

  var x0 = null;
  boite.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  boite.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) montrer(courant + (dx < 0 ? 1 : -1));
  });
})();
