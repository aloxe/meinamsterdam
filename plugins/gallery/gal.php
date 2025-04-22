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

$page_title = __('New gallery');
$can_view_page = true;
$can_edit_post = $core->auth->check('usage,contentadmin',$core->blog->id);
$can_publish = $core->auth->check('publish,contentadmin',$core->blog->id);

$core->media = new dcMedia($core);
$core->meta = new dcMeta($core);


$themes = $core->gallery->getThemes();
$themes[__('Use blog settings')]='default';
$themes_integ = $themes;
$themes_integ[__('same as gallery theme')] = 'sameasgal';
/*
$post_headlink = '<link rel="%s" title="%s" href="post.php?id=%s" />';
$post_link = '<a href="post.php?id=%s" title="%s">%s</a>';
*/
$next_link = $prev_link = $next_headlink = $prev_headlink = null;

$gal_headlink = '<link rel="%s" title="%s" href="plugin.php?p=gallery&amp;m=gal&amp;id=%s" />';
$gal_link = '<a href="plugin.php?p=gallery&amp;m=gal&amp;id=%s" title="%s">%s</a>';


# If user can't publish
if (!$can_publish) {
	$post_status = -2;
}

$orderby_combo = $core->gallery->orderby;
$sortby_combo = $core->gallery->sortby;

