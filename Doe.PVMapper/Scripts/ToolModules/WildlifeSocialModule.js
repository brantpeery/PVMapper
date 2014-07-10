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
    

    var surveyResults = [
        { mi: 0, percentOk: 4.329896907 },
        { mi: 0.003787879, percentOk: 4.536082474 },
        { mi: 0.005681818, percentOk: 4.742268041 },
        { mi: 0.018939394, percentOk: 5.360824742 },
        { mi: 0.028409091, percentOk: 5.567010309 },
        { mi: 0.075757576, percentOk: 5.773195876 },
        { mi: 0.09469697, percentOk: 6.18556701 },
        { mi: 0.170454546, percentOk: 6.391752577 },
        { mi: 0.189393939, percentOk: 7.216494845 },
        { mi: 0.227272727, percentOk: 7.422680412 },
        { mi: 0.25, percentOk: 8.24742268 },
        { mi: 0.284090909, percentOk: 8.453608247 },
        { mi: 0.5, percentOk: 10.30927835 },
        { mi: 0.568181818, percentOk: 10.51546392 },
        { mi: 1, percentOk: 20.41237113 },
        { mi: 1.5, percentOk: 20.6185567 },
        { mi: 2, percentOk: 27.42268041 },
        { mi: 3, percentOk: 30.92783505 },
        { mi: 4, percentOk: 32.37113402 },
        { mi: 4.349598346, percentOk: 32.57731959 },
        { mi: 5, percentOk: 47.62886598 },
        { mi: 6, percentOk: 48.24742268 },
        { mi: 7, percentOk: 48.86597938 },
        { mi: 8, percentOk: 51.13402062 },
        { mi: 10, percentOk: 65.56701031 },
        { mi: 12, percentOk: 65.77319588 },
        { mi: 15, percentOk: 69.89690722 },
        { mi: 16, percentOk: 70.10309278 },
        { mi: 18.9, percentOk: 70.30927835 },
        { mi: 20, percentOk: 75.87628866 },
        { mi: 25, percentOk: 79.79381443 },
        { mi: 30, percentOk: 82.4742268 },
        { mi: 35, percentOk: 82.68041237 },
        { mi: 40, percentOk: 83.91752577 },
        { mi: 45, percentOk: 84.12371134 },
        { mi: 50, percentOk: 91.54639175 },
        { mi: 60, percentOk: 92.16494845 },
        { mi: 70, percentOk: 92.78350515 },
        { mi: 75, percentOk: 92.98969072 },
        { mi: 80, percentOk: 93.19587629 },
        { mi: 90, percentOk: 93.60824742 },
        { mi: 100, percentOk: 96.70103093 },
        { mi: 120, percentOk: 96.90721649 },
        { mi: 150, percentOk: 97.31958763 },
        { mi: 200, percentOk: 98.1443299 },
        { mi: 300, percentOk: 98.35051546 },
        { mi: 500, percentOk: 99.17525773 },
        { mi: 1000, percentOk: 99.79381443 },
        { mi: 5000, percentOk: 100 }];

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
            this.description = "Percentage of survey respondents who reported this distance from sensitive wildlife habitat as acceptable";
            //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
            this.configProperties = {
                //maxSearchDistanceInKM: 30,
                maxSearchDistanceInMI: 20
            };
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
            // if we change our search distance to something larger than this, we'll need to requery the server.
            this.nearestFeatureCache_searchDistanceInMi = this.configProperties.maxSearchDistanceInMI;
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
                var maxSearchDistanceInKM = _this.configProperties.maxSearchDistanceInMI * 1.60934;
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
                        if (response.success()) {
                            // cache the returned features, then update the score through the cache
                            _this.nearestFeatureCache[score.site.id] = response.features || [];
                            _this.updateScoreFromCache(score);
                        } else if (response.data.error) {
                            score.popupMessage = "Server error " + response.data.error.toString();
                            score.updateValue(Number.NaN);
                        } else {
                            score.popupMessage = "Request error " + response.error.toString();
                            score.updateValue(Number.NaN);
                        }
                    }
                });

                var response = jsonpProtocol.read();
            };
            this.updateScoreFromCache = function (score) {
                var features = _this.nearestFeatureCache[score.site.id];

                var maxSearchDistanceInKM = _this.configProperties.maxSearchDistanceInMI * 1.60934;
                var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;

                var closestFeature = null;
                var minDistance = maxSearchDistanceInMeters;

                if (features) {
                    for (var i = 0; i < features.length; i++) {
                        var distance = score.site.geometry.distanceTo(features[i].geometry);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestFeature = features[i];
                        }
                    }
                }

                //"Power_Plant,Owner,Plant_Operator,Operating_Capacity_MW"
                if (closestFeature !== null) {
                    var minDistanceInMi = minDistance * 0.000621371;

                    var percentOk = 0;
                    var distanceOk = 5000;
                    for (var i = surveyResults.length - 1; i--; i >= 0) {
                        if (minDistanceInMi >= surveyResults[i].mi) {
                            percentOk = surveyResults[i].percentOk;
                            distanceOk = surveyResults[i].mi;
                            break;
                        }
                    }

                    var distanceOkStr = (distanceOk < 1) ? distanceOk.toFixed(2) : (distanceOk < 10) ? distanceOk.toFixed(1) : distanceOk.toFixed(0);

                    var minDistanceStr = (minDistanceInMi < 1) ? minDistanceInMi.toFixed(2) : (minDistanceInMi < 10) ? minDistanceInMi.toFixed(1) : minDistanceInMi.toFixed(0);

                    //var nearestPlantStr: string =
                    //    " (The nearest plant is ";
                    //if (closestFeature.attributes.Power_Plant)
                    //    nearestPlantStr += closestFeature.attributes.Power_Plant + ", ";
                    //if (closestFeature.attributes.Operating_Capacity_MW)
                    //    nearestPlantStr += "a " + closestFeature.attributes.Operating_Capacity_MW + " MW plant ";
                    //if (closestFeature.attributes.Plant_Operator)
                    //    nearestPlantStr += "operated by " + closestFeature.attributes.Plant_Operator + ", ";
                    //else if (closestFeature.attributes.Owner)
                    //    nearestPlantStr += "owned by " + closestFeature.attributes.Owner + ", ";
                    //nearestPlantStr += minDistanceStr + " mi away.)";
                    var nearestPlantStr = closestFeature.attributes.comname ? " (The nearest habitat, for the " + closestFeature.attributes.comname + ", is " + minDistanceStr + " mi away" : " (The nearest habitat is " + minDistanceStr + " mi away";

                    score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " + distanceOkStr + " mi or more from sensitive wildlife habitat." + nearestPlantStr;

                    score.updateValue(percentOk);
                } else {
                    // no existing habitat found nearby
                    // use the % acceptance for our current max search distance
                    var percentOk = 0;
                    var distanceOk = 5000;
                    var minDistanceInMi = _this.configProperties.maxSearchDistanceInMI;

                    for (var i = surveyResults.length - 1; i--; i >= 0) {
                        if (minDistanceInMi >= surveyResults[i].mi) {
                            percentOk = surveyResults[i].percentOk;
                            distanceOk = surveyResults[i].mi;
                            break;
                        }
                    }

                    var distanceOkStr = (distanceOk < 1) ? distanceOk.toFixed(2) : (distanceOk < 10) ? distanceOk.toFixed(1) : distanceOk.toFixed(0);

                    var minDistanceStr = (minDistanceInMi < 1) ? minDistanceInMi.toFixed(2) : (minDistanceInMi < 10) ? minDistanceInMi.toFixed(1) : minDistanceInMi.toFixed(0);

                    score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " + distanceOkStr + " mi or more from sensitive wildlife habitat. (There was no existing habitat found within the " + _this.configProperties.maxSearchDistanceInMI + " mi search distance.)";

                    score.updateValue(percentOk);
                }
            };

            var thisModule = this;
            this.init({
                activate: null,
                deactivate: null,
                scoringTools: [{
                        activate: function () {
                            var thisScoreLine = this;

                            if (!thisModule.propsWindow) {
                                thisModule.propsGrid = Ext.create('Ext.grid.property.Grid', {
                                    nameText: 'Properties Grid',
                                    minWidth: 300,
                                    //autoHeight: true,
                                    source: thisModule.configProperties,
                                    customRenderers: {
                                        maxSearchDistanceInMI: function (v) {
                                            return v + " mi";
                                        }
                                    },
                                    propertyNames: {
                                        maxSearchDistanceInMI: "search distance"
                                    }
                                });

                                // display a cute little properties window describing our doodle here.
                                //Note: this works only as well as our windowing scheme, which is to say poorly
                                //var propsWindow = Ext.create('MainApp.view.Window', {
                                thisModule.propsWindow = Ext.create('Ext.window.Window', {
                                    title: "Configure Wildlife Proximity Tool",
                                    closeAction: "hide",
                                    layout: "fit",
                                    items: [
                                        thisModule.propsGrid
                                    ],
                                    listeners: {
                                        beforehide: function () {
                                            // refresh scores as necessary to accomodate this configuraiton change.
                                            if (thisModule.configProperties.maxSearchDistanceInMI > thisModule.nearestFeatureCache_searchDistanceInMi) {
                                                // we've enlarged our search distance - clear the cache and requery each score from the server.
                                                this.nearestFeatureCache_searchDistanceInMi = this.configProperties.maxSearchDistanceInMI;
                                                thisModule.nearestFeatureCache = [];
                                                thisScoreLine.scores.forEach(function (s) {
                                                    s.isValueOld = true;
                                                    thisModule.updateScoreFromWeb(s);
                                                });
                                            } else {
                                                // let's just recalculate all scores from our existing cache.
                                                thisScoreLine.scores.forEach(function (s) {
                                                    s.isValueOld = true;
                                                    thisModule.updateScoreFromCache(s);
                                                });
                                            }

                                            // save configuration changes to the browser
                                            thisScoreLine.saveConfiguration();
                                        }
                                    },
                                    buttons: [{
                                            xtype: 'button',
                                            text: 'OK',
                                            handler: function () {
                                                thisModule.propsWindow.hide();
                                            }
                                        }],
                                    constrain: true
                                });
                            }

                            thisModule.addAllMaps();
                        },
                        deactivate: function () {
                            thisModule.removeAllMaps();
                        },
                        showConfigWindow: function () {
                            thisModule.propsWindow.show();
                        },
                        id: "WildlifeSocialTool",
                        title: "Wildlife Proximity",
                        category: "Social Acceptance",
                        description: "Percentage of survey respondents who reported this distance from sensitive wildlife habitat as acceptable",
                        longDescription: '<p>This tool calculates the distance from a site to the nearest critical wildlife habitat, and then reports the percentage of survey respondents who said that distance would be an acceptable buffer between a large solar facility and a wildlife breeding ground or nesting site.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 484 respondents from six counties in Southern California answered Question 18 which asked "How much buffer distance is acceptable between a large solar facility and an area used as nesting sites or breeding grounds by wildlife?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest wildlife area is identified using the Critical Habitat Portal by the US Fish and Wildlife Service. Note that several issues with this. First, the FWS dataset includes habitat which are not breeding or nesting grounds. Second, it only includes data on critical and endangered species, while the survey question was not so limited. And third, the data portal does not include habitat for all critical and endangered species. See the FWS website for more information (ecos.fws.gov/crithab).</p><p>Due to these limitations, results from this tool should be considered preliminary and approximate.</p>',
                        //onScoreAdded: function (e, score: pvMapper.Score) {
                        //    scores.push(score);
                        //},
                        onSiteChange: function (e, score) {
                            thisModule.updateScore(score);
                        },
                        getConfig: function () {
                            return thisModule.configProperties;
                        },
                        setConfig: function (config) {
                            if (config && config.maxSearchDistanceInMI >= 0 && thisModule.configProperties.maxSearchDistanceInMI != config.maxSearchDistanceInMI) {
                                thisModule.configProperties.maxSearchDistanceInMI = config.maxSearchDistanceInMI;

                                if (thisModule.propsGrid)
                                    thisModule.propsGrid.setSource(thisModule.configProperties); // set property grid to match

                                // refresh scores as necessary to accomodate this configuraiton change.
                                var thisScoreLine = this;
                                if (thisModule.configProperties.maxSearchDistanceInMI > thisModule.nearestFeatureCache_searchDistanceInMi) {
                                    // we've enlarged our search distance - clear the cache and requery each score from the server.
                                    this.nearestFeatureCache_searchDistanceInMi = this.configProperties.maxSearchDistanceInMI;
                                    thisModule.nearestFeatureCache = [];
                                    thisScoreLine.scores.forEach(function (s) {
                                        s.isValueOld = true;
                                        thisModule.updateScoreFromWeb(s);
                                    });
                                } else {
                                    // let's just recalculate all scores from our existing cache.
                                    thisScoreLine.scores.forEach(function (s) {
                                        s.isValueOld = true;
                                        thisModule.updateScoreFromCache(s);
                                    });
                                }
                            }
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
