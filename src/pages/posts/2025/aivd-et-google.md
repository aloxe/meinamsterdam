---
layout: base
title: Google recrute des agents secrets aux Pays-Bas
description: 
categorie: nederlandjes
tags:
 - internet
 - web
 - politique
isMarkdown: true
thumbnail: google-sollicitatie.ftm.png
image_alt: demi Trump faisant le big brother sur un écran
date: 2025-12-10
update: 2024-12-10
---

L'histoire qui suit est née d'un petit skeet (un post sur le réseau bluesky) de Bert Hubert signalant que l'AIVD envoie une notification à Google à chaque fois qu'un candidat postule à cette agence.

<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:gxyehbdrd7oxjj4nfbwxbtoz/app.bsky.feed.post/3lfknkqpm2c26" data-bluesky-cid="bafyreieh6hdf5oseqfzx6xrr5ivpx23zqne7h4c4x5jgb3szoiusflyauq" data-bluesky-embed-color-mode="system"><p lang="nl">Het is 2025 en je kunt nog steeds niet bij de AIVD solliciteren zonder dat er expliciet bericht naar Google gaat. We zeuren hier al drie jaar over, maar er is kennelijk Niets Aan Te Doen. Er is een speciale aparte knop voor AIVD sollicitaties, maar ook die meldt zich eerst bij Google.<br><br><a href="https://bsky.app/profile/did:plc:gxyehbdrd7oxjj4nfbwxbtoz/post/3lfknkqpm2c26?ref_src=embed">[image or embed]</a></p>&mdash; Bert Hubert 🇺🇦🇪🇺🇺🇦 (<a href="https://bsky.app/profile/did:plc:gxyehbdrd7oxjj4nfbwxbtoz?ref_src=embed">@berthub.eu</a>) <a href="https://bsky.app/profile/did:plc:gxyehbdrd7oxjj4nfbwxbtoz/post/3lfknkqpm2c26?ref_src=embed">12 January 2025 at 17:33</a></blockquote><script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>

Les copies d'écran montrent les requètes envoyées par les candidats à `google-analytics.com`. Il n'y a rien de bien malicieux ici, il s'agit d'une requète pour compter les clics et pouvoir produire des analyses de fréquentation du site. De milions de sites utilisent Google Analytics à cette fin. Même le blog que vous lises l'a utilisé il y a quelques années ce qui m'a permis de [vous partager quelques tendances](/mon-black-friday/).

Rien de bien malicieux ? Ce n'est pas si sûr. Rappelons que Google est une entreprise participant au [programme de surveillence PRISM](https://fr.wikipedia.org/wiki/PRISM_(programme_de_surveillance)) révélé par Edward Snowden en 2013. Que c'est une entreprise Étasunienne, [soumise au Cloud Act](/cloud-merite-notre-confiance/) permettant à la justice des états-Unis d'obtenir les données dont elle a besoin.

Pour ma part j'ai supprimé le pistage des visiteurs par Google depuis plusieurs années. Mais nombre de sites web continuent de l'utiliser, comme l'AIVD.

## L'Algemene Inlichtingen- en Veiligheidsdienst 

Il faut préciser que l'AIVD c'est l'*Algemene Inlichtingen- en Veiligheidsdienst*, c'est à dire le Service général de Renseignement- et de Sécurité, l'équivalent de la direction générale de la Sécurité intérieure en France. Les candidats recrutés par cette agence sont donc de potentiels futurs espions, des gens ammener à garder le secret sur leurs activités.

Faire des stats n'a rien de bien malicieux mais dans ce contexte on voit bien la véhémence de Bert Hubert qui partage publiquement son agacement :

> Nous sommes en 2025 et on ne peux toujours pas postuler à l’AIVD sans qu’un message explicite soit envoyé à Google. Nous nous plaignons de cela depuis trois ans, mais apparemment, il n’y a Rien à Faire. Il y a un bouton spécial pour les candidatures à l’AIVD, mais celui-ci s’adresse d’abord à Google.

# Bert Hubert

<!-- https://berthub.eu/ -->
Bert Hubert n'est pas le premier venu, il est le créateur d'un serveur (libre) DNS utilisé largement dans le monde pour servir les noms de domaine ([comme mon .nl](/trois-millions-de-domaines/)). Il est surtout un expert en cybersécurité et ancien membre d’un organe de régulation des services de renseignement. Lorsqu'il parle de demande répétés depuis trois ans on immagine qu'elles sont adressées aux bonne personnes et que ses remarques sont considérées avec sérieux.

Nous avons donc un processus de recrutement qui partage d'information de candidature de chaque candidat avec un tiers à l'étranger. Cela semble paradoxal pour une agence de renseignement mais cela dure depuis des années.

# Derk Boswijk

