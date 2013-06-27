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
                        description: "Overlapping national parks, using data hosted by BYU",
                        category: "Land Use",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 1, "Minimum Wilderness threshold allowed.", "Maximum Wilderness threshold allowed.")
                        },
                        defaultWeight: 10
                    }
                ],
                infoTools: null
            });
        }
        WildernessModule.prototype.addMap = function () {
            this.wildernessLayer = new OpenLayers.Layer.ArcGIS93Rest("Wilderness Areas", this.WildernessRestUrl + "export", {
                format: "gif",
                layers: "show: 0",
                srs: "3857",
                transparent: "true"
            }, {
                isBaseLayer: false
            });
            this.wildernessLayer.setVisibility(false);
            pvMapper.map.addLayer(this.wildernessLayer);
        };
        WildernessModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.wildernessLayer, false);
        };
        WildernessModule.prototype.updateScore = function (score) {
            var toGeoJson = new OpenLayers.Format.GeoJSON();
            var geoJsonObj = toGeoJson.extract.geometry.apply(toGeoJson, [
                score.site.geometry
            ]);
            var toEsriJson = new geoJsonConverter();
            var esriJsonObj = toEsriJson.toEsri(geoJsonObj);
            console.log("Converted Geometry:");
            console.log("Esri Json: " + esriJsonObj);
            var params = {
                mapExtent: score.site.geometry.bounds,
                geometryType: "esriGeometryPolygon",
                geometry: esriJsonObj,
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
                        console.log("geometry: " + esriJsonObj.toString());
                        console.log("geometry bbox: " + score.site.geometry.bounds.toBBOX(6, false));
                        if(parsedResponse && parsedResponse.results) {
                            if(parsedResponse.results.length > 0) {
                                score.popupMessage = parsedResponse.results[0].value;
                                score.updateValue(0);
                            } else {
                                score.popupMessage = "No National Park Overlaps";
                                score.updateValue(1);
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
