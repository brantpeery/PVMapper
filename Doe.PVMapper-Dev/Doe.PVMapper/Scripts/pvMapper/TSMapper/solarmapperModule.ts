/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />

module INLModules {
    class IrradianceModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "SolarmapperModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",

                activate: () => {
                    addMapLayer();
                },
                deactivate: () => {
                    removeMapLayer();
                },
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Solarmapper tool",
                    description: "Calculates a site score",
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score) {
                        identifyFeature(score);
                        //s.updateValue(status.toString());
                    },
                    updateScoreCallback: (score: pvMapper.Score) => {
                        //var status = getFeatureInfo(site);
                        identifyFeature(score);
                    },
                }],

                infoTools: null
            });
        }
    }

    var modinstance = new IrradianceModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    var solarmapperRestBaseUrl = "http://solarmapper.anl.gov/ArcGIS/rest/services/Solar_Mapper_SDE/MapServer/";

    //declare var Ext: any;

    var mapLayer: any;

    function addMapLayer() {
        mapLayer = new OpenLayers.Layer.ArcGIS93Rest(
                "Land Management Group",
                solarmapperRestBaseUrl + "export",
                {
                    layers: "72", //"show:2",
                    format: "gif",
                    srs: "3857", //"102100",
                    transparent: "true",
                }
                );
        mapLayer.setOpacity(0.3);
        mapLayer.epsgOverride = "3857"; //"EPSG:102100";
        mapLayer.setVisibility(false);
        pvMapper.map.addLayer(mapLayer);
        //pvMapper.map.setLayerIndex(mapLayer, 0);
    }

    function removeMapLayer() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    function identifyFeature(score: pvMapper.Score) {
        var params = {
            mapExtent: score.site.geometry.bounds.toBBOX(6, false),
            geometryType: "esriGeometryEnvelope",
            geometry: score.site.geometry.bounds.toBBOX(6, false),
            f: "json", // or "html",
            layers: "72", //"perezANN_mod", //solar.params.LAYERS,
            tolerance: 0, //TODO: should this be 0 or 1?
            imageDisplay: "1, 1, 96",
        };

        var request = OpenLayers.Request.GET({
            //url: "/Proxy/proxy.ashx?" + solarmapperRestBaseUrl + "identify",
            url: solarmapperRestBaseUrl + "identify",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            //callback: handler,
            callback: (request) => {
                // debug statement
                //alert(score.site.name + ": " + request.responseText.length + " (" + request.status + ")");
                //alert(request.responseText);

                // update value
                if (request.status === 200) {
                    score.popupMessage = null;
                    score.updateValue(request.responseText.length);
                } else {
                    score.popupMessage = "Connection error " + request.status;
                    score.updateValue(Number.NaN);
                }
            },
        });
    }


}