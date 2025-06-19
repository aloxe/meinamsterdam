var userver_swf_load_3557373 = function (width, height, unique_id, alt_content, pre_html, post_html, flash_url, flash_params, swfobject_url) {

    var div_id = "userver_div_" + unique_id;

    

    document.writeln(pre_html + "<div style=\"padding:0px; width:" + width + "px; height:" + height + "px; overflow:hidden; display:inline-block;\"><div style=\"padding:0px; visibility:hidden;\" id=\"" + div_id + "\">" + alt_content+ "</div> </div>" + post_html);

    var done = false;
    var embed_swf = function() {
    if (done) { return; }
    var params = {};
    params.loop = "true";
    params.quality = "high";
    params.wmode = "opaque";
    params.allowScriptAccess = "always";
    var attributes = {};
    userver_swfobject.switchOffAutoHideShow();
    userver_swfobject.embedSWF(flash_url, div_id, width, height, "9.0.0", false, flash_params, params, attributes);
    if (document.getElementById(div_id)) {
       document.getElementById(div_id).style.visibility = 'visible';
    }
    done = true;
    }


    var js = document.createElement('script');
    var uswf_loaded = false;
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', swfobject_url);
    document.getElementsByTagName('head')[0].appendChild(js);
    js.onreadystatechange = function () { if ((js.readyState == 'loaded' || js.readyState == 'complete') && (!uswf_loaded) ) {  embed_swf(); uswf_loaded = true} };
    js.onload = function () { if (!uswf_loaded) {embed_swf(); uswf_loaded = true}};

};

userver_swf_load_3557373(300, 250, 3557373, "<a href=\"http:\/\/ads.creative-serving.com\/click?ic=CiQ4ZmRlY2YyMy01OGE0LTQ4NGEtYmIyOS04MDJmMTZkZDgwZTgSCmNkbmwuZnVuZGEYzIosIJnkeiiTth4yBzMwMHgyNTBCAEoObmxfcmVhbF9lc3RhdGVdAAAAAGAAaAB6Ak5MgAG2gB6KAQIzNJABAagBALABAbgBA8UBAAAAAM0BAAAAANUBAAAAAN0BAAAAAPABBfgBBIICCGZ1bmRhLm5sjQIAAAAAlQIAAAAAsgICZW64AgDCAgQwLjY4yAIB&amp;ind=1&amp;r=\" target=\"_blank\"><img style=\"border: 0;\" width=\"300\" height=\"250\" src=\"http:\/\/static2.creative-serving.net\/300x250_nl.jpg\" alt=\"\"\/><\/a>", "", "<script type=\"text\/javascript\">function DM_onSegsAvailable(segs, csid) {var segAS = \"\"; if (csid == \"j09849\") { var scripts = document.getElementsByTagName(\"script\"); for (var i = 0; i < segs.length; i++) segAS += (segs[i] + \",\"); } var img = document.createElement(\"img\"); img.style.position=\"absolute\"; img.style.visibility=\"hidden\"; img.style.display=\"none\"; img.src=\"http:\/\/ads.creative-serving.com\/audsci?\" + segAS; scripts[scripts.length -1].parentNode.appendChild(img);}<\/script><script src=\"http:\/\/js.revsci.net\/gateway\/gw.js?csid=J09849\"><\/script><script type=\"text\/javascript\" src=\"http:\/\/adc2.adcentriconline.com\/adcentric\/direct_count\/1849\/1\/55334;13440.gif\"><\/script>", "http:\/\/static2.creative-serving.net\/AirTransat_Mediascale_Jan-Feb11_CPC_2011-01-18_300x250_europe_airtransat_price_nl_300x250.swf", {
   "clickTag" : "http%3A%2F%2Fads%2Ecreative%2Dserving%2Ecom%2Fclick%3Fic%3DCiQ4ZmRlY2YyMy01OGE0LTQ4NGEtYmIyOS04MDJmMTZkZDgwZTgSCmNkbmwuZnVuZGEYzIosIJnkeiiTth4yBzMwMHgyNTBCAEoObmxfcmVhbF9lc3RhdGVdAAAAAGAAaAB6Ak5MgAG2gB6KAQIzNJABAagBALABAbgBA8UBAAAAAM0BAAAAANUBAAAAAN0BAAAAAPABBfgBBIICCGZ1bmRhLm5sjQIAAAAAlQIAAAAAsgICZW64AgDCAgQwLjY4yAIB%26ind%3D1%26r%3D"
}
, "http:\/\/static2.creative-serving.net\/u-swfobject.js");
