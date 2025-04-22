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

// dead but useful code, in order to have translations
__('Google Tools') . __('Handles Google tools (Analytics & Webmaster Tools)');

$core->addBehavior('adminBlogPreferencesForm', ['googlestuffAdminBehaviours', 'adminBlogPreferencesForm']);
$core->addBehavior('adminBeforeBlogSettingsUpdate', ['googlestuffAdminBehaviours', 'adminBeforeBlogSettingsUpdate']);

class googlestuffAdminBehaviours
{
    public static function adminBlogPreferencesForm($core, $settings)
    {
        $settings->addNameSpace('googlestuff');
        echo
        '<div class="fieldset"><h4 id="google-tools">Google Stuff</h4>' .
        '<p><label>' .
        __('Google Analytics UACCT (ID):') . " " .
        form::field('googlestuff_uacct', 25, 50, $settings->googlestuff->googlestuff_uacct, 3) .
        '</label></p>' .
        '<p><label>' .
        __('Google Webmaster Tools verification:') . " " .
        form::field('googlestuff_verify', 50, 100, $settings->googlestuff->googlestuff_verify, 3) .
        '</label></p>' .
        '<p>' . form::checkbox('cnil_cookies', 1, $core->blog->settings->googlestuff->cnil_cookies) .
        '<label class="classic" for="cnil_cookies">' . __('Includes CNIL consent for Google Analytics tracking cookies') . '</label>' . '</p>' .
            '</div>';
    }
    public static function adminBeforeBlogSettingsUpdate($settings)
    {
        $settings->addNameSpace('googlestuff');
        $settings->googlestuff->put('googlestuff_uacct', empty($_POST['googlestuff_uacct']) ? "" : $_POST['googlestuff_uacct'], 'string');
        $settings->googlestuff->put('googlestuff_verify', empty($_POST['googlestuff_verify']) ? "" : $_POST['googlestuff_verify'], 'string');
        $settings->googlestuff->put('cnil_cookies', empty($_POST['cnil_cookies']) ? "" : $_POST['cnil_cookies'], 'boolean');
    }
}
