/// <reference path="OpenLayers.d.ts" />
module OpenLayersTest {

    // Class
    export class OpenLayer {
        // Constructor
        constructor() {
            
            //Create default map controls
            var controls = [new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar(), // <-- this pan/zoom control is styled by images
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine(),
            ];

            //Create the map
            var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
            var map = new OpenLayers.Map({
                // These projections are all webmercator, but the openlayers layer wants 900913 specifically
                projection: new OpenLayers.Projection("EPSG:3857"), //3857 //4326            900913
                units: "m",
                numZoomLevels: 16,
                controls: controls
            });

        
        }
    }

}

// Local variables
var ol: OpenLayersTest.OpenLayer = new OpenLayersTest.OpenLayer();
