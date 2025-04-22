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

# Controls comments or trakbacks capabilities
function isContributionAllowed($id,$dt,$com=true)
{
	global $core;

	if (!$id) {
		return true;
	}
	if ($com) {
		if (($core->blog->settings->system->comments_ttl == 0) ||
			(time() - $core->blog->settings->system->comments_ttl*86400 < $dt)) {
			return true;
		}
	} else {
		if (($core->blog->settings->system->trackbacks_ttl == 0) ||
			(time() - $core->blog->settings->system->trackbacks_ttl*86400 < $dt)) {
			return true;
		}
	}
	return false;
}

$post_id = '';
$cat_id = '';
$post_dt = '';
$post_format = $core->auth->getOption('post_format');
$post_editor = $core->auth->getOption('editor');
$post_password = '';
$post_url = '';
$post_lang = $core->auth->getInfo('user_lang');
$post_title = '';
$post_excerpt = '';
$post_excerpt_xhtml = '';
$post_content = '';
$post_content_xhtml = '';
$post_notes = '';
$post_status = $core->auth->getInfo('user_post_status');
$post_selected = false;

$post_open_comment = $core->blog->settings->system->allow_comments;
$post_open_tb = $core->blog->settings->system->allow_trackbacks;

$post_media = array();

$params['post_type']='galitem';
$can_view_page = true;
$can_edit_post = $core->auth->check('usage,contentadmin',$core->blog->id);
$can_publish = $core->auth->check('publish,contentadmin',$core->blog->id);

$core->media = new dcMedia($core);
$core->meta = new dcMeta($core);


/*
$post_headlink = '<link rel="%s" title="%s" href="post.php?id=%s" />';
$post_link = '<a href="post.php?id=%s" title="%s">%s</a>';
*/
$next_link = $prev_link = $next_headlink = $prev_headlink = null;

$item_headlink = '<link rel="%s" title="%s" href="plugin.php?p=gallery&amp;m=item&amp;id=%s" />';
$item_link = '<a href="plugin.php?p=gallery&amp;m=item&amp;id=%s" title="%s">%s</a>';


# If user can't publish
if (!$can_publish) {
	$post_status = -2;
}

# Getting categories
$categories_combo = dcAdminCombos::getCategoriesCombo(
	$core->blog->getCategories(array('post_type'=>'galitem'))
);

# Status combo
$status_combo = dcAdminCombos::getPostStatusesCombo();

$img_status_pattern = '<img class="img_select_option" alt="%1$s" title="%1$s" src="images/%2$s" />';

# Formats combo
$core_formaters = $core->getFormaters();
$available_formats = array('' => '');
foreach ($core_formaters as $editor => $formats) {
	foreach ($formats as $format) {
		$available_formats[$format] = $format;
	}
}

# Languages combo
$rs = $core->blog->getLangs(array('order'=>'asc'));
$lang_combo = dcAdminCombos::getLangsCombo($rs,true);

# Validation flag
$bad_dt = false;

if (empty($_REQUEST['id'])) {
	$core->error->add(__('This entry does not exist.'));
	$can_view_page = false;
} else {
	$params['post_id'] = $_REQUEST['id'];

	$post = $core->gallery->getGalImageMedia($params);
	/*$post->extend(rsExtImage);*/

	if ($post->isEmpty())
	{
		$core->error->add(__('This entry does not exist.'));
		$can_view_page = false;
	}
	else
	{
		$media=$core->media->getFile($post->media_id);
		$post_id = $post->post_id;
		$cat_id = $post->cat_id;
		$post_dt = date('Y-m-d H:i',strtotime($post->post_dt));
		$post_format = $post->post_format;
		$post_password = $post->post_password;
		$post_url = $post->post_url;
		$post_lang = $post->post_lang;
		$post_title = $post->post_title;
		$post_excerpt = $post->post_excerpt;
		$post_excerpt_xhtml = $post->post_excerpt_xhtml;
		$post_content = $post->post_content;
		if (trim($post_content) === "///html\n<p></p>\n///" || trim($post_content) == '' ||
			trim($post_content) === "///html\n<p>&nbsp;</p>\n///")
			$post_content = '';
		$post_content_xhtml = $post->post_content_xhtml;
		if (trim($post_content_xhtml) === "<p></p>" || trim($post_content_xhtml) == '' ||
			trim($post_content_xhtml) === "<p>&nbsp;</p>")
			$post_content_xhtml = '';
		$post_notes = $post->post_notes;
		$post_status = $post->post_status;
		$post_selected = (boolean) $post->post_selected;
		$post_open_comment = (boolean) $post->post_open_comment;
		$post_open_tb = (boolean) $post->post_open_tb;
		$page_title = __('Edit image');

		$can_edit_post = $post->isEditable();
		$img_gals = $core->gallery->getImageGalleries($post_id);

		$next_rs = $core->gallery->getNextGalleryItem($post,1);
		$prev_rs = $core->gallery->getNextGalleryItem($post,-1);
		if ($next_rs !== null) {
			$next_link = sprintf($item_link,$next_rs->post_id,
				html::escapeHTML($next_rs->post_title),__('next item').'&nbsp;&#187;');
			$next_headlink = sprintf($item_headlink,'next',
				html::escapeHTML($next_rs->post_title),$next_rs->post_id);
		}

		if ($prev_rs !== null) {
			$prev_link = sprintf($item_link,$prev_rs->post_id,
				html::escapeHTML($prev_rs->post_title),'&#171;&nbsp;'.__('previous item'));
			$prev_headlink = sprintf($item_headlink,'previous',
				html::escapeHTML($prev_rs->post_title),$prev_rs->post_id);
		}

	}
}


