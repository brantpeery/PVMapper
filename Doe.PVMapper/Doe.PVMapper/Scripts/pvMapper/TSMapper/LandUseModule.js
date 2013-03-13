/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var INLModules;
(function (INLModules) {
    var ProtectedAreasModule = (function () {
        function ProtectedAreasModule() {
            var _this = this;
            this.federalLandsWmsUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer";
            this.federalLandsRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/PADUS/PADUS_owner/MapServer/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "ProtectedAreasModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    _this.addMap();
                },
                deactivate: function () {
                    _this.removeMap();
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
                        description: "Shows the classification of protected areas within the united states.",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        updateScoreCallback: function (score) {
                            _this.updateScore(score);
                        }
                    }
                ],
                infoTools: null
            });
        }
        ProtectedAreasModule.prototype.addMap = function () {
            this.federalLandsLayer = new OpenLayers.Layer.WMS("Protected Areas", this.federalLandsWmsUrl, {
                maxExtent: this.landBounds,
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
            this.federalLandsLayer.epsgOverride = "EPSG:102113";
            this.federalLandsLayer.setOpacity(0.3);
            this.federalLandsLayer.setVisibility(false);
            pvMapper.map.addLayer(this.federalLandsLayer);
        };
        ProtectedAreasModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.federalLandsLayer, false);
        };
        ProtectedAreasModule.prototype.updateScore = function (score) {
            var params = {
                mapExtent: score.site.geometry.bounds.toBBOX(6, false),
                geometryType: "esriGeometryEnvelope",
                geometry: score.site.geometry.bounds.toBBOX(6, false),
                f: "json",
                layers: "0",
                tolerance: 0,
                imageDisplay: "1, 1, 96",
                returnGeometry: false
            };
            var request = OpenLayers.Request.GET({
                url: this.federalLandsRestUrl + "identify",
                proxy: "/Proxy/proxy.ashx?",
                params: params,
                callback: function (response) {
                    // update value
                    if(response.status === 200) {
                        var esriJsonPerser = new OpenLayers.Format.JSON();
                        esriJsonPerser.extractAttributes = true;
                        var parsedResponse = esriJsonPerser.read(response.responseText);
                        if(parsedResponse && parsedResponse.results && parsedResponse.results.length > 0) {
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
                            score.popupMessage = "None";
                            score.updateValue(0);
                        }
                    } else {
                        score.popupMessage = "Connection error " + response.status;
                        score.updateValue(Number.NaN);
                    }
                }
            });
        };
        return ProtectedAreasModule;
    })();
    INLModules.ProtectedAreasModule = ProtectedAreasModule;    
    var protectedAreasInstance = new INLModules.ProtectedAreasModule();
    //============================================================
    var LandCoverModule = (function () {
        function LandCoverModule() {
            var _this = this;
            this.landCoverWmsUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/NAT_LC/1_NVC_class_landuse/MapServer/WMSServer";
            this.landCoverRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/NAT_LC/1_NVC_class_landuse/MapServer/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "LandCoverModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    _this.addMap();
                },
                deactivate: function () {
                    _this.removeMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Land Cover",
                        description: "Display the land cover found around the center of a site",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        updateScoreCallback: function (score) {
                            _this.updateScore(score);
                        }
                    }
                ],
                infoTools: null
            });
        }
        LandCoverModule.prototype.addMap = function () {
            this.landCoverLayer = new OpenLayers.Layer.WMS("Land Cover", this.landCoverWmsUrl, {
                maxExtent: this.landBounds,
                layers: "0,1,2",
                layer_type: "polygon",
                transparent: "true",
                format: "image/gif",
                exceptions: "application/vnd.ogc.se_inimage",
                maxResolution: 156543.0339,
                srs: "EPSG:102113"
            }, {
                isBaseLayer: false
            });
            this.landCoverLayer.epsgOverride = "EPSG:102113";
            this.landCoverLayer.setOpacity(0.3);
            this.landCoverLayer.setVisibility(false);
            pvMapper.map.addLayer(this.landCoverLayer);
        };
        LandCoverModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.landCoverLayer, false);
        };
        LandCoverModule.prototype.updateScore = function (score) {
            var params = {
                mapExtent: score.site.geometry.bounds.toBBOX(6, false),
                geometryType: "esriGeometryEnvelope",
                geometry: score.site.geometry.bounds.toBBOX(6, false),
                f: "json",
                layers: "0,1,2",
                tolerance: 0,
                imageDisplay: "1, 1, 96",
                returnGeometry: false
            };
            var request = OpenLayers.Request.GET({
                url: this.landCoverRestUrl + "identify",
                proxy: "/Proxy/proxy.ashx?",
                params: params,
                callback: function (response) {
                    // update value
                    if(response.status === 200) {
                        var esriJsonPerser = new OpenLayers.Format.JSON();
                        esriJsonPerser.extractAttributes = true;
                        var parsedResponse = esriJsonPerser.read(response.responseText);
                        if(parsedResponse && parsedResponse.results && parsedResponse.results.length > 0) {
                            var alertText = "";
                            var lastText = null;
                            for(var i = 0; i < parsedResponse.results.length; i++) {
                                var newText = parsedResponse.results[i].attributes["NVC_DIV"];
                                if(newText != lastText) {
                                    if(lastText != null) {
                                        alertText += ", \n";
                                    }
                                    alertText += newText;
                                }
                                lastText = newText;
                            }
                            score.popupMessage = alertText;
                            score.updateValue(parsedResponse.results.length)// returns 1
                            ;
                            //TODO: the server refuses to return more than one pixel value... how do we get %coverage?
                            //      I'm afraid that we'll have to fetch the overlapping image and parse it ourselves...
                            //      or at least run a few requests for different pixels and conbine the results.
                            //      Either way, it'll be costly and inefficient. But, I can't find a better server,
                            //      nor have I been successful at coaxing multiple results from this one. Curses.
                                                    } else {
                            score.popupMessage = "No data for this site";
                            score.updateValue(Number.NaN);
                        }
                    } else {
                        score.popupMessage = "Connection error " + response.status;
                        score.updateValue(Number.NaN);
                    }
                }
            });
        };
        return LandCoverModule;
    })();
    INLModules.LandCoverModule = LandCoverModule;    
    var landCoverInstance = new INLModules.LandCoverModule();
    //============================================================
    })(INLModules || (INLModules = {}));
