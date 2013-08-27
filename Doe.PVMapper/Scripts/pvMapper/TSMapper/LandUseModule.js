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
            this.starRatingHelper = new pvMapper.StarRatingHelper({
                defaultStarRating: 2,
                noCategoryRating: 4,
                noCategoryLabel: "None"
            });
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
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function () {
                            return _this.starRatingHelper.starRatings;
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars")
                        },
                        weight: 10
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
            var _this = this;
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
                            var responseArray = [];
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

                                if (responseArray.indexOf(newText) < 0) {
                                    responseArray.push(newText);
                                }
                            }

                            // use the combined rating string, and its lowest rating value
                            var combinedText = _this.starRatingHelper.sortRatableArray(responseArray);
                            score.popupMessage = combinedText;
                            score.updateValue(_this.starRatingHelper.starRatings[responseArray[0]]);
                        } else {
                            // use the no category label, and its current star rating
                            score.popupMessage = _this.starRatingHelper.options.noCategoryLabel;
                            score.updateValue(_this.starRatingHelper.starRatings[_this.starRatingHelper.options.noCategoryLabel]);
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
            this.ratables = {};
            this.defaultRating = 3;
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
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function () {
                            return _this.ratables;
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars")
                        },
                        weight: 10
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
            var _this = this;
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
                            console.assert(parsedResponse.results.length === 1, "Warning: land cover score tool unexpectedly found more than one land cover type");

                            var landCover = "";
                            var lastText = null;
                            for (var i = 0; i < parsedResponse.results.length; i++) {
                                var newText = parsedResponse.results[i].attributes["NVC_DIV"];
                                if (newText != lastText) {
                                    if (lastText != null) {
                                        landCover += ", \n";
                                    }
                                    landCover += newText;
                                }
                                lastText = newText;
                            }

                            var rating = _this.ratables[landCover];

                            if (typeof rating === "undefined") {
                                var rating = _this.ratables[landCover] = _this.defaultRating;
                            }

                            score.popupMessage = landCover + " [" + rating + (rating === 1 ? " star]" : " stars]");
                            score.updateValue(rating);
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
