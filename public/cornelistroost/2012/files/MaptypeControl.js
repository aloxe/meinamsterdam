function FundamapMaptypeControl(map) {

    this.labels = false
	this.ShowLabelDiv = false
	this.LabelTimeout = false
	this.container = null;
	this.map = map
	this.linkKaart;
	this.linkSatelliet;
	this.linkTerrein;
	this.ActiveType;
	FundamapMaptype = this


	this.MapTypeChanged = function() {
	    var shortMapName = this.GetCurrentMapTypeName();

	    removeClass(this.linkSatelliet, "selected");
	    removeClass(this.linkKaart, "selected");
	    removeClass(this.linkTerrein, "selected");

	    if (shortMapName == 'sat' || shortMapName == 'hyb') {
	        addClass(this.linkSatelliet, "selected");
	    } else {
	        if (shortMapName == 'ter')
	            addClass(this.linkTerrein, "selected");
	        else
	            addClass(this.linkKaart, "selected");
	    }

	    if (this.map.mapType == 'large')
			createCookie('kaartfullmaptype', shortMapName);
	}

	this.HoverLabelsDiv = function() {
	    this.ShowLabelDiv = true;
	    addClass(this.container, "gmview-labels");
	    if (this.LabelTimeout) clearTimeout(this.LabelTimeout);
	}

	this.BlurLabelsDiv = function() {
	    this.ShowLabelDiv = false;
	    this.LabelTimeout = this.HideLabelsDiv(true);
	}

	this.HideLabelsDiv = function(div, withTimeout) {
	    removeClass(this.container, 'gmview-labels');
//	    var fn = function(el) { removeClass(el.container, "gmview-labels") };

//	    if (!withTimeout) fn(this);
//	    else { setTimeout(function() { fn(this); }, 300); }
	}

	this.CheckLabels = function() {
	    if (this.chkbox.checked == true) {
	        this.map.setMapType(G_HYBRID_MAP);
	    }
	    else {
	        this.map.setMapType(G_SATELLITE_MAP);
	    }
	    return false;
	}
	
	this.GetCurrentMapTypeName = function() {
	
		var map_type = 'map'; 
	    if (this.map.getCurrentMapType() == G_PHYSICAL_MAP)
			map_type = "ter"; 
	    else if (this.map.getCurrentMapType() == G_SATELLITE_MAP)
			map_type = "sat"; 
	    else if (this.map.getCurrentMapType() == G_HYBRID_MAP)
			map_type = "hyb"; 
	
		return map_type;
	}
}

function InitFundamapMaptypeControl() {

    FundamapMaptypeControl.prototype = new GControl()

    FundamapMaptypeControl.prototype.initialize = function(map) {
        var fmc = this;
        this.map = map;
        
        this.streetviewKnop = document.createElement("div");
        this.streetviewKnop.setAttribute("id", "gmview-sv");
        this.streetviewKnop.style.display = "none";
        addClass(this.streetviewKnop, "gmview-sv");
        this.streetviewKnop.innerHTML = "<div class='gmview-cont'><a class='gmbut gmbut-sv' href='#'><span><span class='gmbut-icn'>Street View</span></span></a></div></div>";
		map.getContainer().appendChild(this.streetviewKnop);

        this.container = document.createElement("div");
        addClass(this.container, "gmview");
        //this.container.style.zIndex = "600"; moet naar css

        var div = document.createElement("div");
        addClass(div, "gmview-cont");

        // Kaart button
        this.linkKaart = document.createElement("a");
        addClass(this.linkKaart, "gmbut gmbut-map");

        var span = document.createElement("span");
        span.appendChild(document.createTextNode(FTranslate.Get("Kaart")));
        this.linkKaart.appendChild(span);

        // Satelliet button (inclusief labels)
        this.linkSatelliet = document.createElement("a");
        addClass(this.linkSatelliet, "gmbut gmbut-sat");
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(FTranslate.Get("Satelliet")));
        this.linkSatelliet.appendChild(span);
 
        this.labels = document.createElement("div");
        addClass(this.labels, "gmbut-labels");
		
		var lbspan = document.createElement("span");
        var chkbox = document.createElement("input");

        var chkGuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();

        chkbox.setAttribute("id", "gm-show-labels-" + chkGuid);
        chkbox.setAttribute("type", "checkbox");
        this.chkbox = chkbox;
 
        this.lbllbl = document.createElement("label");
        this.lbllbl.setAttribute("for", "gm-show-labels-" + chkGuid);
        this.lbllbl.setAttribute('class', 'gm-show-labels');
        this.lbllbl.appendChild(document.createTextNode(FTranslate.Get("LabelsWeergeven")));

        lbspan.appendChild(this.chkbox);
        lbspan.appendChild(this.lbllbl);
		this.labels.appendChild(lbspan);

        // Terrein button
        this.linkTerrein = document.createElement("a");
        addClass(this.linkTerrein, "gmbut gmbut-ter");
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(FTranslate.Get("Terrein")));
        this.linkTerrein.appendChild(span);

        div.appendChild(this.linkKaart);
        div.appendChild(this.linkSatelliet);
        div.appendChild(this.linkTerrein);
        div.appendChild(this.labels);
        this.container.appendChild(div);

        GEvent.addDomListener(this.linkKaart, "click", function() { map.setMapType(G_NORMAL_MAP); Map.InTerreinMode = false; return false; });
        GEvent.addDomListener(this.linkSatelliet, "click", function() { fmc.CheckLabels(); Map.InTerreinMode = false; return false; });
        GEvent.addDomListener(this.linkTerrein, "click", function() { map.setMapType(G_PHYSICAL_MAP); Map.InTerreinMode = true; return false; });
        GEvent.addDomListener(this.linkSatelliet, "mouseover", function() { fmc.HoverLabelsDiv(); })
        GEvent.addDomListener(this.linkSatelliet, "mouseout", function() { fmc.BlurLabelsDiv(); })
        GEvent.addDomListener(this.labels, "mouseover", function() { fmc.HoverLabelsDiv(); })
        GEvent.addDomListener(this.labels, "mouseout", function() { fmc.BlurLabelsDiv(); })
        GEvent.addListener(this.map, "maptypechanged", function() { fmc.MapTypeChanged() });
        GEvent.addDomListener(this.chkbox, "click", function() { fmc.CheckLabels() });

        this.container.appendChild(div);
        this.map.getContainer().appendChild(this.container)

        this.MapTypeChanged(map.getCurrentMapType())

        return this.container
    }

    FundamapMaptypeControl.prototype.getDefaultPosition = function() {
	    return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(8, 10))
    }
}