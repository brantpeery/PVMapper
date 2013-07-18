/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />


module INLModules {

    var maxSearchDistanceInMeters: number = (30 * 1000); // 30 km - enough?

    class SnlModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "SnlModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",

                activate: () => {
                    addAllMaps();
                },
                deactivate: () => {
                    removeAllMaps();
                },
                destroy: null,
                init: null,

                scoringTools: [<pvMapper.IScoreTool>{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Nearest Transmission Line",
                    description: "Distance from a site boundary to the nearest known transmission line, using data from SNL",
                    category: "Transmission Availability",
                    onScoreAdded: (e, score: pvMapper.Score) => {
                    },
                    onSiteChange: function (e, score) {
                        updateScore(score);
                    },

                    // having any nearby line is much better than having no nearby line, so let's reflect that.
                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs:
                        new pvMapper.ThreePointUtilityArgs(0, 1, (maxSearchDistanceInMeters -1), 0.3, maxSearchDistanceInMeters,0, "km")
                    },                                                                                                                   
                    weight: 10
                }],

                infoTools: null
            });
        }
    }

    var modinstance = new SnlModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    var snlLineExportUrl = "https://maps.snl.com/arcgis/rest/services/SNLMaps/Power/MapServer/export"
    var snlLineQueryUrl = "https://maps.snl.com/arcgis/rest/services/SNLMaps/Power/MapServer/5/query";

    //declare var Ext: any;

    var mapLayer: any;

    function addAllMaps() {
        mapLayer = new OpenLayers.Layer.ArcGIS93Rest(
                "Power Lines",
                snlLineExportUrl,
                {
                    layers: "show:5", //"show:2",
                    format: "gif",
                    srs: "3857", //"102100",
                    transparent: "true",
                }//,{ isBaseLayer: false }
                );
        mapLayer.setOpacity(0.3);
        mapLayer.epsgOverride = "3857"; //"EPSG:102100";
        mapLayer.setVisibility(false);

        pvMapper.map.addLayer(mapLayer);
        //pvMapper.map.setLayerIndex(mapLayer, 0);
    }

    function removeAllMaps() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    function updateScore(score: pvMapper.Score) {
        var minimumVoltage: number = 230; //Note: common voltages include 230, 345, 500, 765

        // use a genuine JSONP request, rathern than a plain old GET request routed through the proxy.
        var jsonpProtocol = new OpenLayers.Protocol.Script(<any>{
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
                        score.updateValue(minDistance);
                    } else {
                        score.popupMessage = "No " + minimumVoltage + " kV line found within "
                             + maxSearchDistanceInMeters / 1000 + " km";
                        score.updateValue(maxSearchDistanceInMeters);
                    }
                } else {
                    score.popupMessage = "Request error " + response.error.toString();
                    score.updateValue(Number.NaN);
                }
            },
        });

        var response: OpenLayers.Response = jsonpProtocol.read();
    }


}