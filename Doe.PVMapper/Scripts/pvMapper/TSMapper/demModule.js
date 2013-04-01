/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />
var BYUModules;
(function (BYUModules) {
    var DemModule = (function () {
        function DemModule() {
            var myModule = new pvMapper.Module({
                id: "DemModule",
                author: "Darian Ramage, BYU",
                version: "0.1.ts",
                activate: function () {
                    addMap();
                },
                deactivate: function () {
                    removeMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Slope",
                        description: "Calculates the average slope of the site",
                        category: "Geography",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            updateScore(score, "any:3", "degrees");
                        },
                        updateScoreCallback: //TODO: is this degrees?
                        function (score) {
                            updateScore(score, "any:3", "degrees");
                        },
                        scoreUtilityOptions: // or maybe it's grade?
                        //TODO: The utility of slope only makes sense in the context of aspect - merge these two metrics
                        // for now, flatter is better...?
                        {
                            functionName: "linear",
                            minValue: 10,
                            maxValue: 0
                        }
                    }, 
                    //defaultWeight: 10
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Aspect",
                        description: "Calculates the average aspect of the site",
                        category: "Geography",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            updateScore(score, "any:4", "degrees");
                        },
                        updateScoreCallback: //TODO: is this degrees?
                        function (score) {
                            updateScore(score, "any:4", "degrees");
                        },
                        scoreUtilityOptions: // it's not radian.
                        //TODO: should we translate the aspect score into a "degrees away from south" score, or something?
                        //      I assume that south is the best...
                        //TODO: The utility of aspect only makes sense in the context of slope - merge these two metrics
                        // for now, south is better, but north ain't so bad...?
                        {
                            functionName: "linear3pt",
                            p0: {
                                x: 0,
                                y: 0.5
                            },
                            p1: {
                                x: 180,
                                y: 1
                            },
                            p2: {
                                x: 360,
                                y: 0.5
                            }
                        }
                    }, 
                    //defaultWeight: 10
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Elevation",
                        description: "Calculates the averate elevation of the site",
                        category: "Geography",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            updateScore(score, "any:1", "m");
                        },
                        updateScoreCallback: function (score) {
                            updateScore(score, "any:1", "m");
                        },
                        scoreUtilityOptions: //Note: I have no idea why, but the server will not find the correct layer if we don't include "any:"
                        // higher is better, but not much better, yeah?
                        {
                            functionName: "linear3pt",
                            p0: {
                                x: 0,
                                y: 0.5
                            },
                            p1: {
                                x: 1000,
                                y: 0.9
                            },
                            p2: {
                                x: 6000,
                                y: 1
                            }
                        }
                    }
                ],
                infoTools: //defaultWeight: 10
                null
            });
        }
        return DemModule;
    })();    
    var modInstance = new DemModule();
    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    var topoMapRestUrl = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/";
    var topoMapLayer;
    function addMap() {
        topoMapLayer = new OpenLayers.Layer.ArcGIS93Rest("World Topography", topoMapRestUrl + "export", {
            layers: "visible",
            format: //"2",
            "gif",
            srs: "3857"
        }, //"102100",
        //transparent: "true",
        {
            isBaseLayer: true
        });
        //Note: this looks awful as an overlay - let's use it as a base layer, as nature intended
        //topoMapLayer.setOpacity(0.3);
        topoMapLayer.epsgOverride = "3857"//"102100";
        ;
        topoMapLayer.setVisibility(false);
        pvMapper.map.addLayer(topoMapLayer);
    }
    function removeMap() {
        pvMapper.map.removeLayer(topoMapLayer, false);
    }
    function updateScore(score, layers, description) {
        var params = {
            mapExtent: score.site.geometry.bounds.toBBOX(6, false),
            geometryType: "esriGeometryEnvelope",
            geometry: score.site.geometry.bounds.toBBOX(6, false),
            f: "json",
            layers: layers,
            tolerance: 0,
            imageDisplay: "1, 1, 96",
            returnGeometry: false
        };
        var request = OpenLayers.Request.GET({
            url: topoMapRestUrl + "identify",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: function (response) {
                // update value
                if(response.status === 200) {
                    var esriJsonPerser = new OpenLayers.Format.JSON();
                    esriJsonPerser.extractAttributes = true;
                    var parsedResponse = esriJsonPerser.read(response.responseText);
                    if(parsedResponse && parsedResponse.results) {
                        if(parsedResponse.results.length > 0) {
                            console.assert(parsedResponse.results.length === 1, "I expected that the server would only return identify" + " results for the single pixel at the center of a site; boy, was I ever wrong.");
                            score.popupMessage = parsedResponse.results[0].value + " " + description;
                            score.updateValue(parseFloat(parsedResponse.results[0].value));
                        } else {
                            score.popupMessage = "No data for this site";
                            score.updateValue(Number.NaN);
                        }
                    } else {
                        score.popupMessage = "Parse error";
                        score.updateValue(Number.NaN);
                    }
                } else {
                    score.popupMessage = "Error " + response.status;
                    score.updateValue(Number.NaN);
                }
            }
        });
    }
})(BYUModules || (BYUModules = {}));
