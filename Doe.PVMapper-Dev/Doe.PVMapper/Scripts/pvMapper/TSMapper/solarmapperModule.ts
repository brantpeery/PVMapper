/// <reference path="ScoreUtility.ts" />
/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />

module INLModules {
    class SolarmapperModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "SolarmapperModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",

                activate: () => {
                    addMapLayer();
                },
                deactivate: () => {
                    removeMapLayer();
                },
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Land Management",
                    description: "Checks solarmapper.anl.gov for intersecting land management polygons",
                    category: "Land Use",
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score) {
                        identifyFeature(score);
                        //s.updateValue(status.toString());
                    },

                    // for now, no land management agencies is best, any one is bad, and multiple are worse
                    //scoreUtilityOptions: <pvMapper.IThreePointUtilityOptions>{
                    //    functionName: "linear3pt",
                    //    p0: { x: 0, y: 1 },
                    //    p1: { x: 1, y: 0.6 },
                    //    p2: { x: 5, y: 0 },
                    //},

                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0,1,1,0.6,5,0)
                    },

                    weight:10
                }],

                infoTools: null
            });
        }
    }

    var modinstance = new SolarmapperModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    var solarmapperRestBaseUrl = "http://solarmapper.anl.gov/ArcGIS/rest/services/PV_Mapper_SDE/MapServer/";
    var solarmapperWmsUrl = "http://solarmapper.anl.gov/ArcGIS/services/PV_Mapper_SDE/MapServer/WMSServer";
    //declare var Ext: any;

    var mapLayer: any;

    function addMapLayer() {
        // use WMS for easy-to-get legend graphic
        mapLayer = new OpenLayers.Layer.WMS(
            "Land Management",
            solarmapperWmsUrl,
            {
                layers: "1", //"72",
                format: "gif",
                srs: "3857", //"102100",
                transparent: "true",
            },
            { isBaseLayer: false }
            );
        mapLayer.setOpacity(0.3);
        mapLayer.epsgOverride = "3857"; //"EPSG:102100";
        mapLayer.setVisibility(false);
        pvMapper.map.addLayer(mapLayer);
        //pvMapper.map.setLayerIndex(mapLayer, 0);
    }

    function removeMapLayer() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    // this was added because sometimes the mapLayer is not yet defined before we get a call to update a score.
    // and everyone loves a good race condition
    //var mapLayerBounds = new OpenLayers.Bounds(-13850000, 3675000, -11350000, 5165000);
    
    function identifyFeature(score: pvMapper.Score) {
        // if this site lies outside of our layer's extent, then we can't get a value for it.
        //if (!mapLayer.maxExtent.intersectsBounds(score.site.geometry.bounds)) {
        //if (!mapLayerBounds.intersectsBounds(score.site.geometry.bounds)) {
        //    score.popupMessage = "No data for this site";
        //    score.updateValue(Number.NaN);
        //    return; // nothin' doin'
        //}

        var params = {
            mapExtent: score.site.geometry.bounds.toBBOX(6, false),
            geometryType: "esriGeometryEnvelope",
            geometry: score.site.geometry.bounds.toBBOX(6, false),
            f: "json", // or "html",
            layers: "1", //"perezANN_mod", //solar.params.LAYERS,
            tolerance: 0, //TODO: should this be 0 or 1?
            imageDisplay: "1, 1, 96",
        };

        var request = OpenLayers.Request.GET({
            //url: "/Proxy/proxy.ashx?" + solarmapperRestBaseUrl + "identify",
            url: solarmapperRestBaseUrl + "identify",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            //callback: handler,
            callback: (response) => {
                // debug statement
                //alert(score.site.name + ": " + request.responseText.length + " (" + request.status + ")");
                //alert(request.responseText);

                // update value
                if (response.status === 200) {
                    var esriJsonPerser = new OpenLayers.Format.JSON();
                    esriJsonPerser.extractAttributes = true;
                    var parsedResponse = esriJsonPerser.read(response.responseText);


                    if (parsedResponse && parsedResponse.results) {
                        if (parsedResponse.results.length > 0) {
                            var allText = "";
                            var lastText = null;
                            var count: number = 0;

                            for (var i = 0; i < parsedResponse.results.length; i++) {
                                //var newText = parsedResponse.results[i].layerName +
                                //     ": " + parsedResponse.results[i].value;
                                var newText = parsedResponse.results[i].value;
                                var type = parsedResponse.results[i].attributes['Feature Type'];
                                var code = parsedResponse.results[i].attributes['SMA Code'];

                                if (type && type != "Null" && newText.indexOf(type) < 0) {
                                    newText += " (" + type + ")";
                                } else if (code && code != "Null" && newText.indexOf(code) < 0) {
                                    newText += " (" + code + ")";
                                }
                                if (newText != lastText) {
                                    if (lastText != null) {
                                        allText += ", \n";
                                    }
                                    allText += newText;
                                    count++;
                                }
                                lastText = newText;
                            }

                            // display a cute little properties window describing our doodle here.
                            //Note: this works only as well as our windowing scheme, which is to say poorly
                            //Ext.create('MainApp.view.Window', {
                            //    title: parsedResponse.results[0].layerName +
                            //        " - " + parsedResponse.results[0].attributes["Object ID"],
                            //    closeAction: "destroy",
                            //    items: [
                            //        Ext.create('Ext.grid.property.Grid', {
                            //            width: 300,
                            //            startEditing: Ext.emptyFn, //TODO: don't let them edit...
                            //            source: parsedResponse.results[0].attributes,
                            //        }),
                            //    ],
                            //}).show();

                            score.popupMessage = allText;
                            score.updateValue(count); // number of overlapping features
                        } else {
                            score.popupMessage = "None";
                            score.updateValue(0);
                        }
                    } else {
                        score.popupMessage = "Parse error";
                        score.updateValue(Number.NaN);
                    }
                } else {
                    score.popupMessage = "Error " + response.status;
                    score.updateValue(Number.NaN);
                }
            },
        });
    }

    //declare var Ext: any; //So we can use it
}