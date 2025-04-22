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

if (!defined('DC_RC_PATH')) {return;}

$core->addBehavior('publicHeadContent', ['googlestuffPublicBehaviours', 'publicHeadContent']);

class googlestuffPublicBehaviours
{
    public static function publicHeadContent($core)
    {
        $res = '';

        if ($core->blog->settings->googlestuff->googlestuff_verify != "") {
            $res .= '<meta name="google-site-verification" content="' . $core->blog->settings->googlestuff->googlestuff_verify . '" />' . "\n";
        }

        if ($core->blog->settings->googlestuff->googlestuff_uacct != "") {
            $res .=
            dcUtils::jsJson('googletools_ga', ['uacct' => $core->blog->settings->googlestuff->googlestuff_uacct]) .
            dcUtils::jsLoad($core->blog->getPF('googleTools/js/ga.js'));

            if ($core->blog->settings->googlestuff->cnil_cookies) {
                // Includes French CNIL consent check if required
                $res .=
                dcUtils::jsJson('googletools_cnil', [
                    'uacct'  => $core->blog->settings->googlestuff->googlestuff_uacct,
                    'query'  => __('This site use Google Analytics cookies in order to tracking visits. If you want to avoid this, click <a href="javascript:gaOptout()">here</a>.'),
                    'denied' => __('No Google Analytics cookies will be created for tracking your visits on this site.')
                ]) .
                dcUtils::jsLoad($core->blog->getPF('googleTools/js/cnil.js'));
            }
        }

        echo $res;
    }
}
