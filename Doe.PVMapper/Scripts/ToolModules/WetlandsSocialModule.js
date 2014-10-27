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
    

    //var surveyResults = [
    //    { mi: 0, percentOk: 4.166666667 },
    //    { mi: 0.003787879, percentOk: 4.375 },
    //    { mi: 0.018939394, percentOk: 5 },
    //    { mi: 0.028409091, percentOk: 5.208333333 },
    //    { mi: 0.037878788, percentOk: 5.416666667 },
    //    { mi: 0.05, percentOk: 5.625 },
    //    { mi: 0.056818182, percentOk: 6.041666667 },
    //    { mi: 0.075757576, percentOk: 6.25 },
    //    { mi: 0.09469697, percentOk: 6.666666667 },
    //    { mi: 0.170454546, percentOk: 6.875 },
    //    { mi: 0.189393939, percentOk: 7.708333333 },
    //    { mi: 0.227272727, percentOk: 7.916666667 },
    //    { mi: 0.25, percentOk: 9.166666667 },
    //    { mi: 0.5, percentOk: 10.83333333 },
    //    { mi: 0.568181818, percentOk: 11.25 },
    //    { mi: 1, percentOk: 22.91666667 },
    //    { mi: 2, percentOk: 31.04166667 },
    //    { mi: 3, percentOk: 36.25 },
    //    { mi: 4, percentOk: 37.70833333 },
    //    { mi: 4.349598346, percentOk: 37.91666667 },
    //    { mi: 5, percentOk: 52.08333333 },
    //    { mi: 6, percentOk: 52.70833333 },
    //    { mi: 7, percentOk: 53.125 },
    //    { mi: 8, percentOk: 55.625 },
    //    { mi: 9.5, percentOk: 55.83333333 },
    //    { mi: 10, percentOk: 68.33333333 },
    //    { mi: 12, percentOk: 68.54166667 },
    //    { mi: 15, percentOk: 71.45833333 },
    //    { mi: 20, percentOk: 77.91666667 },
    //    { mi: 21, percentOk: 78.125 },
    //    { mi: 25, percentOk: 82.08333333 },
    //    { mi: 30, percentOk: 85 },
    //    { mi: 35, percentOk: 85.41666667 },
    //    { mi: 40, percentOk: 86.875 },
    //    { mi: 45, percentOk: 87.29166667 },
    //    { mi: 50, percentOk: 92.5 },
    //    { mi: 60, percentOk: 92.70833333 },
    //    { mi: 70, percentOk: 92.91666667 },
    //    { mi: 75, percentOk: 93.33333333 },
    //    { mi: 90, percentOk: 93.54166667 },
    //    { mi: 100, percentOk: 97.70833333 },
    //    { mi: 120, percentOk: 97.91666667 },
    //    { mi: 150, percentOk: 98.33333333 },
    //    { mi: 200, percentOk: 98.75 },
    //    { mi: 500, percentOk: 99.16666667 },
    //    { mi: 1000, percentOk: 99.79166667 },
    //    { mi: 5000, percentOk: 100 }];
    var surveyResults = [
        { mi: 0.25, low: 8.00, high: 13.70, average: 10.85, plusOrMinus: 2.85 },
        { mi: 0.50, low: 8.80, high: 14.70, average: 11.75, plusOrMinus: 2.95 },
        { mi: 1.00, low: 9.80, high: 15.80, average: 12.80, plusOrMinus: 3.00 },
        { mi: 1.50, low: 18.00, high: 25.60, average: 21.80, plusOrMinus: 3.80 },
        { mi: 2.00, low: 18.10, high: 25.80, average: 21.95, plusOrMinus: 3.85 },
        { mi: 2.50, low: 24.90, high: 33.30, average: 29.10, plusOrMinus: 4.20 },
        { mi: 3.00, low: 25.60, high: 34.10, average: 29.85, plusOrMinus: 4.25 },
        { mi: 3.50, low: 31.80, high: 40.90, average: 36.35, plusOrMinus: 4.55 },
        { mi: 4.00, low: 31.80, high: 40.90, average: 36.35, plusOrMinus: 4.55 },
        { mi: 4.50, low: 33.30, high: 42.50, average: 37.90, plusOrMinus: 4.60 },
        { mi: 5.00, low: 33.30, high: 42.50, average: 37.90, plusOrMinus: 4.60 }
    ];

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
            this.description = "Percentage of people who would report this distance from wetlands as acceptable, according to our survey";
            // cache for the last distance found to a wetland, used so that our search isn't criminally inefficient
            this.lastDistanceCache = {};
            this.wmsServerUrl = "http://107.20.228.18/ArcGIS/services/Wetlands/mapserver/wmsserver?";
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
                        layers: "1",
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

                            var responseObj = OpenLayers.Format.JSON.prototype.read(response.responseText);
                            if (!responseObj.error) {
                                var features = OpenLayers.Format.EsriGeoJSON.prototype.read(responseObj);

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

                                    var previousDistance = surveyResults[surveyResults.length - 2].mi;
                                    var surveyResult = surveyResults[surveyResults.length - 1];
                                    for (var i = 0; i < surveyResults.length - 1; i++) {
                                        if (minDistanceInMi < surveyResults[i].mi) {
                                            surveyResult = surveyResults[i];
                                            previousDistance = i <= 0 ? 0 : surveyResults[i - 1].mi;
                                            break;
                                        }
                                    }

                                    score.popupMessage = surveyResult.average + "% &plusmn; " + surveyResult.plusOrMinus + "% of people would accept a site built " + previousDistance + " mi - " + surveyResult.mi + " mi away from wetlands (95% confidence interval). The nearest wetland is a " + parseFloat(closestFeature.attributes['ACRES']).toFixed(1) + " acre " + closestFeature.attributes['WETLAND_TYPE'] + " " + minDistanceInMi.toFixed(2) + " mi away.";

                                    score.updateValue(surveyResult.average);
                                } else {
                                    score.popupMessage = "There was no wetland found within 5 mi of this site.";
                                    score.updateValue(100); //surveyResults[surveyResults.length - 1].average); //TODO: what is the appropriate value to use here? 100%? the largest % we have in the table? Number.NaN ?!?
                                }
                            } else {
                                score.popupMessage = responseObj.error.message + " (" + responseObj.error.code + ")";
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
                                    customRenderers: {
                                        mininumAcres: function (v) {
                                            return v + " acres";
                                        }
                                    },
                                    propertyNames: {
                                        mininumAcres: "Wetlands at least"
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
                                                thisModule.updateScore(s, 5);
                                            }); // 5 mi search distance

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
                        id: "WetlandsSocialTool",
                        title: "Wetland Proximity",
                        category: "Social Acceptance",
                        description: "Percentage of people who would report this distance from wetlands as acceptable, according to our survey",
                        longDescription: '<p>This tool calculates the distance from a site to the nearest wetland, and then reports the estimated percentage of residents who would say that distance was acceptable, with a 95% confidence interval.</p><p>The survey used in this tool was administered by the PVMapper project in 2013 and 2014. From the 2013 survey, 479 respondents from six counties in Southern California answered Question 20 which asked "How much buffer distance is acceptable between a large solar facility and a wetland?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest wetland is identified using the National Wetlands Inventory by the US Fish and Wildlife Service. Note that this dataset includes wetlands which may have no conservation value, such as irrigation canals and small drainage basins. See the FWS website for more information (www.fws.gov/wetlands).</p>',
                        onSiteChange: function (e, score) {
                            thisModule.updateScore(score, 5); // 5 mi search distance
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
                                    thisModule.updateScore(s, 5);
                                }); // 5 mi search distance
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
