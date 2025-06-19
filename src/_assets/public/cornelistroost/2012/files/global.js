/// <reference path="jquery-vsdoc.js" />
// -------------------
// FUNDA GLOBAL JAVASCRIPT SCRIPTS
// -------------------

document.documentElement.className = 'jse';

//toevoegen trim functie op strings
String.prototype.trim = function() { 
	return this.replace(/(^\s+|(\s+$))/g,''); 
}

//
// Written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini
// http://dean.edwards.name/weblog/2005/10/add-event/
//
function addEvent(element, type, handler) {
	if (typeof handler == "string") {
		handler = new Function ("e", "return " + handler + "(e)");
	}
	if (element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else {
		if (!handler.$$guid) handler.$$guid = addEvent.guid++;
		if (!element.events) element.events = {};
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			if (element["on" + type]) {
				handlers[0] = element["on" + type];
			}
		}
		handlers[handler.$$guid] = handler;
		element["on" + type] = handleEvent;
	}
}
addEvent.guid = 1;

function removeEvent (element, type, handler) {
	if (element.removeEventListener) {
		element.removeEventListener(type, handler, false);
	} else {
		if (element.events && element.events[type]) {
			delete element.events[type][handler.$$guid];
		}
	}
}

function handleEvent (event) {
    var returnValue;
    event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
    var handlers = this.events[event.type];
    for (var i in handlers) {
        this.$$handleEvent = handlers[i];
        returnValue = this.$$handleEvent(event);
        if (returnValue === false) {
            break;
        }
    }
    return returnValue;
}

function fixEvent (event) {
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
}
fixEvent.preventDefault = function () { this.returnValue = false; }
fixEvent.stopPropagation = function () { this.cancelBubble = true; }

//
// HANDLE CLICK - popups, externe links.
// 
function handleClick (e) {
	var e = e || window.event;
	
	// Ignore event if modifier key was used
	if (e.ctrlKey || e.shiftKey || e.altKey) return;
	if (e.which && e.which != 1) return;
	
	// Walk up the tree to find the anchor element
	var target = e.target || event.srcElement;
	while (target && target.nodeName.toLowerCase() !== 'a') {
		target = target.parentNode;
	}
	
	// Bail if we found nothing
	if (!target) return;	
	
	// Accepted CSS classes
	// - popup
	// - int-site
	// - ext-site
	// - file-pdf
	// - cont-info (legacy)
	var href = target.getAttribute('href');
	if (hasClass(target, 'pop-up')) {
        window.open(href, '', 'width=450,height=550');
	} else if (!hasClass(target, 'no-pop-up') && (hasClass(target, 'int-site') || hasClass(target, 'ext-site') || hasClass(target, 'file-pdf') || hasClass(target, 'cont-info'))) {
        window.open(href);
	} else {
		return;
	}
	
	// Prevent default behaviour
	if (e.preventDefault) {
		e.preventDefault();
	}
    return false;
}

// HANDLECLICK in DOM hangen
// 
addEvent(document, 'click', handleClick);

// Apply custom border boxes
$(document).ready(initCB);

// MAILTO
// 
// Bouw 'mailto' functie in Javascript op ivm mail harvesting
// Legacy functie, wordt nog aangeroepen op de volgende pagina's:
//    /funda-desk/news-item.html
//    /funda-ib/company-contact.html
//    /funda/company-contact.html
//    /funda/company-jobs-item.html
//    /funda/company-nvm.html
//    /funda/company-press-item.html
//    /funda/company-press.html
//    /funda/realtor-vw=properties.html
//    /funda/realtor.html
//    /funda/js-examples.html
function mailTo(prefix,suffix){
	var m =  Array(109,97,105,108,116,111,58);
	var a =  Array(64);
	var s = '';
	for (var i = 0; i < m.length; i++){
		s += String.fromCharCode(m[i]);
	}
	window.location.replace(s + prefix + String.fromCharCode(64) + suffix);
	return false;
}




