/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var INLModules;
(function (INLModules) {
    var LandUseModule = (function () {
        function LandUseModule() {
            var myModule = new pvMapper.Module({
                id: "LandUseModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    addLandUseMap();
                },
                deactivate: function () {
                    removeLandUseMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Land Uses",
                        description: "Display land use boundaries.",
                        onScoreAdded: function (e, score) {
                        },
                        onSiteChange: function (e, s) {
                            ///////////////////////////////////////////getFeatureInfo(s.site);
                            s.updateValue("Land score");
                        },
                        calculateValueCallback: function (site) {
                            ///////////////////////////////////////////getFeatureInfo(site);
                            return -1;
                        }
                    }
                ],
                infoTools: null
            });
        }
        return LandUseModule;
    })();
    INLModules.LandUseModule = LandUseModule;    
})(INLModules || (INLModules = {}));
var landUseInstance = new INLModules.LandUseModule();
var landUseUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer?";
var landUseLayer;
function addLandUseMap() {
    var landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    landUseLayer = new OpenLayers.Layer.WMS("Land Use", landUseUrl, {
        maxExtent: landBounds,
        layers: "0",
        srs: "EPSG:102113",
        layer_type: "Feature Layer",
        transparent: "true",
        format: "image/gif",
        exceptions: "application/vnd.ogc.se_inimage",
        maxResolution: 156543.0339
    }, {
        isBaseLayer: false
    });
    landUseLayer.arcGisEpsgOverride = true;
    landUseLayer.setOpacity(0.3);
    pvMapper.map.addLayer(landUseLayer);
}
function removeLandUseMap() {
    pvMapper.map.removeLayer(landUseLayer, false);
}
function getLandUseLayerInfo() {
}
//@ sourceMappingURL=LandUseModule.js.map
