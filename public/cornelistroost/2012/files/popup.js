var Popup =
{
    classNames:
    {
        close: 'close-popup',
        container: 'popup-container',
        hide: 'hide',
        open: 'open-popup',
        overlay: 'overlay',
        submit: 'submit-popup',
        done: 'popup-done',
        ajax: 'ajax-content'
    },

    overlayContainer: null,

    init: function() {
        //toevoegen van de generieke LightBox container
        $('body').append(
'<div class="overlay-container hide" id="overlay-container">\
<div class="overlay"></div>\
<div class="popup-container">\
	<div class="popup-bg"></div>\
	<iframe></iframe>\
	<div id="popup-content">[popup content placeholder]</div>\
</div>\
</div>');

        Popup.overlayContainer = document.getElementById('overlay-container');
        Popup.hookupLinks();

        // Close overlay w/ ESC key
        addEvent(document, 'keypress', function(e) {
            Popup.onkeypress(e);
        });
    },

    hookupLinks: function(containerEle) {
        var objs = getElementsByClassName(Popup.classNames.open, 'a', containerEle);
        for (var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            var $obj = $(obj);
            if (!$obj.hasClass(Popup.classNames.done)) {
                var rel = obj.getAttribute('rel');
                if (rel) {
                    var isAjaxContent = $obj.hasClass(Popup.classNames.ajax);
                    if (isAjaxContent) {
                        var originalOnClick = false;
                        var actionTexts = false;

                        var isAjaxHookup = (containerEle === Popup.overlayContainer);
                        if (!isAjaxHookup) {
                            if (obj.rev && obj.rev.indexOf('{') == 0) {
                                actionTexts = obj.rev;
                            }
                            originalOnClick = obj.onclick || function() { }; //indien al een onclick bestond, deze uitvoeren na succes
                            obj.onclick = null; //verwijderen onclick op link
                        }

                        //bij klikken op link, load en show popup
                        $obj.click(function(originalOnClick, actionTexts) {
                            return function(e) {
                                Popup.load.call(this, originalOnClick, actionTexts);
                                e.preventDefault();
                            }
                        } (originalOnClick, actionTexts));
                    }
                    else {
                        var ele = document.getElementById(rel);
                        if (ele) {
                            //bij klikken op link, open popup
                            $obj.click(function(ele) {
                                return function(e) {
                                    Popup.open.call(this, ele);
                                    e.preventDefault();
                                }
                            } (ele));

                            Popup.hookForm(ele);
                        }
                    }

                    // Add class to indicate setup was done
                    $obj.addClass(Popup.classNames.done);
                }
            }
        };
    },

    //actionDescription is een object
    load: function(originalOnClick, actionTexts, rel) {
        if (actionTexts) {
            //actionTexts bevat een json object
            eval('Popup.actionTexts = ' + actionTexts);
        }

        if (originalOnClick) {
            var originalObject = this;
            Popup.originalOnClick = function(split) {
                if (originalOnClick.call(originalObject) !== false) {
                    if (split) {
                        Popup.originalAfterOnClick = function() {
                            if (originalObject.tagName == "A") window.location.href = originalObject.href; //link
                            else if (originalObject.tagName == "FORM") originalObject.submit();
                        };
                    }
                    else {
                        if (originalObject.tagName == "A") window.location.href = originalObject.href; //link
                        else if (originalObject.tagName == "FORM") originalObject.submit();
                    }
                }
            }
            Popup.originalAfterOnClick = function() { };
        }

        rel = rel || this.rel;
        if (Popup.popupLoginSuccessful && rel === 'popup-content-login') {
            //indien de popup gebruikt wordt voor authenticatie, maar het inloggen is al gelukt door een andere popup. In dit geval dus niet via ajax laden, maar de klik doen
            Popup.originalOnClick();
        }
        else {
            Popup.showAjaxView(rel);
        }
    },

    showAjaxView: function(viewName) {
        //opvragen content m.b.v. ajax
        $.ajax(
		{
		    async: true,
		    url: getVirtualDir() + "/lightbox/getview/?view=" + viewName,
		    dataType: "html",
		    success: function(viewHtml) {
		        //alert('showAjaxView success');
		        //clear old events
		        Popup.clearEvents();

		        //fill html
		        Popup.fill(viewHtml);
		    }
		});
    },

    fill: function(viewHtml) {
        //set content
        $("#popup-content").html(viewHtml);

        //hookup links and form-buttoms
        Popup.hookupLinks(Popup.overlayContainer);
        Popup.hookForm(Popup.overlayContainer);

        //zet actie-omschrijvingen
        if (Popup.actionTexts) {
            for (var cssName in Popup.actionTexts) {
                var $actionTextElements = $(Popup.overlayContainer).find("." + cssName);
                if ($actionTextElements.is(':input')) {
                    $actionTextElements.val(Popup.actionTexts[cssName]);
                } else {
                    $actionTextElements.html(Popup.actionTexts[cssName]);
                }
            }
        }

        $(Popup.overlayContainer).find(".show-after-load").show();

        Popup.open(Popup.overlayContainer);
    },

    open: function(ele) {
        if (!ele) ele = Popup.overlayContainer; //default

        $ele = $(ele);

        if (Popup.openEvent) {
            Popup.openEvent.call(this, ele);
        }

        // Render but hide
        $ele.css('visibility', 'hidden');
        $ele.removeClass(Popup.classNames.hide);

        // Vertically align popup
        var container = getElementsByClassName(Popup.classNames.container, 'div', ele)[0];
        if (container) {
            var $container = $(container);
            $container.css('margin-top', 0 - ($container.height() / 2));
            $container.css('margin-left', 0 - ($container.width() / 2));
        }

        // Make popup visible
        $ele.css('visibility', 'visible');
    },

    onkeypress: function(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;
        if (keyCode == 27) { // ESC: Close overlay
            Popup.close();
        }
    },

    close: function(ele) {
        if (!ele) ele = Popup.overlayContainer; //default

        if (Popup.closeEvent) {
            Popup.closeEvent.call(this, ele);
        }
        addClass(ele, Popup.classNames.hide);
    },

    submit: function(ele) {
        if (!ele) ele = Popup.overlayContainer; //default

        if (Popup.submitEvent) {
            Popup.submitEvent.call(this, ele);
        }
        //addClass(ele, Popup.classNames.hide);
    },

    brochureProc: false,

    //hookup form buttons
    hookForm: function(ele, submitCallback) {
        var closeButtons = getElementsByClassName(Popup.classNames.close, 'a', ele);
        for (var j = 0; j < closeButtons.length; j++) {
            var closeButton = closeButtons[j];
            addEvent(closeButton, 'click', function(ele) {
                return function(e) {
                    Popup.close.call(this, ele);
                    e.preventDefault();
                }
            } (ele));
        }

        // shield 'popup-brochure' from being processed twice
        if (!Popup.brochureProc) {
            var submitButtons = getElementsByClassName(Popup.classNames.submit, null, ele);
            for (var j = 0; j < submitButtons.length; j++) {
                var submitButton = submitButtons[j];
                addEvent(submitButton, 'click', function(ele) {
                    return function(e) {
                        Popup.submit.call(this, ele);
                        if (submitCallback) submitCallback();
                        e.preventDefault();
                    }
                } (ele));
            }
        }
        // mark as processed
        if (ele != null && ele.id == 'popup-brochure') Popup.brochureProc = true;
    },

    handleHtmlReplacements: function(htmlReplacements) {
        if (htmlReplacements) {
            //blokken html vervangen
            for (var htmlId in htmlReplacements) {
                $("#" + htmlId).html(htmlReplacements[htmlId]);
            }
        }
    },

    closeEvent: function() { },
    openEvent: function() { },
    submitEvent: function() { },

    originalClickEvent: function() { }, //wordt gebruikt voor ajax popups
    popupLoginSuccessful: false,
    actionTexts: {},

    clearEvents: function() {
        Popup.closeEvent = function() { };
        Popup.openEvent = function() { };
        Popup.submitEvent = function() { };
    }
};

$(document).ready(Popup.init);

