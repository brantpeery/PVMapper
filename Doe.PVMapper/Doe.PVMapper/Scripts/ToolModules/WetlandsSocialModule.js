/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />
var INLModules;
(function (INLModules) {
    

    var surveyResults = [
        { mi: 0, percentOk: 4.166666667 },
        { mi: 0.003787879, percentOk: 4.375 },
        { mi: 0.018939394, percentOk: 5 },
        { mi: 0.028409091, percentOk: 5.208333333 },
        { mi: 0.037878788, percentOk: 5.416666667 },
        { mi: 0.05, percentOk: 5.625 },
        { mi: 0.056818182, percentOk: 6.041666667 },
        { mi: 0.075757576, percentOk: 6.25 },
        { mi: 0.09469697, percentOk: 6.666666667 },
        { mi: 0.170454546, percentOk: 6.875 },
        { mi: 0.189393939, percentOk: 7.708333333 },
        { mi: 0.227272727, percentOk: 7.916666667 },
        { mi: 0.25, percentOk: 9.166666667 },
        { mi: 0.5, percentOk: 10.83333333 },
        { mi: 0.568181818, percentOk: 11.25 },
        { mi: 1, percentOk: 22.91666667 },
        { mi: 2, percentOk: 31.04166667 },
        { mi: 3, percentOk: 36.25 },
        { mi: 4, percentOk: 37.70833333 },
        { mi: 4.349598346, percentOk: 37.91666667 },
        { mi: 5, percentOk: 52.08333333 },
        { mi: 6, percentOk: 52.70833333 },
        { mi: 7, percentOk: 53.125 },
        { mi: 8, percentOk: 55.625 },
        { mi: 9.5, percentOk: 55.83333333 },
        { mi: 10, percentOk: 68.33333333 },
        { mi: 12, percentOk: 68.54166667 },
        { mi: 15, percentOk: 71.45833333 },
        { mi: 20, percentOk: 77.91666667 },
        { mi: 21, percentOk: 78.125 },
        { mi: 25, percentOk: 82.08333333 },
        { mi: 30, percentOk: 85 },
        { mi: 35, percentOk: 85.41666667 },
        { mi: 40, percentOk: 86.875 },
        { mi: 45, percentOk: 87.29166667 },
        { mi: 50, percentOk: 92.5 },
        { mi: 60, percentOk: 92.70833333 },
        { mi: 70, percentOk: 92.91666667 },
        { mi: 75, percentOk: 93.33333333 },
        { mi: 90, percentOk: 93.54166667 },
        { mi: 100, percentOk: 97.70833333 },
        { mi: 120, percentOk: 97.91666667 },
        { mi: 150, percentOk: 98.33333333 },
        { mi: 200, percentOk: 98.75 },
        { mi: 500, percentOk: 99.16666667 },
        { mi: 1000, percentOk: 99.79166667 },
        { mi: 5000, percentOk: 100 }];

    //var initialSearchDistanceInMi = 5;
    //var maxSearchDistanceInMi = 5000;
    var WetlandsSocialModule = (function (_super) {
        __extends(WetlandsSocialModule, _super);
        function WetlandsSocialModule() {
            var _this = this;
            _super.call(this);
            this.id = "WetlandsSocialModule";
            this.author = "Scott Brown, INL";
            this.version = "0.1.ts";
            this.url = selfUrl;
            this.title = "Wetland Proximity";
            this.category = "Social Acceptance";
            this.description = "Percentage of survey respondents who reported this distance from wetlands as acceptable";
            // cache for the last distance found to a wetland, used so that our search isn't criminally inefficient
            this.lastDistanceCache = {};
            this.wmsServerUrl = "http://107.20.228.18/ArcGIS/services/FWS_Wetlands_WMS/mapserver/wmsserver?";
            this.esriExportUrl = "http://107.20.228.18/ArcGIS/rest/services/Wetlands/MapServer/export";
            this.esriQueryUrl = "http://107.20.228.18/ArcGIS/rest/services/Wetlands/MapServer/0/query";
            this.addAllMaps = function () {
                // add as ESRI REST layer
                //mapLayer = new OpenLayers.Layer.ArcGIS93Rest(
                //    "Wetlands",
                //    esriExportUrl,
                //    {
                //        layers: "show:0", //"show:2",
                //        format: "gif",
                //        srs: "3857", //"102100",
                //        transparent: "true",
                //    }//,{ isBaseLayer: false }
                //    );
                //mapLayer.setOpacity(0.3);
                //mapLayer.epsgOverride = "3857"; //"EPSG:102100";
                //mapLayer.setVisibility(false);
                //
                //pvMapper.map.addLayer(mapLayer);
                // add as WMS layer
                if (!_this.mapLayer) {
                    _this.mapLayer = new OpenLayers.Layer.WMS("Wetlands", _this.wmsServerUrl, {
                        layers: "17",
                        transparent: "true",
                        format: "image/png",
                        exceptions: "application/vnd.ogc.se_inimage",
                        //maxResolution: 156543.0339,
                        srs: "EPSG:3857"
                    }, { isBaseLayer: false });

                    _this.mapLayer.setOpacity(0.3);
                    _this.mapLayer.setVisibility(false);
                    _this.mapLayer.epsgOverride = "EPSG:3857";
                }

                pvMapper.map.addLayer(_this.mapLayer);
            };
            this.removeAllMaps = function () {
                if (_this.mapLayer)
                    pvMapper.map.removeLayer(_this.mapLayer, false);
            };
            this.updateScore = function (score, searchDistanceInMi) {
                var searchDistanceInMeters = searchDistanceInMi * 1609.34;

                //NOTE: can't use JSONP from an HTTP server when we are running HTTPS, so rely on a good old Proxy GET
                //var jsonpProtocol = new OpenLayers.Protocol.Script(<any>{
                var request = OpenLayers.Request.GET({
                    url: _this.esriQueryUrl,
                    params: {
                        f: "json",
                        where: "ACRES >= " + _this.configProperties.mininumAcres,
                        //TODO: should request specific out fields, instead of '*' here.
                        outFields: "*",
                        geometryType: "esriGeometryEnvelope",
                        //TODO: scaling is problematic - should use a constant-size search window
                        geometry: new OpenLayers.Bounds(score.site.geometry.bounds.left - searchDistanceInMeters - 1000, score.site.geometry.bounds.bottom - searchDistanceInMeters - 1000, score.site.geometry.bounds.right + searchDistanceInMeters + 1000, score.site.geometry.bounds.top + searchDistanceInMeters + 1000).toBBOX(0, false)
                    },
                    proxy: "/Proxy/proxy.ashx?",
                    //format: new OpenLayers.Format.EsriGeoJSON(),
                    //parseFeatures: function (data) {
                    //    return this.format.read(data);
                    //},
                    callback: function (response) {
                        //alert("Nearby features: " + response.features.length);
                        if (response.status === 200) {
                            var closestFeature = null;
                            var minDistance = searchDistanceInMeters;

                            var features = OpenLayers.Format.EsriGeoJSON.prototype.read(response.responseText);

                            //console.log("Near-ish features: " + (features ? features.length : 0));
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
                                _this.lastDistanceCache[score.site.id] = minDistanceInMi;

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

                                //score.popupMessage = minDistanceStr + " mi to " +
                                //    parseFloat(closestFeature.attributes['ACRES']).toFixed(1) + " acres of " +
                                //    closestFeature.attributes['WETLAND_TYPE'] + "; " +
                                //    percentOk.toFixed(1) + "% of respondents reported they would accept " +
                                //    distanceOkStr + " mi or more.";
                                //score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept " +
                                //    distanceOkStr + " mi or more; " + score.site.name + " is " +
                                //    minDistanceStr + " mi from " +
                                //    parseFloat(closestFeature.attributes['ACRES']).toFixed(1) + " acres of " +
                                //    closestFeature.attributes['WETLAND_TYPE'];
                                //score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site " +
                                //    minDistanceStr + " mi from a " +
                                //    closestFeature.attributes['WETLAND_TYPE'] + "wetland";
                                //score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept this proximity. (site " +
                                //    score.site.name + " is " + minDistanceStr + " mi from a " +
                                //    closestFeature.attributes['WETLAND_TYPE'] + ")";
                                score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " + distanceOkStr + " mi or more from a wetland. (The nearest wetland is a " + closestFeature.attributes['WETLAND_TYPE'] + " " + minDistanceStr + " mi away.)";

                                score.updateValue(percentOk);
                            } else if (searchDistanceInMi <= 5) {
                                // call recursively to find the nearest wetland...
                                _this.updateScore(score, searchDistanceInMi * 10);
                            } else {
                                // no wetland found in max search distance, so 100% of respondants are Ok with this.
                                //score.popupMessage = "over 5000 mi to any wetland; 100% of respondents reported they would accept this distance.";
                                //score.popupMessage = "100% of respondents reported they would accept this proximity. (site " +
                                //    score.site.name + " is over 5000 mi from any wetland)";
                                //score.popupMessage = "100% of respondents reported they would accept a site built over 5000 mi from a wetland." +
                                //    " (There was no wetland found within 5000 mi.)";
                                //score.updateValue(100);
                                score.popupMessage = "There was no wetland found within 50 mi.";
                                score.updateValue(Number.NaN);
                            }
                        } else {
                            score.popupMessage = "Error " + response.status + " " + response.statusText;
                            score.updateValue(Number.NaN);
                        }
                    }
                });
                //var response: OpenLayers.Response = jsonpProtocol.read();
            };

            this.configProperties = {
                mininumAcres: 10
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
                                    minWidth: 300,
                                    source: thisModule.configProperties,
                                    propertyNames: {
                                        mininumAcres: "minimum acres"
                                    }
                                });

                                // display a cute little properties window describing our doodle here.
                                //Note: this works only as well as our windowing scheme, which is to say poorly
                                thisModule.propsWindow = Ext.create('Ext.window.Window', {
                                    title: "Configure Wetland Proximity Tool",
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
                                                thisModule.updateScore(s, 0.5);
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

                            thisModule.addAllMaps();
                        },
                        deactivate: function () {
                            thisModule.removeAllMaps();
                        },
                        //Note: removed prior to demo on request - mentioning acres confuses the point - they had nothing to do with
                        //      the survey, and have nothing to do with the score.
                        //showConfigWindow: function () {
                        //    myToolLine = this; // fetch tool line, which was passed as 'this' parameter
                        //    propsWindow.show();
                        //},
                        id: "WetlandsSocialTool",
                        title: "Wetland Proximity",
                        category: "Social Acceptance",
                        description: "Percentage of survey respondents who reported this distance from wetlands as acceptable",
                        longDescription: '<p>This tool calculates the distance from a site to the nearest wetland, and then reports the percentage of survey respondents who said that distance was acceptable.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 479 respondents from six counties in Southern California answered Question 20 which asked "How much buffer distance is acceptable between a large solar facility and a wetland?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest wetland is identified using the National Wetlands Inventory by the US Fish and Wildlife Service. Note that this dataset includes wetlands which may have no conservation value, such as irrigation canals and small drainage basins. See the FWS website for more information (www.fws.gov/wetlands).</p>',
                        //onScoreAdded: function (e, score: pvMapper.Score) {
                        //    scores.push(score);
                        //},
                        onSiteChange: function (e, score) {
                            //if (lastDistanceCache[score.site.id] > 500) {
                            //    updateScore(score, 5000);
                            //} else if (lastDistanceCache[score.site.id] > 50) {
                            //    updateScore(score, 500);
                            //} else
                            if (thisModule.lastDistanceCache[score.site.id] > 5) {
                                thisModule.updateScore(score, 50);
                            } else if (thisModule.lastDistanceCache[score.site.id] > 0.5) {
                                thisModule.updateScore(score, 5);
                            } else {
                                thisModule.updateScore(score, 0.5);
                            }
                        },
                        getConfig: function () {
                            return thisModule.configProperties;
                        },
                        setConfig: function (config) {
                            if (config && config.mininumAcres >= 0 && thisModule.configProperties.mininumAcres != config.mininumAcres) {
                                thisModule.configProperties.mininumAcres = config.mininumAcres;

                                if (thisModule.propsGrid)
                                    thisModule.propsGrid.setSource(thisModule.configProperties); // set property grid to match

                                // refresh scores as necessary to accomodate this configuraiton change.
                                var thisScoreLine = this;
                                thisScoreLine.scores.forEach(function (s) {
                                    s.isValueOld = true;
                                    thisModule.updateScore(s, 0.5);
                                });
                            }
                        },
                        // having any nearby line is much better than having no nearby line, so let's reflect that.
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor", "% of respondants in favor", "Prefer sites with greater social acceptance of wetland proximity. Expect diminishing returns from increasing acceptance. The minimum possible score is 40, reflecting an assumption that low social acceptance may not be prohibitive.")
                        },
                        weight: 5
                    }]
            });
        }
        return WetlandsSocialModule;
    })(pvMapper.Module);
    INLModules.WetlandsSocialModule = WetlandsSocialModule;

    //var modinstance = new INLModules.WetlandsSocialModule();
    pvMapper.moduleManager.registerModule(new INLModules.WetlandsSocialModule(), true);
})(INLModules || (INLModules = {}));
//# sourceMappingURL=WetlandsSocialModule.js.map
