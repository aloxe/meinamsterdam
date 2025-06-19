// --------------------
// Basic functionality for interactive forms
// --------------------
var CbForm = {
    // Configuration
    classNames: {
        selected: 'cb-selected',
        hide: 'hide'
    },

    // Properties
    currentSelected: null,
    isExclusive: false,
    pairs: {},

    // Constants
    SHOW: true,
    HIDE: false,

    // Elements is an array of objects, where each object is a checkbox-panel pair
    // of the form: { cb : checkboxElement, panel : panelElement, [ force ] }
    init: function(elements, isExclusive) {
        CbForm.isExclusive = isExclusive ? true : false;

        if (elements.length) {
            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                if (el.cb) {
                    // Assign toggling behaviour
                    el.cb.onclick = CbForm.onclick;

                    // Fire toggling behaviour for initial display
                    var isCheckElement = CbForm.isCheckElement(el.cb);

                    // Store ID-Panel pair
                    CbForm.pairs[el.cb.id] = {
                        cb: el.cb,
                        panel: el.panel,
                        force: el.force,
                        isCheckElement: isCheckElement
                    };

                    // Supports either through the use of radio/checkbox elements or regular elements with CSS classes
                    if (isCheckElement) {
                        if (el.cb.checked && el.force != CbForm.HIDE) {
                            CbForm.onclick.call(el.cb);
                        }
                    } else if (hasClass(el.cb, CbForm.classNames.selected)) {
                        CbForm.onclick.call(el.cb);
                    }
                }
            }
        }
    },

    onclick: function() {
        if (CbForm.isExclusive) {
            if (CbForm.currentSelected && CbForm.currentSelected !== this) {
                CbForm.toggle.call(CbForm.currentSelected);
            }
        }

        CbForm.toggle.call(this);

        if (!CbForm.pairs[this.id].isCheckElement) {
            return false;
        }
    },

    toggle: function() {
        var obj = CbForm.pairs[this.id];
        if (obj) {
            var panel = obj.panel;
            if (((panel && hasClass(panel, CbForm.classNames.hide)) || this.checked) && obj.force != CbForm.HIDE) {
                if (!hasClass(this, CbForm.classNames.selected)) {
                    addClass(this, CbForm.classNames.selected);
                }

                if (panel) {
                    removeClass(panel, CbForm.classNames.hide);
                }

                CbForm.currentSelected = this;
            } else {
                if (hasClass(this, CbForm.classNames.selected)) {
                    removeClass(this, CbForm.classNames.selected);
                }

                if (panel) {
                    addClass(panel, CbForm.classNames.hide);
                }

                CbForm.currentSelected = null;
            }
        }
    },

    isCheckElement: function(obj) {
        return obj.nodeName.toLowerCase() == 'input' && (obj.getAttribute('type') == 'checkbox' || obj.getAttribute('type') == 'radio');
    }
};