/* CUSTOM BORDERED BOXES
http://www.456bereastreet.com/archive/200505/transparent_custom_corners_and_borders/ */

/*
createElement function found at http://simon.incutio.com/archive/2003/06/15/javascriptWithXML
*/
function createElement(element) {
	if (typeof document.createElementNS != 'undefined') {
		return document.createElementNS('http://www.w3.org/1999/xhtml', element);
	}
	if (typeof document.createElement != 'undefined') {
		return document.createElement(element);
	}
	return false;
}

function insertTop(obj) {
	// Create the two div elements needed for the top of the box
	d=createElement("div");
	d.className="bt"; // The outer div needs a class name
    d2=createElement("div");
    d.appendChild(d2);
	obj.insertBefore(d,obj.firstChild);
}

function insertBottom(obj) {
	// Create the two div elements needed for the bottom of the box
	d=createElement("div");
	d.className="bb"; // The outer div needs a class name
    d2=createElement("div");
    d.appendChild(d2);
	obj.appendChild(d);
}

function initCB()
{
	// Hoekjes rond maken.
	divs = document.getElementsByTagName("div")
	for( i=0; i<divs.length; i++)
	{
		if (hasClass(divs[i], "cbb") && !hasClass(divs[i], "cbb-done"))
		{
			addClass(divs[i], "cbb-done")
			//divs[i].style.height
			cbbDiv = divs[i]
			AppendCorner(cbbDiv, "top", "left")
			AppendCorner(cbbDiv, "top", "right")
			AppendCorner(cbbDiv, "bottom", "left")
			AppendCorner(cbbDiv, "bottom", "right")
		}
	}
}

function AppendCorner(cbbDiv, yPosition, xPosition)
{
	// div plaatsen in de hoek
	Corner = document.createElement("div")
	Corner.className = "cb-corner cb-" + yPosition + xPosition
	Corner.innerHTML = "&nbsp;"
	cbbDiv.appendChild(Corner)
}

function Submit(actie, id, tekst, omschrijving)
{
	document.getElementById('SubmitActie').value = actie
	document.getElementById('SubmitId').value = id
	document.getElementById('SubmitTekst').value = tekst
	document.getElementById('SubmitOmschrijving').value = omschrijving
	document.getElementById('SubmitButton').click()
}

// Zoek op postcode; indien er meerdere postcodes ingevoerd zijn, moet straal gedisabled worden.
ArrayPostcodeTextboxen = new Array()
function CheckStraalDisabled(Textbox, n)
{
	ArrayPostcodeTextboxen[n] = (Textbox.value != '')
	teller = 0
	for(i=0; i<ArrayPostcodeTextboxen.length; i++)
	{
		if (ArrayPostcodeTextboxen[i]) teller ++
	}
	selects = document.getElementsByTagName("select")
	var StraalDropdown;
	for(i=0; i<selects.length; i++)
	{
		if (selects[i].name.indexOf("Range") > -1)
		{
			StraalDropdown = selects[i];
		}
	}
	if (StraalDropdown != null)
	{
	    if (teller > 1 || teller == 0)
	    {
	    StraalDropdown.selectedIndex = 0
	    }
        StraalDropdown.disabled = (teller > 1 || teller == 0)
    }
}

