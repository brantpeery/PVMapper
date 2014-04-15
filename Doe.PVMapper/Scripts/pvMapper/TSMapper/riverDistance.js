/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />
var BYUModules;
(function (BYUModules) {
    var configProperties = {
        maxSearchDistanceInMi: 15
    };

    var myToolLine;

    var propsWindow;

    Ext.onReady(function () {
        var propsGrid = Ext.create('Ext.grid.property.Grid', {
            nameText: 'Properties Grid',
            minWidth: 300,
            //autoHeight: true,
            source: configProperties,
            customRenderers: {
                maxSearchDistanceInMi: function (v) {
                    return v + " mi";
                }
            },
            propertyNames: {
                maxSearchDistanceInMi: "search distance"
            }
        });

        // display a cute little properties window describing our doodle here.
        //Note: this works only as well as our windowing scheme, which is to say poorly
        //var propsWindow = Ext.create('MainApp.view.Window', {
        propsWindow = Ext.create('Ext.window.Window', {
            title: "Configure Nearest Transmission Line Tool",
            closeAction: "hide",
            layout: "fit",
            items: [
                propsGrid
            ],
            listeners: {
                beforehide: function () {
                    // recalculate all scores
                    myToolLine.scores.forEach(updateScore);
                }
            },
            buttons: [
                {
                    xtype: 'button',
                    text: 'OK',
                    handler: function () {
                        propsWindow.hide();
                    }
                }
            ],
            constrain: true
        });
    });

    var WaterDistanceModule = (function () {
        function WaterDistanceModule() {
            var myModule = new pvMapper.Module({
                id: "Water Distance Module",
                author: "Darian Ramage, BYU",
                version: "0.2.ts",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",
                activate: function () {
                    //addAllMaps();
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
                        showConfigWindow: function () {
                            myToolLine = this;
                            propsWindow.show();
                        },
                        title: "Nearest River",
                        category: "Geography",
                        description: "Distance from the site to the nearest river",
                        longDescription: '<p>This tool reports the distance from a site to the nearest river.</p>',
                        //onScoreAdded: function (e, score: pvMapper.Score) {
                        //    scores.push(score);
                        //},
                        onSiteChange: function (e, score) {
                            updateScore(score);
                        },
                        // having any nearby line is much better than having no nearby line, so let's reflect that.
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, (configProperties.maxSearchDistanceInKM - 1), 0.3, configProperties.maxSearchDistanceInKM, 0, "km", "River Available", "Preference", "Preference of available source of water.")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }
        return WaterDistanceModule;
    })();

    var modinstance = new WaterDistanceModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)
    //var ExportUrl = "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer/export";
    var QueryUrl = "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer/3/query";

    var mapLayer;

    //Note: the river layer was already added as a Reference layer...
    //      As it seems more similar to the other Reference layers than it does to the Tool Data layers,
    //      I chose to leave it there (and comment out this add)
    //function addAllMaps() {
    //    mapLayer = new OpenLayers.Layer.ArcGIS93Rest(
    //        "Rivers",
    //        ExportUrl,
    //        {
    //            layers: "show:3", //"show:2", //TODO
    //            format: "gif",
    //            srs: "3857", //"102100",
    //            transparent: "true",
    //        }//,{ isBaseLayer: false }
    //        );
    //    mapLayer.setOpacity(0.3);
    //    mapLayer.epsgOverride = "3857"; //"EPSG:102100";
    //    mapLayer.setVisibility(false);
    //    pvMapper.map.addLayer(mapLayer);
    //    //pvMapper.map.setLayerIndex(mapLayer, 0);
    //}
    function removeAllMaps() {
        pvMapper.map.removeLayer(mapLayer, false);
    }

    function updateScore(score) {
        var maxSearchDistanceInMeters = configProperties.maxSearchDistanceInMi * 1609.34;

        // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
        var jsonpProtocol = new OpenLayers.Protocol.Script({
            url: QueryUrl,
            params: {
                f: "json",
                //TODO: should request specific out fields, instead of '*' here.
                outFields: "*",
                //returnGeometry: false,
                geometryType: "esriGeometryEnvelope",
                //TODO: scaling is problematic - should use a constant-size search window
                geometry: new OpenLayers.Bounds(score.site.geometry.bounds.left - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.bottom - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.right + maxSearchDistanceInMeters + 1000, score.site.geometry.bounds.top + maxSearchDistanceInMeters + 1000).toBBOX(0, false)
            },
            format: new OpenLayers.Format.EsriGeoJSON(),
            parseFeatures: function (data) {
                return this.format.read(data);
            },
            callback: function (response) {
                if (response.success()) {
                    var closestFeature = null;
                    var minDistance = maxSearchDistanceInMeters;

                    if (response.features) {
                        for (var i = 0; i < response.features.length; i++) {
                            var distance = score.site.geometry.distanceTo(response.features[i].geometry);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestFeature = response.features[i];
                            }
                        }
                    }
                    if (closestFeature !== null) {
                        var distanceInFt = minDistance * 3.28084;
                        var distanceInMi = minDistance * 0.000621371;
                        var distanceString = distanceInMi > 10.0 ? distanceInMi.toFixed(1) + " mi" : distanceInMi > 0.5 ? distanceInMi.toFixed(2) + " mi" : distanceInMi.toFixed(2) + " mi (" + distanceInFt.toFixed(0) + " ft)";

                        var toNearestString = " to " + closestFeature.attributes.PNAME + " river";

                        var messageString = distanceInFt > 1 ? distanceString + toNearestString + "." : "0 mi" + toNearestString + " (river is on site).";

                        score.popupMessage = messageString;
                        score.updateValue(distanceInMi);
                    } else {
                        score.popupMessage = "No rivers found within " + configProperties.maxSearchDistanceInMi + " mi search distance.";
                        score.updateValue(configProperties.maxSearchDistanceInMi);
                    }
                } else {
                    score.popupMessage = "Request error " + response.error.toString();
                    score.updateValue(Number.NaN);
                }
            }
        });

        var response = jsonpProtocol.read();
    }
})(BYUModules || (BYUModules = {}));
