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

require dirname(__FILE__).'/class.dc.gallerylists.php';


# Getting categories
try {
	$categories = $core->blog->getCategories();
} catch (Exception $e) {
	$core->error->add($e->getMessage());
}
# Getting authors
try {
	$users = $core->blog->getPostsUsers();
} catch (Exception $e) {
	$core->error->add($e->getMessage());
}

# Getting dates
try {
	$dates = $core->blog->getDates(array('type'=>'month','post_type'=>'gal'));
} catch (Exception $e) {
	$core->error->add($e->getMessage());
}

# Getting langs
try {
	$langs = $core->blog->getLangs();
} catch (Exception $e) {
	$core->error->add($e->getMessage());
}
# Creating filter combo boxes
if (!$core->error->flag())
{
	# Filter form we'll put in html_block
	$users_combo = $categories_combo = array();
	$users_combo['-'] = $categories_combo['-'] = $dirs_combo['-'] = '';
	while ($users->fetch())
	{
		$user_cn = dcUtils::getUserCN($users->user_id,$users->user_name,
		$users->user_firstname,$users->user_displayname);

		if ($user_cn != $users->user_id) {
			$user_cn .= ' ('.$users->user_id.')';
		}

		$users_combo[$user_cn] = $users->user_id;
	}

	while ($categories->fetch()) {
		$categories_combo[str_repeat('&nbsp;&nbsp;',$categories->level-1).'&bull; '.
			html::escapeHTML($categories->cat_title).
			' ('.$categories->nb_post.')'] = $categories->cat_id;
	}

	$status_combo = array(
	'-' => ''
	);
	foreach ($core->blog->getAllPostStatus() as $k => $v) {
		$status_combo[$v] = (string) $k;
	}

	$selected_combo = array(
	'-' => '',
	__('selected') => '1',
	__('not selected') => '0'
	);

	# Months array
	$dt_m_combo['-'] = '';
	while ($dates->fetch()) {
		$dt_m_combo[dt::str('%B %Y',$dates->ts())] = $dates->year().$dates->month();
	}

	$lang_combo['-'] = '';
	while ($langs->fetch()) {
		$lang_combo[$langs->post_lang] = $langs->post_lang;
	}

	$sortby_combo = array(
	__('Date') => 'post_dt',
	__('Title') => 'post_title',
	__('Category') => 'cat_title',
	__('Author') => 'user_id',
	__('Status') => 'post_status',
	__('Selected') => 'post_selected'
	);

	$order_combo = array(
	__('Descending') => 'desc',
	__('Ascending') => 'asc'
	);
}



/* Get posts
-------------------------------------------------------- */
$user_id = !empty($_GET['user_id']) ?   $_GET['user_id'] : '';
$cat_id = !empty($_GET['cat_id']) ?     $_GET['cat_id'] : '';
$status = isset($_GET['status']) ?      $_GET['status'] : '';
$selected = isset($_GET['selected']) ?  $_GET['selected'] : '';
$month = !empty($_GET['month']) ?       $_GET['month'] : '';
$lang = !empty($_GET['lang']) ?         $_GET['lang'] : '';
$sortby = !empty($_GET['sortby']) ?     $_GET['sortby'] : $core->gallery->settings->gallery_admin_gals_sortby;
$order = !empty($_GET['order']) ?       $_GET['order'] : $core->gallery->settings->gallery_admin_gals_order;
$tag = !empty($_GET['tag']) ?     trim($_GET['tag']) : '';
$nb = !empty($_GET['nb']) ?     trim($_GET['nb']) : 0;

if (!empty($_GET['clearfilter'])) {
	unset($_SESSION['gals_filter']);
	http::redirect("plugin.php?p=gallery");
} elseif (empty($_GET['filter']) && !empty($_SESSION['gals_filter'])) {
	$s = unserialize(base64_decode($_SESSION['gals_filter']));
	if ($s !== false) {
		$user_id = !empty($s['user_id'])     ?  $s['user_id'] : '';
		$cat_id = !empty($s['cat_id'])       ?  $s['cat_id'] : '';
		$status = isset($s['status'])        ?  $s['status'] : '';
		$selected = isset($s['selected'])    ?  $s['selected'] : '';
		$month = !empty($s['month'])         ?  $s['month'] : '';
		$lang = !empty($s['lang'])           ?  $s['lang'] : '';
		$sortby = !empty($s['sortby'])       ?  $s['sortby'] : $core->gallery->settings->gallery_admin_gals_sortby;
		$order = !empty($s['order'])         ?  $s['order'] : $core->gallery->settings->gallery_admin_gals_sortby;
		$tag = !empty($s['tag'])             ?  trim($s['tag']) : '';
		$nb = !empty($s['nb']) ?     trim($s['nb']) : '';
	}
} elseif (!empty($_GET['filter'])) {
	$s = array(
		'user_id' => $user_id,
		'cat_id' => $cat_id,
		'status' => $status,
		'selected' => $selected,
		'month' => $month,
		'lang' => $lang,
		'sortby' => $sortby,
		'order' => $order,
		'tag' => $tag,
		'nb' => $nb);
	$_SESSION['gals_filter']=base64_encode(serialize($s));
}

