var BYUModules;
(function (BYUModules) {
    var WildernessModule = (function () {
        function WildernessModule() {
            var _this = this;
            this.WildernessMapUrl = "";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "WildernessModule",
                author: "Darian Ramage",
                version: "0.1.ts",
                activate: function () {
                    _this.addMap();
                },
                deactivate: function () {
                    _this.removeMap();
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
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            minValue: 10,
                            maxValue: 0
                        }
                    }
                ],
                infoTools: null
            });
        }
        WildernessModule.prototype.addMap = function () {
            this.wildernessLayer = OpenLayers.Layer.WMS("Wilderness Areas", "https://geoserver.byu.edu/geoserver/wms?", {
                request: "GetMap",
                bbox: this.landBounds,
                layer_type: "polygon",
                transparent: "true",
                format: "image/gif",
                exceptions: "application/vnd.ogc.se_inimage",
                srs: "EPSG:42105"
            }, {
                isBaseLayer: false
            });
            pvMapper.map.addLayer(this.wildernessLayer);
        };
        WildernessModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.wildernessLayer, false);
        };
        WildernessModule.prototype.updateScore = function (score) {
            var params = {
                service: "WFS",
                version: "2.0.0",
                request: "GetFeature",
                typename: "PVMapper:Double",
                propertyName: "wilderness",
                outputformat: "JSON",
                bbox: score.site.geometry.bounds
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
        };
        return WildernessModule;
    })();
    BYUModules.WildernessModule = WildernessModule;    
    var modInstance = new BYUModules.WildernessModule();
})(BYUModules || (BYUModules = {}));
