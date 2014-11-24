
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

    interface IConfig {
        //maxSearchDistanceInMI: number;
        usePlantsUnderConstruction: boolean;
        usePlantsInDevelopment: boolean;
    }

    //var surveyResults = [
    //    { mi: 0, percentOk: 33.71040724 },
    //    { mi: 0.000189394, percentOk: 34.61538462 },
    //    { mi: 0.000378788, percentOk: 34.84162896 },
    //    { mi: 0.00094697, percentOk: 35.0678733 },
    //    { mi: 0.001893939, percentOk: 35.97285068 },
    //    { mi: 0.003787879, percentOk: 36.42533937 },
    //    { mi: 0.005681818, percentOk: 37.1040724 },
    //    { mi: 0.007007576, percentOk: 37.33031674 },
    //    { mi: 0.009469697, percentOk: 38.00904977 },
    //    { mi: 0.018939394, percentOk: 39.59276018 },
    //    { mi: 0.028409091, percentOk: 40.04524887 },
    //    { mi: 0.037878788, percentOk: 40.27149321 },
    //    { mi: 0.05, percentOk: 40.49773756 },
    //    { mi: 0.056818182, percentOk: 41.40271493 },
    //    { mi: 0.113636364, percentOk: 41.62895928 },
    //    { mi: 0.189393939, percentOk: 42.08144796 },
    //    { mi: 0.25, percentOk: 43.66515837 },
    //    { mi: 0.5, percentOk: 46.15384615 },
    //    { mi: 0.946969697, percentOk: 46.3800905 },
    //    { mi: 1, percentOk: 55.20361991 },
    //    { mi: 2, percentOk: 57.91855204 },
    //    { mi: 2.5, percentOk: 58.14479638 },
    //    { mi: 3, percentOk: 58.82352941 },
    //    { mi: 5, percentOk: 64.9321267 },
    //    { mi: 6, percentOk: 65.38461538 },
    //    { mi: 7, percentOk: 65.61085973 },
    //    { mi: 7.456454307, percentOk: 65.83710407 },
    //    { mi: 8, percentOk: 69.00452489 },
    //    { mi: 10, percentOk: 74.88687783 },
    //    { mi: 15, percentOk: 77.37556561 },
    //    { mi: 20, percentOk: 83.25791855 },
    //    { mi: 25, percentOk: 85.0678733 },
    //    { mi: 30, percentOk: 86.87782805 },
    //    { mi: 40, percentOk: 87.55656109 },
    //    { mi: 50, percentOk: 92.760181 },
    //    { mi: 60, percentOk: 93.21266968 },
    //    { mi: 70, percentOk: 93.43891403 },
    //    { mi: 90, percentOk: 93.66515837 },
    //    { mi: 100, percentOk: 96.83257919 },
    //    { mi: 120, percentOk: 97.05882353 },
    //    { mi: 140, percentOk: 97.28506787 },
    //    { mi: 150, percentOk: 97.51131222 },
    //    { mi: 200, percentOk: 98.41628959 },
    //    { mi: 250, percentOk: 98.64253394 },
    //    { mi: 300, percentOk: 98.86877828 },
    //    { mi: 500, percentOk: 99.32126697 },
    //    { mi: 1000, percentOk: 99.54751131 },
    //    { mi: 2000, percentOk: 99.77375566 },
    //    { mi: 5000, percentOk: 100 }];


    var surveyResults = [
        { mi: 0.25, low: 53.60, high: 63.60, average: 58.60, plusOrMinus: 5.00 },
        { mi: 0.50, low: 54.90, high: 64.80, average: 59.85, plusOrMinus: 4.95 },
        { mi: 1.00, low: 56.00, high: 65.90, average: 60.95, plusOrMinus: 4.95 },
        { mi: 1.50, low: 65.40, high: 74.70, average: 70.05, plusOrMinus: 4.65 },
        { mi: 2.00, low: 65.40, high: 74.70, average: 70.05, plusOrMinus: 4.65 },
        { mi: 2.50, low: 67.70, high: 76.80, average: 72.25, plusOrMinus: 4.55 },
        { mi: 3.00, low: 67.80, high: 76.90, average: 72.35, plusOrMinus: 4.55 },
        { mi: 3.50, low: 68.80, high: 77.80, average: 73.30, plusOrMinus: 4.50 },
        { mi: 4.00, low: 68.80, high: 77.80, average: 73.30, plusOrMinus: 4.50 },
        { mi: 4.50, low: 68.80, high: 77.80, average: 73.30, plusOrMinus: 4.50 },
        { mi: 5.00, low: 68.80, high: 77.80, average: 73.30, plusOrMinus: 4.50 }
    ];


    export class SolarPlantSocialModule extends pvMapper.Module {
        constructor() {
            super();

            this.configProperties = {
                //maxSearchDistanceInMI: 20,
                usePlantsUnderConstruction: true,
                usePlantsInDevelopment: true
            };

            var thisModule = this; //HACK: we want to capture the 'this' parameter passed to the tool - it will be our ToolLine object.
            this.init(<pvMapper.IModuleOptions>{
                activate: null,
                deactivate: null,

                scoringTools: [<pvMapper.IScoreToolOptions>{
                    activate: function () { // keep 'this' parameter from tool line object
                        var thisScoreLine: pvMapper.ScoreLine = this;

                        if (!thisModule.propsWindow) {
                            thisModule.propsGrid = Ext.create('Ext.grid.property.Grid', {
                                nameText: 'Properties Grid',
                                minWidth: 300,
                                //autoHeight: true,
                                source: thisModule.configProperties,
                                //customRenderers: {
                                //    maxSearchDistanceInMI: function (v) { return v + " mi"; },
                                //},
                                propertyNames: {
                                    //maxSearchDistanceInMI: "search distance",
                                    usePlantsUnderConstruction: "use unfinished PV",
                                    usePlantsInDevelopment: "use planned PV",
                                },
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
                                        thisScoreLine.scores.forEach(s => { s.isValueOld = true; thisModule.updateScore(s); });

                                        // save configuration changes to the browser
                                        thisScoreLine.saveConfiguration();
                                    },
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
                    description: "Percentage of people who would report this distance from existing solar plants as acceptable, according to our survey",
                    longDescription: '<p>This tool calculates the distance from a site to the nearest existing solar plant, and then reports the estimated percentage of residents who would say that distance was acceptable, with a 95% confidence interval.</p><p>The survey used in this tool was administered by the PVMapper project in 2013 and 2014. From the 2013 survey, 441 respondents from six counties in Southern California answered Question 21 which asked "How much buffer distance is acceptable between a large solar facility and an existing large solar facility?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest existing solar installation is identified using map data from SEIA. See their Research & Resources page for more information (www.seia.org/research-resources).</p>',
                    //onScoreAdded: function (e, score: pvMapper.Score) {
                    //    scores.push(score);
                    //},
                    onSiteChange: function (e, score: pvMapper.Score) {
                        thisModule.updateScore(score);
                    },

                    getConfig: function () {
                        return thisModule.configProperties;
                    },
                    setConfig: function (config: IConfig) {
                        if (config && /*config.maxSearchDistanceInMI >= 0 &&*/ (
                            //thisModule.configProperties.maxSearchDistanceInMI != config.maxSearchDistanceInMI ||
                            thisModule.configProperties.usePlantsInDevelopment != config.usePlantsInDevelopment ||
                            thisModule.configProperties.usePlantsUnderConstruction != config.usePlantsUnderConstruction)) {

                            //thisModule.configProperties.maxSearchDistanceInMI = config.maxSearchDistanceInMI;
                            thisModule.configProperties.usePlantsInDevelopment = !!config.usePlantsInDevelopment;
                            thisModule.configProperties.usePlantsUnderConstruction = !!config.usePlantsUnderConstruction;

                            if (thisModule.propsGrid) // this won't be true if the tool isn't active.
                                thisModule.propsGrid.setSource(thisModule.configProperties); // set property grid to match

                            // refresh scores as necessary to accomodate this configuraiton change.
                            var thisScoreLine: pvMapper.ScoreLine = this;
                            thisScoreLine.scores.forEach(s => { s.isValueOld = true; thisModule.updateScore(s); });
                        }
                    },

                    // having any nearby line is much better than having no nearby line, so let's reflect that.
                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor", "% of respondants in favor", 
                            "Prefer sites with greater social acceptance of existing solar plant proximity. Expect diminishing returns from increasing acceptance. The minimum possible score is 40, reflecting an assumption that low social acceptance may not be prohibitive.")
                    },
                    weight: 5
                }],
            });
        }

        public id = "SolarPlantSocialModule";
        public author = "Scott Brown, INL";
        public version = "0.1.ts";
        public url = selfUrl;

        public title: string = "Existing Solar Proximity";
        public category: string = "Social Acceptance";
        public description: string = "Percentage of people who would report this distance from existing solar plants as acceptable, according to our survey";


        private configProperties: IConfig;
        private propsWindow: any;
        private propsGrid: Ext.grid.property.IGrid;

        //private seiaDataUrl = "https://seia.maps.arcgis.com/sharing/rest/content/items/e442f5fc7402493b8a695862b6a2290b/data";
        private seiaDataUrl = "/Scripts/ToolModules/SolarPlantSocialModule.SEIA.projects.geo.json";

        //declare var Ext: any;

        private requestError = null;
        private scoresWaitingOnRequest;

        private layerOperating: OpenLayers.Vector = null;
        private layerConstruction: OpenLayers.Vector = null;
        private layerDevelopment: OpenLayers.Vector = null;

        private static createDefaultStyle(fillColor: string): OpenLayers.StyleMap {

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

        private requestAllMaps = () => {
            // don't send another request until the last one is finished.
            if (this.scoresWaitingOnRequest) {
                return;
            }

            this.scoresWaitingOnRequest = []; // scores can now wait on the request, because the request is being sent.
            //var jsonpProtocol = new OpenLayers.Protocol.Script(<any>{
            var jsonpProtocol = new OpenLayers.Protocol.HTTP(<any>{
                url: this.seiaDataUrl,
                //params: {
                //    f: 'json'
                //},
                format: new OpenLayers.Format.GeoJSON({
                    internalProjection: new OpenLayers.Projection("EPSG:3857"),
                    externalProjection: new OpenLayers.Projection("EPSG:4326"),
                }),
                //parseFeatures: function (data) {
                //    return null;
                //},
                callback: (response: OpenLayers.Response) => {
                    if (response.success() && !(response.data && response.data.error) &&
                        response.features && response.features.length) {

                        this.requestError = null;
                        var properties = { opacity: 0.3, visibility: false/*, projection: "EPSG:4326"*/ };
                        this.layerOperating = new OpenLayers.Layer.Vector("PV/CSP In Operation", properties);
                        this.layerConstruction = new OpenLayers.Layer.Vector("PV/CSP Under Construction", properties);
                        this.layerDevelopment = new OpenLayers.Layer.Vector("PV/CSP In Development", properties);

                        this.layerOperating.styleMap = SolarPlantSocialModule.createDefaultStyle("lightgreen");
                        this.layerConstruction.styleMap = SolarPlantSocialModule.createDefaultStyle("lightblue");
                        this.layerDevelopment.styleMap = SolarPlantSocialModule.createDefaultStyle("orange");

                        //new OpenLayers.Format.EsriGeoJSON()
                        //this.format.read(data)

                        var featuresByStatus = [];

                        for (var i = 0; i < response.features.length; i++) {
                            var feature = response.features[i];
                            featuresByStatus[feature.attributes.Status] = featuresByStatus[feature.attributes.Status] || [];
                            featuresByStatus[feature.attributes.Status].push(feature);
                        }

                        this.layerOperating.addFeatures(featuresByStatus["Operating"] || []);
                        this.layerConstruction.addFeatures(featuresByStatus["Under Construction"] || []);
                        this.layerDevelopment.addFeatures(featuresByStatus["Under Development"] || []);

                        //var epsg4326 = new OpenLayers.Projection("EPSG:4326");
                        //var mapProjection = new OpenLayers.Projection("EPSG:3857");
                        ////var mapProjection = pvMapper.map.getProjectionObject();

                        //(<any>this.layerOperating).transform(epsg4326, mapProjection);
                        //(<any>this.layerConstruction).transform(epsg4326, mapProjection);
                        //(<any>this.layerDevelopment).transform(epsg4326, mapProjection);

                        //var oLayers = response.data['operationalLayers'];
                        //for (var i = 0; i < oLayers.length; i++) {
                        //    var destination: OpenLayers.Vector = null;
                        //    if (oLayers[i].title.indexOf("perat") >= 0) {
                        //        destination = this.layerOperating;
                        //    } else if (oLayers[i].title.indexOf("onstruct") >= 0) {
                        //        destination = this.layerConstruction;
                        //    } else if (oLayers[i].title.indexOf("evelop") >= 0) {
                        //        destination = this.layerDevelopment;
                        //    }

                        //    if (destination) {
                        //        var olFeatures = [];
                        //        var fLayers = oLayers[i]['featureCollection']['layers'];
                        //        for (var j = 0; j < fLayers.length; j++) {
                        //            var esriFeatures = fLayers[j]['featureSet']['features'];
                        //            for (var k = 0; k < esriFeatures.length; k++) {
                        //                var geometry = new OpenLayers.Geometry.Point(esriFeatures[k].geometry.x, esriFeatures[k].geometry.y);
                        //                var olFeature = new OpenLayers.Feature.Vector(geometry, esriFeatures[k].attributes/*, style*/);
                        //                olFeatures.push(olFeature);
                        //            }
                        //        }
                        //        destination.addFeatures(olFeatures);
                        //    }
                        //}

                        //nearestFeatureCache[score.site.id] = response.features;

                        if (this.isActive && this.scoresWaitingOnRequest) { // we must test this - the tool may have been deactivated before we received our response.
                            if (this.layerDevelopment.features.length) { pvMapper.map.addLayer(this.layerDevelopment); }
                            if (this.layerConstruction.features.length) { pvMapper.map.addLayer(this.layerConstruction); }
                            if (this.layerOperating.features.length) { pvMapper.map.addLayer(this.layerOperating); }

                            while (this.scoresWaitingOnRequest.length) {
                                this.updateScoreFromLayers(this.scoresWaitingOnRequest.pop());
                            }
                        }
                        this.scoresWaitingOnRequest = null; // scores can no longer wait on the request, because the request is finished.
                    } else {
                        if (this.isActive && this.scoresWaitingOnRequest) { // we must test this - the tool may have been deactivated before we received our response.
                            this.requestError = response.error || (response.data && response.data.error) || response;
                            while (this.scoresWaitingOnRequest.length) {
                                var score = this.scoresWaitingOnRequest.pop();
                                score.popupMessage = (this.requestError.message ? this.requestError.message : "Error " +
                                    (this.requestError.messageCode ? this.requestError.messageCode :
                                    (this.requestError.code ? this.requestError.code : "")));
                                score.updateValue(Number.NaN);
                            }
                        }
                        this.scoresWaitingOnRequest = null; // scores can no longer wait on the request, because the request is finished.
                    }
                },
            });

            var response: OpenLayers.Response = jsonpProtocol.read(); // execute request for features...
        }

        private addAllMaps = () => {
            if (!this.layerOperating && !this.layerConstruction && !this.layerDevelopment) {
                this.requestAllMaps();

            } else {
                if (this.layerOperating && this.layerOperating.features.length) {
                    pvMapper.map.addLayer(this.layerOperating);
                }

                if (this.layerConstruction && this.layerConstruction.features.length) {
                    pvMapper.map.addLayer(this.layerConstruction);
                }

                if (this.layerDevelopment && this.layerDevelopment.features.length) {
                    pvMapper.map.addLayer(this.layerDevelopment);
                }
            }
        }

        private removeAllMaps = () => {
            if (this.layerOperating && this.layerOperating.features.length) {
                pvMapper.map.removeLayer(this.layerOperating, false);
            }

            if (this.layerConstruction && this.layerConstruction.features.length) {
                pvMapper.map.removeLayer(this.layerConstruction, false);
            }

            if (this.layerDevelopment && this.layerDevelopment.features.length) {
                pvMapper.map.removeLayer(this.layerDevelopment, false);
            }
        }

        private updateScore = (score: pvMapper.Score) => {
            if (this.layerOperating && this.layerOperating.features.length) {
                // if we have our layer data populated, let's update our score with it.
                this.updateScoreFromLayers(score);
            } else if (this.requestError) {
                score.popupMessage = (this.requestError.message ? this.requestError.message : "Error " +
                    (this.requestError.messageCode ? this.requestError.messageCode :
                    (this.requestError.code ? this.requestError.code : "")));
                score.updateValue(Number.NaN);
            } else if (this.scoresWaitingOnRequest.indexOf(score) < 0) {
                // if we're still waiting on that data, let's enqueue this score to be updated afterward.
                this.scoresWaitingOnRequest.push(score);
            }
        }

        private updateScoreFromLayers = (score: pvMapper.Score) => {
            var maxSearchDistanceInKM = /*this.configProperties.maxSearchDistanceInMI*/ 5 * 1.60934;
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

            searchForClosestFeature(this.layerOperating.features);
            if (this.configProperties.usePlantsUnderConstruction) {
                searchForClosestFeature(this.layerConstruction.features);
            }
            if (this.configProperties.usePlantsInDevelopment) {
                searchForClosestFeature(this.layerDevelopment.features);
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

                var nearestPlantStr: string = closestFeature.attributes["Project Name"] ?
                    " The nearest plant, " + closestFeature.attributes["Project Name"] + ", is " + minDistanceInMi.toFixed(2) + " mi away." :
                    " The nearest plant is " + minDistanceInMi.toFixed(2) + " mi away.";

                score.popupMessage = surveyResult.average + "% &plusmn; " + surveyResult.plusOrMinus + "% of people would accept a site built " +
                previousDistance + " mi - " + surveyResult.mi + " mi away from an existing solar plant (95% confidence interval)." + nearestPlantStr;

                score.updateValue(surveyResult.average);
            } else {
                score.popupMessage = "There was no existing solar plant found within 5 mi of this site.";
                score.updateValue(100); //surveyResults[surveyResults.length - 1].average); //TODO: what is the appropriate value to use here? 100%? the largest % we have in the table? Number.NaN ?!?
            }
        }
    }

    pvMapper.moduleManager.registerModule(new INLModules.SolarPlantSocialModule(), true);
}

