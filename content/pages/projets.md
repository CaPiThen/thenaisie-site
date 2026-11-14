Title: Projets
Slug: projets
Seotitle: Projets personnels : auto-hébergement, domotique, automatisation
Subtitle: Ce que je construis en dehors des missions : une infrastructure auto-hébergée, de la domotique, des automatisations et quelques sites.
Description: Les projets personnels de Pierre Thenaisie : infrastructure auto-hébergée sur Proxmox, domotique Home Assistant, automatisations n8n, photothèque Immich et sites statiques.

<p class="lead">Ces projets sont mon terrain d'essai. J'y monte une architecture de bout en bout, je la casse, je la répare, et je regarde ce qui tient dans le temps. Ce que j'y apprends me sert ensuite en mission.</p>

<nav class="toc" aria-label="Sommaire">
<span class="toc-label">Sur cette page</span>
<ol>
<li><a href="#infrastructure">Infrastructure</a></li>
<li><a href="#domotique">Domotique</a></li>
<li><a href="#automatisations">Automatisations</a></li>
<li><a href="#sites">Sites web</a></li>
<li><a href="#methode">Ma façon de faire</a></li>
</ol>
</nav>

<h2 id="infrastructure">Infrastructure</h2>

<div class="projet">
<h3>Un serveur à la maison</h3>
<p>Mes services tournent chez moi, sur un hyperviseur Proxmox et un NAS qui sert de socle de données. Chaque service vit dans son conteneur, avec un accès distant maîtrisé. L'objectif est simple : garder la main sur mes données et savoir où elles se trouvent.</p>
<p class="projet__technos"><b>Outils :</b> Proxmox, conteneurs LXC et Docker, NAS.</p>
</div>

<div class="projet">
<h3>Une photothèque auto-hébergée</h3>
<p>Mes photos sont rangées et sauvegardées dans Immich, chez moi. La <a href="/galerie/">galerie</a> de ce site s'en sert : quand j'ajoute une photo à un album, elle apparaît sur la page à la publication suivante.</p>
<p class="projet__technos"><b>Outils :</b> Immich, script Python exécuté à la publication.</p>
</div>

<h2 id="domotique">Domotique</h2>

<div class="projet">
<h3>Une maison orchestrée par Home Assistant</h3>
<p>Home Assistant centralise les capteurs et les automatismes du logement. Le vrai sujet est l'interopérabilité : faire cohabiter proprement des équipements qui parlent MQTT, Zigbee ou Matter. Un chantier est en cours sur l'optimisation d'une pompe à chaleur.</p>
<p class="projet__technos"><b>Outils :</b> Home Assistant, MQTT, Zigbee, Matter.</p>
</div>

<div class="projet">
<h3>Une ventilation de combles pilotée par microcontrôleur</h3>
<p>Un projet d'électronique en cours : piloter la ventilation de combles avec un ESP32.</p>
<p class="projet__technos"><b>Outils :</b> ESP32.</p>
</div>

<h2 id="automatisations">Automatisations</h2>

<div class="projet">
<h3>Des routines confiées à n8n</h3>
<p>J'automatise ce qui revient chaque semaine. Un flux résume chaque matin les newsletters reçues. Un autre prépare mon planning hebdomadaire. Un troisième récupère mes séances de course sur Strava pour alimenter le suivi de mon plan d'entraînement.</p>
<p class="projet__technos"><b>Outils :</b> n8n, API Strava et Gmail, modèles de langage.</p>
</div>

<h2 id="sites">Sites web</h2>

<div class="projet">
<h3>Ce site</h3>
<p>Un site statique généré par Pelican et publié automatiquement à chaque modification. Pas de framework JavaScript, pas de cookie, pas de traceur, des polices servies depuis le site lui-même.</p>
<p class="projet__technos"><b>Outils :</b> Pelican, Python, HTML et CSS écrits à la main, Cloudflare Workers.</p>
</div>

<div class="projet">
<h3>Deux sites pour des proches</h3>
<p>Sur la même base technique, j'ai construit le site d'un club associatif et celui d'un cabinet libéral. Deux exercices utiles : écrire pour un public qui n'est pas le mien et livrer quelque chose que d'autres peuvent tenir à jour.</p>
<p class="projet__technos"><b>Outils :</b> Pelican, Python.</p>
</div>

<h2 id="methode">Ma façon de faire</h2>

<div class="prose">
<p>Je documente chaque décision au moment où je la prends, avec la raison et les options écartées. Six mois plus tard, c'est ce qui me permet de reprendre un projet sans tout redécouvrir.</p>
<p>Je vérifie sur le système réel plutôt que sur le raisonnement. Une configuration qui paraît correcte sur le papier ne prouve rien tant que le service n'a pas répondu.</p>
<p>Une question sur l'un de ces projets ? <a href="mailto:contact@thenaisiepierre.fr">Écrivez-moi</a>.</p>
</div>
