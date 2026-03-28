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

## Secrets GitHub à configurer

Dans Settings → Secrets → Actions :
- `FTP_USERNAME` : ton identifiant FTP OVH
- `FTP_PASSWORD` : ton mot de passe FTP OVH
