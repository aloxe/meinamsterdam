<?php
/**
 * @package Dotclear
 *
 * @copyright Olivier Meunier & Association Dotclear
 * @copyright GPL-2.0-only
 */
if (isset($_SERVER['DC_BLOG_ID'])) {
    define('DC_BLOG_ID', $_SERVER['DC_BLOG_ID']);
} elseif (isset($_SERVER['REDIRECT_DC_BLOG_ID'])) {
    define('DC_BLOG_ID', $_SERVER['REDIRECT_DC_BLOG_ID']);
} else {
    # Define your blog here
    define('DC_BLOG_ID', 'meinamsterdam');
}
// ligne ajoutee pour configuration speciale meinamsterdam (avec www.conf)
if ($_SERVER['QUERY_STRING']=="post/index.html" || $_SERVER['QUERY_STRING']=="post/index.php") { $_SERVER['QUERY_STRING']=""; }

require dirname(__FILE__) . '/inc/public/prepend.php';
