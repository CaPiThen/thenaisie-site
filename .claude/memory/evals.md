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
