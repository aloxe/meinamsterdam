<?php
# ***** BEGIN LICENSE BLOCK *****
# This file is part of DotClear miniSEO plugin.
# Copyright (c) 2008 Francis Trautmann,  and contributors.
# Many, many thanks to Olivier Meunier and the Dotclear Team.
# All rights reserved.
#
# Mymeta plugin for DC2 is free sofwtare; you can redistribute it and/or modify
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

$core->addBehavior('publicHeadContent',array('tplMiniSEO','MetaMiniSEO'));
class tplMiniSEO
{

	// Function pour nettoyer les caractères illicite dans le head ainsi que les balises html
	public static function cleanContent($attr) {
			$attr = ereg_replace("\r?\n", " ", strip_tags($attr));
			$attr = ereg_replace("\""," ",$attr);
			$attr = ereg_replace("&amp;nbsp;"," ",$attr);
			$attr = ereg_replace("&nbsp;"," ",$attr);
			return $attr;
	}

	public static function MetaMiniSEO(&$core)
	{
		global $core;
		global $_ctx;
		
		// Pour l'instant nous gérons uniquement les billets
		$phpCode="";
		$typpost=$core->url->type;
		//echo $typpost;
		switch ($typpost) {

			case 'post':	// Le cas des billets
				$meta = $meta_title = "";
				// Si le plugin myMeta existe
				if ($core->plugins->moduleExists('mymeta')){
					$objMeta = new dcMeta($core);
					$objMyMeta = new myMeta($core);
					// On garde ce test pour compatibilité avec les versions < à 0.6
					// Sinon a partir de 0.6 les myMeta doivent être :
					// SEO-description  (résumé du post)
					// SEO-title  (balise title personnalisée
					if ($objMyMeta->isMetaEnabled("description")){
						$meta = $objMeta->getMetaStr($_ctx->posts->post_meta,"description");
					}
					if ($objMyMeta->isMetaEnabled("SEO-description")){
						$meta = $objMeta->getMetaStr($_ctx->posts->post_meta,"SEO-description");
					}
					if ($objMyMeta->isMetaEnabled("SEO-title")){
						$meta_title = $objMeta->getMetaStr($_ctx->posts->post_meta,"SEO-title");
					}
					if (rtrim($meta_title)!=""){
						$meta_title = "<title>".$meta_title."</title>";
					} else {
						$meta_title = "<title>".$_ctx->posts->post_title." - ".$core->blog->name."</title>";
					} 
				}
				
				// On effectue l'affichage de title
				echo $meta_title."\n";
				
				// Si mymeta a pas rempli la var meta on prend d office le contenu du billet sinon priorite a mymeta
				if (rtrim($meta)==""){
					$ftsep=" ";
					// Test pour separer me chapeau de la suite avec un espace rmq de p'tilou
					$urls = '0';
					if (!empty($attr['absolute_urls'])) {
						$urls = '1';
					}
					if (rtrim($_ctx->posts->getExcerpt('.$urls.'))==""){
						$ftsep="";
					}
					$meta= $_ctx->posts->getExcerpt('.$urls.').$ftsep.$_ctx->posts->getContent('.$urls.');
				}
				$meta = self::cleanContent($meta);
				$meta = text::cutString($meta,180);
				
				if (rtrim($meta)!=""){
					$meta = "<meta name=\"description\" content=\"".$meta."...\" />";
					echo $meta;
				}
			break; // end case 'post'
			
			case 'category':	// Le cas des billets
				/*
				$urls = '0';
				if (!empty($attr['absolute_urls'])) {
						$urls = '1';
				}
				$f = $GLOBALS['core']->tpl->getFilters($attr);
				$meta= $_ctx->categories->cat_desc('.$urls.');
				*/
				if (isset($GLOBALS["_page_number"])) { 
        			$current = " Page : ".$GLOBALS["_page_number"]; 
      			} else { 
        			$current = ""; 
      			} 
				$meta= context::global_filter($_ctx->categories->cat_desc,0,0,0,0,0);
				$meta = self::cleanContent($meta);
				$meta = text::cutString($meta,180);
				if (rtrim($meta)!=""){
					$meta = "<meta name=\"description\" content=\"".$meta."...".$current."\" />";
					echo $meta;
				}
			break; // end case 'category'

			case 'related':	// Le cas des pages related
				$meta="";
				// Si le plugin mymeta existe			
				if ($core->plugins->moduleExists('mymeta')){
					$objMeta = new dcMeta($core);
					$objMyMeta = new myMeta($core);
					if ($objMyMeta->isMetaEnabled("SEO-description")){
						$meta = $objMeta->getMetaStr($_ctx->posts->post_meta,"SEO-description");
					}
				}
				// La description n'a pas été gérée par SEO-description
				if (rtrim($meta)==""){
					// Soit c'est une iframe dans ce cas le corps du billet vaut  /** external content **/
					$ftsep=" ";
					// Test pour separer me chapeau de la suite avec un espace rmq de p'tilou
					$urls = '0';
					if (!empty($attr['absolute_urls'])) {
						$urls = '1';
					}
					if (rtrim($_ctx->posts->getExcerpt('.$urls.'))==""){
						$ftsep="";
					}
					// Si on trouve pas /** external content **/
					if (strpos($_ctx->posts->getContent('.$urls.'),"/** external content **/")===false){
						$meta= $_ctx->posts->getExcerpt('.$urls.').$ftsep.$_ctx->posts->getContent('.$urls.');
					} else {
						$meta = $_ctx->posts->getExcerpt('.$urls.');
					}
					$meta = self::cleanContent($meta);
					$meta = text::cutString($meta,180);
				}
				if (rtrim($meta)!=""){
					$meta = "<meta name=\"description\" content=\"".$meta."...\" />";
					echo $meta;
				}
				return;
			break;


			case 'default':	// Le cas de la page d'accueil
				if (rtrim($core->blog->desc)!=""){
					$meta = $core->blog->desc;
					$meta = self::cleanContent($meta);
					$meta = text::cutString($meta,180);
					$meta = "<meta name=\"description\" content=\"".$meta."...\" />";
					echo $meta;
				}
				return;
			break;
			
			case 'default-page':	// Le cas des pages suivantes
				if (isset($GLOBALS["_page_number"])) { 
        			$current = $GLOBALS["_page_number"]; 
      			} else { 
        			$current = 1; 
      			} 
				if (rtrim($core->blog->desc)!=""){
					$meta = $core->blog->desc;
					$meta = self::cleanContent($meta);
					$meta = text::cutString($meta,180);
					$meta = "<meta name=\"description\" content=\"".$meta." Page: ".$current."\" />";
					echo $meta;
				}
				return;
			break;


		} //end switch ($typpost)
		return;
	}
}
?>