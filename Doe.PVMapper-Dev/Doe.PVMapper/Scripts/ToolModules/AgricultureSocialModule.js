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
    var surveyResults = [
        { mi: 0, percentOk: 11.51385928 },
        { mi: 0.000189394, percentOk: 11.72707889 },
        { mi: 0.000378788, percentOk: 11.94029851 },
        { mi: 0.001136364, percentOk: 12.15351812 },
        { mi: 0.001893939, percentOk: 12.57995736 },
        { mi: 0.003787879, percentOk: 12.79317697 },
        { mi: 0.005681818, percentOk: 13.43283582 },
        { mi: 0.009469697, percentOk: 13.85927505 },
        { mi: 0.018939394, percentOk: 15.99147122 },
        { mi: 0.028409091, percentOk: 16.20469083 },
        { mi: 0.037878788, percentOk: 16.63113006 },
        { mi: 0.056818182, percentOk: 17.27078891 },
        { mi: 0.09469697, percentOk: 18.12366738 },
        { mi: 0.142045455, percentOk: 18.33688699 },
        { mi: 0.170454546, percentOk: 18.55010661 },
        { mi: 0.189393939, percentOk: 19.18976546 },
        { mi: 0.227272727, percentOk: 19.61620469 },
        { mi: 0.25, percentOk: 21.53518124 },
        { mi: 0.284090909, percentOk: 21.74840085 },
        { mi: 0.5, percentOk: 25.58635394 },
        { mi: 0.568181818, percentOk: 25.79957356 },
        { mi: 1, percentOk: 42.85714286 },
        { mi: 2, percentOk: 47.76119403 },
        { mi: 3, percentOk: 50.74626866 },
        { mi: 4, percentOk: 50.95948827 },
        { mi: 5, percentOk: 66.73773987 },
        { mi: 6, percentOk: 67.1641791 },
        { mi: 7, percentOk: 67.59061834 },
        { mi: 8, percentOk: 70.14925373 },
        { mi: 10, percentOk: 78.03837953 },
        { mi: 12, percentOk: 78.25159915 },
        { mi: 14, percentOk: 78.46481876 },
        { mi: 14.2, percentOk: 78.67803838 },
        { mi: 15, percentOk: 81.23667377 },
        { mi: 20, percentOk: 86.35394456 },
        { mi: 25, percentOk: 88.91257996 },
        { mi: 30, percentOk: 92.53731343 },
        { mi: 35, percentOk: 92.75053305 },
        { mi: 40, percentOk: 93.81663113 },
        { mi: 50, percentOk: 97.01492537 },
        { mi: 100, percentOk: 99.14712154 },
        { mi: 129, percentOk: 99.36034115 },
        { mi: 200, percentOk: 99.78678038 },
        { mi: 5000, percentOk: 100 }
    ];

    //var initialSearchDistanceInMi = 5;
    //var maxSearchDistanceInMi = 5000;
    // cache for the last distance found to a agriculture, used so that our search isn't criminally inefficient
    var lastDistanceCache = {};

    var AgricultureSocialModule = (function () {
        function AgricultureSocialModule() {
            var myModule = new pvMapper.Module({
                id: "AgricultureSocialModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",
                activate: function () {
                    addAllMaps();
                },
                deactivate: function () {
                    removeAllMaps();
                },
                destroy: null,
                init: null,
                scoringTools: [{
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        //Note: removed prior to demo on request - mentioning acres confuses the point - they had nothing to do with
                        //      the survey, and have nothing to do with the score.
                        //showConfigWindow: function () {
                        //    myToolLine = this; // fetch tool line, which was passed as 'this' parameter
                        //    propsWindow.show();
                        //},
                        title: AgricultureSocialModule.title,
                        category: AgricultureSocialModule.category,
                        description: AgricultureSocialModule.description,
                        longDescription: AgricultureSocialModule.longDescription,
                        //onScoreAdded: function (e, score: pvMapper.Score) {
                        //    scores.push(score);
                        //},
                        onSiteChange: function (e, score) {
                            if (lastDistanceCache[score.site.id] > 500) {
                                updateScore(score, 5000);
                            } else if (lastDistanceCache[score.site.id] > 50) {
                                updateScore(score, 500);
                            } else if (lastDistanceCache[score.site.id] > 5) {
                                updateScore(score, 50);
                            } else if (lastDistanceCache[score.site.id] > 0.5) {
                                updateScore(score, 5);
                            } else {
                                updateScore(score, 0.5);
                            }
                        },
                        // having any nearby line is much better than having no nearby line, so let's reflect that.
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor", "Proximity Favor", "Score", "Preference of agriculture development near by.")
                        },
                        weight: 10
                    }],
                infoTools: null
            });
            this.getModuleObj = function () {
                return myModule;
            };
        }
        AgricultureSocialModule.title = "Agriculture Proximity";
        AgricultureSocialModule.category = "Social Acceptance";
        AgricultureSocialModule.description = "Percentage of survey respondents who reported this distance from agriculture as acceptable";
        AgricultureSocialModule.longDescription = '<p>This tool calculates the distance from a site to the nearest agriculture area, and then reports the percentage of survey respondents who said that distance was acceptable.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 468 respondents from six counties in Southern California answered Question 15, which asked "How much buffer distance is acceptable between a large solar facility and existing agricultural land?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest agricultural area is identified from a map of agriculture polygons derived from original land classification by USDA\'s CropScape dataset (nassgeodata.gmu.edu). These raster data were generalized and then digitized into a vector format, which was then simplified using geoprocessing tools in ArcGIS Desktop. The resulting geometries are gross approximations useful only for coarse distance estimates.</p>';
        return AgricultureSocialModule;
    })();
    INLModules.AgricultureSocialModule = AgricultureSocialModule;

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var wmsServerUrl = "http://129.174.131.7/cgi/wms_cdlall.cgi?";
    var esriExportUrl = "http://gis-ext.inl.gov/ArcGIS/rest/services/Ag_Lands/MapServer/export";
    var esriQueryUrl = "http://gis-ext.inl.gov/ArcGIS/rest/services/Ag_Lands/MapServer/0/query";

    var mapLayer;

    function addAllMaps() {
        // add as ESRI REST layer
        ////TODO: test map - hide this
        //mapLayer = new OpenLayers.Layer.ArcGIS93Rest(
        //    "Agriculture TEST",
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
        //pvMapper.map.addLayer(mapLayer);
        // add as WMS layer
        ////TODO: this server doesn't offer EPSG:3857. Should find a different server?
        //mapLayer = new OpenLayers.Layer.WMS(
        //    "Agriculture",
        //    wmsServerUrl,
        //    {
        //        layers: "cdl_2012",
        //        transparent: "true",
        //        format: "image/png",
        //        exceptions: "application/vnd.ogc.se_inimage", //TODO: DEBUG = remove before deploy...
        //        //maxResolution: 156543.0339,
        //        //srs: "EPSG:3857",
        //        srs: "EPSG:4326",
        //    },
        //    { isBaseLayer: false }
        //    );
        //mapLayer.setOpacity(0.3);
        //mapLayer.setVisibility(false);
        //mapLayer.epsgOverride = "EPSG:4326"; //"EPSG:3857";
        //pvMapper.map.addLayer(mapLayer);
    }

    function removeAllMaps() {
        if (mapLayer !== null) {
            pvMapper.map.removeLayer(mapLayer, false);
            mapLayer = null;
        }
    }

    function updateScore(score, searchDistanceInMi) {
        var searchDistanceInMeters = searchDistanceInMi * 1609.34;

        //NOTE: can't use JSONP from an HTTP server when we are running HTTPS, so rely on a good old Proxy GET
        //var jsonpProtocol = new OpenLayers.Protocol.Script(<any>{
        var request = OpenLayers.Request.GET({
            url: esriQueryUrl,
            params: {
                f: "json",
                //where: "ACRES >= " + configProperties.mininumAcres,
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
                        lastDistanceCache[score.site.id] = minDistanceInMi;

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
                        //    closestFeature.attributes['WETLAND_TYPE'] + "agriculture";
                        //score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept this proximity. (site " +
                        //    score.site.name + " is " + minDistanceStr + " mi from a " +
                        //    closestFeature.attributes['WETLAND_TYPE'] + ")";
                        score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " + distanceOkStr + " mi or more from agriculture. (The nearest agriculture is " + minDistanceStr + " mi away.)";

                        score.updateValue(percentOk);
                    } else if (searchDistanceInMi < 5000) {
                        // call recursively to find the nearest agriculture...
                        updateScore(score, searchDistanceInMi * 10);
                    } else {
                        // no agriculture found in max search distance, so 100% of respondants are Ok with this.
                        //score.popupMessage = "over 5000 mi to any agriculture; 100% of respondents reported they would accept this distance.";
                        //score.popupMessage = "100% of respondents reported they would accept this proximity. (site " +
                        //    score.site.name + " is over 5000 mi from any agriculture)";
                        score.popupMessage = "100% of respondents reported they would accept a site built over 5000 mi from agriculture." + " (There was no agriculture found within 5000 mi.)";
                        score.updateValue(100);
                    }
                } else {
                    score.popupMessage = "Error " + response.status + " " + response.statusText;
                    score.updateValue(Number.NaN);
                }
            }
        });
        //var response: OpenLayers.Response = jsonpProtocol.read();
    }
})(INLModules || (INLModules = {}));
if (console && console.assert)
    console.assert(typeof (selfUrl) === 'string', "Warning: selfUrl wasn't set!");
var selfUrl = selfUrl || $('script[src$="AgricultureSocialModule.js"]').attr('src');

pvMapper.moduleManager.registerModule(INLModules.AgricultureSocialModule.category, INLModules.AgricultureSocialModule.title, INLModules.AgricultureSocialModule, true, selfUrl);
//# sourceMappingURL=AgricultureSocialModule.js.map
