---
registre: decisions
id_format: BDR-XXX
description: Journal des décisions structurantes prises sur le projet thenaisiepierre.fr — quoi, pourquoi, contre quoi.
champs:
  - id: identifiant unique BDR-XXX (incrémental, jamais réutilisé)
  - date: AAAA-MM-JJ
  - titre: intitulé court de la décision
  - decision: ce qui a été choisi, formulé sans ambiguïté
  - pourquoi: la raison réelle (contrainte, retour utilisateur, incident)
  - alternatives: ce qui a été envisagé et écarté, et pourquoi
  - statut: actif | révisé | abandonné
---

# Décisions — thenaisiepierre.fr

Vitrine personnelle de Pierre : sa vie, son parcours, et les sujets qui l'intéressent (RCH, portfolio technique, galerie).

## Index

| ID | Date | Titre | Statut |
|---|---|---|---|
| BDR-001 | 2026-07-20 | Aucune barre de navigation globale | actif |
| BDR-002 | 2026-07-21 | Shaders WebGL maison plutôt que composants React/Magic MCP | actif |
| BDR-003 | 2026-07-22 | Rester sur Pelican + Anime.js auto-hébergé, pas de migration | actif |
| BDR-004 | 2026-07-22 | Fonds « ethereal » (filtre SVG) au lieu des shaders WebGL warp.js/mesh.js | actif |
| BDR-005 | 2026-07-22 | Ethereal piloté par GSAP, palette noir/blanc + touche de vert, un seul calque animé | révisé |
| BDR-006 | 2026-07-22 | Ethereal : rythme proche de l'origine, palette vert/beige, fond vert forêt (fin du noir) | révisé |
| BDR-007 | 2026-07-22 | Vert du shader ancré sur `--vert` (pied de page), éclairci à la même teinte/saturation | révisé |
| BDR-008 | 2026-07-22 | Shader 100% vert (fin du beige/blanc) : calque mono en `--vert-clair`, accent en vert éclairci | actif |
| BDR-009 | 2026-07-22 | Accueil éclairci (fond `--vert`, voile allégé) ; cartes du sommaire repassées en beige | actif |
| BDR-010 | 2026-07-22 | Règle « beige sur vert » sur toute la page d'accueil ; cadre des cartes rendu invisible | révisé |
| BDR-011 | 2026-07-22 | Beige de l'accueil assombri (`--sable-fonce`) ; bande du séparateur de section rendue invisible | révisé |
| BDR-012 | 2026-07-22 | `--sable-fonce` réclairci, nuances sombres en vert forêt (jamais noir) | révisé |
| BDR-013 | 2026-07-22 | Bloc qui tourne : hero ↔ sommaire liés par un flip 3D épinglé (GSAP ScrollTrigger) | abandonné |
| BDR-014 | 2026-07-22 | Retour à l'empilement simple accueil ; suppression de l'apparition au scroll des cartes du sommaire | actif |
| BDR-015 | 2026-07-22 | `--sable-fonce` reclairci vers le blanc, repris pour les titres de toutes les pages ; barres latérales des callouts RCH retirées | révisé |
| BDR-016 | 2026-07-22 | `--sable-fonce` fixé à la couleur exacte demandée `#ffefcb` | actif |

## Entrées

### BDR-001 — Aucune barre de navigation globale

**Date :** 2026-07-20
**Décision :** Le site n'a pas de menu listant toutes les pages. Chaque page (Parcours, Portfolio, Vivre avec la RCH, Galerie) est volontairement cloisonnée.
**Pourquoi :** Pierre partage des liens différents à des publics différents (ex. un recruteur ne reçoit pas forcément le lien vers la page santé). Il ne veut pas qu'un visiteur découvre facilement les autres sections en naviguant depuis une seule.
**Alternatives envisagées :** Menu classique avec tous les liens en en-tête — écarté car ça va directement à l'encontre de l'objectif de cloisonnement.
**Statut :** actif. Ne pas réintroduire de nav globale sans revalider avec Pierre.

### BDR-002 — Shaders WebGL maison plutôt que composants React

**Date :** 2026-07-21
**Décision :** Les effets visuels demandés depuis 21st.dev (wavy background, wrap-shader, MeshGradient, Velaris) sont systématiquement réimplémentés en GLSL/JS vanilla (`theme/js/warp.js`, `theme/js/mesh.js`) plutôt qu'installés via `npx shadcn add`.
**Pourquoi :** Le site est du Pelican statique (pas de React, Tailwind, TypeScript, ni build). Les composants `@paper-design/shaders-react` sont inutilisables tels quels. Le MCP `@21st-dev/magic` est de plus cassé en amont (voir BLK-001).
**Alternatives envisagées :** Migrer tout le site vers Next.js/React pour profiter des composants du marché — écarté, disproportionné par rapport au besoin (site vitrine statique).
**Statut :** actif. Tout nouveau composant 21st.dev demandé doit suivre ce même chemin : identifier le principe visuel (bruit simplex, mesh gradient…) et le recoder en vanilla.

