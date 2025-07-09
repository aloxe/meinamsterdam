---
layout: contact
permalink: contact/
title: Formulaire de contact
---

<p>Pour m'envoyer votre message, veuillez compléter tous les champs de ce formulaire : </p>

<section id="mailform">
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

<section id="feedback" class="rollup"></section>
<hr>

<ul>
		<li><a href="/newsletter/">Abonnez-vous à la newsletter</a></li>
</ul>