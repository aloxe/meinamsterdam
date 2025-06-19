function ClassRectangle(c,a,b){this.className=b?b:"markerdiv";this.bounds_=c;this.Html=a;
this.prototype=new GOverlay()}ClassRectangle.prototype.initialize=function(a){var b=document.createElement("div");
b.style.zIndex="-100000000";b.style.position="absolute";b.className=this.className;
a.getPane(G_MAP_MARKER_PANE).appendChild(b);a.getPane(G_MAP_MARKER_PANE).style.cursor="";
this.map_=a;this.div_=b;b.innerHTML=this.Html};ClassRectangle.prototype.remove=function(){if(this.div_){if(this.div_.parentNode){this.div_.parentNode.removeChild(this.div_)
}}};ClassRectangle.prototype.copy=function(){return new ClassRectangle(this.bounds_,this.Html,this.className)
};ClassRectangle.prototype.redraw=function(c){if(!c){return}var b=this.map_.fromLatLngToDivPixel(this.bounds_.getSouthWest());
var a=this.map_.fromLatLngToDivPixel(this.bounds_.getNorthEast());this.div_.style.width=Math.abs(a.x-b.x)+"px";
this.div_.style.height=Math.abs(a.y-b.y)+"px";this.div_.style.left=(Math.min(a.x,b.x))+"px";
this.div_.style.top=(Math.min(a.y,b.y))+"px"};ClassRectangle.prototype.hide=function(){this.div_.style.display="none"
};ClassRectangle.prototype.show=function(){this.div_.style.display="block"};ClassRectangle.prototype.getZIndex=function(){return this.div_.style.zIndex
};ClassRectangle.prototype.setZIndex=function(a){this.div_.style.zIndex=a};var GoogleMap;var Map={DebugMode:false,_initialized:false,ResetMapLargeTimeout:null,mapmessageDiv:null,mapHolder:null,mapType:null,tileLayerOverlay:null,indStreetView:false,InTerreinMode:false,DisableZoom:false,initLat:null,initLng:null,refid:null,markerManager:null,userPhotos:false,InitMapSmall:function(c,a,b){this._initialized=true;
this.mapType="small";document.getElementById("MapContainer").style.backgroundImage="none";
this.mapHolder=document.getElementById("map");GoogleMap=new GMap2(this.mapHolder);
GoogleMap.setCenter(new GLatLng(c,a));GoogleMap.setMapType(G_NORMAL_MAP);if(!this.DisableZoom){GoogleMap.addControl(new GSmallZoomControl3D())
}if(Tooltip){Tooltip.Initialize(b)}this.mapHolder.style.visibility="visible"},CreateMarker:function(a,c){var b=new GIcon();
b.sprite={};b.sprite.image="http://www.funda.nl/img/kaart/marker/properties.gif";
b.sprite.top=(c=="A"?8:9)*50;b.iconSize=new GSize(20,21);b.iconAnchor=new GPoint(10,21);
return new GMarker(a,b)},rp_afstand:null,rp_tijd:null,rp_dir_data:null,rp_query:null,InitMapRouteplanner:function(g,i,h,a){this._initialized=true;
document.getElementById("MapContainer").style.backgroundImage="none";var d=document.getElementById("map");
GoogleMap=new GMap2(d);GoogleMap.setMapType(G_NORMAL_MAP);GoogleMap.setCenter(new GLatLng(g,i),10);
Map.InitControls(false);Map.rp_afstand=document.getElementById("rp_afstand");Map.rp_tijd=document.getElementById("rp_tijd");
Map.rp_dir_data=document.getElementById("rp-dir-data");Map.rp_query=h;var c=document.getElementById(a);
var f=new GDirections();var e=getLangSetting();GEvent.addListener(f,"load",function(){if(f.getStatus().code==200){Map.rp_afstand.innerHTML=f.getDistance().html;
Map.rp_tijd.innerHTML=f.getDuration().html;var t=GoogleMap.getBoundsZoomLevel(f.getBounds());
GoogleMap.setCenter(f.getBounds().getCenter(),t);var k="http://maps.google.nl/maps?f=q&hl="+e+"&q="+encodeURIComponent(Map.rp_query)+"&ie=UTF8&z="+t+"&layer=c&pw=2";
$(".rp-print>a").click(function(){window.open(k,"_blank","menubar=1,resizable=1,scrollbars=1,width=780,height=700")
});var A=f.getPolyline();GoogleMap.addOverlay(A);var C=f.getRoute(0);var j=/(<[^>]+>)/g;
var v=/(sla\s+rechtsaf)|(houd\s+rechts\s+aan)|(1e\s+afslag\s+rechts)/i;var o=/flauwe\s+bocht\s+naar\s+rechts/i;
var x=/(sla\s+linksaf)|(houd\s+links\s+aan)|(1e\s+afslag\s+links)/i;var r=/flauwe\s+bocht\s+naar\s+links/i;
if(e=="en"){v=/(turn\s+right)|(keep\s+right)|(1st\s+right)/i;o=/slight\s+right/i;
x=/(turn\s+left)|(keep\s+left)|(1st\s+left)/i;r=/slight\s+left/i}var n='<table class="rp-dir-data">\n';
for(var w=0;w<C.getNumSteps();w++){var q=C.getStep(w);var l=((w%2)==0)?"odd":"even";
if(w==0){l+=" frst"}if(w==C.getNumSteps()-1){l+=" last"}var u="transparent";var s=q.getDescriptionHtml().replace(j,"");
if(v.test(s)){u="turn-r"}else{if(o.test(s)){u="turn-rsl"}else{if(x.test(s)){u="turn-l"
}else{if(r.test(s)){u="turn-lsl"}}}}n+='<tr class="'+l+'"> 					  <td class="dir-img"><img src="http://maps.gstatic.com/intl/nl_nl/mapfiles/'+u+'.png" alt="" /></td> 					  <td class="dir-num">'+(w+1)+'.</td> 					  <td class="dir-desc">'+q.getDescriptionHtml()+'</td> 					  <td class="dir-specs"><span class="dir-distance">'+FTranslate.Get("rijd")+" "+q.getDistance().html+'</span><br /><span class="dir-total">'+FTranslate.Get("totaal")+" "+q.getDuration().html+"</span></td> 					</tr>"
}Map.rp_dir_data.innerHTML=n+"</table>\n";var p=f.getMarker(0);var m=f.getMarker(1);
var B=Map.CreateMarker(p.getLatLng(),"A");GoogleMap.addOverlay(B);var y=Map.CreateMarker(m.getLatLng(),"B");
GoogleMap.addOverlay(y)}});f.load(h,{getPolyline:true,getSteps:true,locale:e});GoogleMap.addControl(new FundamapMaptypeControl(GoogleMap));
GoogleMap.addControl(new GLargeMapControl3D());GoogleMap.addControl(new GScaleControl());
d.style.visibility="visible";if(Map.indStreetView&&globalStreetViewClient){var b=new GLatLng(g,i);
globalStreetViewClient.getNearestPanorama(b,function(j){Map.ToonStreetViewButton(j,b)
})}},_mapDiv:null,GetMapDiv:function(){if(!this._mapDiv&&document.getElementById("map")){this._mapDiv=document.getElementById("map").firstChild.firstChild
}return this._mapDiv},InitMapMakelaar:function(c,a,b){this._initialized=true;document.getElementById("MapContainer").style.backgroundImage="none";
var d=document.getElementById("map");GoogleMap=new GMap2(d);GoogleMap.setMapType(G_NORMAL_MAP);
GoogleMap.setCenter(new GLatLng(c,a),15);Map.InitControls(false);GoogleMap.addControl(new FundamapMaptypeControl(GoogleMap));
GoogleMap.addControl(new GLargeMapControl3D());GoogleMap.addControl(new GScaleControl());
if(Tooltip){Tooltip.Initialize(b)}d.style.visibility="visible"},InitMapActiveProperty:function(e,c,d,g,f,b){if(!g){g=15
}this._initialized=true;document.getElementById("MapContainer").style.backgroundImage="none";
var h=document.getElementById("map");GoogleMap=new GMap2(h);GoogleMap.setMapType(G_NORMAL_MAP);
GoogleMap.setCenter(new GLatLng(e,c),g);Map.InitControls(false);if(!f){GoogleMap.addControl(new FundamapMaptypeControl(GoogleMap));
GoogleMap.addControl(new GLargeMapControl3D());GoogleMap.addControl(new GScaleControl())
}else{GoogleMap.addControl(new GScaleControl());GoogleMap.addControl(new GSmallZoomControl3D())
}if(b){b.smallNavigation=!f?false:true}if(Tooltip){Tooltip.Initialize(d)}h.style.visibility="visible";
if(Map.indStreetView&&globalStreetViewClient){var a=new GLatLng(e,c);globalStreetViewClient.getNearestPanorama(a,function(i){Map.ToonStreetViewButton(i,a,b)
})}},ToonStreetViewButton:function(c,a,b){if(c.code==200){c.location.pov.yaw=computeAngle(a,c.location.latlng);
$("#gmview-sv").show();$("#gmview-sv").click(function(){var d=new StreetViewPanorama(GoogleMap,b);
d.showPanoData(c,a);return false});Map.OnStreetViewInitialized()}},SetMinimumZoom:function(){var a=GoogleMap.getMapTypes();
for(var b=0;b<a.length;b++){a[b].getMinimumResolution=function(){return 7};if(a[b].getMaximumResolution()>20){a[b].getMaximumResolution=function(){return 20
}}}G_PHYSICAL_MAP.getMinimumResolution=function(){return 7}},IsPngCapableBrowser:function(){return(typeof _isIE6!=="undefined"&&_isIE6)?false:true
},InitMapLarge:function(g,i,l,a){this._initialized=true;this.mapType="large";document.getElementById("MapContainer").style.backgroundImage="none";
if(Map.DebugMode){GLog.write("InitMapLarge called")}this.mapHolder=document.getElementById("map");
GoogleMap=new GMap2(this.mapHolder);if(this.initLat&&this.initLng){g=this.initLat;
i=this.initLng}var h=readCookie("zok_state");if(h&&!this.initLat&&!this.initLng){try{var k=unescape(h).split(";");
if(readCookie("zokzo",k)==a){Map.ResetMapLarge(parseFloat(readCookie("zoky",k)),parseFloat(readCookie("zokx",k)),parseInt(readCookie("zokz",k),10),a);
ZOK.PreviewOnInitLatLng=new GLatLng(parseFloat(readCookie("zokobjy",k)),parseFloat(readCookie("zokobjx",k)))
}else{eraseCookie("zok_state")}}catch(b){}}Map.ResetMapLarge(g,i,l,a);if(this.initLat&&this.initLng){var e="<a class='marker-object'><img src='/img/kaart/marker/property-punaise.gif' style='border-width:0px;position:absolute;' /></a>";
var d=new GLatLngBounds(new GLatLng(this.initLat,this.initLng),new GLatLng(this.initLat,this.initLng));
var j=new ClassRectangle(d,e);GoogleMap.addOverlay(j);j.setZIndex("-1000000");if(this.refid){ZOK._lastHoverLatLng=new GLatLng(this.initLat,this.initLng);
ZOK._lastHoverObjects.length=0;ZOK._lastHoverObjects[0]={id:this.refid};ZOK.MouseClick(true)
}}var f=readCookie("kaartfullmaptype");if(f=="ter"){GoogleMap.setMapType(G_PHYSICAL_MAP)
}else{if(f=="hyb"){GoogleMap.setMapType(G_HYBRID_MAP)}else{if(f=="sat"){GoogleMap.setMapType(G_SATELLITE_MAP)
}else{GoogleMap.setMapType(G_NORMAL_MAP)}}}GoogleMap.enableContinuousZoom();GoogleMap.enableDoubleClickZoom();
if(typeof _mapEnableScrollWheelZoom!=="undefined"&&!_mapEnableScrollWheelZoom){GoogleMap.disableScrollWheelZoom()
}else{GoogleMap.enableScrollWheelZoom()}Map.InitControls(false);GoogleMap.addControl(new FundamapMaptypeControl(GoogleMap));
GoogleMap.addControl(new GLargeMapControl3D());GoogleMap.addControl(new GScaleControl());
this.mapHolder.style.visibility="visible";var c=new GTileLayer(new GCopyrightCollection(),7,20);
c.getTileUrl=function(m,n){return Map.GetImageTileUrl(m.x,m.y,n)};c.getOpacity=function(){return 1
};c.isPng=function(){return Map.IsPngCapableBrowser()};Map.tileLayerOverlay=new GTileLayerOverlay(c);
GoogleMap.addOverlay(Map.tileLayerOverlay);GEvent.addListener(GoogleMap,"mousemove",function(m){if(ZOK.TrackMouseMove){ZOK.MouseMove(m)
}});GEvent.addListener(GoogleMap,"click",function(){ZOK.MouseClick()});GEvent.addListener(GoogleMap,"movestart",function(){ZOK.HideOpenDivs()
});GEvent.addListener(GoogleMap,"dragstart",function(){ZOK.HideOpenDivs()});GEvent.addListener(GoogleMap,"mouseout",function(){ZOK.HideRedDotHoverDiv()
});GEvent.addListener(GoogleMap,"zoomend",function(){ZOK.HideOpenDivs();ZOK.ClearDataTiles(true)
});Map.mapmessageDiv=document.getElementById("mapmsg")},InitControls:function(a){this.SetMinimumZoom();
InitFundamapMaptypeControl();if(a){InitGroteKaartDebugControl()}if(Map.indStreetView){InitStreetViewControl()
}},ResetMapLarge:function(g,d,f,a,e){if(!this._initialized){if(this.ResetMapLargeTimeout){clearTimeout(this.ResetMapLargeTimeout)
}this.ResetMapLargeTimeout=setTimeout("Map.ResetMapLarge("+g+", "+d+", "+f+", '"+a+"')",500);
return}if(e){$(".autocompletePlaatsen").val("").blur()}if(ZOK.ZoekOpdracht!=a||e){ZOK.ZoekOpdracht=a;
if(Map.tileLayerOverlay){ZOK.ClearDataTiles(true);Map.tileLayerOverlay.refresh()}GoogleMap.setCenter(new GLatLng(g,d),f);
GoogleMap.savePosition();ZOK.SetFilterTabs();var c=fundaUtil.Ajax.getAjaxHash(location.href).split("?")[0];
var b=ZOK.ZoekOpdrachtHash();if(c!=b){$(".autocompletePlaatsen").val("").blur();YAHOO.util.History.navigate(b,b)
}}},_mapTileServers:[],SetMapTileServers:function(a){if(a&&a.length>0){this._mapTileServers=a.split(";");
if(this._mapTileServers[this._mapTileServers.length-1]==""){this._mapTileServers.length--
}}},GetMapTileServer:function(a,b){if(this._mapTileServers.length==0){return"."}else{return this._mapTileServers[(a+b)%this._mapTileServers.length]
}},GetImageTileUrl:function(a,e,d){var c=true;if(d<7||d>20){c=false}else{if(d==7){c=(a>=65&&a<=66&&e>=41&&e<=42)
}else{if(d==8){c=(a>=130&&a<=133&&e>=82&&e<=85)}else{if(d==9){c=(a>=260&&a<=266&&e>=165&&e<=171)
}else{if(d==10){c=(a>=521&&a<=532&&e>=331&&e<=343)}else{if(d==11){c=(a>=1043&&a<=1065&&e>=662&&e<=687)
}else{if(d==12){c=(a>=2086&&a<=2130&&e>=1324&&e<=1375)}else{if(d==13){c=(a>=4172&&a<=4260&&e>=2649&&e<=2751)
}else{if(d==14){c=(a>=8344&&a<=8520&&e>=5298&&e<=5503)}else{if(d==15){c=(a>=16689&&a<=17041&&e>=10596&&e<=11006)
}}}}}}}}}}if(!c){return"http://maps.google.com/mapfiles/transparent.png"}var b=ZOK.ZoekOpdrachtZonderLocatie();
setTimeout("ZOK.LoadDataTile("+a+", "+e+", "+d+",'"+b+"')",1000);return Map.GetMapTileServer(a,e)+"/maptileimage.ashx?z="+d+"&x="+a+"&y="+e+"&mode="+(Map.IsPngCapableBrowser()?"png":"gif")+"&zo="+b
},DrawPolygon:function(b,c){var a=new GPolygon.fromEncoded({polylines:[{weight:3,points:b,zoomFactor:32,numLevels:4,levels:"BBB",opacity:0.75,color:"#666666"}],fill:true,color:"#666666",opacity:0.25,outline:true});
if(!c){c=GoogleMap}c.addOverlay(a)},OnStreetViewInitialized:function(){}};var Markers={AllObjects:{},ResultsBB:null,DefaultBB:null,ShowCharacterIndicators:true,IsRealtorPage:false,LoadResultData:function(direction,resetMapLocation,jsonData){if(resetMapLocation==undefined){resetMapLocation=true
}var arrObj={};if(jsonData==undefined){if($("#jsonResultHolder")&&$("#jsonResultHolder").attr("data")){arrObj=eval("("+$("#jsonResultHolder").attr("data")+")");
Tooltip.ObjectsTerm=$("#jsonResultHolder").attr("zoekopdrachttype")}}else{arrObj=jsonData
}var xMax=-180;var xMin=180;var yMax=-90;var yMin=90;var countNoMarkers=0;var letter=96;
for(var id in arrObj){var obj=arrObj[id];if(obj.letter){letter=obj.letter}else{letter++
}if(this.ShowCharacterIndicators){obj.letter=String.fromCharCode(letter)}else{obj.letter="~"
}if(obj.x<0&&obj.y<0){countNoMarkers++;continue}if(obj.x>xMax){xMax=obj.x}if(obj.x<xMin){xMin=obj.x
}if(obj.y>yMax){yMax=obj.y}if(obj.y<yMin){yMin=obj.y}}this.ResultsBB=new GLatLngBounds(new GLatLng(yMin,xMin),new GLatLng(yMax,xMax));
if(xMax==-180&&this.DefaultBB!=null){this.ResultsBB=this.DefaultBB}var HtmlFragments=this.GetHtmlFragmentsForObjects(arrObj,direction);
for(var count=0;count<HtmlFragments.length;count++){var fragment=HtmlFragments[count];
var box=new GLatLngBounds(new GLatLng(fragment.y,fragment.x),new GLatLng(fragment.y,fragment.x));
var rectangle=new ClassRectangle(box,fragment.html);GoogleMap.addOverlay(rectangle);
rectangle.setZIndex("-1000000")}if(resetMapLocation){this.SetMapViewOnResults()}if(countNoMarkers>0){Tooltip.ShowMapMessage(countNoMarkers+" "+Tooltip.ZoekOpdrachtType()+" niet op kaart. <a href='/help/?pagina=/nl/algemene-teksten-funda-sites/fundanl/help/zoeken-en-vinden/waarom-wordt-de-woning-niet-getoond-op-de-kaart' class='int-site'>Waarom?</a>")
}else{Tooltip.CloseMapMessage()}},LoadRealtorData:function(e,d){if(e.x==undefined||e.y==undefined){return
}var b="<a class='marker marker-realtor marker-"+e.bron.toLowerCase()+"' style='cursor: pointer;' ><img alt='Makelaar' id='marker_realtor' src='/img/kaart/marker_realtor/realtors.gif' onmouseover='HoverRealtor(\""+d+"\");' onmouseout='Tooltip.CloseHover()' onclick='Tooltip.ClickMarker(\""+d+"\")' /></a>";
this.AllObjects.realtor=e;var c=new GLatLngBounds(new GLatLng(e.y,e.x),new GLatLng(e.y,e.x));
var a=new ClassRectangle(c,b);GoogleMap.addOverlay(a);a.setZIndex("-1000000");this.SetMapViewOnResults()
},LoadRealtorData2:function(e,d){if(!e.x||!e.y){return}if(!Tooltip.HoverDiv){Tooltip.Initialize()
}var b="<a class='marker marker-realtor marker-"+e.bron.toLowerCase()+"'>";b+="<img src='/img/kaart/marker_realtor/realtors.png' onmouseover='HoverRealtor(\""+d+"\");' onmouseout='Tooltip.CloseHover()' onclick='Tooltip.ClickMarker(\""+d+"\")' /></a>";
this.AllObjects.realtor=e;var c=new GLatLngBounds(new GLatLng(e.y,e.x),new GLatLng(e.y,e.x));
var a=new ClassRectangle(c,b);GoogleMap.addOverlay(a);a.setZIndex("-1000000")},LoadActivePropertyData:function(e,c){if(e.x==undefined||e.y==undefined){return
}var b="<a class='marker-object'><img src='/img/kaart/marker/property-punaise.gif' style='border-width:0px;position:absolute;' /></a>";
var d=new GLatLngBounds(new GLatLng(e.y,e.x),new GLatLng(e.y,e.x));var a=new ClassRectangle(d,b);
GoogleMap.addOverlay(a);a.setZIndex("-1000000");if(!c){this.SetMapViewOnResults()
}},GetHtmlFragmentsForObjects:function(y,x,h){var w=[];var a=!(h==undefined||h==null);
var u,i,q,c;if(a){u=h.toSpan().lat();i=h.toSpan().lng();q=h.getNorthEast().lat();
c=h.getSouthWest().lng()}for(var n in y){var j=y[n];if(j.x<=0&&j.y<=0){continue}var k="";
if(a){var v=100*(q-j.y)/u;var o=100*(j.x-c)/i;k="left:"+o+"%;top:"+v+"%;"}var g=Math.round(j.x*Math.pow(10,4))/Math.pow(10,4);
var e=Math.round(j.y*Math.pow(10,4))/Math.pow(10,4);var s=g.toString()+","+e.toString();
var b=true;var r=(j.letter)?"marker_lst_"+n:"marker_"+n;var p;for(var t=0;t<w.length;
t++){if(w[t].locKey===s){b=false;p=w[t];break}}if(!b){var d={};d.ids=p.ids;d.ids[d.ids.length]=n;
d.aantal=p.aantal+1;d.x=p.x;d.y=p.y;d.locKey=s;var l=(d.aantal>3?"4":d.aantal);var m="marker";
m+="-"+l;d.html="<a class='marker "+m+"' style='cursor: pointer;"+k+"' ><img onmouseover='Hover(\""+x+'", "'+d.ids.join('", "')+"\");' onmouseout='Tooltip.CloseHover()' onclick='Tooltip.ClickMarker(\""+x+"\")' id='"+r+"' alt='' src='/img/kaart/marker/properties.gif'/></a>";
w[t]=d}else{var m=(j.letter)?"marker-"+j.letter:"";var f="";var d;d={html:"<a class='marker "+m+"' style='cursor: pointer;"+k+"' ><img alt='"+f+"' id='"+r+"' src='/img/kaart/marker/properties.gif' onmouseout='Tooltip.CloseHover()' onclick='Tooltip.ClickMarker(\""+x+"\")' onmouseover='Hover(\""+x+'", "'+n+"\");'/></a>"};
d.ids=[n];d.aantal=1;d.x=j.x;d.y=j.y;d.locKey=s;w[w.length]=d}this.AllObjects[n]=j
}return w},SetMapViewOnResults:function(){if(Map.DebugMode){GLog.write("SetMapViewOnResults called")
}var a=GoogleMap.getBoundsZoomLevel(this.ResultsBB);GoogleMap.setCenter(this.ResultsBB.getCenter(),a)
}};var Tooltip={PreviewOnInitLatLng:null,BewaardeObjecten:[],MyNieuwAanbodLink:null,AppPathUrl:"/",clientActie:null,clientActieId:null,PreviewItemTemplate:"<div class='tooltip-property {last}'><table><tr><td class='listing-thumb'><a href='{url}'><img src='{$FotoUrl}' class='thumb' alt='' onerror='this.src=\"/img/thumbs/thumb-geen-foto.gif\";' /></a></td><td class='tooltip-txt'><p><a href='{url}' onclick='createCookie(\"sozokreferrer\", \"{url}\", 0.04); return true;' class='item'>{adr}</a></p><p class='specs'>{pc} {wp}{$Land} {$VerkochtLabel}{$StatusLine}<br />{$SpecsLine} </p><p>{prs} {$FirstPrice}</p></td></tr></table>{$ProjectInfo}{$ItemsOptionsHtml}</div>",StreetViewAddressTemplate:"<div class='map-msg-cont'><a href='{url}'><img src='{$FotoUrl}' onerror='this.src=\"/img/thumbs/thumb-geen-foto.gif\";' class='thumb thumb-s' alt='' /></a><a href='{url}' class='item'>{adr}</a><br />{prs}<br /><span class='txt-s txt-sft'>De Street View locatie is een benadering.</span><a href='#' onclick='if (svp) svp.CloseStreetviewAddress(); return false;' class='map-msg-close' title='"+FTranslate.Get("sluiten")+"'><img src='/img/kaart/marker/map-icn-close.gif' alt='"+FTranslate.Get("sluiten")+"' /></a></div>",PreviewMoreTemplate:"<p class='more'><a href='{$MoreUrl}'>Alle {length} gevonden {$ZoekOpdrachtType} op deze locatie &raquo;</a></p>",PreviewOuterTemplate:"<div class='tooltip-container'>         <div class='tooltip-content {multiple}'>             {$ItemsHtml}             <p class='tooltip-close'>                 <a href='javascript:{$TooltipCloseScript}' title='"+FTranslate.Get("sluiten")+"'>                     <img src='/img/kaart/marker/map-icn-close.gif' alt='"+FTranslate.Get("sluiten")+"' />                 </a>             </p>         </div><div class='tt-tl'></div> 		<div class='tt-tr'></div> 		<div class='tt-br'></div> 		<div class='tt-bl'></div> 		<div class='tt-icn'></div> 	</div>",RealtorHoverTemplate:"<a><span>{naam}, {plaats}<span class='marker-hover-icn'></span></span></a>",RealtorPreviewOuterTemplate:'<div class="tooltip-container">		<div class="tooltip-content">		  <div class="tooltip-property">			<table>			  <tbody><tr>				{$MakelaarAfbeelding}				<td class="tooltip-txt">				  <p><a class="item" href="{url}">{naam}</a></p>				  <p class="specs">{adres}<br>{postcode} {plaats}</p>				</td>			  </tr>			</tbody></table>		  </div>		  <p class="tooltip-close"><a title="'+FTranslate.Get("sluiten")+'" href="javascript:{$TooltipCloseScript}"><img alt="'+FTranslate.Get("sluiten")+'" src="/img/kaart/marker/map-icn-close.gif"></a></p>		</div>		<div class="tt-tl"></div>		<div class="tt-tr"></div>		<div class="tt-br"></div>		<div class="tt-bl"></div>		<div class="tt-icn"></div>	  </div>',HoverTemplate:"<a ><span>{$VerkochtLabel}{adr}, {wp}{$Land} &#183; <span class='price-wrapper'>{prs}</span></span><span class='marker-hover-icn'></span></a>",HoverTemplateMultiple:"<a ><span>{$VerkochtLabel}{length} {$ZoekOpdrachtType}</span><span class='marker-hover-icn'></span></a>",MapMessageTemplate:'<div class="map-msg-cont">{msg}<a class="map-msg-close" title="'+FTranslate.Get("sluiten")+'" href="javascript:Tooltip.CloseMapMessage()"><img alt="'+FTranslate.Get("sluiten")+'" src="/img/kaart/marker/map-icn-close.gif"/></a></div>',ObjectsTerm:"objecten",BaseUrl:"/",currentSelected:[],TooltipCloseScript:function(){return"Tooltip.Close();"
},ItemsOptionsHtml:function(h){var a=false;for(i=0;i<Tooltip.BewaardeObjecten.length;
i++){if(Tooltip.BewaardeObjecten[i].id==h.id){a=true;break}}if(Tooltip.clientActie=="bewaarobject"&&Tooltip.clientActieId==h.id){a=true;
$.ajax({cache:false,url:Tooltip.AppPathUrl+"clientactie/bewaarobject/"+h.id,success:function(j){$("#login_bewaard").show();
$("#login_bewaard_aantal").html(j);Tooltip.VoegBewaardObjectToe(h.id,h.x,h.y)}});
Tooltip.clientActie=null;Tooltip.clientActieId=null}var c="<div class='tooltip-options'><ul>";
if(!h.pnaam){if(typeof(NoProfile)=="undefined"||!NoProfile){if(a){c+="<li><a href='"+Tooltip.MyNieuwAanbodLink+"' class='tt-option-save saved'>"+FTranslate.Get("bewaar")+"</a></li>"
}else{var e="pg-option-save"+h.id;var g="bewaarVolgEvent('Bewaar');return object_clientactie('bewaar', '"+Tooltip.AppPathUrl+"clientactie/bewaarobject/"+h.id+"', '"+Tooltip.MyNieuwAanbodLink+"', '#"+e+"', null, function() { Tooltip.VoegBewaardObjectToe('"+h.id+"',"+h.x+","+h.y+"); })";
if(!Popup.popupLoginSuccessful){var b=h.adr.split("'").join("");var d=self.location.href.indexOf("fundainbusiness")>0?"Mijn funda in business":"Mijn funda";
var f="{\\'actie-verwijzing-login\\':\\'Log in om &quot;"+b+"&quot; te bewaren.\\',\\'actie-verwijzing-aanmelden\\':\\'Maak een "+d+" account aan om &quot;"+b+"&quot; te bewaren.\\',\\'actie-verwijzing-bevestiging\\':\\'&quot;"+b+"&quot; is bewaard.\\',\\'volgende-stap-bevestiging\\':\\'Ga terug naar zoek op kaart.\\'}";
g="Popup.load.call(this, function() {"+g+"; return false; }, '"+f+"');"}c+="<li><a href='javascript:void(0)' class='tt-option-save' id='"+e+"'"+(Popup.popupLoginSuccessful?"":" rel='popup-content-login'")+' onclick="'+g+'">'+FTranslate.Get("bewaar")+"</a></li>"
}}}if(GoogleMap.getZoom()<17){c+="<li><a href='javascript:void(0)' onclick='Tooltip.ZoomToPoint("+h.y+","+h.x+"); return false;' class='tt-option-zoom'>Zoom in</a></li>"
}c+="</ul></div>";return c},VoegBewaardObjectToe:function(b,a,c){Tooltip.BewaardeObjecten.push({id:b,x:a,y:c})
},ZoomToPoint:function(c,a){var b=GoogleMap.getCurrentMapType()==G_PHYSICAL_MAP?15:17;
Tooltip.PreviewOnInitLatLng=new GLatLng(c,a);GoogleMap.setCenter(new GLatLng(c,a),b)
},Initialize:function(a){if(a==undefined){a="left"}var b=this;var d=document.createElement("div");
d.id="Preview";d.className="tooltip tooltip-"+a;document.getElementById("MapContainer").appendChild(d);
d=document.createElement("div");d.id="MapMsg";d.className="map-msg";d.style.display="none";
document.getElementById("MapContainer").appendChild(d);var c=document.createElement("div");
c.id="Hover";c.className="marker-hover marker-hover-"+a;c.onmouseover=function(){this.style.display="none"
};c.innerHTML=this.HoverTemplate;document.getElementById("MapContainer").appendChild(c);
this.PreviewDiv=document.getElementById("Preview");this.HoverDiv=document.getElementById("Hover");
this.MapMessageDiv=document.getElementById("MapMsg");GEvent.addListener(GoogleMap,"movestart",function(){b.Close()
});GEvent.addListener(GoogleMap,"dragstart",function(){b.Close()});GEvent.addListener(GoogleMap,"zoomstart",function(){b.Close()
})},ReplaceTemplateVars:function(c,e){var d=c.match(/{\$?\w+}/g);for(var b=0;b<d.length;
b++){var f=d[b].replace(/[{}]/g,"");if(f.substring(0,1)=="$"){var a=Tooltip[f.substring(1)](e);
c=c.replace(d[b],a)}else{if(e==undefined){return}if(typeof(e[f])=="number"){e[f]=this.FormatNumber(e[f])
}c=c.replace(d[b],e[f])}}return c},FormatNumber:function(c){var d=c.toString();var b="";
var a=d.length;while(a>3){b="."+d.substr(a-3,3)+b;a-=3}return d.substr(0,a)+b},Hover:function(a,c){if(this.HoverDiv==undefined){return
}if(a.length==1){var b=Markers.AllObjects[a[0]];this.HoverDiv.innerHTML=this.ReplaceTemplateVars(this.HoverTemplate,b)
}else{this.HoverDiv.innerHTML=this.ReplaceTemplateVars(this.HoverTemplateMultiple,a)
}this.GenericHoverHandler(a,c)},HoverRealtor:function(b){if(this.HoverDiv==undefined){return
}if(!b){b="left"}var a=Markers.AllObjects.realtor;this.HoverDiv.innerHTML=this.ReplaceTemplateVars(this.RealtorHoverTemplate,a);
this.GenericHoverHandler(["realtor"],b);this.HoverDiv.className="marker-hover marker-realtor-hover marker-hover-"+b+" marker-realtor-hover-"+b+" marker-"+a.bron.toLowerCase()
},GenericHoverHandler:function(c,e){var d=Markers.AllObjects[c[0]];var a=GoogleMap.fromLatLngToContainerPixel(new GLatLng(d.y,d.x));
this.HoverDiv.style.left="-999px";this.HoverDiv.style.display="block";if(!e){var b=GoogleMap.fromLatLngToContainerPixel(GoogleMap.getBounds().getNorthEast()).x;
e=(a.x+20+this.HoverDiv.clientWidth)<b?"right":"left"}this.currentSelected=c;this.HoverDiv.className="marker-hover marker-hover-"+e;
this.HoverDiv.style.left=e=="right"?a.x+"px":(a.x-this.HoverDiv.clientWidth)+"px";
this.HoverDiv.style.top=a.y+"px"},IsArray:function(a){return !!(a&&a.constructor==Array)
},ShowMapMessage:function(b){var a={msg:b};if(!this.MapMessageDiv){div=document.createElement("div");
div.id="MapMsg";div.className="map-msg";div.style.display="none";document.getElementById("MapContainer").appendChild(div);
this.MapMessageDiv=div}this.MapMessageDiv.innerHTML=this.ReplaceTemplateVars(this.MapMessageTemplate,a);
this.MapMessageDiv.style.display="block"},CloseMapMessage:function(){if(this.MapMessageDiv){this.MapMessageDiv.innerHTML="";
this.MapMessageDiv.style.display="none"}},ClickMarker:function(g){this.HoverDiv.style.display="none";
if(this.currentSelected.length>0){var f=[];for(var c=0;c<this.currentSelected.length;
c++){f[f.length]=Markers.AllObjects[this.currentSelected[c]]}f.multiple=this.currentSelected.length>1?"tooltip-multiple":"";
var b=GoogleMap.fromLatLngToContainerPixel(new GLatLng(f[0].y,f[0].x));if(this.currentSelected[0]==="realtor"){if(g=="left"){b.x-=50
}this.PreviewDiv.className="tooltip tooltip-realtor tooltip-"+g+" tooltip-realtor-"+g;
this.PreviewDiv.innerHTML=Tooltip.ReplaceTemplateVars(Tooltip.RealtorPreviewOuterTemplate,f[0])
}else{this.PreviewDiv.innerHTML=Tooltip.ReplaceTemplateVars(Tooltip.PreviewOuterTemplate,f);
this.PreviewDiv.className="tooltip tooltip-"+g}this.PreviewDiv.style.left="-999px";
this.PreviewDiv.style.display="block";if(!g){var e=GoogleMap.fromLatLngToContainerPixel(GoogleMap.getBounds().getNorthEast()).x;
g=(b.x+this.PreviewDiv.clientWidth)<e?"right":"left"}var h=getChildElements(this.PreviewDiv)[0];
this.PreviewDiv.style.top=(b.y-Math.floor(h.clientHeight/2))+"px";if(g=="right"){this.PreviewDiv.style.left=b.x+"px"
}else{this.PreviewDiv.style.left=(b.x-this.PreviewDiv.clientWidth)+"px"}var d=/(\/funda\/|\/fundainbusiness\/|\/sozok\/)/.exec(window.location.href);
d=d?d[0]:"/";for(var c=0;c<Math.min(this.currentSelected.length,3);c++){var a=d+"clientactie/zokpopupgeklikt/"+this.currentSelected[c];
$.ajax({cache:false,url:a})}}},Preview:function(c,b,a){if(a==undefined){a=true}if(b==undefined){b="left"
}this.currentSelected=[c];if(a){document.body.scrollIntoView()}if(Map.mapType=="small"){Markers.SetMapViewOnResults()
}Tooltip.ClickMarker(b)},Close:function(){if(this.PreviewDiv==undefined){return}this.PreviewDiv.style.display="none";
this.CloseHover();this.CloseMapMessage()},CloseHover:function(){if(this.HoverDiv==undefined){return
}if(Markers.IsRealtorPage){for(var a=0;a<this.currentSelected.length;a++){var b=document.getElementById("F"+this.currentSelected[0]);
if(b&&b.className.match("realtors-gallery-object-hover")=="realtors-gallery-object-hover"){b.className="realtors-gallery-object"
}}}this.HoverDiv.style.display="none"},FotoUrl:function(a){return(a.vk?"http://cloud.funda.nl/valentina_media":"http://images.funda.nl/valentinamedia")+a.img.replace(".jpg","_klein.jpg")
},MakelaarLogoUrl:function(a){return"http://images.funda.nl/valentinamedia"+a.img.replace(".jpg","_logomiddel.jpg")
},ProjectInfo:function(a){if(a.purl){return this.ReplaceTemplateVars("<p class='tooltip-project'><strong>Onderdeel van nieuwbouwproject</strong><br/>{paant} woningen in <a href='{purl}'>{pnaam}</a></p>",a)
}return""},FirstPrice:function(a){if(a.epr){return this.ReplaceTemplateVars("<del class='price-del'><span class='price'>&euro;&nbsp;{epr}</span> <abbr class='price-ext'>{prsuf}</abbr></del>",a)
}return""},SpecsLine:function(c){var a=[];var b=this.Oppervlak(c);if(b){a[a.length]=b
}b=this.UnitsVanaf(c);if(b){a[a.length]=b}b=this.AantalKamers(c);if(b){a[a.length]=b
}b=this.AantalWoningen(c);if(b){a[a.length]=b}b=this.AangebodenSinds(c);if(b){a[a.length]=b
}b=this.StartOplevering(c);if(b){a[a.length]=b}b=this.Wachttijd(c);if(b){a[a.length]=b
}if(a.length==0){return""}return a.join(" &#183; ")+"<br/>"},Oppervlak:function(b){if(b.ko){return this.ReplaceTemplateVars("<span title='Oppervlakte'>{ko} m&sup2;</span>",b)
}if(b.wo||b.po){var a="";if(b.wo){if(b.wotot&&b.wotot!=b.wo){a+=this.ReplaceTemplateVars("<span title='Woonoppervlakte'>{wo} - {wotot} m&sup2;</span>",b)
}else{a+=this.ReplaceTemplateVars("<span title='Woonoppervlakte'>{wo} m&sup2;</span>",b)
}}if(b.po){if(b.wo){a+=" / "}if(b.potot&&b.potot!=b.po){a+=this.ReplaceTemplateVars("<span title='Perceeloppervlakte'>{po} - {potot} m&sup2;</span>",b)
}else{a+=this.ReplaceTemplateVars("<span title='Perceeloppervlakte'>{po} m&sup2;</span>",b)
}}return a}return""},UnitsVanaf:function(a){if(a.units){return this.ReplaceTemplateVars("<span title='Units'>Units vanaf {units} m&sup2;</span>",a)
}return""},Land:function(a){if(a.lnd){return this.ReplaceTemplateVars(", {lnd}",a)
}return""},Wachttijd:function(a){if(a.wt){return this.ReplaceTemplateVars("<span title='Wachttijd'>{wt}</span>",a)
}return""},AantalKamers:function(a){if(a.kmr){return this.ReplaceTemplateVars("<span title='Aantal kamers'>{kmr}</span>",a)
}return""},AantalWoningen:function(a){if(a.objn){if(a.objn==1){return"<span title='Aantal woningen'>1 woning</span>"
}return this.ReplaceTemplateVars("<span title='Aantal woningen'>{objn} woningen</span>",a)
}return""},StartOplevering:function(a){if(a.opl){return this.ReplaceTemplateVars("<span title='Start oplevering'>Opl. vanaf {opl}</span>",a)
}return""},AangebodenSinds:function(a){if(a.sed){return this.ReplaceTemplateVars("<span class='item-since' title='Aangeboden sinds'>{sed}</span>",a)
}return""},ZoekOpdrachtType:function(){return this.ObjectsTerm.toLowerCase()},VerkochtLabel:function(c){var e=this.IsArray(c)?c[0]:c;
if(e.vk){var a=e.vk.split("|")[0];var b=e.vk.split("|")[1];var d="<span class='item-"+a+"-label-small' title='"+b+"'>"+b.toUpperCase()+"</span>";
return d}return""},StatusLine:function(c){var a=[];var b=this.ProductIcons(c);if(b){a[a.length]=b
}b=this.TopHuis(c);if(b){a[a.length]=b}b=this.OpenHuis(c);if(b){a[a.length]=b}b=this.VerkoopStatus(c);
if(b){a[a.length]=b}return a.join(" &#183; ")},ProductIcons:function(d){var a="";
if(d.prds){var b=d.prds.split(",");for(var e=0;e<b.length;e++){var c=this.VertaalProduct(b[e]).split("|");
if(c.lenght==2){a+='<img src="/img/icn/icn-product-'+c[0]+'.gif" alt="'+c[1]+'" title="'+c[1]+'">'
}}}if(a.length>0){result="<span>"+a+"</span>"}return a},VertaalProduct:function(a){if(a=="360"){return"360|360° foto's"
}if(a=="vi"){return"video|Video"}if(a=="br"){return"brochure|Brochure"}if(a=="pl"){return"blueprint|Plattegrond"
}return""},TopHuis:function(b){var a="";if(b.top=="h"){a='<span class="item-top"> Tophuis</span>'
}else{if(b.top=="o"){a='<span class="item-top"> Topobject</span>'}else{if(b.top=="p"){a='<span class="item-top"> Topproject</span>'
}}}return a},OpenHuis:function(b){var a="";if(b.oph){a='<span class="item-open"> Open Huis</span>'
}return a},VerkoopStatus:function(c){if(c.vkst==null){return""}var b=c.vkst.split("|");
if(b.length!=2){return""}var a="<span class='"+b[0]+"'>"+b[1]+"</span>";return a},ItemsHtml:function(e){var b="";
var a=e.length;if(a>3){a=3}for(var d=0;d<a;d++){var c=e[d];c.last=(d==e.length-1)?"lst":"";
b+=this.ReplaceTemplateVars(this.PreviewItemTemplate,c)}if(e.length>3){b+=this.ReplaceTemplateVars(this.PreviewMoreTemplate,e)
}return b},MoreUrl:function(d){var a=this.BaseUrl+"kaart/MeerdereObjecten/default.aspx?ids=";
var c=false;for(var b=0;b<d.length;b++){if(b==0&&d[b].vk){c=true}if(b>0){a+=","}a+=d[b].id
}return a+(c?"&verkocht=1":"")},SentToBackISeaq:function(b){var a=document.getElementById("iseaq");
if(a){a.style.zIndex="-1"}},BringToFrontISeaq:function(){var a=document.getElementById("iseaq");
if(a){a.style.zIndex="500"}},MakelaarAfbeelding:function(a){if(a.img){return'<td class="listing-thumb"><a href="'+a.url+'"><img alt="" class="thumb" src="'+a.img+'"></a></td>'
}else{return""}}};function Hover(a){arrWoningen=new Array();for(i=1;i<arguments.length;
i++){arrWoningen[arrWoningen.length]=arguments[i]}if(arguments.length>1){Tooltip.Hover(arrWoningen,a)
}}function HoverRealtor(a){Tooltip.HoverRealtor(a)};var IsStreetViewActive=false;var globalStreetViewClient=null;var MiniMap=null;function InitStreetViewControl(){globalStreetViewClient=new GStreetviewClient()
}function computeAngle(b,e){var f=e.lat()*Math.PI/180;var d=b.lat()*Math.PI/180;var c=(b.lng()-e.lng())*Math.PI/180;
var g=Math.sin(c)*Math.cos(d);var a=Math.cos(f)*Math.sin(d)-Math.sin(f)*Math.cos(d)*Math.cos(c);
return(Math.atan2(g,a)*180/Math.PI+360)%360}function StreetViewPanorama(b,a){svp=this;
this.map=b;this.myPano=null;this.config={showPegmanLargeView:true,zoomLevelLargeView:17,polygonen:[],smallNavigation:true,showObjectMarker:true,closeStreetViewOnMapHide:false,onShowPanoData:function(){},showMiniMap:true};
if(a){$.extend(this.config,a)}if(!this.config.showObjectMarker){this.config.showPegmanLargeView=true
}this.showPanoData=function(d,c,f){if(d.code!=200){return}if($.isFunction(this.config.onShowPanoData)){this.config.onShowPanoData()
}IsStreetViewActive=true;if(Map.mapType=="large"){ZOK.HideOpenDivs(true,true)}var g=document.createElement("div");
var e=document.getElementById("map");addClass(g,"map-sv");g.setAttribute("id","cb_flash");
g.style.width=e.style.width;g.style.height=e.style.height;svp.myPano=new GStreetviewPanorama(g,{latlng:d.location.latlng,pov:d.location.pov,features:{userPhotos:false}});
svp.map.getContainer().appendChild(g);svp.appendCloseButton();if(this.config.showMiniMap){svp.appendMiniMap(d.location.latlng,d.location.pov,c)
}if(f){svp.appendStreetviewAddress(f)}svp.PanoErrorEvent=GEvent.addListener(svp.myPano,"error",svp.handleNoFlash);
window.setTimeout(function(){var h=document.getElementById("cb_flash");if(h){h.style.backgroundImage="none"
}},3000);window.setTimeout(function(){svp.adjustFlashHeight()},1000);svp.myPano.checkResize()
};this.adjustFlashHeight=function(){var e=document.title;if(e.indexOf("#")>-1){e=e.substring(0,e.indexOf("#"));
document.title=e}var c=document.getElementById("cb_flash");if(c){var d=c.getElementsByTagName("object")[0];
if(!d){setTimeout(function(){svp.adjustFlashHeight()},1000)}else{d.style.height="100%";
d.style.width="100%"}}};this.handleNoFlash=function(c){if(c==603){return}};this.GetPegmanImgIndex=function(d){if(!d){return 1
}var c=Math.round((d/360)*16)+1;if(c==17){c=1}return c};this.appendStreetviewAddress=function(c){svp.iFrameAddress=this.CreateIframeShim({left:"93px",top:"13px",height:"69px",width:"359px"});
svp.svaddress=document.createElement("div");addClass(svp.svaddress,"map-msg map-sv-address");
svp.svaddress.style.zIndex="4";svp.svaddress.innerHTML=Tooltip.ReplaceTemplateVars(Tooltip.StreetViewAddressTemplate,c);
this.map.getContainer().appendChild(svp.iFrameAddress);this.map.getContainer().appendChild(svp.svaddress)
};this.CloseStreetviewAddress=function(){b.getContainer().removeChild(svp.iFrameAddress);
svp.iFrameAddress=null;b.getContainer().removeChild(svp.svaddress);svp.svaddress=null
};this.CreateIframeShim=function(c){var d=document.createElement("iframe");d.style.zIndex="3";
if(c.left){d.style.left=c.left}if(c.right){d.style.right=c.right}if(c.top){d.style.top=c.top
}if(c.bottom){d.style.bottom=c.bottom}if(c.width){d.style.width=c.width}if(c.height){d.style.height=c.height
}d.style.position="absolute";d.frameBorder="0";d.style.backgroundColor="transparent";
d.style.allowTransparency="true";d.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
d.style.opacity="0";return d};this.appendMiniMap=function(e,p,k){svp.iFrameMini=this.CreateIframeShim({right:"0px",bottom:"0px",height:"188px",width:"188px"});
svp.minimap=document.createElement("div");addClass(svp.minimap,"map-small map-cnr");
svp.minimap.style.zIndex="4";svp.minimap.setAttribute("id","map-cnr");var i="<div id='MiniMapContainer'><div id='minimap' style='position: relative;height: 100%;width: 100%;'></div></div><a href='#' class='map-expand' id='mini-map-expand' title='Vergroot kaart'></a>";
if(Map.mapType!="large"){svp.iFrameMini.style.height="17px";svp.iFrameMini.style.width="17px";
addClass(svp.minimap,"map-cnr-hide");i+="<a href='#' class='map-show' id='mini-map-hide' title='Toon kaart'></a>"
}else{i+="<a href='#' class='map-hide' id='mini-map-hide' title='Verberg kaart'></a>"
}svp.minimap.innerHTML=i;this.map.getContainer().appendChild(svp.iFrameMini);this.map.getContainer().appendChild(svp.minimap);
var m=document.getElementById("minimap");MiniMap=new GMap2(m);if($("#mini-map-expand").hasClass("map-expand")){MiniMap.setCenter(e,this.config.zoomLevelLargeView);
for(var d in this.config.polygonen){Map.DrawPolygon(this.config.polygonen[d],MiniMap)
}}else{MiniMap.setCenter(e,17)}MiniMap.setMapType(GoogleMap.getCurrentMapType());
var f=new GSmallZoomControl3D();var j=new GControlPosition(G_ANCHOR_TOP_RIGHT,new GSize(10,10));
var r=new GControlPosition(G_ANCHOR_TOP_LEFT,new GSize(10,10));var q=new FundamapMaptypeControl(MiniMap);
var c=new GSmallZoomControl3D();var h=new GScaleControl();if(this.config.smallNavigation){MiniMap.addControl(f,j)
}else{MiniMap.addControl(q);MiniMap.addControl(c);MiniMap.addControl(h)}m.style.visibility="visible";
$("#minimap").children("[id=logocontrol]").hide();if(this.config.showObjectMarker){var l="<a class='marker-object'><img src='/img/kaart/marker/property-punaise.gif' style='border-width:0px;position:absolute;' /></a>";
var s=new GLatLngBounds(k,k);var g=new ClassRectangle(s,l);MiniMap.addOverlay(g);
g.setZIndex("-1000000")}var o="<div id='marker-sv' class='marker marker-sv marker-sv-"+this.GetPegmanImgIndex(p.yaw)+"'><img src='/img/kaart/map-google-pegman.png' alt='' /></div>";
var n=new GLatLngBounds(e,e);svp.pegman=new ClassRectangle(n,o);MiniMap.addOverlay(svp.pegman);
svp.pegman.setZIndex("-1000000");if(!(!$("#mini-map-expand").hasClass("map-expand")||this.config.showPegmanLargeView)){svp.pegman.hide()
}svp.ScaleControl=new GScaleControl();svp.YawChangedEvent=GEvent.addListener(svp.myPano,"yawchanged",svp.handleYawChanged);
svp.PanoInitEvent=GEvent.addListener(svp.myPano,"initialized",svp.handlePanoInit);
document.getElementById("MiniMapContainer").style.backgroundImage="none";initMiniMapLarge=function(){MiniMap.removeControl(f);
MiniMap.removeControl(q);MiniMap.removeControl(c);MiniMap.removeControl(h);if(svp.config.smallNavigation){MiniMap.addControl(f,j)
}else{MiniMap.addControl(q);MiniMap.addControl(c);MiniMap.addControl(h)}if(svp.config.showPegmanLargeView){svp.pegman.show()
}else{svp.pegman.hide()}MiniMap.setCenter(e,svp.config.zoomLevelLargeView)};initMiniMapSmall=function(){svp.pegman.show();
MiniMap.setCenter(e,17);MiniMap.removeControl(svp.ScaleControl);MiniMap.removeControl(f);
MiniMap.removeControl(q);MiniMap.removeControl(c);MiniMap.removeControl(h);MiniMap.addControl(f,j)
};$("#mini-map-expand").click(function(){$(this).blur();if($(this).hasClass("map-expand")){$(this).removeClass("map-expand");
$(this).addClass("map-contract");$(this).attr("title","Verklein kaart");$("#map-cnr").addClass("map-cnr-split");
$("#minimap").children("[id=logocontrol]").show();initMiniMapLarge();var t=document.getElementById("cb_flash");
t.style.height="55%";MiniMap.addControl(svp.ScaleControl);svp.RefreshMiniMap();svp.iFrameMini.style.height="1px";
svp.iFrameMini.style.width="1px";$("#mini-map-hide").hide()}else{$(this).removeClass("map-contract");
$(this).addClass("map-expand");$(this).attr("title","Vergroot kaart");$("#map-cnr").removeClass("map-cnr-split");
$("#minimap").children("[id=logocontrol]").hide();initMiniMapSmall();var t=document.getElementById("cb_flash");
t.style.height="100%";svp.RefreshMiniMap();svp.iFrameMini.style.height="188px";svp.iFrameMini.style.width="188px"
}return false});$("#mini-map-hide").click(function(){$(this).blur();if($(this).hasClass("map-hide")){$(this).removeClass("map-hide");
$(this).addClass("map-show");$(this).attr("title","Toon kaart");$("#map-cnr").addClass("map-cnr-hide");
svp.iFrameMini.style.height="17px";svp.iFrameMini.style.width="17px"}else{$(this).removeClass("map-show");
$(this).addClass("map-hide");$(this).attr("title","Verberg kaart");$("#map-cnr").removeClass("map-cnr-hide");
initMiniMapSmall();svp.RefreshMiniMap();svp.iFrameMini.style.height="188px";svp.iFrameMini.style.width="188px"
}return false})};this.RefreshMiniMap=function(){var c=MiniMap.getCenter();MiniMap.checkResize();
MiniMap.setCenter(c)};this.handleYawChanged=function(d){var e=document.getElementById("marker-sv");
if(e){var c=e.className.split(" ");c[c.length-1]="marker-sv-"+svp.GetPegmanImgIndex(d);
e.className=c.join(" ")}};this.handlePanoInit=function(c){svp.pegman.bounds_=new GLatLngBounds(c.latlng,c.latlng);
svp.pegman.redraw(true);if($("#mini-map-expand").hasClass("map-expand")||svp.config.showPegmanLargeView){MiniMap.panTo(c.latlng)
}};this.appendCloseButton=function(){svp.iFrame=this.CreateIframeShim({right:"24px",top:"4px",height:"20px",width:"20px"});
svp.iFrame.className="gmsv-close-iframe";svp.btn=document.createElement("div");addClass(this.btn,"gmnoprint gmsv-close");
svp.btn.style.zIndex="18";var d=document.createElement("div");addClass(d,"gmview-cont");
var c=document.createElement("a");addClass(c,"gmbut-sv-close");c.title="Sluiten";
c.innerHTML="<span>Sluiten</span>";d.appendChild(c);svp.btn.appendChild(d);this.closeButtonEvent=GEvent.addDomListener(svp.btn,"click",svp.closeStreetView);
this.map.getContainer().appendChild(svp.iFrame);this.map.getContainer().appendChild(svp.btn)
};this.closeStreetView=function(){GEvent.removeListener(svp.PanoErrorEvent);svp.myPano.remove();
b.getContainer().removeChild(svp.iFrame);b.getContainer().removeChild(svp.iFrameMini);
if(svp.iFrameAddress){b.getContainer().removeChild(svp.iFrameAddress)}b.getContainer().removeChild(document.getElementById("cb_flash"));
b.getContainer().removeChild(svp.btn);if(svp.svaddress){b.getContainer().removeChild(svp.svaddress)
}b.getContainer().removeChild(svp.minimap);GEvent.removeListener(svp.closeButtonEvent);
svp.myPano=null;MiniMap=null;IsStreetViewActive=false;if(Map.mapType=="large"){ZOK.OpenLastPreview()
}}};