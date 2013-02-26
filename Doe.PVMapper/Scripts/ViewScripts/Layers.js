pvMapper.onReady(function () {

    //var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);

    var resolutions = OpenLayers.Layer.Bing.prototype.serverResolutions.slice(4, 19);
    var osm = new OpenLayers.Layer.OSM("Open Street", null, { isBaseLayer:true, zoomOffset: 4, resolutions: resolutions });
    $.jGrowl("Adding Open Street Map");
    pvMapper.map.addLayer(osm);
    pvMapper.map.zoomToMaxExtent();

    //var solar = new OpenLayers.Layer.WMS(
    //        "Solar Radiation",
    //        "http://mapsdb.nrel.gov/jw_router/perezANN_mod/tile",
    //        {
    //            maxExtent: solarBounds,
    //            layers: "perezANN_mod",
    //            layer_type: "polygon",
    //            transparent: "true",
    //            format: "image/gif",
    //            exceptions: "application/vnd.ogc.se_inimage",
    //            maxResolution: 156543.0339
    //        },
    //        { isBaseLayer: false }
    //        );
    //solar.setOpacity(0.3);
    //$.jGrowl("Adding Solar Radiation");
    //pvMapper.map.addLayer(solar);

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

    //Set up the layer for the site polys
    //If a style is applied at the layer level, then 
    //when a label is applied, the engine draws it incorrectly
    //For this reason the style is defined here, but used only when a 
    //feature is added
    var commonStyleMap = new OpenLayers.StyleMap({
        'default': {
            strokeColor: "#00FF00",
            strokeOpacity: 1,
            strokeWidth: 3,
            fillColor: "#FF5500",
            fillOpacity: 0.5,
            pointRadius: 6,
            pointerEvents: "visiblePainted",
            fontColor: "blue",
            fontSize: "12px",
            fontFamily: "Courier New, monospace",
            fontWeight: "bold",
            labelAlign: "cm",
            labelOutlineColor: "white",
            labelOutlineWidth: 1,
            label: "${name}"
        },
        "select": new OpenLayers.Style(null, {
            rules: [
            new OpenLayers.Rule({
                symbolizer: {
                    "Point": {
                        pointRadius: 5,
                        graphicName: "square",
                        fillColor: "white",
                        fillOpacity: 0.25,
                        strokeWidth: 2,
                        strokeOpacity: 1,
                        strokeColor: "#0000ff",
                        label:null
                    },
                    "Line": {
                        strokeWidth: 3,
                        strokeOpacity: 1,
                        strokeColor: "#0000ff"
                    },
                    "Polygon": {
                        strokeWidth: 2,
                        strokeOpacity: 1,
                        fillColor: "#0000ff",
                        strokeColor: "#0000ff"
                    }
                }
            })
            ]
        }),
        "temporary": new OpenLayers.Style(null, {
            rules: [
            new OpenLayers.Rule({
                symbolizer: {
                    "Point": {
                        graphicName: "square",
                        pointRadius: 5,
                        fillColor: "white",
                        fillOpacity: 0.25,
                        strokeWidth: 2,
                        strokeColor: "#0000ff",
                        label: null
                    },
                    "Line": {
                        strokeWidth: 3,
                        strokeOpacity: 1,
                        strokeColor: "#0000ff"
                    },
                    "Polygon": {
                        strokeWidth: 2,
                        strokeOpacity: 1,
                        strokeColor: "#0000ff",
                        fillColor: "#0000ff"
                    }
                }
            })
            ]
        })
    }); 
    
    pvMapper.siteLayer = new OpenLayers.Layer.Vector("Sites", { styleMap: commonStyleMap });
    pvMapper.siteLayer.id = "SiteLayer";



    pvMapper.map.addLayer(pvMapper.siteLayer);

});