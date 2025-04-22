var InlineToggle = {
	classNames : { 
		selected : 'selected',
		parent : 'item-toggle',
		link : 'item-toggle-link'
	},

	init : function () {
		var objs = getElementsByClassName(InlineToggle.classNames.link, 'a');
		for (var i = 0; i < objs.length; i++) {
			addEvent(objs[i], 'click', InlineToggle.onclick);
		};
	},

	onclick : function (e) {
		var e = e || event;
		var parent = getParentElementByClassName(this, 'span', InlineToggle.classNames.parent);
		if (!hasClass(parent, InlineToggle.classNames.selected)) {
			addClass(parent, InlineToggle.classNames.selected);
			addClass(parent, InlineToggle.getClassName(this));
		} else {
			removeClass(parent, InlineToggle.classNames.selected);
			removeClass(parent, InlineToggle.getClassName(this));
		}
		this.blur();

		if (e.preventDefault) {
			e.preventDefault();
		}
	},
	
	getClassName : function (obj) {
		var className = '';
		if (obj.className.split(' ').length > 1) {
			className = InlineToggle.classNames.selected + '-' + obj.className.replace(InlineToggle.classNames.link, '')
		}
		return className;
	}
}

$(document).ready(InlineToggle.init);