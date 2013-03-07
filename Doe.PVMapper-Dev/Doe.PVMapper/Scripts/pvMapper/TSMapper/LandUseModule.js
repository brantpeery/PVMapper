/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var INLModules;
(function (INLModules) {
    var FederalLandsModule = (function () {
        function FederalLandsModule() {
            var myModule = new pvMapper.Module({
                id: "FederalLandsModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    addFederalLandsMap();
                },
                deactivate: function () {
                    removeFederalLandsMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Protected Areas",
                        description: "Display Federal Lands use boundaries.",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            updateScoreFederalLand(score);
                        },
                        updateScoreCallback: function (score) {
                            updateScoreFederalLand(score);
                        }
                    }
                ],
                infoTools: null
            });
        }
        return FederalLandsModule;
    })();
    INLModules.FederalLandsModule = FederalLandsModule;    
    var federalLandsInstance = new INLModules.FederalLandsModule();
    var federalLandsWmsUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer";
    var federalLandsRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/PADUS/PADUS_owner/MapServer/";
    var federalLandsLayer;
    var landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    function addFederalLandsMap() {
        federalLandsLayer = new OpenLayers.Layer.WMS("Protected Areas", federalLandsWmsUrl, {
            maxExtent: landBounds,
            layers: "0",
            layer_type: "polygon",
            transparent: "true",
            format: "image/gif",
            exceptions: "application/vnd.ogc.se_inimage",
            maxResolution: 156543.0339,
            srs: "EPSG:102113"
        }, {
            isBaseLayer: false
        });
        federalLandsLayer.epsgOverride = "EPSG:102113";
        federalLandsLayer.setOpacity(0.3);
        federalLandsLayer.setVisibility(false);
        pvMapper.map.addLayer(federalLandsLayer);
    }
    function removeFederalLandsMap() {
        pvMapper.map.removeLayer(federalLandsLayer, false);
    }
    function updateScoreFederalLand(score) {
        var params = {
            mapExtent: score.site.geometry.bounds.toBBOX(6, false),
            geometryType: "esriGeometryEnvelope",
            geometry: score.site.geometry.bounds.toBBOX(6, false),
            f: "json",
            layers: // or "html",
            "0",
            tolerance: //"perezANN_mod", //solar.params.LAYERS,
            0,
            imageDisplay: //TODO: should this be 0 or 1?
            "1, 1, 96",
            returnGeometry: false
        };
        //for i 0...result.features.length
        //var dist = score.site.geometry.distanceTo(result.features[i].geometry);
        //end
        var request = OpenLayers.Request.GET({
            url: //url: "/Proxy/proxy.ashx?" + solarmapperRestBaseUrl + "identify",
            federalLandsRestUrl + "identify",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: //callback: handler,
            function (response) {
                // debug statement
                //alert(score.site.name + ": " + request.responseText.length + " (" + request.status + ")");
                //alert(request.responseText);
                // update value
                if(response.status === 200) {
                    var esriJsonPerser = new OpenLayers.Format.JSON();
                    esriJsonPerser.extractAttributes = true;
                    var parsedResponse = esriJsonPerser.read(response.responseText);
                    var alertText = "";
                    var lastText = null;
                    for(var i = 0; i < parsedResponse.results.length; i++) {
                        var newText = parsedResponse.results[i].attributes["Owner Name"];
                        if(newText != lastText) {
                            if(lastText != null) {
                                alertText += ", \n";
                            }
                            alertText += newText;
                        }
                        lastText = newText;
                    }
                    score.popupMessage = alertText;
                    score.updateValue(parsedResponse.results.length)// number of overlapping features
                    ;
                } else {
                    score.popupMessage = "Connection error " + response.status;
                    score.updateValue(Number.NaN);
                }
            }
        });
    }
    //function updateScoreFederalLand(score) {
    //  //site: pvMapper.Site
    //  var params = {
    //    REQUEST: "GetFeatureInfo",
    //    EXCEPTIONS: "application/vnd.ogc.se_xml",
    //    BBOX: score.site.geometry.bounds.toBBOX(6, false),
    //    SERVICE: "WMS",
    //    INFO_FORMAT: "application/vnd.esri.wms_featureinfo_xml", // "application/vnd.ogc.gml",
    //    QUERY_LAYERS: "0",
    //    FEATURE_COUNT: 50,//"0", //"perezANN_mod", //solar.params.LAYERS,
    //    Layers: "0",
    //    WIDTH: 1,//"perezANN_mod", //solar.params.LAYERS,
    //    HEIGHT: 1,//site.geometry.bounds.getWidth(),
    //    format: "image/gif",// site.geometry.bounds.getHeight(),
    //    srs: 'EPSG:102113',
    //    VERSION: "1.1.1",
    //    //styles: solar.params.STYLES,
    //    //srs: dniSuny.params.SRS,
    //    X: 0,
    //    Y: 0,
    //    I: 0,
    //    J: 0
    //  };
    //  // merge filters
    //  //if (pvMapper.map.layers[0].params.CQL_FILTER != null) {
    //  //    params.cql_filter = pvMapper.map.layers[0].params.CQL_FILTER;
    //  //}
    //  //if (pvMapper.map.layers[0].params.FILTER != null) {
    //  //    params.filter = pvMapper.map.layers[0].params.FILTER;
    //  //}
    //  //if (pvMapper.map.layers[0].params.FEATUREID) {
    //  //    params.featureid = pvMapper.map.layers[0].params.FEATUREID;
    //  //}
    //  var request = OpenLayers.Request.GET({
    //    url: //url: "/Proxy/proxy.ashx?" + irradianceMapUrl,
    //    federalLandsUrl,
    //    proxy: "/Proxy/proxy.ashx?",
    //    params: params,
    //    callback: //callback: handler,
    //    queryResponseHandlerFederalLand(score)
    //  });
    //  //async: false,
    //  //headers: {
    //  //    "Content-Type": "text/html"
    //  //},
    //}
    //function queryResponseHandlerFederalLand(score) {
    //  return function (response) {
    //    try {
    //      if (response.status === 200) {
    //        var xmlParser = new OpenLayers.Format.XML();
    //        xmlParser.extractAttributes = true;
    //        var features = xmlParser.read(response.responseText);
    //        if (typeof features !== "undefined") {
    //          // calculate the average irradiance
    //          //TODO: should we just take the floor, or sum proportionally based on overlap, or ...something ?
    //          var sum = 0.0;
    //          for (var i = 0; i < features.length; i++) {
    //            sum += parseFloat(features[i].attributes.annual);
    //          }
    //          var result = sum / features.length;
    //          // success
    //          score.popupMessage = result.toFixed(3)// round the display value
    //            ;
    //          score.updateValue(result);
    //        } else {
    //          // error
    //          score.popupMessage = "No irradiance data found near this site";
    //          score.updateValue(Number.NaN);
    //        }
    //      } else if (response.status === 500) {
    //        //Note: 500 is basically the only error code returned by Proxy.ashx when it fails.
    //        //      I assume the proxy script will fail more often than the map servers themselves.
    //        //      Therefore, if you get 500, it's a fair bet that it's the proxy's fault.
    //        // error
    //        score.popupMessage = "Proxy connection error";
    //        score.updateValue(Number.NaN);
    //      } else {
    //        // error
    //        score.popupMessage = "Connection error " + response.status;
    //        score.updateValue(Number.NaN);
    //      }
    //    } catch (err) {
    //    // error
    //      score.popupMessage = "Error";
    //      score.updateValue(Number.NaN);
    //    }
    //  };
    //}
    //============================================================
    var CitiesTowns = (function () {
        function CitiesTowns() {
            var _this = this;
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var citiesTownsURL = //"http://services.arcgisonline.com/ArcGIS/rest/services";
            "http://dingo.gapanalysisprogram.com/ArcGIS/services/NAT_LC/1_NVC_class_landuse/MapServer/WMSServer";
            var myModule = new pvMapper.Module({
                id: "CitiesTownsModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    _this.addWMSLayerMap('Cities and Towns', citiesTownsURL, "EPSG:102113");
                },
                deactivate: function () {
                    _this.removeWMSLayerMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Cities and Towns",
                        description: "Calculate score based on city boundaries.",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, s) {
                            ///////////////////////////////////////////getFeatureInfo(s.site);
                            s.popupMessage = "Cities and Towns score";
                            s.updateValue(Number.NaN);
                        },
                        updateScoreCallback: function (score) {
                            ///////////////////////////////////////////getFeatureInfo(site);
                            score.popupMessage = "Cities and Towns score";
                            score.updateValue(1);
                        }
                    }
                ],
                infoTools: null
            });
        }
        CitiesTowns.prototype.addWMSLayerMap = function (layerName, layerURL, epsgProjection) {
            var aLayer = new OpenLayers.Layer.WMS(layerName, layerURL, {
                maxExtent: this.landBounds,
                layers: "0",
                layer_type: "polygon",
                transparent: "true",
                format: "image/gif",
                exceptions: "application/vnd.ogc.se_inimage",
                maxResolution: 156543.0339,
                srs: epsgProjection
            }, {
                isBaseLayer: false
            });
            aLayer.epsgOverride = epsgProjection;
            aLayer.setOpacity(0.3);
            aLayer.setVisibility(false);
            pvMapper.map.addLayer(aLayer);
            this.layerMap = aLayer;
        };
        CitiesTowns.prototype.removeWMSLayerMap = function () {
            pvMapper.map.removeLayer(this.layerMap, false);
        };
        return CitiesTowns;
    })();
    INLModules.CitiesTowns = CitiesTowns;    
    var Layer2 = new INLModules.CitiesTowns();
    //============================================================
    var SolarMapper = (function () {
        function SolarMapper() {
            var _this = this;
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var layerURL = //"http://services.arcgisonline.com/ArcGIS/rest/services";
            "http://solarmapper.anl.gov/ArcGIS/rest/services/Solar_Mapper_SDE/MapServer/export";
            var myModule = new pvMapper.Module({
                id: "SolarMapperModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    _this.addRESTLayerMap("Solar Mapper", layerURL);
                },
                deactivate: function () {
                    _this.removeRESTLayerMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Solar Mapper",
                        description: "Calculate score based on solar radiation.",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            ///////////////////////////////////////////getFeatureInfo(s.site);
                            //updateScoreFromLayer(score, "");
                            score.popupMessage = "Solar radiation score";
                            score.updateValue(Number.NaN);
                        },
                        updateScoreCallback: function (score) {
                            ///////////////////////////////////////////getFeatureInfo(site);
                            score.popupMessage = "Solar radiation score";
                            score.updateValue(1);
                        }
                    }
                ],
                infoTools: null
            });
        }
        SolarMapper.prototype.addRESTLayerMap = function (layerName, layerURL) {
            var facilities = new OpenLayers.Layer.ArcGIS93Rest("Some layer from Solarmapper", layerURL, //bbox=-14608729.4935068,4127680.66361813,-10533172.1554586,5562319.83205435
            {
                layers: "show:0",
                format: "gif",
                srs: "3857",
                transparent: "true"
            });
            facilities.epsgOverride = "3857";
            facilities.setVisibility(false);
            pvMapper.map.addLayer(facilities);
        };
        SolarMapper.prototype.removeRESTLayerMap = function () {
            pvMapper.map.removeLayer(this.layerMap, false);
        };
        SolarMapper.prototype.updateScoreFromLayer = function (score, layerName) {
            var params = {
                REQUEST: "GetFeatureInfo"
            };
        };
        return SolarMapper;
    })();
    INLModules.SolarMapper = SolarMapper;    
    var solarMapper = new SolarMapper();
    //============================================================
    var Worldterrain = (function () {
        function Worldterrain() {
            var _this = this;
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var layerURL = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer";
            var myModule = new pvMapper.Module({
                id: "WorldTerrainModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    _this.addRESTLayerMap("World Terrain", layerURL);
                },
                deactivate: function () {
                    _this.removeRESTLayerMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "World Terrain",
                        description: "Calculate score based on terrain.",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            ///////////////////////////////////////////getFeatureInfo(s.site);
                            this.updateScoreFromLayer(score, "");
                            //s.popupMessage = "Solar radiation score";
                            //s.updateValue(Number.NaN);
                                                    },
                        updateScoreCallback: function (score) {
                            ///////////////////////////////////////////getFeatureInfo(site);
                            score.popupMessage = "Terrain score";
                            score.updateValue(1);
                        }
                    }
                ],
                infoTools: null
            });
        }
        Worldterrain.prototype.addRESTLayerMap = function (layerName, layerURL) {
            var facilities = new OpenLayers.Layer.ArcGIS93Rest("World Terrain", layerURL, //bbox=-14608729.4935068,4127680.66361813,-10533172.1554586,5562319.83205435
            {
                layers: "show:0",
                format: "gif",
                srs: "3857",
                transparent: "true"
            });
            facilities.epsgOverride = "3857";
            facilities.setVisibility(false);
            pvMapper.map.addLayer(facilities);
        };
        Worldterrain.prototype.removeRESTLayerMap = function () {
            pvMapper.map.removeLayer(this.layerMap, false);
        };
        Worldterrain.prototype.updateScoreFromLayer = function (score, layerName) {
            var params = {
                REQUEST: "GetFeatureInfo"
            };
        };
        return Worldterrain;
    })();
    INLModules.Worldterrain = Worldterrain;    
    var terrain = new Worldterrain();
})(INLModules || (INLModules = {}));
//@ sourceMappingURL=LandUseModule.js.map
