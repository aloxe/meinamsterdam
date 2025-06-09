---
layout: base
title: "C'était RIPE 62 (le meeting)"
description: "Après presque deux semaines de silence, c'est toujours une satisfaction de revenir vers vous avec le compte-rendu de ce moment intense mais affriolant qu'est l"
categorie: dagelijks
tags: []
isMarkdown: true
thumbnail: 
image_alt: 
permalink: ripe-62-meeting/
date: 2011-05-19
update: 2012-12-12
TODO: no image, no image alt, shortened desc
---

Après presque deux semaines de silence, c'est toujours une satisfaction de revenir vers vous avec le compte-rendu de ce moment intense mais affriolant qu'est le RIPE Meeting. Du 2 au 6 mai, j'étais de retour au Grand NH Hotel Kasnapolsky, avec mes collègue pour accueillir et accompagner 468 participants.

Au cours de mes précédents compte-rendus des RIPE Meeting d'Amsterdam ([RIPE 55](/c-etait-ripe-55-meeting) et [RIPE 58](/c-etait-ripe-58-meeting)), j'ai déjà fait part de l'urgence pour tous les acteurs de l'Internet, de ce préparer à être compatible avec IPv6. RIPE 63 est de l'avis de tous, le dernier Meeting pendant lequel le RIPE NCC dispose encore d'adresses IPv4 pour ses membres. L'urgence est avérée. On sait maintenant que beaucoup d'opérateurs ne sont pas prêts et que la transition sera difficile. Cela génère beaucoup de discussions. Une journée entière était consacrée à **IPv6**. 

## IPv6

