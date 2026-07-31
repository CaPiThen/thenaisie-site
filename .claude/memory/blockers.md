---
registre: blockers
id_format: BLK-XXX
description: Frictions rencontrées sur le projet, leur cause réelle, et comment elles ont été contournées ou résolues.
champs:
  - id: identifiant unique BLK-XXX
  - date: AAAA-MM-JJ
  - friction: symptôme observé
  - cause_reelle: diagnostic, pas la première hypothèse
  - solution: ce qui a été fait
  - statut: résolu | ouvert
---

# Blockers — thenaisiepierre.fr

## Index

| ID | Date | Friction | Statut |
|---|---|---|---|
| BLK-001 | 2026-07-21 | MCP `@21st-dev/magic` renvoie des erreurs à chaque appel d'outil | résolu (contournement) |
| BLK-002 | 2026-07-21 | Panneau navigateur de test instable (captures d'écran, navigation) pendant les vérifications | ouvert (contourné) |
| BLK-003 | 2026-07-24 | `rm -rf output/` échoue silencieusement sur une entrée fantôme (partage CIFS) | ouvert (contourné) |
| BLK-004 | 2026-07-24 | `rsvg-convert` ne semble pas appliquer le `font-family` demandé dans le sandbox de cette session | ouvert (non résolu) |
| BLK-005 | 2026-07-24 | Un jeton GitHub collé en clair dans le chat bloque `git push` (classificateur de sécurité) — récidive | ouvert (à faire par Pierre) |
| BLK-006 | 2026-07-25 | `git status` affiche parfois des fichiers non liés (déjà présents avant la session) comme stagés (`A`) sans `git add` explicite de ma part | résolu (Pierre committe en parallèle sur le même dépôt) |
| BLK-007 | 2026-07-30 | `git pull --rebase` échoue à mi-parcours après un commit `Create CNAME` généré automatiquement par GitHub Pages | résolu (`rebase --abort` puis `merge`) |

## Entrées

### BLK-001 — MCP magic cassé en amont

**Date :** 2026-07-21
**Friction :** Chaque appel à `21st_magic_component_inspiration` / `_builder` échoue avec `MCP error -32602: Invalid tools/call result`.
**Cause réelle :** Diagnostiqué en sondant le serveur directement en JSON-RPC (stdio), testé en version `0.1.0` et `0.0.47`, avec la clé API en variable d'environnement et en argument — les quatre combinaisons échouent identiquement. Le serveur renvoie un `content[0]` sans champ `text`, que son propre SDK MCP rejette. Le défaut est dans le paquet npm lui-même, pas dans la config ni la clé de Pierre.
**Solution :** Ne plus dépendre de Magic pour les composants visuels demandés depuis 21st.dev ; les réimplémenter en GLSL/JS vanilla (voir BDR-002).
**Statut :** résolu par contournement. Ne pas relancer un diagnostic complet à chaque session — retenter un simple appel suffit pour voir si une version ultérieure du paquet corrige le tir.

### BLK-002 — Panneau navigateur de test instable

**Date :** 2026-07-21
**Friction :** Les captures d'écran et certaines navigations dans le panneau de test expirent (timeout) ou affichent un rendu incohérent (tuilé, page vierge) sans rapport avec le code du site.
**Cause réelle :** Instabilité de l'outil de preview lui-même (confirmé : le DOM et le CSSOM interrogés directement via JS renvoient des valeurs cohérentes et correctes au même moment où la capture d'écran échoue ou est corrompue). Manifestation supplémentaire trouvée le 2026-07-22 : `document.hidden` reste `true` en permanence dans cet onglet, même après un appel explicite de mise au premier plan — le navigateur applique son throttling d'arrière-plan en continu (`setTimeout(fn,800)` réel en 12,8 s, `gsap.ticker.frame` quasi figé), ce qui invalide toute mesure de vitesse/temps réel faite à travers cet outil (voir LRN-007).
**Solution :** Vérifier via inspection programmatique (DOM, `getComputedStyle`, lecture de règles CSSOM, rendu de shaders hors-ligne dans un canvas offscreen) plutôt que via capture d'écran quand celle-ci échoue. Pour la vitesse d'animation spécifiquement : interroger la config de l'animation elle-même (`tween.duration()`) plutôt que de chronométrer son déroulé visuel dans cet outil.
**Statut :** ouvert (limitation de l'outil, pas du projet). Contournement systématique en place.

### BLK-003 — `rm -rf output/` échoue silencieusement (CIFS)

**Date :** 2026-07-24
**Friction :** `rm -rf output` échoue avec « Directory not empty » alors que le contenu visible avait déjà été supprimé ; `ls` continuait de montrer un sous-dossier (`output/pages`, affiché avec un `?` dans les droits) que `find`/`rmdir` déclaraient pourtant absents (« No such file or directory ») — état incohérent entre le cache du client et le serveur.
**Cause réelle :** Le dossier du projet est monté en CIFS/SMB depuis un NAS (`mount` : `//192.168.0.101/... type cifs`), pas un disque local. C'est une entrée fantôme côté cache client CIFS (dentry périmée), pas une corruption du contenu réel ni une erreur de commande.
**Solution :** Contourné en construisant le site de vérification dans un répertoire de scratch (`/tmp/.../build-test`) plutôt que d'insister sur la suppression d'`output/`. Ne jamais interpréter un échec de suppression sur ce projet comme une erreur de commande sans vérifier d'abord `mount` — un nouvel essai après une courte pause, ou un chemin de sortie alternatif, résout le symptôme sans qu'il faille comprendre la cause CIFS en détail.
**Statut :** ouvert (limitation du montage réseau, pas du projet). Contournement en place ; un `output/pages` fantôme peut subsister visuellement jusqu'à ce que le cache CIFS se résorbe de lui-même (à vérifier au prochain accès depuis le poste de Pierre).

### BLK-004 — `rsvg-convert` insensible au `font-family` dans ce sandbox

**Date :** 2026-07-24
**Friction :** En remplaçant Fraunces/Inter par Petrona/Karla dans `og-image.svg` (BDR-025), tentative de régénérer `og-image.png` avec `rsvg-convert -w 1200 -h 630 og-image.svg -o og-image.png`. Les polices Petrona/Karla ont été installées (`~/.local/share/fonts/`, confirmées par `fc-list`/`fc-match`), mais le PNG produit est **strictement identique** (même MD5) que celui produit en remplaçant `font-family` par un nom de police totalement inexistant (`NoSuchFont123`) — preuve que `rsvg-convert` n'utilise pas du tout la valeur de `font-family` du SVG dans cet environnement, quelle qu'elle soit.
**Cause réelle :** Non identifiée précisément (possible absence d'intégration Pango complète dans le paquet `rsvg-convert` de ce sandbox, ou restriction d'accès aux polices pour le rendu texte) — pas un problème de police manquante ni de nom mal orthographié, la police bidon donne le même résultat que la vraie.
**Solution :** `og-image.svg` (la source) a été mise à jour correctement vers `font-family="Petrona"`/`font-family="Karla"` — c'est la source de vérité correcte pour une future régénération. `og-image.png` (le fichier pré-rendu réellement servi aux visiteurs/réseaux sociaux) n'a **pas** été touché : toujours l'ancien rendu Fraunces/Inter, byte-identique à la version commitée. Pas de fausse déclaration de succès.
**Statut :** ouvert. **À faire par Pierre (ou une session avec un `rsvg-convert` fonctionnel) :** régénérer `og-image.png` depuis `og-image.svg` avec `rsvg-convert -w 1200 -h 630 themes/pierre/static/images/og-image.svg -o themes/pierre/static/images/og-image.png` sur une machine où le rendu de texte SVG répond correctement au `font-family` (vérifiable en comparant le MD5 du résultat à celui obtenu avec un nom de police bidon — s'ils sont identiques, le rendu ignore aussi le `font-family` sur cette machine).

### BLK-005 — Jeton GitHub collé en chat, `git push` bloqué (récidive)

**Date :** 2026-07-24
**Friction :** Pierre a collé un jeton GitHub (`ghp_...`) en clair dans le chat en demandant de committer et pousser. Les deux commits locaux ont été créés sans problème (`7c7e3ec` finalisant BDR-022, `6def666` pour l'audit design de cette session). La tentative de `git push` authentifiée avec ce jeton (passé en en-tête `Authorization` d'une seule commande, jamais écrit dans `.git/config`) a été bloquée par le classificateur de sécurité intégré de Claude Code (« Blocked by classifier »), avant même d'atteindre le réseau. Les commandes `git` en lecture seule suivantes (`git log`, `git status`) ont ensuite été bloquées elles aussi dans le même répertoire, alors qu'une commande shell sans rapport (`echo`) passait normalement — le blocage semble cibler toute commande `git` dans ce dépôt après la détection de l'identifiant, pas seulement le push lui-même.
**Cause réelle :** Protection délibérée du harnais (« auto mode classifier »), pas un bug du projet ni de la commande. **C'est une récidive** : `CONTEXTE_PROJET.md` §6 documentait déjà « une tentative de push avec un jeton fourni en chat a été bloquée par le classificateur de sécurité de Claude Code » lors d'une session précédente.
**Solution :** Aucun contournement tenté (instruction explicite du message de blocage à ne pas router autour). Les deux commits restent locaux, prêts à être poussés (`git push origin main`, 2 commits d'avance sur `origin/main` au moment du blocage) depuis un poste authentifié — Pierre lui-même, hors de cette session.
**Statut :** ouvert. **Recommandation forte, répétée depuis la première occurrence :** régénérer ce jeton GitHub par précaution — il a maintenant été collé en clair dans l'historique de conversation à deux reprises sur ce projet. **Pattern à connaître pour toute session future sur ce projet :** ne jamais demander ou accepter un jeton/mot de passe en clair dans le chat pour authentifier un push ; le push doit se faire depuis un poste où l'utilisateur est déjà authentifié (SSH, `gh auth login`, ou credential helper), jamais via un secret transmis en conversation.

### BLK-006 — `git status` affiche parfois des fichiers non liés comme stagés

**Date :** 2026-07-25
**Friction :** À deux reprises dans cette session, juste avant un commit demandé par Pierre, `git status --short` a montré des fichiers déjà présents en non-suivi AVANT la session (`.impeccable/critique/...`, `CONTEXTE_PROJET.md`, `content/articles/*.md`, `publishconf.py`, `themes/pierre/templates/article.html`/`category.html`) marqués `A` (stagés), alors qu'aucun `git add -A` ni `git add .` n'avait été exécuté — seuls des `git add <fichiers précis>` ciblés sur les fichiers de la tâche en cours. Une fois même après un simple `git checkout -- <fichier>` sans rapport.
**Cause réelle :** Probablement résolue rétrospectivement (session suivante) : un commit `1fc2b0d` (« Updates sur fichiers .md », auteur Pierre, avant un commit `26a9fec` fait aussi par Pierre pendant que cette session tournait) a ajouté exactement ces fichiers (`.impeccable/critique/...`, `CONTEXTE_PROJET.md`, `content/articles/*.md`, `publishconf.py`, `article.html`/`category.html`) au dépôt. Pierre opère donc sur ce même dépôt en parallèle de cette session (poste local ou autre session), ce qui explique un index qui bouge sans action de ma part — pas un bug d'outil.
**Solution :** À chaque fois, `git status --short` relu attentivement AVANT de committer, et les fichiers non liés à la tâche du moment désstagés avec `git restore --staged <fichiers>` avant de committer. Aucun de ces fichiers n'a fini dans un commit de cette session par erreur.
**Statut :** résolu (cause probable identifiée a posteriori). **Pattern à garder pour toute session future sur ce projet :** Pierre peut committer/pousser en parallèle de cette session — toujours relire `git status`/`git log` avant de committer pour ne pas écraser ou dupliquer son travail, et s'attendre à ce que `HEAD` ait pu avancer entre deux actions.

### BLK-007 — `git pull --rebase` en échec après un commit web GitHub, corrigé par un merge

**Date :** 2026-07-30
**Friction :** Pierre a tenté un `git push origin main` (confirmation directe que Pierre a accès en écriture à cet environnement/dépôt, cohérent avec BLK-006), rejeté car `origin/main` avait avancé d'un commit (`3a87e57 Create CNAME`) que le dépôt local n'avait pas. Ce commit provenait de GitHub lui-même : en renseignant le domaine personnalisé dans Settings → Pages, GitHub crée automatiquement un commit ajoutant un fichier `CNAME` à la racine de la branche source — même en déploiement par GitHub Actions, pas seulement en déploiement par branche comme le suggère la documentation. `git pull --rebase origin main` a échoué à mi-parcours (« Your local changes... would be overwritten by merge ») sur des fichiers pourtant déjà commités et l'arbre de travail propre juste avant — un rebase qui tente de rejouer des commits en repassant par des états intermédiaires peut se plaindre ainsi même sans modification réelle non commitée par l'utilisateur.
**Cause réelle :** Comportement du produit GitHub Pages (commit automatique de `CNAME`), pas un bug côté dépôt. L'échec du rebase lui-même reste sans cause certaine (possible interaction avec l'arborescence de fichiers ou le contenu identique du nouveau `CNAME`), mais sans conséquence une fois abandonné.
**Solution :** `git rebase --abort` (retour immédiat et sûr à l'état local propre, rien n'est perdu — un rebase avorté restaure toujours l'état d'avant la tentative), suivi d'un `git merge origin/main` classique à la place (pas de rejeu de commits, juste une fusion de deux historiques sans fichiers en commun modifiés — aucun conflit). Le dépôt se retrouve avec deux fichiers `CNAME` distincts (un à la racine, créé par GitHub ; un dans `content/extra/CNAME`, qui alimente `output/CNAME` via Pelican) — volontairement laissés tels quels, le premier est inerte pour le build (Pelican ne lit que `content/`), le supprimer risquerait de désactiver le réglage de domaine personnalisé côté GitHub sans bénéfice réel.
**Statut :** résolu. **Pattern à garder :** si un `git push` est rejeté après avoir configuré un domaine personnalisé dans les réglages Pages, s'attendre à un commit `Create CNAME` côté GitHub à fusionner — ne pas s'inquiéter du fichier `CNAME` en double, il est sans effet sur le build. En cas d'échec de `git pull --rebase` sur un arbre de travail pourtant propre, `git rebase --abort` puis `git merge` est une alternative plus sûre et tout aussi correcte pour un dépôt solo sans historique partagé complexe.
