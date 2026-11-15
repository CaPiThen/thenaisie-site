import os
import subprocess

AUTHOR = 'Pierre Thenaisie'
SITENAME = 'Pierre Thenaisie'
SITESUBTITLE = "Pierre Thenaisie, consultant en transformation des processus métier chez PwC. Ingénieur ESILV, diplômé de l'EM Normandie. Parcours, projets et contact."
SITEURL = 'https://thenaisiepierre.fr'
# Distincte de SITEURL : Pelican réécrit SITEURL en chemin relatif dans les
# templates quand RELATIVE_URLS=True (voir pelican/writers.py, _get_localcontext),
# donc inutilisable pour les balises qui exigent une URL absolue (canonical,
# Open Graph, Twitter Card). SITE_ABSOLUTE_URL n'est pas un nom réservé par
# Pelican : il traverse les templates sans jamais être réécrit.
SITE_ABSOLUTE_URL = 'https://thenaisiepierre.fr'
STATIC_PATHS = ['images', 'extra']
# Fichiers servis à la racine du site : robots.txt, et _headers (en-têtes
# de sécurité lus par Cloudflare Workers Static Assets, voir BDR-052).
EXTRA_PATH_METADATA = {
    'extra/robots.txt': {'path': 'robots.txt'},
    'extra/_headers': {'path': '_headers'},
    'extra/favicon.ico': {'path': 'favicon.ico'},
    'extra/_redirects': {'path': '_redirects'},
}

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

# Courbes de niveau du hero (accueil) : relief synthétique tracé par
# data/contours.py (marching squares, graine fixe), voir BDR-052. Gardées
# hors du template Jinja (illisibles inline) et hors de STATIC_PATHS (ce
# sont des fragments de coordonnées, pas des fichiers à servir tels quels).
_data_dir = os.path.join(os.path.dirname(__file__), 'data')
with open(os.path.join(_data_dir, 'hero-contours.path')) as f:
    HERO_CONTOURS_D = f.read().strip()
with open(os.path.join(_data_dir, 'hero-contours-index.path')) as f:
    HERO_CONTOURS_INDEX_D = f.read().strip()

PATH = 'content'
THEME = 'themes/pierre'

TIMEZONE = 'Europe/Paris'
DEFAULT_LANG = 'fr'

# Site composé uniquement de pages : plus de blog ni de flux d'articles.
PAGE_PATHS = ['pages']
ARTICLE_PATHS = []

DISPLAY_PAGES_ON_MENU = False
DISPLAY_CATEGORIES_ON_MENU = False

# Navigation globale (BDR-052, remplace BDR-001). La page RCH reste hors
# du menu : elle est reliée depuis l'accueil et le pied de page.
MENUITEMS = (
    ('Parcours', 'cv'),
    ('Projets', 'projets'),
    ('Galerie', 'galerie'),
)

# Plan du site : gabarit direct `sitemap.html`, écrit en sitemap.xml.
DIRECT_TEMPLATES = ['index', 'sitemap']
SITEMAP_SAVE_AS = 'sitemap.xml'

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
