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
