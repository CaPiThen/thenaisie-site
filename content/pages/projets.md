Title: Projets
Slug: projets
Seotitle: Projets personnels : auto-hébergement, domotique, automatisation
Subtitle: Ce que je construis en dehors des missions, et comment ça marche.
Description: Les projets personnels de Pierre Thenaisie, expliqués avec des schémas : serveur auto-hébergé sur Proxmox, domotique Home Assistant, aquarium connecté, automatisations n8n et sites statiques.

<p class="lead">Ces projets sont mon terrain d'essai. J'y monte une architecture de bout en bout, je la casse, je la répare, et je regarde ce qui tient dans le temps. Chaque section explique le principe, puis le montre en schéma.</p>

<nav class="toc" aria-label="Sommaire">
<span class="toc-label">Sur cette page</span>
<ol>
<li><a href="#infrastructure">Un serveur à la maison</a></li>
<li><a href="#domotique">La domotique</a></li>
<li><a href="#aquarium">L'aquarium connecté</a></li>
<li><a href="#automatisations">Les automatisations</a></li>
<li><a href="#sites">Les sites web</a></li>
<li><a href="#methode">Ma façon de faire</a></li>
</ol>
</nav>

<h2 id="infrastructure">Un serveur à la maison</h2>

<div class="prose">
<p>La plupart des services que j'utilise tournent chez moi plutôt que chez un fournisseur. La raison est simple : je veux savoir où sont mes données et pouvoir réparer moi-même ce qui tombe en panne.</p>
<p>Tout repose sur une seule machine, pilotée par Proxmox. Proxmox est un hyperviseur : il découpe un ordinateur en plusieurs petits ordinateurs indépendants, qu'on appelle des conteneurs. Chaque service a le sien. Si l'un plante ou si je rate une mise à jour, les autres continuent de tourner.</p>
<p>À côté, un NAS garde les fichiers : documents, photos, sauvegardes. Les services viennent y lire et y écrire, mais les données ne vivent jamais dans les conteneurs eux-mêmes. On peut donc reconstruire un service sans rien perdre.</p>
</div>

<div class="schema">
<ol class="flux flux--colonne">
<li>Moi, à la maison ou en déplacement<small>accès distant chiffré</small></li>
<li>
<div class="flux__groupe">
<p class="flux__titre">Proxmox : une machine, plusieurs conteneurs</p>
<ol class="flux flux--libre"><li>Home Assistant</li><li>Immich (photos)</li><li>n8n (automatisations)</li><li>Autres services</li></ol>
</div>
</li>
<li class="flux--auto">NAS<small>fichiers, photos, sauvegardes</small></li>
</ol>
<p class="schema__legende">Les conteneurs sont isolés les uns des autres. Tous lisent et écrivent sur le NAS, qui reste le seul endroit où vivent les données.</p>
</div>

<div class="prose">
<h3>Les photos, par exemple</h3>
<p>Immich est une photothèque que l'on héberge soi-même. Elle range les photos par date et par lieu, et les rend consultables depuis le téléphone. La <a href="/galerie/">galerie</a> de ce site s'appuie dessus : quand j'ajoute une photo à un album, elle apparaît sur la page à la publication suivante.</p>
</div>

<h2 id="domotique">La domotique</h2>

<div class="prose">
<p>Home Assistant est le chef d'orchestre du logement. Il reçoit les mesures des capteurs, applique les règles que j'ai écrites et garde l'historique.</p>
<p>La difficulté tient aux langues que parlent les appareils. Zigbee est un réseau radio très économe, pensé pour des capteurs sur pile. MQTT est une messagerie légère : un appareil publie une valeur, ceux qui sont abonnés la reçoivent. Matter est un standard plus récent, censé mettre les fabricants d'accord. Home Assistant traduit tout cela dans un seul langage, et c'est ce qui permet à un capteur d'une marque de piloter un appareil d'une autre.</p>
<p>Le chantier du moment porte sur l'optimisation d'une pompe à chaleur.</p>
</div>

<div class="schema">
<ol class="flux">
<li>Capteurs et appareils<small>Zigbee, MQTT, Matter</small></li>
<li class="flux--auto">Home Assistant<small>règles et historique</small></li>
<li>Automatismes<small>et tableaux de bord</small></li>
</ol>
</div>

<h2 id="aquarium">L'aquarium connecté</h2>

