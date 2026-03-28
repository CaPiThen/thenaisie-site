AUTHOR = 'Pierre Thenaisie'
SITENAME = 'Pierre Thenaisie'
SITESUBTITLE = 'Ma vie, mes voyages, mes expériences.'
SITEURL = ''

PATH = 'content'
THEME = 'themes/pierre'

TIMEZONE = 'Europe/Paris'
DEFAULT_LANG = 'fr'

PAGE_PATHS = ['pages']
ARTICLE_PATHS = ['articles']

DISPLAY_PAGES_ON_MENU = False
DISPLAY_CATEGORIES_ON_MENU = False

MENUITEMS = (
    ('Accueil', '/'),
    ('À propos', '/pages/a-propos.html'),
    ('Blog', '/category/blog.html'),
    ('Photos', '/pages/photos.html'),
)

FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

ARTICLE_URL = 'blog/{slug}.html'
ARTICLE_SAVE_AS = 'blog/{slug}.html'
PAGE_URL = 'pages/{slug}.html'
PAGE_SAVE_AS = 'pages/{slug}.html'

DEFAULT_PAGINATION = 5
STATIC_PATHS = ['images']
RELATIVE_URLS = True
