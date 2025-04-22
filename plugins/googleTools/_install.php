<?php
/**
 * @brief googleTools, a plugin for Dotclear 2
 *
 * @package Dotclear
 * @subpackage Plugins
 *
 * @author xave and contributors
 *
 * @copyright xave
 * @copyright GPL-2.0 https://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('DC_CONTEXT_ADMIN')) {return;}

$this_version      = $core->plugins->moduleInfo('googlestuff', 'version');
$installed_version = $core->getVersion('googlestuff');

if (version_compare($installed_version, $this_version, '>=')) {
    return;
}

$core->blog->settings->addNamespace('googlestuff');
$core->blog->settings->googlestuff->put('googlestuff_uacct', '', 'string', 'Google Analytics PageTracker ID', true, true);
$core->blog->settings->googlestuff->put('googlestuff_verify', '', 'string', 'Google Webmaster Tools Verify code', true, true);

$core->setVersion('googlestuff', $this_version);

return true;
