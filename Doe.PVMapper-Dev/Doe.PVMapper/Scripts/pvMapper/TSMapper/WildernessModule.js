/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var BYUModules;
(function (BYUModules) {
    var WildernessModule = (function () {
        function WildernessModule() {
            var myModule = new pvMapper.Module({
                id: "WildernessModule",
                author: "Darian Ramage",
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
                        title: "Wilderness",
                        description: "Tells whether the given site is in a wilderness area.  ",
                        category: "Land Use",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                        },
                        scoreUtilityOptions: {
                        }
                    }
                ],
                infoTools: null
            });
        }
        return WildernessModule;
    })();
    BYUModules.WildernessModule = WildernessModule;    
    var modInstance = new WildernessModule();
    var WildernessMapUrl = "";
    var wildernessLayer;
    function addMap() {
        wildernessLayer = OpenLayers.Layer.WMS("Wilderness Areas", "https://geoserver.byu.edu/geoserver/wms?", {
            layer_type: "polygon",
            transparent: "true",
            format: "image/gif",
            srs: "EPSG:42105"
        }, {
            isBaseLayer: false
        });
        pvMapper.map.addLayer(wildernessLayer);
    }
    function removeMap() {
        pvMapper.map.removeLayer(wildernessLayer, false);
    }
    function updateScore(score, layers, description) {
        var params = {
            mapExtent: score.site.geometry.bounds.toBBOX(6, false),
            geometryType: "esriGeometryEnvelope",
            geometry: score.site.geometry.bounds.toBBOX(6, false),
            f: "json",
            service: "WCS",
            version: "1.1.1",
            request: "GetCoverage",
            layers: "PVMapper:wilderness_areas",
            returnGeometry: false
        };
        var request = OpenLayers.Request.GET({
            url: "https://geoserver.byu.edu/geoserver/wcs?",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: function (response) {
                if(response.status == 200) {
                    var esriJsonParser = new OpenLayers.Format.JSON();
                    esriJsonParser.extractAttributes = true;
                    var parsedResponse = esriJsonParser.read(response.responseText);
                    if(parsedResponse && parsedResponse.results) {
                        if(parsedResponse.results.length > 0) {
                            console.assert(parsedResponse.results.length === 1, "I expected that the server would only return identify" + " results for the single pixel at the center of a site. Something went wrong.");
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
//@ sourceMappingURL=WildernessModule.js.map
