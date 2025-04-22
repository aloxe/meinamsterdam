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

$core->meta = new dcMeta($core);
$core->media = new dcMedia($core);
$params=array();

$dirs_combo = array();
foreach ($core->media->getRootDirs() as $v) {
	if ($v->relname == "")
		$dirs_combo['/'] = ".";
	else
		$dirs_combo['/'.$v->relname] = $v->relname;
}

$defaults=($core->gallery->settings->gallery_new_items_default != null)?$core->gallery->settings->gallery_new_items_default:"YYYYY";
if (strlen($defaults)<7)
	$defaults="YYYYYYN";
$c_delete_orphan_media=($defaults{0} == "Y");
$c_delete_orphan_items=($defaults{1} == "Y");
$c_create_media=($defaults{2} == "Y");
$c_create_items=($defaults{3} == "Y");
$c_create_items_for_new_media=($defaults{4} == "Y");
$c_update_ts=($defaults{5} == "Y");
$c_force_thumbnails=($defaults{6} == "Y");

$max_ajax_requests = (int) $core->gallery->settings->gallery_max_ajax_requests;
if ($max_ajax_requests == 0)
	$max_ajax_requests=5;

?>
<html>
<head>
  <title><?php echo __('Gallery Items'); ?></title>
  <?php echo '<script type="text/javascript">'."\n".
	"//<![CDATA[\n".
		"dotclear.maxajaxrequests = ".$max_ajax_requests.";\n".
		"dotclear.msg.deleting_orphan_media = '".html::escapeJS(__('Deleting orphan media'))."';\n".
		"dotclear.msg.deleting_orphan_items = '".html::escapeJS(__('Deleting orphan image-posts'))."';\n".
		"dotclear.msg.creating_media = '".html::escapeJS(__('Creating media : %s'))."';\n".
		"dotclear.msg.creating_item = '".html::escapeJS(__('Creating image-post for : %s'))."';\n".
		"dotclear.msg.creating_thumbnail = '".html::escapeJS(__('Creating thumbnails for : %s'))."';\n".
	"\n//]]>\n".
	"</script>\n".
			dcPage::jsLoad('index.php?pf=gallery/js/jquery.ajaxmanager.js').
			dcPage::jsLoad('index.php?pf=gallery/js/_ajax_tools.js').
			dcPage::jsLoad('index.php?pf=gallery/js/_newitems.js');
  ?>
  <link rel="stylesheet" type="text/css" href="index.php?pf=gallery/admin_css/style.css" />
</head>
<body>

<?php
echo dcPage::breadcrumb(array(
	html::escapeHTML($core->blog->name) => '',
	__('Galleries') => $p_url,
	__('Manage new items') =>''
)).dcPage::notices();

echo '<ul class="pseudo-tabs">'.
	'<li><a href="plugin.php?p=gallery">'.__('Galleries').'</a></li>'.
	'<li><a href="plugin.php?p=gallery&amp;m=items">'.__('Images').'</a></li>'.
	'<li><a href="plugin.php?p=gallery&amp;m=newitems" class="active">'.__('Manage new items').'</a></li>'.
	'<li><a href="plugin.php?p=gallery&amp;m=options">'.__('Options').'</a></li>';
if ($core->auth->isSuperAdmin()) {
	echo
	'<li><a href="plugin.php?p=gallery&amp;m=maintenance">'.__('Maintenance').'</a></p>';
}
echo '</ul>';

echo '<form action="#" method="post" id="dir-form" onsubmit="return false;">'.
	'<div class="fieldset"><h3>'.__('New Items').'</h3>'.
	'<p><label class="classic">'.__('Select directory to analyse :')."&nbsp;".
	form::combo('media_dir',$dirs_combo,'').'</label></p> '.

	'<input type="button" class="proceed" value="'.__('proceed').'" />'.
	'</div></form>';
echo '<form action="#" method="post" id="actions-form" onsubmit="return false;">'.
	'<div class="fieldset" id="dirresults"><h3>'.__('Directory results').' : <span id="directory"></span></h3>'.
	'<table>'.
	'<tr><th>'.__('Request').'</th><th>'.__('Result').'</th><th colspan="2">'.__('Action').'</th></tr>'.
	'<tr><td>'.__('Number of orphan media (ie. media entries in database whose matching file no more exists):').'</td><td id="nborphanmedia" class="tdresult">&nbsp;</td>'.
		'<td>'.form::checkbox('delete_orphan_media',1,$c_delete_orphan_media).'</td><td>'.__('Delete orphan media').'</td></tr>'.
	'<tr><td>'.__('Number of orphan items (ie. image-post associated to a non-existent media in DB) :').'</td><td id="nborphanitems" class="tdresult">&nbsp;</td>'.
		'<td>'.form::checkbox('delete_orphan_items',1,$c_delete_orphan_items).'</td><td>'.__('Delete orphan items').'</td></tr>'.
	'<tr><td>'.__('Number of new media detected :').'</td><td id="nbnewmedia" class="tdresult">&nbsp;</td>'.
		'<td>'.form::checkbox('create_new_media',1,$c_create_media).'</td><td>'.__('Create media in database').'</td></tr>'.
	'<tr><td>'.__('Number of media without post associated :').'</td><td id="nbmediawithoutpost" class="tdresult">&nbsp;</td>'.
		'<td>'.form::checkbox('create_img_post',1,$c_create_items).'</td><td>'.__('Create image-post associated to media').'</td></tr>'.
	'<tr><td>'.__('Number of media in directory :').'</td><td id="nbcurmedia" class="tdresult">&nbsp;</td>'.
		'<td>'.form::checkbox('force_thumbnails',1,$c_force_thumbnails).'</td><td>'.__('Force existing thumbnails to be regenerated').'</td></tr>'.
	'</table>'.
	'<h2>Options</h2>'.
	'<p>'.form::checkbox('create_new_media_posts',1,$c_create_items_for_new_media).__('Create post-image for each new media').'</p>'.
	'<p>'.form::checkbox('update_ts',1,$c_update_ts).__('Set post date to image exif date').'</p>'.
	'<input type="button" class="proceed" value="'.__('proceed').'" />'.
	'</div></form>';

echo '<div id="itemsresults" class="fieldset"><h3>'.__('Operations').'</h3>'.
	'<form action="#" onsubmit="return false;"><p><input type="button" id="abort" value="'.__('Abort processing').'"/></p></form>'.
	'<table id="resulttable">'.
	'<tr class="keepme"><th>'.__('Request').'</th><th>'.__('Result').'</th></tr>'.
	'</table>'.
	'</div>';

?>


</body>
</html>