# Format excerpt and content
if (!empty($_POST) && $can_edit_post)
{
	$post_format = $_POST['post_format'];
	$post_excerpt = $_POST['post_excerpt'];
	$post_content = $_POST['post_content'];

	/* Enable null post content */
	if (trim($post_content)==='')
		$post_content="///html\n<p></p>\n///";

	if (trim($post_content_xhtml)==='')
		$post_content_xhtml="<p></p>";

	$post_title = $_POST['post_title'];

	$cat_id = (integer) $_POST['cat_id'];

	if (isset($_POST['post_status'])) {
		$post_status = (integer) $_POST['post_status'];
	}

	if (empty($_POST['post_dt'])) {
		$post_dt = '';
	} else {
		try
		{
			$post_dt = strtotime($_POST['post_dt']);
			if ($post_dt == false || $post_dt == -1) {
				$bad_dt = true;
				throw new Exception(__('Invalid publication date'));
			}
			$post_dt = date('Y-m-d H:i',$post_dt);
		}
		catch (Exception $e)
		{
			$core->error->add($e->getMessage());
		}
	}

	$post_open_comment = !empty($_POST['post_open_comment']);
	$post_open_tb = !empty($_POST['post_open_tb']);
	$post_selected = !empty($_POST['post_selected']);
	$post_lang = $_POST['post_lang'];
	$post_password = !empty($_POST['post_password']) ? $_POST['post_password'] : null;

	$post_notes = $_POST['post_notes'];
	if (isset($_POST['post_url'])) {
		$post_url = $_POST['post_url'];
	}

	$core->blog->setPostContent(
		$post_id,$post_format,$post_lang,
		$post_excerpt,$post_excerpt_xhtml,$post_content,$post_content_xhtml
	);

}

