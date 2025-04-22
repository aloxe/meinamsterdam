<?php
if (!defined('DC_CONTEXT_ADMIN')) { return; }

$core->addBehavior('adminDashboardIcons','freeUrls_dashboard');
$core->addBehavior('adminDashboardFavs','freeUrls_dashboard_favs');
function freeUrls_dashboard($core,$icons)
{
	$icons['freeUrls'] = new ArrayObject(array(__('freeUrls'),'plugin.php?p=freeUrls','index.php?pf=freeUrls/icon.png'));
}
function freeUrls_dashboard_favs($core,$favs)
{
	$favs['freeUrls'] = new ArrayObject(array('freeUrls','freeUrls','plugin.php?p=freeUrls',
		'index.php?pf=freeUrls/icon-small.png','index.php?pf=freeUrls/icon.png',
		'usage,contentadmin',null,null));
}

$_menu['Plugins']->addItem(__('freeUrls'),'plugin.php?p=freeUrls','index.php?pf=freeUrls/icon-small.png',
                preg_match('/plugin.php\?p=freeUrls(&.*)?$/',$_SERVER['REQUEST_URI']),
                $core->auth->check('usage,contentadmin',$core->blog->id));

$core->auth->setPermissionType('freeUrls',__('manage freeUrls'));
?>