function IsRekeningnummerGeldig(sender, args)
{
    // Negeer punten
    var rekeningNummer = '';
    for (i=0; i < args.Value.length;i++)
    {
        var character = args.Value.substring(i, i + 1);
        if (character != '.')
            rekeningNummer += character;
    }
    
    if (rekeningNummer.length < 3 || rekeningNummer.length > 9)
    {
        args.IsValid = false;
        return;
    }

    // Check of er alleen cijfers zijn ingevoerd (of punten)
    for (var i = 0; i < rekeningNummer.length; i++)
    {
        if ('0123456789.'.indexOf(rekeningNummer.substring(i, i+1)) == -1)
        {
            args.IsValid = false;
            return;
        }
    }

    if (rekeningNummer.length == 9)
    {
        // Doe de elf proef
        var elfProefPositie = 9;
        var totaal = 0;
        for (var i = 0; i < rekeningNummer.length; i++)
        {
            var cijfer = rekeningNummer.substring(i, i+1);
            totaal += elfProefPositie * cijfer;
            elfProefPositie--;
        }

        // Totaal moet deelbaar zijn door 11
        args.IsValid = ( (totaal % 11) == 0);
        return;
    }
    
    args.IsValid = true;         
}

function validEmail(val)
{
	return (Boolean(val.match(/^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/)))
}

function NumOnly( e )
{
	if ( !e )
	{
		e = window.event;
	}
	
	var k = e.keyCode ? e.keyCode : e.which;
	if ( !k )
	{
		return true;
	}
	else
	{
		return  ( ( ( k <= 57 ) && ( k >= 48 ) )|| ( k == 39) || (k==8) || (k==9) || (k==37) || (k==39) || (k==46) ); 
	}
}

function checkPromotieBestelling()
{
    var i = 1
    Input = document.forms[0].elements
    while(Input['product_'+i])
    {
		ingevuld = parseInt(Input['product_'+i].value)
		max = parseInt(Input['productaantal_'+i].value)
		
        if (ingevuld > max)
        {
            alert('Het maximum aantal dat u bij "' + Input['productnaam_'+i].value + '" kunt bestellen is ' + max);
            Input['product_'+i].focus();
            return false;
        }
        i++
    }

    var fields = new Array("tav","email","postadres","postcode","Plaatsnaam");
    var fieldDescriptions = new Array("T.a.v.","E-mailadres","Postadres","Postcode","Plaats");
    
    for (i = 0; i < fields.length; i++)
    {
        if (document.forms[0].elements[fields[i]].value.length == 0)
        {
            alert('Het veld ' + fieldDescriptions[i] + ' is niet ingevuld.');
            return false;
        }
    }
    
    // Check of e-mail adres correct is ingevuld
    if (validEmail(document.forms[0].email.value))
    {
        return true;
    }
    else
    {
        alert('Het ingevoerde e-mail adres is niet geldig.');
        return false;
    }
}

// SelectBoxen op elkaar aanpassen
function WaardeVan_Change(Van, Tot)
{
	SelectVan = document.getElementById(Van)
	SelectTot = document.getElementById(Tot)
	n = (SelectTot.options[0].value == '' ? 1 : 0)
	if (SelectTot.selectedIndex <= SelectVan.selectedIndex && (SelectTot.selectedIndex != 0 || n == 0))
	if (SelectVan.selectedIndex == SelectTot.options.length - n)
	{
		SelectTot.selectedIndex = 0
	}
	else
	{
		SelectTot.selectedIndex = SelectVan.selectedIndex + n
	}
	if (SelectVan.options[SelectVan.selectedIndex].value == SelectTot.options[SelectTot.selectedIndex].value)
	{
	    var n = SelectTot.selectedIndex + 1
	    if (n > SelectTot.length-1) n = SelectTot.length-1
	    SelectTot.selectedIndex = n
	}
}

function WaardeTot_Change(Van, Tot)
{
	SelectVan = document.getElementById(Van)
	SelectTot = document.getElementById(Tot)
	n = (SelectTot.options[0].value == '' ? 1 : 0)
	if (SelectVan.selectedIndex >= SelectTot.selectedIndex && (SelectTot.selectedIndex != 0 || n == 0))
	{
		SelectVan.selectedIndex = SelectTot.selectedIndex - n
	}
	if (SelectVan.options[SelectVan.selectedIndex].value == SelectTot.options[SelectTot.selectedIndex].value)
	{
	    var n = SelectVan.selectedIndex - 1
	    if (n < 0) n = 0
	    SelectVan.selectedIndex = n
	}
}

