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

if (!defined('DC_CONTEXT_ADMIN')) { exit; }


$gal_id = !empty($_REQUEST['gal_id']) ? (integer) $_REQUEST['gal_id'] : null;
$attach = !empty($_POST['attach']);
$detach = !empty($_POST['detach']);
$media_id = !empty($_REQUEST['media_id']) ? (integer) $_REQUEST['media_id'] : null;
$display_page=true;
$redir = $core->adminurl->get("admin.plugin.gallery.gal",array('id' => $gal_id),'&');
if ($gal_id) {
	$gal = $core->gallery->getGalleries(array('post_id'=>$gal_id));
	if ($gal->isEmpty()) {
		$gal_id = null;
	}
	$post_title = $gal->post_title;
	unset($post);
}
if ($gal_id == null) {
	$core->error->add(__('This gallery does not exist'));
	$display_page=false;
}

if ($attach) {
	$core->gallery->removeAllPostMedia($gal_id,$media_id);
	$core->gallery->addPostMedia($gal_id,$media_id);
	dcPage::addSuccessNotice (__('Presentation thumbnail successfully attached'));
	http::redirect($redir);
	exit;
} else if ($detach) {
	$core->gallery->removeAllPostMedia($gal_id,$media_id);
	dcPage::addSuccessNotice (__('Presentation thumbnail successfully removed'));
	http::redirect($redir);
	exit;
}

$d = isset($_REQUEST['d']) ? $_REQUEST['d'] : null;
$dir = null;
$upfile = array();

$page = !empty($_GET['page']) ? $_GET['page'] : 1;
$nb_per_page =  30;

if ($page != 1) {
	$_SESSION['media_manager_page'] = $page;
} else {
	unset($_SESSION['media_manager_page']);
}

$type = !empty($_GET['type']) ? $_GET['type'] : '';

$page_url = 'plugin.php?p=gallery&m=galthumb&gal_id='.$gal_id;

try {
	$core->media = new dcMedia($core,'image');
	$core->media->chdir($d);
	$core->media->getDir();
	$dir =& $core->media->dir;
} catch (Exception $e) {
	$core->error->add($e->getMessage());
}
?>
<html>
<head>
  <title>Gallery</title>
  <?php echo dcPage::jsLoad('js/_media.js')?>
</script>
</head>
<body>

<?php

echo '<h2><a href="'.html::escapeURL($page_url.'&amp;d=').'">'.__('Media manager').'</a>'.
' / '.$core->media->breadCrumb(html::escapeURL($page_url).'&amp;d=%s').'</h2>';

if ($gal_id) {
	echo '<p><strong>'.sprintf(__('Choose a media to attach to gallery %s by clicking on %s.'),
	'<a href="plugin.php?p=gallery&amp;m=gal&amp;id='.$gal_id.'">'.$post_title.'</a>',
	'<img src="images/plus.png" alt="'.__('Attach this file to entry').'" />').'</strong></p>';
}


$items = array_values(array_merge($dir['dirs'],$dir['files']));
if (count($items) == 0)
{
	echo '<p><strong>'.__('No file.').'</strong></p>';
}
else
{
	$pager = new pager($page,count($items),$nb_per_page,10);

	echo '<p>'.__('Page(s)').' : '.$pager->getLinks().'</p>';

	echo '<div class="media-list">';
	for ($i=$pager->index_start, $j=0; $i<=$pager->index_end; $i++, $j++)
	{
		echo mediaItemLine($items[$i],$j);
	}
	echo '</div>';

	echo '<p class="clear">'.__('Page(s)').' : '.$pager->getLinks().'</p>';
}

# Empty remove form (for javascript actions)
echo
'<form id="media-remove-hide" action="'.html::escapeURL($page_url).'" method="post"><div>'.
form::hidden('rmyes',1).form::hidden('d',html::escapeHTML($d)).
form::hidden('remove','').
'</div></form>';
?>
</body>
</html>

<?php
/* ----------------------------------------------------- */
function mediaItemLine($f,$i)
{
	global $page_url, $type, $gal_id,$core;

	$fname = $f->basename;

	if ($f->d) {
		$link = html::escapeURL($page_url).'&amp;d='.html::sanitizeURL($f->relname);
		if ($f->parent) {
			$fname = '..';
		}
	} else {
		$link =
		'media_item.php?type='.rawurlencode($type).
		'&amp;id='.$f->media_id.'&amp;gal_id='.$gal_id;
	}

	$class = 'media-item media-col-'.($i%2);

	$res =
	'<div class="'.$class.'"><a class="media-icon media-link" href="'.$link.'">'.
	'<img src="'.$f->media_icon.'" alt="" /></a>'.
	'<ul>'.
	'<li><a class="media-link" href="'.$link.'">'.$fname.'</a></li>';

	if (!$f->d) {
		$res .=
		'<li>'.$f->media_title.'</li>'.
		'<li>'.
		$f->media_dtstr.' - '.
		files::size($f->size).' - '.
		'<a href="'.$f->file_url.'">'.__('open').'</a>'.
		'</li>';
	}

	$res .= '<li class="media-action">&nbsp;';

	if ($gal_id && !$f->d) {
		$res .= '<form action="plugin.php?p=gallery&amp;m=galthumb" method="post">'.
		'<input type="image" src="images/plus.png" alt="'.__('Attach this file to entry').'" '.
		'title="'.__('Attach this file to entry').'" /> '.
		form::hidden('media_id',$f->media_id).
		form::hidden('gal_id',$gal_id).
		form::hidden('attach',1).$core->formNonce().
		'</form>';
	}


	$res .= '</li>';

	$res .= '</ul></div>';

	return $res;
}
?>
