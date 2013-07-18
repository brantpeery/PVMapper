﻿/// <reference path="pvMapper.ts" />
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
                        description: "Overlapping protected areas, using PAD-US map data hosted by UI-GAP (gap.uidaho.edu)",
                        category: "Land Use",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        //TODO: need a categorical scoring system
                        // for now, this assumes that overlapping more protected areas is worse than overlapping fewer (!)
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, 1, 0.6, 5, 0)
                        },
                        weight: 10,
                        unitSymbol: "NU",
                        unitClass: ""
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
            }, { isBaseLayer: false });
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

            //console.log("LandUseModule.ts: " + score.site.geometry.bounds.toBBOX(6, false));
            var request = OpenLayers.Request.GET({
                url: this.federalLandsRestUrl + "identify",
                proxy: "/Proxy/proxy.ashx?",
                params: params,
                callback: function (response) {
                    if (response.status === 200) {
                        var esriJsonPerser = new OpenLayers.Format.JSON();
                        esriJsonPerser.extractAttributes = true;
                        var parsedResponse = esriJsonPerser.read(response.responseText);

                        if (parsedResponse && parsedResponse.results && parsedResponse.results.length > 0) {
                            var alertText = "";
                            var lastText = null;
                            for (var i = 0; i < parsedResponse.results.length; i++) {
                                var name = parsedResponse.results[i].attributes["Primary Designation Name"];
                                var type = parsedResponse.results[i].attributes["Primary Designation Type"];

                                var owner = parsedResponse.results[i].attributes["Owner Name"];
                                var manager = parsedResponse.results[i].attributes["Manager Name"];

                                var newText = "";

                                if (name && name != "Null" && isNaN(parseFloat(name))) {
                                    // some of the names start with a number - skip those
                                    newText += name;
                                } else if (type && type != "Null") {
                                    newText += type;
                                }

                                if (manager && manager != "Null") {
                                    newText += (newText) ? ": " + manager : manager;
                                } else if (owner && owner != "Null") {
                                    newText += (newText) ? ": " + owner : owner;
                                }

                                if (newText != lastText) {
                                    if (lastText != null) {
                                        alertText += ", \n";
                                    }
                                    alertText += newText;
                                }
                                lastText = newText;
                            }

                            score.popupMessage = alertText;
                            score.updateValue(parsedResponse.results.length);
                        } else {
                            score.popupMessage = "None";
                            score.updateValue(0);
                        }
                    } else {
                        score.popupMessage = "Error " + response.status;
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
                        description: "The type of land cover found in the center of a site, using NLCD map data hosted by UI-GAP (gap.uidaho.edu)",
                        category: "Land Use",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        //TODO: need a categorical scoring system
                        // for now, this is a constant value (always returns the max, why not)
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 100, "NU", "The minimum Land Cover allowed.", "The maximum Land Cover allowed.")
                        },
                        weight: 0
                    }
                ],
                infoTools: null
            });
        }
        LandCoverModule.prototype.addMap = function () {
            this.landCoverLayer = new OpenLayers.Layer.ArcGIS93Rest("Land Cover", this.landCoverRestUrl + "export", {
                layers: "show:0,1,2",
                format: "gif",
                srs: "3857",
                transparent: "true"
            });
            this.landCoverLayer.setOpacity(0.3);
            this.landCoverLayer.epsgOverride = "3857";
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
                layers: "all",
                tolerance: 0,
                imageDisplay: "1, 1, 96",
                returnGeometry: false
            };

            var request = OpenLayers.Request.GET({
                url: this.landCoverRestUrl + "identify",
                proxy: "/Proxy/proxy.ashx?",
                params: params,
                callback: function (response) {
                    if (response.status === 200) {
                        var esriJsonPerser = new OpenLayers.Format.JSON();
                        esriJsonPerser.extractAttributes = true;
                        var parsedResponse = esriJsonPerser.read(response.responseText);

                        if (parsedResponse && parsedResponse.results && parsedResponse.results.length > 0) {
                            var alertText = "";
                            var lastText = null;
                            for (var i = 0; i < parsedResponse.results.length; i++) {
                                var newText = parsedResponse.results[i].attributes["NVC_DIV"];
                                if (newText != lastText) {
                                    if (lastText != null) {
                                        alertText += ", \n";
                                    }
                                    alertText += newText;
                                }
                                lastText = newText;
                            }

                            score.popupMessage = alertText;
                            score.updateValue(parsedResponse.results.length);
                        } else {
                            score.popupMessage = "No data for this site";
                            score.updateValue(Number.NaN);
                        }
                    } else {
                        score.popupMessage = "Error " + response.status;
                        score.updateValue(Number.NaN);
                    }
                }
            });
        };
        return LandCoverModule;
    })();
    INLModules.LandCoverModule = LandCoverModule;

    var landCoverInstance = new INLModules.LandCoverModule();
})(INLModules || (INLModules = {}));
