pvMapper.onReady(function () {

    var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
    var blueMarble = new OpenLayers.Layer.WMS(
            "Global Imagery",
            "http://maps.opengeo.org/geowebcache/service/wms",
            { layers: "bluemarble" }
            );
    //panel.map.addLayer(blueMarble);

    var wms = new OpenLayers.Layer.WMS("OpenLayers WMS",
        "http://vmap0.tiles.osgeo.org/wms/vmap0", { layers: 'basic' });

    // http://openlayers.org/dev/examples/web-mercator.html
    //900913
    //102113
    var resolutions = OpenLayers.Layer.Bing.prototype.serverResolutions.slice(4, 19);
    var osm = new OpenLayers.Layer.OSM("Street", null, { zoomOffset: 4, resolutions: resolutions });
    pvMapper.map.addLayer(osm);

    var solar = new OpenLayers.Layer.WMS(
            "Solar Radiation",
            "http://mapsdb.nrel.gov/jw_router/perezANN_mod/tile",
            {
                maxExtent: solarBounds,
                layers: "perezANN_mod",
                layer_type: "polygon",
                transparent: "true",
                format: "image/gif",
                exceptions: "application/vnd.ogc.se_inimage"
            },
            { isBaseLayer: false }
            );
    pvMapper.map.addLayer(solar);

    var slope = new OpenLayers.Layer.WMS(
            "Slope",
            "http://mapsdb.nrel.gov/jw_router/DNI_slope_3/tile",
            {
                maxExtent: solarBounds,
                layers: "DNI_slope_3",
                format: "image/gif",
                transparent: "true"
            },
            {
                isBaseLayer: false,
                wrapDateLine: true
            }
        );

    pvMapper.map.addLayer(slope);


    polyLayer2 = new OpenLayers.Layer.Vector("Solar Bounds",
 {
     styleMap: new OpenLayers.StyleMap({
         'default': new OpenLayers.Style({
             strokeColor: "blue",
             strokeWidth: 2,
             fillColor: "blue",
             fillOpacity: .05,
             pointRadius: 3
         })
     })
 }); //The editable poly layer for the user's site
    pvMapper.map.addLayer(polyLayer2); //The editable layer

    polyLayer2.addFeatures([
        new OpenLayers.Feature.Vector(solarBounds.toGeometry())
    ]);

    //    polyLayer1 = new OpenLayers.Layer.Vector("US Bounds",
    //{
    //    styleMap: new OpenLayers.StyleMap({
    //        'default': new OpenLayers.Style({
    //            strokeColor: "red",
    //            strokeWidth: 1,
    //            fillColor: "red",
    //            fillOpacity: .05,
    //            pointRadius: 3
    //        })
    //    })
    //}); //The editable poly layer for the user's site
    //    pvMapper.map.addLayer(polyLayer1); //The editable layer
    //    OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';


    //    polyLayer1.addFeatures([
    //        new OpenLayers.Feature.Vector(usBounds.toGeometry())
    //    ]);


});