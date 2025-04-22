<?php
# -- BEGIN LICENSE BLOCK ----------------------------------
#
# This file is part of Dotclear 2 Gallery plugin.
#
# Copyright (c) 2004-2015 Bruno Hondelatte, and contributors.
# Many, many thanks to Olivier Meunier and the Dotclear Team.
# Licensed under the GPL version 2.0 license.
# See LICENSE file or
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
#
# -- END LICENSE BLOCK ------------------------------------

/* Templates dir */
$core->addBehavior('publicBeforeDocument',array('behaviorsGallery','addTplPath'));

if (isset($core->gallery_integration)) {
	$core->addBehavior('templateBeforeBlock',array('behaviorsGallery','templateBeforeBlock'));
	$core->addBehavior('publicBeforeContentFilter',array('behaviorsGallery','publicBeforeContentFilter'));
	$core->addBehavior('publicHeadContent',array('behaviorsGallery','publicHeadContent'));
	$core->addBehavior('publicBeforeSearchCount',array('behaviorsGallery','publicBeforeSearchCount'));
}

class behaviorsGallery
{
	private static $enable_entry_content = array('default','default-page','search','tag');

	public static function publicBeforeSearchCount($arr_params) {
		global $core;
		$new = array();
		if ($core->gallery_integration->isEnabledForType('search',true,false))
			$new[]='gal';
		if ($core->gallery_integration->isEnabledForType('search',false,true))
			$new[]='galitem';
		if (count($new) > 0) {
			if (!isset($arr_params['post_type'])) {
				$arr_params['post_type']=array('post');
			}
			$arr_params['post_type'] = array_merge($arr_params['post_type'],$new);
		}
	}

	public static function publicHeadContent($core)
	{
		if ($core->gallery_integration->isEnabledForType($core->url->type)) {
				echo '<style type="text/css">'."\n".
				'@import url('.$core->blog->url.'gallerytheme/default/gallery.css);'."\n".
				"</style>\n";
		}
	}
	public static function addTplPath($core)
	{
		$widgets_path = dirname(__FILE__)."/widgets";
		if ($core->blog->settings->gallery->gallery_themes_path != null)
		    $core->tpl->setPath($core->tpl->getPath(),path::fullFromRoot($core->blog->settings->gallery->gallery_themes_path,DC_ROOT),
			$widgets_path);
		else
		    $core->tpl->setPath($core->tpl->getPath(),path::fullFromRoot('plugins/gallery/default-templates',DC_ROOT),
			$widgets_path);
	}

	public static function publicBeforeContentFilter ($core,$tag,$args)
	{
		global $_ctx;
		if ($tag == "EntryContent") {
			if ($_ctx->prevent_recursion)
				return;
			if (!$core->gallery_integration->isEnabledForType($core->url->type))
				return;
			if ($_ctx->posts->exists("post_type")) {
				$pt=$_ctx->posts->post_type;

				if ($pt=='galitem'
					&& $core->gallery_integration->isEnabledForType($core->url->type,false,true))  {
					if (!isset($core->gallery)) $core->gallery = new dcGallery($core);
					if (!isset($core->meta)) $core->meta = new dcMeta($core);
					$core->gallery->fillItemContext($_ctx);
					$args[0] = str_replace('<p></p>','',$args[0]);
					echo $core->tpl->getData(str_replace("'","\'","gal_simple/image_item.html"));
					$core->gallery->emptyItemContext($_ctx);
					$args[0]="";
				} elseif ($pt=='gal'
					&& $core->gallery_integration->isEnabledForType($core->url->type,true,false))  {
					if (!isset($core->gallery)) $core->gallery = new dcGallery($core);
					if (!isset($core->meta)) $core->meta = new dcMeta($core);
					$core->gallery->fillGalleryContext($_ctx,'integ');
					$args[0] = str_replace('<p></p>','',$args[0]);
					echo $core->tpl->getData(str_replace("'","\'","gal_".$_ctx->gallery_theme."/gallery_item.html"));
					$core->gallery->emptyGalleryContext($_ctx);
					$args[0]="";
				}
			}
		}
	}

	public static function templateBeforeBlock($core,$b,$attr)
	{
		global $_ctx;
		if (($b == 'Entries' || $b == 'Comments' || $b == 'Archives') && !isset($attr['post_type']))
		{
			return
			"<?php\n".
			'if (!isset($params)) $params=array();'."\n".
			'$core->gallery_integration->updateGetPostParams($core->url->type,$params);'."\n".
			"?>\n";
		}
	}

}

?>
