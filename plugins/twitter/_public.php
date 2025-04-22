<?php

$core->addBehavior('publicHeadContent',array('publicTwitter','publicHeadContent'));

if (!defined('DC_RC_PATH')) { return; }
 
class publicTwitter
{

	public static function publicHeadContent(&$core)
	{
		$url = $core->blog->getQmarkURL().'pf='.basename(dirname(__FILE__));
		echo
		'<script type="text/javascript" charset="utf-8" src="'.$url.'/js/twitter-1.11.1.js"></script>'."\n";
	}
	
	
	public static function getTweets(&$w)
	{
		global $core;
		$url = $core->blog->getQmarkURL().'pf='.basename(dirname(__FILE__));
		
		$ignoreReplies = $w->ignoreReplies ? 'true' : 'false';
		$enableLinks = $w->enableLinks ? 'true' : 'false';
		$count = abs((integer) $w->count);
		if($count > 20) $count = 20;
		if($count < 1) $count = 1;
		
		$res =  
			"\n".
			'<div id="'.$w->userName.'">'."\n".
			'<p>Loading tweets <img src="'.$url.'/img/ajax-loader.gif" width="16" height="16" alt="loading..." /></p>'."\n".
			'</div>'."\n".
			'<script type="text/javascript">'."\n".
			'getTwitters(\''.$w->userName.'\', { '."\n".
			'	id: \''.$w->userName.'\', '."\n".
			'	count: '.$count.', '."\n".
			'	enableLinks: true, '."\n".
			'	ignoreReplies: '.$ignoreReplies.', ' ."\n".
			'	clearContents: true, '."\n".
			'	template: \''.$w->template.'\','."\n".
			'	prefix: \''.$w->prefix.'\''."\n".
			'});'."\n".
			'</script>'."\n";
			
		return $res;
	}
}
?>