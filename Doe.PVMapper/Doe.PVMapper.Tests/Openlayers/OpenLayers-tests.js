/// <reference path="OpenLayers.d.ts" />
var OpenLayersTest;
(function (OpenLayersTest) {
    // Class
    var OpenLayer = (function () {
        // Constructor
        function OpenLayer() {
            //Create default map controls
            var controls = [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine()
            ];

            //Create the map
            var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
            var map = new OpenLayers.Map({
                // These projections are all webmercator, but the openlayers layer wants 900913 specifically
                projection: new OpenLayers.Projection("EPSG:3857"),
                units: "m",
                numZoomLevels: 16,
                controls: controls
            });
        }
        return OpenLayer;
    })();
    OpenLayersTest.OpenLayer = OpenLayer;
})(OpenLayersTest || (OpenLayersTest = {}));

// Local variables
var ol = new OpenLayersTest.OpenLayer();