# Getting categories
$categories_combo = dcAdminCombos::getCategoriesCombo(
	$core->blog->getCategories(array('post_type'=>'gal'))
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

$c_media_dir = $c_tag = $c_user = $c_cat = 0;
$f_recurse_dir = 0;
$f_sub_cat = 0;
$f_media_dir = $f_tag = $f_user = $f_cat = null;
$f_orderby = $f_sortby = null;
$f_theme = "default";
$f_themeinteg = "default";


# Get entry informations
if (!empty($_REQUEST['id']))
{
	$params['post_id'] = $_REQUEST['id'];

	$post = $core->gallery->getGalleries($params);

	if ($post->isEmpty())
	{
		$core->error->add(__('This entry does not exist.'));
		$can_view_page = false;
	}
	else
	{
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
		$gal_filters = $core->gallery->getGalParams($post);
		if (isset($gal_filters['media_dir'])) {
			$c_media_dir=true;
			$f_media_dir=$gal_filters['media_dir'][0];
		}
		if (isset($gal_filters['recurse_dir'])) {
			$f_recurse_dir = 1;
		}
		if (isset($gal_filters['sub_cat'])) {
			$f_sub_cat = 1;
		}
		if (isset($gal_filters['tag'])) {
			$c_tag=true;
			$f_tag=$gal_filters['tag'];
		}
		if (isset($gal_filters['user_id'])) {
			$c_user=true;
			$f_user=$gal_filters['user_id'];
		}
		if (isset($gal_filters['cat_id'])) {
			$c_cat=true;
			$f_cat=(integer)$gal_filters['cat_id'];
		}
		if (isset($gal_filters['orderby'])) {
			$f_orderby = $gal_filters['orderby'];
		} else {
			$f_orderby = 'P.post_dt';
		}
		if (isset($gal_filters['sortby'])) {
			$f_sortby = $gal_filters['sortby'];
		} else {
			$f_orderby = 'ASC';
		}
		$gal_thumb = $core->gallery->getPostMedia($post_id);
		$has_thumb = (sizeof($gal_thumb) != 0);
		if ($has_thumb) {
			$gal_thumb = $gal_thumb[0];
		}
		$meta_list = $core->meta->getMetaArray($post->post_meta);
		$gal_nb_img = isset($meta_list['galitem'])?sizeof($meta_list['galitem']):0;
		$f_theme = isset($meta_list['galtheme'])?$meta_list['galtheme'][0]:'default';
		$f_themeinteg = isset($meta_list['galthemeinteg'])?$meta_list['galthemeinteg'][0]:'default';

		/*$gal_meta=$core->meta->getMetaArray($post->post_meta);
		if (isset($gal_meta["galordering"])) {
		} else {
			$gal_ordering = 'P.date';
		}
		if (isset($gal_meta["galorderdir"])) {
		} else {
			$gal_ordedir = 'ASC';
		}*/

		$page_title = __('Edit gallery');

		$can_edit_post = $post->isEditable();

		$next_rs = $core->gallery->getNextGallery($post_id,strtotime($post_dt),1);
		$prev_rs = $core->gallery->getNextGallery($post_id,strtotime($post_dt),-1);
		if ($next_rs !== null) {
			$next_link = sprintf($gal_link,$next_rs->post_id,
				html::escapeHTML($next_rs->post_title),__('next gallery').'&nbsp;&#187;');
			$next_headlink = sprintf($gal_headlink,'next',
				html::escapeHTML($next_rs->post_title),$next_rs->post_id);
		}

		if ($prev_rs !== null) {
			$prev_link = sprintf($gal_link,$prev_rs->post_id,
				html::escapeHTML($prev_rs->post_title),'&#171;&nbsp;'.__('previous gallery'));
			$prev_headlink = sprintf($gal_headlink,'previous',
				html::escapeHTML($prev_rs->post_title),$prev_rs->post_id);
		}
	}
}


$dirs_combo = array();
foreach ($core->media->getRootDirs() as $v) {
	if ($v->relname == "")
		$dirs_combo['/'] = ".";
	else
		$dirs_combo['/'.$v->relname] = $v->relname;
}
# Format excerpt and content
if (!empty($_POST) && $can_edit_post)
{
	$post_format = $_POST['post_format'];
	$post_excerpt = $_POST['post_excerpt'];
	$post_content = $_POST['post_content'];

	/* Enable null post content */
	if (trim($post_content)==='')
		$post_content="///html\n<p>&nbsp;</p>\n///";

	if (trim($post_content_xhtml)==='')
		$post_content_xhtml="<p>&nbsp;</p>";

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

	$c_media_dir = !empty($_POST['c_media_dir']);
	$c_tag = !empty($_POST['c_tag']);
	$c_cat = !empty($_POST['c_cat']);
	$c_user = !empty($_POST['c_user']);
	$f_media_dir = !empty($_POST['f_media_dir']) ? $_POST['f_media_dir'] : null;
	$f_recurse_dir = !empty($_POST['f_recurse_dir']);
	$f_sub_cat = !empty($_POST['f_sub_cat']);
	$f_tag = !empty($_POST['f_tag']) ? $_POST['f_tag'] : null;
	$f_cat = !empty($_POST['f_cat']) ? $_POST['f_cat'] : null;
	$f_user = !empty($_POST['f_user']) ? $_POST['f_user'] : null;
	$f_orderby = !empty($_POST['f_orderby']) ? $_POST['f_orderby'] : null;
	$f_sortby = !empty($_POST['f_sortby']) ? $_POST['f_sortby'] : null;
	$f_theme = !empty($_POST['f_theme']) ? $_POST['f_theme'] : 'default';
	$f_themeinteg = !empty($_POST['f_themeinteg']) ? $_POST['f_themeinteg'] : 'default';


	if (isset($_POST['post_url'])) {
		$post_url = $_POST['post_url'];
	}

	$core->blog->setPostContent(
		$post_id,$post_format,$post_lang,
		$post_excerpt,$post_excerpt_xhtml,$post_content,$post_content_xhtml
	);

}

# Create or update post
if (!empty($_POST) && !empty($_POST['save']) && $can_edit_post && !$bad_dt)
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
	$cur->post_type='gal';

	if (isset($_POST['post_url'])) {
		$cur->post_url = $post_url;
	}

	$updated=false;
	# Update post
	if ($post_id)
	{
		try
		{
			# --BEHAVIOR-- adminBeforeGalleryUpdate
			$core->callBehavior('adminBeforeGalleryUpdate',$cur,$post_id);

			$core->blog->updPost($post_id,$cur);

			# --BEHAVIOR-- adminAfterGalleryUpdate
			$core->callBehavior('adminAfterGalleryUpdate',$cur,$post_id);

			$updated=true;
			dcPage::addSuccessNotice (sprintf(__('The gallery "%s" has been successfully updated'),html::escapeHTML($cur->post_title)));

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
			# --BEHAVIOR-- adminBeforeGalleryCreate
			$core->callBehavior('adminBeforeGalleryCreate',$cur);

			$post_id = $core->blog->addPost($cur);

			# --BEHAVIOR-- adminAfterGalleryCreate
			$core->callBehavior('adminAfterGalleryCreate',$cur,$post_id);
			$updated=true;
			dcPage::addSuccessNotice (sprintf(__('The gallery "%s" has been successfully created'),html::escapeHTML($cur->post_title)));

		}
		catch (Exception $e)
		{
			$core->error->add($e->getMessage());
		}
	}
	if ($updated) {
		$core->meta->delPostMeta($post_id,"galmediadir");
		$core->meta->delPostMeta($post_id,"galrecursedir");
		$core->meta->delPostMeta($post_id,"galsubcat");
		$core->meta->delPostMeta($post_id,"galtag");
		$core->meta->delPostMeta($post_id,"galcat");
		$core->meta->delPostMeta($post_id,"galuser");
		$core->meta->delPostMeta($post_id,"galorderby");
		$core->meta->delPostMeta($post_id,"galsortby");
		$core->meta->delPostMeta($post_id,"galtheme");
		$core->meta->delPostMeta($post_id,"galthemeinteg");
		$core->meta->delPostMeta($post_id,"subcat");
		if ($c_media_dir) {
			$core->meta->setPostMeta($post_id,"galmediadir",$f_media_dir);
			$core->meta->setPostMeta($post_id,"galrecursedir",(integer)$f_recurse_dir);
		}
		if ($c_tag) {
			$core->meta->setPostMeta($post_id,"galtag",$f_tag);
		}
		if ($c_cat) {
			$core->meta->setPostMeta($post_id,"galcat",$f_cat);
			$core->meta->setPostMeta($post_id,"galsubcat",(integer)$f_sub_cat);
		}
		if ($c_user) {
			$core->meta->setPostMeta($post_id,"galuser",$f_user);
		}
		if (isset ($f_orderby)) {
			$core->meta->setPostMeta($post_id,"galorderby",$f_orderby);
		}
		if (isset ($f_sortby)) {
			$core->meta->setPostMeta($post_id,"galsortby",$f_sortby);
		}
		if (isset ($f_themeinteg) && $f_themeinteg != 'default') {
			$core->meta->setPostMeta($post_id,"galthemeinteg",$f_themeinteg);
		}
		if (isset ($f_theme) && $f_theme != 'default') {
			$core->meta->setPostMeta($post_id,"galtheme",$f_theme);
		}
		$core->gallery->refreshGallery($post_id);
	}
	$core->adminurl->redirect(
		'admin.plugin.gallery.gal',
		array('id' => $post_id)
	);
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
if ($post_editor && !empty($post_editor[$post_format])) {
	$admin_post_behavior = $core->callBehavior('adminPostEditor', $post_editor[$post_format],
											   'gal', array('#post_content', '#post_excerpt')
	);
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
	dcPage::jsLoad('index.php?pf=gallery/js/_gal.js').
	dcPage::jsConfirmClose('entry-form').
	$core->callBehavior('adminGalleryHeaders').
	dcPage::jsPageTabs($default_tab);
?>

  <!--<link rel="stylesheet" type="text/css" href="index.php?pf=gallery/admin_css/style.css" />-->

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
	$page_title => ''
)).dcPage::notices();