Parmi les thèmes abordés autour d'IPv6, les différentes solutions techniques de transition, permettant aux services de supporter la demande à la fois en IPv4 et en IPv6 (*dual stack*). Ces différents systèmes sont bien répandus maintenant et Marco Hogewonning  les passe en revue ([IPv6 transitioning techniques](http://ripe62.ripe.net/presentations/51-46-MH-RIPE62-Transitioning.pdf)) et lesquels sont adaptés à quels besoins. Mais bon, pour résumer, si vous n'avez pas assez d'adresses IPv4 en stock et que vous n'avez rien préparé, vous allez avoir des problèmes. La compatibilité matérielle est elle aussi en retard. Un document RIPE dresse les exigences minimum du matériel utilisé par les opérateurs réseau ([RIPE 501](https://www.ripe.net/ripe/docs/ripe-501) [présenté par Jan ?or?](http://ripe62.ripe.net/presentations/54-48-ripe-501bis.pdf)). Tandis que Marco lance un sondage pour inventorier le niveau de compatibilité IPv6 des appareils informatiques domestiques. ([IPv6 CPE Survey - Participate on RIPE Labs](http://ripe62.ripe.net/presentations/44-RIPE62-IPv6CPE-Survey-Kuehne.pdf)).

Le plus intéressant étaient peut-être les discussion autour de la journée mondial IPv6. [Le 8 juin prochain](http://isoc.org/wp/worldipv6day/), de grandes entreprises de l'Internet ont décidé de fournir leurs services en IPv6. Ceci permettra de voir si tout le monde peut y accéder facilement. Comme on sait que c'est loin d'être le cas, les discussion ont été vives. Les professionnels de l'internet, après avoir joué à la poule et l'?uf[^1] en attendant que l'autre fasse le premier pas, ont joué au chat et à la souris en soupçonnant l'autre de mauvaises intentions. Les fournisseurs d'accès accusent les entreprises de contenu de réduire leur qualité de service en allumant IPv6. Il est certain que des personnes constateront un internet plus lent. Les fournisseurs de contenu ont peur que les entreprises qui gèrent les réseaux acheminent les données derrière des montages complexes qui pourra peut être leur cacher une partie de leur clientèle.

Coté organisation du meeting,nous avons essayé quelques nouveaux services, dont ce routeur [LISP](http://ripe62.ripe.net/presentations/135-LISP_Overview_RIPE.pdf) présenté par Job Snijders. Pour certains de ces services, IPv6 a du être désactivé parce que trop bogué. Ce n'a pas empêché Erik Romijn d'afficher un **17,3% des utilisateurs de ce meeting se connectaient en IPv6**.

## La reine et les gardes

Le mercredi après-midi, l'hotel Krasnapolsky était à nouveau le refuge de nombreux gardes en uniformes. Malgré la présence de nombreux professionels de l'internet, personne ne s'est fait arrêté pour faciliter le piratage d'?uvres copyrightés ou l'échange de fichiers pédophiles. Les gardes, policiers et militaires en uniformes d'apparat, étaient là pour participer aux cérémonies en hommage aux morts des guerres, [herdenkingsdag](/dodenherdenking-le-jour-du-souvenir). La reine, en posant une gerbe au pied du [monument national](http://nl.wikipedia.org/wiki/Nationaal_Monument) entrait en contact avec le réseau wifi que nous avons installé pour le meeting. Hélas, elle a du éteindre son téléphone avant la cérémonie.

## Le routage sécurisé

L'autre grand sujet de ce meeting était le routage sécurisé. Avant même le début des conférences, [un tutoriel RPKI](http://ripe62.ripe.net/programme/meeting-plan/tutorials#rpki) (*Resource Public Key Infrastructure*) par Randy Bush a fait exploser l'audimat. Une fois l'audience familière avec la gestion de ses clés de chiffrement, elle a put écouter le même Randy Bush présenter [BGP Security ?The Human Threat](http://ripe62.ripe.net/wp-content/plugins/meeting-presentation-support/icons/32x32/application-pdf) à propos de la technologie de chiffrement du routage et les implications humaines. Cette présentation a généré de vives discussion sur les responsabilités des Registres qui se proposent d'être l'autorité certifiant les clés de chiffrement. Certains ont aussi peur de  voir les gouvernements se mêler ce ce qui se passe sur leurs réseaux. Des inquiétudes fondées mais peut être mal placées. Les discussions sur ce sujet ont continué toute la semaine dans le [Address Policy Working Group](http://ripe62.ripe.net/programme/meeting-plan/address-policy) et le [Routing Working Group](http://ripe62.ripe.net/programme/meeting-plan/routing). Le premier groupe ayant vu se prolonger les discussions sur sa liste de discussion. Un intervenant y a refusé de soutenir [une proposition](https://www.ripe.net/ripe/policies/proposals/2008-08) datant de 2008 demandant au RIPE NCC de délivrer des certificats. Ce sujet a été discuté toute la semaine sur la liste et dans les couloirs jusqu'au vendredi matin, lors de la dernière réunion du *Address Policy Working Group*.

Les autres groupes de travail on aussi eu des agendas chargés. Au peut noter au passage la récente évolution des groupes [MAT](http://ripe62.ripe.net/programme/meeting-plan/anti-abuse) (pour *Measurement Analysis and Tools*) et [Anti-Abuse](http://ripe62.ripe.net/programme/meeting-plan/anti-abuse). Avant leur changement de nom, ces groupes de travail étaient peu développés et peux fréquentés. Mais depuis quelques temps ils font salle comble. Le groupe MAT était à l'étroit dans la petite salle et des retardataires ont du rester debout au fond pour écouter, entre autres, la présentation du projet [RIPE Atlas](http://atlas.ripe.net/). Je ne m'attarderais pas dessus, le projet a déjà plusieurs mois et je m'en suis fait l'écho [sur twitter](http://twitter.com/#!/aloxecorton).

## Les nouveautées
Depuis plusieurs années que j'essaye d'offrir un meilleur service en rendant accessible les enregistrements des sessions disponibles dès le lendemain, je crois que nous avons enfin atteind un niveau satisfaisant. Le fait que le meeting ait lieu à Amsterdam a beaucoup aidé, les collègues qui ne se déplacent pas pour les meetings ont put aider à éditer les sessions pendant leur déroulement. Résultat: ceux qui n'ont pas pu venir, peuvent suivre [toutes les sessions achivées](http://ripe62.ripe.net/archives) depuis le vendredi soir. À se demander pourquoi je fais un compte-rendu...

La mise à jour quotidienne du site web de la conférence[^2] s'est suffisement bien passée pour que je puisse passer du temps pour aller à la rencontre des utilisateurs du RIPE NCC. Après avoir lancé un nouveau site au mois de janvier, je voulais rencontrer les gens et voir ce quíls en pensent. C'est ce que j''ai pu faire pendant une journée sur les stand ou les collègues présentaient aussi leurs nouveautés: [LIR Portal](https://lirportal.ripe.net/home/), [Atlas](http://atlas.ripe.net/) et [RIPE Stat](http://stat.ripe.net/). Les retours que j'ai eu ont été bons dans l'ensemble mais aussi riches en suggestions d'améliorations. Ça va me donner du travail pendant quelque temps encore.
---
[^1]: Les entreprises de contenu n'implémentent pas IPv6 parce qu'il n'y a personne pour lire ce contenu, les fournisseurs d'accès n'implémente pas IPv6 parce qu'il n'y a pas de contenu sous ce protocole.
[^2]: L'un des [deux sites web](/deux-nouveaux-sites-web) qui m'ont pris du temps dernièrement.