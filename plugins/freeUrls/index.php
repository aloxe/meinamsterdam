<?php
if (!defined('DC_CONTEXT_ADMIN')) { return; }
$core->blog->settings->addNamespace('freeUrls');

$initTypes = initFreeUrls::adminFreeTypes($core);
$registerTypes = $core->blog->settings->freeUrls->freeTypes;
if (!$registerTypes) {
	$registerTypes = array();
} else {
	$registerTypes = (array) unserialize($registerTypes);
}

$redir = '';
if (isset($_POST['save']))
{
	try
	{
		$core->blog->settings->freeUrls->put('active',!empty($_POST['active']),boolean);
		if (!empty($_POST['active'])) {
			$redir .= '&active=1';
		} else {
			$redir .= '&active=0';
		}
	}
	catch (Exception $e)
	{
		$core->error->add($e->getMessage());
	}
	http::redirect($p_url.$redir);
}

if (isset($_POST['saveconfig']))
{
	try
	{
		foreach ($_POST['types'] as $k => $t) {
			$freeTypes[$t] = (array) $initTypes[$t];
			if (!empty($_POST['redirUrls']) && in_array($t,$_POST['redirUrls'])) {
				$freeTypes[$t]['redir'] = true;
			}
		}

		$core->blog->settings->freeUrls->put('freeTypes',serialize($freeTypes),'string');
		$redir .= '&types=1';
	}
	catch (Exception $e)
	{
		$core->error->add($e->getMessage());
	}
	http::redirect($p_url.$redir);
}
?>
<html>
<head>
  <title><?php echo __('Free Urls'); ?></title>
	<style type="text/css">
		ol.freeurls {
			margin: 0;
			margin-top: 0;
			margin-bottom: 1em;
			padding: 0;
			list-style-type: none;
		}
		.freeurls li {
			margin: 7px 0 0 0;
			padding: 0;
		}
		.freeurls li div {
			border: 1px solid black;
			padding: 3px 25px 3px 5px;
			margin: 0;
		}
	</style>
</head>
<body>
<?php echo
'<h2>'.__('freeUrls configuration').'</h2>';
if (isset($_GET['active'])) {
	if (!empty($_GET['active'])) {
		echo '<p class="message">'.__('Plugin successfully enable.').'</p>';
	} else {
		echo '<p class="message">'.__('Plugin successfully desable.').'</p>';
	}
}
if (!empty($_GET['types'])) {
	echo '<p class="message">'.__('Types setting successfully updated.').'</p>';
}
?>
<div class="two-cols">
 <div class="col">
  <form action="plugin.php" method="post" id="types-form">
   <fieldset>
    <legend><?php echo __('Types') ?></legend>.
	<ol class="freeurls">
	<?php

	foreach ($initTypes as $t => $p) :

		$checkType = $checkRedirUrl = false;
		if (isset($registerTypes[$t])) {
			$checkType = true;
			$checkRedirUrl = isset($registerTypes[$t]['redir']) ? true : false;
		}
	?>
		<li><div>
		<?php echo
		'<label class="classic">'.
		form::checkbox(array('types[]'),$t,$checkType).
		'<strong>'.$t.'</strong></label>'.
		'<label class="classic" style="float:right;">'.
		form::checkbox(array('redirUrls[]'),$t,$checkRedirUrl).__('Redirection').'</label>';
		?>
		</div></li>
	<?php
	endforeach;
	?>
	</ol>
	<p>
	<?php echo
	form::hidden(array('p'),'freeUrls').
	$core->formNonce();
	?>
	  <input type="submit" name="saveconfig" value="<?php echo __('Save configuration'); ?>" />	
	</p>
   </fieldset>	
  </form>
 </div>

 <div class="col">
  <form action="<?php echo $p_url; ?>" method="post">
   <fieldset>
    <legend><?php echo __('Activation') ?></legend>.
	<p>
	  <label for="active" class="classic">
	  <?php echo
	  form::checkbox('active',1,$core->blog->settings->freeUrls->active).' '.
	  __('Activate FreeUrls extension');
	  ?>
	  </label>
	</p>
	<p>
	  <input type="submit" name="save" value="<?php echo __('Save'); ?>" />
	  <?php echo
	  $core->formNonce();
	  ?>
	</p>
   </fieldset>
  </form>
 </div>
</div>
</body>
</html>