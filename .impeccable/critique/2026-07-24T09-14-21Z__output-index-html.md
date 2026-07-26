---
target: revue style et animations du site (accueil + cv + maladie + galerie)
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
timestamp: 2026-07-24T09-14-21Z
slug: output-index-html
---
Method: dual-agent (A: ab3a89f1ec9fd5dac · B: a41863488c6a0391f)

## Score de santé design

| # | Heuristique | Score | Point clé |
|---|---|---|---|
| 1 | Visibilité du statut système | 3 | Aucun repère de position sur les pages longues (`maladie.html`, 633 lignes) au-delà de la TOC statique |
| 2 | Correspondance avec le monde réel | 3 | Le vocabulaire terminal (`~/`, `//`, « labo personnel ») colle à l'identité d'ingénieur de Pierre mais est un registre un peu froid pour les lecteurs non techniques de la page RCH |
| 3 | Contrôle et liberté utilisateur | 2 | Aucun chemin de retour fonctionnel vers l'accueil une fois passé le header, sur aucune page intérieure |
| 4 | Cohérence et standards | 3 | `cv.html` n'a pas de `.toc` contrairement à `maladie.html`, pour une longueur comparable |
| 5 | Prévention des erreurs | 3 | Les liens `mailto:` n'ont pas de repli pour les visiteurs sans client mail configuré |
| 6 | Reconnaissance plutôt que rappel | 4 | Citations en exposant + `.source-list` ancrée, correspondance TOC/ancres vérifiée exacte |
| 7 | Flexibilité et efficacité | n/a | Pas de tâche répétitive ni de workflow expert sur une vitrine statique |
| 8 | Design esthétique et minimaliste | 3 | Empilement de calques (`.ethereal` + grain + voile sur le hero, pictos + deux dégradés radiaux sur `.page-content`) plus dense que ce que « minimaliste » suggère |
| 9 | Aide à la reconnaissance/diagnostic des erreurs | 3 | `.gallery-empty` bien traité (bordure en pointillés, copy claire) ; page 404 non vérifiée (hors du set de fichiers revus) |
| 10 | Aide et documentation | n/a | Pas de tâche complexe nécessitant de la doc ; le système de citations de la page RCH fait déjà office de documentation |

**Total : 24/32** (8 heuristiques applicables sur un site en mode Persuade/Experience) → **75 %, bande « Bon »**.

## Verdict de spécificité du design

