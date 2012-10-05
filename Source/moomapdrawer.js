/*
---
moomapdrawer is a plugin which lets you draw shapes (point, polyline, polygon, circle) over a google map (api v3) with the mouse or through geocoding. Such shapes may be exported and passed to a callback function in order to save them. It is possible also to import shapes and edit them so that is the perfect plugin to use in a insert/edit format for geolocalization.

license: MIT-style

authors:
- abidibo <dev@abidibo.net>

requires:
- core/1.4.4

provides: [moomapdraw.map, moomapdraw.tool, moomapdraw.pointTool, moomapdraw.polylineTool, moomapdraw.polygonTool, moomapdraw.circleTool]

...
*/

/*
For documentation, demo and download link please visit http://www.abidibo.net/projects/js/moomapdrawer
*/

/**
 * moomapdrawer namespace
 * @namespace
 */
var moomapdrawer;
if (!moomapdrawer) moomapdrawer = {};
else if( typeof moomapdrawer != 'object') {
	throw new Error('moomapdrawer already exists and is not an object');
}
/** Incremental variable which assures the creation of a new instance id every time a new instance is created */
moomapdrawer.instances_ids = 0;

/** Whether or not to display debug information in the console */
moomapdrawer.debug = false;

// look at initialize method for class description
moomapdrawer.map = (function()  {

	// private members
	var _private = {};	

	// options
	var _options = {};	

	// mootools class

	return new Class({

		/**
		 * @summary Google maps drawing class, provides tools for drawing over a google map instance, and export drawed data.
		 * @classdesc <p>This class handles the drawing tools used to draw over a google map and allows the drawed data exportation.</p>
		 *            <p>The map manages also some controllers</p>
		 *            <ul>
		 *            <li>clear map controller</li> 
		 *            <li>export map controller</li> 
		 *            <li>geocoder text field controller</li> 
		 *            <li>tips controller</li> 
	 	 *            </ul>
		 *            <p>Moreover every drawing tool has its own controller, which may be specifically set or used in its default form.</p>
		 *            <p>Each map controller may be specified custom, may be removed setting the related option to <code>null</code> or used in its default form.</p>
		 *            <p>Once instantiated the class and set the tools by options or instantiating direclty the drawing tool classes and adding them to the map,
		 *            see {@link moomapdrawer.map#addTool}, call the render method to render the widget. 
		 *            Then it is possible to continue configuring the widget adding or removing tools,
		 *            customizing the google map instance which is returned by the {@link moomapdrawer.map#gmap} method.</p>
		 *            <p>When defining specific map controllers, be sure to make them handle the proper map methods.</p>
		 *            <p>Very important: be sure to load the google maps library yourself in the head of the document!</p>
		 *
		 * @constructs moomapdrawer.map
		 * @param {String} canvas The id attribute of the map container
		 * @param {Object} [options] A class options object
		 * @param {Array} [options.center=new Array(45, 7)] The initial map center coordinates, (lat, lng).
		 * @param {Number} [options.zoom=8] The the initial map zoom level.
		 * @param {Object} [options.tools={}] The object containing the tool's names and optionsa to be activated when initializing the map. 
		 * 					   It's a shortcut to easily define set and active tools objects.			
		 * @param {Object} [options.tools.point=undefined] The point tool init object
		 * @param {String|Element} [options.tools.point.ctrl=undefined] The id attribute or the element itself which controls the tool, default the built-in menu voice
		 * @param {Object} [options.tools.point.options=undefined] The tool options object, see {@link moomapdrawer.pointTool} for available properties
		 * @param {Object} [options.tools.polyline=undefined] The polyline tool init object
		 * @param {String|Element} [options.tools.polyline.ctrl=undefined] The id attribute or the element itself which controls the tool, default the built-in menu voice
		 * @param {Object} [options.tools.polyline.options=undefined] The tool options object, see {@link moomapdrawer.polylineTool} for available properties
		 * @param {Object} [options.tools.polygon=undefined] The polygon tool init object
		 * @param {String|Element} [options.tools.polygon.ctrl=undefined] The id attribute or the element itself which controls the tool, default the built-in menu voice
		 * @param {Object} [options.tools.polygon.options=undefined] The tool options object, see {@link moomapdrawer.polygonTool} for available properties
		 * @param {Object} [options.tools.circle=undefined] The circle tool init object
		 * @param {String|Element} [options.tools.circle.ctrl=undefined] The id attribute or the element itself which controls the tool, default the built-in menu voice
		 * @param {Object} [options.tools.circle.options=undefined] The tool options object, see {@link moomapdrawer.circleTool} for available properties
		 * @param {String|Element} [options.clear_map_ctrl='default'] The clear map controller (clears all drawings over the map). 
		 *                                                    If 'default' the built-in controller is used, if <code>null</code> the clear map 
		 *                                                    functionality is removed. If id attribute or an element the clear map functionality is attached to the element.
		 * @param {String|Element} [options.export_map_ctrl='default'] The export map controller (exports all shapes drawed over the map). 
		 *                                                     If 'default' the built-in controller is used, if <code>null</code> the export map 
		 *                                                     functionality is removed. If id attribute or an element the clear map functionality is attached to the element.
		 * @param {Function} [options.export_map_callback=null] The callback function to call when the export map button is pressed. The callback function receives one argument, the exported data as
		 *                                                      returned by the moomapdrawer.map#exportMap method.
		 * @param {Boolean} [options.geocoder_map_field=true] Whether or not to add the gecoder functionality which allows to center the map in a point defined through an address, or to
		 *                                            pass the lat,lng coordinates found to the map click handlers (exactly as click over the map in a lat,lng point). 
		 * @param {String|Element} [options.tips_map_ctrl='default'] The help tips map controller (shows tips about drawing tools). 
		 *                                                     If 'default' the built-in controller is used, if <code>null</code> the tips box is not shown, 
		 *                                                     if id attribute or an element the functionality is attached to the element.
		 *
		 * @example
		 * var mymap = new moomapdrawer.map('my_map_canvas_id', {
		 * 	tools: {
		 *		point: {
		 *			options: {
		 *				max_items: 5
		 *			}
		 *		},
		 *		circle: {}	
		 * 	}
		 * });
		 *
		 */
		initialize: function(canvas, options) {

			this.id = moomapdrawer.instances_ids++;

			_private[this.id] = {};

			if(typeOf($(canvas)) != 'element') {
				throw new Error('Canvas container not found');
			}
			else {
				_private[this.id].canvas = $(canvas);
			}

			_options[this.id] = {
				center: [45, 7],
				zoom: 8,
				tools: {},
				clear_map_ctrl: 'default',
				export_map_ctrl: 'default',
				export_map_callback: null,
				geocoder_map_field: true,
				tips_map_ctrl: 'default'
			}

			_options[this.id] = Object.merge(_options[this.id], options);

			_private[this.id].map_types = {
				'hybrid': google.maps.MapTypeId.HYBRID,
				'roadmap': google.maps.MapTypeId.ROADMAP,
				'satellite': google.maps.MapTypeId.SATELLITE,
				'terrain': google.maps.MapTypeId.TERRAIN
	 	   	};

			_private[this.id].supported_tools = ['point', 'polyline', 'polygon', 'circle'];
			_private[this.id].drawing_tool = null;
			_private[this.id].tools = [];
			_private[this.id].ctrl_container = null;
			_private[this.id].map = null;
			_private[this.id].clear_map_ctrl = null;
			_private[this.id].clear_map_ctrl_event = null;
			_private[this.id].export_map_ctrl = null;
			_private[this.id].export_map_ctrl_event = null;
			_private[this.id].tips_map_ctrl = null;
			_private[this.id].geocoder = null;
			_private[this.id].geocoder_field = null;
			_private[this.id].geocoder_center_button = null;
			_private[this.id].geocoder_draw_button = null;

			this.processOptions();

			this.addControllersContainer();

		},
		/**
 		 * @summary Adds an empty container over the map which may contain default controllers if any
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		addControllersContainer: function() {
		
			_private[this.id].ctrl_container = new Element('div', {id: 'gmapdraw_controllers_container'});

			// inject controllers container
			var canvas_coord = _private[this.id].canvas.getCoordinates();
			_private[this.id].ctrl_container.inject(document.body).setStyles({
				position: 'absolute',
				top: canvas_coord.top + 'px',
				left: canvas_coord.left + 'px',
				width: canvas_coord.width + 'px'
			});

		}.protect(),
		/**
 		 * @summary Adds a controller in the default controllers container
		 * @memberof moomapdrawer.map.prototype
		 * @param {Element} ctrl The controller to be added
		 * @return void
 		 */
		addDefaultCtrl: function(ctrl) {
			if(typeOf(ctrl) != 'element') {
				throw new Error('The given controller is not a DOM element');
			}
			ctrl.inject(_private[this.id].ctrl_container, 'top');
		},
		/**
 		 * @summary Processes the option object setting properly some class properties
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		processOptions: function() {

			// init tools
			_private[this.id].supported_tools.each(function(tool_name) {
				if(_options[this.id].tools.hasOwnProperty(tool_name)) {
					var handler = null;
					var ctrl = _options[this.id].tools[tool_name].ctrl || null;
					// set tool
					if(ctrl) {
						handler = typeOf(ctrl) === 'string' ? $(ctrl) : ctrl;
						if(typeOf(handler) != 'element') {
							throw new Error('The given control handler for the ' + tool_name + ' tool is not a DOM element');
						}
					}
					// add the tool
					this.addTool(new moomapdrawer[tool_name + 'Tool'](this, handler, _options[this.id].tools[tool_name].options || null));
				}
			}.bind(this));

		}.protect(),
		/**
 		 * @summary Adds a drawing tool
		 * @memberof moomapdrawer.map.prototype
		 * @param {moomapdrawer.tool} tool The tool object 
		 * @return void
 		 */
		addTool: function(tool) {
			
			if(!instanceOf(tool, moomapdrawer.tool)) {
				throw new Error('The ' + tool.getToolName() + ' tool object given is not of the proper type');
			}

			if(!_private[this.id].supported_tools.contains(tool.getToolName())) {
				throw new Error('The ' + tool.getToolName() + ' tool is not supported');
			}
			_private[this.id].tools[tool.getToolName()] = tool;
		},
		/**
 		 * @summary Gets a tool object giving its name
		 * @memberof moomapdrawer.map.prototype
		 * @param {String} tool_name One of the supported tools name
		 * @return {moomapdrawer.tool | null} The tool object if set or null
 		 */
		getTool: function(tool_name) {

			if(!_private[this.id].supported_tools.contains(tool_name)) {
				throw new Error('The ' + tool_name + ' tool is not supported');
			}
			if(typeof _private[this.id].tools[tool_name] === 'undefined') {
				return null;
			}
			return _private[this.id].tools[tool_name];

		},
		/**
 		 * @summary Removes a drawing tool
		 * @memberof moomapdrawer.map.prototype
		 * @param {String} tool_name The name of the tool to be removed
		 * @param {moomapdrawer.tool} tool The tool object 
		 * @return void
 		 */
		removeTool: function(tool_name) {
			if(!_private[this.id].supported_tools.contains(tool_name)) {
				throw new Error('The ' + tool_name + ' tool is not supported');
			}
			if(_private[this.id].tools[tool_name]) {
				_private[this.id].tools[tool_name].deactivate(true);
				delete _private[this.id].tools[tool_name];
			}
		},
		/**
 		 * @summary Renders the widget  
		 * @memberof moomapdrawer.map.prototype
		 * @return void
 		 */
		render: function() {
			// map initialization
			this.initMap();
			// add controllers
			this.initControllers();
			// init tools
			this.initTools();
		},
		/**
 		 * Initializes the google map and its events
		 * @memberof moomapdrawer.map.prototype
		 * @return void
 		 */
		initMap: function() {

			var map_center = new google.maps.LatLng(_options[this.id].center[0], _options[this.id].center[1]);
			var myOptions = {
				center: map_center,
				zoom: _options[this.id].zoom,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE,
					position: google.maps.ControlPosition.RIGHT_CENTER
				},
				panControl: false,
				mapTypeControl: true,
				mapTypeControlOptions: {
					position: google.maps.ControlPosition.LEFT_BOTTOM
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			_private[this.id].map = new google.maps.Map(_private[this.id].canvas, myOptions);
			_private[this.id].geocoder = new google.maps.Geocoder();

			google.maps.event.addListener(_private[this.id].map, 'click', this.mapClick.bind(this));

		},
		/**
 		 * @summary Initializes all the map controllers
		 * @memberof moomapdrawer.map.prototype
		 * @return void
 		 */
		initControllers: function() {

			if(_options[this.id].clear_map_ctrl) this.setClearMapController();
			if(_options[this.id].export_map_ctrl && _options[this.id].export_map_callback) this.setExportMapController();
			if(_options[this.id].tips_map_ctrl) this.setTipsMapController();
			if(_options[this.id].geocoder_map_field) this.setGeocoderMapFieldController();

		},
		/**
 		 * @summary Sets the clear map controller depending on the options.clear_map_ctrl value
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		setClearMapController: function() {
			
			if(_options[this.id].clear_map_ctrl === 'default') {
				_private[this.id].clear_map_ctrl = new Element('div', {id: 'gmapdraw_clear_map_ctrl'}).set('text', 'clear map');
				_private[this.id].clear_map_ctrl.inject(_private[this.id].ctrl_container);
			}
			else if(_options[this.id].clear_map_ctrl) {
				_private[this.id].clear_map_ctrl = typeOf(_options[this.id].clear_map_ctrl) === 'element' ? _options[this.id].clear_map_ctrl : $(_options[this.id].clear_map_ctrl);
				if(typeOf(_private[this.id].clear_map_ctrl) != 'element') {
					throw new Error('The given clear map controller is not a DOM element');
				}
			}
			
			_private[this.id].clear_map_ctrl_event = this.clearMap;
			_private[this.id].clear_map_ctrl.addEvent('click', _private[this.id].clear_map_ctrl_event.bind(this));


		}.protect(),
		/**
 		 * @summary Removes the clear map controller depending on the options.clear_map_ctrl value
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		removeClearMapController: function() {
			_private[this.id].clear_map_ctrl.removeEvent('click', _private[this.id].clear_map_ctrl_event);
			if(_options[this.id].clear_map_ctrl === 'default') _private[this.id].clear_map_ctrl.dispose();
		}.protect(),
		/**
 		 * @summary Sets the export map controller depending on the options.export_map_ctrl value
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		setExportMapController: function() {
			
			if(_options[this.id].export_map_ctrl === 'default') {
				_private[this.id].export_map_ctrl = new Element('div', {id: 'gmapdraw_export_map_ctrl'}).set('text', 'export map');
				_private[this.id].export_map_ctrl.inject(_private[this.id].ctrl_container);
			}
			else if(_options[this.id].export_map_ctrl) {
				_private[this.id].export_map_ctrl = typeOf(_options[this.id].export_map_ctrl) === 'element' ? _options[this.id].export_map_ctrl : $(_options[this.id].export_map_ctrl);
				if(typeOf(_private[this.id].export_map_ctrl) != 'element') {
					throw new Error('The given export map controller is not a DOM element');
				}
			}
			
			_private[this.id].export_map_ctrl_event = function() { _options[this.id].export_map_callback(this.exportMap());}.bind(this);
			_private[this.id].export_map_ctrl.addEvent('click', _private[this.id].export_map_ctrl_event.bind(this));


		}.protect(),
		/**
 		 * @summary Removes the export map controller depending on the options.clear_map_ctrl value
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		removeExportMapController: function() {
			_private[this.id].export_map_ctrl.removeEvent('click', _private[this.id].export_map_ctrl_event);
			if(_options[this.id].export_map_ctrl === 'default') _private[this.id].export_map_ctrl.dispose();
		}.protect(),
		/**
 		 * @summary Sets the help tips map controller depending on the options.tips_map_ctrl value
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		setTipsMapController: function() {
			
			if(_options[this.id].tips_map_ctrl === 'default') {
				_private[this.id].tips_map_ctrl = new Element('div', {id: 'gmapdraw_tips_map_ctrl'});
				_private[this.id].tips_map_ctrl.inject(_private[this.id].ctrl_container);
			}
			else if(_options[this.id].tips_map_ctrl) {
				_private[this.id].tips_map_ctrl = typeOf(_options[this.id].tips_map_ctrl) === 'element' ? _options[this.id].tips_map_ctrl : $(_options[this.id].tips_map_ctrl);
				if(typeOf(_private[this.id].tips_map_ctrl) != 'element') {
					throw new Error('The given tips map controller is not a DOM element');
				}
			}

			if(_private[this.id].tips_map_ctrl) this.updateTips(this.initMapTips());

		}.protect(),
		/**
 		 * @summary Removes the tips map controller depending on the options.tips_map_ctrl value
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		removeTipsMapController: function() {
			if(_options[this.id].tips_map_ctrl === 'default') _private[this.id].tips_map_ctrl.dispose();
		}.protect(),
		/**
 		 * @summary Sets the geocoder input text field and its controllers
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		setGeocoderMapFieldController: function() {
			_private[this.id].geocoder_field = new Element('input', {id:'gmapdraw_geocoder_field', type: 'text', placeholder: 'insert an address'});
			_private[this.id].geocoder_center_button = new Element('input', {id: 'gmapdraw_geocoder_center_button', type: 'button', value: 'set map center'});
			_private[this.id].geocoder_draw_button = new Element('input', {id: 'gmapdraw_geocoder_draw_button', type: 'button', value: 'draw'});

			_private[this.id].geocoder_center_button.addEvent('click', this.geocoderCenter.bind(this));
			_private[this.id].geocoder_draw_button.addEvent('click', this.geocoderDraw.bind(this));

			_private[this.id].ctrl_container.adopt(_private[this.id].geocoder_field, _private[this.id].geocoder_center_button, _private[this.id].geocoder_draw_button);

		}.protect(),
		/**
 		 * @summary Removes the geocoder input text field and its controllers
		 * @memberof moomapdrawer.map.prototype
		 * @method
		 * @protected
		 * @return void
 		 */
		removeGeocoderMapField: function() {
			
			_private[this.id].geocoder_center_button.removeEvents();
			_private[this.id].geocoder_draw_button.removeEvents();
			[_private[this.id].geocoder_field, _private[this.id].geocoder_center_button, _private[this.id].geocoder_draw_button].each(function(el) { el.dispose(); });

		}.protect(),
		/**
 		 * @summary Sets the active drawing tool name
		 * @memberof moomapdrawer.map.prototype
		 * @param {moomapdrawer.tool|null} tool The actual drawing tool, null to have no active tool
		 * @return void
 		 */
		setDrawingTool: function(tool) {
			if(tool != null && !_private[this.id].tools.hasOwnProperty(tool.getToolName())) {
				throw new Error('Can\'t set the drawing tool since it\'s not active');
			}
			_private[this.id].drawing_tool = tool;
		},
		/**
 		 * @summary Gets the active drawing tool
		 * @memberof moomapdrawer.map.prototype
		 * @return {moomapdrawer.tool} The drawing tool
 		 */
		getDrawingTool: function() {
			return _private[this.id].drawing_tool;
		},
		/**
 		 * @summary Initializes the map set tools 
		 * @memberof moomapdrawer.map.prototype
		 * @return void
 		 */
		initTools: function() {
			for(var k in _private[this.id].tools) {
				if(_private[this.id].supported_tools.contains(k)) {
					_private[this.id].tools[k].activate();
				}
			}
		},
		/**
 		 * @summary Updates the text displayed in the tips controller 
		 * @memberof moomapdrawer.map.prototype
		 * @param {String} text The tip text
		 * @return void
 		 */
		updateTips: function(text) {
			if(_private[this.id].tips_map_ctrl) {
				_private[this.id].tips_map_ctrl.set('html', text);
			}
		},
		/**
 		 * @summary Returns the init text shown in the tips controller 
		 * @memberof moomapdrawer.map.prototype
		 * @return {String} text The initial tip text
 		 */
		initMapTips: function() {
			return 'Displays help tips about drawing tools';
		},
		/**	
		 * @summary Handles the click event over the map, calling the active tool handler  
		 * @memberof moomapdrawer.map.prototype
		 * @param {Object} point The callback parameter returned by the google.maps event handler
		 * @description This method is public since it has to be called by google maps api
		 * @return void
		 */
		mapClick: function(point) {

			if(moomapdrawer.debug) console.log('map click event triggered');

			if(_private[this.id].drawing_tool === null) {
				return false;
			}
			else {
				_private[this.id].drawing_tool.clickHandler(point);
			}
		},
		/**	
		 * @summary Sets the map center converting the geocoder_field input address in a LatLng point  
		 * @memberof moomapdrawer.map.prototype
		 * @return void
		 */
		geocoderCenter: function() {
			var request = {address: _private[this.id].geocoder_field.get('value')}
			_private[this.id].geocoder.geocode(request, function(results, status) {
				var result = results[0];
				if(status === 'OK') {
					_private[this.id].map.setCenter(result.geometry.location);
				}
				else {
					if(moomapdrawer.debug) console.log('geocoder response status: ' + status);
					alert(status);
				}
			}.bind(this));

		},
		/**	
		 * @summary Fires a map click in a LatLng point converted from the geocoder_field input address 
		 * @memberof moomapdrawer.map.prototype
		 * @return void
		 */
		geocoderDraw: function() {

			var request = {address: _private[this.id].geocoder_field.get('value')}
			_private[this.id].geocoder.geocode(request, function(results, status) {
				var result = results[0];
				if(status === 'OK') {
					if(_private[this.id].drawing_tool === null) alert('select a drawing tool');
					this.mapClick({latLng: result.geometry.location});
				}
				else {
					if(moomapdrawer.debug) console.log('geocoder response status: ' + status);
					alert(status);
				}
			}.bind(this));

		},
		/**
		 * @summary Clears the map 
		 * @memberof moomapdrawer.map.prototype
		 * @return void
		 */
		clearMap: function() {
			for(var k in _private[this.id].tools) {
				if(_private[this.id].supported_tools.contains(k)) {
					_private[this.id].tools[k].clear();
				}
			}
			if(moomapdrawer.debug) {
				console.log('map cleared');
			}
		},
		/**
		 * @summary Exports the map drawed shapes as data points 
		 * @memberof moomapdrawer.map.prototype
		 * @return {Object} data The drawed data in an object format
		 * @example
		 * {
		 * 	'point': [
		 * 		{lat: 45, lng: 12},
		 * 		{lat: 43, lng: 16}
		 * 	],
		 * 	'polyline': [
		 * 		[
		 * 			{lat: 45, lng: 12},
		 * 			{lat: 42, lng: 12},
		 * 			{lat: 42.6, lng: 11}
		 * 		],
		 * 		[
		 * 			{lat: 36.7, lng: 11.2},
		 * 			{lat: 39, lng: 12}
		 * 		],
		 * 	],
		 *	'circle': [
		 * 		{lat: 45, lng: 12, radius: 10000},
		 * 		{lat: 44, lng: 11, radius: 230000}
		 * 	]
		 * }
		 */
		exportMap: function() {
			
			var data = {};
	   
			for(var k in _private[this.id].tools) {
				if(_private[this.id].supported_tools.contains(k)) {
					data[k] = _private[this.id].tools[k].exportData();
				}
			}
			if(moomapdrawer.debug) {
				console.log(data);
				console.log('map exported');
			}

			return data;
		},
		/**
		 * @summary Imports data to the map 
		 * @description Data must be in the same form as the exported ones, see {@link moomapdrawer.map#exportMap} 
		 * @memberof moomapdrawer.map.prototype
		 * @param {Object} data The drawed data in an object format
		 */
		importMap: function(data) {
			if(typeOf(data.point) != 'null') {
				if(this.getTool('point') === null) {
					var ptool = new moomapdrawer.pointTool(this, null);
					this.addTool(ptool);
					ptool.activate();
				}
				this.getTool('point').importData(data.point);
			} 
			
			if(typeOf(data.polyline) != 'null') {
				if(this.getTool('polyline') === null) {
					var ptool = new moomapdrawer.polylineTool(this, null);
					this.addTool(ptool);
					ptool.activate();
				}
				this.getTool('polyline').importData(data.polyline);
			} 

			if(typeOf(data.polygon) != 'null') {
				if(this.getTool('polygon') === null) {
					var ptool = new moomapdrawer.polygonTool(this, null);
					this.addTool(ptool);
					ptool.activate();
				}
				this.getTool('polygon').importData(data.polygon);
			} 
			
			if(typeOf(data.circle) != 'null') {
				if(this.getTool('circle') === null) {
					var ctool = new moomapdrawer.circleTool(this, null);
					this.addTool(ctool);
					ctool.activate();
				}
				this.getTool('circle').importData(data.circle);
			} 
		},
		/**
 		 * @summary Returns the google map instance google.maps.Map  
		 * @memberof moomapdrawer.map.prototype
		 * @description The google map class instance allows to customize direclty some map properties using the google.maps.Map public interface
		 * @return {google.maps.Map} The google map instance
		 * @example
		 * var mygmap = moomapdrawer.map.gmap();
		 * mygmap.setCenter(new google.maps.LatLng(45, 7));
 		 */
		gmap: function() {
			return _private[this.id].map;	
		},
		/**
		 * @summary Sets the center of the map 
		 * @memberof moomapdrawer.map.prototype
		 * @param {Array} center The [lat, lng] coordinates array
		 * @return void
		 */
		setCenter: function(center) {
			_options[this.id].center = center;
			if(_private[this.id].map) {
				_private[this.id].map.setCenter(new google.maps.LatLng(center[0], center[1]));
			}	
		},
		/**
		 * @summary Sets the zoom of the map 
		 * @memberof moomapdrawer.map.prototype
		 * @param {Number} zoom The zoom level
		 * @return void
		 */
		setZoom: function(center) {
			_options[this.id].zoom = zoom;
			if(_private[this.id].map) {
				_private[this.id].map.setZoom(zoom);
			}	
		},
		/**
		 * @summary Sets the clear map controller 
		 * @memberof moomapdrawer.map.prototype
		 * @param {String|Element} ctrl The clear map controller. 
		 *                              If 'default' the built-in controller is used, if <code>null</code> the clear map 
		 *                              functionality is removed. If id attribute or an element the clear map functionality is attached to the element.
		 * @return void
		 */
		setClearMapCtrl: function(ctrl) {
			if(ctrl != _options[this.id].clear_map_ctrl) {
				this.removeClearMapController();
			}
			_options[this.id].clear_map_ctrl = ctrl;
			this.setClearMapController();
		},
		/**
		 * @summary Sets the export map controller 
		 * @memberof moomapdrawer.map.prototype
		 * @param {String|Element} ctrl The export map controller. 
		 *                              If 'default' the built-in controller is used, if <code>null</code> the export map 
		 *                              functionality is removed. If id attribute or an element the export map functionality is attached to the element.
		 * @return void
		 */
		setExportMapCtrl: function(ctrl) {
			if(ctrl != _options[this.id].export_map_ctrl) {
				this.removeExportMapController();
			}
			_options[this.id].export_map_ctrl = ctrl;
			this.setExportMapController();
		},
		/**
		 * @summary Sets the geocoder map field option 
		 * @memberof moomapdrawer.map.prototype
		 * @param {Boolean} set Whether or not to activate the geocoder functionality
		 * @return void
		 */
		setGeocoderMapField: function(set) {

			_options[this.id].geocoder_map_field = set;
			if(!set) {
				this.removeGeocoderMapField();
			}
			else {
				this.setGeocoderMapFieldController()
			}
		},
		/**
		 * @summary Sets the tips map controller 
		 * @memberof moomapdrawer.map.prototype
		 * @param {String|Element} ctrl The help tips map controller (shows tips about drawing tools). 
		 *                              If 'default' the built-in controller is used, if <code>null</code> the tips box is not shown, 
		 *                              if id attribute or an element the functionality is attached to the element.
		 * @return void
		 */
		setTipsMapCtrl: function(ctrl) {
			if(ctrl != _options[this.id].tips_map_ctrl) {
				this.removeTipsMapController();
			}
			_options[this.id].tips_map_ctrl = ctrl;
			this.setTipsMapController();
		}
	});
}());


moomapdrawer.tool = (function()  {

	// protected properties
	var _protected_prop = {};

	var _options = {};

	return new Class({

		/**
		 * @summary Google maps drawing tool class. 
		 * @classdesc <p>This class is the superclass for all gmapdraw tools, extended by all specific tools.</p>
		 *            <p><b>DO NOT INSTANTIATE THIS CLASS DIRECLTY</b>, use its children instead.</p> 
		 * @constructs moomapdrawer.tool
		 * @param {Number} id The identifier of the child class
		 * @param {moomapdrawer.map} map The gmapdraw map instance which handles the tool
		 * @param {String|Element} ctrl The id attribute or the element itself which controls the tool when clicking over it
		 * @param {String} tool_name The drawing tool name
		 *
		 */
		initialize: function(id, map, ctrl, tool_name) {

			this.id = id;

			_protected_prop[this.id] = {};

			_protected_prop[this.id].active = false;
			_protected_prop[this.id].map = null;
			_protected_prop[this.id].ctrl = null;
			_protected_prop[this.id].ctrl_param = null;
			_protected_prop[this.id].tool_name = null;
			_protected_prop[this.id].items = [];

			_protected_prop[this.id].map = map;
			_protected_prop[this.id].tool_name = tool_name;

			// store the ctrl given, will be used when the tool is activated.
			_protected_prop[this.id].ctrl_param = ctrl;

			// next click has to begin a new shape?
			_protected_prop[this.id].next_shape = false;
			// array storing all the drawed items
			_protected_prop[this.id].items_array = [];

			_options[this.id] = {};

			_options[this.id].max_items_allowed = 3;

		},
		/** 
		 * @summary Returns the class options
		 * @memberof moomapdrawer.tool.prototype
		 * @method
		 * @protected
		 * @return {Object} The class options object 
		 */
		options: function() {
			return _options[this.id];
		}.protect(),
		/** 
		 * @summary Returns the class protected properties
		 * @memberof moomapdrawer.tool.prototype
		 * @method
		 * @protected 
		 * @return {Object} The class protected properties object 
		 */
		protectedProp: function() {
			return _protected_prop[this.id];
		}.protect(),
		/** 
		 * @summary Sets the tool controller
		 * @memberof moomapdrawer.tool.prototype
		 * @method
		 * @param {String/Element} [ctrl=null] The id attribute or the element itself which serves as the tool controller, if <code>null</code> the default controller is used.
		 * @protected
		 * @return void
		 */
		setController: function(ctrl) {
			if(typeOf(ctrl) === 'string' || typeOf(ctrl) === 'element') {
				if(typeOf(ctrl) === 'string') _protected_prop[this.id].ctrl = $(ctrl);
				if(typeOf(_protected_prop[this.id].ctrl != 'element')) {
					throw new Error('the given ctrl for the ' + _protected_prop[this.id].tool_name + 'tool is not a DOM element')
				}
			}
			// default
			else {
				_protected_prop[this.id].ctrl = new Element('div', {id: 'gmapdraw_' + _protected_prop[this.id].tool_name + '_tool'}).set('text', _protected_prop[this.id].tool_name); 
				_protected_prop[this.id].map.addDefaultCtrl(_protected_prop[this.id].ctrl);
			}
		}.protect(),
		/** 
		 * @summary Removes the default tool controller
		 * @memberof moomapdrawer.tool.prototype
		 * @method
		 * @protected
		 * @return void
		 */
		removeController: function() {
			_protected_prop[this.id].ctrl.dispose();
			_protected_prop[this.id].ctrl = null;
		}.protect(),
		/** 
		 * @summary Activates the tool
		 * @memberof moomapdrawer.tool.prototype
		 * @return void
		 */
		activate: function() {

			_protected_prop[this.id].active = true;

			this.setController(_protected_prop[this.id].ctrl_param);

			_protected_prop[this.id].ctrl.addEvent('click', this.setDrawing.bind(this));

			_protected_prop[this.id].ctrl.removeClass('inactive');
			_protected_prop[this.id].ctrl.addClass('active');

			if(moomapdrawer.debug) console.log(_protected_prop[this.id].tool_name + ' tool activated')
			
		},
		/** 
		 * @summary Removes the tool
		 * @memberof moomapdrawer.tool.prototype
		 * @param {Boolean} [remove_ctrl=false] Whether or not to remove the tool control if the default one
		 * @return void
		 */
		deactivate: function(remove_ctrl) {

			if(!remove_ctrl) remove_ctrl = false;

			if(_protected_prop[this.id].active === true) {
				_protected_prop[this.id].active = false;

				_protected_prop[this.id].ctrl.removeClass('active');
				_protected_prop[this.id].ctrl.addClass('inactive');

				_protected_prop[this.id].ctrl.removeEvent('click', this.setDrawing);

				if(_protected_prop[this.id].map.getDrawingTool() === this) {
					_protected_prop[this.id].map.setDrawingTool(null);
				}

				if(remove_ctrl && _protected_prop[this.id].ctrl_param == null) {
					this.removeController();
				}

				if(moomapdrawer.debug) console.log(_protected_prop[this.id].tool_name + ' tool deactivated')
			}
			else {
				if(remove_ctrl && _protected_prop[this.id].ctrl_param == null) {
					this.removeController();
				}
				if(moomapdrawer.debug) console.log(_protected_prop[this.id].tool_name + ' tool already deactivated')
			}
			
		},
		/** 
		 * @summary Sets the current drawing tool
		 * @memberof moomapdrawer.tool.prototype
		 * @return void
		 */
		setDrawing: function() {
			if(moomapdrawer.debug) console.log('drawing tool: ' + _protected_prop[this.id].tool_name);
			this.prepareTool();
			_protected_prop[this.id].map.setDrawingTool(this);
		},
		/** 
		 * @summary Prepares the current drawing tool
		 * @memberof moomapdrawer.tool.prototype
		 * @return void
		 */
		prepareTool: function() {
			_protected_prop[this.id].map.updateTips(this.tipsText());
		},
		/** 
		 * @summary Adds an item to the items
		 * @memberof moomapdrawer.tool.prototype
		 * @param {Object} item a google map shape
		 * @return void
		 */
		addItem: function(item) {
			_protected_prop[this.id].items.push(item); 
		},
		/** 
		 * @summary Sets the maximum number of items that the tool may draw
		 * @memberof moomapdrawer.tool.prototype
		 * @param max The maximum number of drawable items
		 * @return void
		 */
		setMaxItemsAllowed: function(max) {
			_options[this.id].max_items_allowed = max.toInt();
		},
		/** 
		 * @summary Sets the value of the next shape property (a new click starts a new shape if true)
		 * @memberof moomapdrawer.tool.prototype
		 * @param next_shape Whether or not next click has to start a new shape
		 * @return void
		 */
		setNextShape: function(next_shape) {
			_protected_prop[this.id].next_shape = !!next_shape;      
		},
		/** 
		 * @summary Returns the tool name
		 * @memberof moomapdrawer.tool.prototype
		 * @return {String} The tool name
		 */
		getToolName: function() {
			return _protected_prop[this.id].tool_name;
		}

	});
	

}());

moomapdrawer.pointTool = (function() {

	// protected properties
	var _protected_prop = {};

	// class options
	var _specific_options = {};
	var _options = {};

	return new Class({

		Extends: moomapdrawer.tool,
		/**
		 * @summary Google maps drawing point tool class. Provides methods to draw over the {@link moomapdrawer.map} instance
		 * @classdesc <p>The point drawing tool class, which allows to draw points over the gmapdraw map instance.</p> 
		 * @constructs moomapdrawer.pointTool
		 * @extends moomapdrawer.tool
		 * @param {moomapdrawer.map} map The gmapdraw map instance which handles the tool
		 * @param {String|Element} ctrl The id attribute or the element itself which controls the tool when clicking over it
		 * @param {Object} options A class options object
		 * @param {Number} [options.max_items_allowed=3] The maximum number of shapes the tool may draw.
		 *
		 */
		initialize: function(map, ctrl, options) {

			this.id = moomapdrawer.instances_ids++;

			this.parent(this.id, map, ctrl, 'point'); // also sets options

			_specific_options[this.id] = {};
			_options[this.id] = {};

			// merge given options with deafult ones
			_options[this.id] = Object.merge(this.options(), _specific_options[this.id], options);
			// constructs protected properties
			_protected_prop[this.id] = this.protectedProp();

		},
		/** 
		 * @summary Returns the tool help tip text
		 * @memberof moomapdrawer.pointTool.prototype
		 * @return {String} The tips text
		 */
		tipsText: function() {
			return 'Click on the map to set draggable markers points. Right click on a marker to delete it';
		},
		/** 
		 * @summary Handles the click event over the map when the tool is the drawing one
		 * @memberof moomapdrawer.pointTool.prototype
		 * @return void
		 */
		clickHandler: function(evt) {

			// maximum number of points reached
			if(!(_protected_prop[this.id].items.length < _options[this.id].max_items_allowed)) {
				if(moomapdrawer.debug) console.log('maximum number of points drawed');
				alert('Maximum number of insertable points reached');
				return null; 
			}

			var marker = new google.maps.Marker({
				position: evt.latLng,
				draggable: true,
				map: _protected_prop[this.id].map.gmap()
			});

			_protected_prop[this.id].items.push(marker);

			if(moomapdrawer.debug) {
				google.maps.event.addListener(marker, 'dragend', this.updateInfo.bind(this));
			}
			google.maps.event.addListener(marker, 'rightclick', function() {
				marker.setMap(null);
				_protected_prop[this.id].items.erase(marker);
				if(moomapdrawer.debug) this.updateInfo();
			}.bind(this));


			if(moomapdrawer.debug) {
				console.log('point drawed');
				this.updateInfo();
			}
			
		},
		/** 
		 * @summary Displays information about rawed points in the console
		 * @memberof moomapdrawer.pointTool.prototype
		 * @return void
		 */
		updateInfo: function() {
			var info = '';    

			_protected_prop[this.id].items.each(function(point, index) {
				info += 'point #' + (index+1) + ' (lat, lng): (' + point.getPosition().lat() + ', ' + point.getPosition().lng() + ')\n';
			});

			console.log(info);
			console.log('updated points info');

		},
		/** 
		 * @summary Clears all drawed points
		 * @memberof moomapdrawer.pointTool.prototype
		 * @return void
		 */
		clear: function() {
			       
			_protected_prop[this.id].items.each(function(marker) {
			       marker.setMap(null);
			});	
			_protected_prop[this.id].items = [];

			if(moomapdrawer.debug) {
				console.log('points cleared');
			}
		},
		/** 
		 * @summary Returns all the drawed points data
		 * @memberof moomapdrawer.pointTool.prototype
		 * @return {Array} data An array of objects representing the drawed points coordinates
		 * @example
		 * [{lat: 45, lng: 7}, {lat: 33, lng: 15}, {lat: 42, lng: 5}]
		 */
		exportData: function() {
			      
			var data = []; 

			_protected_prop[this.id].items.each(function(marker) {
			       var dobj = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()};
				data.push(dobj);
			});	

			return data;
		},
		/** 
		 * @summary Imports the data as points
		 * @memberof moomapdrawer.pointTool.prototype
		 * @param {Array} data An array of objects representing the points coordinates
		 * @example
		 * [{lat: 45, lng: 7}, {lat: 33, lng: 15}, {lat: 42, lng: 5}]
		 */
		importData: function(data) {

			for(var i = 0; i < data.length; i++) {
				var point = data[i];
				this.clickHandler({latLng: new google.maps.LatLng(point.lat, point.lng)});
			}
		}

	});
		

}());