// Menu's laten verschijnen en verdwijnen
var LayerHovered = new Array()
var LayerTimeout = new Array()

function ShowLayer(id)
{
    if (!LayerHovered[id])
    {
        LayerHovered[id] = true
        document.getElementById(id).style.display = 'block'
    }
}

function HideLayer(id)
{
    LayerHovered[id] = false
    if (LayerTimeout[id]) clearTimeout(LayerTimeout[id])    
    LayerTimeout[id] = setTimeout('DoHideLayer("' + id + '")', 500)
}

function DoHideLayer(id)
{
    if (LayerHovered[id] == false) document.getElementById(id).style.display = 'none'
}

    function ChangeRadioButtonKoopHuur(radiobutton, dropdown1tot, dropdown1van, dropdown2tot, dropdown2van, dropdown3tot, dropdown3van)
    {
        var value = radiobutton.value;
        if (value == '1')
        {
            //koop of huur
            document.getElementById(dropdown1tot).style.display = 'block';
            document.getElementById(dropdown1van).style.display = 'block';
            document.getElementById(dropdown2tot).style.display = 'none';
            document.getElementById(dropdown2van).style.display = 'none';
            document.getElementById(dropdown3tot).style.display = 'none';
            document.getElementById(dropdown3van).style.display = 'none';
        }
        else if (value == '2')
        {
            //koop
            document.getElementById(dropdown1tot).style.display = 'none';
            document.getElementById(dropdown1van).style.display = 'none';
            document.getElementById(dropdown2tot).style.display = 'block';
            document.getElementById(dropdown2van).style.display = 'block';
            document.getElementById(dropdown3tot).style.display = 'none';
            document.getElementById(dropdown3van).style.display = 'none';
        }
        else if (value == '3')
        {
            //huur
            document.getElementById(dropdown1tot).style.display = 'none';
            document.getElementById(dropdown1van).style.display = 'none';
            document.getElementById(dropdown2tot).style.display = 'none';
            document.getElementById(dropdown2van).style.display = 'none';
            document.getElementById(dropdown3tot).style.display = 'block';
            document.getElementById(dropdown3van).style.display = 'block';
        }
    }
    
    function ResizeImages()
{
    elements = document.getElementsByTagName('img');
    for (i = 0; i < elements.length; i++)
    {
        var obj = elements[i];
        if (obj.className == 'resize')
        {
            obj.style.display = 'inline';
            ResizeImage(obj, 121, 80);
        }
    }
}

function ResizeImage(objImage, maxWidth, maxHeight)
{
	if (objImage.width <= maxWidth && objImage.height <= maxHeight)
	{
		// We hoeven niets te doen
		return;
	}

	if (objImage.width > maxWidth && objImage.height <= maxHeight)
	{
		ratio = maxWidth / objImage.width;
		objImage.width = maxWidth;
		objImage.height = ratio * objImage.height;
	}
	else if (objImage.height > maxHeight && objImage.width <= maxWidth)
	{
		ratio = maxHeight / objImage.height;
		objImage.width = ratio * objImage.width;
		objImage.height = maxHeight;
	}
	else
	{
		// Bepaal de kleinste ratio
		widthRatio = maxWidth / objImage.width;
		heightRatio = maxHeight / objImage.height;
		if (widthRatio < heightRatio)
		{
			// Schaal op basis van width
			objImage.width = maxWidth;
			objImage.height = widthRatio * objImage.height;
		}
		else
		{
			// Schaal op basis van height
			objImage.width = heightRatio * objImage.width;
			objImage.height = maxHeight;
		}
	}
}

/**
 * Uncollapsing Class
 *
 * Used to (un)collapse table rows for listings and objecttypes
 */
