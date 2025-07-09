---
layout: base
permalink: contact/
title: Formulaire de contact
---

Pour m'envoyer votre message, veuillez compléter tous les champs de ce formulaire : 

<form action="https://api.web3forms.com/submit" method="POST">

  <!-- Replace with your Access Key -->
  <input type="hidden" name="access_key" value="c7f897c8-2641-464d-85b5-dd418870cf08">

  <!-- Form Inputs. Each input must have a name="" attribute -->
  <label for="name" class="block text-sm/6 font-medium text-gray-900">Nom
  <input type="text" name="name" id="name" required class="block w-full grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 border-1 border-gray-300"></label>
  <label for="email" class="block text-sm/6 font-medium text-gray-900">Adresse mail
  <input type="email" id="email" name="email" required class="block w-full grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 border-1 border-gray-300"></label>
  <label for="message" class="block text-sm/6 font-medium text-gray-900">Message
  <textarea name="message" id="message" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-1 border-gray-300 placeholder:text-gray-400 sm:text-sm/6"></textarea></label>

  <!-- Honeypot Spam Protection -->
  <input type="checkbox" name="botcheck" class="hidden" style="display: none;">

  <!-- Custom Confirmation / Success Page -->
  <input type="hidden" name="redirect" value="https://meinamsterdam.nl/merci">

  <button type="submit" class="cursor-pointer">Envoyer</button>

</form>