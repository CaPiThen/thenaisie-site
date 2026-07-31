---
registre: learnings
id_format: LRN-XXX
description: Patterns observés à réutiliser ou à surveiller sur le projet thenaisiepierre.fr.
champs:
  - id: identifiant unique LRN-XXX
  - date: AAAA-MM-JJ
  - pattern: ce qui a été observé, formulé comme un principe réutilisable
  - contexte: la situation concrète qui a révélé le pattern
  - application_future: comment s'en servir la prochaine fois
---

# Learnings — thenaisiepierre.fr

## Index

| ID | Date | Pattern |
|---|---|---|
| LRN-001 | 2026-07-21 | Mesurer le contraste en composant réellement shader + voile + carte, jamais « à l'œil » |
| LRN-002 | 2026-07-20 | Toujours nettoyer `output/` avant un rebuild Pelican |
| LRN-003 | 2026-07-22 | Valider une animation JS sur son état intermédiaire, pas seulement avant/après |
| LRN-004 | 2026-07-22 | Calibrer un filtre SVG (feColorMatrix) sur la vraie distribution des valeurs, jamais en théorie |
| LRN-005 | 2026-07-22 | La largeur réelle du texte peut dépasser largement l'hypothèse de mise en page d'origine |
| LRN-006 | 2026-07-22 | Une config d'animation correcte peut sembler « lente » à cause du coût de rendu réel, pas de la config |
| LRN-007 | 2026-07-22 | L'onglet de l'outil de prévisualisation ne passe jamais réellement au premier plan (document.hidden reste vrai) |
| LRN-008 | 2026-07-22 | `scroll-behavior: smooth` casse le calcul de position de GSAP ScrollTrigger |
| LRN-009 | 2026-07-22 | `perspective`/`transform` sur un ancêtre change le bloc de positionnement d'un `position:fixed` descendant |
| LRN-010 | 2026-07-22 | Une couleur dupliquée en `rgba()` littéral se désynchronise silencieusement de sa variable CSS |
| LRN-011 | 2026-07-24 | Avec `RELATIVE_URLS=True`, Pelican réécrit `SITEURL` en chemin relatif par page — inutilisable pour canonical/Open Graph |
| LRN-012 | 2026-07-24 | Toujours faire un vrai build (pas juste relire le template) après un changement de gabarit Jinja |
| LRN-013 | 2026-07-24 | Un fetch() client-side vers un service auto-hébergé peut être bloqué par CORS même si l'URL répond bien en curl/serveur à serveur |
| LRN-014 | 2026-07-24 | Un Cloudflare/WAF devant un service auto-hébergé peut bloquer les requêtes sans User-Agent de navigateur, sans rapport avec les identifiants |
| LRN-015 | 2026-07-24 | Avant de reconvertir un effet JS/lib en vanilla, vérifier si un repli ou un équivalent existe déjà ailleurs dans le repo |
| LRN-016 | 2026-07-24 | La règle détecteur `em-dash-overuse` compte le texte visible de toute la page, pas seulement la prose : trier structurel/citation vs prose avant de corriger |
| LRN-019 | 2026-07-24 | `pathLength="1"` sur un `<path>`/`<line>` SVG rend stroke-dasharray/dashoffset indépendants de la géométrie réelle : évite tout calcul JS pour un tracé animé |
| LRN-020 | 2026-07-24 | Un état masqué CSS ne doit jamais viser un sélecteur nu si seul le JS sait le révéler : le scoper sous une classe que le JS ajoute lui-même, sinon l'absence de JS laisse l'élément invisible au lieu de visible par défaut |
| LRN-017 | 2026-07-24 | Forcer un reflow synchrone (lecture layout) plutôt qu'un double rAF pour fiabiliser une transition CSS déclenchée depuis un callback IntersectionObserver |
| LRN-018 | 2026-07-24 | Le texte `<img>` dans un commentaire CSS déclenche un faux positif `broken-image` du détecteur (scan texte, pas parsing HTML réel) |
| LRN-022 | 2026-07-25 | `curl` nu reçoit un 403 de Cloudflare sur thenaisiepierre.fr — un User-Agent de navigateur suffit à passer, permettant de vérifier le site déployé directement plutôt que de deviner |
| LRN-023 | 2026-07-25 | Un dégradé confiné à une petite plage de % (ex. 90%→100%) lit comme une coupure nette, même si le point de départ doit rester fixe (contrainte de contraste) — adoucir avec un palier intermédiaire plutôt que déplacer le point de départ (correctif partiel, voir mise à jour et LRN-024) |
| LRN-024 | 2026-07-25 | `chromium --headless --screenshot=...` s'installe via `apt-get` dans ce sandbox — capture d'écran réelle possible pour la première fois du projet, à utiliser systématiquement pour vérifier un correctif visuel avant de le livrer |
| LRN-025 | 2026-07-30 | GitHub Pages + Cloudflare : TOUS les enregistrements DNS du domaine doivent être en DNS-only, un seul en « Proxied » suffit à bloquer l'émission du certificat — les nouveaux enregistrements Cloudflare démarrent Proxied par défaut, facile à manquer en en ajoutant à un jeu déjà partiellement DNS-only |
| LRN-026 | 2026-07-30 | `dig +short <domaine> @1.1.1.1`/`@8.8.8.8` + `openssl s_client -connect <domaine>:443 -servername <domaine> \| openssl x509 -noout -subject -issuer -dates` vérifient DNS et certificat TLS réels sans dépendre du cache du navigateur ni des délais d'affichage des interfaces GitHub/Cloudflare |
| LRN-027 | 2026-07-31 | `chromium --headless --screenshot` sur une page fraîche peut capturer un `.reveal` (callout/prose/etc.) mi-fondu, avant que l'IntersectionObserver l'ait rendu visible — ajouter `--force-prefers-reduced-motion` pour obtenir l'état final immédiatement |
| LRN-028 | 2026-07-31 | GitHub Pages sert HTML et assets avec `cache-control: max-age=600` — un rechargement côté utilisateur dans les ~10 min suivant un push peut afficher l'ancienne version même si le déploiement est déjà terminé ; confirme LRN-022 sous la nouvelle infra |