moomapdrawer.polylineTool = (function() {

	// protected properties
	var _protected_prop = {};

	// class options
	var _specific_options = {};
	var _options = {};

	return new Class({

		Extends: moomapdrawer.tool,
		/**
		 * @summary Google maps drawing polyline tool class. Provides methods to draw over the {@link moomapdrawer.map} instance
		 * @classdesc <p>The polyline drawing tool class, which allows to draw polylines over the gmapdraw map instance.</p> 
		 * @constructs moomapdrawer.polylineTool
		 * @extends moomapdrawer.tool
		 * @param {moomapdrawer.map} map The gmapdraw map instance which handles the tool
		 * @param {String|Element} ctrl The id attribute or the element itself which controls the tool when clicking over it
		 * @param {Object} options A class options object
		 * @param {Number} [options.max_items_allowed=3] The maximum number of shapes the tool may draw.
		 *
		 */
		initialize: function(map, ctrl, options) {

			this.id = moomapdrawer.instances_ids++;

			this.parent(this.id, map, ctrl, 'polyline'); // also sets options

			_specific_options[this.id] = {};

			_protected_prop[this.id] = {
				next_shape: false,
				active_polyline_index: null
			};

			// merge given options with deafult ones
			_options[this.id] = Object.merge(this.options(), _specific_options[this.id], options);
			// constructs protected properties
			_protected_prop[this.id] = Object.merge(this.protectedProp(), _protected_prop[this.id]);

		},
		/** 
		 * @summary Returns the tool help tip text
		 * @memberof moomapdrawer.polylineTool.prototype
		 * @return {String} The tips text
		 */
		tipsText: function() {
			return 'Click on the map to add polyline points, click the menu voice again to create a new polyline. Right click on existing polylines to delete them';
		},
		/** 
		 * @summary Prepares the tool
		 * @memberof moomapdrawer.polylineTool.prototype
		 * @return void
		 */
		prepareTool: function() {
			this.parent();
			_protected_prop[this.id].next_shape = true;
		},
		/** 
		 * @summary Handles the click event over the map when the tool is the drawing one
		 * @memberof moomapdrawer.polylineTool.prototype
		 * @return void
		 */
		clickHandler: function(evt) {

			// if next shape && maximum shape number is not reached
			if(_protected_prop[this.id].next_shape && _protected_prop[this.id].items.length < _options[this.id].max_items_allowed) {
				var polylinePath = new google.maps.MVCArray([evt.latLng]); // store the point of the polyline
				var polyline = new google.maps.Polyline({
					editable: true,
					path: polylinePath,
					map: _protected_prop[this.id].map.gmap()
				}); 

				var polyline_item = {path: polylinePath, shape: polyline};
				_protected_prop[this.id].items.push(polyline_item);

				_protected_prop[this.id].active_polyline_index = _protected_prop[this.id].items.indexOf(polyline_item);

				// right click to delete one
				google.maps.event.addListener(polyline, 'rightclick', function() {
					polyline.setMap(null);
					_protected_prop[this.id].items.erase(polyline_item);
					_protected_prop[this.id].active_polyline_index--; // one item has been removed, indexes shift down
					_protected_prop[this.id].next_shape = true; // otherwise next click will populate the last polyline
					if(moomapdrawer.debug) this.updateInfo();
				}.bind(this));

				if(moomapdrawer.debug) {
					google.maps.event.addListener(polylinePath, 'insert_at', this.updateInfo.bind(this));
					google.maps.event.addListener(polylinePath, 'remove_at', this.updateInfo.bind(this));
					google.maps.event.addListener(polylinePath, 'set_at', this.updateInfo.bind(this));
					console.log('polyline point added');
					this.updateInfo();
				}

				_protected_prop[this.id].next_shape = false;
			
			}
			// maximum number exceeded
			else if(_protected_prop[this.id].next_shape) {
				if(moomapdrawer.debug) console.log('maximum number of polylines drawed');
				alert('Maximum number of insertable polylines reached');
				return null;
			}
			// add a point to the current polyline
			else {
				_protected_prop[this.id].items[_protected_prop[this.id].active_polyline_index].path.push(evt.latLng);
			}
			
		},
		/** 
		 * @summary Displays information about rawed points in the console
		 * @memberof moomapdrawer.polylineTool.prototype
		 * @return void
		 */
		updateInfo: function() {

			var info = '';    
			
			_protected_prop[this.id].items.each(function(polyline, index) {
				info += 'Polyline #' + (index + 1) + '\n';
				polyline.path.forEach(function(point, index) {
					info += '\tpoint #' + (index + 1) + ' (lat, lng): (' + point.lat() + ', ' + point.lng() + ')\n';
				});
			}.bind(this));

			console.log(info);
			console.log('updated polyline info');

		},
		/** 
		 * @summary Clears all drawed points
		 * @memberof moomapdrawer.polylineTool.prototype
		 * @return void
		 */
		clear: function() {
			       
			_protected_prop[this.id].items.each(function(polyline) {
				polyline.shape.setMap(null);
			});
			_protected_prop[this.id].items = [];

			if(moomapdrawer.debug) {
				console.log('polylines cleared');
			}
		},
		/** 
		 * @summary Returns all the drawed points data
		 * @memberof moomapdrawer.polylineTool.prototype
		 * @return {Array} data An array of arrays of objects representing the polylines' points coordinates
		 * @example
		 * // two polylines, the first with 2 points, the second with 3 points.
		 * [[{lat: 45, lng:7}, {lat:46, lng:7}], [{lat: 42, lng: 11}, {lat: 41, lng: 10.8}, {lat: 44, lng: 8}]]
		 */
		exportData: function() {
			      
			var data = []; 

			_protected_prop[this.id].items.each(function(polyline) {
				var darr = [];
				polyline.path.forEach(function(point, index) {
					var dobj = {lat: point.lat(), lng: point.lng()};
					darr.push(dobj);
				});
				data.push(darr);
			});
			
			return data;
		},
		/** 
		 * @summary Imports the data as polylines
		 * @memberof moomapdrawer.polylineTool.prototype
		 * @param {Array} data An array of arrays of objects representing the polylines' points coordinates
		 * @example
		 * // two polylines, the first with 2 points, the second with 3 points.
		 * [[{lat: 45, lng:7}, {lat:46, lng:7}], [{lat: 42, lng: 11}, {lat: 41, lng: 10.8}, {lat: 44, lng: 8}]]
		 */
		importData: function(data) {
			    
			for(var i = 0; i < data.length; i++) {
				var polyline = data[i];
				this.prepareTool();
				for(var ii = 0; ii < polyline.length; ii++) {
					var point = polyline[ii];
					this.clickHandler({latLng: new google.maps.LatLng(point.lat, point.lng)});
				}
			}
		}

	});
		

}());

