# Contexte du projet thenaisiepierre.fr — export de connaissances

> Document de synthèse exhaustif, écrit pour permettre à une session locale
> (Claude ou autre) de reprendre ce projet avec tout le contexte nécessaire,
> sans avoir à reconstituer l'historique. Pour le détail granulaire de chaque
> décision (BDR-XXX), apprentissage (LRN-XXX), blocage (BLK-XXX) ou
> évaluation (EVAL-XXX), voir `.claude/memory/*.md` — ce fichier-ci en est
> la synthèse condensée et à jour, pas un remplacement.
>
> Dernière mise à jour : 2026-07-24.

## 1. Qu'est-ce que ce site

Site personnel de Pierre Thenaisie : vitrine de son parcours professionnel,
de son vécu avec une MICI (rectocolite hémorragique), et bientôt d'une
galerie photo. Ce n'est **pas** un blog, **pas** un portfolio d'agence — un
site vitrine minimaliste, pensé pour être partagé sélectivement (un lien
différent à un recruteur, à un proche, etc.).

**Goûts et intentions explicites de Pierre**, à respecter par défaut :
- Minimalisme, palette vert/beige/marron (vert forêt dominant).
- Aller loin dans le design/l'animation, **sans** alourdir le site : il est
  hébergé sur un mutualisé OVH basique.
- Aucune barre de navigation globale — volontaire, voir §3.
- Préférence marquée pour réimplémenter en vanilla plutôt qu'installer une
  dépendance/un framework — voir §2 et §7.

## 2. Stack technique

- **Générateur** : [Pelican](https://getpelican.com/) (Python, statique).
  Aucun framework JS, aucun build (pas de webpack/vite/npm côté site).
- **Thème actif** : `themes/pierre/` (voir `pelicanconf.py`, `THEME =
  'themes/pierre'`). **Il existait un ancien dossier `theme/` (singulier,
  mort, jamais référencé) — supprimé le 2026-07-24.** Si un dossier `theme/`
  réapparaît, c'est un résidu, pas la source active.
- **JS** : vanilla + deux libs auto-hébergées (jamais chargées depuis un
  CDN) : GSAP (`themes/pierre/static/js/vendor/gsap.min.js`) et Anime.js v4
  (`.../vendor/anime.min.js`). Choix assumé : le site n'a **aucune**
  dépendance runtime vers un tiers (ni CDN JS, ni police Google Fonts
  distante depuis le 2026-07-24, ni service de favicons distant).
- **Polices** : Fraunces (titres), Inter (corps), IBM Plex Mono (étiquettes/
  labels). Auto-hébergées depuis le 2026-07-24 (`themes/pierre/static/
  fonts/*.woff2`, sous-ensemble **latin uniquement** — suffisant pour le
  français, ~530 Ko économisés par rapport à latin+latin-ext).
- **Déploiement** : push sur `main` → GitHub Actions (`.github/workflows/
  deploy.yml`) → génère avec Pelican → dépose en FTP sur OVH
  (`ftp.cluster129.hosting.ovh.net`, dossier distant `www/`).
- **Config Pelican** : `pelicanconf.py` est la config **réellement utilisée**
  par le déploiement (`deploy.yml` appelle `pelican content -s
  pelicanconf.py`, **pas** `publishconf.py`). `publishconf.py` existe sur
  disque mais n'est ni utilisé par le pipeline, ni suivi par git (fichier
  non tracké — vérifié). Ne pas supposer qu'il a un effet quelconque.
  `RELATIVE_URLS = True` dans `pelicanconf.py` — piège important, voir §7.

## 3. Pages du site (état actuel)

Trois pages, plus l'accueil :

| Page | Fichier | Statut |
|---|---|---|
| Accueil | `themes/pierre/templates/index.html` | 3 cartes égales (`.hub-card--s`) : Parcours, RCH, Galerie |
| Parcours | `content/pages/cv.md` | CV + récit par projets, logos d'entreprise en monogrammes CSS (pas d'image externe) |
| Vivre avec la RCH | `content/pages/maladie.md` | Contenu médical sourcé (INSERM, ameli, afa), schémas SVG, très complet |
| Galerie | `content/pages/galerie.md` | Alimentée par Immich au moment du build, voir §5. Actuellement en état « à venir » |

**Pages supprimées le 2026-07-24** (demande explicite de Pierre) :
- `a-propos.md` — n'était liée nulle part sur le site (cohérent avec
  l'absence de nav globale).
- `portfolio.md` — domotique/NAS/Docker/etc., retirée avec tout son CSS
  dédié (`.project-card`, `.project-grid`, `.badge--*`, `.tag`).
