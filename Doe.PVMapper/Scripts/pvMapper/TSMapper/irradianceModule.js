var INLModules;
(function (INLModules) {
    var IrradianceModule = (function () {
        function IrradianceModule() {
            var myModule = new pvMapper.Module({
                id: "IrradianceModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                activate: function () {
                    addIrradianceMap();
                },
                deactivate: function () {
                    removeIrradianceMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Solar Irradiance",
                        description: "Calculates the expected solar irradiance for a site",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, s) {
                            getFeatureInfo(s);
                        },
                        updateScoreCallback: function (score) {
                            getFeatureInfo(score);
                        }
                    }
                ],
                infoTools: null
            });
        }
        return IrradianceModule;
    })();    
    var modinstance = new IrradianceModule();
    var irradianceMapUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer?";
    var solar;
    function addIrradianceMap() {
        var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
        solar = new OpenLayers.Layer.WMS("PADUS", irradianceMapUrl, {
            maxExtent: solarBounds,
            layers: "0",
            layer_type: "polygon",
            transparent: "true",
            format: "image/gif",
            exceptions: "application/vnd.ogc.se_inimage",
            maxResolution: 156543.0339,
            srs: "EPSG:102113"
        }, {
            isBaseLayer: false
        });
        solar.setOpacity(0.3);
        solar.epsgOverride = "EPSG:102113";
        pvMapper.map.addLayer(solar);
    }
    function removeIrradianceMap() {
        pvMapper.map.removeLayer(solar, false);
    }
    function getFeatureInfo(score) {
        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: score.site.geometry.bounds.toBBOX(6, false),
            SERVICE: "WMS",
            INFO_FORMAT: 'text/html',
            QUERY_LAYERS: "0",
            FEATURE_COUNT: 50,
            Layers: "0",
            WIDTH: 1,
            HEIGHT: 1,
            format: "image/gif",
            srs: solar.params.SRS,
            VERSION: "1.1.1",
            X: 0,
            Y: 0,
            I: 0,
            J: 0
        };
        var request = OpenLayers.Request.GET({
            url: irradianceMapUrl,
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
        return -1;
    }
    function handler(request) {
        if(request.status === 200) {
            alert(request.responseText);
        } else {
            alert(request.getAllResponseHeaders());
        }
    }
})(INLModules || (INLModules = {}));
