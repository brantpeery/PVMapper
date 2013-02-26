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
                            s.updateValue("rad score");
                        },
                        calculateValueCallback: function (site) {
                            return -1;
                        }
                    }
                ],
                infoTools: null
            });
        }
        return IrradianceModule;
    })();    
    var modinstance = new IrradianceModule();
    var irradianceMapUrl = "http://mapsdb.nrel.gov/jw_router/perezANN_mod/tile";
    var solar;
    function addIrradianceMap() {
        var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
        var solar = new OpenLayers.Layer.WMS("Solar Radiation", irradianceMapUrl, {
            maxExtent: solarBounds,
            layers: "perezANN_mod",
            layer_type: "polygon",
            transparent: "true",
            format: "image/gif",
            exceptions: "application/vnd.ogc.se_inimage",
            maxResolution: 156543.0339
        }, {
            isBaseLayer: false
        });
        solar.setOpacity(0.3);
        pvMapper.map.addLayer(solar);
    }
    function removeIrradianceMap() {
        pvMapper.map.removeLayer(solar, false);
    }
    function getFeatureInfo(site) {
        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: site.geometry.bounds.toBBOX(6, false),
            SERVICE: "WMS",
            INFO_FORMAT: 'text/html',
            QUERY_LAYERS: "perezANN_mod",
            FEATURE_COUNT: 50,
            Layers: "perezANN_mod",
            WIDTH: site.geometry.bounds.getWidth(),
            HEIGHT: site.geometry.bounds.getHeight(),
            format: "image/gif",
            VERSION: "1.1.1",
            X: 0,
            Y: 0
        };
        var request = OpenLayers.Request.GET({
            url: irradianceMapUrl,
            params: params,
            callback: handler
        });
    }
    function handler(request) {
        alert(request.responseXML);
        alert(request.responseText);
        alert(request.status);
        alert(request.getAllResponseHeaders());
    }
})(INLModules || (INLModules = {}));
