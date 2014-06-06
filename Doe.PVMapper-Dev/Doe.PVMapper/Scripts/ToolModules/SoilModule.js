/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/options.d.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />
var INLModules;
(function (INLModules) {
    var SoilModule = (function () {
        function SoilModule() {
            var _this = this;
            this.starRatingHelper = new pvMapper.StarRatingHelper({
                defaultStarRating: 3
            });
            this.soilRestUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/";
            this.soilSurveyQueryUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/0/query";
            // cache for features we've found from which we can find a nearest feature.
            this.nearestFeatureCache = {};
            var myModule = new pvMapper.Module({
                id: "SoilModule",
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
                scoringTools: [{
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: SoilModule.title,
                        category: SoilModule.category,
                        description: SoilModule.description,
                        longDescription: SoilModule.longDescription,
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function (mode) {
                            if ((mode !== undefined) && (mode === "default"))
                                return _this.starRatingHelper.defaultStarRatings;
                            else
                                return _this.starRatingHelper.starRatings;
                        },
                        setStarRatables: function (rateTable) {
                            $.extend(_this.starRatingHelper.starRatings, rateTable);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Favor Soil", "Score", "They say sandy soil is not stable ground, is it?")
                        },
                        weight: 10
                    }],
                infoTools: null
            });
            this.getModuleObj = function () {
                return myModule;
            };
        }
        var SoilMetaData = Ext.htmlEncode("Title: Soil Survey Map<br>Author: ESRI<br>Subject: natural resources<br>Keywords: soil,US Department of Agriculture,USDA,Natural Resources Conservation Service,NRCS,National,Federal,USA<br>AntialiasingMode: None<br>TextAntialiasingMode: Force<br>Format: PNG8<br><br>Min Scale: 5.91657527591555E8<br>Max Scale: 9027.977411<br><br>Service Description: USDA/NRCS SSURGO: This layer shows the Soil Survey Geographic (SSURGO) by the United States Department of Agriculture’s Natural Resources Conservation Service. SSURGO digitizing duplicates the original soil survey maps. This level of mapping is designed for use by landowners, townships, and county natural resource planning and management. The user should be knowledgeable of soils data and their characteristics. The soil units are symbolized by Esri to show the dominant condition for the 12 soil orders according to Soil Taxonomy. Dominant condition was determined by evaluating each of the components in a map unit; the percentage of the component that each soil order represented was accumulated for all the soil orders present in the map unit. The soil order with the highest accumulated percentage is then characterized as the dominant condition for that unit. If a tie was found between soil orders, a “tie-break” rule was applied. The tie-break was based on the component’s “slope_r” attribute value, which represents the Slope Gradient – Representative Value. The slope_r values were accumulated in the same fashion as the soil order attributes, i.e., by soil order, and the order with the lowest slope_r value was selected as dominant because that represented the lower slope value, and therefore we assumed the soils were more likely to be staying in that area or being deposited in that area. USDA/NRCS STATSGO This layer shows the U.S. General Soil Map of general soil association units by the United States Department of Agriculture’s Natural Resources Conservation Service. It was developed by the National Cooperative Soil Survey and supersedes the State Soil Geographic (STATSGO) dataset published in 1994. It consists of a broad-based inventory of soils and non-soil areas that occur in a repeatable pattern on the landscape and that can be cartographically shown at the scale mapped. The soil units are symbolized by Esri to show the dominant condition for the 12 soil orders according to Soil Taxonomy. Dominant condition was determined by evaluating each of the components in a map unit; the percentage of the component that each soil order represented was accumulated for all the soil orders present in the map unit. The soil order with the highest accumulated percentage is then characterized as the dominant condition for that unit. If a tie was found between soil orders, a “tie-break” rule was applied. The tie-break was based on the component’s “slope_r” attribute value, which represents the Slope Gradient – Representative Value. The slope_r values were accumulated in the same fashion as the soil order attributes, i.e., by soil order, and the order with the lowest slope_r value was selected as dominant because that represented the lower slope value, and therefore we assumed the soils were more likely to be staying in that area or being deposited in that area. USDA/NRCS GLOBAL SOIL REGIONS This layer shows the Global Soil Regions map by the United States Department of Agriculture’s Natural Resources Conservation Service. The data and symbology are based on a reclassification of the FAO-UNESCO Soil Map of the World combined with a soil climate map. The soils data is symbolized to show the distribution of the 12 soil orders according to Soil Taxonomy. For more information on this map, including the terms of use, visit us online.");
        SoilModule.prototype.addMap = function () {
            this.soilLayer = new OpenLayers.Layer.ArcGIS93Rest("<img class=\"on_c_img\" mdata=\"" + SoilMetaData + "\" src='http://www.iconsdb.com/icons/preview/tropical-blue/info-xxl.png' style='width:20px; height:20px'> " + "Soil Type", this.soilRestUrl + "export", {
                layers: "show:0",
                format: "gif",
                srs: "3857",
                transparent: "true"
            });
            this.soilLayer.setOpacity(0.3);
            this.soilLayer.epsgOverride = "3857"; //"EPSG:102100";
            this.soilLayer.setVisibility(false);

            pvMapper.map.addLayer(this.soilLayer);
            //pvMapper.map.setLayerIndex(mapLayer, 0);
        };

        SoilModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.soilLayer, false);
        };

        SoilModule.prototype.updateScore = function (score) {
            //Note: I've disabled caching nearby geometries - the geometries returned by this server have thousands of points, so it seemed easier to send new requests each time.
            //if (typeof this.nearestFeatureCache[score.site.id] !== 'undefined') {
            //    // we have a cached copy of our nearby habitats query for this site - let's use that.
            //    this.updateScoreFromCache(score);
            //} else {
            //    // we don't have a cached copy of our nearby habitats - let's request them.
            this.updateScoreFromWeb(score);
            //}
        };

        SoilModule.prototype.updateScoreFromWeb = function (score) {
            //var searchBounds = new OpenLayers.Bounds(
            //    score.site.geometry.bounds.left - 1000,
            //    score.site.geometry.bounds.bottom - 1000,
            //    score.site.geometry.bounds.right + 1000,
            //    score.site.geometry.bounds.top + 1000)
            //    .toBBOX(0, false);
            var _this = this;
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
                url: this.soilSurveyQueryUrl,
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
                    if (response.success()) {
                        if (response.data.error) {
                            score.popupMessage = "Server error " + response.data.error.code + " " + response.data.error.message;
                            score.updateValue(Number.NaN);
                        } else {
                            // cache the returned features, then update the score through the cache
                            _this.nearestFeatureCache[score.site.id] = response.features || [];
                            _this.updateScoreFromCache(score);
                        }
                    } else {
                        score.popupMessage = "Request error " + response.error.toString();
                        score.updateValue(Number.NaN);
                    }
                }
            });

            var response = jsonpProtocol.read();
        };

        SoilModule.prototype.updateScoreFromCache = function (score) {
            var features = this.nearestFeatureCache[score.site.id];

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
                        if (typeof this.starRatingHelper.starRatings[newText] === "undefined") {
                            switch (features[i].attributes["muhelcl"]) {
                                case "Highly erodible land":
                                    this.starRatingHelper.starRatings[newText] = 2;
                                    break;
                                case "Potentially highly erodible land":
                                    this.starRatingHelper.starRatings[newText] = 3;
                                    break;
                                case "Not highly erodible land":
                                    this.starRatingHelper.starRatings[newText] = 4;
                                    break;
                            }
                        }
                    }
                    //}
                }
            }

            if (responseArray.length > 0) {
                // use the combined rating string, and its lowest rating value
                var combinedText = this.starRatingHelper.sortRatableArray(responseArray);
                score.popupMessage = combinedText;
                score.updateValue(this.starRatingHelper.starRatings[responseArray[0]]);
            } else {
                // no data available - cannot guess soil type, so let's go with NaN here (?)
                score.popupMessage = "No soil data here.";
                score.updateValue(Number.NaN);
                //score.popupMessage = this.starRatingHelper.options.noCategoryLabel;
                //score.updateValue(this.starRatingHelper.starRatings[
                //    this.starRatingHelper.options.noCategoryLabel]);
            }
        };
        SoilModule.title = "Soil";
        SoilModule.category = "Geography";
        SoilModule.description = "Overlapping soil types, using the Soil Survey Geographic (SSURGO) map hosted by arcgisonline.com";
        SoilModule.longDescription = '<p>This star rating tool finds the various types of soil present at a proposed site. These ares are defined in the Soil Survey Geographic (SSURGO) dataset from the National Cooperative Soil Survey. SSURGO digitizing duplicates the original soil survey maps. This level of mapping is designed for use by landowners, townships, and county natural resource planning and management. Note that the extent of SSURGO data is limited to soil survey areas; many counties and parts counties are not included. For more information, see the USDA Natural Resource Conservation Service (soils.usda.gov/survey/geography/ssurgo).</p><p>This tool depends on a user-defined star rating for each soil type found at a site, on a scale of 0-5 stars. The default rating for all soil types is three stars. These ratings should be adjusted by the user. Note that the user should be knowledgeable of soils data and their characteristics.</p><p>When a site has just one soil type, its score is based on the star rating of that soil (so overlapping a five-star soil type might give a score of 100, while overlapping a one-star soil may give a score of 20). If a site includes more than one soil type, the lowest star rating is used to calculate its score (so a site with both a one-star and a five-star soil might have a score of 20). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>';
        return SoilModule;
    })();
    INLModules.SoilModule = SoilModule;
})(INLModules || (INLModules = {}));

if (typeof (selfUrl) == 'undefined')
    var selfUrl = $('script[src$="SoilModule.js"]').attr('src');
if (typeof (isActive) == 'undefined')
    var isActive = true;
pvMapper.moduleManager.registerModule(INLModules.SoilModule.category, INLModules.SoilModule.title, INLModules.SoilModule, isActive, selfUrl);
//# sourceMappingURL=SoilModule.js.map
