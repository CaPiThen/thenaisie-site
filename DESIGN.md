# Design : carte de course

Règles durables de l'identité du site (décision BDR-052, 2026-11-14). Les valeurs exactes vivent dans `themes/pierre/static/css/style.css`.

## Idée

Le parcours de Pierre se lit comme une course d'orientation, un sport qu'il pratique. La carte de l'accueil en est la seule illustration. Le reste du site est un document technique sobre.

## Couleurs

- Papier froid `#f3f5f4` en fond, blanc pour les cartes et schémas, encre `#101417` pour le texte.
- Orange balise `#ff5b14` : toujours en aplat (bouton principal, bandeau de contact, soulignement des liens, tracés de la carte). Jamais en texte : le texte orange utilise `#b03600`.
- Brun des courbes de niveau, réservé à la carte.
- Rouge et vert réservés aux schémas médicaux de la page MICI.
- Une seule section sombre par page au maximum.

## Typographie

- Archivo variable. Titres en largeur 75 %, graisse 800. Libellés et boutons en largeur normale, graisse 550 à 750.
- Atkinson Hyperlegible Next pour le texte courant.
- Pas de police à chasse fixe, pas de petites capitales espacées au-dessus des sections.

## Formes

- Angles droits partout, filets de 1 px (gris) ou 1,5 px (encre), aucune ombre, aucun dégradé.
- Pas de cartes : des lignes séparées par des filets.
- Encarts sur aplat gris ou orange pâle, sans bordure latérale colorée.

## Schémas

- Un schéma explicatif s'écrit en HTML avec `.flux` (étapes reliées par des flèches) ou `.couloirs` (qui fait quoi). Il passe à la verticale sur mobile.
- Le SVG reste réservé à la carte de l'accueil et aux schémas médicaux du guide.
- Orange pour un blocage ou un écart, encre pleine pour le résultat.

## Mouvement

- Une seule animation d'identité : le tracé de l'itinéraire sur la carte, au chargement.
- La galerie ouvre les photos dans la page, sur fond encre, jamais dans un nouvel onglet.
- La page MICI garde le tracé de ses schémas et ses compteurs.
- Aucune apparition au défilement. `prefers-reduced-motion` coupe tout.

## Contenu

- L'accueil parle du métier. Le guide sur la rectocolite hémorragique n'y figure pas : il se trouve par la recherche et par le pied de page.
- La galerie montre les photos sans expliquer la technique derrière.
- Aucune date sur les formations. Les dates des emplois restent.
- Pas de répétition entre l'accueil et les autres pages : l'accueil explique la méthode de travail, le Parcours liste les postes, Projets détaille les réalisations personnelles.
- Sur un sujet technique : expliquer le principe en mots simples, puis le montrer en schéma.
- La carte de l'accueil montre les étapes d'une mission, pas les employeurs.
- Aucun chiffre ni fait qui ne vienne de Pierre ou d'une source citée.
- Aucun script ni style en ligne dans les gabarits : la CSP de `content/extra/_headers` les bloquerait.