- `photos.md` — page **fantôme** distincte de `galerie.md` : orpheline
  (aucun lien ne pointait vers elle), résidu d'avant la suppression du blog,
  son texte évoquait encore « les articles du blog ». À ne pas confondre
  avec `galerie.md`, qui est la vraie page vivante.

**Pas de navigation globale** (décision structurante, voir BDR-001) : chaque
page est volontairement cloisonnée, Pierre partage des liens différents à
des publics différents. Ne jamais réintroduire un menu global sans
revalider explicitement avec lui.

**Contenu orphelin non nettoyé** (hors du périmètre demandé jusqu'ici,
signalé mais pas touché) :
- `content/articles/*.md` (4 fichiers) — anciens articles de blog,
  `ARTICLE_PATHS = []` dans la config donc jamais générés, et **non suivis
  par git** (fichiers locaux jamais commités). Sans effet sur le site
  déployé.
- `themes/pierre/templates/article.html` et `category.html` — également non
  suivis par git, vestiges du même ancien blog.

## 4. Système de design

- **Palette** (`:root` dans `themes/pierre/static/css/style.css`) : `--vert`
  (#2f5233, vert forêt profond), `--vert-clair` (#5b8c3e, accent),
  `--vert-pale` (#eaf0e2), `--sable`/`--sable-2` (beiges cartes),
  `--sable-fonce` (#ffefcb, beige quasi-blanc — accueil et titres de page),
  `--marron`/`--marron-fonce` (accents décoratifs), `--encre`/`--mut`
  (textes). Palette **très itérée** (16 révisions rien que sur
  `--sable-fonce`, voir BDR-005 à BDR-016) — ne pas re-proposer de grands
  changements de palette sans relire cet historique, beaucoup d'allers-
  retours déjà arbitrés.
- **Variables `--xxx-rgb`** (ajoutées le 2026-07-24) : `--blanc-rgb`,
  `--sable-fonce-rgb`, `--vert-rgb`, `--vert-clair-rgb`, `--marron-rgb` —
  toute couleur qui a une variante `rgba()` à opacité variable DOIT utiliser
  `rgba(var(--xxx-rgb), alpha)`, jamais un triplet RGB littéral dupliqué
  (bug déjà rencontré deux fois, voir LRN-010).
- **Fond « ethereal »** (`themes/pierre/static/js/ethereal.js`) : filtre SVG
  natif (`feTurbulence` + `feColorMatrix hueRotate` animé), remplace
  d'anciens shaders WebGL (`warp.js`/`mesh.js`, supprimés — pixellisés par
  sous-échantillonnage). Piloté par GSAP (`gsap.ticker.lagSmoothing(0)`),
  toujours composé de deux calques : un calque mono animé + un calque
  accent figé (bouger les deux simultanément fait chuter le fps, voir
  LRN-006). Palette actuelle : 100% vert, plus aucun blanc/beige/noir dans
  le shader (BDR-008).
- **Animations Anime.js** (`themes/pierre/static/js/animations.js`) : entrée
  en fondu du hero d'accueil, tracé SVG des schémas de la page RCH,
  compteurs numériques, cascade des logos du CV.
- **Révélation au scroll** (`base.html`, IntersectionObserver) : `.cv-entry,
  .article-card, .callout, .skills-group, .photo-item, .prose, .lead`.
  **`.hub-card` en est volontairement exclu** — Pierre veut un défilement
  lisse sur l'accueil, rien ne doit « apparaître » (voir BDR-014).
- **View Transitions API** (ajoutée le 2026-07-24) : `@view-transition {
  navigation: auto; }` dans `style.css` — fondu natif entre pages, zéro JS,
  dégradation invisible si non supporté.
- **Favicon + Open Graph** (ajoutés le 2026-07-24) : `themes/pierre/static/
  images/` — favicon (mark « ~/ », repris du nav), image de partage
  1200×630 dessinée dans la charte du site. Titre/description/URL
  spécifiques par page via les blocs Jinja `title`/`meta_description`/
  `og_url` (voir `base.html`, `page.html`).

## 5. Galerie — intégration Immich

**Ne pas confondre deux mécanismes distincts d'Immich** : une clé API
personnelle (accès complet au compte, à ne jamais exposer) et un **lien de
partage public** (`/s/xxx` ou `/share/xxx`, accès en lecture seule,
révocable indépendamment du compte). Ce projet n'utilise **que** le second.

**Architecture (décidée après un premier essai raté)** :
- Un script `build_gallery.py` (racine du projet) tourne **au moment du
  build**, pas dans le navigateur du visiteur.
- **Pourquoi pas côté navigateur** : testé en direct contre l'instance réelle
  de Pierre (`photos.thenaisiepierre.fr`) — elle ne renvoie **aucun en-tête
  CORS** (`Access-Control-Allow-Origin` absent même avec un `Origin`
  envoyé). Un `fetch()` depuis `thenaisiepierre.fr` (domaine différent)
  aurait échoué silencieusement sur tous les navigateurs. Un script exécuté
  côté serveur/build n'est pas soumis à CORS (politique de navigateur
  uniquement) ; les `<img src>` générés ensuite, eux, chargent sans
  problème quel que soit CORS.
- Le script lit la variable d'environnement `IMMICH_SHARE_URL` (URL complète
  du partage). Il essaie l'identifiant de fin d'URL comme paramètre `slug`
  d'abord, puis `key` en repli (Immich accepte les deux sur `/api/shared-
  links/me`, mais un partage donné n'est identifié que par l'un des deux —
  un slug personnalisé type `/s/testimmich` n'est PAS la clé brute).
- **Toutes les requêtes envoient un User-Agent de navigateur.** Sans ça,
  Cloudflare (devant l'instance Immich de Pierre) renvoie 403 — rien à voir
  avec les identifiants, juste une heuristique anti-bot à satisfaire.
- Le script réécrit uniquement la zone balisée `<!-- GALERIE:START -->` /
  `<!-- GALERIE:END -->` dans `content/pages/galerie.md`, de façon
  idempotente (n'écrit que si le contenu calculé diffère). Si
  `IMMICH_SHARE_URL` est absente ou le partage injoignable, il ne touche à
  rien — le bloc « à venir » reste affiché.
- Câblé dans `.github/workflows/deploy.yml` avant l'étape Pelican, via la
  **variable de dépôt GitHub** (pas un secret — pas sensible en soi, mais
  variable plutôt que codée en dur) `vars.IMMICH_SHARE_URL`.
- **Non géré actuellement** : les partages protégés par mot de passe (hors
  périmètre, pas demandé).

**État réel au 2026-07-24** : mécanisme testé en conditions réelles contre
un lien fourni par Pierre (`https://photos.thenaisiepierre.fr/s/testimmich`,
2 photos récupérées et affichées avec succès, vignette vérifiée comme image
valide). Mais Pierre a précisé que ce lien était un **test**, pas son album
définitif — la page Galerie a donc été **remise volontairement en état « à
venir »** avant tout commit, pour ne pas publier du contenu de test sous son
nom sans confirmation. **`IMMICH_SHARE_URL` n'est pas encore configurée côté
GitHub Actions.** À faire quand Pierre aura son vrai album prêt : créer le
lien de partage dans Immich, l'ajouter dans Settings → Secrets and
variables → Actions → Variables (voir README).

