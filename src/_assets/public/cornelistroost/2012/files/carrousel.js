/// <reference path="jquery-vsdoc.js" />
/// <reference path="jquery.history.js" />

var Carrousel = {
	parent : null,
	prev : null,
	next : null,
	container : null,
	
	elementWidth : null,
	totalWidth : null,
	elements : null,
	nElementsShown : null,
	
	hasCalculated : false,

	init : function (parent, prev, next, container) {
		Carrousel.parent = parent;
		Carrousel.prev = prev;
		Carrousel.next = next;
		Carrousel.container = container;
		
		Carrousel.elements = parent.getElementsByTagName('li');
		
		if (!hasClass(Carrousel.parent, 'hide')) {
			Carrousel.calculateDimensions();
		}
		
		if (Carrousel.prev) {
			Carrousel.prev.onclick = Carrousel.left;
		}
		
		if (Carrousel.next) {
			Carrousel.next.onclick = Carrousel.right;
		}
	},
	
	calculateDimensions : function () {
		if (Carrousel.elements.length) {
			Carrousel.elementWidth = Carrousel.elements[0].offsetWidth;
			Carrousel.nElementsShown = Math.floor(Carrousel.parent.offsetWidth / Carrousel.elementWidth);
			Carrousel.totalWidth = Carrousel.elements.length * Carrousel.elementWidth;
		}
		Carrousel.hasCalculated = true;
	},
	
	left : function () {
		var left = Carrousel.getOffset();		
		var setWidth = Carrousel.nElementsShown * Carrousel.elementWidth;
		
		if (setWidth > left) {
			left += setWidth;			
			if (left > 0) {
				left = 0;
			}			
			Carrousel.setOffset(left);
		}
		return false;
	},
	
	right : function () {
		var left = Carrousel.getOffset();		
		var setWidth = Carrousel.nElementsShown * Carrousel.elementWidth;
		
		if (setWidth < Carrousel.totalWidth + left) {
			left -= setWidth;
			if (Carrousel.totalWidth + left < Carrousel.parent.offsetWidth) {
				left = 0 - (Carrousel.totalWidth - Carrousel.parent.offsetWidth) - 10; // ?!
			}			
			Carrousel.setOffset(left);
		}
		return false;
	},
	
	scrollIntoView : function (obj) {
		var parentPos = findPos(Carrousel.parent);
		var objPos = findPos(obj);
		
		if (objPos.left < parentPos.left) {
			var idx = Carrousel.getElementIndex(obj);
			var expected = 0 - (idx * Carrousel.elementWidth);
			
			Carrousel.setOffset(expected);
		} else if (objPos.left + obj.offsetWidth > parentPos.left + Carrousel.parent.offsetWidth) {
			var idx = Carrousel.getElementIndex(obj);
			if (idx < Carrousel.elements.length - 1) {
				var expected = 0 - ((idx + 1) * Carrousel.elementWidth) + (Carrousel.nElementsShown * Carrousel.elementWidth);				
			} else {
				var expected = 0 - (Carrousel.totalWidth - Carrousel.parent.offsetWidth) - 10; // ?!			
			}			
			Carrousel.setOffset(expected);
		}
	},
	
	getElementIndex : function (obj) {
		var idx = -1;
		for (var i = 0; i < Carrousel.elements.length; i++) {
			if (Carrousel.elements[i] === obj) { // Test for exact reference
				idx = i;
				break;
			}
		}
		return idx;
	},
	
	getOffset : function () {
		var left = Carrousel.container.style.left;
		left = left.length ? parseInt(left.replace('px', '')) : 0;
		return left;
	},
	
	setOffset : function (str) {
		Carrousel.container.style.left = str + 'px';
	}
};
