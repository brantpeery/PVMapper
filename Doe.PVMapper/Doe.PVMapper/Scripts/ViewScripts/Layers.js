pvMapper.onReady(function () {

    var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);

    var resolutions = OpenLayers.Layer.Bing.prototype.serverResolutions.slice(4, 19);
    var osm = new OpenLayers.Layer.OSM("Open Street", null, { zoomOffset: 4, resolutions: resolutions });
    $.jGrowl("Adding Open Street Map");
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
                exceptions: "application/vnd.ogc.se_inimage",
                maxResolution: 156543.0339
            },
            { isBaseLayer: false }
            );
    solar.setOpacity(0.3);
    $.jGrowl("Adding Solar Radiation");
    pvMapper.map.addLayer(solar);

    var slope = new OpenLayers.Layer.WMS(
            "Slope",
            "http://mapsdb.nrel.gov/jw_router/DNI_slope_3/tile",
            {
                layers: "DNI_slope_3",
                format: "image/gif",
                transparent: "true",
                maxResolution: 156543.0339,
            },
            {
                isBaseLayer: false,
                wrapDateLine: true
            }
        );
    slope.setOpacity(0.3);
    $.jGrowl("Adding Slope");
    pvMapper.map.addLayer(slope);

    var blueMarble = new OpenLayers.Layer.WMS(
            "Global Imagery",
            "http://maps.opengeo.org/geowebcache/service/wms",
            {
                layers: "bluemarble",
            }
            );
    pvMapper.map.addLayer(blueMarble);

    var wms = new OpenLayers.Layer.WMS("OpenLayers", "http://vmap0.tiles.osgeo.org/wms/vmap0?", {
        layers: 'basic',
        projection: new OpenLayers.Projection("EPSG:900913")

    });
    pvMapper.map.addLayer(wms);

    var sitelayer = new OpenLayers.Layer.Vector("Sites");
    sitelayer.id = "SiteLayer";
    pvMapper.map.addLayer(sitelayer);

});