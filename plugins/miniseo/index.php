<?php
# ***** BEGIN LICENSE BLOCK *****
# This file is part of plugin miniseo for DotClear 2.

#
# DotClear is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
# 
# DotClear is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with DotClear; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
#
# ***** END LICENSE BLOCK *****

if (!defined('DC_CONTEXT_ADMIN')) { exit; }

function fttestlachaine($ftmonfic,$ftlachaine){
	$fd = fopen( $ftmonfic, "r" );
	$contents = fread( $fd, filesize( $ftmonfic ) );
	fclose($fd);
	if (strpos($contents,$ftlachaine)===false){
		return false;
	} else {
		return true;
	}
}

function fttestlaversion(){
	// But recupérer un numéro de version se trouvant dans un fichier sur un serveur web
	// Ici le fichier est à l'adresse http://www.myouaibe.com/public/version-miniseo/version.txt
	// Dans le simple fichier texte en miniscule il faut mettre <version>X.X
	// La fonction va lire le fichier txt et return ce qui est a droite de <version> soit X.X
	$fthostduserveur = "www.myouaibe.com";
	$fturlduficvers = "/public/version-miniseo/version.txt";
	$fp = fsockopen($fthostduserveur, 80, $errno, $errstr, 30);
	if (!$fp) {
    	echo "Erreur: $errstr ($errno)<br />\n";
	} else {
		// On place le flux en non bloquant au cas ou myouaibe soit par terre
		stream_set_blocking ($fp,0);
    	$out = "GET ".$fturlduficvers." HTTP/1.1\r\n";
    	$out .= "Host: ".$fthostduserveur."\r\n";
    	$out .= "Connection: Close\r\n\r\n";
		$content="";
    	fwrite($fp, $out);
    	while (!feof($fp)) {
        	$content.=fgets($fp, 128);
    	}
    	fclose($fp);
		if (rtrim($content)!==""){
			return array_pop(explode("<version>",$content));
		}
	}
	return "";
}
?>
<html>
<head>
<title><?php echo __('miniseo')?></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8">;
<?php
echo '<link rel="stylesheet" type="text/css" href="index.php?pf=miniseo/miniseo.css" />';
if (!empty($_GET['part'])) {
	$part = $_GET['part'] == 'about' ? 'about' :
				'form';
} else {
	$part = 'form';
}
echo dcPage::jsPageTabs($part);
?>
</head>
<body>
<?php
#onglet contenant les diagnostiques du plugin
echo '<h2>'.html::escapeHTML($core->blog->name).'&gt;'.__('miniseo').'</h2>'.
'<div id="form" title="'.__('Diagnostic').'" class="multi-part">';
	echo '<h3 class="stitle">'.__('Your DOTCLEAR version').'</h3>'.
	'<p class="version">'.__('version').' '.'<strong>'.DC_VERSION.'</strong>'.'</p>';
	
	echo '<p class="error">'.__('For information miniseo is for version 2.0-beta7.3-r1690 and up').'</p>';
	
	echo '<h3 class="stitle">'.__('Plugin miniseo').'</h3>'.
	'<p class="version">'.__('version').' '.'<strong>'.$core->plugins->moduleInfo('miniseo','version').'</strong>'.'</p>';

	
	//$lastversion = fttestlaversion();
	$lastversion=netHttp::quickGet('http://www.myouaibe.com/public/version-miniseo/version.txt');
	if (version_compare($core->plugins->moduleInfo('miniseo','version'),$lastversion,'<')){
		echo '<p class="error">'.__('A newest version exist for information : ').$lastversion.'</p>';
	}
	
	echo '<h3 class="stitle">'.__('Plugin Mymeta').'</h3>';
	if ($core->plugins->moduleExists('mymeta')){
		echo '<p class="version">'.__('version').' '.'<strong>'.$core->plugins->moduleInfo('mymeta','version').'</strong>'.'</p>';
	} else {
		echo '<p class="version">'.__('not installed').'</p>';
	}
	if ($core->plugins->moduleExists('related')){
		echo '<h3 class="stitle">'.__('Plugin Related').'</h3>';
		echo '<p class="version">'.__('version').' '.'<strong>'.$core->plugins->moduleInfo('related','version').'</strong>'.'</p>';
	}
	echo '<fieldset>'.
		'<legend>'.__('TAG present').'</legend>';
		echo '<p class="version">'.__('Used theme :').' <strong>'.$core->blog->settings->theme.'</strong></p>';
		echo '<p class="version">'.__('Path of theme use :').' <strong>'.$core->blog->themes_path.'/'.$core->blog->settings->theme.'</strong></p>';
		// On test si le repertoire tpl existe
		$letpl="";
		if (is_dir($core->blog->themes_path.'/'.$core->blog->settings->theme.'/tpl')){
			$letpl="/tpl";
		}
		
		// On test si le thème posséde un fichier _head.html
		// Si oui
		if (file_exists($core->blog->themes_path.'/'.$core->blog->settings->theme.$letpl.'/_head.html')){
			// On test la présence du tag de declanchement
			if (fttestlachaine($core->blog->themes_path.'/'.$core->blog->settings->theme.$letpl.'/_head.html','tpl:SysBehavior behavior="publicHeadContent"')){
				echo '<p class="version">'.__('Test if run tag is present :').' <strong><span class="ok">Ok</span></strong></p>';
			} else {
				echo '<p class="error">'.__('The run Tag is missed in your theme and in default theme').'</p>';
			}
		} else {
		// Si non
			// On test que le theme default est bien à jour et posséde ce tag
			// Si oui
			if (fttestlachaine($core->blog->themes_path.'/default/tpl/_head.html','tpl:SysBehavior behavior="publicHeadContent"')){
				echo '<p class="version">'.__('Test if run tag is present :').' <strong><span class="ok">'.__('Ok but not in your theme but in default theme').'</span></strong></p>';
			// Si non
			} else {
				echo '<p class="error">'.__("Your theme and also  default theme haven't the run tag").'</p>';
			}
		}
		// Maintenant dans le cadre du couplage avec myMeta il faut impérativement pas de balise title dans post.html
		echo '</fieldset>'.
	'<fieldset>'.
		'<legend class="important">'.__('Duo with plugin Mymeta').'</legend>';
		if ($core->plugins->moduleExists('mymeta')){
			if (file_exists($core->blog->themes_path.'/'.$core->blog->settings->theme.$tpl.'/post.html')){
				if (fttestlachaine($core->blog->themes_path.'/'.$core->blog->settings->theme.$tpl.'/post.html','<title>')){
					echo '<p class="error">'.__('Beware for your referencing<br /> two title will be present in post page<br />').'</p>';
					echo '<p class="version">'.__("Thank's to correct this<br />").'</p>';
					echo '<p class="version">'.__('In the file post.html delete line : <br /><br /><strong>&lt;title&gt;{{tpl:EntryTitle encode_html=&quot;1&quot;}} - {{tpl:BlogName encode_html=&quot;1&quot;}}&lt;/title&gt;').'</strong></p>';
				} else {
					echo '<p class="version">'.__('Test if tag title is missed in file post.html :').'<strong><span class="ok">'.__('Ok balise absente').'</span></strong></p>';
				}
			// Il n'y a pas de post.html dans le thème il faut donc prendre celui de default	
			} else {
				if (fttestlachaine($core->blog->themes_path.'/default/tpl/post.html','<title>')){
					echo '<p class="error">'.__('Beware for your referencing<br /> two title will be present in post page<br />').'</p>';
					echo '<p class="version">'.__("Thank's to correct this<br />").'</p>';
					echo '<p class="version">'.__('1/ Duplicate post.html from <b>default</b> theme in your directory <b>theme</b>').'</p>'; 
					echo '<p class="version">'.__('2/ In your file post.html now delete line : <br /><br /><strong>&lt;title&gt;{{tpl:EntryTitle encode_html=&quot;1&quot;}} - {{tpl:BlogName encode_html=&quot;1&quot;}}&lt;/title&gt;').'</strong></p>';
				} else {
					echo '<p class="version">'.__('Test if tag title is missed in file post.html :').' <strong><span class="ok">'.__('Ok tag are not present').'</span></strong></p>';
				}
			}
		}
	echo '</fieldset>';