// --------------------
// Added functionality specifically for contact a realtor
// --------------------
var ContactForm = {
    classNames: {
        selected: 'selected'
    },

    init: function(elements, isExclusive) {
        if (elements.length) {
            // Call init of CbForm
            CbForm.init(elements, isExclusive);

            // Assign extra event handler
            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                if (el.cb && el.panel) {
                    addEvent(el.cb, 'click', ContactForm.toggle);

                    // Fire toggling behaviour for initial display
                    ContactForm.toggle.call(el.cb);
                }
            }
        }
    },

    toggle: function() {
        var panel = CbForm.pairs[this.id];
        if (panel) {
            // Add .selected to parent row
            var parent = getParentElement(this, 'tr');
            if (this.checked) {
                if (!hasClass(parent, ContactForm.classNames.selected)) {
                    addClass(parent, ContactForm.classNames.selected);
                }
            } else {
                if (hasClass(parent, ContactForm.classNames.selected)) {
                    removeClass(parent, ContactForm.classNames.selected);
                }
            }
        }
    }
};
// Functie die in contact formulieren gebruikt wordt om het object te laten "volgen" en
// zonodig de gebruiker eerst in te laten loggen
function tryPostContactForm(userIsAnon, formValidateFunction, volgObjectFunction, formID, baseUrlSite) {
    if (!userIsAnon) {
        if (formValidateFunction()) {
            if ($("#prop-contact-save-prop:checked").length == 1) { //if checkbox is selected
                volgObjectFunction();
            }
            return true;
        }
        return false;
    } else {
        //first check form. if valid, show 'popup-content-login' popup. if succes, reactieFormulier.submit() will be called
        if (!formValidateFunction()) {
            return false;
        }

        // if 'bewaren in profile' is selected
        if ($("#prop-contact-save-prop:checked").length == 1) {
            var email = $("#form-naw-email").val();
            $.ajax({
                url: baseUrlSite + "clientactie/IsEmailAlreadyUser/?email=" + escape(email),
                cache: false,
                success: function(data) {
                    if (data.toString().toLocaleLowerCase() == "false") {
                        Popup.load.call(document.getElementById(formID), function() { volgObjectFunction(); return true; }, "{'actie-verwijzing-login':'', 'myaccount-form-email':'" + email + "'}", 'popup-content-signup');
                    } else {
                        Popup.load.call(document.getElementById(formID), function() { volgObjectFunction(); return true; }, "{'actie-verwijzing-login':'', 'myaccount-form-email':'" + email + "'}", 'popup-content-login');
                    }
                }
            });
            return false;
        }
        return true;
    }
}



// --------------------
// Added functionality specifically for ordering multiple products
// --------------------
var ProductForm = {
    cb: null,
    nums: null,
    prices: {},
    total: 0,
    totals: null,

    format: '&euro; {0}',

    init: function(obj) {
        ProductForm.cb = getElementsByClassName('cb-product', 'input', obj);
        ProductForm.nums = getElementsByClassName('num-product', 'span', obj);
        ProductForm.totals = getElementsByClassName('product-form-total', 'span');

        for (var i = 0; i < ProductForm.cb.length; i++) {
            var cb = ProductForm.cb[i];
            addEvent(cb, 'click', ProductForm.calculate);

            if (cb.checked) {
                ProductForm.calculate.call(cb);
            }
        }
    },

    calculate: function() {
        var total = 0;
        for (var i = 0; i < ProductForm.cb.length; i++) {
            var cb = ProductForm.cb[i];
            var parent = getParentElement(cb, 'tr');
            if (cb.checked) {
                var price = ProductForm.prices[cb.id];
                total += price;
                ProductForm.showPrice(ProductForm.nums[i], price);

                if (parent) {
                    addClass(parent, 'selected');
                }
            } else {
                ProductForm.showPrice(ProductForm.nums[i], null);

                if (parent) {
                    removeClass(parent, 'selected');
                }
            }

            if (CbForm) {
                CbForm.toggle.call(cb);
            }
        }
        ProductForm.showTotal(total);
    },

    showPrice: function(obj, str) {
        var price = '';
        if (str != null) {
            price = str.toFixed(2);
            price = ProductForm.format.replace('{0}', price);
            price = price.replace('.', ',');
        }
        obj.innerHTML = price;
    },

    showTotal: function(str) {
        for (var i = 0; i < ProductForm.totals.length; i++) {
            ProductForm.showPrice(ProductForm.totals[i], str);
        }
    }
};

