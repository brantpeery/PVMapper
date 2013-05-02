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
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: {
                                minValue: 10,
                                maxValue: 0
                            }
                        }
                    }, 
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
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: {
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
                        }
                    }, 
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
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: {
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
                    }
                ],
                infoTools: null
            });
        }
        return DemModule;
    })();    
    var modInstance = new DemModule();
    var topoMapRestUrl = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/";
    var topoMapLayer;
    function addMap() {
        topoMapLayer = new OpenLayers.Layer.ArcGIS93Rest("World Topography", topoMapRestUrl + "export", {
            layers: "visible",
            format: "gif",
            srs: "3857"
        }, {
            isBaseLayer: true
        });
        topoMapLayer.epsgOverride = "3857";
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
                if(response.status === 200) {
                    var esriJsonPerser = new OpenLayers.Format.JSON();
                    esriJsonPerser.extractAttributes = true;
                    var parsedResponse = esriJsonPerser.read(response.responseText);
                    if(parsedResponse && parsedResponse.results) {
                        if(parsedResponse.results.length > 0) {
                            if(console) {
                                console.assert(parsedResponse.results.length === 1, "I expected that the server would only return identify" + " results for the single pixel at the center of a site; boy, was I ever wrong.");
                            }
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
