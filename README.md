moomapdrawer
===========

![Screenshot](http://github.com/abidibo/moomapdrawer/raw/master/logo.jpg)

moomapdrawer is a plugin which lets you draw shapes (point, polyline, polygon, circle) over a google map (api v3) with the mouse or through geocoding. Such shapes may be exported and passed to a callback function in order to save them. It is possible also to import shapes and edit them so that is the perfect plugin to use in a insert/edit format for geolocalization.

Important
----------

moomapdrawer development has been ceased. The library has been replaced in favour of [geodrawer](https://github.com/abidibo/geodrawer), which is cooler, more easy to install and mantain, less intrusive and with a nice development environment involving nodejs, webpack and babel.

How to use
----------

moomapdrawer requires 

- core/1.4.4 

**Include google maps api**
	see https://developers.google.com/maps/documentation/javascript/tutorial to obtain an api key

**Include mootools framework and moopopup plugin**

	<script src="path-to-mootools-framework" type="text/javascript"></script>
	<script src="path-to-moomapdrawer-js" type="text/javascript"></script>

**Include moomapdrawer stylesheet**

	<link href="path-to-moomapdrawer-css" type="text/css" rel="stylesheet" />

**Example code**

Javascript:

	window.addEvent('load', function() {
		mymap = new moomapdrawer.map('map_example_1', {
			tools: {
				point: {
					options: {
						max_items: 5
					}
				},
				polyline: {},
				polygon: {},
				circle: {}
			},
			tips_map_ctrl: 'tool_info',
			export_map_callback: function(data) { alert(JSON.stringify(data)); }
		});
		mymap.render();
		mymap.importMap({
			'point': [{lat: 45.575, lng: 6.17}],
			'polyline': [[{lat: 45.135, lng: 4.583}, {lat: 44.879, lng: 4.692}, {lat: 44.840, lng: 4.857}]],
			'polygon': [[{lat: 45.108, lng: 5.302}, {lat: 44.832, lng: 5.401}, {lat: 44.770, lng: 5.89}, {lat: 45.08, lng:6.09}, {lat: 45.236, lng: 5.78}]],
			'circle': [{lat: 44.895, lng: 7.093, radius: 16310}]
		}); 
	})

For more demos please visit the moomapdrawer demo page at http://www.abidibo.net/projects/js/moomapdrawer/demo

Screenshots
-----------

![Screenshot](http://github.com/abidibo/moomapdrawer/raw/master/Docs/mmd_screenshot1.png)

Links
-----------------

The project page: http://www.abidibo.net/projects/js/moomapdrawer  
The documentation page: http://www.abidibo.net/projects/js/moomapdrawer/doc   
The demo page: http://www.abidibo.net/projects/js/moomapdrawer/demo

Please report bugs, errors and advices in the github project page: http://github.com/abidibo/moomapdrawer

