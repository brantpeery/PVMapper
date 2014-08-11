/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var INLModules;
(function (INLModules) {
    //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?
    var SoilModule = (function (_super) {
        __extends(SoilModule, _super);
        function SoilModule() {
            var _this = this;
            _super.call(this);
            this.id = "SoilModule";
            this.author = "Leng Vang, INL";
            this.version = "0.1.ts";
            this.url = selfUrl;
            this.title = "Soil";
            this.category = "Geography";
            this.description = "Overlapping soil types, using the Soil Survey Geographic (SSURGO) map hosted by arcgisonline.com";
            this.starRatingHelper = new pvMapper.StarRatingHelper({
                defaultStarRating: 3
            });
            this.soilRestUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/";
            this.soilSurveyQueryUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/0/query";
            this.addMap = function () {
                if (!_this.soilLayer) {
                    _this.soilLayer = new OpenLayers.Layer.ArcGIS93Rest("Soil Type", _this.soilRestUrl + "export", {
                        layers: "show:0",
                        format: "gif",
                        srs: "3857",
                        transparent: "true"
                    });
                    _this.soilLayer.setOpacity(0.3);
                    _this.soilLayer.epsgOverride = "3857"; //"EPSG:102100";
                    _this.soilLayer.setVisibility(false);
                }

                pvMapper.map.addLayer(_this.soilLayer);
                //pvMapper.map.setLayerIndex(mapLayer, 0);
            };
            this.removeMap = function () {
                pvMapper.map.removeLayer(_this.soilLayer, false);
            };
            // cache for features we've found from which we can find a nearest feature.
            this.nearestFeatureCache = {};
            this.updateScore = function (score) {
                //Note: I've disabled caching nearby geometries - the geometries returned by this server have thousands of points, so it seemed easier to send new requests each time.
                //if (typeof this.nearestFeatureCache[score.site.id] !== 'undefined') {
                //    // we have a cached copy of our nearby habitats query for this site - let's use that.
                //    this.updateScoreFromCache(score);
                //} else {
                //    // we don't have a cached copy of our nearby habitats - let's request them.
                _this.updateScoreFromWeb(score);
                //}
            };
            this.updateScoreFromWeb = function (score) {
                //var searchBounds = new OpenLayers.Bounds(
                //    score.site.geometry.bounds.left - 1000,
                //    score.site.geometry.bounds.bottom - 1000,
                //    score.site.geometry.bounds.right + 1000,
                //    score.site.geometry.bounds.top + 1000)
                //    .toBBOX(0, false);
                // search only for soils that intersect our site polygon.
                var geoJsonPolygon = OpenLayers.Format.GeoJSON.prototype.write(score.site.geometry, false);
                geoJsonPolygon = geoJsonPolygon.replace('"type":"Polygon",', '');
                geoJsonPolygon = geoJsonPolygon.replace('"coordinates":', '"rings":');

                //var toEsriGeoJson: any = <any>geoJsonConverter();
                //var sitePolygonEsri = toEsriGeoJson.toEsri(score.site);
                //var params = {
                //    mapExtent: searchBounds,
                //    geometryType: "esriGeometryEnvelope",
                //    geometry: searchBounds,
                //    f: "json", // or "html",
                //    layers: "all:0,1", //"perezANN_mod", //solar.params.LAYERS,
                //    tolerance: 0, //TODO: should this be 0 or 1?
                //    imageDisplay: "100, 100, 96",
                //};
                // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
                var jsonpProtocol = new OpenLayers.Protocol.Script({
                    //url: this.soilRestUrl + "identify",
                    url: _this.soilSurveyQueryUrl,
                    params: {
                        f: "json",
                        outFields: "muname,muhelcl,farmlndcl,DrainageCl",
                        geometryType: "esriGeometryPolygon",
                        geometry: geoJsonPolygon,
                        //geometryType: "esriGeometryEnvelope",
                        //geometry: searchBounds,
                        returnGeometry: false
                    },
                    format: new OpenLayers.Format.EsriGeoJSON(),
                    parseFeatures: function (data) {
                        return data.features;
                        ////HACK: it seems that we didn't get a spatial reference, so hack one in.
                        //data.spatialReference = data.spatialReference || {};
                        //data.spatialReference.wkid = data.spatialReference.wkid || "3857";
                        //return this.format.read(data);
                    },
                    callback: function (response) {
                        if (response.success() && !(response.data && response.data.error)) {
                            // cache the returned features, then update the score through the cache
                            _this.nearestFeatureCache[score.site.id] = response.features || [];
                            _this.updateScoreFromCache(score);
                        } else if (response.data && response.data.error) {
                            score.popupMessage = "Error " + ((response.data.error.code && response.data.error.message) ? (response.data.error.code + ": " + response.data.error.message) : response.data.error.toString());
                            score.updateValue(Number.NaN);
                        } else {
                            score.popupMessage = "Unknown error";
                            score.updateValue(Number.NaN);
                        }
                    }
                });

                var response = jsonpProtocol.read();
            };
            this.updateScoreFromCache = function (score) {
                var features = _this.nearestFeatureCache[score.site.id];

                var responseArray = [];

                if (features) {
                    for (var i = 0; i < features.length; i++) {
                        //if (score.site.geometry.intersects(features[i].geometry)) {
                        var newText = features[i].attributes["muname"] + (features[i].attributes["DrainageCl"] ? ", " + features[i].attributes["DrainageCl"] : "");
                        if (newText && responseArray.indexOf(newText) < 0) {
                            // add this to the array of responses we've received
                            responseArray.push(newText);

                            // if we have a valid erodale class definition, and no current star rating,
                            // then let's go ahead and use the erodable class definition as the star rating.
                            if (typeof _this.starRatingHelper.starRatings[newText] === "undefined") {
                                switch (features[i].attributes["muhelcl"]) {
                                    case "Highly erodible land":
                                        _this.starRatingHelper.starRatings[newText] = 2;
                                        break;
                                    case "Potentially highly erodible land":
                                        _this.starRatingHelper.starRatings[newText] = 3;
                                        break;
                                    case "Not highly erodible land":
                                        _this.starRatingHelper.starRatings[newText] = 4;
                                        break;
                                }
                            }
                        }
                        //}
                    }
                }

                if (responseArray.length > 0) {
                    // use the combined rating string, and its lowest rating value
                    var combinedText = _this.starRatingHelper.sortRatableArray(responseArray);
                    score.popupMessage = combinedText;
                    score.updateValue(_this.starRatingHelper.starRatings[responseArray[0]]);
                } else {
                    // no data available - cannot guess soil type, so let's go with NaN here (?)
                    score.popupMessage = "No soil data here.";
                    score.updateValue(Number.NaN);
                    //score.popupMessage = this.starRatingHelper.options.noCategoryLabel;
                    //score.updateValue(this.starRatingHelper.starRatings[
                    //    this.starRatingHelper.options.noCategoryLabel]);
                }
            };

            var thisModule = this;
            this.init({
                activate: null,
                deactivate: null,
                scoringTools: [{
                        activate: function () {
                            _this.addMap();
                        },
                        deactivate: function () {
                            _this.removeMap();
                        },
                        id: "SoilTool",
                        title: "Soil",
                        category: "Geography",
                        description: "Overlapping soil types, using the Soil Survey Geographic (SSURGO) map hosted by arcgisonline.com",
                        longDescription: '<p>This star rating tool finds the various types of soil present at a proposed site. These ares are defined in the Soil Survey Geographic (SSURGO) dataset from the National Cooperative Soil Survey. SSURGO digitizing duplicates the original soil survey maps. This level of mapping is designed for use by landowners, townships, and county natural resource planning and management. Note that the extent of SSURGO data is limited to soil survey areas; many counties and parts counties are not included. For more information, see the USDA Natural Resource Conservation Service (soils.usda.gov/survey/geography/ssurgo).</p><p>This tool depends on a user-defined star rating for each soil type found at a site, on a scale of 0-5 stars. The default rating for soil types is based on their erodability. "Highly erodible land" gets two stars by default; "potentially highly erodible land" is given three stars; "Not highly erodible land" has four stars. These ratings may be further adjusted by the user. Note that the user should be knowledgeable of soils data and their characteristics.</p><p>When a site has just one soil type, its score is based on the star rating of that soil (so overlapping a five-star soil type might give a score of 100, while overlapping a one-star soil may give a score of 20). If a site includes more than one soil type, the lowest star rating is used to calculate its score (so a site with both a one-star and a five-star soil might have a score of 20). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>',
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function () {
                            return _this.starRatingHelper.starRatings;
                        },
                        setStarRatables: function (rateTable) {
                            //$.extend(this.starRatingHelper.starRatings, rateTable);
                            thisModule.starRatingHelper.resetStarRatings(rateTable);

                            // update any scores which aren'r already out for update (those will pick up the new star ratings when they return)
                            var thisScoreLine = this;
                            thisScoreLine.scores.forEach(function (s) {
                                if (!s.isValueOld) {
                                    s.isValueOld = true;
                                    thisModule.updateScore(s);
                                }
                            });
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Star Rating", "Prefer sites with less erodible, higher-rated soil")
                        },
                        weight: 10
                    }]
            });
        }
        return SoilModule;
    })(pvMapper.Module);
    INLModules.SoilModule = SoilModule;

    pvMapper.moduleManager.registerModule(new INLModules.SoilModule(), true);
})(INLModules || (INLModules = {}));
//# sourceMappingURL=SoilModule.js.map