**Évaluation LLM (Assessment A) :** Spécificité élevée, confiance forte. Le texte est granulaire et non générique (métaphore du destin viking en ouverture de `maladie.html`, fil rouge « chauffage urbain → RH → maison → propre corps » sur `cv.html` comme thèse d'auteur, pas du remplissage), les sources sont réelles et vérifiables (INSERM, ameli.fr, afa.asso.fr, DOI *Cell* 2023), les employeurs et dates sont réels, l'identité de marque terminal (`~/ thenaisiepierre`, « labo personnel ») est un choix spécifique lié à l'image d'ingénieur de Pierre. Ce n'est pas un territoire « photo de stock + Lorem ipsum ».

**Scan déterministe (Assessment B) :** Le détecteur signale 10 occurrences de la règle `overused-font` sur le duo Fraunces (titres) + Inter (corps) — un pairing typographique très répandu dans les interfaces générées par IA. Cette règle porte sur un axe différent (distinctivité de la police, pas la façon dont elle est servie) et B n'a pas jugé cette alerte comme un faux positif : c'est un signal réel à prendre en compte pour l'objectif « classe et distinctif » de la prochaine passe. Par ailleurs, 4 occurrences de `side-tab` (bordure gauche épaisse) ont été jugées faux positifs après vérification — ce sont des citations en bloc (`blockquote`) et des rails de timeline avec marqueurs circulaires (`.cv-timeline`, `.story-item`), pas des cartes ; un commentaire dans `style.css:607-610` montre que Pierre a déjà retiré une vraie bordure latérale de `.callout` sur cette même page, preuve que ce pattern a déjà été passé au crible une fois. Enfin, `em-dash-overuse` (30 tirets cadratins sur `cv.html`, 43 sur `maladie.html`) est un signal réel, avancé mais avéré après échantillonnage manuel — pas un faux positif.

**Overlays visuels :** indisponibles cette session — aucun outil de capture/navigateur n'était exposé à l'un ou l'autre agent, et l'installation d'un tel outil a été explicitement refusée plus tôt dans la session. Pas de rendu visuel superposé à pointer dans un onglet [Human].

## Impression générale

Le site est déjà loin d'un premier jet : palette, contraste, performance du shader et hébergement des dépendances ont été itérés en profondeur (voir `.claude/memory/decisions.md`, BDR-001 à BDR-022). Le plus gros écart avec l'objectif « classe et moderne, léger en ressources » n'est pas la direction artistique — déjà cohérente et personnelle — mais deux angles morts restés hors du radar des sessions précédentes : un vrai trou d'accessibilité sur le tout premier écran (contraste du mot en italique du titre), et une contradiction interne sur le poids : deux libs vendor (69 Ko gzip) alors que des équivalents vanilla existent déjà dans le même repo pour les mêmes effets.

## Ce qui fonctionne bien

1. **`prefers-reduced-motion` géré de bout en bout** — `style.css:87-124`, `ethereal.js`, `animations.js`, `base.html` : cohérent sur les trois systèmes d'animation, rarement aussi complet.
2. **Système de citations de la page RCH** — `sup a` + `.source-list` + ancres `#src-*`, correspondance vérifiée exacte avec la TOC. La pièce la mieux exécutée du site vu les enjeux du contenu.
3. **État vide de la galerie** (`.gallery-empty`) — un vrai état conçu, pas un blanc cassé, avec une copy claire sur le pourquoi.

## Problèmes prioritaires

**[P0] Contraste illisible sur le titre de l'accueil**
Pourquoi ça compte : `style.css:248`, `.hero-immersif h1 em { color: #17241a }` sur fond `--vert` + shader animé calcule à ~1,8:1 — sous le minimum de 3:1 même pour du texte large. C'est le mot en italique de « Je construis des **systèmes**. Je vis avec une **maladie**. » — du contenu sémantique réel, sur le tout premier écran vu par chaque visiteur.
Fix : éclaircir la couleur pour tenir 3:1 sur la trame la plus sombre du shader, ou garder l'effet « gravé » via un léger contour/ombre plutôt qu'un contraste de couleur plat seul.
Commande suggérée : `/impeccable polish`

**[P1] Aucun chemin de retour vers l'accueil depuis une page intérieure**
Pourquoi ça compte : `base.html:50` (`.nav-logo`) et `base.html:61` (`.footer-logo`) ne sont pas des liens, sur aucune page. Combiné à l'absence de nav (décision assumée, BDR-001), un lecteur arrivé par un lien direct sur `maladie.html` (633 lignes) n'a strictement aucun moyen d'atteindre l'accueil sinon le bouton retour du navigateur.
Fix : envelopper `.nav-logo` (ou `.footer-logo`) dans `<a href="{{ SITEURL }}/">` — un seul lien, aucune exposition d'un plan du site, ne réintroduit pas de nav globale.
Commande suggérée : `/impeccable polish`

**[P1] GSAP + Anime.js (69 Ko gzip) dupliquent du code vanilla déjà présent dans le repo**
Pourquoi ça compte : `ethereal.js:144-157` contient déjà un repli vanilla `requestAnimationFrame` fonctionnel pour l'unique usage de GSAP (faire tourner une teinte 0→360 en boucle). `style.css` (`.hub-grid .reveal:nth-child(n)`) implémente déjà en CSS pur le même pattern de cascade qu'Anime.js recrée en JS pour le hero et les logos du CV. Seul le tracé SVG justifie potentiellement une lib, et c'est une technique `getTotalLength()`/`stroke-dashoffset` de quelques lignes. Les deux libs vendor pèsent à elles seules plus que tout le CSS + JS maison réunis — sur un site dont la philosophie explicite (BDR-003) est zéro dépendance runtime superflue, hébergé en mutualisé.
Fix : retirer GSAP (garder le repli rAF existant comme seul chemin) ; remplacer les effets de stagger d'Anime.js par le pattern CSS déjà utilisé ailleurs ; garder un petit helper vanilla uniquement pour le tracé SVG.
Commande suggérée : `/impeccable optimize`

**[P2] `cv.html` n'a pas de sommaire (TOC), contrairement à `maladie.html`**
Pourquoi ça compte : `output/pages/cv.html` (420 lignes) n'a pas de `.toc`, alors que le composant existe déjà et fonctionne sur `maladie.html`. Un recruteur — le lecteur le plus pressé du site — n'a aucun moyen de sauter directement à « compétences » ou au contact.
Fix : réutiliser le composant `.toc` existant sur `cv.html`.
Commande suggérée : `/impeccable layout`

**[P2] Duo typographique Fraunces/Inter jugé « générique IA » par le détecteur**
Pourquoi ça compte : 10 occurrences de la règle `overused-font` (voir verdict de spécificité ci-dessus). Pas un bug, mais un signal direct contre l'objectif « quelque chose de classe » de la prochaine passe — ce pairing est aujourd'hui l'un des plus vus dans les interfaces produites par IA, donc le moins distinctif possible pour une identité personnelle.
Fix : explorer un traitement typographique plus distinctif — soit un nouveau duo (en gardant IBM Plex Mono pour les labels, déjà spécifique), soit un traitement plus marqué du duo actuel (tailles, graisses, contrastes).
Commande suggérée : `/impeccable typeset`

**[P3] Compteurs animés sur des chiffres épidémiologiques**
Pourquoi ça compte : `animations.js` `countUp()` anime « 212 700 personnes traitées pour une MICI en France » et « 170+ ». Le compteur qui monte est une convention de métrique SaaS/croissance ; appliquée à un chiffre de santé publique, le registre peut lire comme une trivialisation en effet marketing.
Fix : rendre ces deux chiffres statiques ; garder le compteur (si conservé) pour des chiffres à moindre enjeu — il n'y en a actuellement aucun sur le site.
Commande suggérée : `/impeccable quieter`

**[P3] 30 à 43 tirets cadratins par page de contenu long**
Pourquoi ça compte : `em-dash-overuse` confirmé par échantillonnage manuel (constructions incises authentiques, pas un faux positif de règle) sur `cv.html` (30) et `maladie.html` (43). Signal avancé mais réel — une densité qui peut lire comme un tic d'écriture plutôt qu'un choix de style voulu.
Fix : relire ces deux pages en variant la ponctuation (virgules, parenthèses, phrases courtes) pour réduire la densité.
Commande suggérée : `/impeccable clarify`

## Signaux persona

**Sam (utilisateur dépendant de l'accessibilité, basse vision) :** le mot en italique du titre de l'accueil (`output/index.html`) calcule à ~1,8:1 — sous le seuil même pour du texte large. C'est la toute première chose que Sam est censé lire sur le site.

**Jordan (premier arrivant, via un lien direct) :** Jordan reçoit le lien `maladie.html` d'un proche — exactement le modèle de partage voulu par ce site — le lit, puis veut voir qui est Pierre professionnellement. Le seul élément qui se lit visuellement comme une marque de site (`.nav-logo`, `~/ thenaisiepierre`) n'est un lien nulle part sur le site. Seule option : éditer l'URL à la main jusqu'à la racine du domaine.

**Casey (utilisateur mobile distrait) :** `.mesh-holder` sur `output/index.html` est en `position: fixed` et héberge en continu deux filtres SVG animés (`feTurbulence`/`hueRotate`) plus une chaîne `blur(5px)`, pendant que Casey défile d'un pouce. Le code documente lui-même (`ethereal.js:45-55`) une chute mesurée à ~25 fps avant mitigation. Combiné aux 69 Ko gzip de JS vendor à charger, les toutes premières secondes sur l'accueil sont le moment le plus disputé en ressources de tout le site — sur un profil d'appareil (téléphone ancien, public familial non technique probable) où ce risque est le plus élevé.

## Observations mineures

- CSS mort livré sur chaque page : `.hero`, `.hero-ghost`, `.hero-content`, `.marquee`/`.marquee-track` — aucun template n'émet plus ces classes.
- `.callout--warn` a le même poids visuel pour l'avertissement le plus important de la page RCH (« À lire avant tout ») et pour un rappel diététique secondaire plus bas — dilue le signal de l'avertissement principal.
- Easing `outBack` (léger rebond) sur la cascade des logos du CV (`animations.js`, `staggerLogos`) — petit décalage de ton dans un CV par ailleurs formel/conseil en entreprise.
- `.hero-scroll` (indice « défiler ») est masqué en mobile (`display:none` à 768px) sans substitut — perte du seul indice explicite « il y a du contenu en dessous » sur mobile.
- Les liens de citation (`sup a`) sautent vers `.source-list` mais aucune entrée n'offre de retour vers le point de lecture — retour navigateur ou re-scroll manuel uniquement.
- 4 occurrences de `side-tab` détectées (blockquotes + rails de timeline) jugées faux positifs après vérification — pas d'action nécessaire.

## Questions à considérer

1. Rendre le nom du site cliquable romprait-il vraiment le principe « partage cloisonné », ou ce principe visait-il seulement l'absence d'un header-sitemap permanent, pas l'absence de tout chemin de retour ? Vaut le coup d'être tranché explicitement plutôt que laissé comme effet de bord d'un `<span>` non lié.
2. Le shader « ethereal » a déjà causé une vraie régression de performance mesurée (documentée dans les commentaires du code lui-même) et nécessite trois mitigations distinctes pour rester supportable. Face à l'objectif « classe, moderne, ressources minimales » : un dégradé animé en CSS pur capturerait-il 80 % de l'ambiance visuelle pour un coût JS quasi nul, libérant le budget « effet coûteux » pour autre chose de plus distinctif ailleurs ?
3. `maladie.html` ouvre sur une métaphore viking et se ferme sur une invitation email personnelle — fort, et ça sert deux lecteurs très différents à la fois (quelqu'un qui vient de chercher ses symptômes à 3h du matin, effrayé ; quelqu'un qui connaît déjà Pierre et prend des nouvelles). Est-ce l'intention de servir les deux depuis une seule page linéaire, ou la version la plus anxieuse de ce lecteur serait-elle mieux servie par un chemin plus rapide vers la réassurance, plus haut dans la page ?
