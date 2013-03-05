var INLModules;
(function (INLModules) {
    var IrradianceModule = (function () {
        function IrradianceModule() {
            var myModule = new pvMapper.Module({
                id: "IrradianceModule",
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
                        title: "Direct-Normal Irradiation",
                        description: "Calculates the expected DNI for a site",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            updateScoreFromLayer(score, "swera:dni_suny_high_900913");
                        },
                        updateScoreCallback: function (score) {
                            updateScoreFromLayer(score, "swera:dni_suny_high_900913");
                        }
                    }, 
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Global-Horizontal Irradiation",
                        description: "Calculates the expected GHI for a site",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, score) {
                            updateScoreFromLayer(score, "swera:ghi_suny_high_900913");
                        },
                        updateScoreCallback: function (score) {
                            updateScoreFromLayer(score, "swera:ghi_suny_high_900913");
                        }
                    }
                ],
                infoTools: null
            });
        }
        return IrradianceModule;
    })();    
    var modinstance = new IrradianceModule();
    var MapsDbUrl = "http://mapsdb.nrel.gov/geoserver/swera/wms";
    var dniSuny, ghiSuny;
    function addAllMaps() {
        dniSuny = addMapsDbMap("swera:dni_suny_high_900913", "Direct-Normal Irradiation 10km");
        pvMapper.map.addLayer(dniSuny);
        ghiSuny = addMapsDbMap("swera:ghi_suny_high_900913", "Global-Horizontal Irradiation 10km");
        pvMapper.map.addLayer(ghiSuny);
    }
    function addMapsDbMap(name, description) {
        var newLayer = new OpenLayers.Layer.WMS(description, MapsDbUrl, {
            layers: name,
            transparent: "true",
            format: "image/png",
            exceptions: "application/vnd.ogc.se_inimage",
            maxResolution: 156543.0339,
            srs: "EPSG:900913"
        }, {
            isBaseLayer: false
        });
        newLayer.setOpacity(0.3);
        newLayer.setVisibility(false);
        return newLayer;
    }
    function removeAllMaps() {
        pvMapper.map.removeLayer(dniSuny, false);
        pvMapper.map.removeLayer(ghiSuny, false);
    }
    function updateScoreFromLayer(score, layerName) {
        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.se_xml",
            BBOX: score.site.geometry.bounds.toBBOX(6, false),
            SERVICE: "WMS",
            INFO_FORMAT: "application/vnd.ogc.gml",
            QUERY_LAYERS: layerName,
            FEATURE_COUNT: 50,
            Layers: layerName,
            WIDTH: 1,
            HEIGHT: 1,
            format: "image/gif",
            srs: dniSuny.params.SRS,
            VERSION: "1.1.1",
            X: 0,
            Y: 0,
            I: 0,
            J: 0
        };
        var request = OpenLayers.Request.GET({
            url: MapsDbUrl,
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: queryResponseHandler(score)
        });
    }
    function queryResponseHandler(score) {
        return function (response) {
            try  {
                if(response.status === 200) {
                    var gmlParser = new OpenLayers.Format.GML();
                    gmlParser.extractAttributes = true;
                    var features = gmlParser.read(response.responseText);
                    if(typeof features !== "undefined") {
                        var sum = 0.0;
                        for(var i = 0; i < features.length; i++) {
                            sum += parseFloat(features[i].attributes.annual);
                        }
                        var result = sum / features.length;
                        score.popupMessage = result.toFixed(3);
                        score.updateValue(result);
                    } else {
                        score.popupMessage = "No irradiance data found near this site";
                        score.updateValue(Number.NaN);
                    }
                } else if(response.status === 500) {
                    score.popupMessage = "Proxy connection error";
                    score.updateValue(Number.NaN);
                } else {
                    score.popupMessage = "Connection error " + response.status;
                    score.updateValue(Number.NaN);
                }
            } catch (err) {
                score.popupMessage = "Error";
                score.updateValue(Number.NaN);
            }
        };
    }
})(INLModules || (INLModules = {}));