### BDR-003 — Rester sur Pelican + Anime.js auto-hébergé

**Date :** 2026-07-22
**Décision :** Pour intégrer Anime.js, le site reste sur Pelican. La bibliothèque (UMD minifiée, v4.5.0) est auto-hébergée dans `theme/js/vendor/anime.min.js` plutôt que chargée depuis un CDN.
**Pourquoi :** Pierre avait explicitement autorisé à sortir de Pelican « si ça permet de mieux respecter la taille sur le disque OVH ». Vérifié : Pelican est un outil de build, rien de son installation n'est déployé sur OVH (seul `output/` part en FTP) — donc aucun argument de taille ne justifie une migration. Anime.js pèse 116 Ko (≈40 Ko gzippé), l'intégralité du site généré ne pèse que 300 Ko : négligeable sur un hébergement mutualisé.
**Alternatives envisagées :** Charger Anime.js depuis jsDelivr/unpkg — écarté pour rester cohérent avec la philosophie déjà actée (BDR-002) de ne dépendre d'aucun service tiers au runtime.
**Statut :** actif. Ne pas reproposer de migration hors Pelican pour des raisons de taille — l'argument ne tient pas pour ce projet.

### BDR-004 — Fonds « ethereal » (filtre SVG) au lieu des shaders WebGL

**Date :** 2026-07-22
**Décision :** `warp.js` et `mesh.js` (canevas WebGL, cf. BDR-002) sont supprimés et remplacés partout par `theme/js/ethereal.js` — un fond animé en filtre SVG natif (`feTurbulence` + `feColorMatrix type="hueRotate"` animé), réimplémentation vanilla du composant « Etheral Shadow » de 21st.dev (React + `framer-motion`, écarté pour les mêmes raisons que BDR-002).
**Pourquoi :** Pierre trouvait les shaders WebGL pixellisés, avec un mouvement peu visible et des couleurs trop sombres. Cause racine du pixel : `mesh.js` rendait sur un canevas sous-échantillonné à 45 % de la résolution réelle pour limiter le coût CPU/GPU. Un filtre SVG est rendu nativement à pleine résolution par le moteur du navigateur — plus jamais de sous-échantillonnage.
**Alternatives envisagées :** Augmenter la résolution interne du canevas WebGL existant — écarté, le coût de performance aurait été bien plus élevé qu'un filtre SVG natif pour un résultat toujours en dents de scie sur petits écrans/zoom.
**Statut :** actif. Tout nouveau bandeau/fond animé doit utiliser `.ethereal` (voir LRN-004 pour le calibrage empirique du contraste couleur/opacité et LRN-005 pour la marge de voile texte).

### BDR-005 — Ethereal piloté par GSAP, palette noir/blanc + touche de vert, un seul calque animé

