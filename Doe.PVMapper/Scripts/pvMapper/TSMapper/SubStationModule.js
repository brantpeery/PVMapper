/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />

//Substation Module fetching data from OSM and calculating the nearest distance


//Conversion Function 

var osm2geo = function (osm) {
    // Check wether the argument is a Jquery object and act accordingly
    // Assuming it as a raw server response for now
    var $xml = jQuery(osm);
    // Initialize the empty GeoJSON object
    var geo = {
        "type": "FeatureCollection",
        "features": []
    };
    // setting the bounding box [minX,minY,maxX,maxY]; x -> long, y -> lat
    function getBounds(bounds) {
        var bbox = new Array;
        bbox.push(parseFloat(bounds.attr("minlon")));
        bbox.push(parseFloat(bounds.attr("minlat")));
        bbox.push(parseFloat(bounds.attr("maxlon")));
        bbox.push(parseFloat(bounds.attr("maxlat")));
        return bbox;
    }
    geo["bbox"] = getBounds($xml.find("bounds"));

    // Function to set props for a feature
    function setProps(element) {
        var properties = {};
        var tags = $(element).find("tag");
        tags.each(function (index, tag) {
            properties[$(tag).attr("k")] = $(tag).attr("v");
        });
        return properties;
    }
    // Generic function to create a feature of given type
    function getFeature(element, type) {
        return {
            "geometry": {
                "type": type,
                "coordinates": []
            },
            "type": "Feature",
            "properties": setProps(element)
        };
    }
    // Ways
    var $ways = $("way", $xml);
    $ways.each(function (index, ele) {
        var feature = new Object;
        // List all the nodes
        var nodes = $(ele).find("nd");
        // If first and last nd are same, then its a polygon
        if ($(nodes).last().attr("ref") === $(nodes).first().attr("ref")) {
            feature = getFeature(ele, "Polygon");
            feature.geometry.coordinates.push([]);
        } else {
            feature = getFeature(ele, "LineString");
        }
        nodes.each(function (index, nd) {
            var node = $xml.find("node[id='" + $(nd).attr("ref") + "']"); // find the node with id ref'ed in way
            var cords = [parseFloat(node.attr("lon")), parseFloat(node.attr("lat"))]; // get the lat,lon of the node
            // If polygon push it inside the cords[[]]
            if (feature.geometry.type === "Polygon") {
                feature.geometry.coordinates[0].push(cords);
            }// if just Line push inside cords[]
            else {
                feature.geometry.coordinates.push(cords);
            }
        });
        // Save the LineString in the Main object
        geo.features.push(feature);
    });

    // Points (POI)
    var $points = $("node:has('tag')", $xml);
    $points.each(function (index, ele) {
        var feature = getFeature(ele, "Point");
        feature.geometry.coordinates.push(parseFloat($(ele).attr('lon')));
        feature.geometry.coordinates.push(parseFloat($(ele).attr('lat')));
        // Save the point in Main object
        geo.features.push(feature);
    });
    // Finally return the GeoJSON object
    return geo;

};

var BYUModules;
(function (BYUModules) {
    var configProperties = {
        maxSearchDistanceInKM: 100
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
            source: configProperties,
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
                minimumVoltage: 'minimum voltage ',
                maximumVoltage: 'maximum voltage '
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


    var SubStationModule = (function () {
        function SubStationModule() {
            var _this = this;
            var myModule = new pvMapper.Module({

                id: "SubStationModule",
                author: "Rohit Khattar, BYU",
                version: "0.1",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        showConfigWindow: function () {
                            myToolLine = this;
                            propsWindow.show();
                        },
                        title: "Nearest Substation",
                        description: "Distance from a site boundary to the nearest known substation, using data from Open Street Map",
                        category: "Transmission Availability",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
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

        SubStationModule.prototype.updateScore = function (score) {
            updateScore(score);
        }

        return SubStationModule;
    })();

    var modinstance = new SubStationModule();

    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)


    function updateScore(score) {
        var maxSearchDistanceInMeters = configProperties.maxSearchDistanceInKM * 1000;
        var SubStationQueryUrl = "http://overpass.osm.rambler.ru/cgi/interpreter";
        var bbox = new OpenLayers.Bounds(score.site.geometry.bounds.left - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.bottom - maxSearchDistanceInMeters - 1000, score.site.geometry.bounds.right + maxSearchDistanceInMeters + 1000, score.site.geometry.bounds.top + maxSearchDistanceInMeters + 1000);
        bbox = bbox.toArray();
        for (var i = 0; i < 4; i++) {
            bbox[i] = bbox[i] / 100000;
        }
        bbox = new OpenLayers.Bounds.fromArray(bbox).toBBOX(6, true);


        // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
        var request = OpenLayers.Request.GET({
            url: SubStationQueryUrl,
            params: {
                data: "way[power=sub_station](" + bbox + ");(._;>;);out;"
            },
            callback: function (response) {
                if (response.status == 200) {
                    response = osm2geo(response.responseText);

                    //Conversion of response
                    for (var i = 0; i < response.features.length; i++) {

                        var cood = response.features[i].geometry.coordinates[0];
                        for (var j = 0; j < cood.length; j++) {

                            var ele = cood[j];

                            ele[0] = ele[0] * 100000;
                            ele[1] = ele[1] * 100000;
                        }
                    }

                    var closestFeature = null;
                    var minDistance = maxSearchDistanceInMeters;

                    var parser = new OpenLayers.Format.GeoJSON();
                    // response = parser.parseGeometry(response);


                    if (response.features) {
                        for (var i = 0; i < response.features.length; i++) {

                            var distance = score.site.geometry.distanceTo(parser.parseGeometry(response.features[i].geometry));
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestFeature = response.features[i];
                            }
                        }
                    }
                    if (closestFeature !== null) {
                        var name = "nearest"
                        if (closestFeature.properties.name) {
                            name = closestFeature.properties.name;
                        }
                        score.popupMessage = (minDistance / 1000).toFixed(1) + " km to " + name + " substation";
                        score.updateValue(minDistance / 1000);
                    } else {
                        score.popupMessage = "No substation found within " + configProperties.maxSearchDistanceInKM + " km";
                        score.updateValue(configProperties.maxSearchDistanceInKM);
                    }
                } else {
                    score.popupMessage = "Request error " + response.error.toString();
                    score.updateValue(Number.NaN);
                }
            }
        });


    }
})(BYUModules || (BYUModules = {}));