# Exit if we cannot view page
if (!$can_view_page) {
	exit;
}
if ($post_id)
{
if ($post_id && $post->post_status == 1) {
	echo '<p><a class="onblog_link outgoing" href="'.$post->getURL().'" title="'.$post_title.'">'.__('Go to this gallery on the site').' <img src="images/outgoing-blue.png" alt="" /></a></p>';
}
if ($post_id)
{
	echo '<p class="nav_prevnext">';
	if ($prev_link) { echo $prev_link; }
	if ($next_link && $prev_link) { echo ' | '; }
	if ($next_link) { echo $next_link; }

	# --BEHAVIOR-- adminPostNavLinks
	$core->callBehavior('adminGalleryNavLinks',isset($post) ? $post : null);

	echo '</p>';
}
}

echo '<div class="multi-part" title="'.($post_id ? __('Edit gallery') : $page_title).'" id="edit-entry">';
if ($post_id) {
	echo '<div class="fieldset"><h3>'.__('Information')."</h3>";
	echo '<div class="two-cols clearfix">'.
		'<div class="col">'.
		"<h4>".__('Presentation thumbnail')."</h4>";
	$change_thumb_url='plugin.php?p=gallery&amp;m=galthumb&amp;gal_id='.$post_id;
	if ($c_media_dir)
		$change_thumb_url .= '&amp;d='.$f_media_dir;

	if ($has_thumb) {
		echo '<div class="constrained">';
		echo '<a class="media-icon media-link" href="'.$gal_thumb->file_url.'"><img src="'.$gal_thumb->media_icon.'" /></a>';
		echo '<form action="plugin.php?p=gallery&amp;m=galthumb" method="post">';
		echo '<ul>';
		echo '<li>'.$gal_thumb->basename.'</li>';
		echo '<li>'.$gal_thumb->media_dtstr.' - '. files::size($gal_thumb->size).' - '.
		'<a href="'.$change_thumb_url.'&amp;change=1">'.__('Change').'</a></li>'.
		'<li><input type="image" src="images/trash.png" alt="'.__('Remove').'" style="border: 0px;" '.
		'title="'.__('Remove').'" />&nbsp;'.__('Remove').' '.
		form::hidden('gal_id',$post_id).
		form::hidden('detach',1).$core->formNonce().
		'</form></li></ul>';
		echo '</div>';
	} else {
		echo '<p>'.__('This gallery has no presentation thumbnail').'</p>';
		echo '<p><a href="'.$change_thumb_url.'">'.__('Define one').'</a>'.'</p>';
	}
	$gal_nb_img_txt = ($gal_nb_img > 1) ? __("This gallery has %d images"):__("This gallery has %d image");
	echo '</div>'. #col
		'<div class="col">'.
		"<h3>".__('Images')."</h3>".
		'<p>'.sprintf($gal_nb_img_txt,$gal_nb_img).'</p>'.
		'</div>'. # col
		'</div>'; # two-cols
	echo "</div>"; # fieldset
}