// --------------------
// Added functionality specifically for showing help text
// --------------------
var BalloonForm = {
    current: null,
    placeholder: null,

    init: function(form) {
        // Find balloons and assign behaviour
        var txts = getElementsByClassName('balloon-txt', 'div', form);
        for (var i = 0; i < txts.length; i++) {
            var txt = txts[i];

            // For attribute maps to ID of form element
            if (txt.getAttribute('for')) {
                var forInput = txt.getAttribute('for');
                var input = document.getElementById(forInput);
                if (input) {
                    addEvent(input, 'focus', function(input, txt) {
                        return function() {
                            // Create, append, show
                            var balloon = BalloonForm.createBalloon(txt);
                            BalloonForm.current = input.parentNode.insertBefore(balloon, input.nextSibling);
                            BalloonForm.current.style.display = 'block';
                        };
                    } (input, txt));

                    addEvent(input, 'blur', function(input, txt) {
                        return function() {
                            if (BalloonForm.current) {
                                // Remove from DOM
                                BalloonForm.current.parentNode.removeChild(BalloonForm.current);
                            }
                        };
                    } (input, txt));
                }
            }
        }
    },

    createBalloon: function(txt) {
        var placeholder = document.createElement('div');
        placeholder.innerHTML = BalloonForm.html.balloon.replace('{BALLOON_TEXT}', txt.innerHTML);
        return placeholder;
    },

    html: {
        balloon: ' \
			<div class="balloon"> \
			  <iframe></iframe> \
			  <div class="balloon-content"> \
				  {BALLOON_TEXT} \
			  </div> \
			  <span class="bl-tl"></span> \
			  <span class="bl-tr"></span> \
			  <span class="bl-br"></span> \
			  <span class="bl-bl"></span> \
			  <span class="bl-icn"></span> \
			</div> \
		'
    }
};

function checkPasswordLengthNotToSmall(value) {
    return value.length > 5;
}
function checkPasswordLengthNotToLong(value) {
    return value.length < 11;
}

function checkEmail(value) {
    var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    return pattern.test(value);
}

function checkPostcode(value) {
    var pattern = /^[0-9]{4}\s*([a-zA-Z]{2})?$/;
    return pattern.test(value);
}