var Uncollapse = {

    currentUncollapsedObj: null,
    firstrun: true,

    init: function(parent) {
        if (!parent) return;

        var initialUncollapsed = true;

        var links = parent.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (hasClass(link, 'uncollapse-desc')) {
                link.onclick = Uncollapse.uncollapseDescription;

                if (initialUncollapsed) {
                    var parentRow = getParentElement(link, 'tr');
                    if (hasClass(parentRow, 'selected')) {
                        link.onclick();
                        initialUncollapsed = false;
                    }
                }
            }
        }
        Uncollapse.firstrun = false;
    },

    uncollapseDescription: function() {
        var parentRow = getParentElement(this, 'tr');
        var nextRow = getNextElement(parentRow, 'tr');

        if (hasClass(nextRow, 'desc')) {
            if (!hasClass(parentRow, 'selected') || Uncollapse.firstrun) {
                Uncollapse.initDescription(nextRow);

                if (!hasClass(parentRow, 'selected')) {
                    addClass(parentRow, 'selected');
                }
                removeClass(nextRow, 'hide');

                if (Uncollapse.currentUncollapsedObj) {
                    Uncollapse.currentUncollapsedObj.onclick();
                }

                Uncollapse.currentUncollapsedObj = this;
            }
            else if (hasClass(parentRow, 'selected')) {
                removeClass(parentRow, 'selected');
                addClass(nextRow, 'hide');

                Uncollapse.currentUncollapsedObj = null;
            }
        }
        return false;
    },

    initDescription: function(row) {
        if (row.done) return; row.done = true;
        var links = row.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (hasClass(link, 'item')) {
                var parentRow = getParentElement(link, 'tr');
                if (parentRow) {
                    Uncollapse.applyOnclickBehaviour(parentRow, link);
                    Uncollapse.applyOnfocusBehaviour(parentRow, link);
                    parentRow.onmouseover = Uncollapse.onmouseover;
                    parentRow.onmouseout = Uncollapse.onmouseout;
                }
            }
        }
    },

    applyOnclickBehaviour: function(row, link) {
        row.onclick = function(e) {
            var e = typeof e != 'undefined' ? e : event;
            var target = e.target ? e.target : e.srcElement;
            if (target.tagName.toLowerCase() !== 'a') {
                document.location.href = link.href;
            }
        };
    },

    applyOnfocusBehaviour: function(row, link) {
        link.onfocus = function() {
            row.onmouseover();
        };
        link.onblur = function() {
            row.onmouseout();
        };
    },

    onmouseover: function() {
        addClass(this, 'hover');
    },

    onmouseout: function() {
        removeClass(this, 'hover');
    }
}

// IE6 does not support the <abbr> element
document.createElement('abbr');

// -------------------
// Helper Functions
// -------------------
function _gel(id) {
	return document.getElementById(id);
}

function getParentElement (obj, nodeName) {
	var parentElement = obj.parentNode;
	while (parentElement && parentElement.nodeName.toLowerCase() != nodeName.toLowerCase()) {
		parentElement = parentElement.parentNode;
	}
	return parentElement;
}

function getNextElement (obj, nodeName) {
	var nextElement = obj.nextSibling;
	while (nextElement && nextElement.nodeName.toLowerCase() != nodeName.toLowerCase()) {
		nextElement = nextElement.nextSibling;
	}
	return nextElement;
}

function getParentElementByClassName (obj, nodeName, className) {
	var parentElement = obj.parentNode;
	while (parentElement && (parentElement.nodeName.toLowerCase() != nodeName.toLowerCase() || !hasClass(parentElement, className))) {
		parentElement = parentElement.parentNode;
	}
	return parentElement;
}

function getChildElements (obj) {
	var children = [];
	if (obj.hasChildNodes()) {
		for (var i = 0; i < obj.childNodes.length; i++) {
			if (obj.childNodes[i].nodeType === 1) {
				children[children.length] = obj.childNodes[i];
			}
		}
	}
	return children;
}

