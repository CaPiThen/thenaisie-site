Title: Galerie
Slug: galerie
Subtitle: Des photos, hébergées et servies depuis mon propre NAS — pas sur OVH.

<p class="lead">Plutôt que d'alourdir l'hébergement du site, les photos ci-dessous sont chargées directement depuis un album partagé de mon Immich (lui-même connecté à mon NAS). Le site ne fait qu'y pointer : aucune photo n'est jamais copiée sur OVH.</p>

<!--
Comment activer la galerie, une fois l'album Immich prêt :

1. Dans Immich, ouvrir l'album à publier → « Partager » → créer un lien de
   partage public (sans mot de passe — un partage protégé par mot de passe
   n'est pas géré par ce mécanisme).
2. Copier l'URL générée (ex. https://photos.thenaisiepierre.fr/s/xxxxx).
3. La renseigner dans la variable d'environnement IMMICH_SHARE_URL :
   - en local, avant `pelican content` : export IMMICH_SHARE_URL="..."
   - en déploiement : variable de dépôt GitHub (Settings → Secrets and
     variables → Actions → Variables) sous le même nom.

Le bloc ci-dessous (entre les balises GALERIE:START/END) est régénéré
automatiquement par build_gallery.py à chaque build, à partir de cet album.
Ne pas l'éditer à la main : toute modification serait écrasée au prochain
build. Tant que IMMICH_SHARE_URL est absente ou injoignable, ce bloc reste
inchangé (voir .claude/memory/decisions.md, BDR-019).
-->

<!-- GALERIE:START -->
<div class="gallery-empty" id="galerie-empty">
<span>//</span> galerie à venir — connectée à mon NAS dès que le partage Immich est renseigné (IMMICH_SHARE_URL).
</div>
<!-- GALERIE:END -->
