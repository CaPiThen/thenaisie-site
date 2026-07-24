import subprocess

AUTHOR = 'Pierre Thenaisie'
SITENAME = 'Pierre Thenaisie'
SITESUBTITLE = "Consultant en transformation des processus métier. Parcours, projets techniques, et vivre avec une MICI."
SITEURL = 'https://thenaisiepierre.fr'
# Distincte de SITEURL : Pelican réécrit SITEURL en chemin relatif dans les
# templates quand RELATIVE_URLS=True (voir pelican/writers.py, _get_localcontext),
# donc inutilisable pour les balises qui exigent une URL absolue (canonical,
# Open Graph, Twitter Card). SITE_ABSOLUTE_URL n'est pas un nom réservé par
# Pelican : il traverse les templates sans jamais être réécrit.
SITE_ABSOLUTE_URL = 'https://thenaisiepierre.fr'
STATIC_PATHS = ['images']

# Casse-cache pour CSS/JS/polices : sans ça, un visiteur qui a déjà chargé
# le site garde l'ancien style.css en cache même après un déploiement (même
# nom de fichier = pas de rechargement forcé). Ajouté en query string sur
# les liens statiques dans base.html (?v=...). Le hash court du commit
# change à chaque déploiement réel ; en repli (pas de dépôt git, ex. build
# local hors repo), un horodatage garde quand même le cache-busting actif.
try:
    ASSET_VERSION = subprocess.check_output(
        ['git', 'rev-parse', '--short', 'HEAD'],
        stderr=subprocess.DEVNULL,
    ).decode().strip()
except (subprocess.CalledProcessError, FileNotFoundError):
    import time
    ASSET_VERSION = str(int(time.time()))

PATH = 'content'
THEME = 'themes/pierre'

TIMEZONE = 'Europe/Paris'
DEFAULT_LANG = 'fr'

# Site composé uniquement de pages : plus de blog ni de flux d'articles.
PAGE_PATHS = ['pages']
ARTICLE_PATHS = []

DISPLAY_PAGES_ON_MENU = False
DISPLAY_CATEGORIES_ON_MENU = False

# Pas de navigation globale : chaque page est volontairement cloisonnée.
MENUITEMS = ()

FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# URLs propres : /cv/ plutôt que /pages/cv.html. `{slug}/index.html` est le
# format standard pour ça sur un hébergement statique classique — un
# serveur sert automatiquement index.html quand un dossier est demandé,
# aucune configuration serveur (.htaccess, réécriture d'URL) n'est
# nécessaire, contrairement à un format qui retirerait aussi le `/` final.
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'

# On ne génère aucune page liée aux articles.
ARCHIVES_SAVE_AS = ''
CATEGORIES_SAVE_AS = ''
CATEGORY_SAVE_AS = ''
TAGS_SAVE_AS = ''
TAG_SAVE_AS = ''
AUTHORS_SAVE_AS = ''
AUTHOR_SAVE_AS = ''

RELATIVE_URLS = True