/*
	Developed by Robert Nyman, http://www.robertnyman.com
	Code/licensing: http://code.google.com/p/getelementsbyclassname/
	Modified to support MSIE5.0/Win (removed array.push)
*/	
var getElementsByClassName = function (className, tag, elm){
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements[returnElements.length] = current;
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements[returnElements.length] = node;
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck[classesToCheck.length] = new RegExp("(^|\\s)" + classes[k] + "(\\s|$)");
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements[returnElements.length] = current;
				}
			}
			return returnElements;
		};
}
	return getElementsByClassName(className, tag, elm);
};

function hasClass(ele, cls) {
    if (ele == null || ele.className == null) return false;
    return $(ele).hasClass(cls);
}

function addClass(ele, cls) {
    if (ele == null) return;
    return $(ele).addClass(cls);
}

function removeClass(ele, cls) {
    if (ele == null) return;
    $(ele).removeClass(cls);
}

function findPos(obj) {
    if (obj == null) return { left: 0, top: 0 };

    return $(obj).offset();	
}

function getViewportDimensions () {
	var curwidth = curheight = 0;
	
	// Standards compliant browsers	
	if (typeof window.innerWidth != 'undefined') {
		curwidth = window.innerWidth;
		curheight = window.innerHeight;
	}	
	// IE6+ in standards compliant mode
	else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0)	{
		curwidth = document.documentElement.clientWidth;
		curheight = document.documentElement.clientHeight;
	}
	// IE5.5 and older
	else {
	   curwidth = document.getElementsByTagName('body')[0].clientWidth;
	   curheight = document.getElementsByTagName('body')[0].clientHeight;
	}
	return {width : curwidth, height : curheight};
}

// Voorbeeld: StringFormat("aa {0} {1}", "bb", "cc") wordt "aa bb cc"
function StringFormat(string)
{
	for(var i=1; i<arguments.length; i++)
	{
		var n = i-1
		var string = Replace(string, '{'+n+'}', arguments[i])
	}
	return string
}

function Replace(string, find, replace)
{
	if (find == '') return string
	return string.split(find).join(replace)
}

function ResolveUrl(url) {
	var selfUrl = self.location.href
	var start = selfUrl.indexOf('/', selfUrl.indexOf('//') + 2) + 1
	var einde = selfUrl.indexOf('/', start)
	var rootFolder = selfUrl.substring(start, einde).toLowerCase()
	switch (rootFolder) {
		case 'funda':
			return '/funda' + url
			break;
		case 'fundainbusiness':
			return '/fundainbusiness' + url
			break;
	}
	return url
}

function getParentElementByNodeName(obj, nodeName) {
    var parentElement = obj.parentNode;
    while (parentElement && (parentElement.nodeName.toLowerCase() != nodeName.toLowerCase())) {
        parentElement = parentElement.parentNode;
    }
    return parentElement;
}
function showhide(obj) {
    var object = document.getElementById(obj);
    if (hasClass(object, "hide")) {
        removeClass(object, "hide");
        var items = getElementsByClassName('info-box-container');
        var j = items.length;
        for (i = 0; i < j; i++) {
            if (items[i] != object) {
                addClass(items[i], "hide");
            }
        }
    } else {
        addClass(object, "hide");
    }
}
function findPositionAsArray(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curleft, curtop];
    }
}

function DoAjaxRequest(url, callback) {
    req = false;
    if (window.XMLHttpRequest && !(window.ActiveXObject)) {
        try {
            req = new XMLHttpRequest();
        } catch (e) {
            req = false;
        }
    } else if (window.ActiveXObject) {
        try {
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                req = false;
            }
        }
    }
    if (req) {
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                callback(req.responseText);
            }
        };
        req.open("GET", url, true);
        req.send("");
    }
}

var imageErrorCounter = 0;