## 6. Déploiement — points d'attention

- Secrets GitHub nécessaires : `FTP_USERNAME`, `FTP_PASSWORD` (déjà en
  place). Variable (pas secret) : `IMMICH_SHARE_URL` (voir §5, pas encore
  configurée).
- **`dangerous-clean-slate` passé à `true` le 2026-07-24** (`deploy.yml`,
  action `SamKirkland/FTP-Deploy-Action`) : le dossier distant `www/` sur
  OVH est désormais entièrement synchronisé sur `output/` à chaque
  déploiement. Fait pour nettoyer des pages fantômes (anciennes pages de
  blog `blog/author/category`, plus générées depuis la suppression du blog
  mais jamais retirées du serveur, faute de ce réglage). **Risque
  résiduel** : si quoi que ce soit d'autre a été placé manuellement sur ce
  même chemin FTP (vérification de domaine, etc.), ce sera supprimé au
  prochain déploiement — non vérifié faute d'accès FTP direct depuis les
  sessions qui ont fait ce changement.
- **`RELATIVE_URLS = True`** dans `pelicanconf.py` : Pelican réécrit
  `SITEURL` en chemin relatif par page dans les templates (voir §7, piège
  important). Une nouvelle variable **`SITE_ABSOLUTE_URL`** existe
  spécifiquement pour ce que `SITEURL` ne peut plus fournir sous ce mode :
  canonical, `og:url`, `og:image`, `twitter:image`.
- **État git au 2026-07-24** : deux commits locaux faits pendant les
  sessions de nettoyage/design/galerie, **mais pas encore poussés** (`git
  push` a échoué faute d'identifiants dans l'environnement sandbox utilisé ;
  une tentative de push avec un jeton fourni en chat a été bloquée par le
  classificateur de sécurité de Claude Code). À pousser manuellement
  (`git push`) depuis un poste authentifié pour que le déploiement se
  déclenche.
