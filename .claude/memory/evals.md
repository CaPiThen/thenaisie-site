---
registre: evals
id_format: EVAL-XXX
description: Évaluations de sorties produites (contenu, design, code) — méthode utilisée, anomalies trouvées, décision prise.
champs:
  - id: identifiant unique EVAL-XXX
  - date: AAAA-MM-JJ
  - output: ce qui a été évalué
  - methode_eval: comment ça a été vérifié concrètement
  - anomalies: ce qui a été trouvé de faux ou fragile
  - action: keep | correct | deprecate
---

# Évaluations — thenaisiepierre.fr

## Index

| ID | Date | Output | Action |
|---|---|---|---|
| EVAL-001 | 2026-07-21 | Page « Vivre avec la RCH » (contenu médical) | correct puis keep |
| EVAL-002 | 2026-07-21 | Cartes de verre du hero immersif (accueil) | correct puis keep |
| EVAL-003 | 2026-07-24 | Audit design/animations complet (`/impeccable critique`) + 7 correctifs appliqués | correct |
| EVAL-004 | 2026-11-14 | Refonte complète BDR-052 (6 pages) | keep, en attente de relecture de Pierre |

## Entrées

### EVAL-001 — Page « Vivre avec la RCH »

**Date :** 2026-07-21
**Output :** Page longue mêlant vécu personnel, informations scientifiques (causes, diagnostic, traitements), alimentation, stress, conseils pratiques.
**Méthode d'éval :** Chaque affirmation médicale sourcée individuellement (INSERM, ameli, afa Crohn RCH France, étude PubMed/*Cell* 2023) ; chaque URL vérifiée par récupération réelle avant publication. Historique médical personnel de Pierre non inventé (dates, traitements, hospitalisations) faute de les connaître.
**Anomalies :** Aucune affirmation non sourcée détectée. Lacune assumée : les détails médicaux personnels de Pierre restent à compléter par lui, pas par l'IA.
**Action :** keep, avec relecture demandée à Pierre avant toute diffusion large (contenu santé signé de son nom).

### EVAL-002 — Cartes de verre du hero immersif

**Date :** 2026-07-21
**Output :** Sommaire de l'accueil noyé dans le shader, cartes en verre translucide.
**Méthode d'éval :** Recomposition pixel par pixel (shader + voile + verre) sur 12 instants de l'animation, calcul du ratio de contraste WCAG pour le titre et le texte de paragraphe.
**Anomalies :** Première version (verre clair, blanc 9 %) : texte de paragraphe à 3,83:1, sous le seuil AA (4,5:1) à l'instant le plus lumineux du shader.
**Action :** correct — passage à un verre sombre (`rgba(5,16,10,0.58)`), nouveau contraste 13,17:1 / 8,65:1 → keep.

### EVAL-003 — Audit design/animations complet + correctifs

**Date :** 2026-07-24
**Output :** Revue du style et des animations du site entier (accueil, CV, RCH, galerie) via `/impeccable critique`, suivie de l'exécution des 7 actions recommandées (`/impeccable polish`, `optimize`, `typeset`, `layout`, `quieter`, `clarify`, `polish` final).
**Méthode d'éval :** Deux évaluations isolées en sous-agents parallèles (Assessment A design, sans détecteur ; Assessment B détecteur `detect.mjs` + tentative de preuve navigateur, indisponible cette session) — synthèse croisée, pas de simple concaténation. Chaque correctif ensuite vérifié par un vrai build Pelican (venv jetable) et une réexécution du détecteur, jamais par relecture seule.
**Anomalies trouvées :** contraste ~1,8:1 sur le titre d'accueil (P0) ; aucun lien retour vers l'accueil sur aucune page (P1) ; 169 Ko de GSAP/Anime.js dupliquant des équivalents déjà présents dans le repo (P1) ; duo Fraunces/Inter signalé « générique IA » par le détecteur (P2) ; `cv.html` sans sommaire contrairement à `maladie.html` (P2) ; compteurs animés sur des chiffres épidémiologiques (P3) ; densité de tirets cadratins en prose (P3, 28 sur `cv.html`, 41 sur `maladie.html`).
**Action :** correct pour les 7 points — score heuristique passé de 24/32 (75 %, « Bon ») avant correctifs ; poids JS 220→12 Ko, poids polices 404→156 Ko, poids site total 984→405 Ko. Un point non résolu avec certitude : régénération de `og-image.png` avec les nouvelles polices (voir BLK-004), source SVG à jour mais rendu PNG non vérifiable dans ce sandbox — signalé à Pierre plutôt que masqué.


### EVAL-004 — Refonte complète BDR-052

**Date :** 2026-11-14
**Sortie évaluée :** accueil, Parcours, Projets, Galerie, Guide MICI, Mentions légales, 404, image de partage.
**Méthode :** build Pelican réel dans un dossier temporaire, captures chromium headless à 1440 px et 375 px sur chaque page, relecture visuelle, détecteur impeccable (`detect.mjs`) sur les pages générées et la feuille de style, recherche de tirets cadratins et de formules « n'est pas X, c'est Y » dans les textes, vérification de l'absence de style et de script en ligne (compatibilité CSP).
**Anomalies trouvées et corrigées :** étiquettes de la carte trop petites puis en chevauchement ; frise tronquée dans une colonne trop étroite ; trois phrases que je ne pouvais pas sourcer retirées (délai de réponse aux e-mails, stage poursuivi à distance, capteurs de température du projet de ventilation) ; chaîne Python mal fermée dans `build_gallery.py` ; tiret cadratin dans l'en-tête de `style.css`.
**Action :** keep. Détecteur : 0 signalement. Non vérifié : comportement réel de `_headers` et de `not_found_handling` sur Cloudflare (lu dans la documentation, à contrôler après le premier déploiement), étiquettes des schémas SVG de la page MICI petites à 375 px (existant, non traité).
