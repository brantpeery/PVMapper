/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />


module INLModules {
    declare var selfUrl: string; // this should be included dynamically in ModuleManager when it loads this file.
    //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

    //var surveyResults = [
    //    { mi: 0, percentOk: 11.51385928 },
    //    { mi: 0.000189394, percentOk: 11.72707889 },
    //    { mi: 0.000378788, percentOk: 11.94029851 },
    //    { mi: 0.001136364, percentOk: 12.15351812 },
    //    { mi: 0.001893939, percentOk: 12.57995736 },
    //    { mi: 0.003787879, percentOk: 12.79317697 },
    //    { mi: 0.005681818, percentOk: 13.43283582 },
    //    { mi: 0.009469697, percentOk: 13.85927505 },
    //    { mi: 0.018939394, percentOk: 15.99147122 },
    //    { mi: 0.028409091, percentOk: 16.20469083 },
    //    { mi: 0.037878788, percentOk: 16.63113006 },
    //    { mi: 0.056818182, percentOk: 17.27078891 },
    //    { mi: 0.09469697, percentOk: 18.12366738 },
    //    { mi: 0.142045455, percentOk: 18.33688699 },
    //    { mi: 0.170454546, percentOk: 18.55010661 },
    //    { mi: 0.189393939, percentOk: 19.18976546 },
    //    { mi: 0.227272727, percentOk: 19.61620469 },
    //    { mi: 0.25, percentOk: 21.53518124 },
    //    { mi: 0.284090909, percentOk: 21.74840085 },
    //    { mi: 0.5, percentOk: 25.58635394 },
    //    { mi: 0.568181818, percentOk: 25.79957356 },
    //    { mi: 1, percentOk: 42.85714286 },
    //    { mi: 2, percentOk: 47.76119403 },
    //    { mi: 3, percentOk: 50.74626866 },
    //    { mi: 4, percentOk: 50.95948827 },
    //    { mi: 5, percentOk: 66.73773987 },
    //    { mi: 6, percentOk: 67.1641791 },
    //    { mi: 7, percentOk: 67.59061834 },
    //    { mi: 8, percentOk: 70.14925373 },
    //    { mi: 10, percentOk: 78.03837953 },
    //    { mi: 12, percentOk: 78.25159915 },
    //    { mi: 14, percentOk: 78.46481876 },
    //    { mi: 14.2, percentOk: 78.67803838 },
    //    { mi: 15, percentOk: 81.23667377 },
    //    { mi: 20, percentOk: 86.35394456 },
    //    { mi: 25, percentOk: 88.91257996 },
    //    { mi: 30, percentOk: 92.53731343 },
    //    { mi: 35, percentOk: 92.75053305 },
    //    { mi: 40, percentOk: 93.81663113 },
    //    { mi: 50, percentOk: 97.01492537 },
    //    { mi: 100, percentOk: 99.14712154 },
    //    { mi: 129, percentOk: 99.36034115 },
    //    { mi: 200, percentOk: 99.78678038 },
    //    { mi: 5000, percentOk: 100 },
    //];

    var surveyResults = [
        { mi: 0.25, low: 16.20, high: 24.00, average: 20.10, plusOrMinus: 3.90 },
        { mi: 0.50, low: 17.20, high: 25.20, average: 21.20, plusOrMinus: 4.00 },
        { mi: 1.00, low: 20.20, high: 28.60, average: 24.40, plusOrMinus: 4.20 },
        { mi: 1.50, low: 35.50, high: 44.90, average: 40.20, plusOrMinus: 4.70 },
        { mi: 2.00, low: 35.60, high: 45.00, average: 40.30, plusOrMinus: 4.70 },
        { mi: 2.50, low: 40.10, high: 49.70, average: 44.90, plusOrMinus: 4.80 },
        { mi: 3.00, low: 41.00, high: 50.70, average: 45.85, plusOrMinus: 4.85 },
        { mi: 3.50, low: 44.80, high: 54.60, average: 49.70, plusOrMinus: 4.90 },
        { mi: 4.00, low: 44.80, high: 54.60, average: 49.70, plusOrMinus: 4.90 },
        { mi: 4.50, low: 45.70, high: 55.50, average: 50.60, plusOrMinus: 4.90 },
        { mi: 5.00, low: 45.70, high: 55.50, average: 50.60, plusOrMinus: 4.90 }
    ];


