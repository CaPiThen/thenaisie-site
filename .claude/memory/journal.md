---
registre: journal
id_format: date (AAAA-MM-JJ), pas d'ID
description: Journal de session — 3 à 5 lignes maximum par entrée. Pas d'analyse, juste ce qui s'est passé.
champs:
  - date: AAAA-MM-JJ
  - resume: 3 à 5 lignes, factuel
---

# Journal de session — thenaisiepierre.fr

## Index

| Date | Résumé en un mot-clé |
|---|---|
| 2026-07-20 | Nettoyage + refonte design « labo » |
| 2026-07-21 | Contenu RCH/CV + shaders immersifs |
| 2026-07-22 | Mémoire projet + skills GSAP/Anime.js |

## Entrées

### 2026-07-20

Nettoyage du repo (dossier fantôme, thème mort, `publishconf.py` mort). Refonte visuelle complète : palette forêt/mousse puis fond blanc + vert/marron, typographie très grosse, pas de navigation globale. Installation du skill `ui-ux-pro-max` et tentative d'installation du MCP magic.

### 2026-07-21

Diagnostic complet du MCP magic (cassé en amont, voir BLK-001). Réécriture de la page RCH (schémas SVG, sources vérifiées, alimentation, stress) et du CV (récit par projets, logos d'entreprises). Suppression du blog/journal de vie. Trois itérations de shaders (feuillage → pictogrammes minimalistes, palette marron/gris → 100 % vert, bandeau photo → dégradé maillé). Fusion du sommaire dans le hero immersif façon Velaris, avec correction d'un vrai bug de contraste (verre clair → verre sombre).

### 2026-07-22

Installation des skills GSAP (8 modules officiels) et Anime.js (skill communautaire avec référence API). Mise en place de l'infrastructure mémoire `.claude/memory/` (5 registres) et mise à jour du `CLAUDE.md`. Intégration d'Anime.js v4.5.0 auto-hébergé : tracé des schémas SVG de la page RCH, compteurs numériques sur les chiffres clés, entrée en fondu du hero d'accueil, cascade des logos du CV — décision de rester sur Pelican (BDR-003), la taille sur OVH n'étant pas un facteur limitant.

Remplacement complet des shaders WebGL (`warp.js`/`mesh.js`, pixellisés par sous-échantillonnage) par un fond « ethereal » en filtre SVG natif (`feTurbulence` + `hueRotate` animé), réimplémentation vanilla du composant « Etheral Shadow » de 21st.dev (BDR-004). Calibrage empirique poussé (rasterisation réelle, histogrammes, balayage sur tout le cycle d'animation) pour un mouvement enfin bien visible — deux bugs de contraste trouvés et corrigés en cours de route (espace couleur linearRGB par défaut, et zone de texte protégée par le voile bien plus étroite que la largeur réelle du titre).

Suite le même jour : Pierre trouvait le mouvement encore trop lent malgré une config GSAP déjà correcte — cause trouvée par mesure de fps réelle (~25 fps avec 4 filtres SVG animés en simultané, déclenchant le lag smoothing de GSAP qui ralentit son horloge d'un facteur ~3, LRN-006). Fix : `gsap.ticker.lagSmoothing(0)` + un seul calque animé par zone (le calque accent vert reste figé). Palette repassée en noir/blanc avec touche de vert (BDR-005). Contraste re-vérifié (9,0:1 / 7,3:1 pire cas selon largeur) et présence du vert confirmée par rasterisation. Découverte annexe : l'onglet de prévisualisation ne passe jamais réellement au premier plan, rendant toute mesure de vitesse en temps réel invalide dans cet outil (LRN-007).

Encore plus tard le même jour : Pierre a trouvé ce rythme trop rapide et a demandé de revenir près du rythme d'origine (juste un peu plus vite), et de remplacer la palette noir/blanc/vert par un mélange vert/beige, sans aucun noir (BDR-006). Vitesse repassée à `22s→2,2s` (~15 % plus rapide que le tout premier réglage `26s→2,6s`). Fonds/voiles du noir neutre vers un vert forêt très sombre (`#111f16`). Calque mono recoloré en beige (`--sable-2`), calque accent gardé en vert (`--vert-clair`). En reprofilant le contraste, le voile de l'accueil (`.mesh-veil`) s'est révélé trop juste (4,49:1, proche du seuil AA) — resserré (+0,06-0,08 d'opacité) pour remonter à 5,71:1 partout. Un vieux process Pelican autoreload orphelin bloquait le port 8000 (tué, relancé proprement).

Dernière retouche du jour : Pierre voulait un vert « bien plus clair », en désignant précisément le vert du pied de page (`--vert`, bloc avec son nom) comme référence (BDR-007). Nouvelle couleur accent calculée en HSL pour garder exactement la teinte/saturation de `--vert` en montant seulement la luminosité (91,140,62 → 150,195,155). Contraste revérifié sur les 3 pages : marges quasi identiques à avant (accueil 5,61:1, page-hero 5,85-7,15:1 selon l'angle), toujours confortablement au-dessus du seuil AA.

Tout dernier ajustement du jour : Pierre a finalement demandé de quasiment supprimer le blanc du shader et de repasser à un vert complet, en cherchant de l'harmonie entre toutes les pages/bannières (BDR-008). Calque mono repassé du beige à `--vert-clair` (91,140,62), calque accent gardé en vert clair (150,195,155) — les deux teintes déjà utilisées ailleurs dans la charte (`--vert`, `--vert-clair`). Contraste nettement amélioré par ce changement (le vert est plus sombre que le beige) : accueil 7,93:1, page-hero 8,58-9,51:1 — au-dessus du seuil AAA partout, sans aucun réglage supplémentaire du voile nécessaire.

Et un tout dernier tour : Pierre trouvait quand même l'accueil trop sombre, a demandé de s'inspirer d'autres sites et d'arrêter de trop se soucier du contraste, et de repasser les cartes-liens du sommaire en beige (BDR-009). Fond du hero passé de `#111f16` à `var(--vert)` plein (repris tel quel du pied de page, déjà éprouvé avec du texte blanc). Voile largement allégé (opacités ~divisées par 2). Cartes du sommaire recolorées en beige (`--sable`) avec texte sombre et accents marron, comportement/JS intacts. Changement scopé à la page d'accueil uniquement.

Dernier tour du jour : Pierre a généralisé la règle — tout ce qui repose sur du vert sur l'accueil doit être beige (polices comprises), sauf nuances ponctuelles en vert foncé/noir, et le cadre visible autour des cartes du sommaire doit disparaître car ça ressemblait à « une page dans la page » (BDR-010). Tous les textes directement sur le fond vert (label, titre, sous-titre, bouton « Découvrir », label de section, pictogrammes, lueurs décoratives, indicateur de défilement) recolorés en beige ; seul le mot en italique du titre reste sombre (`--encre`) comme unique nuance, avec un contraste très faible (1,77:1) assumé et signalé à Pierre plutôt que masqué. Bordure des cartes passée en transparent (pas de `border: none`, pour ne pas décaler le padding).

Et une clarification juste après : Pierre voulait un beige plus foncé, et a précisé que le « cadre » qu'il visait était en fait la bande translucide du séparateur après le label « // sommaire », pas la bordure des cartes (BDR-011). Nouvelle variable `--sable-fonce` (#d8c3a0) appliquée à tout le beige de l'accueil ; le séparateur de section passé en transparent. Effet de bord détecté et corrigé au passage : le texte `--mut` des cartes tombait à 2,97:1 sur ce beige plus sombre — remonté à 6,19:1 avec une teinte dédiée.

Trois demandes en une pour finir la journée : (1) `--sable-fonce` réclairci à `#e6d2b0` ; (2) plus de noir/gris pour les nuances de contraste, remplacé par du vert forêt (`var(--vert)` pour le texte des cartes, un vert forêt encore plus sombre que le fond pour le mot en italique du titre, sous peine de le rendre invisible) (BDR-012) ; (3) un vrai effet « bloc qui tourne » entre le titre et le sommaire, inspiré d'une animation façon 21st.dev (BDR-013). Installé GSAP ScrollTrigger (auto-hébergé, même version que gsap.min.js). Hero et sommaire enveloppés dans `.flip-stage`, empilés dans la même cellule de grille et pivotés en 3D en sens inverse pendant un scroll épinglé d'une hauteur d'écran — nécessaire pour que les deux faces soient visibles simultanément (un simple double ScrollTrigger sans conteneur partagé aurait laissé le sommaire hors écran pendant toute la transition). Deux bugs réels trouvés en vérifiant, pas de simples ajustements : `scroll-behavior: smooth` (réglage global existant) cassait le calcul de position de ScrollTrigger (LRN-008) ; le fond ethereal `position:fixed` devait être sorti de `.flip-stage` avant que sa nouvelle `perspective` ne le recale dessus au lieu du viewport (LRN-009, anticipé par un commentaire déjà présent dans le CSS). Vérifié par scroll programmatique : progression 0→0,5→1 cohérente, épinglage puis relâchement corrects, repli mobile propre (<900px : aucune classe, aucun ScrollTrigger actif), pages CV/RCH non affectées.

Revirement immédiat : Pierre a abandonné l'effet de bloc qui tourne, qu'il ne voulait finalement pas — il cherchait un défilement lisse, sans aucune section qui « apparaisse » (BDR-014). Tout retiré proprement : `.flip-stage`/`.flip-face` (gabarit + CSS), `flip-transition.js` et `ScrollTrigger.min.js` supprimés du thème et de `output/`, script retiré de `base.html`. `.mesh-holder` remis à sa place d'origine dans `.hero-immersif`. `scroll-behavior: smooth` restauré (le conflit disparaît avec le plugin). Au passage, `.hub-card` retiré de la liste de révélation au scroll dans `base.html` : les cartes du sommaire sont maintenant toujours pleinement visibles, sans fondu/décalage à l'entrée dans le viewport. Vérifié : shader intact, aucune classe/JS résiduel du flip, `.project-card` du portfolio garde bien son animation de révélation (changement scopé à l'accueil uniquement).

Dernière série de retouches : Pierre voulait les boutons de l'accueil encore plus clairs (proches du blanc), cette même couleur reprise pour les titres de toutes les autres pages, et les barres latérales des blocs de contexte de la page RCH supprimées (BDR-015). `--sable-fonce` réclairci à `#f4e0be`. En vérifiant, découvert que plusieurs `rgba()` littéraux (hero-sub, bouton, picto, lueurs, indicateur de défilement) étaient restés bloqués sur l'ancienne valeur de BDR-011, jamais suivis lors du passage à BDR-012 — corrigé au passage (LRN-010, un vrai bug de désynchronisation, pas une simple retouche). Titres de CV/RCH/portfolio recolorés dans la même teinte. Barre des 5 blocs `.callout` de la page RCH masquée. Contraste revérifié partout : encore meilleur qu'avant (6,7-7,4:1 pire cas sur les pages intérieures, 6,84:1 sur l'accueil), la teinte plus claire portant naturellement plus de contraste sur fond sombre.

Micro-retouche juste avant le premier déploiement : Pierre a donné une valeur hexadécimale exacte (`#ffefcb`) pour les boutons de l'accueil (BDR-016) — appliquée telle quelle à `--sable-fonce` et à tous ses doublons littéraux. Contraste : 7,77:1. Puis premier commit + push de toute cette session (voir `.github/workflows/deploy.yml` : le push sur `main` déclenche le build Pelican et le dépôt FTP vers OVH automatiquement) — rien de tout le travail accumulé (shaders, palette, pages CV/RCH/portfolio/galerie, mémoire projet) n'avait encore été commité jusqu'ici.