/*********************************/

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name, cookieArray) {
	var nameEQ = name + "=";
	var ca = cookieArray || document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function ClearKaartCookieOnHome() {
	eraseCookie('zok_state'); 
	eraseCookie('sozokreferrer');
	if($('.autocompletePlaatsen').val()=='sozok') createCookie('toonbewaardeobjecten',1); else eraseCookie('toonbewaardeobjecten');
}

function getLangSetting() {
    var uis = readCookie('uisettings');
    if (uis == null || uis == "") return "nl";
    uis = unescape(uis).split('&');
    for (var item in uis) {
        var single = uis[item].split('=');
        if (single[0] == 'lang') {
            return single[1].substr(0,2);
        }
    }
    return "nl";
}

/*********************************/
/* scripts voor objectdetail 2.0 */
/*********************************/
function clientactie_complete(xmlHttp, soortactie, saveDivSelector, followDivSelector, succesUrl, callFunctieNaComplete) {

    //niet ingelogd? -> redirect
	if (xmlHttp!="" && xmlHttp.getResponseHeader("Location")) {
		window.location = xmlHttp.getResponseHeader("Location"); 
		return;
	}

	setTimeout((function() {
	    return function() {
	        var objs = (soortactie == 'bewaar') ? $(saveDivSelector) : $(saveDivSelector + ', ' + followDivSelector);
	        objs.removeClass('saving');
	        objs.addClass('saved');
	        objs.attr('onclick', ''); //geen onclick meer
	        objs.unbind('click'); //unbind andere click events
	        objs.attr('href', succesUrl)
	        if (soortactie == 'selecteeralsmijnmakelaar')
	            $(saveDivSelector).html('Mijn aankopende makelaar');
	        else {
	            $(saveDivSelector).each(function() {
	                if ($(this).attr("id") == "pg-option-save-btn") {
	                    $(this).html('<strong><span class="icn-favor">Bewaard als favoriet</span></strong>');
	                    $(this).removeClass('button-disabled-l');
	                    $(this).addClass('button-alt-l');
	                }
	                else
	                    $(this).html(FTranslate.Get('TabBewaard'));
	            });
	        }

	        if (soortactie == 'volg') {
	            $(followDivSelector).each(function() {
	                if ($(this).attr("id") == "pg-option-alerts")
	                    $(this).html("U ontvangt e-mail alerts bij wijzigingen");
	                else
	                    $(this).html(FTranslate.Get('Gevolgd'));
	            });
	        }
	        if (callFunctieNaComplete) callFunctieNaComplete();
	    };
	})(), 500);        //minimaal 0.5 secs wachten, zodat tekst niet te snel op 'bewaard' springt
}

function object_clientactie(soortactie, url, succesUrl, saveDivSelector, followDivSelector, callFunctieNaComplete, blocking) {
	// #pg-option-save
	// #pg-option-follow
    //alert(url + "?referrer=" + escape(self.location.href));
    var async = !blocking;
    $.ajax({
	    async: async,
		cache: false,
		url: url + "?referrer=" + escape(self.location.href),
		success: function(data) {
			if (data != '') {
				var meerdan50melding = 'U kunt geen woningen meer bewaren, want u heeft het maximum van 50 overschreden.\r\nU kunt bewaarde woningen verwijderen in My funda.';
				if ($('#login_bewaard').length > 0) {
					$('#login_bewaard').show();
					if ($('#login_bewaard_aantal').html() == "50") {
						alert(meerdan50melding);
					} else {
						$('#login_bewaard_aantal').html(data);
					}
				} else if (document.getElementById("AantalBewaard")) {
					if (document.getElementById("AantalBewaard").innerHTML == "50") {
						alert(meerdan50melding);
					} else {
						document.getElementById("AantalBewaard").innerHTML = aantalbewaard;
					}
				} else if (document.getElementById("BewaardPipe")) {
					document.getElementById("BewaardPipe").innerHTML = "&nbsp;|&nbsp;"
					document.getElementById("my-new").innerHTML = '<strong><span id="AantalBewaard">1</span> bewaard</strong>'
				}
			}
        }, //update aantal bewaarde woningen
        beforeSend: function() {
            var objs = (soortactie == 'bewaar') ? $(saveDivSelector) : $(saveDivSelector + ', ' + followDivSelector);
            objs.blur();
            objs.addClass('saving');
	            $(saveDivSelector).each(function() {
	                if ($(this).attr("id") == "pg-option-save-btn") {
	                    $(this).addClass('button-disabled-l');
	                }
	            });
            
            $(this).removeClass('button-l');
		},
		complete: function(xmlHttp, responseText) {
		    clientactie_complete(xmlHttp, soortactie, saveDivSelector, followDivSelector, succesUrl, callFunctieNaComplete);
		}
	});
	return false;
}

function stripDomain(url) {
	return url.replace(/http(s)?:\/\/[^\/]+/i, ''); //stip domain
}

var _resizeFrames = [];

//iframe loading van banners
var fif = 
{
	get : function(ad_call, div_id, height, width, displayMode, inAjaxPostbackMode, version)
	{
		var friendly_iframe = document.createElement('iframe');
		var div = document.getElementById(div_id);
		friendly_iframe.id = div_id + "_frame";
		friendly_iframe.width = width;
		friendly_iframe.frameBorder = "0px";
		friendly_iframe.height = height;
		friendly_iframe.marginheight = "0px";
		friendly_iframe.marginwidth = "0px";
		friendly_iframe.scrolling = "no";
		friendly_iframe.style.border = 'none';
		
		friendly_iframe.parentIsLoaded = inAjaxPostbackMode ? true: false;
		if (!inAjaxPostbackMode) _resizeFrames[_resizeFrames.length] = friendly_iframe.id;
		friendly_iframe.src = ((displayMode == 'resultaatlijst') ? '/js/fif_resultaatlijst.html' : '/js/fif.html') + '?' + version;
			
		friendly_iframe.ad_call = ad_call;
		div.appendChild(friendly_iframe);		
	}
}

function resize_fif() {
	//banner frames resizen a.d.h.v. inhoud hoogte
	if (typeof(_resizeFrames) != 'undefined') {
		for (var i = 0; i < _resizeFrames.length; i++) {
			var fifframe = document.getElementById(_resizeFrames[i]);
			if (fifframe) fifframe.parentIsLoaded = true;
		}
	}
}

function openTwitterWithUrl(encodedMessage, url) {
	var win = window.open('');
	var html = '<html><head><title>twitter laden...</title></head><body onload="load()"><div id="loading"><span>twitter laden...</span></div>' +
		 '<script type="text/javascript">function load() { var url = "http://twitter.com/home?status=' + encodedMessage + ': ' + url + '"; document.location.href = url; }</script>' +
		 '</body></html>';
	win.document.writeln(html);
	win.document.close();
}

function getVirtualDir() {
    var virtualDir = '';
    if (self.location.href.toLowerCase().indexOf('/funda/') > 0) virtualDir = '/funda';
    else if (self.location.href.toLowerCase().indexOf('/fundainbusiness/') > 0) virtualDir = '/fundainbusiness';
    else if (self.location.href.toLowerCase().indexOf('/fundadesk/') > 0) virtualDir = '/fundadesk';
    return virtualDir;
}

$(document).ready(function() {
    $('div.notify-help a.notify-help-close').click(function() {
        var className = $('div.notify-help').attr('class');
        className = $.trim(className.replace('notify-help', ''));
        var url = getVirtualDir() + "/clientactie/AddValueIn360FotoCookie/?key=" + className + "&value=1";

        $.ajax({
            url: url,
            cache: false,
            success: function() {
                $('div.notify-help').hide();
            }
        });
        return false;
    })
});
