/// <reference path="../OpenLayers.js" />

//Manages the map elements for the OpenLayers in the map
//$().ready(function () {
//    $("#title").fadeIn("slow", function () { });

//    $('#map').width('98%').height('600');

//    var map = new OpenLayers.Map({ div: 'map', allOverlays: true });
//    //var maplayer = new OpenLayers.Layer.WMS("OpenLayers WMS", "http://vmap0.tiles.osgeo.org/wms/vmap0", { 'layers': 'basic' });

//    var gsat = new OpenLayers.Layer.Google(
//        "Google Satellite",
//        { type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22 }
//    );

//    var google = new OpenLayers.Layer.Google("Google Streets");
//    var OSM = new OpenLayers.Layer.OSM();
//    var Soil = new OpenLayers.Layer.ArcGIS93Rest("USA_Median_Household_Income_MapServer",
//        'http://services.arcgisonline.com/ArcGIS/services/Demographics/USA_Median_Household_Income/MapServer/export',
//        { layers: "show:1,2" }
//        );

//    map.addLayers([gsat]);
//    map.zoomToMaxExtent();

//    map.addControl(new OpenLayers.Control.LayerSwitcher());

//    // Google.v3 uses EPSG:900913 as projection, so we have to
//    // transform our coordinates
//    map.setCenter(new OpenLayers.LonLat(10.2, 48.9).transform(
//        new OpenLayers.Projection("EPSG:4326"),
//        map.getProjectionObject()
//    ), 5);

//    //map.setCenter(new OpenLayers.LonLat(-12466864.02384, 5381264.72547), 18);

//    var polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer");
//    map.addLayers([polygonLayer]);
//    map.addControl(new OpenLayers.Control.MousePosition());

//    var snap = new OpenLayers.Control.Snapping({
//        layer: polygonLayer,
//        target: { tolerance: 5 }
//    });
//    map.addControl(snap);
//    snap.activate();

//    toolbox = $('#floating-toolbar');
//    var panel = new OpenLayers.Control.EditingToolbar(polygonLayer);
//    map.addControl(panel);
//});

$().ready(function () {
    $('#map').width('98%').height('600');

    map = new OpenLayers.Map('map');
    map.addControl(new OpenLayers.Control.LayerSwitcher());

    var gphy = new OpenLayers.Layer.Google(
        "Google Physical",
        { type: google.maps.MapTypeId.TERRAIN }
    );
    var gmap = new OpenLayers.Layer.Google(
        "Google Streets", // the default
        {numZoomLevels: 20 }
    );
    var ghyb = new OpenLayers.Layer.Google(
        "Google Hybrid",
        { type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20 }
    );
    var gsat = new OpenLayers.Layer.Google(
        "Google Satellite",
        { type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22 }
    );

    map.addLayers([gphy, gmap, ghyb, gsat]);

    // Google.v3 uses EPSG:900913 as projection, so we have to
    // transform our coordinates
    map.setCenter(new OpenLayers.LonLat(-12466864.02384, 5381264.72547).transform(
        new OpenLayers.Projection("EPSG:900913"),
        map.getProjectionObject()
    ), 15);

    var polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer");
    map.addLayers([polygonLayer]);
    map.addControl(new OpenLayers.Control.MousePosition());

    toolbox = $('#floating-toolbar');
    var panel = new OpenLayers.Control.EditingToolbar(polygonLayer);
    map.addControl(panel);

    // add behavior to html
    //    var animate = document.getElementById("animate");
    //    animate.onclick = function () {
    //        for (var i = map.layers.length - 1; i >= 0; --i) {
    //            map.layers[i].animationEnabled = this.checked;
    //        }
    //    };
});