    export class AgricultureSocialModule extends pvMapper.Module {
        constructor() {
            super();
            this.init(<pvMapper.IModuleOptions>{
                activate: null,
                deactivate: null,

                scoringTools: [<pvMapper.IScoreToolOptions>{
                    activate: () => {
                        // the source map looks terrible, so we won't bother adding it to the layer list
                    },
                    deactivate: () => {
                        // nothing to remove.
                    },

                    id: "AgricultureSocialTool",
                    title: "Agriculture Proximity",
                    category: "Social Acceptance",
                    description: "Percentage of people who would report this distance from agriculture as acceptable, according to our survey",
                    longDescription: '<p>This tool calculates the distance from a site to the nearest agriculture area, and then reports the estimated percentage of residents who would say that distance was acceptable, with a 95% confidence interval.</p><p>The survey used in this tool was administered by the PVMapper project in 2013 and 2014. From the 2013 survey, 468 respondents from six counties in Southern California answered Question 15, which asked "How much buffer distance is acceptable between a large solar facility and existing agricultural land?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest agricultural area is identified from a map of agriculture polygons derived from original land classification by USDA\'s CropScape dataset (nassgeodata.gmu.edu). These raster data were generalized and then digitized into a vector format, which was then simplified using geoprocessing tools in ArcGIS Desktop. The resulting geometries are gross approximations useful only for coarse distance estimates.</p>',
                    //onScoreAdded: function (e, score: pvMapper.Score) {
                    //    scores.push(score);
                    //},
                    onSiteChange: function (e, score: pvMapper.Score) {
                        updateScore(score, 5); // 5 mi search distance
                    },

                    // having any nearby line is much better than having no nearby line, so let's reflect that.
                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor", "% of respondants in favor", 
                            "Prefer sites with greater social acceptance of agriculture proximity. Expect diminishing returns from increasing acceptance. The minimum possible score is 40, reflecting an assumption that low social acceptance may not be prohibitive.")
                    },
                    weight: 5,
                }],

                infoTools: null
            });
        }

        public id = "AgricultureSocialModule";
        public author = "Scott Brown, INL";
        public version = "0.1.ts";
        public url = selfUrl; //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

        // add these to make it easier for the ModuleManager stuff.
        public title: string = "Agriculture Proximity";
        public category: string = "Social Acceptance";
        public description: string = "Percentage of people who would report this distance from agriculture as acceptable, according to our survey";

    }

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    var wmsServerUrl = "http://129.174.131.7/cgi/wms_cdlall.cgi?"; // SERVICE=WMS&
    var esriExportUrl = "https://gis.inl.gov/arcgis/rest/services/Ag_Lands/MapServer/export"; // "https://gis-ext.inl.gov/arcgis/rest/services/Ag_Lands/MapServer/export"; 
    var esriQueryUrl = "https://gis.inl.gov/arcgis/rest/services/Ag_Lands/MapServer/0/query"; // "https://gis-ext.inl.gov/arcgis/rest/services/Ag_Lands/MapServer/0/query"; 

    var mapLayer: OpenLayers.Layer;

    function updateScore(score: pvMapper.ISiteScore, searchDistanceInMi) {
        var searchDistanceInMeters = searchDistanceInMi * 1609.34;
        //NOTE: can't use JSONP from an HTTP server when we are running HTTPS, so rely on a good old Proxy GET
        var request = OpenLayers.Request.GET({
            url: esriQueryUrl,
            params: {
                f: "json",
                outFields: "",
                geometryType: "esriGeometryEnvelope",
                geometry: new OpenLayers.Bounds(
                    score.site.geometry.bounds.left - searchDistanceInMeters - 1000,
                    score.site.geometry.bounds.bottom - searchDistanceInMeters - 1000,
                    score.site.geometry.bounds.right + searchDistanceInMeters + 1000,
                    score.site.geometry.bounds.top + searchDistanceInMeters + 1000)
                    .toBBOX(0, false),
            },
            proxy: "/Proxy/proxy.ashx?",
            //format: new OpenLayers.Format.EsriGeoJSON(),
            //parseFeatures: function (data) {
            //    return this.format.read(data);
            //},
            callback: (response: OpenLayers.Response) => {
                if (response.status === 200) {
                    var closestFeature = null;
                    var minDistance: number = searchDistanceInMeters;

                    try {
                        var responseObj = OpenLayers.Format.JSON.prototype.read(response.responseText);
                    } catch (ex) {
                        score.popupMessage = "Error parsing data: " + ex.message;
                        score.updateValue(Number.NaN);
                        return;
                    }

                    if (!responseObj.error) {

                        var features = OpenLayers.Format.EsriGeoJSON.prototype.read(responseObj);

                        if (features) {
                            for (var i = 0; i < features.length; i++) {
                                var distance: number = score.site.geometry.distanceTo(features[i].geometry, { edge: false });
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
                                    previousDistance = i <= 0 ? 0 : surveyResults[i-1].mi;
                                    break;
                                }
                            }

                            score.popupMessage = surveyResult.average + "% &plusmn; " + surveyResult.plusOrMinus + "% of people would accept a site built " +
                                previousDistance + " mi - " + surveyResult.mi + " mi away from agriculture (95% confidence interval). The nearest agirculture is " +
                                minDistanceInMi.toFixed(2) + " mi away.";

                            score.updateValue(surveyResult.average);
                        } else {
                            score.popupMessage = "There was no agriculture found within 5 mi of this site.";
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
            },
        });
    }

    pvMapper.moduleManager.registerModule(new INLModules.AgricultureSocialModule(), true);
}
