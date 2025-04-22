<?php
if (!defined('DC_RC_PATH')) { return; }

if (!defined('FREE_URLS_PRIORITY')) {
	define('FREE_URLS_PRIORITY',2000);
}
$this->registerModule(
	/* Name */			'Free Urls',
	/* Description*/		'Leaves the field open for urls',
	/* Author */			'Benoît Grelier',
	/* Version */			'0.0.3',
	array(
		//'permissions' =>	'contentadmin',
		'priority' =>		FREE_URLS_PRIORITY,
	)
);
?>