# Create or update post
if (!empty($_POST) && !empty($_POST['save']) && $can_edit_post)
{
	$cur = $core->con->openCursor($core->prefix.'post');

	$cur->post_title = $post_title;
	$cur->cat_id = ($cat_id ? $cat_id : null);
	$cur->post_dt = $post_dt ? date('Y-m-d H:i:00',strtotime($post_dt)) : '';
	$cur->post_format = $post_format;
	$cur->post_password = $post_password;
	$cur->post_lang = $post_lang;
	$cur->post_title = $post_title;
	$cur->post_excerpt = $post_excerpt;
	$cur->post_excerpt_xhtml = $post_excerpt_xhtml;
	$cur->post_content = $post_content;
	$cur->post_content_xhtml = $post_content_xhtml;
	$cur->post_notes = $post_notes;
	$cur->post_status = $post_status;
	$cur->post_selected = (integer) $post_selected;
	$cur->post_open_comment = (integer) $post_open_comment;
	$cur->post_open_tb = (integer) $post_open_tb;
	$cur->post_type='galitem';

	if (isset($_POST['post_url'])) {
		$cur->post_url = $post_url;
	}

	# Update post
	if ($post_id)
	{
		try
		{
			# --BEHAVIOR-- adminBeforeGalleryItemUpdate
			$core->callBehavior('adminBeforeGalleryItemUpdate',$cur,$post_id);

			$core->blog->updPost($post_id,$cur);

			# --BEHAVIOR-- adminBeforeGalleryItemUpdate
			$core->callBehavior('adminAfterGalleryItemUpdate',$cur,$post_id);

			dcPage::addSuccessNotice (sprintf(__('The image "%s" has been successfully updated'),html::escapeHTML($cur->post_title)));
			$core->adminurl->redirect(
				'admin.plugin.gallery.item',
				array('id' => $post_id)
			);
		}
		catch (Exception $e)
		{
			$core->error->add($e->getMessage());
		}
	}
	else
	{
		$cur->user_id = $core->auth->userID();

		try
		{

			# --BEHAVIOR-- adminBeforeGalleryItemCreate
			$core->callBehavior('adminBeforeGalleryItemCreate',$cur);

			$return_id = $core->blog->addPost($cur);

			# --BEHAVIOR-- adminAfterGalleryItemCreate
			$core->callBehavior('adminAfterGalleryItemCreate',$cur,$return_id);

			dcPage::addSuccessNotice (sprintf(__('The image "%s" has been successfully created'),html::escapeHTML($cur->post_title)));
			$core->adminurl->redirect(
				'admin.plugin.gallery.item',
				array('id' => $post_id)
			);
		}
		catch (Exception $e)
		{
			$core->error->add($e->getMessage());
		}
	}
}
$default_tab = 'edit-entry';
if ($post_id) {
	switch ($post_status) {
		case 1:
			$img_status = sprintf($img_status_pattern,__('Published'),'check-on.png');
			break;
		case 0:
			$img_status = sprintf($img_status_pattern,__('Unpublished'),'check-off.png');
			break;
		case -1:
			$img_status = sprintf($img_status_pattern,__('Scheduled'),'scheduled.png');
			break;
		case -2:
			$img_status = sprintf($img_status_pattern,__('Pending'),'check-wrn.png');
			break;
		default:
			$img_status = '';
	}
	$edit_entry_str = __('&ldquo;%s&rdquo;');
	$page_title_edit = sprintf($edit_entry_str, html::escapeHTML($post_title)).' '.$img_status;
} else {
	$img_status = '';
}
$admin_post_behavior = '';
if ($post_editor) {
	$p_edit = $c_edit = '';
	if (!empty($post_editor[$post_format])) {
		$p_edit = $post_editor[$post_format];
	}
	if (!empty($post_editor['xhtml'])) {
		$c_edit = $post_editor['xhtml'];
	}
	if ($p_edit == $c_edit) {
		$admin_post_behavior .= $core->callBehavior('adminPostEditor',
			$p_edit,'page',array('#post_excerpt','#post_content','#comment_content'));
	} else {
		$admin_post_behavior .= $core->callBehavior('adminPostEditor',
			$p_edit,'page',array('#post_excerpt','#post_content'));
		$admin_post_behavior .= $core->callBehavior('adminPostEditor',
			$c_edit,'comment',array('#comment_content'));
	}
}

?>
<html>
<head>
  <title>Gallery</title>
<?php echo dcPage::jsDatePicker().
	dcPage::jsToolBar().
	dcPage::jsModal().
	dcPage::jsMetaEditor().
	$admin_post_behavior.
	dcPage::jsLoad('js/_post.js').
	//dcPage::jsLoad('index.php?pf=gallery/js/_gal.js').
	dcPage::jsConfirmClose('entry-form').
	$core->callBehavior('adminGalleryItemHeaders').
	dcPage::jsPageTabs($default_tab);
 ?>

  <link rel="stylesheet" type="text/css" href="index.php?pf=gallery/admin_css/style.css" />


</script>
</head>
<body>
<?php
/* DISPLAY
-------------------------------------------------------- */

# XHTML conversion
if (!empty($_GET['xconv']))
{
	$post_excerpt = $post_excerpt_xhtml;
	$post_content = $post_content_xhtml;
	$post_format = 'xhtml';

	dcPage::message(__('Don\'t forget to validate your XHTML conversion by saving your gallery.'));
}


if ($core->error->flag()) {
	echo
	'<div class="error"><strong>'.__('Errors:').'</strong>'.
	$core->error->toHTML().
	'</div>';
}
echo dcPage::breadcrumb(array(
	html::escapeHTML($core->blog->name) => '',
	__('Galleries') => $p_url,
	__('Edit Image') => ""

)).dcPage::notices();

