"""
Récupère les photos d'un album partagé Immich AU MOMENT DU BUILD, pas dans le
navigateur du visiteur : testé en direct contre l'instance de Pierre, elle
n'envoie aucun en-tête CORS (Access-Control-Allow-Origin absent même avec un
Origin envoyé) — un fetch() côté client échouerait silencieusement sur tous
les navigateurs. Un script exécuté ici, avant `pelican content`, fait la même
requête HTTP mais depuis le serveur : aucune restriction CORS ne s'applique
(CORS est une politique de navigateur, pas une règle réseau). Les <img> du
HTML généré chargeront ensuite les vignettes directement depuis Immich sans
problème, un <img src> n'étant jamais soumis à CORS contrairement à fetch().

N'utilise que le lien de partage public d'Immich (paramètre slug OU key,
jamais de clé API personnelle) — voir .claude/memory/decisions.md (BDR-019,
révisé) pour le contexte complet.

Configuration : variable d'environnement IMMICH_SHARE_URL (l'URL complète du
partage, ex. https://photos.thenaisiepierre.fr/s/testimmich). Absente ou
injoignable -> le script ne touche pas à galerie.md, le bloc "à venir" reste
affiché tel quel.

Réécrit uniquement le bloc balisé entre GALERIE:START et GALERIE:END dans
content/pages/galerie.md ; n'écrit sur disque que si le contenu calculé
diffère du contenu déjà présent (idempotent : pas de bruit git si l'album n'a
pas changé depuis le dernier build).
"""

import html
import json
import os
import sys
import urllib.error
import urllib.request
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
GALERIE_PATH = os.path.join(ROOT, "content", "pages", "galerie.md")
START = "<!-- GALERIE:START -->"
END = "<!-- GALERIE:END -->"
TIMEOUT = 10


#: Le Cloudflare devant l'instance Immich renvoie 403 aux requêtes sans
#: User-Agent de navigateur (bloque le défaut Python-urllib/x.y, testé en
#: direct) — sans rapport avec une quelconque protection du contenu, déjà
#: public via le lien de partage : juste une heuristique anti-bot à satisfaire.
_HEADERS = {
    "Accept": "application/json",
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
}


def fetch_json(url):
    req = urllib.request.Request(url, headers=_HEADERS)
    with urllib.request.urlopen(req, timeout=TIMEOUT) as res:
        return json.load(res)


def get_share_assets(share_url):
    """Essaie slug puis key (Immich accepte l'un ou l'autre selon le type de
    partage) ; renvoie (base_url, param_name, identifiant, liste d'assets)."""
    parsed = urlparse(share_url)
    base = "{}://{}".format(parsed.scheme, parsed.netloc)
    ident = parsed.path.rstrip("/").rsplit("/", 1)[-1]
    if not ident:
        return None

    for param in ("slug", "key"):
        api_url = "{}/api/shared-links/me?{}={}".format(base, param, ident)
        try:
            data = fetch_json(api_url)
            return base, param, ident, data.get("assets", [])
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError):
            continue
    return base, None, ident, None


def render_gallery_html(base, param, ident, assets):
    images = [a for a in assets if a.get("type") == "IMAGE"]
    if not images:
        return (
            '<div class="gallery-empty" id="galerie-empty">\n'
            '<span>//</span> l’album partagé est joignable mais ne contient '
            "aucune photo pour l’instant.\n</div>"
        )

    items = []
    for asset in images:
        aid = asset["id"]
        alt = html.escape(asset.get("originalFileName", ""))
        thumb = "{}/api/assets/{}/thumbnail?{}={}".format(base, aid, param, ident)
        full = "{}/api/assets/{}/original?{}={}".format(base, aid, param, ident)
        items.append(
            '<div class="photo-item"><a href="{full}" target="_blank" '
            'rel="noopener"><img src="{thumb}" loading="lazy" alt="{alt}">'
            "</a></div>".format(full=full, thumb=thumb, alt=alt)
        )

    return '<div class="gallery-masonry">\n' + "\n".join(items) + "\n</div>"


def main():
    share_url = os.environ.get("IMMICH_SHARE_URL", "").strip()

    if not os.path.exists(GALERIE_PATH):
        print("build_gallery: {} introuvable, rien à faire.".format(GALERIE_PATH))
        return

    with open(GALERIE_PATH, encoding="utf-8") as f:
        source = f.read()

    if START not in source or END not in source:
        print("build_gallery: marqueurs GALERIE:START/END absents, rien à faire.")
        return

    if not share_url:
        print("build_gallery: IMMICH_SHARE_URL non défini, galerie laissée telle quelle.")
        return

    result = get_share_assets(share_url)
    if result is None:
        print("build_gallery: IMMICH_SHARE_URL mal formée, ignoré.")
        return

    base, param, ident, assets = result
    if assets is None:
        print("build_gallery: partage Immich injoignable (réseau, clé invalide, ou "
              "protégé par mot de passe — non géré par ce script) ; galerie laissée "
              "telle quelle.")
        return

    new_block = render_gallery_html(base, param, ident, assets)
    before, _, rest = source.partition(START)
    _, _, after = rest.partition(END)
    new_source = before + START + "\n" + new_block + "\n" + END + after

    if new_source == source:
        print("build_gallery: aucun changement ({} photo(s)).".format(
            len([a for a in assets if a.get("type") == "IMAGE"])
        ))
        return

    with open(GALERIE_PATH, "w", encoding="utf-8") as f:
        f.write(new_source)
    print("build_gallery: galerie.md mis à jour ({} photo(s)).".format(
        len([a for a in assets if a.get("type") == "IMAGE"])
    ))


if __name__ == "__main__":
    sys.exit(main())
