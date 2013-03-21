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
                id: "SnlModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",

                activate: () => {
                    addAllMaps();
                },
                deactivate: () => {
                    removeAllMaps();
                },
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Nearest Transmission Line",
                    description: "Calculates the distance to the nearest known transmission line",
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score) {
                        updateScore(score);
                        //s.updateValue(status.toString());
                    },
                    updateScoreCallback: (score: pvMapper.Score) => {
                        //var status = getFeatureInfo(site);
                        updateScore(score);
                    },
                }],

                infoTools: null
            });
        }
    }

    var modinstance = new IrradianceModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    var snlWmsBaseUrl = "https://maps.snl.com/arcgis/services/SNLMaps/PowerCos/MapServer/";
    //var snlRestBaseUrl = "https://maps.snl.com/arcgis/rest/services/SNLMaps/Power/MapServer/";
    //var snlLineQueryUrl = "https://maps.snl.com/arcgis/rest/services/SNLMaps/PowerCos/MapServer/2/query";
    var snlLineQueryUrl = "https://maps.snl.com/arcgis/rest/services/SNLMaps/Power/MapServer/5/query";

    //declare var Ext: any;

    var mapLayer: any;

    function addAllMaps() {

        //mapLayer = new OpenLayers.Layer.Vector(
        //    "Transmission Lines",
        //    {
        //        strategies: [new OpenLayers.Strategy.Fixed()],
        //        protocol: new OpenLayers.Protocol.Script({
        //            url: snlLineQueryUrl,
        //            params: {
        //                f: "json",
        //                //Note: this is stupid. ONE of the lines has an unescaped '\' character in its name. Bad ESRI.
        //                where: "Line_Name NOT LIKE '%\\N%'", //"1=1",
        //                outFields: "Voltage",
        //                //layers: "5", //"2", //solar.params.LAYERS,
        //                //callbackKey: "callback",
        //                //transparent: "true",
        //                //srs: "EPSG:3857",
        //            },
        //            format: new OpenLayers.Format.EsriGeoJSON(),
        //            parseFeatures: function(data) {
        //                return this.format.read(data);
        //            }
        //        }),
        //        //srs: "EPSG:3857",
        //    }
        //);

        mapLayer = new OpenLayers.Layer.WMS(
            "Power Lines",
            snlWmsBaseUrl + "WMSServer",
            {
                layers: "5", //"swera:ghi_suny_high_900913", //"0", //"perezANN_mod",
                //layer_type: "polygon",
                transparent: "true",
                format: "image/png",
                //exceptions: "application/vnd.ogc.se_inimage",
                //maxResolution: 156543.0339,
                srs: "EPSG:3857",
            },
            { isBaseLayer: false }
        );

        //mapLayer = new OpenLayers.Layer.ArcGIS93Rest(
        //    "Transmission Lines",
        //    snlRestBaseUrl + "export",
        //    {
        //        layers: "5", //"2",
        //        format: "gif",
        //        srs: "3857", //"102100",
        //        transparent: "true",
        //    }
        //);

        mapLayer.setOpacity(0.3);
        mapLayer.epsgOverride = "EPSG:3857"; //"3857"; //"EPSG:102100";
        mapLayer.setVisibility(false);
        pvMapper.map.addLayer(mapLayer);
        //pvMapper.map.setLayerIndex(mapLayer, 0);
    }

    function removeAllMaps() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    function updateScore(score: pvMapper.Score) {
        var maxSearchDistanceInMeters: number = (20 * 1000);
        var minimumVoltage: number = 230; //Note: common voltages include 230, 345, 500, 765

        // use a genuine JSONP request, rathern than a plain old GET request routed through the proxy.
        var jsonpProtocol = new OpenLayers.Protocol.Script({
            url: snlLineQueryUrl,
            params: {
                f: "json",
                //Note: this is stupid. ONE of the lines has an unescaped '\' character in its name. Bad ESRI.
                where: "Voltage >= " + minimumVoltage + "AND Line_Name NOT LIKE '%\\N%'", //"1=1",
                outFields: "*", //"Voltage",
                //returnGeometry: false,
                geometryType: "esriGeometryEnvelope",
                //TODO: scaling is problematic - should use a constant-size search window
                geometry: new OpenLayers.Bounds(
                    score.site.geometry.bounds.left - maxSearchDistanceInMeters,
                    score.site.geometry.bounds.bottom - maxSearchDistanceInMeters,
                    score.site.geometry.bounds.right + maxSearchDistanceInMeters,
                    score.site.geometry.bounds.top + maxSearchDistanceInMeters)
                    .toBBOX(0, false),
            },
            format: new OpenLayers.Format.EsriGeoJSON(),
            parseFeatures: function (data) {
                return this.format.read(data);
            },
            callback: (response: OpenLayers.Response) => {
                //alert("Nearby features: " + response.features.length);
                if (response.success()) {
                    var closestFeature = null;
                    var minDistance: number = maxSearchDistanceInMeters;

                    if (response.features) {
                        for (var i = 0; i < response.features.length; i++) {
                            var distance: number = score.site.geometry.distanceTo(response.features[i].geometry);
                            var voltage: number = response.features[i].attributes.Voltage;
                            if (distance < minDistance && voltage >= minimumVoltage) {
                                minDistance = distance;
                                closestFeature = response.features[i];
                            }
                        }
                    }
                    if (closestFeature !== null) {
                        score.popupMessage = (minDistance / 1000).toFixed(1) + " km to " +
                            closestFeature.attributes.Voltage + " kV line operated by " +
                            closestFeature.attributes.Company;
                        score.updateValue(response.features.length);
                    } else {
                        score.popupMessage = "No " + minimumVoltage + " kV line found within "
                             + maxSearchDistanceInMeters / 1000 + " km";
                        score.updateValue(Number.NaN);
                    }
                } else {
                    score.popupMessage = "Request error " + response.error.toString();
                    score.updateValue(Number.NaN);
                }
            },
        });

        var response: OpenLayers.Protocol.Response = jsonpProtocol.read();

        //var params = {
        //    mapExtent: score.site.geometry.bounds.toBBOX(6, false),
        //    geometryType: "esriGeometryEnvelope",
        //    geometry: score.site.geometry.bounds.toBBOX(6, false),
        //    f: "json", // or "html",
        //    layers: "all:5", //"2", //solar.params.LAYERS,
        //    tolerance: 0, //TODO: should this be 0 or 1?
        //    //imageDisplay: "1, 1, 96",
        //    callbackKey: "callback",
        //};

        //var request = OpenLayers.Protocol.Script({
        //    url: snlRestBaseUrl //+ "identify",
        //    //params: params,
        //    //callback: (request) => {
        //    //    // debug statement
        //    //    //alert(score.site.name + ": " + request.responseText.length + " (" + request.status + ")");
        //    //    alert(request);

        //    //    // update value
        //    //    //if (request.status === 200) {
        //    //    //    score.popupMessage = null;
        //    //    //    score.updateValue(request.responseText.length);
        //    //    //} else {
        //    //    //    score.popupMessage = "Error " + request.status;
        //    //    //    score.updateValue(Number.NaN);
        //    //    //}
        //    //},
        //});

        //var request = OpenLayers.Request.GET({
        //    //url: "/Proxy/proxy.ashx?" + solarmapperRestBaseUrl + "identify",
        //    url: snlRestBaseUrl + "identify",
        //    proxy: "/Proxy/proxy.ashx?",
        //    params: params,
        //    //callback: handler,
        //    callback: (request) => {
        //        // debug statement
        //        //alert(score.site.name + ": " + request.responseText.length + " (" + request.status + ")");
        //        //alert(request.responseText);

        //        // update value
        //        if (request.status === 200) {
        //            score.popupMessage = null;
        //            score.updateValue(request.responseText.length);
        //        } else {
        //            score.popupMessage = "Error " + request.status;
        //            score.updateValue(Number.NaN);
        //        }
        //    },
        //});
    }


}