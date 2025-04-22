<?php
if (!defined('DC_RC_PATH')) { return; }

class initFreeUrls
{
	private static $adminFreeTypes = array();
	private static $freeTypes = array();
	
	public static function adminFreeTypes($core)
	{
		$r = $core->url->getTypes();		
		foreach ($core->getPostTypes() as $pt => $u)
		{
			$postTypesUrls[rtrim(sprintf($u['public_url'],''),'/')] = array($pt,$u['admin_url']);
		}
		
		foreach ($core->url->getTypes() as $t => $p)
		{
			if (isset($postTypesUrls[$p['url']])) {
				# Add types whith post_type :
				//$adminFreeTypes[$t] = array('postType'=>$postTypesUrls[$p['url']]);
				$adminFreeTypes[$t] = '';
			}		
		}
		$adminFreeTypes['category'] = '';
		$adminFreeTypes['tag'] = '';
		
		self::$adminFreeTypes = $adminFreeTypes;
		
		$core->callBehavior('adminFreeTypes');
		
		return self::$adminFreeTypes;
	}
	
	#You can use this methode with adding "adminFreeTypes" behaviors to add free types!
	# $regHandler is an array('user_class_name','user_methode_name')...
	public static function setAdminFreeTypes($type,$reqHandler)
	{
		self::$adminFreeTypes[$type] = array('reqHandler'=>$reqHandler);
	}

	private static function getFreeTypesSetting($blog)
	{
		$freeTypesSetting = (array) unserialize($blog->settings->freeUrls->freeTypes);	
/*		$freeTypesSetting = array(
			#'type_name' => array('redir'=>true,'reqhandler'=>array('class_name','methode_name'))
			'post' => array('redir'=>true),
			'pages' => array('redir'=>true),
			'category' => array('redir'=>true),
			'tag' =>array('redir'=>true),
		);
*/
		return $freeTypesSetting;
	}
	
	public static function getFreeTypes()
	{
		return self::$freeTypes;
	}

	public static function freePublicUrlRegister($core)
	{
		$freeTypes = [];

		$freeTypesSetting = self::getFreeTypesSetting($core->blog);
		if (empty($freeTypesSetting)) { return; }
		
		$r = $core->url->getTypes();

		foreach ($core->getPostTypes() as $pt => $u)
		{
			$postTypesUrls[rtrim(sprintf($u['public_url'],''),'/')] = array($pt,$u['admin_url']);
		}

		foreach ($freeTypesSetting as $t => $f)
		{
			if(isset($r[$t]))
			{
				# Redirection 301 of old url:
				if(isset($f['redir']))
				{
					$core->url->register($t.'redir',$r[$t]['url'],$r[$t]['representation'],array('typeOffUrlHandlers','handlerRedir'));
				}
				# New handler for this url:
				$core->url->register($t,'','^(?!page/[0-9])(.+)$',array('typeOffUrlHandlers','typeHandler'));
				
				if (isset($postTypesUrls[$r[$t]['url']]))
				{
					$a = $postTypesUrls[$r[$t]['url']]; // $a = array($post_type,$admin_url)

					$core->setPostType($a[0],$a[1],'%s');
					
					# For only one requete on post table if more than one post_type:
					$p[0][] = $r[$t]['handler']; //handler
					$p[1][] = $a[0]; //post_type
					$p[2][] = $t; //type
				}
				else 
				{
					$freeTypes[$t] = array($r[$t]['handler'],$f);
				}
			}
		}
		
		if (isset($p))
		{
			$posthandler['posthandler'] = array($p[0],array('post_type'=>$p[1]),$p[2]);
			$freeTypes = array_merge($posthandler,$freeTypes);
		}

		self::$freeTypes = $freeTypes;
	}
}

class typeOff
{
	protected $core;
	private $con;
	
	public function __construct($core)
	{
		$this->core = $core;
		$this->con = $this->core->con;
	}

	public function posthandler($p)
	{
		$strReq =
		'SELECT post_type '.
		'FROM '.$this->core->prefix.'post '.
		"WHERE blog_id = '".$this->con->escape($this->core->blog->id)."' ".
		"AND post_url = '".$this->con->escape($p['url'])."' ";

		$strReq .=
		'AND post_type '.$this->con->in($p['post_type']).' ';

		return $this->con->select($strReq);
	}
	
	public function category($p)
	{
		$strReq =
		'SELECT cat_id '.
		'FROM '.$this->core->prefix.'category '.
		"WHERE blog_id = '".$this->con->escape($this->core->blog->id)."' ".
		"AND cat_url = '".$this->con->escape($p['url'])."' ";

		return $this->con->select($strReq);
	}

	public function tag($p)
	{
		$strReq =
		'SELECT M.meta_type '.
		'FROM '.$this->core->prefix.'meta M '.
		'LEFT JOIN '.$this->core->prefix.'post P '.
		'ON M.post_id = P.post_id '.
		"WHERE P.blog_id = '".$this->con->escape($this->core->blog->id)."' ".
		"AND meta_id = '".$this->con->escape($p['url'])."' ";
			
		$strReq .=
		"AND meta_type = 'tag' ".
		'LIMIT '.(integer)(1).' ';

		return $this->con->select($strReq);
	}
}
?>