moomapdrawer.polygonTool = (function() {

	// protected properties
	var _protected_prop = {};

	// class options
	var _specific_options = {};
	var _options = {};

	return new Class({

		Extends: moomapdrawer.tool,
		/**
		 * @summary Google maps drawing polygon tool class. Provides methods to draw over the {@link moomapdrawer.map} instance
		 * @classdesc <p>The polygon drawing tool class, which allows to draw polygons over the gmapdraw map instance.</p>
		 * @constructs moomapdrawer.polygonTool
		 * @extends moomapdrawer.tool
		 * @param {moomapdrawer.map} map The gmapdraw map instance which handles the tool
		 * @param {String|Element} ctrl The id attribute or the element itself which controls the tool when clicking over it
		 * @param {Object} options A class options object
		 * @param {Number} [options.max_items_allowed=3] The maximum number of shapes the tool may draw.
		 *
		 */
		initialize: function(map, ctrl, options) {

			this.id = moomapdrawer.instances_ids++;

			this.parent(this.id, map, ctrl, 'polygon'); // also sets options

			_specific_options[this.id] = {};

			_protected_prop[this.id] = {
				next_shape: false,
				active_polygon_index: null
			};

			// merge given options with deafult ones
			_options[this.id] = Object.merge(this.options(), _specific_options[this.id], options);
			// constructs protected properties
			_protected_prop[this.id] = Object.merge(this.protectedProp(), _protected_prop[this.id]);

		},
		/** 
		 * @summary Returns the tool help tip text
		 * @memberof moomapdrawer.polygonTool.prototype
		 * @return {String} The tips text
		 */
		tipsText: function() {
			return 'Click on the map to add polygon\'s vertices, click the menu voice again to create a new shape. Right click on existing polygons to delete them';
		},
		/** 
		 * @summary Prepares the tool
		 * @memberof moomapdrawer.polygonTool.prototype
		 * @return void
		 */
		prepareTool: function() {
			this.parent();
			_protected_prop[this.id].next_shape = true;
		},
		/** 
		 * @summary Handles the click event over the map when the tool is the drawing one
		 * @memberof moomapdrawer.polygonTool.prototype
		 * @return void
		 */
		clickHandler: function(evt) {

			// if next shape && maximum shape number is not reached
			if(_protected_prop[this.id].next_shape && _protected_prop[this.id].items.length < _options[this.id].max_items_allowed) {
				var polygonPath = new google.maps.MVCArray([evt.latLng]); // store the point of the polyline
				var polygon = new google.maps.Polygon({
					editable: true,
					path: polygonPath,
					map: _protected_prop[this.id].map.gmap()
				}); 

				var polygon_item = {path: polygonPath, shape: polygon};
				_protected_prop[this.id].items.push(polygon_item);

				_protected_prop[this.id].active_polygon_index = _protected_prop[this.id].items.indexOf(polygon_item);

				// right click to delete one
				google.maps.event.addListener(polygon, 'rightclick', function() {
					polygon.setMap(null);
					_protected_prop[this.id].items.erase(polygon_item);
					_protected_prop[this.id].active_polygon_index--; // one item has been removed, indexes shift down
					_protected_prop[this.id].next_shape = true; // otherwise next click will populate the last polyline
					if(moomapdrawer.debug) this.updateInfo();
				}.bind(this));

				if(moomapdrawer.debug) {
					google.maps.event.addListener(polygonPath, 'insert_at', this.updateInfo.bind(this));
					google.maps.event.addListener(polygonPath, 'remove_at', this.updateInfo.bind(this));
					google.maps.event.addListener(polygonPath, 'set_at', this.updateInfo.bind(this));
					console.log('polygon vertex added');
					this.updateInfo();
				}

				_protected_prop[this.id].next_shape = false;
			
			}
			// maximum number exceeded
			else if(_protected_prop[this.id].next_shape) {
				if(moomapdrawer.debug) console.log('maximum number of polygons drawed');
				alert('Maximum number of insertable polygons reached');
				return null;
			}
			// add a point to the current polygon
			else {
				_protected_prop[this.id].items[_protected_prop[this.id].active_polygon_index].path.push(evt.latLng);
			}
		},
		/** 
		 * @summary Displays information about rawed points in the console
		 * @memberof moomapdrawer.polygonTool.prototype
		 * @return void
		 */
		updateInfo: function() {

			var info = '';    
			
			_protected_prop[this.id].items.each(function(polygon, index) {
				info += 'Polygon #' + (index + 1) + '\n';
				polygon.path.forEach(function(point, index) {
					info += '\tpoint #' + (index + 1) + ' (lat, lng): (' + point.lat() + ', ' + point.lng() + ')\n';
				});
			}.bind(this));

			console.log(info);
			console.log('updated polygon info');

		},
		/** 
		 * @summary Clears all drawed points
		 * @memberof moomapdrawer.polygonTool.prototype
		 * @return void
		 */
		clear: function() {
			       
			_protected_prop[this.id].items.each(function(polygon) {
				polygon.shape.setMap(null);
			});
			_protected_prop[this.id].items = [];

			if(moomapdrawer.debug) {
				console.log('polygons cleared');
			}
		},
		/** 
		 * @summary Returns all the drawed points data
		 * @memberof moomapdrawer.polygonTool.prototype
		 * @return {Array} data An array of arrays of objects representing the polygons' vertex coordinates
		 * @example
		 * // two polygons, the first with 3 vertexes, the second with 4 vertexes.
		 * [[{lat: 45, lng:7}, {lat:46, lng:7}, {lat: 42, lng: 11}], [{lat: 42, lng: 11}, {lat: 41, lng: 10.8}, {lat: 44, lng: 8}, {lat: 33, lng: 12}]]
		 */
		exportData: function() {
			      
			var data = []; 

			_protected_prop[this.id].items.each(function(polygon) {
				var darr = [];
				polygon.path.forEach(function(point, index) {
					var dobj = {lat: point.lat(), lng: point.lng()};
					darr.push(dobj);
				});
				data.push(darr);
			});
			
			return data;
		},
		/** 
		 * @summary Imports the data as polygons
		 * @memberof moomapdrawer.polygonTool.prototype
		 * @param {Array} data An array of arrays of objects representing the polygons' vertex coordinates
		 * @example
		 * // two polygons, the first with 3 vertexes, the second with 4 vertexes.
		 * [[{lat: 45, lng:7}, {lat:46, lng:7}, {lat: 42, lng: 11}], [{lat: 42, lng: 11}, {lat: 41, lng: 10.8}, {lat: 44, lng: 8}, {lat: 33, lng: 12}]]
		 */
		importData: function(data) {
			    
			for(var i = 0; i < data.length; i++) {
				var polygon = data[i];
				this.prepareTool();
				for(var ii = 0; ii < polygon.length; ii++) {											var point = polygon[ii];
					this.clickHandler({latLng: new google.maps.LatLng(point.lat, point.lng)});
				}
			}
		}

	});
		

}());