/* Post form if we can edit post
-------------------------------------------------------- */
if ($can_edit_post)
{
	$sidebar_items = new ArrayObject(array(
		'status-box' => array(
			'title' => __('Status'),
			'items' => array(
				'post_status' =>
					'<p class="entry-status"><label for="post_status">'.__('Gallery status').' '.$img_status.'</label>'.
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
					__('Selected gallery').'</label></p>',
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
				'post_password' =>
					'<p><label for="post_password">'.__('Password').'</label>'.
					form::field('post_password',10,32,html::escapeHTML($post_password),'maximal').
					'</p>',
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
		"filters" =>
			'<div class="two-cols clearfix">'.
			'<div class="col">'.
				"<h3>".__('Filters')."</h3>".
				"<p>".__('Select below the image filters you wish to set for this gallery (at least 1 must be selected)')."</p>".
				'<p><label class="classic">'.form::checkbox('c_media_dir',1,$c_media_dir,"disablenext").'</label><label class="classic" for="f_media_dir">'.
				__('Media dir')." : </label>".form::combo('f_media_dir',$dirs_combo,$f_media_dir).
				'<br /><label class="classic" style="margin-left: 20px;">'.form::checkbox('f_recurse_dir',1,$f_recurse_dir).__('include subdirs').'</label></p>'.
				'<p><label class="classic">'.form::checkbox('c_tag',1,$c_tag,"disablenext").'</label><label class="classic" for="f_tag">'.
				__('Tag')." : </label>".form::field('f_tag',20,100,$f_tag,'',2).'</p>'.
				'<p><label class="classic">'.form::checkbox('c_cat',1,$c_cat,"disablenext").'</label><label class="classic" for="f_cat">'.
				__('Category')." : </label>".form::combo('f_cat',$categories_combo,$f_cat).
				'<br /><label class="classic" style="margin-left: 20px;">'.form::checkbox('f_sub_cat',1,$f_sub_cat).__('Include sub-categories').'</label></p>'.
				'<p><label class="classic">'.form::checkbox('c_user',1,$c_user,"disablenext").'</label><label class="classic" for="f_user">'.
				__('User')." : </label>".form::field('f_user',20,20,$f_user,'',2).'</p>'.
			"</div>". # col
			'<div class="col">'.
				"<h3>".__('Order')."</h3>".
				'<p><label class="classic" for="f_orderby">'.__('Order')." : </label>".form::combo('f_orderby',$orderby_combo,$f_orderby).'</p>'.
				'<p><label class="classic" for="f_sortby">'.__('Sort')." : ".form::combo('f_sortby',$sortby_combo,$f_sortby).'</p>'.
				"<h3>".__('Theme')."</h3>".
				'<p><label class="classic" for="f_theme">'.__('Gallery theme')." : </label>".form::combo('f_theme',$themes,$f_theme).'</p>'.
				'<p><label class="classic" for="f_themeinteg">'.__('Gallery integrated theme')." : </label>".form::combo('f_themeinteg',$themes_integ,$f_themeinteg).'</p>'.
			'</div>'.
			'</div>',
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
	$core->callBehavior('adminGalleryFormItems',$main_items,$sidebar_items, isset($post) ? $post : null);

	echo'<form action="plugin.php?p=gallery&amp;m=gal" method="post" id="entry-form">'.
		'<div id="entry-wrapper">'.
		'<div id="entry-content"><div class="constrained">';

	foreach ($main_items as $id => $item) {
		echo $item;
	}



	# --BEHAVIOR-- adminGalleryForm
	$core->callBehavior('adminGalleryForm',isset($post) ? $post : null);


	echo
	'<p class="border-top">'.
	($post_id ? form::hidden('id',$post_id) : '').
	$core->formNonce().
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
	$core->callBehavior('adminGalleryFormSidebar',isset($post) ? $post : null);
	echo '</div>';		// End #entry-sidebar

	echo '</form>';

	# --BEHAVIOR-- adminPostForm
	$core->callBehavior('adminGalleryAfterForm',isset($post) ? $post : null);
}
?>
</div>
</body>
</html>
