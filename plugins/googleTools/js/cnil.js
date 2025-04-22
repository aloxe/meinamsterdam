/*global dotclear */
/*exported gaOptout */
'use strict';

let cnil_data = dotclear.getData('googletools_cnil');
var gaProperty = cnil_data.uacct;

/*
    Gestion du cookie de consentement du tracking (obligation légale en France)
    Source : http://www.cnil.fr/vos-obligations/sites-web-cookies-et-autres-traceurs/outils-et-codes-sources/la-mesure-daudience
 */

// La variable gaProperty doit être initialisé avec le code de tracking Google Analytics avant l'appel de ce script
gaProperty = gaProperty || '';

// Désactive le tracking si le cookie d’Opt-out existe déjà.

const disableStr = `ga-disable-${gaProperty}`;

if (document.cookie.indexOf('hasConsent=false') > -1) {
  window[disableStr] = true;
}
//Cette fonction retourne la date d’expiration du cookie de consentement

function getCookieExpireDate() {
  const cookieTimeout = 34214400000; // Le nombre de millisecondes que font 13 mois
  const date = new Date();
  date.setTime(date.getTime() + cookieTimeout);
  const expires = `; expires=${date.toGMTString()}`;
  return expires;
}

// Cette fonction est appelée pour afficher la demande de consentement
function askConsent() {
  const bodytag = document.getElementsByTagName('body')[0];
  const div = document.createElement('div');
  div.setAttribute('id', 'cookie-banner');
  div.setAttribute('width', '70%');
  // Le code HTML de la demande de consentement
  // Vous pouvez modifier le contenu ainsi que le style
  div.innerHTML = `<div style="background-color:#fff;color:#000;">${cnil_data.query}</div>`;
  bodytag.insertBefore(div, bodytag.firstChild); // Ajoute la bannière juste au début de la page
  document.getElementsByTagName('body')[0].className += ' cookiebanner';
}

// Retourne la chaine de caractère correspondant à nom=valeur
function getCookie(NomDuCookie) {
  if (document.cookie.length > 0) {
    let begin = document.cookie.indexOf(NomDuCookie + '=');
    if (begin != -1) {
      begin += NomDuCookie.length + 1;
      let end = document.cookie.indexOf(';', begin);
      if (end == -1) end = document.cookie.length;
      return decodeURIComponent(document.cookie.substring(begin, end));
    }
  }
  return null;
}

// Fonction d'effacement des cookies
function delCookie(name) {
  document.cookie = `${name}=;path=/;domain=.${document.location.hostname}};expires=Thu, 01-Jan-1970 00:00:01 GMT`;
}

// Efface tous les types de cookies utilisés par Google Analytics
function deleteAnalyticsCookies() {
  const cookieNames = ['__utma', '__utmb', '__utmc', '__utmz', '_ga'];
  for (let i = 0; i < cookieNames.length; i++)
    delCookie(cookieNames[i]);
}

// La fonction d'opt-out
function gaOptout() {
  document.cookie = `${disableStr}=true; ${getCookieExpireDate()} ; path=/`;
  document.cookie = `hasConsent=false; ${getCookieExpireDate()} ; path=/`;
  const div = document.getElementById('cookie-banner');
  // Ci dessous le code de la bannière affichée une fois que l'utilisateur s'est opposé au dépôt
  // Vous pouvez modifier le contenu et le style
  if (div !== null) div.innerHTML = `<div style="background-color:#fff;color:#000;">${cnil_data.denied}</div>`;
  window[disableStr] = true;
  deleteAnalyticsCookies();
}

//Ce bout de code vérifie que le consentement n'a pas déjà été obtenu avant d'afficher
// la baniére
const consentCookie = getCookie('hasConsent');
if (!consentCookie) { //L'utilisateur n'a pas encore de cookie de consentement
  const referrer_host = document.referrer.split('/')[2];
  if (referrer_host != document.location.hostname) { //si il vient d'un autre site
    //on désactive le tracking et on affiche la demande de consentement
    window[disableStr] = true;
    window[disableStr] = true;
    window.onload = askConsent;
  } else { //sinon on lui dépose un cookie
    document.cookie = `hasConsent=true; ${getCookieExpireDate()} ; path=/`;
  }
}
