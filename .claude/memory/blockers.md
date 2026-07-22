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
