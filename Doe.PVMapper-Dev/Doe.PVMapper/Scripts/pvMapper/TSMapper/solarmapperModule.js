var INLModules;
(function (INLModules) {
    var IrradianceModule = (function () {
        function IrradianceModule() {
            var myModule = new pvMapper.Module({
                id: "SolarmapperModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                activate: function () {
                    addMapLayer();
                },
                deactivate: function () {
                    removeMapLayer();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Solarmapper tool",
                        description: "Calculates a site score",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            identifyFeature(score);
                        },
                        updateScoreCallback: function (score) {
                            identifyFeature(score);
                        }
                    }
                ],
                infoTools: null
            });
        }
        return IrradianceModule;
    })();    
    var modinstance = new IrradianceModule();
    var solarmapperRestBaseUrl = "http://solarmapper.anl.gov/ArcGIS/rest/services/Solar_Mapper_SDE/MapServer/";
    var mapLayer;
    function addMapLayer() {
        mapLayer = new OpenLayers.Layer.ArcGIS93Rest("Land Management Group", solarmapperRestBaseUrl + "export", {
            layers: "72",
            format: "gif",
            srs: "3857",
            transparent: "true"
        });
        mapLayer.setOpacity(0.3);
        mapLayer.epsgOverride = "3857";
        pvMapper.map.addLayer(mapLayer);
    }
    function removeMapLayer() {
        pvMapper.map.removeLayer(mapLayer, false);
    }
    function identifyFeature(score) {
        var params = {
            mapExtent: score.site.geometry.bounds.toBBOX(6, false),
            geometryType: "esriGeometryEnvelope",
            geometry: score.site.geometry.bounds.toBBOX(6, false),
            f: "json",
            layers: "72",
            tolerance: 0,
            imageDisplay: "1, 1, 96"
        };
        var request = OpenLayers.Request.GET({
            url: solarmapperRestBaseUrl + "identify",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: function (request) {
                if(request.status === 200) {
                    score.updateValue(request.responseText.length);
                } else {
                    score.updateValue("Connection error " + request.status);
                }
            }
        });
    }
})(INLModules || (INLModules = {}));