## Entrées

### LRN-001 — Mesurer le contraste en composant réellement les couches

**Date :** 2026-07-21
**Pattern observé :** Sur un fond animé (shader), la lisibilité d'un texte ne peut pas s'évaluer visuellement à un instant donné — le rendu change en continu. Un premier essai de carte en « verre clair » semblait juste à l'œil, mais recomposé pixel par pixel (shader + voile + verre, sur 12 instants d'animation), le texte tombait à 3,83:1, sous le seuil AA de 4,5:1.
**Contexte :** Fusion du sommaire de l'accueil dans le hero à shader (BDR-002). Le passage à un verre **sombre** a corrigé le problème (13,17:1 / 8,65:1).
**Application future :** Pour tout élément de texte posé sur un fond animé ou semi-transparent, toujours recompiler le shader hors-ligne, échantillonner les pixels sur plusieurs instants de `u_time`, et calculer le ratio de contraste réel avant de valider visuellement. Ne jamais se fier à une seule capture.

### LRN-002 — Toujours nettoyer `output/` avant un rebuild Pelican

**Date :** 2026-07-20
**Pattern observé :** Pelican ne supprime pas les fichiers générés à partir de contenu source supprimé entre deux builds. Après suppression d'articles, les anciennes pages HTML restaient servies (contenu obsolète, liens vers du contenu qui n'existe plus en source).
**Contexte :** Suppression des articles du journal et de la page « Blog » — l'ancien contenu restait visible tant qu'un `rm -rf output` n'avait pas été fait avant `pelican content`.
**Application future :** Après toute suppression ou renommage de contenu, faire `rm -rf output` avant de relancer `pelican content -s pelicanconf.py`, sinon des pages fantômes ou des liens morts subsistent silencieusement.

### LRN-003 — Valider une animation JS sur son état intermédiaire

