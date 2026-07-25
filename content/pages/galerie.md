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
<div class="gallery-masonry">
<div class="photo-item"><a href="https://photos.thenaisiepierre.fr/api/assets/cdadf6c4-4668-406d-aadd-403c1dce90d3/original?key=rizlnUPhcdqjegY83L7_z7EYXWDlpeGfzkOLipGEYwae9xBNQclLlBXAsvf82mZ55u0" target="_blank" rel="noopener"><img src="https://photos.thenaisiepierre.fr/api/assets/cdadf6c4-4668-406d-aadd-403c1dce90d3/thumbnail?key=rizlnUPhcdqjegY83L7_z7EYXWDlpeGfzkOLipGEYwae9xBNQclLlBXAsvf82mZ55u0" loading="lazy" alt="Photo 1"></a></div>
<div class="photo-item"><a href="https://photos.thenaisiepierre.fr/api/assets/8856e4e5-d83f-49a8-a3af-5881c7bbdbf5/original?key=rizlnUPhcdqjegY83L7_z7EYXWDlpeGfzkOLipGEYwae9xBNQclLlBXAsvf82mZ55u0" target="_blank" rel="noopener"><img src="https://photos.thenaisiepierre.fr/api/assets/8856e4e5-d83f-49a8-a3af-5881c7bbdbf5/thumbnail?key=rizlnUPhcdqjegY83L7_z7EYXWDlpeGfzkOLipGEYwae9xBNQclLlBXAsvf82mZ55u0" loading="lazy" alt="Photo 2"></a></div>
<div class="photo-item"><a href="https://photos.thenaisiepierre.fr/api/assets/c6ec8671-6cac-499e-aa11-cdbffebc6779/original?key=rizlnUPhcdqjegY83L7_z7EYXWDlpeGfzkOLipGEYwae9xBNQclLlBXAsvf82mZ55u0" target="_blank" rel="noopener"><img src="https://photos.thenaisiepierre.fr/api/assets/c6ec8671-6cac-499e-aa11-cdbffebc6779/thumbnail?key=rizlnUPhcdqjegY83L7_z7EYXWDlpeGfzkOLipGEYwae9xBNQclLlBXAsvf82mZ55u0" loading="lazy" alt="Photo 3"></a></div>
<div class="photo-item"><a href="https://photos.thenaisiepierre.fr/api/assets/cd42d19c-eeee-4607-937b-55ceb79e95c6/original?key=rizlnUPhcdqjegY83L7_z7EYXWDlpeGfzkOLipGEYwae9xBNQclLlBXAsvf82mZ55u0" target="_blank" rel="noopener"><img src="https://photos.thenaisiepierre.fr/api/assets/cd42d19c-eeee-4607-937b-55ceb79e95c6/thumbnail?key=rizlnUPhcdqjegY83L7_z7EYXWDlpeGfzkOLipGEYwae9xBNQclLlBXAsvf82mZ55u0" loading="lazy" alt="Photo 4"></a></div>
</div>
<!-- GALERIE:END -->
