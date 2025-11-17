---
layout: contact
permalink: contact/
title: me in Amsterdam, contact
---

## Abonnez-vous à la Newsletter

Laissez votre adresse mail ci-dessous et recevez les prochains articles directement dans votre boîte-aux-lettres.
</p>

{% include "../includes/newsletter-form.njk" %}

Ces informations ne sont utilisés que pour envoyer les nouveaux articles.{.note}

## Autre moyen de me suivre

- [Flus RSS de me in Amsterdam](/feed.xml)
- [Mastodon: @meinamsterdam@piaille.fr](https://piaille.fr/@meinamsterdam){rel="me"}

## Contact

L'auteur de ce blog est Alix Guillard que vous pouvez contacter depuis [sa page personelle](https://alix.guillard.fr/) ou via ce formulaire de contact :

<section class="mailform">
  <form id="contactForm" onSubmit="HandleSubmit(event)">
    <label for="name">Votre nom :</label>
    <input type="text" id="name" name="name" required data-validation-required-message="Entrez votre nom"/>
    <label for="email">Votre adresse électronique :</label>
    <input type="email" id="email" name="email" required data-validation-required-message="votre adresse mail" data-validation-validemail-message="votre adresse n'est pas bonne" />
    <label for="message">Message:</label>
    <textarea name="message" id="message" required maxlength="255" data-validation-minlength-message="5 caractères minimum" minlength="5" data-validation-required-message="merci d'écrire un message"></textarea>
    <button type="submit" id="formsubmit">Envoyer</button>
  </form>
</section>
<p></p>
<section id="feedback" class="rollup"></section>