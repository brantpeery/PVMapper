
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />


module BYUModules {

    var configProperties = {
        maxSearchDistanceInMi: 15,
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
                maxSearchDistanceInMi: function (v) { return v + " mi"; }
            },
            propertyNames: {
                maxSearchDistanceInMi: "search distance",
            }
        });

        // display a cute little properties window describing our doodle here.
        //Note: this works only as well as our windowing scheme, which is to say poorly

        //var propsWindow = Ext.create('MainApp.view.Window', {
        propsWindow = Ext.create('Ext.window.Window', {
            title: "Configure Nearest Transmission Line Tool",
            closeAction: "hide", //"destroy",
            layout: "fit",
            items: [
                propsGrid
            ],
            listeners: {
                beforehide: function () {
                    // recalculate all scores
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

    export class WaterDistanceModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module(<pvMapper.IModuleOptions>{
                id: "Water Distance Module",
                author: "Darian Ramage, BYU",
                version: "0.2.ts",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",

                activate: () => {
                    //addAllMaps();
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

                    title: WaterDistanceModule.title, //"Nearest River",
                    category: WaterDistanceModule.category, //"Geography",
                    description: WaterDistanceModule.description, //"Distance from the site to the nearest river",
                    longDescription: WaterDistanceModule.longDescription, //'<p>This tool reports the distance from a site to the nearest river.</p>',
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
                        new pvMapper.ThreePointUtilityArgs(0, 1, (configProperties.maxSearchDistanceInMi - 1), 0.3, configProperties.maxSearchDistanceInMi, 0,
                            "mi", "Distance to nearest river", "Score", "Prefer sites near a river.")
                    },
                    weight: 10
                }],

                infoTools: null
            });
            this.getModuleObj = function () { return myModule; }
        }
        getModuleObj: () => pvMapper.Module;
        public static title: string = "Nearest River";
        public static category: string = "Geography";
        public static description: string = "Distance from the site to the nearest river";
        public static longDescription: string = '<p>This tool reports the distance from a site to the nearest river.</p>';

    }

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    //var ExportUrl = "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer/export";
    var QueryUrl = "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer/3/query";

    var mapLayer: any;

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

    function removeAllMaps() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    function updateScore(score: pvMapper.Score) {
        var maxSearchDistanceInMeters = configProperties.maxSearchDistanceInMi * 1609.34;
        // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
        var jsonpProtocol = new OpenLayers.Protocol.Script(<any>{
            url: QueryUrl,
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
                return this.format.read(data);
            },
            callback: (response: OpenLayers.Response) => {
                //alert("Nearby features: " + response.features.length);
                if (response.success()) {
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
                        score.popupMessage = "No rivers found within " + configProperties.maxSearchDistanceInMi + " mi search distance.";
                        score.updateValue(configProperties.maxSearchDistanceInMi);
                    }
                } else {
                    score.popupMessage = "Request error " + response.error.toString();
                    score.updateValue(Number.NaN);
                }
            },
        });

        var response: OpenLayers.Response = jsonpProtocol.read();
    }


}
//var modinstance = new BYUModules.WaterDistanceModule();
if (typeof(selfUrl) == 'undefined')
  var selfUrl = $('script[src$="riverDisnace.js"]').attr('src');
if (typeof (isActive) == 'undefined')
    var isActive = true;
pvMapper.moduleManager.registerModule(BYUModules.WaterDistanceModule.category, BYUModules.WaterDistanceModule.title, BYUModules.WaterDistanceModule, isActive, selfUrl);
