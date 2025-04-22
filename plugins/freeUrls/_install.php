<?php
if (!defined('DC_CONTEXT_ADMIN')) { return; }

$version = $core->plugins->moduleInfo('freeUrls','version');

if (version_compare($core->getVersion('freeUrls'),$version,'>=')) {
	return;
}
$settings = new dcSettings($core, null);

$settings->addNameSpace('freeUrls');
$settings->freeUrls->put('active',false,'boolean',null,false,true);

$core->setVersion('freeUrls',$version);
return true;
?>