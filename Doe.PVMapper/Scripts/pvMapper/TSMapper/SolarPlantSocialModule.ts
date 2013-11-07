/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />


module INLModules {

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


    var configProperties = {
        //maxSearchDistanceInKM: 30,
        maxSearchDistanceInMI: 20,
    };

    var myToolLine: pvMapper.IToolLine;

    var propsWindow;

    Ext.onReady(function () {
        var propsGrid: Ext.grid.property.IGrid = Ext.create('Ext.grid.property.Grid', {
            nameText: 'Properties Grid',
            minWidth: 300,
            //autoHeight: true,
            source: configProperties,
            customRenderers: {
                maxSearchDistanceInMI: function (v) { return v + " mi"; },
            },
            propertyNames: {
                maxSearchDistanceInMI: "search distance",
            },
        });

        // display a cute little properties window describing our doodle here.
        //Note: this works only as well as our windowing scheme, which is to say poorly

        //var propsWindow = Ext.create('MainApp.view.Window', {
        propsWindow = Ext.create('Ext.window.Window', {
            title: "Configure Solar Plant Proximity Tool",
            closeAction: "hide",
            layout: "fit",
            items: [
                propsGrid
            ],
            listeners: {
                afterhide: function () {
                    if (configProperties.maxSearchDistanceInMI > nearestFeatureCache_searchDistanceInMi) {
                        // we've enlarged our search distance - clear the cache and requery each score from the server.
                        nearestFeatureCache = [];
                        myToolLine.scores.forEach(updateScoreFromSNL);
                    } else {
                        // let's just recalculate all scores from our existing cache.
                        myToolLine.scores.forEach(updateScoreFromCache);
                    }
                },
            },
            buttons: [{
                xtype: 'button',
                text: 'OK',
                handler: function () {
                    propsWindow.hide();
                }
            }],
            constrain: true
        });
    
    });

    class SolarPlantSocialModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "SolarPlantSocialModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",

                activate: () => {
                    addAllMaps();
                },
                deactivate: () => {
                    removeAllMaps();
                },
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    showConfigWindow: function () {
                        myToolLine = this; // fetch tool line, which was passed as 'this' parameter
                        propsWindow.show();
                    },

                    title: "Existing Solar Proximity",
                    description: "Distance from a site boundary to the nearest existing solar plant",
                    category: "Social Acceptance",
                    //onScoreAdded: function (e, score: pvMapper.Score) {
                    //    scores.push(score);
                    //},
                    onSiteChange: function (e, score: pvMapper.Score) {
                        updateScore(score);
                    },

