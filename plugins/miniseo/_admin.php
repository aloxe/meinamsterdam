<?php
# ***** BEGIN LICENSE BLOCK *****
# This file is part of plugin miniseo for DotClear 2.X
# reserved.
#
# DotClear is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
# 
# DotClear is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with DotClear; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
#
# ***** END LICENSE BLOCK *****

# Ajout du menu plugin
$_menu['Plugins']->addItem('miniseo','plugin.php?p=miniseo','index.php?pf=miniseo/img/logoseo.gif',
		preg_match('/plugin.php\?p=miniseo(&.*)?$/',$_SERVER['REQUEST_URI']),
		$core->auth->check('contentadmin',$core->blog->id));
$core->auth->setPermissionType('miniseo',__('use miniseo'));
?>