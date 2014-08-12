//Substation Module fetching data from OSM and calculating the nearest distance

var BYUModules;
(function (BYUModules) {
    var configProperties = {
        maxSearchDistanceInMi: 25
    }

    var lineConfigProperties = {
        minimumVoltage: 230, //Note: common voltages include 230, 345, 500, 765
        maximumVoltage: 765,

        onlyKnownVoltages: false,
    };

    var myToolLine;

    var propsGrid;
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

        propsGrid = new Ext.grid.PropertyGrid({
            nameText: 'Properties Grid',
            minWidth: 300,
            source: lineConfigProperties,
            customRenderers: {
                maxSearchDistanceInMi: function (v) {
                    return v + " mi";
                },
                minimumVoltage: function (v) {
                    return v + " kV";
                },
                maximumVoltage: function (v) {
                    return v + " kV";
                }
            },
            propertyNames: {
                maxSearchDistanceInMi: "search distance",
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
                    // refresh scores as necessary to accomodate this configuraiton change.
                    myToolLine.scores.forEach(function (score) {
                        score.isValueOld = true;
                        updateScore(score, '"power"="line"', 'transmission line');
                    });

                    // save configuration changes to the browser
                    myToolLine.saveConfiguration();
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

    var NearestSubStationModule = new pvMapper.Module({
        id: "NearestSubStationModule",
        author: "Rohit Khattar, BYU",
        version: "0.1",
        url: selfUrl,

        title: "Nearest Substation",
        category: "Power Infrastructure",
        description: "Distance from a site boundary to the center of the nearest known substation, using data from OpenStreetMap",

        activate: null, // nothing to do here... map added in layers.js
        deactivate: null, // nothing to do here... map added in layers.js

        scoringTools: [{
            //Note: this no longer works on substations, since I changed how updateScore works... might fix it sometime.
            //showConfigWindow: function () {
            //    myToolLine = this;
            //    propsWindow.show();
            //},
            id: "NearestSubStationTool",
            title: "Nearest Substation",
            category: "Power Infrastructure",
            description: "Distance from a site boundary to the center of the nearest known substation, using data from OpenStreetMap",
            longDescription: '<p>This tool reports the distance from a site to the nearest known substation. The substation is identified using OpenStreetMap. All map features using the "power" key with values of "station" and "sub_station" are considered. The accuracy of OSM data is limited by its contributors. See the OSM Wiki for more information (wiki.openstreetmap.org/wiki/Key:power).</p>',
            //onScoreAdded: function (event, score) {
            //},
            onSiteChange: function (e, score) {
                //Note: some substations are classified as 'sub_station' and some are classified as 'station'
                //see http://wiki.openstreetmap.org/wiki/Key:power
                updateScore(score, '"power"~"sub_station|station"', 'substation');
            },
            // having any nearby line is much better than having no nearby line, so let's reflect that.
            scoreUtilityOptions: {
                functionName: "linear3pt",
                functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, 10, 0.9, configProperties.maxSearchDistanceInMi, 0.4,
                    "mi", "Distance to nearest substation", "Prefer sites near a substation. Strongly prefer sites within ten miles of a substation. The minimum possible score is 40, reflecting an assumption that having no nearby substation may not be prohibitive.")
            },
            weight: 10
        }],
    });

    //BYUModules.NearestSubStationModule = NearestSubStationModule;

    var NearestTransmissionLineModule = new pvMapper.Module({
        id: "NearestTransmissionLineModule",
        author: "Rohit Khattar, BYU",
        version: "0.1",
        url: selfUrl,

        title: "Nearest Transmission Line",
        category: "Power Infrastructure",
        description: "Distance from a site boundary to the nearest known transmission line, using data from OpenStreetMap",

        activate: null, // nothing to do here... map added in layers.js
        deactivate: null, // nothing to do here... map added in layers.js

        scoringTools: [{
            showConfigWindow: function () {
                myToolLine = this;
                propsWindow.show();
            },

            id: "NearestTransmissionLineTool",
            title: "Nearest Transmission Line",
            category: "Power Infrastructure",
            description: "Distance from a site boundary to the nearest known transmission line, using data from OpenStreetMap",
            longDescription: '<p>This tool reports the distance from a site to the nearest known transmission line. The line is identified using OpenStreetMap. All map features using the "power" key with a value of "line" are considered. The accuracy of OSM data is limited by its contributors. See the OSM Wiki for more information (wiki.openstreetmap.org/wiki/Key:power).</p>',
            //onScoreAdded: function (event, score) {
            //},
            onSiteChange: function (e, score) {
                updateScore(score, '"power"="line"', 'transmission line');
            },

            getConfig: function () {
                return lineConfigProperties;
            },
            setConfig: function (config) {
                var changed = false;
                if (config.minimumVoltage >= 0 && lineConfigProperties.minimumVoltage != config.minimumVoltage) {
                    lineConfigProperties.minimumVoltage = config.minimumVoltage;
                    changed = true;
                }
                if (config.maximumVoltage >= 0 && lineConfigProperties.maximumVoltage != config.maximumVoltage) {
                    lineConfigProperties.maximumVoltage = config.maximumVoltage;
                    changed = true;
                }
                if (lineConfigProperties.onlyKnownVoltages != config.onlyKnownVoltages) {
                    lineConfigProperties.onlyKnownVoltages = !!config.onlyKnownVoltages;
                    changed = true;
                }

                if (changed) {
                    propsGrid.setSource(lineConfigProperties);

                    // refresh scores as necessary to accomodate this configuraiton change.
                    this.scores.forEach(function (score) {
                        score.isValueOld = true;
                        updateScore(score, '"power"="line"', 'transmission line');
                    });
                }
            },

            // having any nearby line is much better than having no nearby line, so let's reflect that.
            scoreUtilityOptions: {
                functionName: "linear3pt",
                functionArgs: new pvMapper.ThreePointUtilityArgs(0, 1, (configProperties.maxSearchDistanceInMi - 1), 0.4, configProperties.maxSearchDistanceInMi, 0,
                    "mi", "Distance to nearest transmission line", "Prefer sites near suitable transmission lines. Don't consider sites over 24 miles from a transmission line.")
            },
            weight: 10
        }],
    });

    //BYUModules.NearestTransmissionLineModule = NearestTransmissionLineModule;

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    // projections we'll need...
    var projWGS84 = new OpenLayers.Projection("EPSG:4326");
    var proj900913 = new OpenLayers.Projection("EPSG:900913");


    function updateScore(score, wayQueryKey, objectType) {
        var maxSearchDistanceInMeters = configProperties.maxSearchDistanceInMi * 1000;
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
                data: 'way[' + wayQueryKey + '](' + bbox + ');(._;>;);out;'
            },
            callback: function (response) {
                if (response.status === 200) {
                    response.features = OpenLayers.Format.OSM.prototype.read(response.responseText);

                    //Conversion of response
                    for (var i = 0; i < response.features.length; i++) {
                        // transform into our native projection
                        response.features[i].geometry = response.features[i].geometry.transform(projWGS84, proj900913);

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
                        var distanceInFt = minDistance * 3.28084; // convert meters to feet
                        var distanceInMi = minDistance * 0.000621371; // convert meters to miles
                        var distanceString = distanceInMi > 10.0 ? distanceInMi.toFixed(1) + " mi" :
                            distanceInMi > 0.5 ? distanceInMi.toFixed(2) + " mi" :
                            distanceInFt <= 1 ? "0 mi" :
                            distanceInMi.toFixed(2) + " mi (" + distanceInFt.toFixed(0) + " ft)";

                        var name = "nearest"
                        if (closestFeature.attributes.name) {
                            name = closestFeature.attributes.name;
                        }
                        var toNearestString = " to " + name + " " + objectType;

                        if (distanceInFt <= 1) {
                            toNearestString += " (" + objectType + " on site)";
                        }

                        if (!isNaN(closestFeature.attributes.voltage)) {
                            toNearestString += ", " + (closestFeature.attributes.voltage / 1000).toFixed(0) + " kV";
                        } else {
                            toNearestString += ", unknown kV";
                        }

                        if (closestFeature.attributes.operator) {
                            toNearestString += ", operated by " + closestFeature.attributes.operator;
                        }

                        toNearestString += ".";

                        var messageString = distanceString + toNearestString;


                        score.popupMessage = messageString;
                        score.updateValue(distanceInMi);
                    } else {
                        score.popupMessage = "No " + objectType + " found within " + configProperties.maxSearchDistanceInMi + " mi search distance.";
                        score.updateValue(configProperties.maxSearchDistanceInMi);
                    }
                } else {
                    score.popupMessage = "Error " + response.status + " " + response.statusText;
                    score.updateValue(Number.NaN);
                }
            }
        });
    }

    pvMapper.moduleManager.registerModule(NearestSubStationModule, true);
    pvMapper.moduleManager.registerModule(NearestTransmissionLineModule, true);

})(BYUModules || (BYUModules = {}));

