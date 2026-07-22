AUTHOR = 'Pierre Thenaisie'
SITENAME = 'Pierre Thenaisie'
SITESUBTITLE = "Consultant en transformation des processus métier. Parcours, projets techniques, et vivre avec une MICI."
SITEURL = 'https://thenaisiepierre.fr'
STATIC_PATHS = ['images']

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

PAGE_URL = 'pages/{slug}.html'
PAGE_SAVE_AS = 'pages/{slug}.html'

# On ne génère aucune page liée aux articles.
ARCHIVES_SAVE_AS = ''
CATEGORIES_SAVE_AS = ''
CATEGORY_SAVE_AS = ''
TAGS_SAVE_AS = ''
TAG_SAVE_AS = ''
AUTHORS_SAVE_AS = ''
AUTHOR_SAVE_AS = ''

RELATIVE_URLS = True