# Exit if we cannot view page
if (!$can_view_page) {
	exit;
}
if ($post_id)
{
	if ($post->post_status == 1) {
		echo '<p><a class="onblog_link outgoing" href="'.$post->getURL().'" title="'.$post_title.'">'.__('Go to this image on the site').' <img src="images/outgoing-blue.png" alt="" /></a></p>';
	}
	echo '<p class="nav_prevnext">';
	if ($prev_link) { echo $prev_link; }
	if ($next_link && $prev_link) { echo ' | '; }
	if ($next_link) { echo $next_link; }

	# --BEHAVIOR-- adminPostNavLinks
	$core->callBehavior('adminGalleryItemNavLinks',isset($post) ? $post : null);

	echo '</p>';
}
echo '<div class="multi-part" title="'.($post_id ? __('Edit image') : $page_title).'" id="edit-entry">';

echo '<div class="fieldset"><h3>'.__('Information').'</h3>';

echo '<div class="three-cols clearfix">'.
	'<div class="col">'.
	'<img style="float:left;margin-right: 20px;" src="'.$media->media_thumb['t'].'" alt="'.$media->media_title.'" />'.
	'</div><!--'.
	'--><div class="col">'.
	'<h3>'.__('Media').'</h3>'.
	'<p><a href="media_item.php?id='.$media->media_id.'&amp;popup=0">'.__('View associated media').'</a></p>';

$img_gals_txt = ($img_gals->count() > 1)?__('This image belongs to %d galleries'):__('This image belongs to %d gallery');

echo '</div><!--'.
	'--><div class="col">'.
	'<h3>'.__('Galleries').'</h3>'.
	'<p>'.sprintf($img_gals_txt,$img_gals->count()).' :</p>';
if ($img_gals->count() != 0) {
	echo '<ul>';
	while ($img_gals->fetch()) {
		echo '<li><a href="plugin.php?p=gallery&amp;m=gal&amp;id='.$img_gals->post_id.'" alt="'.$img_gals->post_title.'">'.$img_gals->post_title.'</a></li>';
	}
	echo '</ul>';
}

echo '</div>'.
	'</div>';
echo "</div>";