# Actions combo box
$combo_action = array();
if ($core->auth->check('publish,contentadmin',$core->blog->id))
{
	$combo_action[__('Status')] = array(
		__('Publish') => 'publish',
		__('Unpublish') => 'unpublish',
		__('Schedule') => 'schedule',
		__('Mark as pending') => 'pending'
	);
}
$combo_action[__('Change')]=array(__('change category') => 'category');
if ($core->auth->check('admin',$core->blog->id)) {
	$combo_action[__('Change')][__('change author')] = 'author';
}
$combo_action[__('Maintenance')]=array(__('update') => 'update');
if ($core->auth->check('delete,contentadmin',$core->blog->id))
{
	$combo_action[__('Maintenance')][__('delete')] = 'delete';
}
$combo_action[__('Mark')]=array(__('Select for integration') => 'selected',
				__('unselect for integration') => 'unselected');

# --BEHAVIOR-- adminPostsActionsCombo
$core->callBehavior('adminGalleriesActionsCombo',array(&$combo_action));

$default_tab = 'gal_list';

$show_filters = false;

$page = !empty($_GET['page']) ? $_GET['page'] : 1;
$nb_per_page =  30;

if ((integer) $nb > 0) {
	if ($nb_per_page != $nb) {
		$show_filters = true;
	}
	$nb_per_page = (integer) $nb;
}

# - User filter
if ($user_id !== '' && in_array($user_id,$users_combo)) {
	$params['user_id'] = $user_id;
	$show_filters = true;
}

# - Categories filter
if ($cat_id !== '' && in_array($cat_id,$categories_combo)) {
	$params['cat_id'] = $cat_id;
	$show_filters = true;
}

# - Status filter
if ($status !== '' && in_array($status,$status_combo)) {
	$params['post_status'] = $status;
	$show_filters = true;
}

# - Selected filter
if ($selected !== '' && in_array($selected,$selected_combo)) {
	$params['post_selected'] = $selected;
	$show_filters = true;
}

# - Month filter
if ($month !== '' && in_array($month,$dt_m_combo)) {
	$params['post_month'] = substr($month,4,2);
	$params['post_year'] = substr($month,0,4);
	$show_filters = true;
}

# - Lang filter
if ($lang !== '' && in_array($lang,$lang_combo)) {
	$params['post_lang'] = $lang;
	$show_filters = true;
}

if (!in_array($sortby,$sortby_combo))
	$sortby="post_dt";
if (!in_array($order,$order_combo))
	$order="desc";
# - Sortby and order filter
if ($sortby !== '' && in_array($sortby,$sortby_combo)) {
	if ($order !== '' && in_array($order,$order_combo)) {
		$params['order'] = $sortby.' '.$order;
	}

	if ($sortby != $core->gallery->settings->gallery_admin_gals_sortby ||
		$order != $core->gallery->settings->gallery_admin_gals_order) {
		$show_filters = true;
	}
}

# - Tag filter
if ($tag !=='') {
	$params['tag']=$tag;
	$show_filters = true;
}

$params['limit'] = array((($page-1)*$nb_per_page),$nb_per_page);
$params['no_content'] = true;

# Get posts
try {
	$gals = $core->gallery->getGalleries($params);
	$counter = $core->gallery->getGalleries($params,true);
	$gal_list = new adminGalleryList($core,$gals,$counter->f(0));
} catch (Exception $e) {
	$core->error->add($e->getMessage());
}
$core->meta = new dcMeta($core);
?>

<html>
<head>
  <title><?php echo __('Galleries'); ?></title>
  <?php
