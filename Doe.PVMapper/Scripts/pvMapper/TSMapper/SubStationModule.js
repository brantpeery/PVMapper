/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />

//Substation Module fetching data from OSM and calculating the nearest distance


var BYUModules;
(function (BYUModules) {
    var configProperties = {
        maxSearchDistanceInKM: 30
    }

    var lineConfigProperties = {
        minimumVoltage: 230, //Note: common voltages include 230, 345, 500, 765
        maximumVoltage: 765,

        onlyKnownVoltages: false,
    };

    var myToolLine;

    var propsWindow;

    Ext.onReady(function () {
        var comboConfig = {
            allowBlank: false,
            displayField: 'display',
            valueField: 'value',
            store: {
                fields: ['display', 'value'],
                data: [
                    { 'display': '230 kV', 'value': 230 },
                    { 'display': '345 kV', 'value': 345 },
                    { 'display': '500 kV', 'value': 500 },
                    { 'display': '768 kV', 'value': 765 }
                ]
            },
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true
        };

        var propsGrid = new Ext.grid.PropertyGrid({
            nameText: 'Properties Grid',
            minWidth: 300,
            source: lineConfigProperties,
            customRenderers: {
                maxSearchDistanceInKM: function (v) {
                    return v + " km";
                },
                minimumVoltage: function (v) {
                    return v + " kV";
                },
                maximumVoltage: function (v) {
                    return v + " kV";
                }
            },
            propertyNames: {
                maxSearchDistanceInKM: "search distance",
                minimumVoltage: 'minimum voltage',
                maximumVoltage: 'maximum voltage',
                onlyKnownVoltages: 'known kV only'
            },
            customEditors: {
                'minimumVoltage': new Ext.form.ComboBox(comboConfig),
                'maximumVoltage': new Ext.form.ComboBox(comboConfig)
            }
        });
        propsWindow = Ext.create('Ext.window.Window', {
            title: "Configure Nearest Substation Tool",
            closeAction: "hide",
            layout: "fit",
            items: [
                propsGrid
            ],
            listeners: {
                beforehide: function () {
                    //Note: this no longer works on substations, since I changed how updateScore works... might fix it sometime.
                    myToolLine.scores.forEach(function (score) {
                        updateScore(score, '"power"="line"', 'transmission line');
                    });
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

    var substationsMap;

    var SubStationModule = (function () {
        function SubStationModule() {
            var _this = this;
            var myModule = new pvMapper.Module({

                id: "SubStationModule",
                author: "Rohit Khattar, BYU",
                version: "0.1",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",

                activate: function () {
                    //http://t0.beta.itoworld.com/4/317c99f331113b90c57c41ccdb137030/${z}/${x}/${y}.png
                    substationsMap = new OpenLayers.Layer.XYZ("Power Infrastructure",
                        "http://t0.beta.itoworld.com/4/317c99f331113b90c57c41ccdb137030/${z}/${x}/${y}.png",
                            { transitionEffect: null, buffer: 1, sphericalMercator: true, isBaseLayer: false, visibility: false });
                    pvMapper.map.addLayer(substationsMap);

                    //addAllMaps();
                },
                deactivate: function() {
                    pvMapper.map.removeLayer(substationsMap, false);
                    //removeAllMaps();
                },
        
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        //Note: this no longer works on substations, since I changed how updateScore works... might fix it sometime.
                        //showConfigWindow: function () {
                        //    myToolLine = this;
                        //    propsWindow.show();
                        //},
                        title: "Nearest Substation",
                        description: "Distance from a site boundary to the center of the nearest known substation, using data from OpenStreetMap",
                        //category: "Transmission Availability",
                        category: "Power Infrastructure",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (e, score) {
                            _this.updateScore(score, '"power"~"sub_station|station"', 'substation');
                        },
                        // having any nearby line is much better than having no nearby line, so let's reflect that.
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, (configProperties.maxSearchDistanceInKM - 1), 0.5, configProperties.maxSearchDistanceInKM, 0.25, "km")
                        },
                        weight: 10
                    },
                    {
                        showConfigWindow: function () {
                            myToolLine = this;
                            propsWindow.show();
                        },
                        title: "Nearest Transmission Line",
                        description: "Distance from a site boundary to the nearest known transmission line, using data from OpenStreetMap",
                        //category: "Transmission Availability",
                        category: "Power Infrastructure",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (e, score) {
                            _this.updateScore(score, '"power"="line"', 'transmission line');
                        },
                        // having any nearby line is much better than having no nearby line, so let's reflect that.
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, (configProperties.maxSearchDistanceInKM - 1), 0.3, configProperties.maxSearchDistanceInKM, 0, "km")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }

        SubStationModule.prototype.updateScore = function (score, wayQueryKey, objectType) {
            updateScore(score, wayQueryKey, objectType);
        }

        return SubStationModule;
    })();

    var modinstance = new SubStationModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    // projections we'll need...
    var projWGS84 = new OpenLayers.Projection("EPSG:4326");
    var proj900913 = new OpenLayers.Projection("EPSG:900913");


    function updateScore(score, wayQueryKey, objectType) {
        var maxSearchDistanceInMeters = configProperties.maxSearchDistanceInKM * 1000;
        var SubStationQueryUrl = "http://overpass.osm.rambler.ru/cgi/interpreter";
        var bounds = new OpenLayers.Bounds(
            score.site.geometry.bounds.left - maxSearchDistanceInMeters - 1000,
            score.site.geometry.bounds.bottom - maxSearchDistanceInMeters - 1000,
            score.site.geometry.bounds.right + maxSearchDistanceInMeters + 1000,
            score.site.geometry.bounds.top + maxSearchDistanceInMeters + 1000);
        var bbox = bounds.transform(proj900913, projWGS84).toBBOX(6, true);


        // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
        var request = OpenLayers.Request.GET({
            url: SubStationQueryUrl,
            params: {
                //Note: some substations are classified as 'sub_station' and some are classified as 'station'
                //see http://wiki.openstreetmap.org/wiki/Key:power
                data: 'way[' + wayQueryKey + '](' + bbox + ');(._;>;);out;'
            },
            callback: function (response) {
                if (response.status == 200) {
                    response.features = OpenLayers.Format.OSM.prototype.read(response.responseText);

                    //Conversion of response
                    for (var i = 0; i < response.features.length; i++) {
                        // change all geometries into points transformed into our native projection
                        response.features[i].geometry = response.features[i].geometry.getCentroid().transform(projWGS84, proj900913);

                        // parse voltage, in case it's a string for some reason...
                        if (typeof response.features[i].attributes.voltage === "string") {
                            response.features[i].attributes.voltage = parseInt(response.features[i].attributes.voltage);
                        }
                    }

                    var closestFeature = null;
                    var minDistance = maxSearchDistanceInMeters;

                    //var parser = new OpenLayers.Format.GeoJSON();
                    // response = parser.parseGeometry(response);


                    if (response.features) {
                        for (var i = 0; i < response.features.length; i++) {
                            var feature = response.features[i];

                            // check line-specific filters (just filtering lines for now...)
                            if (objectType === 'transmission line') {
                                if (!isNaN(feature.attributes.voltage)) {
                                    var convertedVoltage = feature.attributes.voltage / 1000;
                                    if (convertedVoltage < lineConfigProperties.minimumVoltage ||
                                        convertedVoltage > lineConfigProperties.maximumVoltage) {
                                        // voltage is beyond our preset range, so let's skip this line
                                        continue;
                                    }
                                } else if (lineConfigProperties.onlyKnownVoltages) {
                                    // unknown voltage, and we're supposed to skip those, so let's skip those
                                    continue;
                                }
                            }

                            //var distance = score.site.geometry.distanceTo(parser.parseGeometry(response.features[i].geometry));
                            var distance = score.site.geometry.distanceTo(feature.geometry,
                                (objectType === 'transmission line') ? {} : { edge: false }); //HACK: this allows distances of 0 for sites entirely contained within a substation ...!
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestFeature = feature;
                            }
                        }
                    }
                    if (closestFeature !== null) {
                        var name = "nearest"
                        if (closestFeature.attributes.name) {
                            name = closestFeature.attributes.name;
                        }
                        var message = (minDistance / 1000).toFixed(1) + " km to " + name + " " + objectType;

                        if (!isNaN(closestFeature.attributes.voltage)) {
                            message += ", " + (closestFeature.attributes.voltage / 1000).toFixed(0) + " kV";
                        } else {
                            message += ", unknown kV";
                        }

                        if (closestFeature.attributes.operator) {
                            message += ", operated by " + closestFeature.attributes.operator;
                        }

                        message += ".";
                        score.popupMessage = message;
                        score.updateValue(minDistance / 1000);
                    } else {
                        score.popupMessage = "No " + objectType + " found within " + configProperties.maxSearchDistanceInKM + " km";
                        score.updateValue(configProperties.maxSearchDistanceInKM);
                    }
                } else {
                    score.popupMessage = "Error " + response.status + " " + response.statusText;
                    score.updateValue(Number.NaN);
                }
            }
        });


    }
})(BYUModules || (BYUModules = {}));
