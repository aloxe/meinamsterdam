<?php
if (!defined('DC_RC_PATH')) { return; }

$core->blog->settings->addNameSpace('freeUrls');
if (!$core->blog->settings->freeUrls->active) { return; }

initFreeUrls::freePublicUrlRegister($core);

class typeOffUrlHandlers extends dcUrlHandlers
{
	public static function handlerRedir($args)
	{
		http::head(301);
		header('Location: '.$GLOBALS['core']->blog->url.$args);
		exit;	
	}

	public static function typeHandler($args)
	{
		global $core;
		$typeOff = new typeOff($core);
		$url = preg_replace('#(^|/)page/([0-9]+)$#','',$args);

		foreach (initFreeUrls::getFreeTypes() as $t => $p)
		{
			$p[1] = (array) $p[1];
			$p[1]['url'] = (string)$url;

			if (!isset($p[1]['reqhandler'])) { // Defaut
				$r = $typeOff->{$t}($p[1]);
				if ($r->isEmpty()) { continue; }
				if ($t == 'posthandler')
				{
					//array($handler,$reqparams,$types);
					$k = array_search($r->post_type,$p[1]['post_type']);
					$t = $p[2][$k];
					$p[0] = $p[0][$k];
				}
			}
			else {
				(bool)$r = call_user_func_array($p[1]['reqhandler'],array($args,$t,$p));
				if (!$r) { continue; }
			}
				
			$core->url->type = $t;
			call_user_func($p[0],$args);
			exit;		
		}

		if (preg_replace('#^([a-zA-Z]{2}(?:-[a-z]{2})?(?:/page/[0-9]+)?)$#','',$args) == '') 
		{
			$core->url->type = 'lang';
			self::lang($args);
			exit;
		}
		
		self::p404();
	}
}
?>