var INLModules;
(function (INLModules) {
    var IrradianceModule = (function () {
        function IrradianceModule() {
            var myModule = new pvMapper.Module({
                id: "SnlModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                activate: function () {
                    addAllMaps();
                },
                deactivate: function () {
                    removeAllMaps();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Distance to powerline tool",
                        description: "Calculates a site score",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            updateScore(score);
                        },
                        updateScoreCallback: function (score) {
                            updateScore(score);
                        }
                    }
                ],
                infoTools: null
            });
        }
        return IrradianceModule;
    })();    
    var modinstance = new IrradianceModule();
    var snlLineQueryUrl = "http://maps.snl.com/arcgis/rest/services/SNLMaps/Power/MapServer/5/query";
    var mapLayer;
    function addAllMaps() {
        mapLayer = new OpenLayers.Layer.Vector("Transmission Lines", {
            strategies: [
                new OpenLayers.Strategy.Fixed()
            ],
            protocol: new OpenLayers.Protocol.Script({
                url: snlLineQueryUrl,
                params: {
                    f: "json",
                    where: "Line_Name NOT LIKE '%\\N%'",
                    outFields: "Voltage"
                },
                format: new OpenLayers.Format.EsriGeoJSON(),
                parseFeatures: function (data) {
                    return this.format.read(data);
                }
            })
        });
        mapLayer.setOpacity(0.3);
        mapLayer.epsgOverride = "EPSG:3857";
        pvMapper.map.addLayer(mapLayer);
    }
    function removeAllMaps() {
        pvMapper.map.removeLayer(mapLayer, false);
    }
    function updateScore(score) {
    }
})(INLModules || (INLModules = {}));
