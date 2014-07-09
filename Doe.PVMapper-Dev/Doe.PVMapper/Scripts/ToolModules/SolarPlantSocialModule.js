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
    

    var surveyResults = [
        { mi: 0, percentOk: 33.71040724 },
        { mi: 0.000189394, percentOk: 34.61538462 },
        { mi: 0.000378788, percentOk: 34.84162896 },
        { mi: 0.00094697, percentOk: 35.0678733 },
        { mi: 0.001893939, percentOk: 35.97285068 },
        { mi: 0.003787879, percentOk: 36.42533937 },
        { mi: 0.005681818, percentOk: 37.1040724 },
        { mi: 0.007007576, percentOk: 37.33031674 },
        { mi: 0.009469697, percentOk: 38.00904977 },
        { mi: 0.018939394, percentOk: 39.59276018 },
        { mi: 0.028409091, percentOk: 40.04524887 },
        { mi: 0.037878788, percentOk: 40.27149321 },
        { mi: 0.05, percentOk: 40.49773756 },
        { mi: 0.056818182, percentOk: 41.40271493 },
        { mi: 0.113636364, percentOk: 41.62895928 },
        { mi: 0.189393939, percentOk: 42.08144796 },
        { mi: 0.25, percentOk: 43.66515837 },
        { mi: 0.5, percentOk: 46.15384615 },
        { mi: 0.946969697, percentOk: 46.3800905 },
        { mi: 1, percentOk: 55.20361991 },
        { mi: 2, percentOk: 57.91855204 },
        { mi: 2.5, percentOk: 58.14479638 },
        { mi: 3, percentOk: 58.82352941 },
        { mi: 5, percentOk: 64.9321267 },
        { mi: 6, percentOk: 65.38461538 },
        { mi: 7, percentOk: 65.61085973 },
        { mi: 7.456454307, percentOk: 65.83710407 },
        { mi: 8, percentOk: 69.00452489 },
        { mi: 10, percentOk: 74.88687783 },
        { mi: 15, percentOk: 77.37556561 },
        { mi: 20, percentOk: 83.25791855 },
        { mi: 25, percentOk: 85.0678733 },
        { mi: 30, percentOk: 86.87782805 },
        { mi: 40, percentOk: 87.55656109 },
        { mi: 50, percentOk: 92.760181 },
        { mi: 60, percentOk: 93.21266968 },
        { mi: 70, percentOk: 93.43891403 },
        { mi: 90, percentOk: 93.66515837 },
        { mi: 100, percentOk: 96.83257919 },
        { mi: 120, percentOk: 97.05882353 },
        { mi: 140, percentOk: 97.28506787 },
        { mi: 150, percentOk: 97.51131222 },
        { mi: 200, percentOk: 98.41628959 },
        { mi: 250, percentOk: 98.64253394 },
        { mi: 300, percentOk: 98.86877828 },
        { mi: 500, percentOk: 99.32126697 },
        { mi: 1000, percentOk: 99.54751131 },
        { mi: 2000, percentOk: 99.77375566 },
        { mi: 5000, percentOk: 100 }];

    var SolarPlantSocialModule = (function (_super) {
        __extends(SolarPlantSocialModule, _super);
        function SolarPlantSocialModule() {
            var _this = this;
            _super.call(this);
            this.id = "SolarPlantSocialModule";
            this.author = "Scott Brown, INL";
            this.version = "0.1.ts";
            this.url = selfUrl;
            this.title = "Existing Solar Proximity";
            this.category = "Social Acceptance";
            this.description = "Percentage of survey respondents who reported this distance from existing solar plants as acceptable";
            this.seiaDataUrl = "https://seia.maps.arcgis.com/sharing/rest/content/items/e442f5fc7402493b8a695862b6a2290b/data";
            //declare var Ext: any;
            this.requestError = null;
            this.layerOperating = null;
            this.layerConstruction = null;
            this.layerDevelopment = null;
            this.requestAllMaps = function () {
                // don't send another request until the last one is finished.
                if (_this.scoresWaitingOnRequest) {
                    return;
                }

                _this.scoresWaitingOnRequest = []; // scores can now wait on the request, because the request is being sent.
                var jsonpProtocol = new OpenLayers.Protocol.Script({
                    url: _this.seiaDataUrl,
                    params: {
                        f: 'json'
                    },
                    format: new OpenLayers.Format.JSON(),
                    parseFeatures: function (data) {
                        return null;
                    },
                    callback: function (response) {
                        if (response.success()) {
                            _this.requestError = null;
                            var properties = { opacity: 0.3, visibility: false };
                            _this.layerOperating = new OpenLayers.Layer.Vector("PV/CSP In Operation", properties);
                            _this.layerConstruction = new OpenLayers.Layer.Vector("PV/CSP Under Construction", properties);
                            _this.layerDevelopment = new OpenLayers.Layer.Vector("PV/CSP In Development", properties);

                            _this.layerOperating.styleMap = SolarPlantSocialModule.createDefaultStyle("lightgreen");
                            _this.layerConstruction.styleMap = SolarPlantSocialModule.createDefaultStyle("lightblue");
                            _this.layerDevelopment.styleMap = SolarPlantSocialModule.createDefaultStyle("orange");

                            //new OpenLayers.Format.EsriGeoJSON()
                            //this.format.read(data)
                            var oLayers = response.data['operationalLayers'];
                            for (var i = 0; i < oLayers.length; i++) {
                                var destination = null;
                                if (oLayers[i].title.indexOf("perat") >= 0) {
                                    destination = _this.layerOperating;
                                } else if (oLayers[i].title.indexOf("onstruct") >= 0) {
                                    destination = _this.layerConstruction;
                                } else if (oLayers[i].title.indexOf("evelop") >= 0) {
                                    destination = _this.layerDevelopment;
                                }

                                if (destination) {
                                    var olFeatures = [];
                                    var fLayers = oLayers[i]['featureCollection']['layers'];
                                    for (var j = 0; j < fLayers.length; j++) {
                                        var esriFeatures = fLayers[j]['featureSet']['features'];
                                        for (var k = 0; k < esriFeatures.length; k++) {
                                            var geometry = new OpenLayers.Geometry.Point(esriFeatures[k].geometry.x, esriFeatures[k].geometry.y);
                                            var olFeature = new OpenLayers.Feature.Vector(geometry, esriFeatures[k].attributes);
                                            olFeatures.push(olFeature);
                                        }
                                    }
                                    destination.addFeatures(olFeatures);
                                }
                            }

                            //nearestFeatureCache[score.site.id] = response.features;
                            if (_this.isActive && _this.scoresWaitingOnRequest) {
                                if (_this.layerDevelopment.features.length) {
                                    pvMapper.map.addLayer(_this.layerDevelopment);
                                }
                                if (_this.layerConstruction.features.length) {
                                    pvMapper.map.addLayer(_this.layerConstruction);
                                }
                                if (_this.layerOperating.features.length) {
                                    pvMapper.map.addLayer(_this.layerOperating);
                                }

                                while (_this.scoresWaitingOnRequest.length) {
                                    _this.updateScoreFromLayers(_this.scoresWaitingOnRequest.pop());
                                }
                            }
                            _this.scoresWaitingOnRequest = null; // scores can no longer wait on the request, because the request is finished.
                        } else {
                            if (_this.isActive && _this.scoresWaitingOnRequest) {
                                _this.requestError = response.error;
                                while (_this.scoresWaitingOnRequest.length) {
                                    var score = _this.scoresWaitingOnRequest.pop();
                                    score.popupMessage = "Request error " + _this.requestError.toString();
                                    score.updateValue(Number.NaN);
                                }
                            }
                            _this.scoresWaitingOnRequest = null; // scores can no longer wait on the request, because the request is finished.
                        }
                    }
                });

                var response = jsonpProtocol.read();
            };
            this.addAllMaps = function () {
                if (!_this.layerOperating && !_this.layerConstruction && !_this.layerDevelopment) {
                    _this.requestAllMaps();
                } else {
                    if (_this.layerOperating && _this.layerOperating.features.length) {
                        pvMapper.map.addLayer(_this.layerOperating);
                    }

                    if (_this.layerConstruction && _this.layerConstruction.features.length) {
                        pvMapper.map.addLayer(_this.layerConstruction);
                    }

                    if (_this.layerDevelopment && _this.layerDevelopment.features.length) {
                        pvMapper.map.addLayer(_this.layerDevelopment);
                    }
                }
            };
            this.removeAllMaps = function () {
                if (_this.layerOperating && _this.layerOperating.features.length) {
                    pvMapper.map.removeLayer(_this.layerOperating, false);
                }

                if (_this.layerConstruction && _this.layerConstruction.features.length) {
                    pvMapper.map.removeLayer(_this.layerConstruction, false);
                }

                if (_this.layerDevelopment && _this.layerDevelopment.features.length) {
                    pvMapper.map.removeLayer(_this.layerDevelopment, false);
                }
            };
            this.updateScore = function (score) {
                if (_this.layerOperating && _this.layerOperating.features.length) {
                    // if we have our layer data populated, let's update our score with it.
                    _this.updateScoreFromLayers(score);
                } else if (_this.requestError) {
                    score.popupMessage = "Request error " + _this.requestError.toString();
                    score.updateValue(Number.NaN);
                } else if (_this.scoresWaitingOnRequest.indexOf(score) < 0) {
                    // if we're still waiting on that data, let's enqueue this score to be updated afterward.
                    _this.scoresWaitingOnRequest.push(score);
                }
            };
            this.updateScoreFromLayers = function (score) {
                var maxSearchDistanceInKM = _this.configProperties.maxSearchDistanceInMI * 1.60934;
                var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;

                var searchBounds = new OpenLayers.Bounds(score.site.geometry.bounds.left - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.bottom - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.right + maxSearchDistanceInMeters + 1000, score.site.geometry.bounds.top + maxSearchDistanceInMeters + 1000);

                var closestFeature = null;
                var minDistance = maxSearchDistanceInMeters;

                var searchForClosestFeature = function (features) {
                    for (var i = 0; i < features.length; i++) {
                        // filter out far away geometries quickly using boundary overlap
                        //if (searchBounds.intersects(features[i].bounds))
                        if (searchBounds.contains(features[i].geometry.x, features[i].geometry.y)) {
                            var distance = score.site.geometry.distanceTo(features[i].geometry);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestFeature = features[i];
                            }
                        }
                    }
                };

                searchForClosestFeature(_this.layerOperating.features);
                if (_this.configProperties.usePlantsUnderConstruction) {
                    searchForClosestFeature(_this.layerConstruction.features);
                }
                if (_this.configProperties.usePlantsInDevelopment) {
                    searchForClosestFeature(_this.layerDevelopment.features);
                }

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
                    //if (closestFeature.attributes["Project Name"])
                    //    nearestPlantStr += closestFeature.attributes["Project Name"] + ", ";
                    //if (closestFeature.attributes["Capacity"])
                    //    nearestPlantStr += "a " + closestFeature.attributes["Capacity"] + " MW plant ";
                    //if (closestFeature.attributes["Developer"])
                    //    nearestPlantStr += "by " + closestFeature.attributes["Developer"] + ", ";
                    //else if (closestFeature.attributes.Owner)
                    //    nearestPlantStr += "for " + closestFeature.attributes.Owner + ", ";
                    //nearestPlantStr += minDistanceStr + " mi away.)";
                    //"Developer", "Project Name", "Electricity Purchaser", "Capacity", "Status"
                    var nearestPlantStr = closestFeature.attributes["Project Name"] ? " (The nearest plant, " + closestFeature.attributes["Project Name"] + ", is " + minDistanceStr + " mi away" : " (The nearest plant is " + minDistanceStr + " mi away";

                    score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " + distanceOkStr + " mi or more from an existing solar plant." + nearestPlantStr;

                    score.updateValue(percentOk);
                } else {
                    // no existing solar plants found nearby
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

                    score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " + distanceOkStr + " mi or more from an existing solar plant. (There was no existing solar plant found within the " + _this.configProperties.maxSearchDistanceInMI + " mi search distance.)";

                    score.updateValue(percentOk);
                }
            };

            this.configProperties = {
                maxSearchDistanceInMI: 20,
                usePlantsUnderConstruction: true,
                usePlantsInDevelopment: true
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
                                        maxSearchDistanceInMI: "search distance",
                                        usePlantsUnderConstruction: "use unfinished PV",
                                        usePlantsInDevelopment: "use planned PV"
                                    }
                                });

                                // display a cute little properties window describing our doodle here.
                                //Note: this works only as well as our windowing scheme, which is to say poorly
                                //var propsWindow = Ext.create('MainApp.view.Window', {
                                thisModule.propsWindow = Ext.create('Ext.window.Window', {
                                    title: "Configure Solar Plant Proximity Tool",
                                    closeAction: "hide",
                                    layout: "fit",
                                    items: [
                                        thisModule.propsGrid
                                    ],
                                    listeners: {
                                        beforehide: function () {
                                            // refresh scores as necessary to accomodate this configuraiton change.
                                            thisScoreLine.scores.forEach(function (s) {
                                                s.isValueOld = true;
                                                thisModule.updateScore(s);
                                            });

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

                            thisModule.requestError = null; // forget any errors recorded during prior tool activations.
                            thisModule.addAllMaps();
                        },
                        deactivate: function () {
                            thisModule.scoresWaitingOnRequest = null; // scores can no longer wait on the request, because the tool has been deactivated.
                            thisModule.removeAllMaps();
                        },
                        showConfigWindow: function () {
                            thisModule.propsWindow.show();
                        },
                        id: "SolarPlantSocialTool",
                        title: "Existing Solar Proximity",
                        category: "Social Acceptance",
                        description: "Percentage of survey respondents who reported this distance from existing solar plants as acceptable",
                        longDescription: '<p>This tool calculates the distance from a site to the nearest existing solar plant, and then reports the percentage of survey respondents who said that distance was acceptable.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 441 respondents from six counties in Southern California answered Question 21 which asked "How much buffer distance is acceptable between a large solar facility and an existing large solar facility?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest existing solar installation is identified using map data from SEIA. See their Research & Resources page for more information (www.seia.org/research-resources).</p>',
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
                            if (config && config.maxSearchDistanceInMI >= 0 && (thisModule.configProperties.maxSearchDistanceInMI != config.maxSearchDistanceInMI || thisModule.configProperties.usePlantsInDevelopment != config.usePlantsInDevelopment || thisModule.configProperties.usePlantsUnderConstruction != config.usePlantsUnderConstruction)) {
                                thisModule.configProperties.maxSearchDistanceInMI = config.maxSearchDistanceInMI;
                                thisModule.configProperties.usePlantsInDevelopment = !!config.usePlantsInDevelopment;
                                thisModule.configProperties.usePlantsUnderConstruction = !!config.usePlantsUnderConstruction;

                                if (thisModule.propsGrid)
                                    thisModule.propsGrid.setSource(thisModule.configProperties); // set property grid to match

                                // refresh scores as necessary to accomodate this configuraiton change.
                                var thisScoreLine = this;
                                thisScoreLine.scores.forEach(function (s) {
                                    s.isValueOld = true;
                                    thisModule.updateScore(s);
                                });
                            }
                        },
                        // having any nearby line is much better than having no nearby line, so let's reflect that.
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor", "Percent Favor", "Score", "Preference to the social aceptable in relative distance to existing solar plants.")
                        },
                        weight: 5
                    }]
            });
        }
        SolarPlantSocialModule.createDefaultStyle = function (fillColor) {
            /*
            Capacity: 2
            City/County: "Kona"
            Date Announced: 2008
            Developer: "Sopogy"
            Electricity Purchaser: "HELCO"
            Land Type: "Private"
            LocAccurac: 1
            Online Date: "2009"
            PV/CSP: "CSP"
            Project Name: "Holaniku at Keahole Point"
            State: "HI"
            Status: "Operating"
            Technology: "Other"
            X: -156.055
            Y: 19.7279
            */
            var style = new OpenLayers.Style({
                fontSize: "12px",
                label: "${getLabel}",
                labelOutlineColor: fillColor,
                labelOutlineWidth: 2,
                pointRadius: "${getSize}",
                fillOpacity: 0.25,
                strokeOpacity: 0.875,
                fillColor: fillColor,
                strokeColor: fillColor
            }, {
                context: {
                    getLabel: function (feature) {
                        try  {
                            return feature.attributes["Project Name"] ? feature.attributes["Project Name"] : feature.attributes["Developer"] ? feature.attributes["Developer"] : feature.attributes["Electricity Purchaser"] ? feature.attributes["Electricity Purchaser"] : "";
                        } catch (e) {
                            return "";
                        }
                    },
                    getSize: function (feature) {
                        try  {
                            return 2 + (4 * Math.log(feature.attributes["Capacity"]));
                        } catch (e) {
                            return 10;
                        }
                    }
                }
            });

            var styleMap = new OpenLayers.StyleMap(style);
            return styleMap;
        };
        return SolarPlantSocialModule;
    })(pvMapper.Module);
    INLModules.SolarPlantSocialModule = SolarPlantSocialModule;

    pvMapper.moduleManager.registerModule(new INLModules.SolarPlantSocialModule(), true);
})(INLModules || (INLModules = {}));
//# sourceMappingURL=SolarPlantSocialModule.js.map
