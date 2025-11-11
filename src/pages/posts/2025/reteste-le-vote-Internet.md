---
layout: base
title: "J'ai retesté le vote par Internet"
categorie: ik-ben-frans
tags: 
- élections
- administration
- web
- politique
isMarkdown: true
thumbnail: fermeture-du-vote.png
image_alt: "Test grandeur nature, fermeture du vote dans 50 min"
permalink: reteste-le-vote-Internet/
date: 2025-11-12
update: 2025-11-12
---

Les Français résidant hors de France vont à nouveau retourner aux urnes en 2026 pour élire leurs conseillers consulaires, élection que j'ai déjà couverte [en 2014](/Les-nouveaux-conseillers-consulaires/) et [en 2022](/Les-nouveaux-conseillers-des-francais-des-Pays-Bas/) en expliquant le rôle (plutôt limité) de ces élus.

En 2026 l'option de voter par Internet va à nouveau être présentée comme une option de vote, Le vote à l'urne est conservée avec sa limitation de lieu et de temps bien connue,

## Un test pas si en grand et pas si nature

La mise en place du vote par internet pour l'ensemble des inscrits dans le monde entier pour des centaines de scrutins est une opération de grande envergure. Pour ne pas se rater, l'administration organise avec le prestataire qui a développé la solution de vote, un **test grandeur nature**, simulant une élection fictive pour des centaines d'électeurs volontaires. Pendant cette semaine de vote, les équipes du MEAE et ses prestataires s'assurent du bon fonctionnement complet de la solution.

