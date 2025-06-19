/// <reference path="jquery-vsdoc.js" />
//fundaUtil.Ajax 2008

if (typeof fundaUtil == "undefined" || !fundaUtil)
    var fundaUtil = {};

fundaUtil.Ajax = (function() {

    //private vars and functions

    function _updateVerbergKaartLink() {

        var verberg_grotekaartLink = document.getElementById('verberg_grotekaart');
        if (verberg_grotekaartLink)
            verberg_grotekaartLink.href = top.location.href.replace('\/kaart\/#', '');
    }

    return {

        init: function(updatePanelID) {

            var initialHash = fundaUtil.Ajax.getAjaxHash(location.href);

            //check de url op qs parameters (bijv "/koop/kaart/#/amsterdam/?kaart=groot&lat=52.26&lng=6.24&refid=382772")
            var paramIx = initialHash.indexOf('?');
            if (paramIx > 0) {
                var params = initialHash.substr(paramIx + 1).split("&");

                for (var i = 0; i < params.length; i++) {
                    if (params[i].indexOf('lat=') == 0)
                        Map.initLat = params[i].split('=')[1];
                    if (params[i].indexOf('lng=') == 0)
                        Map.initLng = params[i].split('=')[1];
                    if (params[i].indexOf('refid=') == 0)
                        Map.refid = params[i].split('=')[1];
                    if (params[i].indexOf('clientactie=') == 0)
                        ZOK.clientActie = params[i].split('=')[1];
                    if (params[i].indexOf('id=') == 0)
                        ZOK.clientActieId = params[i].split('=')[1];
                    //hier eventueel nog andere qs parameters afhandelen
                }
            }

            YAHOO.util.History.register(initialHash, fundaUtil.Ajax.pageStateChangeHandler);
            YAHOO.util.History.initialize('yui-history-field', 'yui-history-iframe');

            //check of initialHash wel overeenkomt met de getoonde zoekopdracht (te vinden in hidden inputpox initZoekOpdracht)
            var huidigeZO_hidden = document.getElementById('initZoekOpdracht');
            var initialHashNoQS = initialHash.split('?')[0];
            if (huidigeZO_hidden && huidigeZO_hidden.value.match(initialHashNoQS.split('+').join('\\+') + "$") != initialHashNoQS) {
                fundaUtil.Ajax.pageStateChangeHandler(initialHash);
            }
        },

        getAjaxHash: function(href) {

            var i = href.indexOf("#/");
            return i >= 0 ? href.substr(i + 1) : '/';
        },

        onBeginRequest: function(s) {

            //streetview sluiten bij klikken op filter of isqeaq
            if (typeof svp !== 'undefined' && svp && IsStreetViewActive)
                svp.closeStreetView();

            eraseCookie('zok_state'); //oude state van kaart weggooien

            //zet isLoading stylesheet 
            addClass(document.body, 'is-loading');

            var zoekNaarPlaatsKnop = document.getElementById('map_search_submit');
            var zoekNaarPlaatsBox = document.getElementById('TextBoxPlaatsOfPostcode');
            if (zoekNaarPlaatsBox && zoekNaarPlaatsBox.value != 'zoek naar plaats') {
                addClass(zoekNaarPlaatsKnop, 'is-loading');
                zoekNaarPlaatsKnop.src = '/img/misc/loading-ind.gif';
            }
        },

        getVirtualDir: function() {
            var virtualDir = '';
            if (self.location.href.toLowerCase().indexOf('/funda/') > 0) virtualDir = '/funda';
            else if (self.location.href.toLowerCase().indexOf('/fundainbusiness/') > 0) virtualDir = '/fundainbusiness';
            else if (self.location.href.toLowerCase().indexOf('/sozok/') > 0) virtualDir = '/sozok'; //voor next.funda.nl/sozok
            return virtualDir;
        },

        onEndRequest: function() {

            //zet isLoading weer uit 
            removeClass(document.body, 'is-loading');

            var zoekNaarPlaatsKnop = document.getElementById('map_search_submit');
            removeClass(zoekNaarPlaatsKnop, 'is-loading');
            if (zoekNaarPlaatsKnop != null) {
                zoekNaarPlaatsKnop.src = '/img/but/but-zoeken-icn.gif';
            }

            //reset iSEAQ
            iSEAQ = new iSEAQ_class();

            //kaart eventueel opnieuw positioneren
            ZOK.SetHeightToViewport();
        },

        pageStateChangeHandler: function(state) {

            //strip qs
            state = state.split('?')[0];

            //bepaal baseUrl
            var baseUrl = location.href.replace(/http:\/\/[^\/]+(\/fundainbusiness|\/funda|\/sozok)?/i, ''); //stip domain + webapp
            var i = baseUrl.indexOf('/kaart');
            baseUrl = i >= 0 ? baseUrl.substring(0, i) + '/kaart' : baseUrl;

            //json call
            fundaUtil.Ajax.onBeginRequest();
            $.ajax({
                url: fundaUtil.Ajax.getVirtualDir() + "/clientactie/kaartfilterhtml/?friendlyurl=" + baseUrl + state,
                dataType: "json",
                complete: function() { fundaUtil.Ajax.onEndRequest(); },
                success: function(data) {
                    if (data.iSEAQHtml) $("#iseaq").html(data.iSEAQHtml);
                    if (data.filterHtml) $("#filter").html(data.filterHtml);
                    if (data.resetMapFunction) eval(data.resetMapFunction);
                    if (data.actueelText) {
                        var tabkoop = $('#kaarttabkoop').find('a');
                        if (tabkoop != null) {
                            tabkoop.text(data.actueelText);
                        }
                    }

                    if (data.historieText) {
                        var tabverkocht = $('#kaarttabverkocht').find('a');
                        if (tabverkocht != null) {
                            tabverkocht.text(data.historieText);
                        }
                    }
                }
            });

            ZOK.RefreshMap(state);
        },

        zoekPlaats: function(plaatsnaam) {

            fundaUtil.Ajax.onBeginRequest();
            $.ajax({
                url: fundaUtil.Ajax.getVirtualDir() + "/clientactie/kaartzoekplaats/?plaats=" + escape(plaatsnaam) + "&friendlyurl=" + escape(self.location.href),
                dataType: "json",
                complete: function() { fundaUtil.Ajax.onEndRequest(); },
                success: function(data) {
                    if (data.iSEAQHtml) $("#iseaq").html(data.iSEAQHtml);
                    if (data.filterHtml) $("#filter").html(data.filterHtml);
                    if (data.resetMapFunction) eval(data.resetMapFunction);
                }
            });
        },

        // Deze functie wordt uitgevoerd bij het aanpassen van het prijs-filter
        klikPrijsFilter: function(prijsUrlTemplate) {

            prijsUrlTemplate = fundaUtil.Ajax.getAjaxHash(prijsUrlTemplate);

            var prijsVan = document.getElementById('PrijsVan').value;
            var prijsTot = document.getElementById('PrijsTot').value;

            if (prijsVan != '0' && prijsTot == '')
                prijsUrlTemplate = prijsUrlTemplate.replace(/\/prijsrange/, '/' + prijsVan + '+');
            else if (prijsTot != '')
                prijsUrlTemplate = prijsUrlTemplate.replace(/\/prijsrange/, '/' + prijsVan + '-' + prijsTot);
            else
                prijsUrlTemplate = prijsUrlTemplate.replace(/\/prijsrange/, '');

            YAHOO.util.History.navigate(prijsUrlTemplate);
        },

        // Deze functie wordt uitgevoerd bij het aanpassen van het FiB oppervlakte-filter
        klikOppervlakteFilter: function(oppUrlTemplate) {

            oppUrlTemplate = fundaUtil.Ajax.getAjaxHash(oppUrlTemplate);

            var oppVan = document.getElementById('OppervlakVan').value;
            var oppTot = document.getElementById('OppervlakTot').value;

            if (oppVan != '0' && oppTot == '')
                oppUrlTemplate = oppUrlTemplate.replace(/\/opprange/, '/' + oppVan + '+opp');
            else if (oppTot != '')
                oppUrlTemplate = oppUrlTemplate.replace(/\/opprange/, '/' + oppVan + '-' + oppTot + '-opp');
            else
                oppUrlTemplate = oppUrlTemplate.replace(/\/opprange/, '');

            YAHOO.util.History.navigate(oppUrlTemplate);
        },

        selectHuurConditie: function(huurconditieUrlTemplate) {

            huurconditieUrlTemplate = fundaUtil.Ajax.getAjaxHash(huurconditieUrlTemplate);

            //huurconditieUrlTemplate bevat "prijsperjaar" op de plek van de huurconditie
            var huurConditie = document.getElementById('HuurConditie').value;

            if (huurConditie == '1')
                huurconditieUrlTemplate = huurconditieUrlTemplate.replace(/\/perjaar/, '/permaand');
            else if (huurConditie == '2')
                huurconditieUrlTemplate = huurconditieUrlTemplate.replace(/\/perjaar/, '/perm2perjaar');

            YAHOO.util.History.navigate(huurconditieUrlTemplate);
        }
    };
})();
