/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/starratinghelper.ts" />
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
    //var surveyResults = [
    //    { mi: 0, percentOk: 4.329896907 },
    //    { mi: 0.003787879, percentOk: 4.536082474 },
    //    { mi: 0.005681818, percentOk: 4.742268041 },
    //    { mi: 0.018939394, percentOk: 5.360824742 },
    //    { mi: 0.028409091, percentOk: 5.567010309 },
    //    { mi: 0.075757576, percentOk: 5.773195876 },
    //    { mi: 0.09469697, percentOk: 6.18556701 },
    //    { mi: 0.170454546, percentOk: 6.391752577 },
    //    { mi: 0.189393939, percentOk: 7.216494845 },
    //    { mi: 0.227272727, percentOk: 7.422680412 },
    //    { mi: 0.25, percentOk: 8.24742268 },
    //    { mi: 0.284090909, percentOk: 8.453608247 },
    //    { mi: 0.5, percentOk: 10.30927835 },
    //    { mi: 0.568181818, percentOk: 10.51546392 },
    //    { mi: 1, percentOk: 20.41237113 },
    //    { mi: 1.5, percentOk: 20.6185567 },
    //    { mi: 2, percentOk: 27.42268041 },
    //    { mi: 3, percentOk: 30.92783505 },
    //    { mi: 4, percentOk: 32.37113402 },
    //    { mi: 4.349598346, percentOk: 32.57731959 },
    //    { mi: 5, percentOk: 47.62886598 },
    //    { mi: 6, percentOk: 48.24742268 },
    //    { mi: 7, percentOk: 48.86597938 },
    //    { mi: 8, percentOk: 51.13402062 },
    //    { mi: 10, percentOk: 65.56701031 },
    //    { mi: 12, percentOk: 65.77319588 },
    //    { mi: 15, percentOk: 69.89690722 },
    //    { mi: 16, percentOk: 70.10309278 },
    //    { mi: 18.9, percentOk: 70.30927835 },
    //    { mi: 20, percentOk: 75.87628866 },
    //    { mi: 25, percentOk: 79.79381443 },
    //    { mi: 30, percentOk: 82.4742268 },
    //    { mi: 35, percentOk: 82.68041237 },
    //    { mi: 40, percentOk: 83.91752577 },
    //    { mi: 45, percentOk: 84.12371134 },
    //    { mi: 50, percentOk: 91.54639175 },
    //    { mi: 60, percentOk: 92.16494845 },
    //    { mi: 70, percentOk: 92.78350515 },
    //    { mi: 75, percentOk: 92.98969072 },
    //    { mi: 80, percentOk: 93.19587629 },
    //    { mi: 90, percentOk: 93.60824742 },
    //    { mi: 100, percentOk: 96.70103093 },
    //    { mi: 120, percentOk: 96.90721649 },
    //    { mi: 150, percentOk: 97.31958763 },
    //    { mi: 200, percentOk: 98.1443299 },
    //    { mi: 300, percentOk: 98.35051546 },
    //    { mi: 500, percentOk: 99.17525773 },
    //    { mi: 1000, percentOk: 99.79381443 },
    //    { mi: 5000, percentOk: 100 }];
    var surveyResults = [
        { mi: 0.25, low: 4.00, high: 9.10, average: 6.55, plusOrMinus: 2.55 },
        { mi: 0.50, low: 4.50, high: 10.20, average: 7.35, plusOrMinus: 2.85 },
        { mi: 1.00, low: 5.00, high: 10.80, average: 7.90, plusOrMinus: 2.90 },
        { mi: 1.50, low: 13.80, high: 25.80, average: 19.80, plusOrMinus: 6.00 },
        { mi: 2.00, low: 13.90, high: 25.80, average: 19.85, plusOrMinus: 5.95 },
        { mi: 2.50, low: 18.90, high: 31.40, average: 25.15, plusOrMinus: 6.25 },
        { mi: 3.00, low: 19.00, high: 31.50, average: 25.25, plusOrMinus: 6.25 },
        { mi: 3.50, low: 24.40, high: 37.70, average: 31.05, plusOrMinus: 6.65 },
        { mi: 4.00, low: 24.40, high: 37.70, average: 31.05, plusOrMinus: 6.65 },
        { mi: 4.50, low: 26.70, high: 40.20, average: 33.45, plusOrMinus: 6.75 },
        { mi: 5.00, low: 26.70, high: 40.20, average: 33.45, plusOrMinus: 6.75 }
    ];

    var WildlifeSocialModule = (function (_super) {
        __extends(WildlifeSocialModule, _super);
        function WildlifeSocialModule() {
            var _this = this;
            _super.call(this);
            this.id = "WildlifeSocialModule";
            this.author = "Scott Brown, INL";
            this.version = "0.1.ts";
            this.url = selfUrl;
            this.title = "Wildlife Proximity";
            this.category = "Social Acceptance";
            this.description = "Percentage of people who would report this distance from sensitive wildlife habitat as acceptable, according to our survey";
            //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
            this.fwsExportUrl = "https://ecos.fws.gov/arcgis/rest/services/crithab/usfwsCriticalHabitat/MapServer/export";
            this.fwsQueryUrl = "https://ecos.fws.gov/arcgis/rest/services/crithab/usfwsCriticalHabitat/MapServer/2/query";
            this.addAllMaps = function () {
                if (!_this.mapLayer) {
                    _this.mapLayer = new OpenLayers.Layer.ArcGIS93Rest("Sensitive Wildlife Habitat", _this.fwsExportUrl, {
                        layers: "show:2",
                        format: "gif",
                        srs: "4326",
                        transparent: "true"
                    });
                    _this.mapLayer.setOpacity(0.3);

                    //mapLayer.epsgOverride = "3857"; //"EPSG:102100";
                    _this.mapLayer.setVisibility(false);
                }

                pvMapper.map.addLayer(_this.mapLayer);
                //pvMapper.map.setLayerIndex(mapLayer, 0);
            };
            this.removeAllMaps = function () {
                if (_this.mapLayer)
                    pvMapper.map.removeLayer(_this.mapLayer, false);
            };
            // cache for features we've found from which we can find a nearest feature.
            this.nearestFeatureCache = [];
            // the smallest search distance used to populate any set of features in the feature cache
            this.nearestFeatureCache_searchDistanceInMi = 5;
            this.updateScore = function (score) {
                if (typeof _this.nearestFeatureCache[score.site.id] !== 'undefined') {
                    // we have a cached copy of our nearby habitats query for this site - let's use that.
                    _this.updateScoreFromCache(score);
                } else {
                    // we don't have a cached copy of our nearby habitats - let's request them.
                    _this.updateScoreFromWeb(score);
                }
            };
            this.updateScoreFromWeb = function (score) {
                var maxSearchDistanceInKM = 5 * 1.60934;
                var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;

                // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
                var jsonpProtocol = new OpenLayers.Protocol.Script({
                    url: _this.fwsQueryUrl,
                    params: {
                        f: "json",
                        maxAllowableOffset: 20,
                        outFields: "comname,status,type",
                        geometryType: "esriGeometryEnvelope",
                        geometry: new OpenLayers.Bounds(score.site.geometry.bounds.left - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.bottom - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.right + maxSearchDistanceInMeters + 1000, score.site.geometry.bounds.top + maxSearchDistanceInMeters + 1000).toBBOX(0, false),
                        inSR: "3857",
                        outSR: "3857"
                    },
                    format: new OpenLayers.Format.EsriGeoJSON(),
                    parseFeatures: function (data) {
                        if (data.error)
                            return null;
                        return this.format.read(data);
                    },
                    callback: function (response) {
                        if (response.success() && !(response.data && response.data.error) && !response.error) {
                            // cache the returned features, then update the score through the cache
                            _this.nearestFeatureCache[score.site.id] = response.features || [];
                            _this.updateScoreFromCache(score);
                        } else if (response.data && response.data.error) {
                            score.popupMessage = "Server error " + ((response.data.error.code && response.data.error.message) ? (response.data.error.code + " " + response.data.error.message) : response.data.error.toString());
                            score.updateValue(Number.NaN);
                        } else if (response.error) {
                            score.popupMessage = "Request error " + ((response.error.code && response.error.message) ? (response.data.error.code + " " + response.error.message) : response.error.toString());
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

                var maxSearchDistanceInKM = 5 * 1.60934;
                var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;

                var closestFeature = null;
                var minDistance = maxSearchDistanceInMeters;

                if (features) {
                    for (var i = 0; i < features.length; i++) {
                        var distance = score.site.geometry.distanceTo(features[i].geometry, { edge: false });
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestFeature = features[i];
                        }
                    }
                }

                if (closestFeature !== null) {
                    var minDistanceInMi = minDistance * 0.000621371;

                    var previousDistance = surveyResults[surveyResults.length - 2].mi;
                    var surveyResult = surveyResults[surveyResults.length - 1];
                    for (var i = 0; i < surveyResults.length - 1; i++) {
                        if (minDistanceInMi < surveyResults[i].mi) {
                            surveyResult = surveyResults[i];
                            previousDistance = i <= 0 ? 0 : surveyResults[i - 1].mi;
                            break;
                        }
                    }

                    score.popupMessage = surveyResult.average + "% &plusmn; " + surveyResult.plusOrMinus + "% of people would accept a site built " + previousDistance + " mi - " + surveyResult.mi + " mi away from sensitive wildlife habitat (95% confidence interval). " + (closestFeature.attributes.comname ? "The nearest habitat, for the " + closestFeature.attributes.comname + ", is " + minDistanceInMi.toFixed(2) + " mi away." : "The nearest habitat is " + minDistanceInMi.toFixed(2) + " mi away.");

                    score.updateValue(surveyResult.average);
                } else {
                    score.popupMessage = "There was no sensitive wildlife habitat found within 5 mi of this site.";
                    score.updateValue(100); //surveyResults[surveyResults.length - 1].average); //TODO: what is the appropriate value to use here? 100%? the largest % we have in the table? Number.NaN ?!?
                }
            };

            var thisModule = this;
            this.init({
                activate: null,
                deactivate: null,
                scoringTools: [{
                        activate: function () {
                            var thisScoreLine = this;

                            thisModule.addAllMaps();
                        },
                        deactivate: function () {
                            thisModule.removeAllMaps();
                        },
                        id: "WildlifeSocialTool",
                        title: "Wildlife Proximity",
                        category: "Social Acceptance",
                        description: "Percentage of people who would report this distance from sensitive wildlife habitat as acceptable, according to our survey",
                        longDescription: '<p>This tool calculates the distance from a site to the nearest critical wildlife habitat, and then reports, with a 95% confidence interval, the estimated percentage of residents who would say that distance is an acceptable buffer between a large solar facility and a wildlife breeding ground or nesting site.</p><p>The survey used in this tool was administered by the PVMapper project in 2013 and 2014. From the 2013 survey, 484 respondents from six counties in Southern California answered Question 18 which asked "How much buffer distance is acceptable between a large solar facility and an area used as nesting sites or breeding grounds by wildlife?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest wildlife area is identified using the Critical Habitat Portal by the US Fish and Wildlife Service. Note that several issues with this. First, the FWS dataset includes habitat which are not breeding or nesting grounds. Second, it only includes data on critical and endangered species, while the survey question was not so limited. And third, the data portal does not include habitat for all critical and endangered species. See the FWS website for more information (ecos.fws.gov/crithab).</p><p>Due to these limitations, results from this tool should be considered preliminary and approximate.</p>',
                        onSiteChange: function (e, score) {
                            thisModule.updateScore(score);
                        },
                        // having any nearby line is much better than having no nearby line, so let's reflect that.
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor", "% of respondants in favor", "Prefer sites with greater social acceptance of historical landmark proximity. Expect diminishing returns from increasing acceptance. The minimum possible score is 40, reflecting an assumption that low social acceptance may not be prohibitive.")
                        },
                        weight: 5
                    }]
            });
        }
        return WildlifeSocialModule;
    })(pvMapper.Module);
    INLModules.WildlifeSocialModule = WildlifeSocialModule;

    pvMapper.moduleManager.registerModule(new INLModules.WildlifeSocialModule(), true);
})(INLModules || (INLModules = {}));
//# sourceMappingURL=WildlifeSocialModule.js.map