                    // having any nearby line is much better than having no nearby line, so let's reflect that.
                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs:
                        new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor")
                    },
                    weight: 10
                }],

                infoTools: null
            });
        }
    }

    var modinstance = new SolarPlantSocialModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    var snlLineExportUrl = "https://maps.snl.com/arcgis/rest/services/SNLMaps/Power/MapServer/export"
    var snlLineQueryUrl = "https://maps.snl.com/arcgis/rest/services/SNLMaps/Power/MapServer/0/query";

    //declare var Ext: any;

    var mapLayer: any;

    function addAllMaps() {
        mapLayer = new OpenLayers.Layer.ArcGIS93Rest(
            "Existing Solar Plants",
            snlLineExportUrl,
            {
                layers: "show:0",
                format: "gif",
                srs: "3857", //"102100",
                transparent: "true",
            }
            );
        mapLayer.setOpacity(0.3);
        mapLayer.epsgOverride = "3857"; //"EPSG:102100";
        mapLayer.setVisibility(false);

        pvMapper.map.addLayer(mapLayer);
        //pvMapper.map.setLayerIndex(mapLayer, 0);
    }

    function removeAllMaps() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    // cache for features we've found from which we can find a nearest feature.
    var nearestFeatureCache: Array<Array<OpenLayers.FVector>> = [];

    // the smallest search distance used to populate any set of features in the feature cache
    // if we change our search distance to something larger than this, we'll need to requery the server.
    var nearestFeatureCache_searchDistanceInMi: number = configProperties.maxSearchDistanceInMI;

    function updateScore(score: pvMapper.Score) {
        if (typeof nearestFeatureCache[score.site.id] !== 'undefined') {
            // we have a cached copy of our nearby solar facilities query for this site - let's use that.
            updateScoreFromCache(score);
        } else {
            // we don't have a cached copy of our nearby solar facilities - let's request them.
            updateScoreFromSNL(score);
        }
    }

    function updateScoreFromSNL(score: pvMapper.Score) {
        var maxSearchDistanceInKM = configProperties.maxSearchDistanceInMI * 1.60934;
        var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;
        // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
        var jsonpProtocol = new OpenLayers.Protocol.Script(<any>{
            url: snlLineQueryUrl,
            params: {
                f: "json",
                where: "Fuel_Type = 'Solar'",
                outFields: "Power_Plant", //"Power_Plant,Owner,Plant_Operator,Operating_Capacity_MW", 
                geometryType: "esriGeometryEnvelope",
                //TODO: scaling is problematic - should use a constant-size search window
                geometry: new OpenLayers.Bounds(
                    score.site.geometry.bounds.left - maxSearchDistanceInMeters - 1000,
                    score.site.geometry.bounds.bottom - maxSearchDistanceInMeters - 1000,
                    score.site.geometry.bounds.right + maxSearchDistanceInMeters + 1000,
                    score.site.geometry.bounds.top + maxSearchDistanceInMeters + 1000)
                    .toBBOX(0, false),
            },
            format: new OpenLayers.Format.EsriGeoJSON(),
            parseFeatures: function (data) {
                return this.format.read(data);
            },
            callback: (response: OpenLayers.Response) => {
                //alert("Nearby features: " + response.features.length);
                if (response.success()) {
                    // cache the returned features, then update the score through the cache
                    nearestFeatureCache[score.site.id] = response.features;
                    nearestFeatureCache_searchDistanceInMi = configProperties.maxSearchDistanceInMI;
                    updateScoreFromCache(score);
                } else {
                    score.popupMessage = "Request error " + response.error.toString();
                    score.updateValue(Number.NaN);
                }
            },
        });

        var response: OpenLayers.Response = jsonpProtocol.read();
    }

    function updateScoreFromCache(score: pvMapper.Score) {
        var features: OpenLayers.FVector[] = nearestFeatureCache[score.site.id];

        var maxSearchDistanceInKM = configProperties.maxSearchDistanceInMI * 1.60934;
        var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;

        var closestFeature: OpenLayers.FVector = null;
        var minDistance: number = maxSearchDistanceInMeters;

        if (features) {
            for (var i = 0; i < features.length; i++) {
                var distance: number = score.site.geometry.distanceTo(features[i].geometry);
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

            var distanceOkStr: string =
                (distanceOk < 1) ? distanceOk.toFixed(2) :
                (distanceOk < 10) ? distanceOk.toFixed(1) :
                distanceOk.toFixed(0);

            var minDistanceStr: string =
                (minDistanceInMi < 1) ? minDistanceInMi.toFixed(2) :
                (minDistanceInMi < 10) ? minDistanceInMi.toFixed(1) :
                minDistanceInMi.toFixed(0);

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

            var nearestPlantStr: string = closestFeature.attributes.Power_Plant ?
                " (The nearest plant, " + closestFeature.attributes.Power_Plant + ", is " + minDistanceStr + " mi away" :
                " (The nearest plant is " + minDistanceStr + " mi away";

            score.popupMessage =
                percentOk.toFixed(1) + "% of respondents reported they would accept a site built " +
                distanceOkStr + " mi or more from an existing solar plant." + nearestPlantStr;

            score.updateValue(percentOk);
        } else {
            // no existing solar plants found nearby
            // use the % acceptance for our current max search distance
            var percentOk = 0;
            var distanceOk = 5000;
            var minDistanceInMi = configProperties.maxSearchDistanceInMI;

            for (var i = surveyResults.length - 1; i--; i >= 0) {
                if (minDistanceInMi >= surveyResults[i].mi) {
                    percentOk = surveyResults[i].percentOk;
                    distanceOk = surveyResults[i].mi;
                    break;
                }
            }

            var distanceOkStr: string =
                (distanceOk < 1) ? distanceOk.toFixed(2) :
                (distanceOk < 10) ? distanceOk.toFixed(1) :
                distanceOk.toFixed(0);

            var minDistanceStr: string =
                (minDistanceInMi < 1) ? minDistanceInMi.toFixed(2) :
                (minDistanceInMi < 10) ? minDistanceInMi.toFixed(1) :
                minDistanceInMi.toFixed(0);

            score.popupMessage =
                percentOk.toFixed(1) + "% of respondents reported they would accept a site built " +
                distanceOkStr + " mi or more from an existing solar plant. (There was no existing solar plant found within the " +
                configProperties.maxSearchDistanceInMI + " mi search distance.)";

            score.updateValue(percentOk);
        }

    }
}