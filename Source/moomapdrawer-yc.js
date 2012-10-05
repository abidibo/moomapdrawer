/*
---
moomapdrawer is a plugin which lets you draw shapes (point, polyline, polygon, circle) over a google map (api v3) with the mouse or through geocoding. Such shapes may be exported and passed to a callback function in order to save them. It is possible also to import shapes and edit them so that is the perfect plugin to use in a insert/edit format for geolocalization.

license: MIT-style

authors:
- abidibo <dev@abidibo.net>

requires:
- core/1.4.4

provides: moomapdrawer

...
*/
var moomapdrawer;if(!moomapdrawer){moomapdrawer={}}else{if(typeof moomapdrawer!="object"){throw new Error("moomapdrawer already exists and is not an object")}}moomapdrawer.instances_ids=0;moomapdrawer.debug=false;moomapdrawer.map=(function(){var b={};var a={};return new Class({initialize:function(d,c){this.id=moomapdrawer.instances_ids++;b[this.id]={};if(typeOf($(d))!="element"){throw new Error("Canvas container not found")}else{b[this.id].canvas=$(d)}a[this.id]={center:[45,7],zoom:8,tools:{},clear_map_ctrl:"default",export_map_ctrl:"default",export_map_callback:null,geocoder_map_field:true,tips_map_ctrl:"default"};a[this.id]=Object.merge(a[this.id],c);b[this.id].map_types={hybrid:google.maps.MapTypeId.HYBRID,roadmap:google.maps.MapTypeId.ROADMAP,satellite:google.maps.MapTypeId.SATELLITE,terrain:google.maps.MapTypeId.TERRAIN};b[this.id].supported_tools=["point","polyline","polygon","circle"];b[this.id].drawing_tool=null;b[this.id].tools=[];b[this.id].ctrl_container=null;b[this.id].map=null;b[this.id].clear_map_ctrl=null;b[this.id].clear_map_ctrl_event=null;b[this.id].export_map_ctrl=null;b[this.id].export_map_ctrl_event=null;b[this.id].tips_map_ctrl=null;b[this.id].geocoder=null;b[this.id].geocoder_field=null;b[this.id].geocoder_center_button=null;b[this.id].geocoder_draw_button=null;this.processOptions();this.addControllersContainer()},addControllersContainer:function(){b[this.id].ctrl_container=new Element("div",{id:"gmapdraw_controllers_container"});var c=b[this.id].canvas.getCoordinates();b[this.id].ctrl_container.inject(document.body).setStyles({position:"absolute",top:c.top+"px",left:c.left+"px",width:c.width+"px"})}.protect(),addDefaultCtrl:function(c){if(typeOf(c)!="element"){throw new Error("The given controller is not a DOM element")}c.inject(b[this.id].ctrl_container,"top")},processOptions:function(){b[this.id].supported_tools.each(function(e){if(a[this.id].tools.hasOwnProperty(e)){var c=null;var d=a[this.id].tools[e].ctrl||null;if(d){c=typeOf(d)==="string"?$(d):d;if(typeOf(c)!="element"){throw new Error("The given control handler for the "+e+" tool is not a DOM element")}}this.addTool(new moomapdrawer[e+"Tool"](this,c,a[this.id].tools[e].options||null))}}.bind(this))}.protect(),addTool:function(c){if(!instanceOf(c,moomapdrawer.tool)){throw new Error("The "+c.getToolName()+" tool object given is not of the proper type")}if(!b[this.id].supported_tools.contains(c.getToolName())){throw new Error("The "+c.getToolName()+" tool is not supported")}b[this.id].tools[c.getToolName()]=c},getTool:function(c){if(!b[this.id].supported_tools.contains(c)){throw new Error("The "+c+" tool is not supported")}if(typeof b[this.id].tools[c]==="undefined"){return null}return b[this.id].tools[c]},removeTool:function(c){if(!b[this.id].supported_tools.contains(c)){throw new Error("The "+c+" tool is not supported")}if(b[this.id].tools[c]){b[this.id].tools[c].deactivate(true);delete b[this.id].tools[c]}},render:function(){this.initMap();this.initControllers();this.initTools()},initMap:function(){var d=new google.maps.LatLng(a[this.id].center[0],a[this.id].center[1]);var c={center:d,zoom:a[this.id].zoom,zoomControlOptions:{style:google.maps.ZoomControlStyle.LARGE,position:google.maps.ControlPosition.RIGHT_CENTER},panControl:false,mapTypeControl:true,mapTypeControlOptions:{position:google.maps.ControlPosition.LEFT_BOTTOM},mapTypeId:google.maps.MapTypeId.ROADMAP};b[this.id].map=new google.maps.Map(b[this.id].canvas,c);b[this.id].geocoder=new google.maps.Geocoder();google.maps.event.addListener(b[this.id].map,"click",this.mapClick.bind(this))},initControllers:function(){if(a[this.id].clear_map_ctrl){this.setClearMapController()}if(a[this.id].export_map_ctrl&&a[this.id].export_map_callback){this.setExportMapController()}if(a[this.id].tips_map_ctrl){this.setTipsMapController()}if(a[this.id].geocoder_map_field){this.setGeocoderMapFieldController()}},setClearMapController:function(){if(a[this.id].clear_map_ctrl==="default"){b[this.id].clear_map_ctrl=new Element("div",{id:"gmapdraw_clear_map_ctrl"}).set("text","clear map");b[this.id].clear_map_ctrl.inject(b[this.id].ctrl_container)}else{if(a[this.id].clear_map_ctrl){b[this.id].clear_map_ctrl=typeOf(a[this.id].clear_map_ctrl)==="element"?a[this.id].clear_map_ctrl:$(a[this.id].clear_map_ctrl);if(typeOf(b[this.id].clear_map_ctrl)!="element"){throw new Error("The given clear map controller is not a DOM element")}}}b[this.id].clear_map_ctrl_event=this.clearMap;b[this.id].clear_map_ctrl.addEvent("click",b[this.id].clear_map_ctrl_event.bind(this))}.protect(),removeClearMapController:function(){b[this.id].clear_map_ctrl.removeEvent("click",b[this.id].clear_map_ctrl_event);if(a[this.id].clear_map_ctrl==="default"){b[this.id].clear_map_ctrl.dispose()}}.protect(),setExportMapController:function(){if(a[this.id].export_map_ctrl==="default"){b[this.id].export_map_ctrl=new Element("div",{id:"gmapdraw_export_map_ctrl"}).set("text","export map");b[this.id].export_map_ctrl.inject(b[this.id].ctrl_container)}else{if(a[this.id].export_map_ctrl){b[this.id].export_map_ctrl=typeOf(a[this.id].export_map_ctrl)==="element"?a[this.id].export_map_ctrl:$(a[this.id].export_map_ctrl);if(typeOf(b[this.id].export_map_ctrl)!="element"){throw new Error("The given export map controller is not a DOM element")}}}b[this.id].export_map_ctrl_event=function(){a[this.id].export_map_callback(this.exportMap())}.bind(this);b[this.id].export_map_ctrl.addEvent("click",b[this.id].export_map_ctrl_event.bind(this))}.protect(),removeExportMapController:function(){b[this.id].export_map_ctrl.removeEvent("click",b[this.id].export_map_ctrl_event);if(a[this.id].export_map_ctrl==="default"){b[this.id].export_map_ctrl.dispose()}}.protect(),setTipsMapController:function(){if(a[this.id].tips_map_ctrl==="default"){b[this.id].tips_map_ctrl=new Element("div",{id:"gmapdraw_tips_map_ctrl"});b[this.id].tips_map_ctrl.inject(b[this.id].ctrl_container)}else{if(a[this.id].tips_map_ctrl){b[this.id].tips_map_ctrl=typeOf(a[this.id].tips_map_ctrl)==="element"?a[this.id].tips_map_ctrl:$(a[this.id].tips_map_ctrl);if(typeOf(b[this.id].tips_map_ctrl)!="element"){throw new Error("The given tips map controller is not a DOM element")}}}if(b[this.id].tips_map_ctrl){this.updateTips(this.initMapTips())}}.protect(),removeTipsMapController:function(){if(a[this.id].tips_map_ctrl==="default"){b[this.id].tips_map_ctrl.dispose()}}.protect(),setGeocoderMapFieldController:function(){b[this.id].geocoder_field=new Element("input",{id:"gmapdraw_geocoder_field",type:"text",placeholder:"insert an address"});b[this.id].geocoder_center_button=new Element("input",{id:"gmapdraw_geocoder_center_button",type:"button",value:"set map center"});b[this.id].geocoder_draw_button=new Element("input",{id:"gmapdraw_geocoder_draw_button",type:"button",value:"draw"});b[this.id].geocoder_center_button.addEvent("click",this.geocoderCenter.bind(this));b[this.id].geocoder_draw_button.addEvent("click",this.geocoderDraw.bind(this));b[this.id].ctrl_container.adopt(b[this.id].geocoder_field,b[this.id].geocoder_center_button,b[this.id].geocoder_draw_button)}.protect(),removeGeocoderMapField:function(){b[this.id].geocoder_center_button.removeEvents();b[this.id].geocoder_draw_button.removeEvents();[b[this.id].geocoder_field,b[this.id].geocoder_center_button,b[this.id].geocoder_draw_button].each(function(c){c.dispose()})}.protect(),setDrawingTool:function(c){if(c!=null&&!b[this.id].tools.hasOwnProperty(c.getToolName())){throw new Error("Can't set the drawing tool since it's not active")}b[this.id].drawing_tool=c},getDrawingTool:function(){return b[this.id].drawing_tool},initTools:function(){for(var c in b[this.id].tools){if(b[this.id].supported_tools.contains(c)){b[this.id].tools[c].activate()}}},updateTips:function(c){if(b[this.id].tips_map_ctrl){b[this.id].tips_map_ctrl.set("html",c)}},initMapTips:function(){return"Displays help tips about drawing tools"},mapClick:function(c){if(moomapdrawer.debug){console.log("map click event triggered")}if(b[this.id].drawing_tool===null){return false}else{b[this.id].drawing_tool.clickHandler(c)}},geocoderCenter:function(){var c={address:b[this.id].geocoder_field.get("value")};b[this.id].geocoder.geocode(c,function(f,e){var d=f[0];if(e==="OK"){b[this.id].map.setCenter(d.geometry.location)}else{if(moomapdrawer.debug){console.log("geocoder response status: "+e)}alert(e)}}.bind(this))},geocoderDraw:function(){var c={address:b[this.id].geocoder_field.get("value")};b[this.id].geocoder.geocode(c,function(f,e){var d=f[0];if(e==="OK"){if(b[this.id].drawing_tool===null){alert("select a drawing tool")}this.mapClick({latLng:d.geometry.location})}else{if(moomapdrawer.debug){console.log("geocoder response status: "+e)}alert(e)}}.bind(this))},clearMap:function(){for(var c in b[this.id].tools){if(b[this.id].supported_tools.contains(c)){b[this.id].tools[c].clear()}}if(moomapdrawer.debug){console.log("map cleared")}},exportMap:function(){var d={};for(var c in b[this.id].tools){if(b[this.id].supported_tools.contains(c)){d[c]=b[this.id].tools[c].exportData()}}if(moomapdrawer.debug){console.log(d);console.log("map exported")}return d},importMap:function(e){if(typeOf(e.point)!="null"){if(this.getTool("point")===null){var d=new moomapdrawer.pointTool(this,null);this.addTool(d);d.activate()}this.getTool("point").importData(e.point)}if(typeOf(e.polyline)!="null"){if(this.getTool("polyline")===null){var d=new moomapdrawer.polylineTool(this,null);this.addTool(d);d.activate()}this.getTool("polyline").importData(e.polyline)}if(typeOf(e.polygon)!="null"){if(this.getTool("polygon")===null){var d=new moomapdrawer.polygonTool(this,null);this.addTool(d);d.activate()}this.getTool("polygon").importData(e.polygon)}if(typeOf(e.circle)!="null"){if(this.getTool("circle")===null){var c=new moomapdrawer.circleTool(this,null);this.addTool(c);c.activate()}this.getTool("circle").importData(e.circle)}},gmap:function(){return b[this.id].map},setCenter:function(c){a[this.id].center=c;if(b[this.id].map){b[this.id].map.setCenter(new google.maps.LatLng(c[0],c[1]))}},setZoom:function(c){a[this.id].zoom=zoom;if(b[this.id].map){b[this.id].map.setZoom(zoom)}},setClearMapCtrl:function(c){if(c!=a[this.id].clear_map_ctrl){this.removeClearMapController()}a[this.id].clear_map_ctrl=c;this.setClearMapController()},setExportMapCtrl:function(c){if(c!=a[this.id].export_map_ctrl){this.removeExportMapController()}a[this.id].export_map_ctrl=c;this.setExportMapController()},setGeocoderMapField:function(c){a[this.id].geocoder_map_field=c;if(!c){this.removeGeocoderMapField()}else{this.setGeocoderMapFieldController()}},setTipsMapCtrl:function(c){if(c!=a[this.id].tips_map_ctrl){this.removeTipsMapController()}a[this.id].tips_map_ctrl=c;this.setTipsMapController()}})}());moomapdrawer.tool=(function(){var b={};var a={};return new Class({initialize:function(f,d,c,e){this.id=f;b[this.id]={};b[this.id].active=false;b[this.id].map=null;b[this.id].ctrl=null;b[this.id].ctrl_param=null;b[this.id].tool_name=null;b[this.id].items=[];b[this.id].map=d;b[this.id].tool_name=e;b[this.id].ctrl_param=c;b[this.id].next_shape=false;b[this.id].items_array=[];a[this.id]={};a[this.id].max_items_allowed=3},options:function(){return a[this.id]}.protect(),protectedProp:function(){return b[this.id]}.protect(),setController:function(c){if(typeOf(c)==="string"||typeOf(c)==="element"){if(typeOf(c)==="string"){b[this.id].ctrl=$(c)}if(typeOf(b[this.id].ctrl!="element")){throw new Error("the given ctrl for the "+b[this.id].tool_name+"tool is not a DOM element")}}else{b[this.id].ctrl=new Element("div",{id:"gmapdraw_"+b[this.id].tool_name+"_tool"}).set("text",b[this.id].tool_name);b[this.id].map.addDefaultCtrl(b[this.id].ctrl)}}.protect(),removeController:function(){b[this.id].ctrl.dispose();b[this.id].ctrl=null}.protect(),activate:function(){b[this.id].active=true;this.setController(b[this.id].ctrl_param);b[this.id].ctrl.addEvent("click",this.setDrawing.bind(this));b[this.id].ctrl.removeClass("inactive");b[this.id].ctrl.addClass("active");if(moomapdrawer.debug){console.log(b[this.id].tool_name+" tool activated")}},deactivate:function(c){if(!c){c=false}if(b[this.id].active===true){b[this.id].active=false;b[this.id].ctrl.removeClass("active");b[this.id].ctrl.addClass("inactive");b[this.id].ctrl.removeEvent("click",this.setDrawing);if(b[this.id].map.getDrawingTool()===this){b[this.id].map.setDrawingTool(null)}if(c&&b[this.id].ctrl_param==null){this.removeController()}if(moomapdrawer.debug){console.log(b[this.id].tool_name+" tool deactivated")}}else{if(c&&b[this.id].ctrl_param==null){this.removeController()}if(moomapdrawer.debug){console.log(b[this.id].tool_name+" tool already deactivated")}}},setDrawing:function(){if(moomapdrawer.debug){console.log("drawing tool: "+b[this.id].tool_name)}this.prepareTool();b[this.id].map.setDrawingTool(this)},prepareTool:function(){b[this.id].map.updateTips(this.tipsText())},addItem:function(c){b[this.id].items.push(c)},setMaxItemsAllowed:function(c){a[this.id].max_items_allowed=c.toInt()},setNextShape:function(c){b[this.id].next_shape=!!c},getToolName:function(){return b[this.id].tool_name}})}());moomapdrawer.pointTool=(function(){var c={};var b={};var a={};return new Class({Extends:moomapdrawer.tool,initialize:function(f,e,d){this.id=moomapdrawer.instances_ids++;this.parent(this.id,f,e,"point");b[this.id]={};a[this.id]={};a[this.id]=Object.merge(this.options(),b[this.id],d);c[this.id]=this.protectedProp()},tipsText:function(){return"Click on the map to set draggable markers points. Right click on a marker to delete it"},clickHandler:function(e){if(!(c[this.id].items.length<a[this.id].max_items_allowed)){if(moomapdrawer.debug){console.log("maximum number of points drawed")}alert("Maximum number of insertable points reached");return null}var d=new google.maps.Marker({position:e.latLng,draggable:true,map:c[this.id].map.gmap()});c[this.id].items.push(d);if(moomapdrawer.debug){google.maps.event.addListener(d,"dragend",this.updateInfo.bind(this))}google.maps.event.addListener(d,"rightclick",function(){d.setMap(null);c[this.id].items.erase(d);if(moomapdrawer.debug){this.updateInfo()}}.bind(this));if(moomapdrawer.debug){console.log("point drawed");this.updateInfo()}},updateInfo:function(){var d="";c[this.id].items.each(function(e,f){d+="point #"+(f+1)+" (lat, lng): ("+e.getPosition().lat()+", "+e.getPosition().lng()+")\n"});console.log(d);console.log("updated points info")},clear:function(){c[this.id].items.each(function(d){d.setMap(null)});c[this.id].items=[];if(moomapdrawer.debug){console.log("points cleared")}},exportData:function(){var d=[];c[this.id].items.each(function(e){var f={lat:e.getPosition().lat(),lng:e.getPosition().lng()};d.push(f)});return d},importData:function(f){for(var e=0;e<f.length;e++){var d=f[e];this.clickHandler({latLng:new google.maps.LatLng(d.lat,d.lng)})}}})}());moomapdrawer.polylineTool=(function(){var c={};var b={};var a={};return new Class({Extends:moomapdrawer.tool,initialize:function(f,e,d){this.id=moomapdrawer.instances_ids++;this.parent(this.id,f,e,"polyline");b[this.id]={};c[this.id]={next_shape:false,active_polyline_index:null};a[this.id]=Object.merge(this.options(),b[this.id],d);c[this.id]=Object.merge(this.protectedProp(),c[this.id])},tipsText:function(){return"Click on the map to add polyline points, click the menu voice again to create a new polyline. Right click on existing polylines to delete them"},prepareTool:function(){this.parent();c[this.id].next_shape=true},clickHandler:function(f){if(c[this.id].next_shape&&c[this.id].items.length<a[this.id].max_items_allowed){var d=new google.maps.MVCArray([f.latLng]);var g=new google.maps.Polyline({editable:true,path:d,map:c[this.id].map.gmap()});var e={path:d,shape:g};c[this.id].items.push(e);c[this.id].active_polyline_index=c[this.id].items.indexOf(e);google.maps.event.addListener(g,"rightclick",function(){g.setMap(null);c[this.id].items.erase(e);c[this.id].active_polyline_index--;c[this.id].next_shape=true;if(moomapdrawer.debug){this.updateInfo()}}.bind(this));if(moomapdrawer.debug){google.maps.event.addListener(d,"insert_at",this.updateInfo.bind(this));google.maps.event.addListener(d,"remove_at",this.updateInfo.bind(this));google.maps.event.addListener(d,"set_at",this.updateInfo.bind(this));console.log("polyline point added");this.updateInfo()}c[this.id].next_shape=false}else{if(c[this.id].next_shape){if(moomapdrawer.debug){console.log("maximum number of polylines drawed")}alert("Maximum number of insertable polylines reached");return null}else{c[this.id].items[c[this.id].active_polyline_index].path.push(f.latLng)}}},updateInfo:function(){var d="";c[this.id].items.each(function(e,f){d+="Polyline #"+(f+1)+"\n";e.path.forEach(function(g,h){d+="\tpoint #"+(h+1)+" (lat, lng): ("+g.lat()+", "+g.lng()+")\n"})}.bind(this));console.log(d);console.log("updated polyline info")},clear:function(){c[this.id].items.each(function(d){d.shape.setMap(null)});c[this.id].items=[];if(moomapdrawer.debug){console.log("polylines cleared")}},exportData:function(){var d=[];c[this.id].items.each(function(e){var f=[];e.path.forEach(function(g,h){var i={lat:g.lat(),lng:g.lng()};f.push(i)});d.push(f)});return d},importData:function(h){for(var f=0;f<h.length;f++){var e=h[f];this.prepareTool();for(var g=0;g<e.length;g++){var d=e[g];this.clickHandler({latLng:new google.maps.LatLng(d.lat,d.lng)})}}}})}());moomapdrawer.polygonTool=(function(){var c={};var b={};var a={};return new Class({Extends:moomapdrawer.tool,initialize:function(f,e,d){this.id=moomapdrawer.instances_ids++;this.parent(this.id,f,e,"polygon");b[this.id]={};c[this.id]={next_shape:false,active_polygon_index:null};a[this.id]=Object.merge(this.options(),b[this.id],d);c[this.id]=Object.merge(this.protectedProp(),c[this.id])},tipsText:function(){return"Click on the map to add polygon's vertices, click the menu voice again to create a new shape. Right click on existing polygons to delete them"},prepareTool:function(){this.parent();c[this.id].next_shape=true},clickHandler:function(d){if(c[this.id].next_shape&&c[this.id].items.length<a[this.id].max_items_allowed){var e=new google.maps.MVCArray([d.latLng]);var f=new google.maps.Polygon({editable:true,path:e,map:c[this.id].map.gmap()});var g={path:e,shape:f};c[this.id].items.push(g);c[this.id].active_polygon_index=c[this.id].items.indexOf(g);google.maps.event.addListener(f,"rightclick",function(){f.setMap(null);c[this.id].items.erase(g);c[this.id].active_polygon_index--;c[this.id].next_shape=true;if(moomapdrawer.debug){this.updateInfo()}}.bind(this));if(moomapdrawer.debug){google.maps.event.addListener(e,"insert_at",this.updateInfo.bind(this));google.maps.event.addListener(e,"remove_at",this.updateInfo.bind(this));google.maps.event.addListener(e,"set_at",this.updateInfo.bind(this));console.log("polygon vertex added");this.updateInfo()}c[this.id].next_shape=false}else{if(c[this.id].next_shape){if(moomapdrawer.debug){console.log("maximum number of polygons drawed")}alert("Maximum number of insertable polygons reached");return null}else{c[this.id].items[c[this.id].active_polygon_index].path.push(d.latLng)}}},updateInfo:function(){var d="";c[this.id].items.each(function(f,e){d+="Polygon #"+(e+1)+"\n";f.path.forEach(function(g,h){d+="\tpoint #"+(h+1)+" (lat, lng): ("+g.lat()+", "+g.lng()+")\n"})}.bind(this));console.log(d);console.log("updated polygon info")},clear:function(){c[this.id].items.each(function(d){d.shape.setMap(null)});c[this.id].items=[];if(moomapdrawer.debug){console.log("polygons cleared")}},exportData:function(){var d=[];c[this.id].items.each(function(e){var f=[];e.path.forEach(function(g,h){var i={lat:g.lat(),lng:g.lng()};f.push(i)});d.push(f)});return d},importData:function(h){for(var f=0;f<h.length;f++){var e=h[f];this.prepareTool();for(var g=0;g<e.length;g++){var d=e[g];this.clickHandler({latLng:new google.maps.LatLng(d.lat,d.lng)})}}}})}());moomapdrawer.circleTool=(function(){var c={};var b={};var a={};return new Class({Extends:moomapdrawer.tool,initialize:function(f,e,d){this.id=moomapdrawer.instances_ids++;this.parent(this.id,f,e,"circle");b[this.id]={};c[this.id]={next_shape:false,circle_drawing:null,map_move_listener:null,circle_move_listener:null};a[this.id]=Object.merge(this.options(),b[this.id],d);c[this.id]=Object.merge(this.protectedProp(),c[this.id])},tipsText:function(){return"Click on the map to add circles. Right click on existing circles to delete them"},prepareTool:function(){this.parent();c[this.id].next_shape=true},clickHandler:function(d){if(!c[this.id].circle_drawing&&c[this.id].items.length<a[this.id].max_items_allowed){var e=new google.maps.Circle({center:d.latLng,map:c[this.id].map.gmap(),radius:1,editable:true});c[this.id].circle_drawing=true;c[this.id].map_move_listener=google.maps.event.addListener(c[this.id].map.gmap(),"mousemove",function(f){e.setRadius(this.distance(d.latLng,f.latLng))}.bind(this));c[this.id].circle_move_listener=google.maps.event.addListener(e,"mousemove",function(f){e.setRadius(this.distance(d.latLng,f.latLng))}.bind(this));google.maps.event.addListenerOnce(e,"click",function(f){google.maps.event.removeListener(c[this.id].map_move_listener);google.maps.event.removeListener(c[this.id].circle_move_listener);c[this.id].circle_drawing=false;if(moomapdrawer.debug){this.updateInfo()}}.bind(this));c[this.id].items.push(e);google.maps.event.addListener(e,"rightclick",function(){e.setMap(null);c[this.id].items.erase(e);c[this.id].next_shape=true;if(moomapdrawer.debug){this.updateInfo()}}.bind(this))}else{if(!c[this.id].circle_drawing&&c[this.id].items.length>=a[this.id].max_items_allowed){if(moomapdrawer.debug){console.log("maximum number of circles drawed")}alert("Maximum number of insertable circles reached");return null}else{google.maps.event.removeListener(c[this.id].map_move_listener);google.maps.event.removeListener(c[this.id].circle_move_listener);c[this.id].circle_drawing=false;if(moomapdrawer.debug){this.updateInfo()}}}},updateInfo:function(){var d="";c[this.id].items.each(function(f,e){d+="Circle #"+(e+1)+"\n";d+="\tcenter (lat, lng): ("+f.getCenter().lat()+", "+f.getCenter().lng()+")\n";d+="\tradius: "+f.getRadius()+"\n"}.bind(this));console.log(d);console.log("updated circle info")},clear:function(){c[this.id].items.each(function(d){d.setMap(null)});c[this.id].items=[];if(moomapdrawer.debug){console.log("circles cleared")}},distance:function(j,g){var i=6371000;var f=(g.lat()-j.lat())*Math.PI/180;var h=(g.lng()-j.lng())*Math.PI/180;var e=Math.sin(f/2)*Math.sin(f/2)+Math.cos(j.lat()*Math.PI/180)*Math.cos(g.lat()*Math.PI/180)*Math.sin(h/2)*Math.sin(h/2);var l=2*Math.atan2(Math.sqrt(e),Math.sqrt(1-e));var k=i*l;return k},exportData:function(){var d=[];c[this.id].items.each(function(g,e){var f={lat:g.getCenter().lat(),lng:g.getCenter().lng(),radius:g.getRadius()};d.push(f)}.bind(this));return d},importData:function(f){for(var e=0;e<f.length;e++){var g=f[e];var d=new google.maps.Circle({center:new google.maps.LatLng(g.lat,g.lng),map:c[this.id].map.gmap(),radius:g.radius,editable:true});this.addItem(d);google.maps.event.addListener(d,"rightclick",function(){d.setMap(null);c[this.id].items.erase(d);c[this.id].next_shape=true;if(moomapdrawer.debug){this.updateInfo()}}.bind(this))}}})}());