/* Post form if we can edit post
-------------------------------------------------------- */
if ($can_edit_post)
{
	$sidebar_items = new ArrayObject(array(
		'status-box' => array(
			'title' => __('Status'),
			'items' => array(
				'post_status' =>
					'<p class="entry-status"><label for="post_status">'.__('Image status').' '.$img_status.'</label>'.
					form::combo('post_status',$status_combo,$post_status,'maximal','',!$can_publish).
					'</p>',
				'post_dt' =>
					'<p><label for="post_dt">'.__('Publication date and hour').'</label>'.
					form::field('post_dt',16,16,$post_dt,($bad_dt ? 'invalid' : '')).
					'</p>',
				'post_lang' =>
					'<p><label for="post_lang">'.__('Entry language').'</label>'.
					form::combo('post_lang',$lang_combo,$post_lang).
					'</p>',
				'post_format' =>
					'<div>'.
					'<h5 id="label_format"><label for="post_format" class="classic">'.__('Text formatting').'</label></h5>'.
					'<p>'.form::combo('post_format',$available_formats,$post_format,'maximal').'</p>'.
					'<p class="format_control control_no_xhtml">'.
					'<a id="convert-xhtml" class="button'.($post_id && $post_format != 'wiki' ? ' hide' : '').'" href="'.
					$core->adminurl->get('admin.plugin.gallery.gal',array('id'=> $post_id,'xconv'=> '1')).
					'">'.
					__('Convert to XHTML').'</a></p></div>')),
		'metas-box' => array(
			'title' => __('Filing'),
			'items' => array(
				'post_selected' =>
					'<p><label for="post_selected" class="classic">'.
					form::checkbox('post_selected',1,$post_selected).' '.
					__('Selected image').'</label></p>',
				'cat_id' =>
					'<div>'.
					'<h5 id="label_cat_id">'.__('Category').'</h5>'.
					'<p><label for="cat_id">'.__('Category:').'</label>'.
					form::combo('cat_id',$categories_combo,$cat_id,'maximal').
					'</p>'.
					($core->auth->check('categories', $core->blog->id) ?
						'<div>'.
						'<h5 id="create_cat">'.__('Add a new category').'</h5>'.
						'<p><label for="new_cat_title">'.__('Title:').' '.
						form::field('new_cat_title',30,255,'','maximal').'</label></p>'.
						'<p><label for="new_cat_parent">'.__('Parent:').' '.
						form::combo('new_cat_parent',$categories_combo,'','maximal').
						'</label></p>'.
						'</div>'
					: '').
					'</div>')),
		'options-box' => array(
			'title' => __('Options'),
			'items' => array(
				'post_open_comment_tb' =>
					'<div>'.
					'<h5 id="label_comment_tb">'.__('Comments and trackbacks list').'</h5>'.
					'<p><label for="post_open_comment" class="classic">'.
					form::checkbox('post_open_comment',1,$post_open_comment).' '.
					__('Accept comments').'</label></p>'.
					($core->blog->settings->system->allow_comments ?
						(isContributionAllowed($post_id,strtotime($post_dt),true) ?
							'' :
							'<p class="form-note warn">'.
							__('Warning: Comments are not more accepted for this entry.').'</p>') :
						'<p class="form-note warn">'.
						__('Comments are not accepted on this blog so far.').'</p>').
					'<p><label for="post_open_tb" class="classic">'.
					form::checkbox('post_open_tb',1,$post_open_tb).' '.
					__('Accept trackbacks').'</label></p>'.
					($core->blog->settings->system->allow_trackbacks ?
						(isContributionAllowed($post_id,strtotime($post_dt),false) ?
							'' :
							'<p class="form-note warn">'.
							__('Warning: Trackbacks are not more accepted for this entry.').'</p>') :
						'<p class="form-note warn">'.__('Trackbacks are not accepted on this blog so far.').'</p>').
					'</div>',
				'post_url' =>
					'<div class="lockable">'.
					'<p><label for="post_url">'.__('Edit basename').'</label>'.
					form::field('post_url',10,255,html::escapeHTML($post_url),'maximal').
					'</p>'.
					'<p class="form-note warn">'.
					__('Warning: If you set the URL manually, it may conflict with another entry.').
					'</p></div>'
	))));

	$main_items = new ArrayObject(array(
		"post_title" =>
			'<p class="col">'.
			'<label class="required no-margin bold" for="post_title"><abbr title="'.__('Required field').'">*</abbr> '.__('Title:').'</label>'.
			form::field('post_title',20,255,html::escapeHTML($post_title),'maximal').
			'</p>',
		"post_excerpt" =>
			'<p class="area" id="excerpt-area"><label for="post_excerpt" class="bold">'.__('Excerpt:').' <span class="form-note">'.
			__('Introduction to the post.').'</span></label> '.
			form::textarea('post_excerpt',50,5,html::escapeHTML($post_excerpt)).
			'</p>',

		"post_content" =>
			'<p class="area" id="content-area"><label class="required bold" '.
			'for="post_content"><abbr title="'.__('Required field').'">*</abbr> '.__('Content:').'</label> '.
			form::textarea('post_content',50,$core->auth->getOption('edit_size'),html::escapeHTML($post_content)).
			'</p>',

		"post_notes" =>
			'<p class="area" id="notes-area"><label for="post_notes" class="bold">'.__('Personal notes:').' <span class="form-note">'.
			__('Unpublished notes.').'</span></label>'.
			form::textarea('post_notes',50,5,html::escapeHTML($post_notes)).
			'</p>'
		)
	);
	# --BEHAVIOR-- adminPostFormItems
	$core->callBehavior('adminGalleryItemFormItems',$main_items,$sidebar_items, isset($post) ? $post : null);

	echo '<form action="plugin.php?p=gallery&amp;m=item" method="post" id="entry-form">'.
		'<div id="entry-wrapper">'.
		'<div id="entry-content"><div class="constrained">';
	foreach ($main_items as $id => $item) {
		echo $item;
	}

	# --BEHAVIOR-- adminGalleryForm
	$core->callBehavior('adminGalleryItemForm',isset($post) ? $post : null);

	echo
	'<p class="border-top">'.
	$core->formNonce().
	($post_id ? form::hidden('id',$post_id) : '').
	'<input type="submit" value="'.__('save').' (s)" tabindex="4" '.
	'accesskey="s" name="save" /> '.
	'</p>';

	echo '</div></div></div>';		// End #constrained, #entry-content
	echo '<div id="entry-sidebar" role="complementary">';

	foreach ($sidebar_items as $id => $c) {
		echo '<div id="'.$id.'" class="sb-box">'.
			'<h4>'.$c['title'].'</h4>';
		foreach ($c['items'] as $e_name=>$e_content) {
			echo $e_content;
		}
		echo '</div>';
	}
	# --BEHAVIOR-- adminPostFormSidebar (may be deprecated)
	$core->callBehavior('adminGalleryItemFormSidebar',isset($post) ? $post : null);
	echo '</div>';		// End #entry-sidebar

	echo '</form>';

} // if canedit post
?>
</div>
</body>
</html>