$form_filter_title = __('Show filters and display options');
	echo
	  	dcPage::jsLoad('index.php?pf=gallery/js/_gals_lists.js').
		dcPage::jsLoad('js/filter-controls.js').
		'<script type="text/javascript">'."\n".
		"//<![CDATA["."\n".
		dcPage::jsVar('dotclear.msg.show_filters', $show_filters ? 'true':'false')."\n".
		dcPage::jsVar('dotclear.msg.filter_posts_list',$form_filter_title)."\n".
		dcPage::jsVar('dotclear.msg.cancel_the_filter',__('Cancel filters and display options'))."\n".
		"//]]>".
		"</script>";
  ?>
</head>
<body>
<?php
echo dcPage::breadcrumb(array(
	html::escapeHTML($core->blog->name) => '',
	__('Galleries') => ''
)).dcPage::notices();

if (!$core->gallery->checkThemesDir()) {
	echo '<p class="error">'.
		__('Invalid theme dir detected in blog settings. Please update gallery_themes_path setting in about:config.').
	'</p>';
}
echo '<ul class="pseudo-tabs">'.
	'<li><a href="#" class="active">'.__('Galleries').'</a></li>'.
	'<li><a href="plugin.php?p=gallery&amp;m=items">'.__('Images').'</a></li>'.
	'<li><a href="plugin.php?p=gallery&amp;m=newitems">'.__('Manage new items').'</a></li>'.
	'<li><a href="plugin.php?p=gallery&amp;m=options">'.__('Options').'</a></li>';
if ($core->auth->isSuperAdmin()) {
	echo
	'<li><a href="plugin.php?p=gallery&amp;m=maintenance">'.__('Maintenance').'</a></p>';
}
echo '</ul>';
echo
	'<p class="top-add"><a class="button add" href="plugin.php?p=gallery&amp;m=gal">'.__('New gallery').'</a></p>'.
	'<form action="plugin.php" method="get" id="filters-form">'.
	'<h3 class="out-of-screen-if-js">'.$form_filter_title.'</h3>'.

	'<div class="table">'.
	'<div class="cell">'.
	'<h4>'.__('Filters').'</h4>'.
	'<p><label for="user_id" class="ib">'.__('Author:').'</label> '.
	form::combo('user_id',$users_combo,$user_id).'</p>'.
	'<p><label for="cat_id" class="ib">'.__('Category:').'</label> '.
	form::combo('cat_id',$categories_combo,$cat_id).'</p>'.
	'<p><label for="status" class="ib">'.__('Status:').'</label> ' .
	form::combo('status',$status_combo,$status).'</p> '.
	'</div>'.

	'<div class="cell filters-sibling-cell">'.
	'<p><label for="selected" class="ib">'.__('Selected:').'</label> '.
	form::combo('selected',$selected_combo,$selected).'</p>'.
	'<p><label for="month" class="ib">'.__('Month:').'</label> '.
	form::combo('month',$dt_m_combo,$month).'</p>'.
	'<p><label for="lang" class="ib">'.__('Lang:').'</label> '.
	form::combo('lang',$lang_combo,$lang).'</p> '.
	'</div>'.

	'<div class="cell filters-options">'.
	'<h4>'.__('Display options').'</h4>'.
	'<p><label for="sortby" class="ib">'.__('Order by:').'</label> '.
	form::combo('sortby',$sortby_combo,$sortby).'</p>'.
	'<p><label for="order" class="ib">'.__('Sort:').'</label> '.
	form::combo('order',$order_combo,$order).'</p>'.
	'<p><span class="label ib">'.__('Show').'</span> <label for="nb" class="classic">'.
	form::field('nb',3,3,$nb_per_page).' '.
	__('entries per page').'</label></p>'.
	'</div>'.
	'</div>'.

	'<p><input type="submit" value="'.__('Apply filters and display options').'" />'.
	form::hidden('p',"gallery").
	'<br class="clear" /></p>'. //Opera sucks
	'</form>';

if (!$core->error->flag()) {

	echo
	# Show posts
	$gal_list->display($page,30,
	'<form action="plugin.php?p=gallery&amp;m=galsactions" method="post" id="form-entries">'.
	'%s'.
	'<div class="two-cols">'.
	'<p class="col checkboxes-helpers"></p>'.
	'<p class="col right">'.__('Selected entries action:').
	form::combo('action',$combo_action).
	'<input type="submit" value="'.__('ok').'" />'.
	$core->formNonce().'</p>'.
	'</div>'.
	'</form>'
	);
}
?>
</body>
</html>
