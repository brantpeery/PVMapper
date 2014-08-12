/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />

module BYUModules {
    declare var selfUrl: string; // this should be included dynamically in ModuleManager when it loads this file.
    //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

    interface IConfig {
        maxSearchDistanceInMi: number;
    }

    export class WaterDistanceModule extends pvMapper.Module {
        constructor() {
            super();

            this.configProperties = {
                maxSearchDistanceInMi: 15,
            };

            var thisModule = this; //HACK: we want to capture the 'this' parameter passed to the tool - it will be our ToolLine object.
            this.init(<pvMapper.IModuleOptions>{
                activate: null,
                deactivate: null,

                scoringTools: [<pvMapper.IScoreToolOptions>{
                    activate: function () {
                        var thisScoreLine: pvMapper.ScoreLine = this;

                        if (!thisModule.propsWindow) { // only construct the options window once, and only when we need it (ie, once we've activated the tool that requires it)
                            thisModule.propsGrid = Ext.create('Ext.grid.property.Grid', {
                                nameText: 'Properties Grid',
                                minWidth: 300,
                                //autoHeight: true,
                                source: thisModule.configProperties,
                                customRenderers: {
                                    maxSearchDistanceInMi: function (v) { return v + " mi"; }
                                },
                                propertyNames: {
                                    maxSearchDistanceInMi: "search distance",
                                }
                            });

                            // display a cute little properties window describing our doodle here.
                            //Note: this works only as well as our windowing scheme, which is to say poorly

                            //var propsWindow = Ext.create('MainApp.view.Window', {
                            thisModule.propsWindow = Ext.create('Ext.window.Window', {
                                title: "Configure Nearest Transmission Line Tool",
                                closeAction: "hide", //"destroy",
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
                    },
                    deactivate: null,

                    showConfigWindow: function () {
                        thisModule.propsWindow.show();
                    },

                    id: "WaterDistanceTool",
                    title: "Nearest River",
                    category: "Geography",
                    description: "Distance from the site to the nearest river",
                    longDescription: '<p>This tool reports the distance from a site to the nearest river.</p>',
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
                        if (config.maxSearchDistanceInMi > 0 &&
                            thisModule.configProperties.maxSearchDistanceInMi !== config.maxSearchDistanceInMi) { // common sense check

                            thisModule.configProperties.maxSearchDistanceInMi = config.maxSearchDistanceInMi;

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
                        functionArgs:                                             
                        new pvMapper.ThreePointUtilityArgs(0, 1, 5, 0.9, 15, 0.4,
                            "mi", "Distance to nearest river", "Prefer sites near a river. Strongly prefer sites within five miles of a river. The minimum possible score is 40, reflecting an assumption that having no nearby river may not be prohibitive.")
                    },
                    weight: 10,
                }],
            });
        }

        public id = "WaterDistanceModule";
        public author = "Darian Ramage, BYU";
        public version = "0.2.ts";
        public url = selfUrl; //TODO: why didn't we use require.js (or similar)? Why roll our own dynamic js loader?

        public title: string = "Nearest River";
        public category: string = "Geography";
        public description: string = "Distance from the site to the nearest river";

        private configProperties: IConfig;
        //private myToolLine: pvMapper.IToolLine;
        private propsGrid: Ext.grid.property.IGrid;
        private propsWindow: any;

        //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

        //var ExportUrl = "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer/export";
        private QueryUrl = "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer/3/query";

        //var mapLayer: any;

        //Note: the river layer was already added as a Reference layer... 
        //      As it seems more similar to the other Reference layers than it does to the Tool Data layers,
        //      I chose to leave it there (and comment out this add)
        //function addAllMaps() {
        //    mapLayer = new OpenLayers.Layer.ArcGIS93Rest(
        //        "Rivers",
        //        ExportUrl,
        //        {
        //            layers: "show:3", //"show:2", //TODO 
        //            format: "gif",
        //            srs: "3857", //"102100",
        //            transparent: "true",
        //        }//,{ isBaseLayer: false }
        //        );
        //    mapLayer.setOpacity(0.3);
        //    mapLayer.epsgOverride = "3857"; //"EPSG:102100";
        //    mapLayer.setVisibility(false);

        //    pvMapper.map.addLayer(mapLayer);
        //    //pvMapper.map.setLayerIndex(mapLayer, 0);
        //}

        //function removeAllMaps() {
        //    pvMapper.map.removeLayer(mapLayer, false);
        //}

        private updateScore = (score: pvMapper.Score) => {
            var maxSearchDistanceInMeters = this.configProperties.maxSearchDistanceInMi * 1609.34;
            // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
            var jsonpProtocol = new OpenLayers.Protocol.Script(<any>{
                url: this.QueryUrl,
                params: {
                    f: "json",
                    //TODO: should request specific out fields, instead of '*' here.
                    outFields: "*", //"Voltage",
                    //returnGeometry: false,
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
                    if (!data.error) {
                        return this.format.read(data);
                    }
                },
                callback: (response: OpenLayers.Response) => {
                    //alert("Nearby features: " + response.features.length);
                    if (response.success() && !(response.data && response.data.error)) {
                        var closestFeature = null;
                        var minDistance: number = maxSearchDistanceInMeters;

                        if (response.features) {
                            for (var i = 0; i < response.features.length; i++) {
                                var distance: number = score.site.geometry.distanceTo(response.features[i].geometry);
                                if (distance < minDistance ) {
                                    minDistance = distance;
                                    closestFeature = response.features[i];
                                }
                            }
                        }
                        if (closestFeature !== null) {
                            var distanceInFt = minDistance * 3.28084; // convert meters to feet
                            var distanceInMi = minDistance * 0.000621371; // convert meters to miles
                            var distanceString = distanceInMi > 10.0 ? distanceInMi.toFixed(1) + " mi" :
                                distanceInMi > 0.5 ? distanceInMi.toFixed(2) + " mi" :
                                distanceInMi.toFixed(2) + " mi (" + distanceInFt.toFixed(0) + " ft)";

                            var toNearestString = " to " + closestFeature.attributes.PNAME + " river";

                            var messageString = distanceInFt > 1 ? distanceString + toNearestString + "." :
                                "0 mi" + toNearestString + " (river is on site).";

                            score.popupMessage = messageString;
                            score.updateValue(distanceInMi);
                        } else {
                            score.popupMessage = "No rivers found within " + this.configProperties.maxSearchDistanceInMi + " mi search distance.";
                            score.updateValue(this.configProperties.maxSearchDistanceInMi);
                        }

                    } else if (response.data && response.data.error) {
                        score.popupMessage = "Error " + ((response.data.error.code && response.data.error.message) ? 
                            (response.data.error.code + ": " + response.data.error.message) : response.data.error.toString());
                        score.updateValue(Number.NaN);
                    } else {
                        score.popupMessage = "Unknown error";
                        score.updateValue(Number.NaN);
                    }
                },
            });

            var response: OpenLayers.Response = jsonpProtocol.read();
        }

    }

    pvMapper.moduleManager.registerModule(new BYUModules.WaterDistanceModule(), false);
}
//var modinstance = new BYUModules.WaterDistanceModule();

