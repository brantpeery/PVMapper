/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var INLModules;
(function (INLModules) {
    var IrradianceModule = (function () {
        function IrradianceModule() {
            var myModule = new pvMapper.Module({
                id: "IrradianceModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                activate: function () {
                    addAllMaps();
                },
                deactivate: function () {
                    removeAllMaps();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Direct-Normal Irradiation",
                        description: "Calculates the expected DNI for a site",
                        category: "Meteorology",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            updateScoreFromLayer(score, "swera:dni_suny_high_900913");
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: {
                                minValue: 0,
                                maxValue: 8
                            }
                        },
                        defaultWeight: 10
                    }, 
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Global-Horizontal Irradiation",
                        description: "Calculates the expected GHI for a site",
                        category: "Meteorology",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            updateScoreFromLayer(score, "swera:ghi_suny_high_900913");
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: {
                                minValue: 0,
                                maxValue: 6
                            }
                        },
                        defaultWeight: 10
                    }
                ],
                infoTools: null
            });
        }
        return IrradianceModule;
    })();    
    var modinstance = new IrradianceModule();
    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    /////////////var irradianceMapUrl = "http://mapsdb.nrel.gov/jw_router/perezANN_mod/tile";
    //var irradianceMapUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer?";
    var MapsDbUrl = "http://mapsdb.nrel.gov/geoserver/swera/wms";
    //declare var Ext: any;
    // references to layer objects (used for later querying and removal)
        var dniSuny, ghiSuny;
    function addAllMaps() {
        //var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
        // Direct-Normal Irradiation
        dniSuny = addMapsDbMap("swera:dni_suny_high_900913", "Direct-Normal Irradiation 10km");
        pvMapper.map.addLayer(dniSuny);
        // Global-Horizontal Irradiation
        ghiSuny = addMapsDbMap("swera:ghi_suny_high_900913", "Global-Horizontal Irradiation 10km");
        pvMapper.map.addLayer(ghiSuny);
    }
    function addMapsDbMap(name, description) {
        var newLayer = new OpenLayers.Layer.WMS(description, //"Solar GHI 10km by SUNY", //"Solar Radiation",
        MapsDbUrl, {
            layers: //maxExtent: solarBounds,
            name,
            transparent: //"swera:ghi_suny_high_900913", //"0", //"perezANN_mod",
            //layer_type: "polygon",
            "true",
            format: "image/png",
            exceptions: "application/vnd.ogc.se_inimage",
            maxResolution: 156543.0339,
            srs: "EPSG:900913"
        }, {
            isBaseLayer: false
        });
        newLayer.setOpacity(0.3);
        newLayer.setVisibility(false);
        //dniSuny.epsgOverride = "EPSG:102113";
        return newLayer;
    }
    function removeAllMaps() {
        pvMapper.map.removeLayer(dniSuny, false);
        pvMapper.map.removeLayer(ghiSuny, false);
    }
    function updateScoreFromLayer(score, layerName) {
        //site: pvMapper.Site
        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: score.site.geometry.bounds.toBBOX(6, false),
            SERVICE: "WMS",
            INFO_FORMAT: "application/vnd.ogc.gml",
            QUERY_LAYERS: //'text/html', //"application/vnd.ogc.gml", //"text/plain",
            layerName,
            FEATURE_COUNT: //"0", //"perezANN_mod", //solar.params.LAYERS,
            50,
            Layers: layerName,
            WIDTH: //"perezANN_mod", //solar.params.LAYERS,
            1,
            HEIGHT: //site.geometry.bounds.getWidth(),
            1,
            format: // site.geometry.bounds.getHeight(),
            "image/gif",
            VERSION: //styles: solar.params.STYLES,
            //srs: dniSuny.params.SRS,
            "1.1.1",
            X: 0,
            Y: 0,
            I: 0,
            J: 0
        };
        // merge filters
        //if (pvMapper.map.layers[0].params.CQL_FILTER != null) {
        //    params.cql_filter = pvMapper.map.layers[0].params.CQL_FILTER;
        //}
        //if (pvMapper.map.layers[0].params.FILTER != null) {
        //    params.filter = pvMapper.map.layers[0].params.FILTER;
        //}
        //if (pvMapper.map.layers[0].params.FEATUREID) {
        //    params.featureid = pvMapper.map.layers[0].params.FEATUREID;
        //}
        var request = OpenLayers.Request.GET({
            url: //url: "/Proxy/proxy.ashx?" + irradianceMapUrl,
            MapsDbUrl,
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: //callback: handler,
            queryResponseHandler(score)
        });
        //async: false,
        //headers: {
        //    "Content-Type": "text/html"
        //},
            }
    function queryResponseHandler(score) {
        return function (response) {
            try  {
                if(response.status === 200) {
                    var gmlParser = new OpenLayers.Format.GML();
                    gmlParser.extractAttributes = true;
                    var features = gmlParser.read(response.responseText);
                    if(typeof features !== "undefined" && features.length > 0) {
                        // calculate the average irradiance
                        //TODO: should we just take the floor, or sum proportionally based on overlap, or ...something ?
                        var sum = 0.0;
                        for(var i = 0; i < features.length; i++) {
                            sum += parseFloat(features[i].attributes.annual);
                        }
                        var result = sum / features.length;
                        // convert from kWh/m2/day to MW
                        var siteArea = score.site.geometry.getGeodesicArea(pvMapper.siteLayer.projection);
                        var megaWatts = result / 24 * siteArea / (1000 * 1000);
                        // success
                        score.popupMessage = result.toFixed(2) + " kWh/m2/day" + "\n(" + megaWatts.toFixed(3) + " MW)";
                        score.updateValue(result);
                        //score.updateValue(megaWatts); //TODO: duh...? want give two scores...
                                            } else {
                        // error
                        score.popupMessage = "No data for this site";
                        score.updateValue(Number.NaN);
                    }
                } else if(response.status === 500) {
                    //Note: 500 is basically the only error code returned by Proxy.ashx when it fails.
                    //      I assume the proxy script will fail more often than the map servers themselves.
                    //      Therefore, if you get 500, it's a fair bet that it's the proxy's fault.
                    // error
                    score.popupMessage = "Proxy connection error";
                    score.updateValue(Number.NaN);
                } else {
                    // error
                    score.popupMessage = "Error " + response.status;
                    score.updateValue(Number.NaN);
                }
            } catch (err) {
                // error
                score.popupMessage = "Error";
                score.updateValue(Number.NaN);
            }
        };
    }
})(INLModules || (INLModules = {}));
//@ sourceMappingURL=irradianceModule.js.map
