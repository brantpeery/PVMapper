var BYUModules;
(function (BYUModules) {
    var WildernessModule = (function () {
        function WildernessModule() {
            var _this = this;
            this.WildernessRestUrl = "https://geoserver.byu.edu/arcgis/rest/services/Layers/nat_parks/MapServer/";
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
                        title: "Wilderness",
                        description: "Tells whether the given site is in a wilderness area.  ",
                        category: "Land Use",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            functionArgs: {
                            },
                            functionName: "linear"
                        }
                    }
                ],
                infoTools: null
            });
        }
        WildernessModule.prototype.addMap = function () {
            this.wildernessLayer = OpenLayers.Layer.WMS("Wilderness Areas", this.WildernessRestUrl + "export", {
                f: "json",
                layers: "show: 0",
                transparent: true
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
                mapExtent: score.site.geometry.bounds,
                geometryType: "esriGeometryPolygon",
                geometry: score.site.geometry,
                f: "json",
                layers: "all",
                tolerance: 0,
                imageDisplay: "1, 1, 96",
                returnGeometry: false
            };
            var request = OpenLayers.Request.GET({
                url: this.WildernessRestUrl + "identify",
                proxy: "/Proxy/proxy.ashx?",
                params: params,
                callback: function (response) {
                    if(response.status == 200) {
                        var esriJsonParser = new OpenLayers.Format.JSON();
                        esriJsonParser.extractAttributes = true;
                        var parsedResponse = esriJsonParser.read(response.responseText);
                        console.log("Wilderness Module Response: " + response.responseText);
                        if(parsedResponse && parsedResponse.results) {
                            if(parsedResponse.results.length > 0) {
                                score.popupMessage = parsedResponse.results[0].value;
                                score.updateValue(parsedResponse.results);
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