- **Un jeton/clé a été collé en clair dans une conversation** avec Claude
  pendant ce travail (pour tenter d'authentifier un push). Si c'est un
  token GitHub à portée d'écriture, envisager de le régénérer par
  précaution, puisqu'il reste visible dans l'historique de conversation.

## 7. Pièges non-évidents (à connaître avant de retoucher le projet)

- **`RELATIVE_URLS=True` réécrit `SITEURL` en chemin relatif, par page**
  (documenté dans le code même de Pelican, `pelican/writers.py`,
  `_get_localcontext`). `{{ SITEURL }}` dans un template n'est donc PAS la
  valeur littérale de la config — inutilisable pour tout ce qui exige une
  URL absolue (canonical, Open Graph). D'où `SITE_ABSOLUTE_URL`, une
  variable custom que Pelican ne réécrit jamais.
- **Toujours faire un vrai build Pelican après un changement de gabarit
  Jinja** — une relecture manuelle, même attentive, n'aurait pas révélé le
  piège ci-dessus. Un `venv` jetable (`python3 -m venv` + `pip install
  pelican markdown`) suffit, quelques secondes, ne modifie rien au projet.
- **Un `fetch()` qui répond bien en curl peut être bloqué par CORS dans un
  vrai navigateur** — CORS est une politique de navigateur, jamais visible
  en testant côté serveur/CLI. Toujours vérifier l'en-tête `Access-Control-
  Allow-Origin` explicitement (`curl -H "Origin: https://..." -D -`) avant
  de concevoir une intégration qui fait un fetch cross-origin côté client.
- **Un WAF/Cloudflare peut bloquer une requête selon son `User-Agent`**,
  sans rapport avec des identifiants invalides — un script serveur qui
  échoue à joindre une URL qui répond pourtant en navigateur doit d'abord
  faire ce test-là avant de remettre en cause sa logique métier.
- **Une couleur dupliquée en `rgba()` littéral se désynchronise
  silencieusement de sa variable CSS** dès que la variable change — d'où
  les variables `--xxx-rgb` (§4). Un `grep` systématique de l'ancienne
  valeur reste la seule garantie en l'absence de ces variables compagnons.
- **Pelican ne supprime jamais les fichiers générés à partir de contenu
  source supprimé** entre deux builds — toujours `rm -rf output/` avant un
  rebuild après suppression/renommage de contenu (ou construire dans un
  dossier neuf).
- **Le contraste sur un fond animé (shader) ne se juge jamais à l'œil sur
  une capture unique** — toujours recomposer les calques (shader + voile +
  élément) sur plusieurs instants de l'animation avant de valider un ratio
  WCAG.
- **`perspective`/`transform`/`filter` sur un ancêtre change le bloc de
  positionnement d'un `position:fixed` descendant** — à vérifier avant tout
  ajout de ces propriétés sur un conteneur englobant le fond `ethereal`.
- **`scroll-behavior: smooth` casse le calcul de position de GSAP
  ScrollTrigger** — retirer l'un ou l'autre si les deux doivent cohabiter,
  ou utiliser `ScrollToPlugin` de GSAP à la place du CSS natif.
- **Environnement d'exécution particulier** (propre aux sessions distantes/
  sandbox, pas au projet lui-même) : le dossier est monté en CIFS/SMB depuis
  un NAS (`//192.168.0.101/...`), ce qui peut provoquer des incohérences de
  cache lors de suppressions (`rm -rf` qui échoue sur une entrée fantôme
  malgré un contenu déjà vide — se résorbe généralement en réessayant après
  un court instant, ou en travaillant dans un dossier de scratch en
  attendant). Le dépôt appartient à un autre uid que l'utilisateur
  d'exécution : les commandes git nécessitent `-c safe.directory='*'` tant
  qu'aucune identité git globale n'est configurée pour les commits (aucun
  `user.name`/`user.email` explicite — les commits utilisent l'identité par
  défaut de la machine).

## 8. Ce qu'il reste à faire (au 2026-07-24)

- [ ] Pousser les commits locaux (`git push`) — rien n'est encore déployé
      sur OVH depuis les changements de cette session.
- [ ] Configurer `IMMICH_SHARE_URL` (variable GitHub Actions) quand le vrai
      album Immich de Pierre sera prêt.
- [ ] Confirmer qu'aucun contenu manuel ne dépend du dossier `www/` sur OVH
      avant de laisser `dangerous-clean-slate: true` agir sur un vrai
      déploiement (risque résiduel documenté en §6).
- [ ] Envisager de régénérer le jeton/clé collé en clair dans la
      conversation ayant servi à cette session, par précaution.
- [ ] (Optionnel, signalé mais non demandé) Nettoyer `content/articles/*`,
      `themes/pierre/templates/article.html`/`category.html` et
      `publishconf.py` — résidus non suivis par git de l'ancien blog,
      aucun effet sur le site actuel.
