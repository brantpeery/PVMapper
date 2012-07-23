Ext.onReady(function () {
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
    DotSpatialMap.addLayer(osm);

    var solar = new OpenLayers.Layer.WMS(
            "Solar Radiation",
            "http://mapsdb.nrel.gov/jw_router/perezANN_mod/tile",
            {
                layers: "perezANN_mod",
                layer_type: "polygon",
                transparent: "true",
                format: "image/gif",
                exceptions: "application/vnd.ogc.se_inimage"
            },
            { isBaseLayer: false }
            );
    DotSpatialMap.addLayer(solar);

    var slope = new OpenLayers.Layer.WMS(
            "Slope",
            "http://mapsdb.nrel.gov/jw_router/DNI_slope_3/tile",
            {
                layers: "DNI_slope_3",
                format: "image/gif",
                transparent: "true"
            },
            {
                isBaseLayer: false,
                wrapDateLine: true
            }
        );

    DotSpatialMap.addLayer(slope);
});