echo '</div>';
#Deuxième onglet pour afficher quelques informations
echo '<div id="about" title="'.__('About').'" class="multi-part">'.
'<h3>'.__('Made by:').'</h3>'.
      '<ol>'.
      	'<li><a href="http://www.myouaibe.com">myouaibe.com</a></li>'
     .'</ol>'.
     '<h3>'.__('Thanks').'</h3>'.
     '<ol>'.
      	'<li>'.__('All members forum DC who help me').'</li>'.
		'<li>'.__('Team DC').'</li>'.
		'<li>'.__('DSL for plugin Mymeta').'</li>'.
	 '</ol>'.
     '<h3>'.__('More informations on plugin with dotaddict').'</h3>';
?>
	<ol>
		<li><a href="http://plugins.dotaddict.org/dc2/details/Mymeta"><?php echo __('Plugin myMeta sur dotaddict.org'); ?></a></li>
    	<li><a href="http://plugins.dotaddict.org/dc2/details/miniSEO"><?php echo __('Plugin miniSEO sur dotaddict.org'); ?></a></li>
	</ol>
	<br />
<?php
echo '<h3>'.__('Support and Update').'</h3><ul><li>'.
      __('Please go to:').'<a href="http://www.myouaibe.com/index.php/post/2008/03/26/Plugin-miniSEO">http://www.myouaibe.com</a></li></ul></div>';
?>
</body>
</html>