**Date :** 2026-07-22
**Pattern observé :** Vérifier seulement l'état « avant » et l'état « après » d'une animation ne suffit pas à prouver qu'elle anime réellement — un bug pourrait sauter directement à l'état final sans transition, et le test avant/après ne le verrait pas. Un onglet de test réutilisé a aussi donné un faux résultat (élément déjà « animé » avant même le déclenchement), dû à un état résiduel du panneau de test (voir BLK-002), pas à un bug réel — repéré uniquement parce qu'un nouvel onglet propre donnait un résultat différent.
**Contexte :** Vérification du tracé SVG (Anime.js `createDrawable`) et du compteur numérique sur la page Maladie.
**Application future :** Toujours échantillonner un état intermédiaire (à mi-durée de l'animation) en plus de l'avant/après, et en cas de résultat qui semble déjà « acquis » avant tout déclenchement, retester dans un onglet fraîchement ouvert avant de conclure à un bug du site.

### LRN-004 — Calibrer un filtre SVG sur la vraie distribution des valeurs

**Date :** 2026-07-22
**Pattern observé :** Deux pièges distincts en calibrant un `feColorMatrix` sur un bruit `feTurbulence` : (1) les filtres SVG opèrent par défaut en espace **linearRGB**, pas sRGB — une couleur configurée `79,191,106` sortait rendue `151,224,173` (bien plus claire), un décalage de gamma totalement imprévisible sans le savoir. Correction : attribut `color-interpolation-filters="sRGB"` sur le `<filter>`. (2) Un calcul théorique du poids/biais nécessaire (« chaque canal de bruit doit faire ~0,5 en moyenne ») s'est avéré faux d'un facteur ~3 — la vraie somme de 3 canaux de bruit ne variait qu'entre 0,86 et 1,70, pas 0 à 3. Un premier essai basé sur la théorie a donné une opacité quasiment constante (variance de 5 sur 255 seulement).
**Contexte :** Recalibrage du fond « ethereal » (BDR-004) pour un mouvement bien plus visible, demandé par Pierre.
**Application future :** Toujours (a) fixer `color-interpolation-filters="sRGB"` sur tout filtre où la couleur exacte compte, et (b) rendre et échantillonner la distribution RÉELLE de la valeur à calibrer (ici : rasteriser le bruit brut dans un canvas et lire l'histogramme des pixels) avant de calculer des coefficients — jamais déduire une plage de valeurs par hypothèse théorique.

### LRN-005 — La largeur réelle du texte peut dépasser l'hypothèse de mise en page

**Date :** 2026-07-22
**Pattern observé :** Le voile de contraste des bandeaux à shader (`.shader-scrim`) supposait que le texte restait dans les premiers 58 % de la largeur (hérité d'une mise en page antérieure). Mesuré en vrai sur `.page-header h1` (qui utilise `clamp(…, 9vw, 124px)`) : le texte s'étend jusqu'à 88-90 % de la largeur du conteneur selon la taille d'écran (pic vers 1440px, avant que le `clamp` plafonne la taille de police). Une bonne partie du texte se trouvait donc dans la zone où le voile s'allégeait — contraste réel 3,17:1, sous le seuil AA, alors que la zone « supposée sûre » mesurait 5,53:1.
**Contexte :** Recalibrage du voile après le passage aux fonds ethereal (BDR-004) — l'ancienne répartition 42%/58% du dégradé venait d'une génération précédente du design (bandeau warp.js) jamais revérifiée après les changements de typographie.
**Application future :** Ne jamais réutiliser l'hypothèse de largeur d'une zone de texte sans la remesurer (`getBoundingClientRect`) sur plusieurs largeurs de viewport réelles (notamment autour du point où un `clamp()` en `vw` cesse de croître) — surtout après un changement de taille de police. Concevoir les dégradés de voile pour rester protecteurs jusqu'à 90-93 % de la largeur, pas 60 %.

### LRN-006 — Une config d'animation correcte peut sembler « lente » à cause du coût de rendu réel

**Date :** 2026-07-22
**Pattern observé :** Pierre trouvait le shader « encore trop lent » alors que `gsap.globalTimeline.getChildren()[i].duration()` confirmait des cycles de 0,45 à 1,1 s — exactement la config voulue. La cause réelle : 4 filtres SVG animés en simultané (bruit + hueRotate + matrice + flou CSS, recalculés à chaque frame) faisaient chuter le navigateur à ~25 fps mesurés. GSAP a par défaut un « lag smoothing » qui, face à des frames manquées, ralentit son horloge interne pour éviter les à-coups — ce qui peut faire paraître une animation bien plus lente que sa config sans que la config soit fautive.
**Contexte :** Recalibrage vitesse + palette noir/blanc/vert du fond ethereal (BDR-005). Avant de conclure que la durée était mal réglée, mesurer le fps réel (`requestAnimationFrame` sur 60-90 frames) a révélé le vrai goulot : le coût de rendu, pas la config.
**Application future :** Quand une animation semble plus lente que sa configuration ne le suggère, mesurer le fps réel avant de retoucher les durées. Si le fps est bas avec plusieurs filtres/effets coûteux animés en simultané, réduire le nombre d'éléments réellement animés (geler ceux qui n'ont pas besoin de bouger) et désactiver `gsap.ticker.lagSmoothing(0)` pour que l'horloge GSAP reste fidèle à la config même sous charge.

### LRN-007 — L'onglet de l'outil de prévisualisation ne passe jamais réellement au premier plan

**Date :** 2026-07-22
**Pattern observé :** Même après `tabs_select` sur l'onglet actif, `document.hidden` reste `true` et `document.visibilityState` reste `'hidden'` dans le navigateur de prévisualisation. Conséquence directe : un `setTimeout(fn, 800)` a mis 12,8 s réel à se déclencher, et `gsap.ticker.frame` n'a avancé que de 4 images sur cette même fenêtre — le navigateur applique son throttling « onglet en arrière-plan » en continu, y compris pendant l'exécution du script de test.
**Contexte :** Tentative de mesurer la vitesse réelle de l'animation ethereal via `requestAnimationFrame`/`setTimeout` dans l'outil de prévisualisation (prolonge BLK-002).
**Application future :** Ne jamais se fier à une mesure de vitesse/temps basée sur `requestAnimationFrame`, `setTimeout` ou le temps interne de GSAP à travers cet outil — le throttling d'arrière-plan fausse systématiquement le résultat. Pour vérifier qu'une animation est correctement réglée, interroger directement la configuration (`tween.duration()`, `tween.vars`) plutôt que d'observer son déroulé en temps réel ; pour le rendu visuel, s'en remettre à l'utilisateur testant dans son propre navigateur au premier plan.

### LRN-008 — `scroll-behavior: smooth` casse le calcul de position de GSAP ScrollTrigger

**Date :** 2026-07-22
**Pattern observé :** Un `ScrollTrigger` épinglé (`pin: true`) restait figé à `progress ≈ 0` malgré un `window.scrollTo()` réel (confirmé par `window.scrollY` qui, lui, changeait bien) — jusqu'à découvrir que `html { scroll-behavior: smooth }` était déclaré globalement (pour les liens d'ancre comme `#sommaire`). Ce réglage anime le défilement natif du navigateur dans le temps, ce qui interfère avec le calcul de position de ScrollTrigger — un conflit explicitement documenté par GSAP lui-même, pas une hypothèse.
**Contexte :** Mise en place du flip 3D hero/sommaire de l'accueil (BDR-013), premier test du `progress` d'un ScrollTrigger épinglé.
**Application future :** Avant d'installer GSAP ScrollTrigger sur un projet existant, vérifier si `scroll-behavior: smooth` est déclaré quelque part (souvent sur `html` ou `body` pour des ancres) et le retirer — ScrollTrigger ne doit jamais cohabiter avec un défilement natif animé. Si un scroll animé vers une ancre reste nécessaire, utiliser `ScrollToPlugin` de GSAP plutôt que le CSS natif.

### LRN-009 — `perspective`/`transform` sur un ancêtre change le bloc de positionnement d'un `position:fixed` descendant

**Date :** 2026-07-22
**Pattern observé :** Le fond ethereal de l'accueil (`.mesh-holder`, `position:fixed`, censé rester calé sur le viewport) était initialement un descendant du hero — jusqu'à ce que le hero soit englobé dans un conteneur portant `perspective` (pour le flip 3D, BDR-013). `perspective` (comme `transform`, `filter`, `will-change` nommant ces propriétés, ou `contain`) fait qu'un élément devient le bloc de positionnement de référence pour ses descendants `position:fixed` — le fond ethereal se serait alors calé sur ce conteneur plutôt que sur le viewport, cassant l'effet immersif dès que le conteneur défile.
**Contexte :** Structuration du `.flip-stage` pour le flip 3D hero/sommaire — un commentaire existant dans le CSS avertissait déjà de ce risque pour tout futur ajout de `transform` sur un ancêtre, avant même que ce cas concret ne se présente.
**Application future :** Avant d'ajouter `perspective`, `transform`, `filter` ou `will-change` sur un élément, vérifier qu'aucun descendant `position:fixed` n'en dépend pour rester calé sur le viewport — au besoin, sortir cet élément fixe pour en faire un frère plutôt qu'un descendant du conteneur transformé. Vérifier après coup avec `getBoundingClientRect()` que l'élément fixe reste bien à `{top:0, left:0}` quel que soit le défilement.

### LRN-010 — Une couleur dupliquée en `rgba()` littéral se désynchronise silencieusement de sa variable CSS

**Date :** 2026-07-22
**Pattern observé :** `--sable-fonce` avait été éclairci de `#d8c3a0` à `#e6d2b0` (BDR-012), mais plusieurs règles utilisant une version semi-transparente de cette couleur (`.hero-sub`, `.btn-verre`, `.picto`, les lueurs `.deco-layer`, `.hero-scroll`) étaient écrites en `rgba(216, 195, 160, X)` littéral — la variable ne pouvant pas s'interpoler directement dans `rgba()` sans une variable « -rgb » dédiée, ces valeurs avaient été dupliquées à la main lors de leur création puis jamais remises à jour au changement suivant de la variable. Le bug est resté invisible plusieurs tours de retouche (BDR-012 puis nouvelle demande) avant d'être repéré par un `grep` systématique des anciennes valeurs.
**Contexte :** Nouveau resserrage de `--sable-fonce` vers le blanc (BDR-015) — un grep de la valeur RGB précédente a révélé plusieurs occurrences encore sur l'AVANT-dernière valeur, pas la dernière.
**Application future :** Dès qu'une couleur a une variante `rgba()` à opacité variable ET une variable CSS de référence, soit définir une variable compagnon `--xxx-rgb: r, g, b` (utilisable comme `rgba(var(--xxx-rgb), 0.5)`), soit, à défaut, `grep` systématiquement l'ancienne valeur RGB littérale dans tout le fichier avant de considérer un changement de teinte comme terminé — ne jamais supposer qu'éditer la variable seule suffit.

### LRN-011 — `RELATIVE_URLS=True` réécrit `SITEURL` en chemin relatif, par page

**Date :** 2026-07-24
**Pattern observé :** Dans un template Pelican, `{{ SITEURL }}` n'est PAS toujours la valeur littérale du `pelicanconf.py` : si `RELATIVE_URLS = True` (le cas ici), Pelican recalcule `SITEURL` pour chaque fichier de sortie et le remplace par un chemin relatif vers la racine du site (`.`, `..`, etc. — voir `pelican/writers.py`, fonction `_get_localcontext`). Une balise `og:url`/`og:image`/`canonical` écrite avec `{{ SITEURL }}` sort donc comme `../pages/cv.html` au lieu de `https://thenaisiepierre.fr/pages/cv.html` — invalide pour ces usages qui exigent une URL absolue. Le bug ne se serait jamais vu à la simple lecture du template ; seul un vrai build l'a révélé (voir LRN-012).
**Contexte :** Ajout des balises Open Graph/Twitter Card et du lien canonical (BDR-020).
**Application future :** Pour toute donnée qui doit rester une URL absolue quel que soit `RELATIVE_URLS` (canonical, Open Graph, Twitter Card, JSON-LD, flux), définir une variable dédiée non réservée par Pelican (ex. `SITE_ABSOLUTE_URL`) plutôt que `SITEURL` — Pelican ne réécrit que les noms qu'il reconnaît (`SITEURL`, `localsiteurl`), un nom custom traverse les templates intact.

### LRN-012 — Toujours faire un vrai build après un changement de gabarit Jinja

**Date :** 2026-07-24
**Pattern observé :** La relecture manuelle de `base.html`/`page.html` (blocs, `self.blockname()`, variables) semblait correcte et l'aurait été dans un moteur de templates générique — mais seul un vrai `pelican content` a révélé le comportement spécifique de Pelican sur `SITEURL` (LRN-011). Installer Pelican dans un environnement virtuel dédié (`python3 -m venv` + `pip install pelican markdown`) est rapide (quelques secondes) et ne modifie rien au projet lui-même.
**Contexte :** Vérification de bout en bout de tous les changements de gabarit de cette session (favicon/Open Graph, galerie Immich, polices).
**Application future :** Après tout changement touchant `base.html` ou les gabarits hérités, lancer un build Pelican réel (venv jetable si l'outil n'est pas déjà installé) plutôt que de se fier à une relecture, même attentive — les mécanismes propres à Pelican (réécriture d'URL, contexte local par fichier) ne sont pas devinables depuis le seul code du template.

### LRN-013 — Un fetch() client-side peut échouer même si l'URL répond bien en curl

**Date :** 2026-07-24
**Pattern observé :** `curl https://photos.thenaisiepierre.fr/api/shared-links/me?slug=...` répond `200` avec le JSON attendu — mais un `fetch()` fait depuis le JavaScript d'une page servie sur un AUTRE domaine (`thenaisiepierre.fr`) aurait échoué silencieusement : la réponse ne contenait aucun en-tête `Access-Control-Allow-Origin`, même en envoyant explicitement un en-tête `Origin`. curl/serveur-à-serveur n'est jamais soumis à CORS (c'est une politique appliquée par le navigateur, pas par le réseau) ; seul un test depuis un vrai contexte cross-origin (ou en vérifiant l'en-tête directement) le révèle.
**Contexte :** Conception de la galerie Immich (BDR-019) — la première version prévoyait un fetch côté navigateur, jamais testée en conditions réelles avant que Pierre ne fournisse un vrai lien de partage.
**Application future :** Avant de concevoir une intégration qui fait un `fetch()` client-side vers un domaine différent de celui du site, vérifier la présence de `Access-Control-Allow-Origin` dans la réponse (`curl -H "Origin: https://le-site.example" -D -`) — un `200` en curl nu ne prouve rien sur la faisabilité côté navigateur. Si absent et hors de contrôle (service tiers ou auto-hébergé sans réglage CORS accessible), préférer une récupération côté build/serveur : le HTML généré peut ensuite charger des images via `<img src>` sans jamais être concerné par CORS.

### LRN-014 — Un WAF peut bloquer un script selon son User-Agent, sans rapport avec les identifiants

**Date :** 2026-07-24
**Pattern observé :** Le script Python (`urllib`, User-Agent par défaut `Python-urllib/3.13`) recevait `403 Forbidden` sur une requête que curl (et un vrai navigateur) réussissaient sans problème sur la même URL avec les mêmes paramètres. La cause n'était ni l'identifiant de partage ni un problème réseau, mais Cloudflare (devant l'instance Immich) filtrant sur le User-Agent — un en-tête `User-Agent` de navigateur classique a suffi à faire passer la requête.
**Contexte :** Premier test de `build_gallery.py` contre le lien réel fourni par Pierre — le script échouait avec un message d'erreur générique (« partage injoignable ») qui aurait pu à tort faire conclure à un mauvais paramètre `slug`/`key` plutôt qu'à un blocage réseau en amont.
**Application future :** Quand un script serveur échoue à joindre une URL qui répond pourtant via curl/navigateur, comparer d'abord les en-têtes envoyés (User-Agent en premier lieu) avant de remettre en cause la logique métier (identifiants, paramètres) — un `Request` avec un en-tête `User-Agent` de navigateur classique lève souvent ce genre de blocage WAF/Cloudflare, fréquent devant les services auto-hébergés exposés au public.

### LRN-015 — Vérifier l'existant avant de reconvertir un effet en vanilla

**Date :** 2026-07-24
**Pattern observé :** En retirant GSAP/Anime.js (BDR-024), deux des quatre effets JS avaient déjà un équivalent dans le repo : `ethereal.js` avait déjà un repli `requestAnimationFrame` fonctionnel écrit lors du calibrage de BDR-005 (jamais utilisé en pratique tant que GSAP était présent) ; `.cv-entry` (conteneur des logos du CV) était déjà dans la liste `.reveal` de `base.html`, qui l'animait donc déjà indépendamment de la cascade dédiée d'Anime.js. Seul le tracé SVG (effet réellement unique) a nécessité du nouveau code.
**Contexte :** Retrait de dépendances demandé par une critique de poids/performance (`/impeccable optimize`), sur un projet qui a une longue habitude de réimplémentation vanilla (BDR-002/003).
**Application future :** Avant d'écrire un remplacement vanilla pour un effet piloté par une lib à retirer, grep le reste du CSS/JS du projet pour un pattern ou un repli déjà existant qui couvre le même besoin — surtout sur un projet qui documente déjà ce genre de repli dans ses propres commentaires.

### LRN-016 — `em-dash-overuse` compte tout le texte visible, pas seulement la prose

**Date :** 2026-07-24
**Pattern observé :** La règle détecteur du skill impeccable (`checkEmDashOveruseDOM`) mesure les tirets cadratins sur `document.body.innerText` entier — plages de dates (`Décembre 2025 — aujourd'hui`), paires employeur/lieu (`PwC — Neuilly-sur-Seine`) et titres de citations bibliographiques (`INSERM — Dossier «...»`) comptent autant qu'un tiret dans une phrase de prose, alors que seule la prose porte réellement la « cadence IA » signalée par la règle. Sur `cv.md`, 28 tirets au total se répartissaient en 13 structurels (jamais à toucher, convention typographique standard) et 15 dans la prose/labels.
**Contexte :** Réduction de la densité de tirets cadratins (BDR-028) suite à un finding `em-dash-overuse` du détecteur.
**Application future :** Avant de corriger un finding `em-dash-overuse`, énumérer chaque occurrence avec son contexte (pas juste le compte total) et classer structurel (dates, paires label/valeur, titres de citation) vs prose narrative — ne retoucher que la seconde catégorie, puis revérifier avec le détecteur que le plancher (8) et la densité sont bien repassés sous le seuil.

### LRN-019 — `pathLength` élimine le calcul JS pour un tracé SVG animé

**Date :** 2026-07-24
**Pattern observé :** Une première tentative d'animer le tracé des schémas RCH en vanilla (retrait d'Anime.js, BDR-024) calculait `getTotalLength()` en JS puis manipulait `stroke-dasharray`/`stroke-dashoffset` par script, avec un reflow forcé pour fiabiliser la transition. Signalée cassée deux fois par Pierre malgré un premier durcissement. L'attribut SVG natif `pathLength="1"`, posé directement dans le HTML, redéfinit l'unité dans laquelle `stroke-dasharray`/`stroke-dashoffset` s'expriment pour cet élément : peu importe la longueur géométrique réelle du tracé, `1` représente toujours « le tracé complet ». Ça permet d'écrire l'animation entièrement en CSS statique (dasharray:1, dashoffset:1 → 0), sans jamais appeler `getTotalLength()` ni manipuler de style inline en JS.
**Contexte :** Deuxième récidive du bug d'animation des schémas RCH (voir BDR-034), après une première tentative de durcissement de la technique JS qui n'a apparemment pas suffi.
**Application future :** Pour tout tracé SVG à animer en dessin progressif, poser `pathLength="1"` sur l'élément dans le HTML et écrire tout le dasharray/dashoffset en CSS statique plutôt que de calculer la longueur réelle en JS — élimine une classe entière de bugs de timing (reflow forcé, `getTotalLength()` qui échoue, race conditions). Le JS n'a plus qu'à ajouter/retirer des classes pour déclencher la transition.

### LRN-020 — Un état masqué ne doit jamais viser un sélecteur nu si seul le JS le révèle

**Date :** 2026-07-24
**Pattern observé :** En réécrivant l'animation des schémas en CSS pur (LRN-019), un premier jet posait l'état masqué (`stroke-dashoffset:1`) directement sur `.figure .svg-colon` etc. — un sélecteur qui s'applique **toujours**, JS ou pas. Repéré avant déploiement : si `animations.js` ne charge pas (erreur réseau, bloqueur, script cassé), rien n'ajoute jamais la classe `.in` qui révèle le tracé — les schémas resteraient invisibles en permanence, une dégradation strictement pire que l'ancien comportement (« déjà tracé si le JS ne charge pas »). Le système `.reveal`/`.in` déjà existant dans `base.html` évite ce piège par construction : la classe `.reveal` elle-même n'est ajoutée QUE par JS (`el.classList.add('reveal')`), jamais câblée en dur dans le CSS ou le HTML — sans JS, aucun élément ne porte jamais `.reveal`, donc rien n'est jamais masqué.
**Contexte :** Réécriture du tracé des schémas RCH en CSS pur (BDR-034), en s'inspirant a posteriori du pattern déjà utilisé par `.reveal`/`.in`.
**Application future :** Pour toute animation d'entrée pilotée par JS (reveal au scroll, tracé, etc.), l'état CSS masqué doit toujours être scopé sous une classe que le JS ajoute lui-même en premier (ex. `.figure.draw .svg-colon`, jamais `.figure .svg-colon` seul) — jamais sur le sélecteur de base. Vérifier systématiquement : « si ce script ne charge pas, qu'est-ce que l'utilisateur voit ? » doit toujours être « l'état final normal », jamais un état intermédiaire masqué.

### LRN-021 — Sans accès navigateur, un rapport utilisateur répété prime sur un raisonnement de robustesse théorique

**Date :** 2026-07-24
**Pattern observé :** L'animation du tracé des schémas RCH a été réécrite trois fois dans la même session (getTotalLength+reflow forcé → pathLength+transition CSS déclarative → pathLength+rAF impératif), chaque fois en raisonnant sur la robustesse théorique de la technique sans jamais pouvoir vérifier en navigateur réel. La deuxième réécriture (CSS pur) avait été choisie précisément parce qu'elle éliminait *en théorie* toute la classe de bugs de timing de la première — et a quand même été rapportée cassée. Le raisonnement théorique ne remplace pas un test réel, et un rapport répété du même symptôme après un changement de mécanisme complet est un signal fort qu'il faut changer de famille de solution plutôt que de continuer à perfectionner un raisonnement qu'on ne peut pas vérifier.
**Contexte :** Trois itérations consécutives sur la même animation (BDR-024 → BDR-034 → BDR-036), sans outil de capture navigateur disponible à aucun moment de la session.
**Application future :** Face à un rapport de bug répété sur un effet déjà « corrigé » une fois sans accès aux outils de vérification (navigateur, capture d'écran), ne pas retenter une variante de la même approche en espérant un meilleur résultat — changer de mécanisme fondamentalement différent (ici : transition CSS déclarative → boucle JS impérative) augmente les chances qu'un problème spécifique à une famille de technique (quelle qu'elle soit) ne se reproduise pas. Faire confiance au rapport direct et répété de l'utilisateur plutôt qu'à l'estimation théorique de fiabilité d'une technique non testée.

### LRN-022 — `curl` nu bloqué par Cloudflare sur thenaisiepierre.fr ; un User-Agent de navigateur suffit

**Date :** 2026-07-25
**Pattern observé :** Après un signalement de Pierre (« je ne vois pas toutes les animations, ni les points d'accueil » suite à un push), `curl -sI https://thenaisiepierre.fr/` sans en-tête renvoie un `403` de Cloudflare (`server: cloudflare`, page de challenge) — le domaine est en réalité proxifié par Cloudflare devant l'hébergement OVH, invisible jusqu'ici. Avec un `User-Agent` de navigateur classique, la même requête passe (`200`), révélant un outil de vérification directe du site déployé qui n'avait jamais été disponible plus tôt dans le projet (tout le travail précédent sur ce site avait été fait à l'aveugle, sans jamais pouvoir confirmer un rendu réel — voir LRN-021). Utilisé pour comparer le HTML/CSS/JS réellement servis en ligne au code local commité : tout s'est révélé strictement identique (mêmes octets), y compris la version de cache-busting (`?v=bf2b133`, le SHA du commit le plus récent) — le déploiement était donc correct à 100 %, contredisant l'hypothèse d'un bug de code ou de déploiement.
**Contexte :** Diagnostic du signalement de Pierre juste après un `git push` ; jusque-là aucune vérification en ligne n'avait été possible de toute la session (répété comme limitation dans BDR-030 à BDR-039).
**Application future :** Pour tout futur signalement « je ne vois pas X en ligne » sur ce site, vérifier D'ABORD le contenu réellement déployé via `curl -A "<UA navigateur>" <url>` avant de supposer un bug de code — si le HTML/CSS/JS servi est correct et à jour (version de cache-busting comprise), le problème est côté client (cache navigateur, pas encore rafraîchi) plutôt que côté site, et aucune modification de code n'est nécessaire.

### LRN-023 — Un dégradé confiné à une petite plage lit comme une coupure, pas un fondu

**Date :** 2026-07-25
**Pattern observé :** `.shader-scrim` (voile sombre sur les bandeaux de page) passait de 0.68 à 0.26 d'opacité entre 90% et 100% de la largeur — une chute de 0,42 concentrée sur seulement 10% de la largeur du bandeau. Signalé par Pierre comme « un décalage de couleur bizarre », pas comme un fondu perçu. Le point de départ à 90% était une contrainte réelle (le titre s'étend jusqu'à 90,6% de la largeur à 1440px, un départ plus précoce faisait tomber le texte sous le seuil de contraste AA) — donc on ne pouvait pas simplement étaler le dégradé sur une plage plus large en le faisant démarrer plus tôt.
**Contexte :** Correctif du voile de `.page-hero` (CV/RCH/Galerie), après capture d'écran de Pierre montrant la coupure.
**Application future :** Quand un dégradé doit rester ancré à un point de départ fixe (contrainte de contraste, de mise en page, etc.) mais que l'amplitude du changement sur la plage restante est grande, ajouter un ou plusieurs paliers intermédiaires plutôt qu'un seul saut linéaire — répartit la même variation totale sur plus de « marches », perçue comme un fondu progressif plutôt qu'une coupure nette, sans jamais déplacer le point de départ contraint.
**Mise à jour (même jour, après capture d'écran réelle) :** Ce correctif était réel mais insuffisant — Pierre a signalé le même symptôme après déploiement. Une capture d'écran (voir LRN-024) a montré que la tache claire n'était pas un artefact du dégradé du voile mais une variance naturelle du bruit `feTurbulence` du shader lui-même, plus large et plus organique (en tache, pas en bande verticale nette) que la zone du dégradé. Le dégradé n'était qu'une partie du problème. Voir BDR-048 pour le correctif final (voile uniforme, sans dégradé).

### LRN-024 — `chromium --headless --screenshot` disponible dans ce sandbox : vérification visuelle réelle enfin possible

**Date :** 2026-07-25
**Pattern observé :** Face à un deuxième signalement du même bug visuel après un correctif jugé suffisant sans jamais avoir pu le vérifier en navigateur (toute la session, et tout le projet jusqu'ici, reposait sur une lecture de code seule — répété comme limitation dans BDR-030 à BDR-039, LRN-021), tenté `apt-get install -y chromium` : disponible et installable sans droits particuliers dans ce sandbox (déjà root). `chromium --headless --disable-gpu --no-sandbox --hide-scrollbars --window-size=LxH --screenshot=<fichier> <url>` produit un vrai PNG du rendu, y compris pour le site déployé en HTTPS (avec un `--user-agent` de navigateur si Cloudflare bloque, comme pour `curl`, voir LRN-022) et pour un site servi localement (`python3 -m http.server` sur le dossier `output/` d'un build Pelican). Les erreurs `dbus`/`org.freedesktop.DBus` dans la sortie sont du bruit sans conséquence (pas de session D-Bus dans ce sandbox), le screenshot se génère correctement malgré elles. Utilisé pour confirmer que le premier correctif du voile (LRN-023) était insuffisant, identifier la vraie cause (bruit du shader, pas le dégradé), tester un deuxième correctif localement AVANT de le livrer, et le confirmer visuellement sur les 3 pages secondaires + mobile.
**Contexte :** Deuxième signalement de Pierre sur `.shader-scrim` après un premier correctif livré sans vérification visuelle possible.
**Application future :** Pour tout correctif visuel sur ce projet à partir de maintenant, NE PLUS se contenter d'une lecture de CSS/HTML pour valider un résultat perceptif (couleur, alignement, contraste) — installer chromium si absent (`apt-get install -y chromium`, rapide, pas de dépendance Python comme playwright/selenium) et prendre un vrai screenshot (site déployé via `curl`-style UA, ou build local servi en HTTP) avant de déclarer un correctif terminé. Change fondamentalement la méthodologie de tout ce projet par rapport à toutes les sessions précédentes.

### LRN-025 — GitHub Pages + Cloudflare : un seul enregistrement « Proxied » bloque tout le domaine

**Date :** 2026-07-30
**Pattern observé :** Pendant la migration OVH → GitHub Pages (BDR-049), Pierre a mis tous ses enregistrements DNS visibles en « DNS uniquement » (nuage gris) suite à une première instruction, mais GitHub continuait de refuser d'émettre le certificat HTTPS (servait le certificat générique `*.github.io`). Diagnostic à distance (`dig +short thenaisiepierre.fr @1.1.1.1` et `@8.8.8.8`) : le domaine résolvait vers des IPs Cloudflare (`104.21.x.x`/`172.67.x.x`), pas vers les IPs GitHub — au moins un enregistrement A restait donc en « Proxied » malgré ce qui semblait avoir été corrigé. Cause probable : Cloudflare met les enregistrements A **nouvellement créés** en « Proxied » par défaut, y compris quand on complète un jeu d'enregistrements déjà partiellement en DNS-only pour le même nom — facile à manquer si on ne revérifie pas chaque ligne individuellement après ajout.
**Contexte :** Migration GitHub Pages, 4 enregistrements A requis sur l'apex (185.199.108/109/110/111.153).
**Application future :** Après toute modification d'enregistrements DNS Cloudflare pour un domaine pointant vers GitHub Pages (ou tout hébergeur nécessitant du DNS-only pour la validation ACME), revérifier individuellement le nuage (gris/orange) de CHAQUE enregistrement du nom concerné, pas seulement ceux qu'on a explicitement édités — un ajout peut réintroduire un enregistrement proxifié dans un jeu par ailleurs correct. Vérifier ensuite par `dig` sur un résolveur public plutôt que de se fier à l'interface Cloudflare seule.

### LRN-026 — Vérifier DNS et certificat TLS réels en ligne de commande, pas via les interfaces

**Date :** 2026-07-30
**Pattern observé :** Pendant le diagnostic du blocage de certificat (LRN-025), les interfaces GitHub Pages et Cloudflare affichaient des états ambigus ou en retard sur la réalité (« DNS check successful » alors qu'un enregistrement était encore mal configuré ; certificat affiché comme non disponible sans indiquer la cause exacte). Deux commandes ont permis un diagnostic direct et sans ambiguïté : `dig +short <domaine> A @1.1.1.1` (et `@8.8.8.8` en recoupement, pour écarter un effet de cache d'un seul résolveur) pour voir la résolution DNS réelle telle que le monde la voit ; `echo | openssl s_client -connect <domaine>:443 -servername <domaine> 2>/dev/null | openssl x509 -noout -subject -issuer -dates` pour lire le certificat réellement servi (CN, émetteur, validité) sans dépendre du rendu ou du cache d'un navigateur.
**Contexte :** Diagnostic à distance de la migration GitHub Pages, sans accès aux comptes Cloudflare/GitHub de Pierre, uniquement par vérification réseau directe.
**Application future :** Pour tout problème DNS/HTTPS sur ce projet (ou tout domaine géré par Pierre), commencer par ces deux commandes avant de formuler une hypothèse ou de redemander une capture d'écran — elles donnent l'état réel, immédiatement, recoupé sur plusieurs résolveurs, sans dépendre de la fraîcheur d'une interface web.

### LRN-027 — Un screenshot chromium `--screenshot` sur une page fraîche peut capturer un `.reveal` mi-fondu

**Date :** 2026-07-31
**Pattern observé :** En vérifiant le nouveau style du callout RCH (BDR-050) par capture d'écran, le texte apparaissait presque invisible (très faible contraste) alors que le CSS était correct. Cause : `base.html` ajoute `.reveal` (opacity: 0, transition 0.6s) à `.callout`/`.prose`/`.cv-entry`/etc. via un `IntersectionObserver`, qui ne passe à `.in` (opacity: 1) qu'après un scroll/layout réel — `chromium --screenshot` capture juste après l'événement `load`, avant que l'observer ait eu le temps de déclencher la transition CSS, même avec `--virtual-time-budget` élevé (n'accélère pas les transitions CSS liées au compositeur). Résolu en ajoutant le flag `--force-prefers-reduced-motion`, qui active la règle `@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transition: none; } }` déjà présente dans `style.css` — état final immédiat, sans dépendre du timing de l'observer.
**Contexte :** Vérification visuelle du nouveau style `.callout--intro` sur la page RCH (desktop + mobile), premier callout situé juste sous le pli, dans la zone que l'observer devrait normalement révéler quasi instantanément.
**Application future :** Pour toute capture chromium headless sur une page de ce site qui contient un élément `.reveal` (callout, prose, cv-entry, article-card, skills-group, photo-item), ajouter systématiquement `--force-prefers-reduced-motion` à la commande `chromium --headless --screenshot` — sinon le texte capturé peut sembler délavé/invisible pour une raison purement liée au timing de capture, pas au CSS réel.

### LRN-028 — GitHub Pages : `cache-control: max-age=600` peut faire croire qu'un correctif poussé n'a rien changé

**Date :** 2026-07-31
**Pattern observé :** Après le correctif du titre hero mobile (BDR-050), Pierre a signalé « rien n'a changé » alors que le déploiement était déjà terminé et correct. Vérification directe (`curl -A "<UA>" https://thenaisiepierre.fr/theme/css/style.css?v=<sha>`) : le CSS servi en ligne portait déjà le bon `?v=` (le SHA du commit du correctif) et ne contenait plus la règle fautive — le déploiement était donc bien à jour. `curl -sI` a montré `cache-control: max-age=600` sur le HTML ET sur le CSS versionné. Le cache-busting par SHA (`ASSET_VERSION`, voir `pelicanconf.py`) protège contre un ancien `style.css` resservi sous une URL différente, mais pas contre le cas où le navigateur de Pierre a chargé et mis en cache la page `index.html` elle-même (avec l'ancien `?v=`) quelques secondes avant que le nouveau déploiement ne soit en ligne — cette page HTML reste alors valide jusqu'à 10 minutes dans le cache du navigateur.
**Contexte :** Signalement de Pierre juste après un `git push`, probablement avant ou pendant la fin du déploiement GitHub Actions (build + publication prennent 1 à 2 minutes).
**Application future :** Avant de re-diagnostiquer le code suite à un « rien n'a changé » juste après un push, vérifier D'ABORD le contenu réellement servi en ligne (LRN-022) ; si le `?v=` et le contenu sont déjà corrects, expliquer directement à Pierre la fenêtre de cache de 10 minutes de GitHub Pages et recommander un rechargement forcé (fermer l'onglet/l'appli puis rouvrir), plutôt que de supposer un bug de déploiement.
