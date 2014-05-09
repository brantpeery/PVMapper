/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="OpenLayers.d.ts" />


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
        usePlantsUnderConstruction: true,
        usePlantsInDevelopment: true
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
                usePlantsUnderConstruction: "use unfinished PV",
                usePlantsInDevelopment: "use planned PV",
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
                beforehide: function () {
                    myToolLine.scores.forEach(updateScore);
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

    export class SolarPlantSocialModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module(<pvMapper.IModuleOptions>{
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

                scoringTools: [<pvMapper.IScoreToolOptions>{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    showConfigWindow: function () {
                        myToolLine = this; // fetch tool line, which was passed as 'this' parameter
                        propsWindow.show();
                    },

                    title: SolarPlantSocialModule.title, //"Existing Solar Proximity",
                    category: SolarPlantSocialModule.category, //"Social Acceptance",
                    description: SolarPlantSocialModule.description, //"Percentage of survey respondents who reported this distance from existing solar plants as acceptable",
                    longDescription: SolarPlantSocialModule.longDescription, //'<p>This tool calculates the distance from a site to the nearest existing solar plant, and then reports the percentage of survey respondents who said that distance was acceptable.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 441 respondents from six counties in Southern California answered Question 21 which asked "How much buffer distance is acceptable between a large solar facility and an existing large solar facility?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest existing solar installation is identified using map data from SEIA. See their Research & Resources page for more information (www.seia.org/research-resources).</p>',
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
                        new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor","Percent Favor","Score","Preference to the social aceptable in relative distance to existing solar plants.")
                    },
                    weight: 10
                }],

                infoTools: null
            });
            this.getModuleObj = function () { return myModule; }
        }
        getModuleObj: () => pvMapper.Module;
        public static title: string = "Existing Solar Proximity";
        public static category: string = "Social Acceptance";
        public static description: string = "Percentage of survey respondents who reported this distance from existing solar plants as acceptable";
        public static longDescription: string = '<p>This tool calculates the distance from a site to the nearest existing solar plant, and then reports the percentage of survey respondents who said that distance was acceptable.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 441 respondents from six counties in Southern California answered Question 21 which asked "How much buffer distance is acceptable between a large solar facility and an existing large solar facility?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest existing solar installation is identified using map data from SEIA. See their Research & Resources page for more information (www.seia.org/research-resources).</p>';

    }


    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    var seiaDataUrl = "https://seia.maps.arcgis.com/sharing/rest/content/items/e442f5fc7402493b8a695862b6a2290b/data";

    //declare var Ext: any;

    var requestError = null;
    var scoresWaitingOnRequest = [];

    var layerOperating: OpenLayers.Vector = null;
    var layerConstruction: OpenLayers.Vector = null;
    var layerDevelopment: OpenLayers.Vector = null;

    function createDefaultStyle(fillColor: string): OpenLayers.StyleMap {

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

        var style = new OpenLayers.Style(
            {
                fontSize: "12px",
                label: "${getLabel}", // "${Developer}", // "${Project Name}",
                labelOutlineColor: fillColor,
                labelOutlineWidth: 2,

                pointRadius: "${getSize}", //"${Capacity}",
                fillOpacity: 0.25,
                strokeOpacity: 0.875,

                fillColor: fillColor, // using context.getColor(feature)
                strokeColor: fillColor,
            },
            {
                context: {
                    getLabel: function (feature) {
                        try {
                            return feature.attributes["Project Name"] ? feature.attributes["Project Name"] :
                                feature.attributes["Developer"] ? feature.attributes["Developer"] :
                                feature.attributes["Electricity Purchaser"] ? feature.attributes["Electricity Purchaser"] :
                                "";
                        } catch (e) {
                            return ""; // duh?
                        }
                    },
                    getSize: function (feature) {
                        try {
                            return 2 + (4 * Math.log(feature.attributes["Capacity"]));
                        } catch (e) {
                            return 10; // duh?
                        }
                    },
                }
            });

        var styleMap = new OpenLayers.StyleMap(style);
        return styleMap;
    }

    function addAllMaps() {
        var jsonpProtocol = new OpenLayers.Protocol.Script(<any>{
            url: seiaDataUrl,
            params: {
                f: 'json'
            },
            format: new OpenLayers.Format.JSON(),
            parseFeatures: function (data) {
                return null;
            },
            callback: (response: OpenLayers.Response) => {
                if (response.success()) {
                    requestError = null;
                    var properties = { opacity: 0.3, visibility: false };
                    layerOperating = new OpenLayers.Layer.Vector("PV/CSP In Operation", properties);
                    layerConstruction = new OpenLayers.Layer.Vector("PV/CSP Under Construction", properties);
                    layerDevelopment = new OpenLayers.Layer.Vector("PV/CSP In Development", properties);

                    layerOperating.styleMap = createDefaultStyle("lightgreen");
                    layerConstruction.styleMap = createDefaultStyle("lightblue");
                    layerDevelopment.styleMap = createDefaultStyle("orange");

                    //new OpenLayers.Format.EsriGeoJSON()
                    //this.format.read(data)

                    var oLayers = response.data['operationalLayers'];
                    for (var i = 0; i < oLayers.length; i++) {
                        var destination: OpenLayers.Vector = null;
                        if (oLayers[i].title.indexOf("perat") >= 0) {
                            destination = layerOperating;
                        } else if (oLayers[i].title.indexOf("onstruct") >= 0) {
                            destination = layerConstruction;
                        } else if (oLayers[i].title.indexOf("evelop") >= 0) {
                            destination = layerDevelopment;
                        }

                        if (destination) {
                            var olFeatures = [];
                            var fLayers = oLayers[i]['featureCollection']['layers'];
                            for (var j = 0; j < fLayers.length; j++) {
                                var esriFeatures = fLayers[j]['featureSet']['features'];
                                for (var k = 0; k < esriFeatures.length; k++) {
                                    var geometry = new OpenLayers.Geometry.Point(esriFeatures[k].geometry.x, esriFeatures[k].geometry.y);
                                    var olFeature = new OpenLayers.Feature.Vector(geometry, esriFeatures[k].attributes/*, style*/);
                                    olFeatures.push(olFeature);
                                }
                            }
                            destination.addFeatures(olFeatures);
                        }
                    }

                    //nearestFeatureCache[score.site.id] = response.features;

                    if (layerDevelopment.features.length) { pvMapper.map.addLayer(layerDevelopment); }
                    if (layerConstruction.features.length) { pvMapper.map.addLayer(layerConstruction); }
                    if (layerOperating.features.length) { pvMapper.map.addLayer(layerOperating); }

                    while (scoresWaitingOnRequest.length) {
                        updateScoreFromLayers(scoresWaitingOnRequest.pop());
                    }
                } else {
                    requestError = response.error;
                    while (scoresWaitingOnRequest.length) {
                        var score = scoresWaitingOnRequest.pop();
                        score.popupMessage = "Request error " + requestError.toString();
                        score.updateValue(Number.NaN);
                    }
                }
            },
        });

        var response: OpenLayers.Response = jsonpProtocol.read();
    }

    function removeAllMaps() {
        if (layerOperating) {
            pvMapper.map.removeLayer(layerOperating, false);
            layerOperating = null;
        }

        if (layerConstruction) {
            pvMapper.map.removeLayer(layerConstruction, false);
            layerConstruction = null;
        }

        if (layerDevelopment) {
            pvMapper.map.removeLayer(layerDevelopment, false);
            layerDevelopment = null;
        }

        requestError = null;
    }

    function updateScore(score: pvMapper.Score) {
        if (layerOperating && layerOperating.features.length) {
            // if we have our layer data populated, let's update our score with it.
            updateScoreFromLayers(score);
        } else if (requestError) {
            score.popupMessage = "Request error " + requestError.toString();
            score.updateValue(Number.NaN);
        } else if (scoresWaitingOnRequest.indexOf(score) < 0) {
            // if we're still waiting on that data, let's enqueue this score to be updated afterward.
            scoresWaitingOnRequest.push(score);
        }
    }

    function updateScoreFromLayers(score: pvMapper.Score) {
        var maxSearchDistanceInKM = configProperties.maxSearchDistanceInMI * 1.60934;
        var maxSearchDistanceInMeters = maxSearchDistanceInKM * 1000;

        var searchBounds: OpenLayers.Bounds = new OpenLayers.Bounds(
            score.site.geometry.bounds.left - maxSearchDistanceInMeters - 1000,
            score.site.geometry.bounds.bottom - maxSearchDistanceInMeters - 1000,
            score.site.geometry.bounds.right + maxSearchDistanceInMeters + 1000,
            score.site.geometry.bounds.top + maxSearchDistanceInMeters + 1000);

        var closestFeature: OpenLayers.FVector = null;
        var minDistance: number = maxSearchDistanceInMeters;

        var searchForClosestFeature = function (features) {
            for (var i = 0; i < features.length; i++) {
                // filter out far away geometries quickly using boundary overlap
                //if (searchBounds.intersects(features[i].bounds))
                if (searchBounds.contains(features[i].geometry.x, features[i].geometry.y)) {
                    var distance: number = score.site.geometry.distanceTo(features[i].geometry);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestFeature = features[i];
                    }
                }
            }
        }

        searchForClosestFeature(layerOperating.features);
        if (configProperties.usePlantsUnderConstruction) {
            searchForClosestFeature(layerConstruction.features);
        }
        if (configProperties.usePlantsInDevelopment) {
            searchForClosestFeature(layerDevelopment.features);
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

            var nearestPlantStr: string = closestFeature.attributes["Project Name"] ?
                " (The nearest plant, " + closestFeature.attributes["Project Name"] + ", is " + minDistanceStr + " mi away" :
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
    //var modinstance = new INLModules.SolarPlantSocialModule();
}

if (typeof (selfUrl) == 'undefined')
  var selfUrl = $('script[src$="SolarPlantSocialModule.js"]').attr('src');
if (typeof (isActive) == 'undefined')
    var isActive = true;
pvMapper.moduleManager.registerModule(INLModules.SolarPlantSocialModule.category, INLModules.SolarPlantSocialModule.title, INLModules.SolarPlantSocialModule, isActive, selfUrl);
