---
layout: base
title: "J'ai retesté le vote par Internet"
categorie: ik-ben-frans
tags: 
 - élections
 - administration
 - web
isMarkdown: true
thumbnail: ecran-login-vote-electronique-2022_m.png
image_alt: Elections législatives 2026 Test grandeur nature
permalink: reteste-le-vote-Internet/
date: 2025-11-12
update: 2025-11-12
TODO: no image alt, shortened desc, image without alt
---

Les Français résidant hors de France vont à nouveau retourner aux urnes en 2026 pour élire leurs conseillers consulaires, élection que j'ai déjà couverte [en 2014](/Les-nouveaux-conseillers-consulaires/) et [en 2022](/Les-nouveaux-conseillers-des-francais-des-Pays-Bas/) en expliquant le rôle (plutôt limité) de ces élus.

En 2026 l'option de voter par Internet va à nouveau être présentée comme une option de vote avec le vote à l'urne qui obligera les électeurs à se rendre un jour précis dans un lieu où des citoyens volontaires gèrent les bureaux de vote.

## Un test pas si en grand et pas si nature

La mise en place du vote par internet pour l'ensemble des inscrits dans le monde entier pour des centaines de scrutins est une opération de grande envergure et pour ne pas se rater, l'administration organise avec le prestataire qui a développé la solution de vote, un **test grandeur nature**, simulant une élection fictive pour des centaines d'électeurs volontaires. Pendant cette semaine de vote, les équipes du MEAE et ses prestataires s'assurent du bon fonctionnement complet de la solution.

#### Tester la résistance des serveurs

Pour effectuer un test de charge des serveurs, une centaine de volontaires ne peut pas reproduire les millions des milliers d'inscrits lors d'une élection véritable. Je pense donc que ces tests de charges sont réalisés par des outils spécifiques qui permettent aussi de mesurer la résistance aux attaques extérieures comme les attaques DDoS.

#### Tester l'efficacité de la solution dans le monde entier

La multiplication des volontaires permet surtout de produire une multiplicité des configurations que la solution doit prendre en compte tant pour la connexion que pour l'envoi des messages mail et SMS sur les différents réseaux de nombreux pays. 

Hélas la grandeur de cet échantillon de votants est ici aussi trop petit pour faire apparaitre des problèmes qui pourrait apparaitre dans le cas d'envoi de message plus nombreux. Ainsi, en 2022, des problèmes de refus d'acheminement de mails et de SMS perdus sont apparus durant le scrutin officiel alors qu'ils ne se sont pas produits durant le test grandeur nature.

#### Tester la réception de la solution par le public

Enfin, le test grandeur nature permet de recuillir le retour d'utilisateurs en amont de la mise en place de la solution ce qui permet d'ajuster les messages et les interfaces pour rendre l'utilisation de la solution la plus accessible possible.

Normalement ce genre de test est réalisé par des équipes spéciales de testeurs et d'ingénieurs qualité qui peuvent rendre un audit ou une liste de fonctionalités à mettre à jour. 

Je pense d'ailleur que le perstataire ne coompte pas sur ce test grandeur nature pour améliorer la qualité de sa solution puisqu'aucun formulaire de retour ou adresse de contact n'est fournie aux volontaires. C'est d'ailleurs bien dommage parce que sur [les 13 pages de remarques](/teste-le-vote-Internet/) que j'ai envoyé après avoir fait le teste grandeur nature de 2022, seules deux ou trois améliorations avaient été implémentées dans le système. 



## La solution de 2026

Pour les élections de 2026, le système en place ressemble beaucoup à ce que j'avait déjà utilisé en 2022. Le prestataire, auteur de la solution est d'ailleurs Voxaly-Docaposte, le même que pour la solution de 2022. Néamoins, le MEAE, ayant tiré les ensignements des ratés durant les élections de 2022 a fait évoluer son cahier des charges.

En 2022 certains électeurs ne recevaient plus leur code de confirmation par mail rendant l'autentification impossible. Certain fournisseur de mail comme Yahoo ou Verizon avaient tout bonnement bloqué le système de vote pour SPAM. Je suppose que le cahier des charge impose à la solution d'utiliser toutes les ficelles des ~~spameurs~~ sociétés de marketing en ligne pour éviter que cela se reproduise. 

#### France Identité

De plus elle a demandé la mise en place de l'autentification par France Identité, une application mobile régalienne d'authentification en ligne qui permet de certifier son identité nationale.

Cette nouvelle option est très judicieuse car elle permet d'éviter de reposer sur des prestataires étrangers d'accès à internet et d'abonnement au téléphone pour certifier l'identité des électeurs.

France Identité commence à être largement adopté en France parce que certaines personnes s'en servent pour prouver leur réservation de TGV ou retirer un colis à la poste. Hélas, il y a peu de cas d'usage hors de France (à vrai dire cette élection par Internet est le premier cas que je connaisse). De plus l'ouverture d'un compte France Identité doit être validée par le passage d'un facteur de la Poste qui n'est pas possible hors de France ou par un compte France Connect qui, depuis de nombreuses années déjà n'est pas accessible à tous les français résident hors de France.

Comme nombre de projets de numérisation des services publics, la simplification offerte par France Identité est semmée d'embuches.

#### Ce qui ne change pas

Dans mon rapport de 13 pages rédigé suite à mon test de 2022, j'avais plusieurs remarques sur l'ergonomie, le choix des termes pour améliorer le sentiment de sécurité de las solution de vote et quelques remarques techniques comme des pages manquantes et des certificats manquants.

J'avais aussi suggéré de réduire le risque de coercition du vote en permettant aux électeur de mettre à jour leur vote même après l'avoir validé.

<!-- TODO: + ouverture du code ? -->

La plupart de ces remarques sont encore valides aujourd'hui. Si l'application a changé certaines configurations ou contrôles demeurent imparfaits.

#### Une présentation des bulletins améliorée


#### mais pas complètement


#### Ce qui est nouveau et peut-être plus grave



{# 

https://www.senat.fr/questions/base/2025/qSEQ250605046.html

 #}