![capture d'écran du portail fermé](portail-ferme.png)

<!--excerpt-->

#### Tester la résistance des serveurs

Pour effectuer un test de charge des serveurs, une centaine de volontaires ne peut pas reproduire les millions des milliers d'inscrits lors d'une élection véritable. Je pense donc que ces tests de charges sont réalisés par des outils spécifiques qui permettent aussi de mesurer la résistance aux attaques extérieures comme les attaques DDoS.

#### Tester l'efficacité de la solution dans le monde entier

La multiplication des volontaires permet surtout de produire une multiplicité des configurations que la solution doit prendre en compte tant pour la connexion que pour l'envoi des messages mail et SMS sur les différents réseaux de nombreux pays. 

Hélas **cet échantillon de votants est ici aussi trop petit** pour faire apparaitre des problèmes qui pourraient apparaitre dans le cas d'envoi de message plus nombreux. Ainsi, en 2022, des problèmes de refus d'acheminement de mails et de SMS perdus sont apparus durant le scrutin officiel alors qu'ils ne se sont pas produits durant le test grandeur nature.

#### Tester la réception de la solution par le public

Enfin, le test grandeur nature permet de recueillir le retour d'utilisateurs en amont de la mise en place de la solution ce qui permet d'ajuster les messages et les interfaces pour rendre l'utilisation de la solution la plus accessible possible.

Normalement ce genre de test est réalisé par des équipes spéciales de testeurs et d'ingénieurs qualité qui peuvent rendre un audit ou une liste de fonctionnalités à mettre à jour. 

À mon avis le prestataire ne compte pas sur ce test grandeur nature pour améliorer la qualité de sa solution puisqu'**aucun formulaire de retour ou adresse de contact** n'est fournie aux volontaires. C'est d'ailleurs bien dommage parce que sur [les 13 pages de remarques](/teste-le-vote-Internet/) que j'ai envoyé après avoir fait le teste grandeur nature de 2022, seules deux ou trois améliorations avaient été implémentées avant l’élection.

## La solution de 2026

Pour les élections de 2026, le système en place ressemble beaucoup à ce que j'avais déjà utilisé en 2022. Le prestataire, auteur de la solution est d'ailleurs **Voxaly-Docaposte**, le même que pour la solution de 2022. Néanmoins, le MEAE, ayant tiré les enseignements des ratés durant les élections de 2022 a fait évoluer son cahier des charges.

En 2022 certains électeurs ne recevaient plus leur code de confirmation par mail rendant l’authentification impossible. Plusieurs grands fournisseurs de service mail comme Yahoo ou Verizon avaient tout bonnement bloqué le système de vote pour SPAM. Je suppose que le cahier des charges impose à la solution une obligation de moyens pour éviter que cela se reproduise. (*Je ne veux pas divulgacher la suite mais ce n’est pas le cas*)

#### France Identité

De plus elle a demandé la mise en place de l’**authentification par France Identité**, une application mobile régalienne d'authentification en ligne qui permet de certifier son identité nationale.

Cette nouvelle option est très judicieuse, car elle permet d'éviter de reposer sur des prestataires étrangers d'accès à internet et d'abonnement au téléphone pour certifier l'identité des électeurs.

France Identité commence à être largement adopté en France parce que certaines personnes s'en servent pour prouver leur réservation de TGV ou retirer un colis à la poste. Hélas, il y a peu de cas d'usage hors de France (à vrai dire cette élection par Internet est le premier cas que je connaisse). De plus, l'ouverture d'un compte France Identité doit être validée, soit par le passage d'un facteur de la Poste qui n'est pas possible hors de France, soit par un compte France Connect qui, depuis de nombreuses années déjà, n'est pas accessible à tous les français résident hors de France.

![fausse copie d'écran France Connect](france-connect.png)

Comme nombre de projets de numérisation des services publics, la simplification offerte par France Identité est semée d'embuches.

#### Ce qui ne change pas

Dans mon rapport de 13 pages rédigé suite à mon test de 2022, j'avais plusieurs remarques. Celles-ci concernaient l'ergonomie, le choix des termes pour améliorer le sentiment de sécurité et quelques remarques techniques comme des pages manquantes, des certificats manquants des liens cassés.

J'avais aussi suggéré de réduire le risque de coercition du vote en permettant aux électeurs de mettre à jour leur vote même après l'avoir validé.

La plupart de ces remarques sont encore valides aujourd'hui. Si l'application a changé, les imperfections demeurent.

Ainsi, le mail appelant au vote contenait deux liens vers des pages d'aide qui n'existent pas (Erreur 404), l'identifiant de connexion qu'il faut recopier sans erreur est toujours offusqué par défaut et le certificat du site web n'a toujours pas de propriétaire explicite. etc.

#### Une présentation des bulletins améliorée

En 2022, je signalais l'horreur de présenter les bulletins sur deux colonnes même sur un petit écran de téléphone ce qui rendait le nom des listes parfois impossible à lire en entier.

En novembre 2025 le teste me montre des bulletins sur une seule colonne ou le nom de la liste, même très long, s'affiche sur l'écran en entier. Un grand progrès pour ceux qui vont voter depuis leur mobile.

![copie d'écran de la liste des bulletins sur un écran de mobile](ecran-de-vote-listes-sur-mobile.png){.center}

#### mais pas complètement

Seulement, la liste des bulletins souffre d'un autre problème d'accessibilité. 

Les personnes ne pouvant utiliser la souris, surfent sur le web avec leur clavier. Elles naviguent entre les éléments activables d'une page avec la touche *tabulation* et cliquent avec la touche *entrée*. Or, sur la page des bulletins, seul le premier bulletin est sellectionable via la touche *tabulation*. Il est donc impossible pour les personnes sans souris de choisir un autre candidat que le premier de la liste.

<video controls src="/files/2025/bulletins-sellection-clavier.mp4" title="Exemple de navigation au clavier sur la liste des bulletins"></video>

Cette erreur est cruciale à corriger parce que les administrations sont légalement contraintes de proposer des sites et des applications accessibles. En plus de ça, cela crée une rupture d'égalité devant le vote en excluant *de facto* certains électeurs de cette modalité de vote.

#### Ce qui est nouveau et peut-être plus grave

Dans mon rapport de 2022, j'avais constaté que tous les mails, (envoi d'identifiant, annonce d'ouverture du vote, code de confirmation…) n'étaient pas tous envoyés par la même adresse ce qui n'aidait pas à identifier les courriers authentiques d'éventuels spams et courriers d'hameçonnage administratifs que nous recevons tous.

Cette erreur a été corrigée. Tous les mails sont envoyés par 
- **Ministère de l'Europe et des Affaires étrangères \<voteinternet@votezaletranger.gouv.fr>** ou 
- **Ministère de l'Europe et des Affaires étrangères \<noreply@votezaletranger.gouv.fr>**. 

Ça présente plutôt bien.

> Attention, la suite est un peu technique

Seulement, le diable se cachant dans les détails, j'ai remarqué que les mails envoyés par l'application (identifiant, mise à jour du mot de passe et code de confirmation…) étaient toujours identifiés comme spam par mon gestionnaire de mails. En essayant de savoir pourquoi, j'ai constaté que cette classification était due à un [Echec DMARC](https://fr.wikipedia.org/wiki/DMARC).

DMARC est une politique de traitement des mails après vérification d'informations fournies par le serveur du nom de domaine (DNS) de l'expéditeur du mail. 

Par exemple, le code de confirmation de vote est envoyé par l'expéditeur **\<noreply@votezaletranger.gouv.fr>** mais le serveur qui l'envoie est celui du prestataire *Mailjet* `o3.p25.mailjet.com [185.189.236.3]`. Pour vérifier que l'expéditeur est légitime, qu'il est bien le **\<noreply@votezaletranger.gouv.fr>** qu'il prétend être, le serveur de mail du destinataire va envoyer une requête au serveur du nom de domaine `votezaletranger.gouv.fr` pour savoir si le serveur d'envoi est bien habilité à envoyer des courriers à ce nom. Il va vérifier si `o3.p25.mailjet.com` ou `185.189.236.3` est bien renseigné dans un enregistrement DNS dédié. Si une signature cryptographique est présente dans l'entête du message, il va aussi envoyer une requête pour vérifier cette signature.

Si aucune de ces vérifications n'est valide, il y a de fortes chances que l'adresse de l’expéditeur soit usurpée et que le courrier soit un spam. Une autre possibilité est que l'utilitaire d'envoi de mail soit mal configuré. C'est dans ce dernier cas que nous nous trouvons mais le serveur de mail qui ne peut pas s'en rendre compte étiquète l'envoi comme un spam.

![copie d'écran du score de SPAM d'un mail mailjet MEAE](dmarc-score-10-spam.png)

Le mail d'annonce de l'ouverture du vote est envoyé par un autre prestataire étranger : Active Trail `i2.ms203.atmailsvr.net [91.199.29.203]`. Mais dans ce cas, la signature cryptographique dans l'entête du mail est validée lors de la requête au serveur du nom de domaine. Le courrier est donc considéré comme légitime et n'est pas étiqueté spam. Ce courrier est envoyé avec l'adresse d'expéditeur **\<voteinternet@votezaletranger.gouv.fr>** alors que l'envoi n'est pas parti du MEAE. Seulement l'outil d'envoi des mails chez Active Trail a été configuré correctement[^1].

Il suffirait donc que l'outil d'envoi des mails avec **\<noreply@votezaletranger.gouv.fr>**, qui est hébergé par Mailjet, soit, lui aussi configuré correctement. Mailjet, entreprise américaine spécialisée dans le ~~spam~~ marketing digital, fourni même [un guide complet](https://documentation.mailjet.com/hc/fr/articles/360049641733-Guide-complet-d-authentification-des-domaines-avec-SPF-et-DKIM) pour aider à la configuration de ses outils. Suivre ce guide <!--(et bien configurer la zone `votezaletranger.gouv.fr`)--> est la meilleure garantie pour que les courriers d'envoi des identifiants aux électeurs ne soient pas à nouveau bloqués comme ce fut le cas en 2022.

> Attention, la suite est un peu politique

Le Ministère de l'Europe et des Affaires étrangères français a confié à une entreprise française **Voxaly-Docaposte**, le soin de gérer la solution de vote par Internet. Cela me permet de penser que les données personnelles que j'ai confiées à mon consulat pour pouvoir exercer mon droit de vote, ne quitteraient pas le territoire français.

En grattant un peu les données techniques dans les entêtes des courriers que j'ai reçus, je constate que ces données sont passées par [un serveur en Israel](https://apps.db.ripe.net/db-web-ui/query?from=www&searchtext=91.199.29.203) et un autre est parti depuis la filiale française ([Mailjet SAS](https://apps.db.ripe.net/db-web-ui/query?from=www&searchtext=185.189.236.3)) d'une société américaine.

Ces deux entreprises indiquent bien respecter le RGPD — ce qui est la moindre des choses dans leur métier — mais je ne suis pas certain que mes données ne tombent pas sous le coup d'une loi extra-territoriale qui obligerait ces sociétés à déroger au RGPD suite à une requête judiciaire à leur siège. Pour le cas de la société américaine on sait depuis la jurisprudence *Schrems II* que c'est un risque à envisager. 

Ce risque qui a été [confirmé aux Pays-Bas](/cloud-merite-notre-confiance/) en 2022. Quand il s’agit d'une opération aussi sensible qu'une élection, il est je pense préférable d’éviter ce risque en sous-traitant l'envoi des mails à des spécialistes français ou européens. *Brevo*, *Sarbacane* ou *eTarget* sont là pour nous rappeler qu'il n'en manque pas.

## En conclusion

Après avoir validé mon vote, j'ai reçu un récépissé de vote avec un cachet électronique. J'ai déjà expliqué que ce genre de récépissé ne pouvait pas inspirer confiance si sa vérification n'était pas faite de manière transparente, il est possible que ceci évolue dans les mois à venir. [Mon récépissé](/files/2025/) se termine par une mention sibylline :

> Contrôle du cachet électronique. Pour le TGN le service est indisponible.

Cela signifie surement que le service que nous avons testé grandeur nature n'est en fait pas complètement finalisé. Le cachet du récépissé ne peut pas être vérifié et les imperfections que j'ai constatées çà et là ont encore le temps d'être corrigées.

En participant au test grandeur nature du vote par Internet, je pensais découvrir des avancées pour améliorer le sentiment de confiance des électeurs mais j'ai surtout vu qu'il restait du travail.

![Message d'erreur internet](erreur-interne.png)

Je ne vais pas produire un rapport comme la dernière fois puisque je n'ai pas l'impression d'avoir effectué un test utile. Le nombre et l'étendue des soucis que j'ai rencontrés me conduit plutôt à recommander un audit plus rigoureux qu'un simple test étalé sur quatre jours.

<!-- https://www.senat.fr/questions/base/2025/qSEQ250605046.html 
https://www.numerique.gouv.fr/sinformer/espace-presse/france-2030-la-strategie-nationale-cloud-senrichit-dun-nouvel-appel-a-projets/
-->

<!-- 
- ouverture de deux sessions de vote en parallèle
- le code de confirmation d'une session valable pour l'autre ?
- image pour copier le cachet est invisible
- message d'erreur pas explicite + redirection pas possible de revenir en arrière
- bandeau de durée du vote ressemble à un bandeau d’erreur
- liens cassés dans les mails
- mots pas consistants entre l’interface et l’aide (captcha / code de sécurité)
-->

----

[^1]: Techniquement le mail n'a pas comnplètement été configuré correctement. L'enregistrement SPF avec le nom ou l'IP du serveur d'envoi est manquante mais la clef cryptographique de l'enregistrement DKIM est bien présente dans l'entête du mail. Ce qui est suffisant pour prouver la légitimité de l'envoi.