moomapdrawer.circleTool = (function() {

	// protected properties
	var _protected_prop = {};

	// class options
	var _specific_options = {};
	var _options = {};

	return new Class({

		Extends: moomapdrawer.tool,
		/**
		 * @summary Google maps drawing circle tool class. Provides methods to draw over the {@link moomapdrawer.map} instance
		 * @classdesc <p>The circle drawing tool class, which allows to draw circles over the gmapdraw map instance.</p>
		 * @constructs moomapdrawer.circleTool
		 * @extends moomapdrawer.tool
		 * @param {moomapdrawer.map} map The gmapdraw map instance which handles the tool
		 * @param {String|Element} ctrl The id attribute or the element itself which controls the tool when clicking over it
		 * @param {Object} options A class options object
		 * @param {Number} [options.max_items_allowed=3] The maximum number of shapes the tool may draw.
		 *
		 */
		initialize: function(map, ctrl, options) {

			this.id = moomapdrawer.instances_ids++;

			this.parent(this.id, map, ctrl, 'circle'); // also sets options

			_specific_options[this.id] = {};

			_protected_prop[this.id] = {
				next_shape: false,
				circle_drawing: null,
				map_move_listener: null,
				circle_move_listener: null
			};

			// merge given options with deafult ones
			_options[this.id] = Object.merge(this.options(), _specific_options[this.id], options);
			// constructs protected properties
			_protected_prop[this.id] = Object.merge(this.protectedProp(), _protected_prop[this.id]);

		},
		/** 
		 * @summary Returns the tool help tip text
		 * @memberof moomapdrawer.circleTool.prototype
		 * @return {String} The tips text
		 */
		tipsText: function() {
			return 'Click on the map to add circles. Right click on existing circles to delete them';
		},
		/** 
		 * @summary Prepares the tool
		 * @memberof moomapdrawer.circleTool.prototype
		 * @return void
		 */
		prepareTool: function() {
			this.parent();
			_protected_prop[this.id].next_shape = true;
		},
		/** 
		 * @summary Handles the click event over the map when the tool is the drawing one
		 * @memberof moomapdrawer.circleTool.prototype
		 * @return void
		 */
		clickHandler: function(evt) {

			// if next shape && maximum shape number is not reached
			if(!_protected_prop[this.id].circle_drawing && _protected_prop[this.id].items.length < _options[this.id].max_items_allowed) {
				var circle = new google.maps.Circle({
					center: evt.latLng,
					map: _protected_prop[this.id].map.gmap(),
					radius: 1,
					editable: true
				});	

				_protected_prop[this.id].circle_drawing = true;

				// enlarge
				_protected_prop[this.id].map_move_listener = google.maps.event.addListener(_protected_prop[this.id].map.gmap(), 'mousemove', function(evt2) {
					circle.setRadius(this.distance(evt.latLng, evt2.latLng));	
				}.bind(this));
				// reduce
				_protected_prop[this.id].circle_move_listener = google.maps.event.addListener(circle, 'mousemove', function(evt2) {
					circle.setRadius(this.distance(evt.latLng, evt2.latLng));	
				}.bind(this));
				// end

				google.maps.event.addListenerOnce(circle, 'click', function(evt2) {
					google.maps.event.removeListener(_protected_prop[this.id].map_move_listener);
					google.maps.event.removeListener(_protected_prop[this.id].circle_move_listener);
					_protected_prop[this.id].circle_drawing = false;

					if(moomapdrawer.debug) this.updateInfo();
				}.bind(this));

				_protected_prop[this.id].items.push(circle);

				// right click to delete one
				google.maps.event.addListener(circle, 'rightclick', function() {
					circle.setMap(null);
					_protected_prop[this.id].items.erase(circle);
					_protected_prop[this.id].next_shape = true; // otherwise next click will populate the last circle
					if(moomapdrawer.debug) this.updateInfo();
				}.bind(this));

			}
			else if(!_protected_prop[this.id].circle_drawing && _protected_prop[this.id].items.length >= _options[this.id].max_items_allowed) {
				if(moomapdrawer.debug) console.log('maximum number of circles drawed');
				alert('Maximum number of insertable circles reached');
				return null;
			}
			// currently drawing
			else {
				google.maps.event.removeListener(_protected_prop[this.id].map_move_listener);
				google.maps.event.removeListener(_protected_prop[this.id].circle_move_listener);
				_protected_prop[this.id].circle_drawing = false;

				if(moomapdrawer.debug) this.updateInfo();
			}
		},
		/** 
		 * @summary Displays information about rawed points in the console
		 * @memberof moomapdrawer.circleTool.prototype
		 * @return void
		 */
		updateInfo: function() {

			var info = '';    
			
			_protected_prop[this.id].items.each(function(circle, index) {
				info += 'Circle #' + (index + 1) + '\n';
				info += '\tcenter (lat, lng): (' + circle.getCenter().lat() + ', ' + circle.getCenter().lng() + ')\n';
				info += '\tradius: ' +  circle.getRadius() + '\n';
				
			}.bind(this));

			console.log(info);
			console.log('updated circle info');

		},
		/** 
		 * @summary Clears all drawed points
		 * @memberof moomapdrawer.circleTool.prototype
		 * @return void
		 */
		clear: function() {
			       
			_protected_prop[this.id].items.each(function(circle) {
				circle.setMap(null);
			});
			_protected_prop[this.id].items = [];

			if(moomapdrawer.debug) {
				console.log('circles cleared');
			}
		},
		/**
		 * @summary Returns the distance between 2 google.maps.LatLng points
		 * @memberof moomapdrawer.circleTool.prototype
		 * @param {google.maps.LatLng} point1 The first point
		 * @param {google.maps.LatLng} point2 The second point
		 * @return {Number} The distance in meters
		 */
		distance: function(point1, point2) {
			var R = 6371000; // earth's radius in meters
			var d_lat = (point2.lat() - point1.lat()) * Math.PI / 180;
			var d_lon = (point2.lng() - point1.lng()) * Math.PI / 180;
			var a = Math.sin(d_lat/2) * Math.sin(d_lat/2) +
			  Math.cos(point1.lat() * Math.PI / 180 ) * Math.cos(point2.lat() * Math.PI / 180 ) *
			  Math.sin(d_lon/2) * Math.sin(d_lon/2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			var d = R * c;

			return d;
		},
		/** 
		 * @summary Returns all the drawed points data
		 * @memberof moomapdrawer.circleTool.prototype
		 * @return {Array} data An array objects representing the circle's properties
		 * @example
		 * [{lat: 45, lng: 7, radius: 40000}, {lat: 35, lng: 15, radius: 650000}]
		 */
		exportData: function() {
			      
			var data = []; 
			
			_protected_prop[this.id].items.each(function(circle, index) {
				var dobj = {lat: circle.getCenter().lat(), lng: circle.getCenter().lng(), radius: circle.getRadius()};
				data.push(dobj);

			}.bind(this));
			
			return data;
		},
		/** 
		 * @summary Imports all data as circles
		 * @memberof moomapdrawer.circleTool.prototype
		 * @param {Array} data An array objects representing the circle's properties
		 * @example
		 * [{lat: 45, lng: 7, radius: 40000}, {lat: 35, lng: 15, radius: 650000}]
		 */
		importData: function(data) {
			    
			for(var i = 0; i < data.length; i++) {
				var circle = data[i];
					
				var dcircle = new google.maps.Circle({
					center: new google.maps.LatLng(circle.lat, circle.lng),
					map: _protected_prop[this.id].map.gmap(),
					radius: circle.radius,
					editable: true
				});

				this.addItem(dcircle);	

				// right click to delete one
				google.maps.event.addListener(dcircle, 'rightclick', function() {
					dcircle.setMap(null);
					_protected_prop[this.id].items.erase(dcircle);
					_protected_prop[this.id].next_shape = true; // otherwise next click will populate the last circle
					if(moomapdrawer.debug) this.updateInfo();
				}.bind(this));
			}
		}

	});

}());
