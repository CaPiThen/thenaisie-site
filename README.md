# thenaisiepierre.fr

Site personnel de Pierre Thenaisie — construit avec Pelican (Python) et déployé automatiquement sur OVH via GitHub Actions.

## Démarrage rapide

```bash
pip install pelican markdown
pelican content          # Génère le site en local dans /output
```

## Ajouter un article

Créer un fichier `.md` dans `content/articles/` avec ce header :

```markdown
Title: Mon titre
Date: 2026-03-28
Category: Blog
Slug: mon-slug-unique
Summary: Une phrase de résumé.

Ton contenu ici en Markdown...
```

## Déployer

```bash
git add .
git commit -m "nouvel article"
git push
```

→ GitHub Action génère et déploie automatiquement sur thenaisiepierre.fr

## Ajouter des images

Mettre les images dans `content/images/` et les référencer dans le Markdown :
```markdown
![Description](../images/maphoto.jpg)
```

## Secrets et variables GitHub à configurer

Dans Settings → Secrets and variables → Actions :

**Secrets** (onglet Secrets) :
- `FTP_USERNAME` : ton identifiant FTP OVH
- `FTP_PASSWORD` : ton mot de passe FTP OVH

**Variables** (onglet Variables) :
- `IMMICH_SHARE_URL` : l'URL du lien de partage public de l'album Immich à
  afficher sur la page Galerie (ex. `https://photos.thenaisiepierre.fr/s/xxxxx`).
  Absente → la page Galerie affiche simplement « à venir ».

## Galerie (photos depuis Immich)

La page Galerie ne stocke aucune photo sur OVH : `build_gallery.py` récupère,
**au moment du build**, la liste des photos du partage Immich désigné par
`IMMICH_SHARE_URL`, et régénère la section correspondante de
`content/pages/galerie.md` (entre les balises `GALERIE:START`/`GALERIE:END` —
ne pas éditer cette zone à la main, elle est écrasée à chaque build).

Pourquoi au moment du build plutôt que dans le navigateur du visiteur :
l'instance Immich ne renvoie pas d'en-têtes CORS, un `fetch()` côté client
serait bloqué silencieusement par tous les navigateurs. Une requête faite ici,
côté serveur, n'est pas soumise à cette restriction (propre aux navigateurs).

Pour tester en local avant de builder :
```bash
export IMMICH_SHARE_URL="https://photos.thenaisiepierre.fr/s/xxxxx"
python build_gallery.py
pelican content
```

Seuls les partages **publics sans mot de passe** sont gérés.