function checkPlaatsnaam(value) {
    var pattern = /^([0-9a-zA-Z-.' ])*$/;
    return pattern.test(value);
}

function checkTelefoon(value) {
    if (value.length > 20) {
        return false;
    }
    var nonNumberPattern = /[^0-9]+/g;
    value = value.replace(nonNumberPattern, '');
    return value.length >= 10 && value.length <= 15;
}

function checkTextAreaMaxLenght(obj) {
    var mlength = obj.getAttribute ? parseInt(obj.getAttribute("maxlength")) : ""
    if (obj.getAttribute && obj.value.length > mlength)
        obj.value = obj.value.substring(0, mlength)
}

function checkHypoDagTijd(obj) {
    return obj != "Maak een keuze";
}

function checkRequiredHypothekFields(inputDay, inputTime, notifyWrapper) {
    hypError = false;
    if (inputDay.val() == "Maak een keuze") {
        toggleRodeRand(true,inputDay);
        hypError = true;
    }
    else {
        toggleRodeRand(false,inputDay);
    }
    if (inputTime.val() == "Maak een keuze") {
        toggleRodeRand(true,inputTime);
        hypError = true;
    }
    else {
        toggleRodeRand(false,inputTime);
    }
    if (hypError) {
        notifyWrapper.html(errorHypotheekadvies).show();
    }
}

function initFormVelden() {
    //alle textarea's, input type=text en selects moeten een onblur en onfocus krijgen, waarbij de blauwe rand wordt gezet
    $('textarea').add("input:text, input:password").add("select").bind('focus', function(event) {
        $(this).parents("span.input-wrap").addClass("input-wrap-focus")
    });
    $('textarea').add("input:text, input:password").add("select").bind('blur', function(event) {
        $(this).parents("span.input-wrap").removeClass("input-wrap-focus")
    });
    $('textarea').bind('keyup', function(event) { checkTextAreaMaxLenght(this); });
}

// -------------------------
// form validation functions
// -------------------------
var errorHypotheekadvies = "<strong>Voorkeursmoment</strong> is verplicht maar nog niet ingevuld. Vul de rood omlijnde velden aan.";

function checkRequiredVisibleField(inputWrapper, notifyWrapper, veldNaam, extraCheckFunction, extraCheckFoutmelding, alternatieveVerplichtFoutmelding) {
    if (inputWrapper && inputWrapper.is(":visible")) {
        //toon fout indien value leeg is, of de optioneel meegegeven controle-functie false teruggeeft
        if (inputWrapper.val() == "") {
            var veldNietCorrectTekst = alternatieveVerplichtFoutmelding || FTranslate.Get("errorVerplicht").replace('{0}', veldNaam);
            toonFoutmelding(inputWrapper, notifyWrapper, ((veldNaam != null && notifyWrapper.html() == '') ? veldNietCorrectTekst : FTranslate.Get("errorMeerdereVerplicht")));
            return false;
        }
        else if (extraCheckFunction && !extraCheckFunction(inputWrapper.val())) {
            var veldNietCorrectTekst = extraCheckFoutmelding || FTranslate.Get("errorNietCorrect").replace('{0}', veldNaam);
            toonFoutmelding(inputWrapper, notifyWrapper, ((veldNaam != null && notifyWrapper.html() == '') ? veldNietCorrectTekst : FTranslate.Get("errorMeerdereNietCorrect")));
            return false;
        }
        else {
            toggleRodeRand(false, inputWrapper);
        }
    }
    return true;
}

function checkOptionalVisibleField(inputWrapper, notifyWrapper, veldNaam, extraCheckFunction, extraCheckFoutmelding, alternatieveVerplichtFoutmelding) {
    if (inputWrapper && inputWrapper.is(":visible")) {
        //toon fout indien de optioneel meegegeven controle-functie false teruggeeft
        if (inputWrapper.val() != '' && extraCheckFunction && !extraCheckFunction(inputWrapper.val())) {
            var veldNietCorrectTekst = extraCheckFoutmelding || FTranslate.Get("errorNietCorrect").replace('{0}', veldNaam);
            toonFoutmelding(inputWrapper, notifyWrapper, ((veldNaam != null && notifyWrapper.html() == '') ? veldNietCorrectTekst : FTranslate.Get("errorMeerdereNietCorrect")));
            return false;
        }
        else {
            toggleRodeRand(false, inputWrapper);
        }
    }
    return true;
}

function checkRequiredVisibleField_MessageBehindField(inputWrapper, notifyWrapper, veldNaam, extraCheckFunction, notDefaultErrorTextNullCheck, notDefaultErrorTextExtraCheck, checkIsEmpty) {
    //Als de velden zichtbaar zijn.

    if (inputWrapper && inputWrapper.is(":visible")) {
        //Controleer op veplicht invullen!
        if (checkIsEmpty == true && inputWrapper.val() == "") {
            toggleRodeRand(true, inputWrapper);
            var veldNietCorrectTekst = (notDefaultErrorTextNullCheck == null) ? FTranslate.Get("errorVerplichtAchterVeld").replace('{0}', veldNaam.toString().toLowerCase()) : notDefaultErrorTextNullCheck;
            toonFoutmelding(inputWrapper, notifyWrapper, veldNietCorrectTekst);
           
            return false;
        }

        //toon fout indien de optioneel meegegeven controle-functie false teruggeeft
        if (inputWrapper.val() != "" && extraCheckFunction && !extraCheckFunction(inputWrapper.val())) {
            toggleRodeRand(true, inputWrapper);
            var veldNietCorrectTekst = (notDefaultErrorTextExtraCheck == null) ? FTranslate.Get("errorNietCorrectAchterVeld").replace('{0}', veldNaam.toString().toLowerCase()) : notDefaultErrorTextExtraCheck;
            toonFoutmelding(inputWrapper, notifyWrapper, veldNietCorrectTekst);

            return false;
            
        }
    }
    toggleRodeRand(false, inputWrapper);
    return true;
}

function toonFoutmelding(inputWrapper, notifyWrapper, tekst) {
    toggleRodeRand(true, inputWrapper);
    notifyWrapper.html(tekst).show();
}

function toggleRodeRand(display, wrapper) {
    if (!wrapper) return;
    if (display) {
        wrapper.parents("span.input-wrap").addClass("input-wrap-error");
    } else {
        wrapper.parents("span.input-wrap").removeClass("input-wrap-error");
    }
}
