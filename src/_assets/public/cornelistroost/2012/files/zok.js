/// <reference path="jquery-vsdoc.js" />
var ZOK = {

    FilterBar: null, // Element reference to filter
    MapContainer: null, // Element reference to map
    Collapse: null,
    Uncollapse: null,
    Leftcolumn: null,

    ZoekOpdracht: null,
    DataTiles: {},
    ToonGroteIconsVanafLevel: 16, //wordt gezet/overschreven in GroteKaart.ascx met OverlayTile.ToonGroteIconsVanafLevel
    PreviewOnInitLatLng: null, //openen bij init
    BewaardeObjecten: [],
    MyNieuwAanbodLink: null,
    AppPathUrl: "/",
    clientActie: null,
    clientActieId: null,
    minimalPeviewDivWidth: 420,
    ToonBewaardeObjectenOpKaart: readCookie('toonbewaardeobjecten') == 1,
    BewaardeObjectenTiles: {},
    DataOphalenBijKlik: true,
    TrackMouseMove: true,

    InitMapHeight: function(mapContainer, filterBar, leftcolumn, collapse, uncollapse) {

        if (!mapContainer || !filterBar)
            return;

        this.FilterBar = filterBar;
        this.Leftcolumn = leftcolumn;
        this.MapContainer = mapContainer;
        this.Collapse = collapse;
        this.Uncollapse = uncollapse;

        addClass(document.documentElement, 'spi');

        ZOK.SetHeightToViewport();

        if (ZOK.Collapse) {
            addEvent(ZOK.Collapse, 'click', function(e) {
                addClass(ZOK.Leftcolumn, 'hide');
                addClass(ZOK.MapContainer, 'collapsed');
                removeClass(ZOK.Uncollapse, 'hide');
                e.preventDefault();
            });
        }

        if (ZOK.Uncollapse) {
            addEvent(ZOK.Uncollapse, 'click', function(e) {
                addClass(ZOK.Uncollapse, 'hide');
                removeClass(ZOK.MapContainer, 'collapsed');
                removeClass(ZOK.Leftcolumn, 'hide');
                e.preventDefault();
            });
        }

        window.onresize = function() {
            ZOK.SetHeightToViewport();
        };
    },

    SetHeightToViewport: function() {

        if (!this.MapContainer || !this.FilterBar) //indien nog niet geinitialiseerd (want SetHeightToViewport wordt soms vanaf andere plaatsen aangeroepen)
            return;

        var viewportHeight = getViewportDimensions().height;
        var shortenMap = 0;
        if (typeof GAds !== 'undefined' && GAds && GAds.MapLineInsertedSpace) {
            shortenMap = GAds.MapLineInsertedSpace;
        }

        this.FilterBar.style.height = (viewportHeight - findPos(this.FilterBar).top - 10) + 'px';
        var mapHeightTotal = (viewportHeight - findPos(this.MapContainer).top - 4);
        this.MapContainer.parentNode.style.height = mapHeightTotal + 'px';
        this.MapContainer.style.height = (mapHeightTotal - shortenMap) + 'px';

        if (typeof GoogleMap !== 'undefined' && GoogleMap)
            GoogleMap.checkResize();

        if (MiniMap)
            MiniMap.checkResize();
    },

    ClearDataTiles: function(alsoClearBewaardeObjecten) {
        this.DataTiles = {};
        this._lastHoverLatLng = null;
        this._lastHoverObjects.length = 0;
        this._lastMouseTileId = null;
        this.HideOpenDivs();
        //GLog.write('cleared tiles');
        if (this.ToonBewaardeObjectenOpKaart && alsoClearBewaardeObjecten) {
            for (var tileid_nozo in this.BewaardeObjectenTiles) {
                var bewObjtile = this.BewaardeObjectenTiles[tileid_nozo];
                if (bewObjtile != "skip")
                    GoogleMap.removeOverlay(bewObjtile);
            }
            this.BewaardeObjectenTiles = {};
        }
    },

    RefreshMap: function(zoekopdracht) {

        if (!ZOK.ZoekOpdracht)
            return;

        var splitZO = ZOK.ZoekOpdracht.split('$'); // bijv. recreatie/kaart/$/ede/$/zwembad

        if (zoekopdracht.indexOf(splitZO[1]) == 0) {
            ZOK.ZoekOpdracht = splitZO[0] + '$' + splitZO[1] + '$/' + zoekopdracht.replace(splitZO[1], '');
            ZOK.ClearDataTiles();
            Map.tileLayerOverlay.refresh();

        }
        ZOK.SetFilterTabs();
    },

    SetFilterTabs: function(zoekopdracht) {

        if (ZOK.ZoekOpdracht.indexOf('/verkocht/') != -1 || ZOK.ZoekOpdracht.indexOf('/verhuurd/') != -1) {
            $('#results').addClass('sold');
            if (getLangSetting() == "en") {
                $('#map-msg-cont-text').html("<span class='item-sold'>N.B.!</span> All " + Tooltip.ObjectsTerm.toLowerCase() + " on this map are <span class='item-sold-label-small' title='Sold'>SOLD</span> or <span class='item-rented-label-small' title='Rented'>RENTED</span>. ");
            } else {
                $('#map-msg-cont-text').html("<span class='item-sold'>Let op!</span> Alle " + Tooltip.ObjectsTerm.toLowerCase() + " op deze kaart zijn <span class='item-sold-label-small' title='Verkocht'>VERKOCHT</span> of <span class='item-rented-label-small' title='Verhuurd'>VERHUURD</span>. ");
            }
            $('#mapmsg').addClass('donthideonmove').show();
            Map.mapmessageDiv = document.getElementById('mapmsg');
            $('#kaarttabkoop').removeClass('on');
            $('#kaarttabverkocht').addClass('on');
            $('#kaarttabkoop a:first-child').attr("href", self.location.href.split('/#')[0] + '/#' + ZOK.ZoekOpdrachtHashActueelAanbod());
            $('#kaarttabverkocht a:first-child').attr("href", "javascript:void(0);");
        } else {
            $('#mapmsg').removeClass('donthideonmove').hide();
            $('#results').removeClass('sold');
            $('#kaarttabkoop').addClass('on');
            $('#kaarttabverkocht').removeClass('on');
            $('#kaarttabkoop a:first-child').attr("href", "javascript:void(0);");
            $('#kaarttabverkocht a:first-child').attr("href", self.location.href.split('/#')[0] + '/#' + ZOK.ZoekOpdrachtHashHistorischAanbod());
        }
    },

    ZoekOpdrachtZonderLocatie: function() {
        var splitZO = ZOK.ZoekOpdracht.split('/$'); // bijv. recreatie/kaart/$/ede/$/zwembad
        var zoekOpdrachtZonderLoc = splitZO[0] + '/heel-nederland' + splitZO[2]; //zoekopdracht zonder locatie, bijv. recreatie/kaart/heel-nederland/zwembad
        return zoekOpdrachtZonderLoc;
    },

    ZoekOpdrachtHash: function() {

        var splitZO = ZOK.ZoekOpdracht.split('/$'); // bijv. recreatie/kaart/$/ede/$/zwembad
        return splitZO[1] + splitZO[2];
    },

    ZoekOpdrachtHashHistorischAanbod: function() {
        var splitZO = ZOK.ZoekOpdracht.split('/$'); // bijv. recreatie/kaart/$/ede/$/zwembad
        if (splitZO[2].indexOf('/verkocht') == -1 && splitZO[2].indexOf('/verhuurd') == -1) {
            var historischPart = ('/' + ZOK.ZoekOpdracht).indexOf('/huur/') != -1 ? "/verhuurd" : "/verkocht";
            return splitZO[1] + historischPart + splitZO[2];
        }
        else {
            return splitZO[1] + splitZO[2];
        }
    },

    ZoekOpdrachtHashActueelAanbod: function() {
        var splitZO = ZOK.ZoekOpdracht.split('/$'); // bijv. recreatie/kaart/$/ede/$/zwembad
        if (splitZO[2].indexOf('/verkocht') != -1 || splitZO[2].indexOf('/verhuurd') != -1) {
            return splitZO[1] + splitZO[2].replace('\/verkocht', '').replace('\/verhuurd', '');
        }
        else {
            return splitZO[1] + splitZO[2];
        }
    },

    LoadDataTile: function(x, y, z, zoekOpdrachtZonderLocatie) {

        if (z != GoogleMap.getZoom()) { //alleen tile ophalen voor huidige zoomniveau
            return;
        }

        var tileID = x + "_" + y + "_" + z + "_" + zoekOpdrachtZonderLocatie;

        //we gaan nu ook de data ophalen
        //GLog.write(tileID);
        if (!this.DataTiles[tileID]) {
            //GLog.write('-> datatile ' + tileID + ' wordt geladen.');
            this.DataTiles[tileID] = "loading";
			$.getJSON('./maptiledata.ashx?z=' + z + '&x=' + x + '&y=' + y + "&zo=" + zoekOpdrachtZonderLocatie.split('+').join('%2B'), /* encoderen '+' naar '%2B' */
				{}, function(json) { ZOK.AddDataTile(json); });
        }
    },

    ToonBewaardObjectPreview: function(id, x, y) {

        var point = GoogleMap.fromLatLngToContainerPixel(new GLatLng(y, x));
        point.y -= 25;

        ZOK._lastHoverLatLng = GoogleMap.fromContainerPixelToLatLng(point);
        ZOK._lastHoverObjects.length = 0;
        ZOK._lastHoverObjects[0] = { "id": id };
        ZOK.MouseClick(true);
    },

    ToonBewaardeObjectenOpTile: function(tileid, forceReload) {

        if (tileid && ZOK.ToonBewaardeObjectenOpKaart && ZOK.BewaardeObjecten.length > 0) {

            //strip zoekopdracht uit tileid
            tileid_nozo = tileid.split('_').slice(0, 3).join('_');

            var currentOverlayTile = this.BewaardeObjectenTiles[tileid_nozo];

            if (currentOverlayTile && !forceReload) { //bewaardeobjecten voor deze tile al getoond
                //GLog.write('skip ' + tileid_nozo);
                return;
            }
            //GLog.write('doe ' + tileid_nozo);

            var dataTile = this.DataTiles[tileid];
            if (dataTile) {
                var boundingBox = dataTile.bb;

                var HtmlFragments = [];
                var baseStyleOuter = GoogleMap.getZoom() < 16 ? "position:absolute;margin-top:-32px;margin-left:-8px;" : "position:absolute;margin-top:-45px;margin-left:-8px;";
                var baseStyleInner = GoogleMap.getZoom() < 16 ? "position:absolute;cursor:pointer;margin-top:-29px;margin-left:-5px;" : "position:absolute;cursor:pointer;margin-top:-42px;margin-left:-5px;";

                var bbSpanLat = boundingBox.toSpan().lat();
                var bbSpanLng = boundingBox.toSpan().lng();
                var bbNELat = boundingBox.getNorthEast().lat();
                var bbSWLng = boundingBox.getSouthWest().lng();
                var latp, lngp, stylePostion;

                for (var i = 0; i < ZOK.BewaardeObjecten.length; i++) {

                    var bewaardObj = ZOK.BewaardeObjecten[i];
                    if (!bewaardObj.latlng) bewaardObj.latlng = new GLatLng(bewaardObj.y, bewaardObj.x);

                    if (boundingBox.containsLatLng(bewaardObj.latlng)) {
                        latp = 100 * (bbNELat - bewaardObj.y) / bbSpanLat;
                        lngp = 100 * (bewaardObj.x - bbSWLng) / bbSpanLng;
                        stylePostion = "left:" + lngp + "%;top:" + latp + "%;";

                        //zie http://groups.google.com/group/google-chart-api/web/chart-types-for-map-pins
                        HtmlFragments[HtmlFragments.length] = "<img src='http://chart.apis.google.com/chart?chst=d_map_spin&chld=0.5|0|EEEEEE|10|_|' style='" + baseStyleOuter + stylePostion + "' />";
                        HtmlFragments[HtmlFragments.length] = "<img onmouseover='ZOK.HideRedDotHoverDiv(); ZOK.TrackMouseMove=false;' onmouseout='ZOK.TrackMouseMove=true;' onclick='ZOK.ToonBewaardObjectPreview(" + bewaardObj.id + "," + bewaardObj.x + "," + bewaardObj.y + "); return false;' src='/img/kaart/marker/star-on-map.png' style='" + baseStyleInner + stylePostion + "' />";
                    }
                }

                if (HtmlFragments.length > 0) {

                    var html = HtmlFragments.join('');
                    //GLog.write('maak overlay met html ' + html);
                    var rectangle = new ClassRectangle(boundingBox, html);

                    //eventueel verwijderen bestaande tile
                    if (currentOverlayTile && currentOverlayTile != "skip") {
                        GoogleMap.removeOverlay(currentOverlayTile);
                    }

                    //toevoegen nieuwe tile
                    GoogleMap.addOverlay(rectangle);
                    rectangle.setZIndex("-1000000");
                    this.BewaardeObjectenTiles[tileid_nozo] = rectangle;
                } else {
                    this.BewaardeObjectenTiles[tileid_nozo] = "skip";
                }
            }
        }
    },

    ToonPreviewOnInit: function(tileid) {

        if (tileid && this.PreviewOnInitLatLng) {
            var dataTile = this.DataTiles[tileid];

            if (dataTile && dataTile.bb.containsLatLng(this.PreviewOnInitLatLng)) {

                var objecten = dataTile.objecten;

                this._lastHoverObjects.length = 0;

                for (var i = 0; i < objecten.length; i++) {

                    var obj = objecten[i];

                    if (obj.sub == 1 && this._lastHoverObjects.length == 0)
                        continue;

                    if (this._lastHoverObjects.length > 0) {
                        if (obj.sub == 1) {
                            this._lastHoverObjects[this._lastHoverObjects.length] = obj;
                            continue;
                        } else {
                            break;
                        }
                    }

                    if (obj.x < this.PreviewOnInitLatLng.lng()) //nog niet...
                        continue;

                    //GLog.write('PreviewOnInitLatLng testen voor ' + this.PreviewOnInitLatLng.toString() + ' op obj.x=' + obj.x + ' obj.y=' + obj.y);

                    if (obj.y == this.PreviewOnInitLatLng.lat()) {
                        this._lastHoverObjects[this._lastHoverObjects.length] = obj;
                        //GLog.write('PreviewOnInitLatLng gevonden');
                    }
                }

                if (this._lastHoverObjects.length > 0) {
                    this._lastMouseTileId = tileid;
                    this._lastHoverLatLng = this.PreviewOnInitLatLng;
                    this.MouseClick();
                }

                this.PreviewOnInitLatLng = null; //weer leegmaken
            }
        }
    },

    AddDataTile: function(data) {
        //GLog.write('<- datatile ' + data.tileid + ' is geladen.');

        var tileId = data.tileid.split('%2B').join('+'); //decoderen '%2B' naar '+'

        if (this.DataTiles[tileId] != 'loading')
            return;

        var bb = new GLatLngBounds(new GLatLng(data.lat, data.lng), new GLatLng(data.lat + data.spanlat, data.lng + data.spanlng));
        this.DataTiles[tileId] = { "bb": bb, "objecten": data.points };

        this.ToonBewaardeObjectenOpTile(tileId);

        this.ToonPreviewOnInit(tileId);

        //GLog.write('<- datatile ' + data.tileid + ' is geladen.');
    },

    _lastMouseTileId: null,
    _lastHoverLatLng: null,
    _lastHoverObjects: [],
    _lastPreviewLatLng: null,
    _lastPreviewObjects: [],
    _lastPreviewTileId: null,

    ItemsOptionsHtml: function(obj) {

        //check of dit object in de bewaarde objecten staat
        var isBewaard = false;
        for (i = 0; i < ZOK.BewaardeObjecten.length; i++) {
            if (ZOK.BewaardeObjecten[i].id == obj.id) {
                isBewaard = true;
                break;
            }
        }

        //kijken of we terugkomen van een inlogscherm na een bewaar-actie
        if (ZOK.clientActie == 'bewaarobject' && ZOK.clientActieId == obj.id) {
            isBewaard = true;
            $.ajax({
                cache: false,
                url: ZOK.AppPathUrl + "clientactie/bewaarobject/" + obj.id,
                success: function(data) { $('#login_bewaard').show(); $('#login_bewaard_aantal').html(data); ZOK.VoegBewaardObjectToe(obj.id, obj.x, obj.y); } //update aantal bewaarde woningen
            });
            ZOK.clientActie = null;
            ZOK.clientActieId = null;
        }

        var html = "<div class='tooltip-options'><ul>";

        if (!obj.pnaam) { //objecttypes kunnen niet bewaard worden
            if (typeof (NoProfile) == 'undefined' || !NoProfile) { // In de NoProfile stand kan niet bewaard worden
                if (isBewaard) {
                    html += "<li><a href='" + ZOK.MyNieuwAanbodLink + "' class='tt-option-save saved'>" + FTranslate.Get('bewaar') + "</a></li>";
                } else {
					var optionSaveId = "pg-option-save" + obj.id;
					var onclickScript = "bewaarVolgEvent('Bewaar');return object_clientactie('bewaar', '" + ZOK.AppPathUrl + "clientactie/bewaarobject/" + obj.id + "', '" + ZOK.MyNieuwAanbodLink + "', '#" + optionSaveId + "', null, function() { ZOK.VoegBewaardObjectToe('" + obj.id + "'," + obj.x + "," + obj.y + "); })";

					//indien nog niet ingelogd, dan extra popup lightbox script
					if (!Popup.popupLoginSuccessful) {
						var adresNoQuotes = obj.adr.split("'").join("");
						var mysite = self.location.href.indexOf("fundainbusiness") > 0 ? "Mijn funda in business" : "Mijn funda";
						var actionTexts = "{\\'actie-verwijzing-login\\':\\'Log in om &quot;" + adresNoQuotes + "&quot; te bewaren.\\',\\'actie-verwijzing-aanmelden\\':\\'Maak een " + mysite + " account aan om &quot;" + adresNoQuotes + "&quot; te bewaren.\\',\\'actie-verwijzing-bevestiging\\':\\'&quot;" + adresNoQuotes + "&quot; is bewaard.\\',\\'volgende-stap-bevestiging\\':\\'Ga terug naar zoek op kaart.\\'}";
						onclickScript = "Popup.load.call(this, function() {" + onclickScript + "; return false; }, '" + actionTexts + "');";
					}
					html += "<li><a href='javascript:void(0)' class='tt-option-save' id='" + optionSaveId + "'" + (Popup.popupLoginSuccessful ? "" : " rel='popup-content-login'") + " onclick=\"" + onclickScript + "\">" + FTranslate.Get('bewaar') + "</a></li>";
				}
            }
        }

        //check op streetview in de buurt
        if (Map.indStreetView && globalStreetViewClient) {
            var objectLatlng = new GLatLng(obj.y, obj.x);
            globalStreetViewClient.getNearestPanorama(objectLatlng, function(panoData) { ZOK.CheckStreetViewLink(panoData, objectLatlng, '#tt-option-sv' + obj.id, obj); });
        }

        if (GoogleMap.getZoom() < 17)
            html += "<li><a href='javascript:void(0)' onclick='ZOK.ZoomToPoint(" + obj.y + "," + obj.x + "); return false;' class='tt-option-zoom'>Zoom in</a></li>";

        html += "<li><a href='javascript:void(0)' class='tt-option-sv' id='tt-option-sv" + obj.id + "' style='display:none'>Street View</a></li>";
        html += "</ul></div>";
        return html;
    },

    VoegBewaardObjectToe: function(objectId, x, y) {
        ZOK.BewaardeObjecten.push({ "id": objectId, "x": x, "y": y });
        ZOK.ToonBewaardeObjectenOpTile(this._lastPreviewTileId, true);
    },

    ZoomToPoint: function(lat, lng) {
        var zoom = GoogleMap.getCurrentMapType() == G_PHYSICAL_MAP ? 15 : 17;
        ZOK.PreviewOnInitLatLng = new GLatLng(lat, lng);
        GoogleMap.setCenter(new GLatLng(lat, lng), zoom); //recenter en zoom map in op dit punt
    },

    CheckStreetViewLink: function(panoData, objectLatlng, optionSvSelector, obj) {
        //GLog.write(panoData.code + " lat="  + lat + ", lng= " + lng);
        if (panoData.code == 200) {
            //GLog.write("object latlng=" + objectLatlng.toString() + ", pano latlng="  + panoData.location.latlng.toString() + ', pitch=' + panoData.location.pov.pitch);
            panoData.location.pov.yaw = computeAngle(objectLatlng, panoData.location.latlng);
            //panoData.location.pov.pitch = -10;

            $(optionSvSelector).show();
            $(optionSvSelector).click(function() { var mysvp = new StreetViewPanorama(GoogleMap); mysvp.showPanoData(panoData, objectLatlng, obj); return false; });
        }
    },

    OpenLastPreview: function() {
        if (this._lastPreviewLatLng && this._lastPreviewObjects.length > 0) {
            this._lastHoverLatLng = this._lastPreviewLatLng;
            this._lastHoverObjects = this._lastPreviewObjects.slice();
            this.MouseClick();
        }
    },

    _previewDiv: null,
    MouseClick: function(forceDataOphalen) {

        if (IsStreetViewActive)
            return;

        if (this._lastHoverLatLng && this._lastHoverObjects.length > 0) {

            //save
            this._lastPreviewLatLng = this._lastHoverLatLng;
            this._lastPreviewTileId = this._lastMouseTileId;

            if (forceDataOphalen || ZOK.DataOphalenBijKlik) {
                var hoverIds = [];
                for (var i = 0; i < this._lastHoverObjects.length; i++) {
                    hoverIds[hoverIds.length] = this._lastHoverObjects[i].id;
                }

                //via ajax ophalen gegevens van objecten (synchroon)
                $.ajax({
                    async: false,
                    url: fundaUtil.Ajax.getVirtualDir() + "/clientactie/getobjectinfo/?ids=" + hoverIds.join(',') + "&referrer=" + escape(self.location.href),
                    dataType: "json",
                    success: function(data) {
                        ZOK._lastPreviewObjects = data;
                    }
                });
            } else {
                //ophalen niet nodig: data is al aanwezig
                this._lastPreviewObjects = this._lastHoverObjects.slice();
            }

            if (this._previewDiv == null) {
                // Create hover div
                this._previewDiv = document.createElement('div');
                this._previewDiv.id = 'zokPreview';
                this._previewDiv.className = 'tooltip tooltip-s';
                //this._hoverDiv.onmouseover = function() { this.style.display = 'none'; };
                document.getElementById('MapContainer').appendChild(this._previewDiv);

                Tooltip.TooltipCloseScript = function() { return "ZOK.HideRedDotPreviewDiv();" };
                Tooltip.ItemsOptionsHtml = this.ItemsOptionsHtml;
            }

            if (GoogleMap.getZoom() >= this.ToonGroteIconsVanafLevel) //bij grote icoontjes geen class marker-hover-s gebruiken
                removeClass(this._previewDiv, 'tooltip-s');
            else
                addClass(this._previewDiv, 'tooltip-s');

            this.HideRedDotHoverDiv();

            var pixel = GoogleMap.fromLatLngToContainerPixel(this._lastHoverLatLng);
            var xMaxMap = GoogleMap.fromLatLngToContainerPixel(GoogleMap.getBounds().getNorthEast()).x;

            this._lastPreviewObjects.multiple = this._lastPreviewObjects.length > 1 ? "tooltip-multiple" : "";

            this._previewDiv.innerHTML = Tooltip.ReplaceTemplateVars(Tooltip.PreviewOuterTemplate, this._lastPreviewObjects);
            this._previewDiv.style.left = "-999px"; //tijdelijk buiten beeld zetten, zodat niet eerst even op oude plek zichtbaar
            this._previewDiv.style.display = 'block';

            var direction = (pixel.x + this.minimalPeviewDivWidth) < xMaxMap ? 'right' : 'left';

            if (direction == 'left')
                addClass(this._previewDiv, 'tooltip-left');
            else
                removeClass(this._previewDiv, 'tooltip-left');

            //zetten positie
            var child = getChildElements(this._previewDiv)[0];
            this._previewDiv.style.top = (pixel.y - Math.floor(child.clientHeight / 2)) + 'px';
            if (direction == 'right')
                this._previewDiv.style.left = pixel.x + "px";
            else
                this._previewDiv.style.left = (pixel.x - this._previewDiv.clientWidth) + "px";

            //bewaren cookie
            var gcenter = GoogleMap.getCenter();
            var savedMapState = escape('zokzo=' + this.ZoekOpdracht +
				';zokx=' + gcenter.lng() +
				';zoky=' + gcenter.lat() +
				';zokz=' + GoogleMap.getZoom() +
				';zokobjx=' + this._lastHoverLatLng.lng() +
				';zokobjy=' + this._lastHoverLatLng.lat());
            createCookie('zok_state', savedMapState);

            //Tooltip.SentToBackISeaq();
        } else {
            // er is naast een object geklikt: sluit de eventueel openstaande preview div
            ZOK.HideRedDotPreviewDiv();
        }
    },

    _pointerBBzoom: null,
    _pointerBBSWLat: null,
    _pointerBBSWlng: null,
    GetPointerBB: function(point) {
        var gmapZoom = GoogleMap.getZoom();
        if (this._pointerBBzoom != gmapZoom || !this._pointerBBSWlat || !this._pointerBBSWlng) {
            var pixpoint = GoogleMap.fromLatLngToContainerPixel(point);

            var pointSW;
            if (gmapZoom < this.ToonGroteIconsVanafLevel)
                pointSW = GoogleMap.fromContainerPixelToLatLng(new GPoint(pixpoint.x - 6, pixpoint.y + 6))
            else
                pointSW = GoogleMap.fromContainerPixelToLatLng(new GPoint(pixpoint.x - 8, pixpoint.y + 19));

            this._pointerBBSWlng = point.lng() - pointSW.lng();
            this._pointerBBSWlat = point.lat() - pointSW.lat();

            this._pointerBBzoom = gmapZoom;
        }
        return new GLatLngBounds(
			new GLatLng(point.lat() - this._pointerBBSWlat, point.lng() - this._pointerBBSWlng),
			new GLatLng(point.lat() + ((gmapZoom < this.ToonGroteIconsVanafLevel) ? this._pointerBBSWlat : 0), point.lng() + this._pointerBBSWlng));
    },

    MouseMove: function(point) {

        if (IsStreetViewActive)
            return;

        //GLog.write(point.toString());

        //check intersects
        var pointBB = this.GetPointerBB(point);

        //check of mousepointer nog in huidige tile is
        if (this._lastMouseTileId != null && this.DataTiles[this._lastMouseTileId]) {
            var tile = this.DataTiles[this._lastMouseTileId];
            if (tile != 'loading' && tile.bb.containsLatLng(point)) {
                if (this.CheckRedDotHover(this._lastMouseTileId, pointBB)) {
                    return;
                }
            }
        }

        //GLog.write('point = ' + point.toString() + '  pointBB = ' + pointBB.toString());
        for (var tileId in this.DataTiles) {
            //GLog.write('tile ' + tileId);
            var tile = this.DataTiles[tileId];

            if (tile != 'loading' && tile.bb.intersects(pointBB)) {

                //if (this._lastMouseTileId != tileId)
                //	GLog.write('muis overlapt met tile id ' + tileId);

                this._lastMouseTileId = tileId;

                if (this.CheckRedDotHover(tileId, pointBB)) {
                    return;
                }
            }
        }

        //not found
        if (this._lastHoverLatLng) {
            this.ClearLastHoverInfo();
            this.HideRedDotHoverDiv();
        }
    },

    //check of point in de buurt ligt van een woning
    CheckRedDotHover: function(tileId, pointBB) {

        var objecten = this.DataTiles[tileId].objecten;
        var found = false;

        var pointBBSW = pointBB.getSouthWest();
        var pointBBNE = pointBB.getNorthEast();

        //for (var id in objecten) {
        for (var i = 0; i < objecten.length; i++) {
            var obj = objecten[i];

            if (!found && obj.sub == 1) //skip subpoints
                continue;

            //check op woningen op dezelfde plek
            if (found) {
                if (obj.sub == 1) { //toevoegen van subpoints
                    this._lastHoverObjects[this._lastHoverObjects.length] = obj;
                    continue;
                }
                else {
                    break;
                }
            }

            if (obj.x < pointBBSW.lng()) //nog niet...
                continue;

            if (obj.x > pointBBNE.lng()) //al voorbij geschoten...
                break;

            if (obj.y >= pointBBSW.lat() && obj.y <= pointBBNE.lat()) {
                var objCenter = new GLatLng(obj.y, obj.x);

                Map.GetMapDiv().style.cursor = "pointer";
                if (!this._lastHoverLatLng || !this._lastHoverLatLng.equals(objCenter)) {

                    this._lastHoverLatLng = objCenter;
                    this._lastHoverObjects.length = 0;
                    this._lastHoverObjects[this._lastHoverObjects.length] = obj;
                    found = true;
                }
                else {
                    return true; //er bestaat al een hover voor dit punt
                }
            }
        }

        //GLog.write('found=' + found);

        if (found) {
            this.ShowRedDotHoverDiv();
        }

        return found;
    },

    _hoverDiv: null,
    ShowRedDotHoverDiv: function() {
        //TODO: left en right uitlijning, gebruik hiervoor fromLatLngToContainerPixel waarmee je de x van de muis en de right-x van de kaart kun bepalen
        if (this._hoverDiv == null) {
            // Create hover div
            this._hoverDiv = document.createElement('div');
            this._hoverDiv.id = 'zokHover';
            this._hoverDiv.className = 'marker-hover marker-hover-s';
            this._hoverDiv.onmouseover = function() { this.style.display = 'none'; };
            document.getElementById('MapContainer').appendChild(this._hoverDiv);
        }

        if (GoogleMap.getZoom() >= this.ToonGroteIconsVanafLevel) //bij grote icoontjes geen class marker-hover-s gebruiken
            removeClass(this._hoverDiv, 'marker-hover-s');
        else
            addClass(this._hoverDiv, 'marker-hover-s');

        var pixel = GoogleMap.fromLatLngToContainerPixel(this._lastHoverLatLng);
        var html = this._lastHoverObjects.length > 1 ? Tooltip.ReplaceTemplateVars(Tooltip.HoverTemplateMultiple, this._lastHoverObjects) : Tooltip.ReplaceTemplateVars(Tooltip.HoverTemplate, this._lastHoverObjects[0]);

        //bepalen van pixel positie rechterkant kaart
        var xMaxMap = GoogleMap.fromLatLngToContainerPixel(GoogleMap.getBounds().getNorthEast()).x;

        this._hoverDiv.innerHTML = html;
        this._hoverDiv.style.left = "-999px"; //tijdelijk buiten beeld zetten, zodat niet eerst even op oude plek zichtbaar
        this._hoverDiv.style.display = 'block';

        var direction = (pixel.x + this.minimalPeviewDivWidth) < xMaxMap ? 'right' : 'left';

        //GLog.write(this._hoverDiv.clientWidth);

        if (direction == 'left')
            addClass(this._hoverDiv, 'marker-hover-left');
        else
            removeClass(this._hoverDiv, 'marker-hover-left');

        this._hoverDiv.style.left = direction == 'right' ? pixel.x + 'px' : (pixel.x - this._hoverDiv.clientWidth) + 'px';
        this._hoverDiv.style.top = pixel.y + 'px';
    },

    ClearLastHoverInfo: function() {
        //GLog.write('ClearLastHoverInfo');
        Map.GetMapDiv().style.cursor = "url(http://maps.google.com/mapfiles/openhand.cur), default";
        this._lastHoverLatLng = null;
        this._lastHoverObjects.length = 0;
    },

    HideRedDotHoverDiv: function() {
        if (this._hoverDiv) {
            this._hoverDiv.style.display = 'none';
        }
    },

    HideRedDotPreviewDiv: function(keepCookie) {
        if (!keepCookie)
            eraseCookie('zok_state'); //verwijder laatste zoekopdracht cookie
        if (this._previewDiv) {
            this._previewDiv.style.display = 'none';
            //Tooltip.BringToFrontISeaq();
        }
    },

    HideOpenDivs: function(keepCookie, forceHide) {
        this.HideRedDotHoverDiv();
        this.HideRedDotPreviewDiv(keepCookie);
        if (Map.mapmessageDiv) { //verstoppen melding bovenaan kaart
            if (!hasClass(Map.mapmessageDiv, 'donthideonmove') || forceHide) {
                Map.mapmessageDiv.style.display = 'none';
            Map.mapmessageDiv = null;
        }
    }
    }
};
