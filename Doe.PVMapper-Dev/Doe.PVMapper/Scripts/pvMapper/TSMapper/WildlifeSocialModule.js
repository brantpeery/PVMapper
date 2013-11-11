/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />
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
        { mi: 5000, percentOk: 100 }
    ];

    var configProperties = {
        //maxSearchDistanceInKM: 30,
        maxSearchDistanceInMI: 20
    };

    var myToolLine;

    var propsWindow;

    Ext.onReady(function () {
        var propsGrid = Ext.create('Ext.grid.property.Grid', {
            nameText: 'Properties Grid',
            minWidth: 300,
            //autoHeight: true,
            source: configProperties,
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
        propsWindow = Ext.create('Ext.window.Window', {
            title: "Configure Wildlife Proximity Tool",
            closeAction: "hide",
            layout: "fit",
            items: [
                propsGrid
            ],
            listeners: {
                beforehide: function () {
                    if (configProperties.maxSearchDistanceInMI > nearestFeatureCache_searchDistanceInMi) {
                        // we've enlarged our search distance - clear the cache and requery each score from the server.
                        nearestFeatureCache = [];
                        myToolLine.scores.forEach(updateScoreFromWeb);
                    } else {
                        // let's just recalculate all scores from our existing cache.
                        myToolLine.scores.forEach(updateScoreFromCache);
                    }
                }
            },
            buttons: [
                {
                    xtype: 'button',
                    text: 'OK',
                    handler: function () {
                        propsWindow.hide();
                    }
                }
            ],
            constrain: true
        });
    });

    var WildlifeSocialModule = (function () {
        function WildlifeSocialModule() {
            var myModule = new pvMapper.Module({
                id: "WildlifeSocialModule",
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
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        showConfigWindow: function () {
                            myToolLine = this;
                            propsWindow.show();
                        },
                        title: "Wildlife Proximity",
                        description: "Percentage of survey respondents who reported this distance from sensitive wildlife habitat as acceptable",
                        category: "Social Acceptance",
                        //onScoreAdded: function (e, score: pvMapper.Score) {
                        //    scores.push(score);
                        //},
                        onSiteChange: function (e, score) {
                            updateScore(score);
                        },
                        // having any nearby line is much better than having no nearby line, so let's reflect that.
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }
        return WildlifeSocialModule;
    })();

    var modinstance = new WildlifeSocialModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var fwsExportUrl = "http://ecos.fws.gov/arcgis/rest/services/crithab/usfwsCriticalHabitat/MapServer/export";
    var fwsQueryUrl = "http://ecos.fws.gov/arcgis/rest/services/crithab/usfwsCriticalHabitat/MapServer/2/query";

    //declare var Ext: any;
    var mapLayer;

    function addAllMaps() {
        mapLayer = new OpenLayers.Layer.ArcGIS93Rest("Sensitive Wildlife Habitat", fwsExportUrl, {
            layers: "show:2",
            format: "gif",
            srs: "4326",
            transparent: "true"
        });
        mapLayer.setOpacity(0.3);

        //mapLayer.epsgOverride = "3857"; //"EPSG:102100";
        mapLayer.setVisibility(false);

        pvMapper.map.addLayer(mapLayer);
    }

    function removeAllMaps() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    // cache for features we've found from which we can find a nearest feature.
    var nearestFeatureCache = [];

    // the smallest search distance used to populate any set of features in the feature cache
    // if we change our search distance to something larger than this, we'll need to requery the server.
    var nearestFeatureCache_searchDistanceInMi = configProperties.maxSearchDistanceInMI;

    function updateScore(score) {
        if (typeof nearestFeatureCache[score.site.id] !== 'undefined') {
            // we have a cached copy of our nearby habitats query for this site - let's use that.
            updateScoreFromCache(score);
        } else {
            // we don't have a cached copy of our nearby habitats - let's request them.
            updateScoreFromWeb(score);
        }
    }

    function updateScoreFromWeb(score) {
        var maxSearchDistanceInKM = configProperties.maxSearchDistanceInMI * 1.60934;
        var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;

        // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
        var jsonpProtocol = new OpenLayers.Protocol.Script({
            url: fwsQueryUrl,
            params: {
                f: "json",
                outFields: "comname,status,type",
                geometryType: "esriGeometryEnvelope",
                geometry: new OpenLayers.Bounds(score.site.geometry.bounds.left - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.bottom - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.right + maxSearchDistanceInMeters + 1000, score.site.geometry.bounds.top + maxSearchDistanceInMeters + 1000).toBBOX(0, false),
                inSR: "3857",
                outSR: "3857"
            },
            format: new OpenLayers.Format.EsriGeoJSON(),
            parseFeatures: function (data) {
                return this.format.read(data);
            },
            callback: function (response) {
                if (response.success()) {
                    // cache the returned features, then update the score through the cache
                    nearestFeatureCache[score.site.id] = response.features || [];
                    nearestFeatureCache_searchDistanceInMi = configProperties.maxSearchDistanceInMI;
                    updateScoreFromCache(score);
                } else {
                    score.popupMessage = "Request error " + response.error.toString();
                    score.updateValue(Number.NaN);
                }
            }
        });

        var response = jsonpProtocol.read();
    }

    function updateScoreFromCache(score) {
        var features = nearestFeatureCache[score.site.id];

        var maxSearchDistanceInKM = configProperties.maxSearchDistanceInMI * 1.60934;
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
            var minDistanceInMi = configProperties.maxSearchDistanceInMI;

            for (var i = surveyResults.length - 1; i--; i >= 0) {
                if (minDistanceInMi >= surveyResults[i].mi) {
                    percentOk = surveyResults[i].percentOk;
                    distanceOk = surveyResults[i].mi;
                    break;
                }
            }

            var distanceOkStr = (distanceOk < 1) ? distanceOk.toFixed(2) : (distanceOk < 10) ? distanceOk.toFixed(1) : distanceOk.toFixed(0);

            var minDistanceStr = (minDistanceInMi < 1) ? minDistanceInMi.toFixed(2) : (minDistanceInMi < 10) ? minDistanceInMi.toFixed(1) : minDistanceInMi.toFixed(0);

            score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " + distanceOkStr + " mi or more from sensitive wildlife habitat. (There was no existing habitat found within the " + configProperties.maxSearchDistanceInMI + " mi search distance.)";

            score.updateValue(percentOk);
        }
    }
})(INLModules || (INLModules = {}));
