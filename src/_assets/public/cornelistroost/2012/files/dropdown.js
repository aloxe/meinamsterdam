var Dropdown = {
	pairs : {},						// Button/dropdown storage
	timer : null,					// Timer reference
	currentSelected : null,			// Store currently open dropdown
	
	delay : 500,					// Dropdown hide delay (ms)

	init : function (elements) {
        if (elements.length) {
            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                if (el.button && el.dropdown) {
                    // Assign dropdown event handlers
                    addEvent(el.dropdown, 'mouseover', Dropdown.onmouseover);
                    addEvent(el.dropdown, 'mouseout', Dropdown.onmouseout);
					
                    // Assign button event handlers
                    addEvent(el.button, 'mouseover', Dropdown.onmouseover);
                    addEvent(el.button, 'mouseout', Dropdown.onmouseout);
				
                    // Store objects for future reference
                    Dropdown.pairs[el.button] = el;
					
                    // Add click event handler
                    addEvent(el.button, 'click', Dropdown.onclick);
                }
            }
        }
    },
	
	onclick : function (e) {
        var e = e || event;
		
        // Close any open dropdowns if needed
        if (Dropdown.currentSelected && Dropdown.currentSelected !== this) {
            Dropdown.onclick.call(this);
        }
		
        this.blur();
		
        Dropdown.toggle(this);
		
		if (Dropdown.focusInput)
        document.getElementById(Dropdown.focusInput).focus();
		
        if (e.preventDefault) {
            e.preventDefault();
        }
		
        return false;
    },
	
	toggle : function (button) {
        var pair = Dropdown.pairs[button];
        if (pair) {
            var dropdown = pair.dropdown;
            if (hasClass(dropdown, 'hide')) {
                Dropdown.align(button);
				
                // Show dropdown and select button
                removeClass(dropdown, 'hide');
                addClass(button, 'selected');
				
                // Assign dropdown alignment on resize
                addEvent(window, 'resize', Dropdown.realign);
				
                Dropdown.currentSelected = button;
            } else {
                // Hide dropdown and deselect button
                addClass(dropdown, 'hide');
                removeClass(button, 'selected');
				
                // Remove resize handler
                removeEvent(window, 'resize', Dropdown.realign);
				
                Dropdown.currentSelected = null;
            }
        }
    },
	
	onmouseover : function () {
        if (Dropdown.timer) {
            clearTimeout(Dropdown.timer);
        }
    },
	
	onmouseout : function () {
        if (!hasClass(this, 'hide')) {
			Dropdown.timer = setTimeout(function () {
                Dropdown.toggle(Dropdown.currentSelected);
            }, Dropdown.delay);
        }
    },
	
	align : function (button) {
        var dropdown = Dropdown.pairs[button].dropdown;

        // Temporarily render but hide
        dropdown.style.visibility = 'hidden';
        removeClass(dropdown, 'hide');
		
        var top = button.offsetHeight;

        // Align and show dropdown
        dropdown.style.top = top + 'px';
        dropdown.style.visibility = 'visible';
    },
	
	realign : function () {
        Dropdown.align(Dropdown.currentSelected);
    }
};