Le skeet de Bert Hubert n'est pas passé inaperçu parce qu'il a fait réagir Derk Boswijk qui a adressé des questions à l'expert en sécurité. Derk Boswijk n'est pas un agent secret (ou du moins ce n'est pas dans sa biographie officielle) mais il est député d'opposition à la chambre basse (*Tweede Kamer*) des Pays-Bas. Il n'est pas au gouvernement mais peut se saisir de l'affaire. Il est membre de la commission de la défense et porte-parole du CDA pour la justice et la sécurité, la défense, et les affaires étrangères.

Après que Bert Hubert lui a expliqué les détails techniques, le député s'est fendu d'[une question au gouvernement](https://www.tweedekamer.nl/kamerstukken/kamervragen/detail?id=2025Z00722&did=2025D07118). R.P. Brekelmans, le ministère de la défense lui a répondu en février que c'était sans risque parce que le pistage de google ne s'éfectuait pas sur le site de l'AIVD mais sur werkenvoornederland.nl et que ce dernier utilisait Google Analytics 4 (GA4) avec le plus haut niveau de confidentialité respectant la vie privée.

## Werken voor Nederland

Le site werkenvoornederland.nl est le portail de recrutement de l'État. Tous les recrutements de tous les ministères y sont centralisés ce qui est pratique pour les candidats à la fonction publique. Quand les candidats cliquent sur « postuler », ils sont redirigés sur le site du ministère ou de l'agence proposant le poste, où ils peuvent envoyer leur CV et autres documents demandés.

L'AIVD n'utilise pas Google Analytics mais comme les candidats doivent passer par le site général de recrutement des fonctionnaires c'est bien ce dernier site qui est mis en cause par Bert Hubert. Hélas, la réponse du ministre semble lui rétorquer que tout va bien et que rien ne doit changer.


Néamoins, le ministre a ajouté que les outils d'analyses de trafic des sites web gouvernementaux étaient de plus en plus examinés et que la protection de la vie privée et la sécurité des données étaient en train d'être discutées.

> Ten slotte wordt de trend gesignaleerd dat het gebruik van analytics-tools binnen overheidsorganisaties in het algemeen steeds vaker onder de loep wordt genomen. De discussie over privacy en databeveiliging is de afgelopen jaren daarmee sterk toegenomen, en dit heeft ook terechte gevolgen voor de keuze van softwaretools.

# La souveraineté numérique

Cet épisode rappelle un débat récurent dans toute l'Europe où le manque de maîtrise des outils numériques par les institutions publiques, les rendent dépendantes des géants américains comme Google, alors qu’elles  devraient protéger les données sensibles des citoyens.

Ces questions animent la société néerlandaise à l'heure où l'administration des États-Unis use ostendiblement de la dépendance en ses produits technologiques. En mai 2025, Karim Khan, procureur général de la Cour pénale internationale siàgant à la Haye, a perdu l’accès à son compte Microsoft 365, incluant sa messagerie professionnelle, à la suite de sanctions imposées par l’administration de Donald Trump. 

# GA4 supprimé en douce

<!-- https://www.politico.eu/article/the-netherlands-shuts-off-google-tracking-spy-job-listings/ -->
!["Google mag niet meer meekijken bij sollicitaties geheime dienst" avec une infographie qui montre un demi Trump faisant le big brother sur un écran](google-sollicitatie.ftm.png){.center}
C'est dans ce contexte que le magazine d'investigation en ligne Follow the Money (ftm.nl) [a révélé](https://www.ftm.nl/artikelen/stop-google-tracking-sollicitatie-aivd-mivd) le 3 décembre 2025 que Google ne peut plus suivre les candidats qui postulent à un emploi auprès des services secrets néerlandais. La plateforme de recrutement werkenvoornederland.nl ainsi que le site du ministère des affaires étrangères ont été modifiés pour supprimer les trackers Google Analytics.

Cependant, l’article ajoute qu'il est possible que d'autres prestataires ait encore accès à des données peronnelles ce qui fait que les risques de fuite persistent.

En vérifiant les appels réseau d'use page de werkenvoornederland.nl, je n'ai effectivement plus vu d'appel à Google Analytics que dénonçait Bert Hubert mais il y a un autre script d'analyse web qui est chargé sur la page (`piwik.min.js`) 

![capture d'écran montrant Piwik chargé sur le site werkenvoornederland](piwik-sur-werkenvoornederland.png){.center}

Piwik est le script utilisé par l'utilitaire Matomo[^1] d'analyse du trafic web. Matomo est un logiciel libre qui peut être installé directement sur les serveurs de l'État qui en garde le contrôle mais il peut aussi être utilisé via un prestataire qui s'assure de son bon fonctionnement. C'est peut-être ce risque dont parle le journal d'investigation.

Les auteurs de l'article ne partagent aucune annonce ou commentaire de l'administration sur ce changement mais rappelle la question posée par Derk Boswijk en début d'année. Sur le même sujet, le député CDA a de nouveau intérogé le ministre de la défense [le 4 novembre dernier](https://www.tweedekamer.nl/kamerstukken/kamervragen/detail?id=2025Z19429&did=2025D45506). La réponse n'est pas encore disponible mais je pense que cette fois ci elle sera un peu plus satisfaisante.


[^1]: Pour la petite histoire, Matomo s'appellait avant Piwik et a été créé par un français habitant hors de France (coucou Matthieu Aubry).