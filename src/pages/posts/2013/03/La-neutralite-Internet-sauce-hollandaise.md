---
layout: base
title: "La neutralité d'Internet à la sauce hollandaise"
categorie: nederlandjes
tags: ["administration", "internet", "mots", "politique", "sociétés"]
isMarkdown: true
thumbnail: 
image_alt: 
permalink: La-neutralite-Internet-sauce-hollandaise/
date: 2013-03-11
update: 2019-01-02
TODO: no image, no image alt
---

Ça fait des années qu'on parle de neutralité du net, en France, le sujet a été remis sur le tapis quand un fournisseur d'accès qui n'a de gratuit que le nom s'est mis à filtrer la pub. La Ministre, **Fleur Pellerin**, a aussitôt reunit les acteurs du net [pour ne pas les écouter et leur dire](https://web.archive.org/web/20130423191613/https://blog.penet.org/index.php?post/2013/01/16/De-retour-de-la-table-ronde-sur-la-neutralit%C3%A9-du-net) que le Conseil National du Numérique se chargera de la question. 

Avant que le conseil ne rende sa copie, on peut leur rappeler que depuis le printemps 2011, les Pays-Bas ont inscrit la neutralité du net dans la loi sans que ça ne gène personne. Un exemple qu'on pourrait regarder de plus près :

<!--excerpt-->

## La transparence

Sachant qu'une directive sur ce sujet allait être discutée au niveau européen, les Néerlandais ont pris les devants et ont missionné une étude sur la [transparence à propos de la neutralité](http://www.rijksoverheid.nl/documenten-en-publicaties/rapporten/2010/12/02/transparantie-over-netneutraliteit.html) (*Transparantie over netneutraliteit*). Réalisée par TNO, elle a été remise au ministre de l'économie, de l'agriculture et de l'innovation en décembre 2010.

Cette étude a essayé de définir dans quelle mesure les différents type de trafic Internet était traités différemment et si les clients en étaient informés de manière compréhensible. L'étude donne des exemples de services facturés avec les conséquences sur le marché. Elle révèle aussi des pistes pour appliquer l'obligation de transparence dans le marché de gros (peering payant, transit...) par le biais de contrat de qualité de service (SLA).

## Les effets pécuniaires

Les sociétés de services mobiles, et en premier lieu KPN, ont demandé à continuer de pouvoir bloquer des applications qui étaient en concurrence avec leurs services payant parce que c'était selon eux le meilleur moyen de conserver des prix bas. En gros, ils veulent continuer d'interdire Skype, Viber ou Watsapp pour pouvoir continuer de surfacturer les appels internationaux et les SMS, ceci étant le seul moyen, selon eux, de maintenir leur bas prix. Le ministre avait maintenu ce principe dans le projet mais la deuxième chambre ne l'a pas entendu de cette oreille et a confirmé l'**interdiction de blocage**.

## Le principe

Le principal principe de cette loi est d'inscrire dans le code des télécommunication (à [l'article 7.4a](http://mijnwetten.nl/telecommunicatiewet/artikel7.4a)) le principe de neutralité indiquant explicitement que les fournisseur d'accès à Internet ne doivent pas bloquer ou ralentir le trafic pour aucun type service ou application spécifique. Les cas où les limitation de trafic sont rendus nécessaires sont listés dans la loi dans ce même article 7.4a.

## Les exceptions

Le blocage ou le ralentissement volontaire de services internets fournis par un prestataires sont interdit sauf dans les cas suivants :

* Pour réduire les effet de congestion de trafic, à condition que tous les types de trafic soient traités également.
* Pour garantir l'intégrité et la sécurité du réseau entre le fournisseur et l'utilisateur final.
* Pour prévenir la transmission de communications non sollicités (visées à l'article 11.7) à condition que l'utilisateur ait été informé au préalable.
* Pour répondre à une obligation légale ou une décision de justice.
* Pour répondre à une demande spécifique de l'utilisateur.

Pour prendre des exemples concrets, il est reste possible pour un fournisseur d'accès de réduire son débit en raison d'affluence, mais il doit le faire pour tout type de trafic, il lui est possible de filtrer le réseau en cas d'attaque DDos, de bloquer la pub ou les spams à condition que le client en ait été informé. Enfin il est possible à un juge de demander de [couper l'accès à The Pirate Bay](/censure-de-l-internet-aux-pays-bas) tout en restant conforme à cette loi.[^1]. Le deuxième paragraphe insiste sur ce délai à laisser à l'utilisateur pour que, si ce dernier est une entreprise dont un seul ordinateur est infecté, cette dernière puisse continuer à bénéficier de son accès internet si elle identifie l'ordinateur. 

## Les terminaux d'accès

Si un utilisateur final cause des problèmes dans le trafic réseau à cause d'un de ses terminaux, le fournisseur d'accès peut lui couper l'accès pour mettre fin à la nuisance mais il doit auparavant informer l'utilisateur et lui laisser le temps nécessaire pour mettre fin au problème. Cette mesure était déjà utilisée avant que la loi n'existe, elle ne fait que valider une pratique existante. 

Quand votre ordinateur est infecté par un virus qui envoi trop de spams ou fait partie d'un botnet qui envoie des attaques de déni de service, votre fournisseur d'accès vous coupe votre connexion jusqu'à ce que vous fassiez le ménage et installiez un antivirus. C'est arrivé à un collègue et c'est plutôt consternant comme pratique. Au moins maintenant, le fournisseur d'accès doit laisser à l'internaute le temps d'agir.

## Nouveau mot: Aanbieders van internettoegangsdiensten

Les fournisseurs d'accès à Internet (*Aanbieders van internettoegangsdiensten*) peuvent fixer eux même le montant de leurs offres de service d'accès à Internet. Les offres d'accès à Internet doivent être clairement identifiée en tant que tel. Si l'offre mentionne aussi un accès à des sites web, des applications ou des services Internets, ils devront être identifiés comme faisant partie du service d'accès internet. Bien sûr, aucun de ces services ne pourra faire l'objet d'une facturation supplémentaire. Les prestataires de services sur internet ne peuvent pas être considérés comme offrant un accès à Internet.

## Les limites autorisées 

Les fournisseurs d'accès peuvent différencier leurs offres par d'autres moyens, par exemple, en bande passante disponible ou en limitant le volume les données échangées. La loi sur les télécommunications interdit le blocage ou le ralentissement de services ou applications qui ne forment qu'une partie d'Internet. Il est aussi autorisé, pour les fournisseurs d'accès mobile, à n'offrir l'accès Internet qu'aux Pays-Bas.

## Le filtrage

Le filtrage d'Internet est autorisé au point e de l'article 7.4, sur demande expresse de l'utilisateur. Il peut être motivé par des raisons religieuses ou idéologiques ou de protection de l'enfance. Le filtrage peut être opéré par le fournisseur d'accès par l'installation d'un logiciel ad hoc sur le routeur ou le mobile de l'utilisateur. Le prix de l'offre Internet avec filtrage ne dois pas être inférieur aux prix de la même offre internet sans filtrage. Ce serait une entrave à la neutralité d'Internet.

## Bilan après deux ans

Voilà, je pense avoir fait le tour de ce que les néerlandais ont débattu sans passion il y a presque deux ans. Avant de voir si on peut immiter ce pays ou attendre 10 ans, on peut faire un petit bilan d'étape. Il n'y a en fait pas grand chose à dire. Les fournisseurs d'accès ne trichent pas et ils
ne se plaignent pas.

L'année dernière, la société [KPN a annoncée la suppression de plusieurs milliers de postes](http://meinamsterdam.nl/licenciements-serie) en accusant les utilisateurs de ne plus payer leurs SMS parce qu'ils utilisent des services comme Whatsapp à la place. Cette loi, qui les oblige à ne pas bloquer Whatsapp a un temps été citée par le ministre sortant **Maxime Verhagen** comme la cause de leur maux, mais l'argument n'a pas tenu longtemps ailleurs en Europe les grandes sociétés de téléphone sont en crise aussi alors que la neutralité du net n'est pas garantie par la loi. En France c'est le quatrième opérateur qu'on accuse d'être la cause d'un déclin des services à forte marge.

2012 a aussi vu le lobbie des grosses maisons de disques, **BREIN**, forcer deux fournisseurs d'accès, **Ziggo** et **XS4ALL** à [filtrer The Pirate Bay](https://blog.xs4all.nl/2011/11/08/het-gaat-niet-om-the-pirate-bay-het-gaat-om-niet-blokkeren-nu-niet-en-nooit-niet-daar-gaat-het-om/). C'est une décision de justice[^2] que les fournisseurs d'accès ont dû appliquer (point d de l'article 7.4).

Donc après deux ans, on peut voir que la neutralité du net dans la loi, c'est pas bien difficile et que ça ne tue pas les bébé phoques. Je me demande bien pourquoi on ne l'applique pas en France (non).

---
[^1]: C'est d'ailleurs ce qui est arrivé récemment et que je n'ai pas eu le temps de relater.
[^2]: Même si elle est discutable, une décision de justice est applicable. Dans le cas présent, elle est discutable et XS4ALL a fait appel.
<!-- post notes:
NL -> EN https://www.bof.nl/2011/06/27/translations-of-key-dutch-internet-freedom-provisions/
FR > https://pad.partipirate.org/yAhqZWWb02 
exégèse NL
https://btg.org/2012/05/18/netneutraliteit-wettelijk-verankerd-na-instemming-eerste-kamer/
--->