<div class="prose">
<p>C'est le projet que je lance. Il concerne un bac de discus, des poissons exigeants sur la qualité de l'eau. L'idée est de suivre le bac en continu au lieu de le contrôler de temps en temps, et d'automatiser les repas.</p>
<h3>Mesurer l'eau en continu</h3>
<p>Trois sondes plongent dans le bac : le pH, la température et la conductivité, qui renseigne sur la quantité de minéraux dissous. Un microcontrôleur ESP32 lit les sondes et envoie les valeurs en Zigbee à Home Assistant, qui trace les courbes.</p>
<p>La mesure demande de la rigueur. Une sonde de pH dérive en quelques semaines : il faut l'étalonner avec des solutions de référence, puis recommencer régulièrement. Le nitrate, lui, restera mesuré à la main. Je n'ai pas trouvé de capteur à la fois fiable et abordable, et un mauvais chiffre affiché en continu est pire que pas de chiffre du tout.</p>
<h3>Nourrir à heure fixe</h3>
<p>Le distributeur est un disque percé d'une fente, imprimé en 3D et monté sur un servomoteur. Quand la fente passe sous la réserve, une dose de granulés tombe. L'horaire des repas se règle dans Home Assistant : pour le changer, pas besoin de toucher à l'électronique.</p>
<p>Le projet en est à la conception. Le matériel est choisi, le montage reste à faire.</p>
</div>

<div class="schema">
<p class="flux__titre">Mesure</p>
<ol class="flux">
<li>Sondes<small>pH, température, conductivité</small></li>
<li>ESP32<small>lecture et envoi en Zigbee</small></li>
<li class="flux--auto">Home Assistant<small>courbes et historique</small></li>
</ol>
<p class="flux__titre">Repas</p>
<ol class="flux">
<li class="flux--auto">Home Assistant<small>horaire des repas</small></li>
<li>ESP32<small>commande reçue en Zigbee</small></li>
<li>Servomoteur et disque<small>une dose de granulés</small></li>
</ol>
</div>

<h2 id="automatisations">Les automatisations</h2>

<div class="prose">
<p>n8n est un outil qui enchaîne des actions entre plusieurs services, sous la forme d'un schéma que l'on dessine à l'écran. Je m'en sers pour ce qui revient chaque semaine et que je faisais à la main.</p>
<p>Chaque matin, un flux lit les newsletters arrivées dans ma boîte, les fait résumer par un modèle de langage et m'envoie un seul récapitulatif. Un autre prépare mon planning de la semaine à partir de mes tâches. Un troisième récupère mes séances de course sur Strava pour alimenter le suivi de mon plan d'entraînement.</p>
<p>Le principe est toujours le même : un déclencheur, une collecte, un traitement, un résultat lisible. Quand un flux casse, je sais à quelle étape regarder.</p>
</div>

<div class="schema">
<p class="flux__titre">Le récapitulatif des newsletters</p>
<ol class="flux">
<li>Chaque matin<small>déclencheur</small></li>
<li>Lecture des newsletters<small>collecte</small></li>
<li>Résumé par un modèle de langage<small>traitement</small></li>
<li class="flux--auto">Un seul récapitulatif<small>résultat</small></li>
</ol>
</div>

<h2 id="sites">Les sites web</h2>

<div class="prose">
<p>Ce site est un site statique : il n'y a pas de base de données ni de programme qui tourne à chaque visite. J'écris les pages dans des fichiers texte, un générateur nommé Pelican les assemble en pages web, et le résultat est publié tel quel. C'est rapide à charger et il y a très peu de choses à pirater.</p>
<p>Il n'utilise ni cookie ni traceur, et ses polices sont servies par le site lui-même. La publication est automatique : j'enregistre une modification, et la nouvelle version est en ligne quelques minutes plus tard.</p>
<p>Sur la même base, j'ai construit deux sites pour des proches, un club associatif et un cabinet libéral. Deux bons exercices : écrire pour un public qui n'est pas le mien, et livrer quelque chose que d'autres peuvent tenir à jour.</p>
</div>

<div class="schema">
<ol class="flux">
<li>Pages écrites en texte<small>et album photo</small></li>
<li>Pelican<small>assemble le site</small></li>
<li>Cloudflare<small>publie et sert les pages</small></li>
<li class="flux--auto">Votre navigateur</li>
</ol>
</div>

<h2 id="methode">Ma façon de faire</h2>

<div class="prose">
<p>Je documente chaque décision au moment où je la prends, avec la raison et les options écartées. Six mois plus tard, c'est ce qui me permet de reprendre un projet sans tout redécouvrir.</p>
<p>Je vérifie sur le système réel plutôt que sur le raisonnement. Une configuration qui paraît correcte sur le papier ne prouve rien tant que le service n'a pas répondu.</p>
<p>Une question sur l'un de ces projets ? <a href="mailto:contact@thenaisiepierre.fr">Écrivez-moi</a>.</p>
</div>