**Date :** 2026-07-22
**Décision :** `ethereal.js` anime désormais la teinte via `gsap.to()` (au lieu d'une boucle `requestAnimationFrame` maison), avec `gsap.ticker.lagSmoothing(0)` désactivé globalement. Chaque zone a deux calques `.ethereal` : un calque **mono** (gris clair/blanc, 205-235/255) qui seul est animé, et un calque `.ethereal--accent` (vert, fusionné en `mix-blend-mode: screen`) **figé** sur un angle de teinte fixe dérivé du seed — il ne bouge pas. Fonds/voiles passés au noir neutre `#0a0a0a`/`rgba(5-6,5-6,5-6,…)` (à la place du vert foncé `#0d2415`).
**Pourquoi :** Pierre demandait (1) un mouvement bien plus rapide et marqué, en utilisant GSAP explicitement plutôt que la boucle maison, et (2) moins de noir dominant, plutôt un style noir/blanc classe avec des touches de vert. Mesure réelle : avec les 2 calques par zone animés simultanément (4 filtres SVG recalculés à chaque frame), le fps tombait à ~25, ce qui déclenchait le lag smoothing de GSAP et ralentissait la vitesse perçue d'un facteur ~3 par rapport à la config (voir LRN-006). Geler le calque accent (pas besoin de bouger pour être visible) divise par ~2 le coût de rendu par zone et laisse le calque mono tourner à la vitesse réellement configurée.
**Alternatives envisagées :** Garder les deux calques animés mais réduire `numOctaves`/la zone de filtre pour limiter le coût — écarté, plus simple et plus sûr de ne pas animer ce qui n'a pas besoin de l'être. Mesurer la vitesse perçue en conditions réelles via l'outil de prévisualisation — écarté, l'onglet ne passe jamais au premier plan dans cet outil (voir LRN-007), rendant toute mesure de temps réel invalide ; vérification faite sur la config GSAP (`tween.duration()`) et sur le contraste/la teinte rendus (rasterisation canvas), pas sur un chronométrage à l'écran.
**Statut :** révisé par BDR-006 le même jour (vitesse jugée trop marquée une fois le vrai fps rétabli, et palette repassée vert/beige à la demande de Pierre). L'architecture (GSAP, `lagSmoothing(0)`, un seul calque animé par zone) reste valable et inchangée — seuls la vitesse et les couleurs ont été retouchées.

### BDR-006 — Ethereal : rythme proche de l'origine, palette vert/beige, fin du noir

**Date :** 2026-07-22
**Décision :** Vitesse : `durationSec = mapRange(speed, 1, 100, 22, 2.2)` (au lieu de `3.2, 0.45`) — un cycle dure maintenant ~4,2s à vitesse 90, contre ~5s pour le tout premier réglage (`26, 2.6`) : environ 15 % plus rapide que l'origine, pas un mouvement effréné. Couleurs : le calque mono passe du blanc/gris à un beige chaud (`--sable-2`, 239,228,213) et le calque accent reste vert (`--vert-clair`, 91,140,62). Tous les fonds/voiles (`.shader-hero`, `.hero-immersif`, `.bande-abstraite`, `.shader-scrim`, `.mesh-veil`, `.home .hub-card`) passent du noir neutre (`#0a0a0a` / rgba(5-6,…)) à un vert forêt très sombre (`#111f16` / rgba(11,20,14,…)) — il n'y a plus aucune valeur de gris/noir neutre dans tout le système de fond ethereal.
**Pourquoi :** Pierre trouvait le rythme (fixé la veille sur `3.2, 0.45`) trop rapide une fois le vrai fps rétabli (voir BDR-005/LRN-006) — il demandait de revenir au rythme de base, en un peu plus rapide seulement. Il demandait aussi de sortir du noir/blanc et d'aller vers un mélange vert/beige, sans aucun noir dans le shader.
**Alternatives envisagées :** Basculer toute la section hero en mode clair (fond beige clair, texte sombre) pour un rendu plus littéralement « beige » — écarté : Pierre a dit « enlever le noir dedans » (dans le shader), pas de refaire toute la charte des héros ; un fond vert forêt très sombre avec un shader beige/vert satisfait la demande sans réécrire toutes les règles de texte blanc du site (risque de casser des lisibilités ailleurs pour un gain non demandé).
**Statut :** révisé par BDR-007 le même jour (couleur du vert accent retouchée, tout le reste — vitesse, fonds, architecture — inchangé). Contraste re-vérifié après ce changement : page-hero (cv/maladie) pire cas 6,0-7,3:1 sur 6 angles à 1440px (texte à 91 % de largeur) ; hero-immersif (accueil), après resserrage du `.mesh-veil` (opacités +0,06 à +0,08), pire cas 5,71:1 partout (contre 4,49:1 avant resserrage, trop proche du seuil AA 4,5:1). Vert et beige confirmés tous deux présents dans le rendu (matrices de sortie vérifiées : 239,228,213 et 91,140,62). Aucune trace de noir dans les fonds calculés (`getComputedStyle` sur les 3 pages : toujours `rgb(17,31,22)`).

### BDR-007 — Vert du shader ancré sur `--vert` (pied de page), éclairci à la même teinte/saturation

**Date :** 2026-07-22
**Décision :** Le calque accent du shader passe de `91,140,62` (proche de `--vert-clair`) à `150,195,155` — calculé en conservant exactement la teinte (127°) et la saturation (27 %) de `--vert` (#2f5233, le vert du bloc de pied de page où figure le nom de Pierre), en augmentant seulement la luminosité (25 % → 68 % en HSL). Le calque mono (beige, `--sable-2`) et tout le reste (vitesse, fonds vert forêt) restent inchangés (BDR-006).
**Pourquoi :** Pierre a désigné explicitement le vert du pied de page (« ce vert avec des nuances plus claires encore ») comme référence, plutôt que le vert du shader existant — il voulait un vert bien plus clair mais dans cette même famille précise, pas une teinte différente.
**Alternatives envisagées :** Éclaircir par simple mélange linéaire vers le blanc (`base + (255-base)*t`) — écarté après calcul : à t=0.6 ça donne `172,186,173`, presque gris (la saturation chute trop vite en interpolation linéaire RGB). Conserver teinte/saturation en HSL et ne monter que la luminosité donne un vert clair qui reste identifiable comme « le même vert », conformément à la demande.
**Statut :** révisé par BDR-008 le même jour (calque mono repassé au vert, le beige disparaît complètement). Contraste revérifié après le changement (le calque accent, plus lumineux, brille davantage en fusion « screen ») : page-hero pire cas 5,85-7,15:1 (légèrement au-dessus de l'ancien 6,0-7,3 sur certains angles, toujours largement au-dessus du seuil AA) ; accueil pire cas 5,61:1 (contre 5,71:1 avant, marge quasi identique). Aucune erreur console, aucun débordement sur les 3 pages testées.

### BDR-008 — Shader 100% vert, harmonisé avec la palette du site

**Date :** 2026-07-22
**Décision :** Le calque mono (celui qui bouge) repasse du beige (`--sable-2`, 239,228,213) au vert moyen `--vert-clair` (91,140,62). Le calque accent garde le vert clair de BDR-007 (150,195,155, dérivé de `--vert`). Le fond reste le vert forêt très sombre de BDR-006 (`#111f16`). Le shader est donc désormais composé exclusivement de trois verts déjà présents dans la charte du site (`--vert` en filigrane via le fond, `--vert-clair` en calque principal, une variante éclaircie de `--vert` en accent) — plus aucun beige ni blanc.
**Pourquoi :** Pierre a demandé de ne quasiment plus avoir de blanc dans le shader et de revenir à un vert complet, avec de l'harmonie entre les pages et les bannières. Réutiliser les teintes déjà définies dans `:root` (plutôt que d'en inventer de nouvelles) garantit cette harmonie par construction : le shader ne fait plus qu'exprimer la palette déjà en place ailleurs sur le site (bouton, liens, pied de page).
**Alternatives envisagées :** Inventer une nouvelle teinte de vert dédiée au shader — écarté, va à l'encontre de la demande d'harmonie ; réutiliser les variables existantes est plus cohérent et plus simple à maintenir (un seul jeu de verts pour tout le site).
**Statut :** actif. Contraste nettement amélioré par ce changement (le vert moyen est plus sombre que l'ancien beige) : accueil pire cas 7,93:1 (contre 5,61:1 avant), page-hero pire cas 8,58-9,51:1 (contre 5,85-7,15:1 avant) — au-dessus du seuil AAA sur toutes les pages et tous les angles testés. Cohérence vérifiée : les mêmes deux couleurs vertes (91,140,62 / 150,195,155) apparaissent sur les 3 pages testées (accueil, cv, maladie), aucune erreur console, aucun débordement.

### BDR-009 — Accueil éclairci, cartes du sommaire repassées en beige

**Date :** 2026-07-22
**Décision :** `.hero-immersif` passe du quasi-noir vert (`#111f16`) au vert plein `var(--vert)` (#2f5233) — exactement la couleur du pied de page (`.footer`), qui utilise déjà du texte blanc/pâle dessus avec succès. Le `.mesh-veil` est très allégé (opacités radiales/linéaires environ divisées par 2-2,5, ex. le point le plus sombre passe de 0,78 à 0,38). Les cartes du sommaire (`.home .hub-card`, les 4 tuiles Parcours/RCH/Portfolio/Galerie) redeviennent des panneaux beiges (`rgba(247,241,232,.88)`, `--sable`) avec accents marron (`--marron-fonce`, `--marron`) au lieu du vert menthe sur fond sombre — texte interne repassé en sombre (`--encre`/`--mut`) puisque le panneau est maintenant clair. Périmètre limité à la page d'accueil : `.shader-hero`/`.bande-abstraite` (CV, RCH) ne sont pas concernés, seule la page d'accueil avait été jugée trop sombre.
**Pourquoi :** Pierre trouvait la page d'accueil encore trop sombre et a demandé de s'inspirer de ce qui se fait sur d'autres sites, en autorisant explicitement à moins se soucier du contraste. Il a aussi demandé que les cartes-liens du sommaire (« les sortes de boutons ») redeviennent beige, sans changer leur comportement (liens, survol, glow qui suit la souris via `--mx`/`--my` — tout ce JS reste intact, seules les couleurs CSS changent).
**Alternatives envisagées :** Continuer à assombrir via un voile dense (l'approche des BDR précédents) — écarté, c'est exactement ce que Pierre trouvait trop sombre ; réutiliser `--vert` (déjà éprouvé via le pied de page) plutôt qu'inventer une nouvelle teinte plus claire, pour rester cohérent avec BDR-008 (harmonie via les variables existantes).
**Statut :** actif. Contraste non re-vérifié par rasterisation complète (Pierre a explicitement demandé de ne pas s'en inquiéter) — vérification légère seulement : blanc sur `--vert` plein calcule à 8,84:1 (bien au-dessus des seuils usuels, avant même l'apport du voile), et le duo beige/`--encre`+`--mut` des cartes est le même déjà utilisé ailleurs sur le site (ex. `.toc`) donc déjà éprouvé. Aucune erreur console, aucun débordement.

### BDR-010 — Règle « beige sur vert » généralisée à l'accueil, cadre des cartes invisible

**Date :** 2026-07-22
**Décision :** Tout texte reposant directement sur le fond vert de l'accueil passe en beige (`var(--sable)` / `var(--sable-2)`) : `.hero-label`, `h1`, `.hero-sub`, `.btn-verre` (texte + fond + bordure), `.section-label` et ses pseudo-éléments, `.picto`/`.picto-plein`, les lueurs de `.deco-layer`, `.hero-scroll`/`.hero-scroll-line`. Seule exception, en nuance : le mot en italique dans le `h1` (`em`) passe en `var(--encre)` (sombre) plutôt qu'en beige, pour une touche gravée/en creux. Par ailleurs, la bordure `2px solid` des cartes du sommaire (`.home .hub-card`, héritée de la règle de base `.hub-card`) passe en `border-color: transparent` (au lieu de `border: none`, pour ne pas décaler le padding) — le fond beige et l'ombre suffisent à distinguer la carte, sans le cadre qui la faisait ressembler à une page à part entière.
**Pourquoi :** Pierre a demandé que tout ce qui repose sur du vert (notamment les polices) passe en beige, avec une tolérance explicite pour des nuances en vert foncé/noir ; et que le cadre visible autour des cartes-boutons du sommaire soit rendu invisible, car il donnait l'impression d'« une page dans la page ».
**Alternatives envisagées :** Utiliser du vert foncé/noir pour la nuance du `em` ET pour d'autres éléments (ex. le label) — écarté après calcul de contraste (`--encre` sur `--vert` ≈ 1,77:1, déjà très sourd) : généraliser le noir/vert foncé à plus d'un élément aurait rendu plusieurs textes illisibles plutôt qu'un seul, plus discret par conception. Retirer complètement la bordure (`border: none`) plutôt que la rendre transparente — écarté, aurait décalé la taille de la carte de 4px (box-sizing border-box).
**Statut :** révisé par BDR-011 le même jour (Pierre a clarifié que le vrai « cadre » qui le gênait était ailleurs — voir ci-dessous — et a aussi demandé un beige plus soutenu). Vérifié à l'époque : `h1`/`label`/`sub`/bouton en beige (`rgb(247,241,232)`), `em` en sombre (`rgb(35,36,31)`), bordure des cartes à `rgba(0,0,0,0)` (transparente, largeur 2px inchangée — pas de saut de mise en page). Contraste beige/vert mesuré à 7,87:1 (large marge) ; contraste `em`/vert mesuré à 1,77:1 — assumé et attendu (nuance volontairement discrète, Pierre a demandé de ne pas s'inquiéter du contraste), signalé explicitement plutôt que masqué. Aucune erreur console, aucun débordement.

### BDR-011 — Beige de l'accueil assombri, bande du séparateur de section rendue invisible

**Date :** 2026-07-22
**Décision :** Nouvelle variable `--sable-fonce: #d8c3a0` (beige plus soutenu, entre `--sable-2` et `--marron`), utilisée à la place de `--sable`/`--sable-2` pour tout le beige de l'accueil (texte du hero, bouton, label de section, pictogrammes, lueurs, indicateur de défilement, fond des cartes du sommaire). Le vrai « cadre » que Pierre voulait invisible était en fait `.home .section-label::after` — le trait de séparation quasi pleine largeur après le label « // sommaire », qui lisait comme une bande translucide autour du sommaire — passé en `background: transparent` (BDR-010 avait à tort traité la bordure des cartes comme LE cadre concerné ; cette bordure reste transparente, ce qui était de toute façon une amélioration correcte, mais ce n'était pas ce qu'il visait). Effet de bord corrigé au passage : `--mut` (conçu pour `--sable` très pâle) tombait à 2,97:1 sur le nouveau beige plus sombre des cartes — remonté à 6,19:1 avec un ton dédié (`#3f3f36`) réservé à `.home .hub-card p`.
**Pourquoi :** Pierre a demandé de continuer l'effort avec un beige plus foncé, et a clarifié qu'il parlait en réalité de la bande transparente autour du sommaire (pas du cadre des cartes) qu'il ne voulait pas voir.
**Alternatives envisagées :** Modifier `--sable`/`--sable-2` directement (variables globales) — écarté, elles servent aussi ailleurs sur le site (ex. `.toc`) et les changer aurait eu un effet de bord hors du périmètre demandé (« cette page d'accueil »). Une nouvelle variable dédiée à l'accueil garde le changement scopé et documenté.
**Statut :** révisé par BDR-012 le même jour (Pierre voulait ce beige un cran plus clair, et le noir/gris utilisé pour les nuances remplacé par du vert forêt). Vérifié à l'époque : `h1`/fond des cartes en `rgb(216,195,160)`, séparateur de section à `rgba(0,0,0,0)` (invisible). Contraste beige foncé/vert : 5,15:1 (toujours largement au-dessus AA malgré l'assombrissement) ; `--encre` sur beige foncé : 9,10:1 ; texte des cartes (`#3f3f36`) sur beige foncé : 6,19:1 (corrigé depuis 2,97:1). Aucune erreur console, aucun débordement.

### BDR-012 — `--sable-fonce` réclairci, nuances sombres en vert forêt (jamais noir)

**Date :** 2026-07-22
**Décision :** `--sable-fonce` passe de `#d8c3a0` à `#e6d2b0` (un cran plus clair). Les couleurs sombres utilisées pour le contraste sur fond beige/vert ne sont plus neutres (`--encre` #23241f, ou le gris `#3f3f36`) mais du vert forêt : `.home .hub-card h3` et `.home .hub-card p` passent tous les deux à `var(--vert)` (5,98:1 sur le nouveau beige) ; le mot en italique du `h1` (nuance sombre sur fond vert) passe à un vert forêt encore plus sombre que le fond (`#17241a`, distinct de `var(--vert)` pour rester visible — l'utiliser tel quel aurait rendu le mot invisible, texte et fond étant alors la même couleur exacte).
**Pourquoi :** Pierre a demandé un beige un peu plus clair, et de ne plus utiliser de noir pour les contrastes de texte, mais du vert forêt à la place.
**Alternatives envisagées :** Utiliser `var(--vert)` tel quel pour le mot en italique du titre (qui repose sur un fond `var(--vert)` identique) — rejeté immédiatement, contraste 1:1, le mot aurait disparu ; une teinte volontairement plus sombre que le fond était nécessaire pour qu'il reste visible tout en étant « vert forêt » comme demandé.
**Statut :** révisé par BDR-015 le même jour (Pierre a demandé un cran de clair supplémentaire ; au passage, découvert que plusieurs usages `rgba()` littéraux — hero-sub, bouton, picto, lueurs, indicateur de défilement — étaient restés sur l'ANCIENNE valeur `216,195,160` faute d'avoir été mis à jour ici, corrigé en même temps). Vérifié à l'époque : `h1` et fond des cartes en `rgb(230,210,176)` ; `em` en `rgb(23,36,26)` (contraste 1,82:1 sur le hero — nuance volontairement discrète, cohérente avec BDR-010) ; `h3`/`p` des cartes en `rgb(47,82,51)` (contraste 5,98:1 sur le nouveau beige). Aucune erreur console, aucun débordement.

### BDR-013 — Bloc qui tourne : hero ↔ sommaire liés par un flip 3D épinglé

**Date :** 2026-07-22
**Décision :** GSAP ScrollTrigger (plugin officiel, auto-hébergé dans `theme/js/vendor/ScrollTrigger.min.js`, même version 3.15.0 que `gsap.min.js`) épingle un nouveau conteneur `.flip-stage` (qui enveloppe `.hero-immersif` et `#sommaire`, désormais tous deux `.flip-face`) pendant un défilement de `+=100%` (une hauteur d'écran), et fait pivoter en 3D le contenu du hero (`rotateX` 0→-70°, fondu vers 0) pendant que le sommaire pivote en sens inverse pour apparaître (`rotateX` 85°→0°, fondu vers 1) — au même endroit à l'écran, d'où l'effet de bloc qui se retourne sur lui-même. Nouveau fichier `theme/js/flip-transition.js`. Activé uniquement à partir de 900px (`gsap.matchMedia`) et jamais si `prefers-reduced-motion: reduce` ; en dessous, ou sans JS/GSAP, `.flip-stage` reste un conteneur neutre et les deux sections s'empilent normalement (dégradation totale, zéro dépendance au JS pour lire la page).
**Pourquoi :** Pierre voulait un vrai effet de défilement entre le titre et le sommaire de l'accueil, « comme si on tournait un bloc », en s'inspirant d'une animation adaptée d'esprit 21st.dev (toujours réimplémentée en vanilla, jamais installée telle quelle — voir BDR-002).
**Alternatives envisagées :** Laisser `#sommaire` entrer par défilement naturel après l'épinglage du hero (deux ScrollTrigger séparés, sans conteneur partagé) — écarté après analyse : avec l'espacement de pin par défaut, le sommaire resterait physiquement hors écran (poussé par le spacer) pendant toute la durée du scrub, donc son animation d'entrée se terminerait AVANT qu'il ne devienne visible par le défilement naturel — aucune des deux faces ne serait visible simultanément, l'effet « bloc qui tourne » ne se produirait jamais à l'écran. D'où le choix d'empiler les deux faces dans la même cellule de grille (`.flip-face { grid-area: 1/1 }`) pour qu'elles occupent réellement le même rectangle pendant la transition.
**Statut :** abandonné par BDR-014, le jour même. L'effet fonctionnait techniquement (voir ci-dessous les vérifications faites), mais Pierre l'a trouvé finalement pas voulu — il cherchait un défilement « lisse », pas un bloc qui pivote. **Bug trouvé et corrigé en vérifiant, avant l'abandon** : `html { scroll-behavior: smooth }` (réglage global existant, pour les ancres comme `#sommaire`) entre en conflit avec ScrollTrigger — confirmé documenté par GSAP lui-même — et provoquait un `progress` d'épinglage figé à ~0 malgré un scroll réel (voir LRN-008). Deuxième point de vigilance résolu par construction : `.mesh-holder` (fond ethereal `position:fixed`) a été sorti de `.flip-stage` pour rester un frère plutôt qu'un descendant, car la `perspective` posée sur `.flip-stage` aurait changé son bloc de positionnement (voir LRN-009). Vérifié en conditions réelles (scroll programmatique + `ScrollTrigger.update()`) : progress 0→0,5→1 correspondait à une vraie interpolation d'opacité et de matrice 3D sur les deux faces ; épinglage puis relâchement corrects ; repli mobile propre. Ces deux apprentissages (LRN-008, LRN-009) restent valables pour toute future tentative d'animation de scroll sur ce projet, même si cette implémentation précise a été retirée.

### BDR-014 — Retour à l'empilement simple de l'accueil, fin de l'apparition au scroll des cartes

**Date :** 2026-07-22
**Décision :** Le flip 3D hero/sommaire (BDR-013) est intégralement retiré : `.flip-stage`/`.flip-face` supprimés du gabarit et du CSS, `theme/js/flip-transition.js` et `theme/js/vendor/ScrollTrigger.min.js` supprimés du thème et de `output/`, script ScrollTrigger retiré de `base.html`. `.mesh-holder` reprend sa place d'origine, descendant de `.hero-immersif` (plus besoin d'en faire un frère puisqu'il n'y a plus de `perspective` sur un ancêtre). `scroll-behavior: smooth` restauré sur `html` (le conflit avec ScrollTrigger ne s'applique plus, cause disparue avec le plugin). Par ailleurs, `.hub-card` est retiré de la liste des éléments à révéler au scroll dans `base.html` (`.reveal`/IntersectionObserver) : les cartes du sommaire sont désormais toujours à `opacity:1`, sans aucune apparition/fondu au défilement.
**Pourquoi :** Pierre a abandonné l'effet de bloc qui tourne — il voulait un défilement lisse sur l'accueil, sans qu'aucune section « apparaisse » pendant le scroll. Le flip 3D allait à l'encontre de cette demande, et l'animation de révélation des cartes du sommaire (fondu + décalage vertical à l'entrée dans le viewport) en est une autre forme, retirée pour la même raison.
**Alternatives envisagées :** Garder ScrollTrigger installé mais désactivé (au cas où) — écarté, du code mort sans utilité connue alourdit inutilement le site pour rien (contraire à la philosophie d'empreinte minimale, BDR-003) ; plus simple de le retélécharger si un futur besoin scroll-driven se présente. Limiter le retrait de `.reveal` à une exception CSS plutôt que modifier la liste JS dans `base.html` — écarté, la liste JS est la source de vérité unique (elle seule décide qui reçoit `.reveal`), la modifier directement évite un CSS de contournement redondant.
**Statut :** actif. Vérifié : `window.ScrollTrigger` et `#flip-stage` absents du DOM/JS ; `.mesh-holder` de nouveau `position:fixed` avec `getBoundingClientRect()` à `{top:0,left:0}` ; shader intact (1 calque animé + 1 figé) ; les 4 cartes du sommaire à `opacity:1` sans classe `.reveal` ; `scroll-behavior:smooth` restauré. Vérifié sur le portfolio que `.project-card` garde bien son `.reveal` (9 cartes) — le retrait est bien scopé aux cartes de l'accueil, pas une régression globale. Aucune erreur console, aucun débordement.

### BDR-015 — `--sable-fonce` reclairci vers le blanc, repris pour les titres de toutes les pages, barres des callouts RCH retirées

**Date :** 2026-07-22
**Décision :** `--sable-fonce` passe de `#e6d2b0` à `#f4e0be`, plus proche du blanc. Tous les usages `rgba()` littéraux qui dupliquaient cette teinte (hero-sub, bouton `.btn-verre`, `.picto`, lueurs `.deco-layer`, indicateur `.hero-scroll`, fond `.hub-card`) mis à jour vers la nouvelle valeur — certains étaient restés bloqués sur l'ANCIENNE valeur `216,195,160` de BDR-011, jamais suivie lors du passage à BDR-012 (voir LRN-010). Cette même couleur est reprise pour `.page-hero .page-header h1` (titres des pages CV, RCH, portfolio, galerie), remplaçant le blanc pur — pour une cohérence de teinte entre l'accueil et le reste du site. Par ailleurs, la barre verticale de gauche des blocs `.callout` (`::before`, dégradé `--vert-clair` → `--marron`) est retirée (`display:none`) — utilisée sur la page RCH pour les 5 blocs de contexte/explication (« À lire avant tout », « Le signe à ne pas minimiser », etc.).
**Pourquoi :** Pierre voulait les boutons/titres de l'accueil encore plus clairs, proches du blanc, et a demandé de reprendre cette couleur pour les titres de toutes les autres pages. Séparément, il voulait retirer les barres latérales des blocs de texte explicatif/contexte sur la page RCH, qu'il ne trouvait pas nécessaires.
**Alternatives envisagées :** Garder le blanc pur (`#ffffff`) pour les titres des autres pages et ne changer que l'accueil — écarté, Pierre a explicitement demandé de reprendre LA MÊME nouvelle couleur partout, pas de garder deux traitements différents. Masquer la barre des callouts via une classe CSS additionnelle plutôt que `display:none` sur la règle existante — écarté, inutile puisque la demande porte sur TOUS les callouts de la page (pas de variante à conserver), `display:none` directement sur `::before` est plus simple et cascade correctement sur `.callout--warn` sans dupliquer la règle.
**Statut :** révisé par BDR-016 (Pierre a donné une valeur hexadécimale exacte à atteindre). Vérifié à l'époque : `h1`/bouton/fond des cartes en `rgb(244,224,190)` sur l'accueil ; même couleur confirmée sur les titres de CV, RCH et portfolio. Contraste re-vérifié par rasterisation sur le page-hero (CV) : pire cas 6,73-7,37:1 sur 6 angles de teinte. Les 5 blocs `.callout` de la page RCH confirmés avec `::before` à `display:none`. Aucune erreur console, aucun débordement sur les 4 pages testées.

### BDR-016 — `--sable-fonce` fixé à la couleur exacte `#ffefcb`

**Date :** 2026-07-22
**Décision :** `--sable-fonce` passe de `#f4e0be` à `#ffefcb`, la valeur hexadécimale exacte donnée par Pierre. Tous les doublons `rgba()` littéraux mis à jour en même temps (via recherche systématique de l'ancienne valeur, méthode consolidée depuis LRN-010).
**Pourquoi :** Pierre a fourni un code couleur précis à atteindre plutôt qu'une direction relative (« plus clair ») — appliqué tel quel.
**Alternatives envisagées :** Aucune — valeur exacte fournie, pas de marge d'interprétation.
**Statut :** actif. Vérifié : `rgb(255,239,203)` confirmé sur `h1`/fond des cartes de l'accueil et sur le titre du CV. Contraste beige/vert : 7,77:1. Aucune erreur console, aucun débordement.
