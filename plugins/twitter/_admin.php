<?php
if (!defined('DC_CONTEXT_ADMIN')) { return; }
 
$core->addBehavior('initWidgets',
	array('twitterWidget','initWidgets'));
 
class twitterWidget
{
	public static function initWidgets(&$w)
	{
		$w->create('Twitter','Twitter',
			array('publicTwitter','getTweets'));
			
		$w->Twitter->setting('userName',__('Nom d\'utilisateur ou ID:'),
			'chucknorris','text');
		$w->Twitter->setting('count',__('Nombre de tweets à afficher ( de 1 à 20):'),
			'1','text');
		$w->Twitter->setting('prefix',__('Préfixe:'),
			'%name% a dit:');
		$w->Twitter->setting('ignoreReplies',__('Ignorer les réponses (tweets commençant par \'@\')'),
			false,'check');
		$w->Twitter->setting('template',__('Template HTML (laissez vide pour le template par défaut) :'),
			'"%text%" <span class="twitterTime">Posted <a href="http://twitter.com/%user_screen_name%/statuses/%id%/">%time%</a></span>','textarea');
		$w->Twitter->setting('help',__('Pour plus d\'informations sur la personnalisation du plugin et des exemples de template, '.
			'lire le read_me.html du plugin.'),
			true,'check');
	}
}
?>