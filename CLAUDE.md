# thenaisiepierre.fr

Site personnel de Pierre Thenaisie : vitrine de sa vie et des sujets qui l'intéressent (parcours professionnel, portfolio technique, vécu avec la RCH, galerie photo). Site statique généré avec Pelican, sans framework JS ni build — les effets visuels (shaders) sont écrits en GLSL/JS vanilla.

## Mémoire du projet — `.claude/memory/`

Ce projet tient 5 registres de mémoire dans `.claude/memory/` :

| Registre | Contenu |
|---|---|
| `decisions.md` | Décisions structurantes (BDR-XXX) : quoi, pourquoi, alternatives écartées, statut |
| `learnings.md` | Patterns observés à réutiliser (LRN-XXX) |
| `blockers.md` | Frictions rencontrées, cause réelle, solution (BLK-XXX) |
| `journal.md` | Journal de session, 3-5 lignes par date |
| `evals.md` | Évaluations de sorties produites : méthode, anomalies, action (EVAL-XXX) |

**Au début de chaque session, lire les 5 registres avant d'agir.** Ils contiennent le contexte que le CLAUDE.md seul ne peut pas porter (historique des choix, bugs déjà résolus, ce qui a déjà été essayé).

### Règle de capitalisation

- **`decisions.md`** : capitaliser dès qu'un choix engage la suite du projet (architecture, palette, contenu structurant) — pas les micro-ajustements réversibles en une ligne.
- **`learnings.md`** : capitaliser dès qu'un pattern s'est révélé vrai deux fois ou a coûté du temps à découvrir la première fois (ex. un bug de contraste, un piège d'outil).
- **`blockers.md`** : capitaliser toute friction qui a bloqué l'avancement plus de quelques minutes, même si contournée — avec la cause réelle, pas le premier symptôme.
- **`journal.md`** : une entrée par session, 3 à 5 lignes maximum, factuelle.
- **`evals.md`** : capitaliser à chaque fois qu'une sortie (contenu, design, code) a été vérifiée avec une méthode explicite — surtout si l'évaluation a trouvé une anomalie.

### Rituel de fermeture de session

Avant de terminer une session de travail sur ce projet, répondre à 3 questions et capitaliser en conséquence :
1. **Qu'est-ce qui a été décidé ?** → `decisions.md` si structurant.
2. **Qu'est-ce qui a été appris ?** → `learnings.md` si réutilisable.
3. **Qu'est-ce qui a bloqué ?** → `blockers.md` si ça a coûté du temps.

Puis toujours une ligne dans `journal.md`, quelle que soit la session.
