/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="ScoreUtility.ts" />
var INLModules;
(function (INLModules) {
    var surveyResults = {
        
        residential: [
            { mi: 0, percentOk: 4.868154158 },
            { mi: 0.001136364, percentOk: 5.070993915 },
            { mi: 0.003787879, percentOk: 5.273833671 },
            { mi: 0.005681818, percentOk: 5.476673428 },
            { mi: 0.009469697, percentOk: 5.679513185 },
            { mi: 0.018939394, percentOk: 6.490872211 },
            { mi: 0.028409091, percentOk: 6.693711968 },
            { mi: 0.056818182, percentOk: 7.505070994 },
            { mi: 0.075757576, percentOk: 7.910750507 },
            { mi: 0.09469697, percentOk: 8.519269777 },
            { mi: 0.170454546, percentOk: 8.722109533 },
            { mi: 0.189393939, percentOk: 9.736308316 },
            { mi: 0.227272727, percentOk: 9.939148073 },
            { mi: 0.25, percentOk: 12.1703854 },
            { mi: 0.284090909, percentOk: 12.37322515 },
            { mi: 0.473484849, percentOk: 12.57606491 },
            { mi: 0.5, percentOk: 16.22718053 },
            { mi: 0.568181818, percentOk: 16.43002028 },
            { mi: 1, percentOk: 36.71399594 },
            { mi: 2, percentOk: 42.19066937 },
            { mi: 2.8, percentOk: 42.39350913 },
            { mi: 3, percentOk: 45.63894523 },
            { mi: 4, percentOk: 46.85598377 },
            { mi: 5, percentOk: 65.11156187 },
            { mi: 6, percentOk: 65.51724138 },
            { mi: 7, percentOk: 66.32860041 },
            { mi: 8, percentOk: 68.15415822 },
            { mi: 10, percentOk: 75.65922921 },
            { mi: 12, percentOk: 75.86206897 },
            { mi: 15, percentOk: 78.4989858 },
            { mi: 17, percentOk: 78.70182556 },
            { mi: 18.64113577, percentOk: 78.90466531 },
            { mi: 20, percentOk: 86.40973631 },
            { mi: 21, percentOk: 86.61257606 },
            { mi: 25, percentOk: 89.85801217 },
            { mi: 30, percentOk: 91.07505071 },
            { mi: 35, percentOk: 91.48073022 },
            { mi: 45, percentOk: 91.68356998 },
            { mi: 50, percentOk: 96.75456389 },
            { mi: 60, percentOk: 97.16024341 },
            { mi: 100, percentOk: 98.5801217 },
            { mi: 120, percentOk: 98.78296146 },
            { mi: 200, percentOk: 98.98580122 },
            { mi: 250, percentOk: 99.39148073 },
            { mi: 400, percentOk: 99.59432049 },
            { mi: 500, percentOk: 99.79716024 },
            { mi: 5000, percentOk: 100 }
        ],
        historic: [
            { mi: 0, percentOk: 4.60251046 },
            { mi: 0.018939394, percentOk: 5.648535565 },
            { mi: 0.028409091, percentOk: 6.276150628 },
            { mi: 0.056818182, percentOk: 6.485355649 },
            { mi: 0.075757576, percentOk: 6.694560669 },
            { mi: 0.09469697, percentOk: 7.322175732 },
            { mi: 0.170454546, percentOk: 7.740585774 },
            { mi: 0.189393939, percentOk: 8.786610879 },
            { mi: 0.227272727, percentOk: 8.9958159 },
            { mi: 0.25, percentOk: 10.46025105 },
            { mi: 0.284090909, percentOk: 10.66945607 },
            { mi: 0.473484849, percentOk: 10.87866109 },
            { mi: 0.5, percentOk: 12.34309623 },
            { mi: 0.568181818, percentOk: 12.76150628 },
            { mi: 1, percentOk: 26.15062762 },
            { mi: 1.4, percentOk: 26.35983264 },
            { mi: 1.5, percentOk: 26.56903766 },
            { mi: 2, percentOk: 34.93723849 },
            { mi: 3, percentOk: 40.79497908 },
            { mi: 4, percentOk: 42.88702929 },
            { mi: 5, percentOk: 57.53138075 },
            { mi: 6, percentOk: 58.15899582 },
            { mi: 7, percentOk: 58.36820084 },
            { mi: 8, percentOk: 60.041841 },
            { mi: 9, percentOk: 60.25104603 },
            { mi: 10, percentOk: 73.64016736 },
            { mi: 14.2, percentOk: 73.84937238 },
            { mi: 15, percentOk: 77.40585774 },
            { mi: 20, percentOk: 83.26359833 },
            { mi: 25, percentOk: 85.14644351 },
            { mi: 30, percentOk: 88.07531381 },
            { mi: 35, percentOk: 88.49372385 },
            { mi: 40, percentOk: 88.91213389 },
            { mi: 45, percentOk: 89.12133891 },
            { mi: 50, percentOk: 94.76987448 },
            { mi: 60, percentOk: 95.18828452 },
            { mi: 70, percentOk: 95.39748954 },
            { mi: 75, percentOk: 95.81589958 },
            { mi: 80, percentOk: 96.0251046 },
            { mi: 100, percentOk: 98.11715481 },
            { mi: 120, percentOk: 98.32635983 },
            { mi: 200, percentOk: 98.74476987 },
            { mi: 250, percentOk: 98.9539749 },
            { mi: 300, percentOk: 99.16317992 },
            { mi: 500, percentOk: 99.37238494 },
            { mi: 1000, percentOk: 99.79079498 },
            { mi: 5000, percentOk: 100 }
        ],
        recreational: [
            { mi: 0, percentOk: 4.90797546 },
            { mi: 0.003787879, percentOk: 5.112474438 },
            { mi: 0.005681818, percentOk: 5.316973415 },
            { mi: 0.018939394, percentOk: 6.134969325 },
            { mi: 0.028409091, percentOk: 6.339468303 },
            { mi: 0.056818182, percentOk: 6.54396728 },
            { mi: 0.09469697, percentOk: 7.157464213 },
            { mi: 0.113636364, percentOk: 7.566462168 },
            { mi: 0.170454546, percentOk: 7.770961145 },
            { mi: 0.189393939, percentOk: 8.588957055 },
            { mi: 0.25, percentOk: 9.81595092 },
            { mi: 0.473484849, percentOk: 10.0204499 },
            { mi: 0.5, percentOk: 12.26993865 },
            { mi: 0.568181818, percentOk: 12.67893661 },
            { mi: 1, percentOk: 22.29038855 },
            { mi: 1.5, percentOk: 22.49488753 },
            { mi: 2, percentOk: 30.26584867 },
            { mi: 3, percentOk: 34.15132924 },
            { mi: 4, percentOk: 35.78732106 },
            { mi: 5, percentOk: 53.37423313 },
            { mi: 6, percentOk: 54.39672802 },
            { mi: 7, percentOk: 54.80572597 },
            { mi: 8, percentOk: 56.64621677 },
            { mi: 9.5, percentOk: 56.85071575 },
            { mi: 10, percentOk: 68.71165644 },
            { mi: 12.42742384, percentOk: 68.91615542 },
            { mi: 15, percentOk: 72.18813906 },
            { mi: 20, percentOk: 78.52760736 },
            { mi: 25, percentOk: 81.39059305 },
            { mi: 30, percentOk: 85.68507157 },
            { mi: 35, percentOk: 85.88957055 },
            { mi: 40, percentOk: 87.32106339 },
            { mi: 45, percentOk: 87.93456033 },
            { mi: 50, percentOk: 93.04703476 },
            { mi: 59, percentOk: 93.25153374 },
            { mi: 60, percentOk: 93.6605317 },
            { mi: 70, percentOk: 94.06952965 },
            { mi: 75, percentOk: 94.47852761 },
            { mi: 80, percentOk: 94.68302658 },
            { mi: 100, percentOk: 98.1595092 },
            { mi: 120, percentOk: 98.36400818 },
            { mi: 200, percentOk: 98.97750511 },
            { mi: 500, percentOk: 99.18200409 },
            { mi: 1000, percentOk: 99.79550102 },
            { mi: 5000, percentOk: 100 }
        ]
    };

    //var initialSearchDistanceInMi = 5;
    //var maxSearchDistanceInMi = 5000;

    // cache for features we've found from which we can find a nearest feature.
    var nearestFeatureCache = {};

    var OpenStreetMapSocialHistoricModule = (function () {
        function OpenStreetMapSocialHistoricModule() {
            var myModule = new pvMapper.Module({
                id: "OpenStreetMapSocialModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",
                activate: function () {
                    addAllMaps();
                },
                deactivate: function () {
                    removeAllMaps();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    //Note: Residential social tool removed until we can find better quality map data for it (at least include city boundaries... or something?).
                    //{
                    //    activate: null,
                    //    deactivate: null,
                    //    destroy: null,
                    //    init: null,
                    //    //showConfigWindow: function () {
                    //    //    myToolLine = this; // fetch tool line, which was passed as 'this' parameter
                    //    //    propsWindow.show();
                    //    //},
                    //    title: "Residential Proximity",
                    //    category: "Social Acceptance",
                    //    description: "Percentage of survey respondents who reported this distance from residential areas as acceptable",
                    //    longDescription: '',
                    //    //onScoreAdded: function (e, score: pvMapper.Score) {
                    //    //    scores.push(score);
                    //    //},
                    //    onSiteChange: function (e, score) {
                    //        updateScore(score, '"landuse"="residential"', 'residential', 'a residential area');
                    //    },
                    //    scoreUtilityOptions: {
                    //        functionName: "linear3pt",
                    //        functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor")
                    //    },
                    //    weight: 10
                    //},
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        //showConfigWindow: function () {
                        //    myToolLine = this; // fetch tool line, which was passed as 'this' parameter
                        //    propsWindow.show();
                        //},
                        title:OpenStreetMapSocialHistoricModule.title,// "Historic Proximity",
                        category: OpenStreetMapSocialHistoricModule.category, //"Social Acceptance",
                        description: OpenStreetMapSocialHistoricModule.description, //"Percentage of survey respondents who reported this distance from cultural or historic landmarks as acceptable",
                        longDescription: OpenStreetMapSocialHistoricModule.longDescription, //'<p>This tool calculates the distance from a site to the nearest historic area, and then reports the percentage of survey respondents who said that distance was acceptable.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 477 respondents from six counties in Southern California answered Question 16 which asked "How much buffer distance is acceptable between a large solar facility and an area of cultural or historical importance?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest historic area is identified using OpenStreetMap. All map features using the "historic" key are considered. The accuracy of OSM data is limited by its contributors, and classification of historic or cultural sites may be highly subjective. See the OSM Wiki for more information (wiki.openstreetmap.org/wiki/Historic).</p>',
                        //onScoreAdded: function (e, score: pvMapper.Score) {
                        //    scores.push(score);
                        //},
                        onSiteChange: function (e, score) {
                            updateScore(score, '"historic"', 'historic', 'a historic landmark');
                        },
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor", "Percent Favor", "Score", "Preference for percentage of respondents regard to historical landmarks.")
                        },
                        weight: 10
                    }],
                infoTools: null
            });
            this.getModuleObj = function () { return myModule; }
        }
        //Add these so ModuleManager can access the tool information for display in the Tool/Module Selector and make it easier to register onto the moduleManager.
        OpenStreetMapSocialHistoricModule.title = "Historic Proximity";
        OpenStreetMapSocialHistoricModule.category = "Social Acceptance";
        OpenStreetMapSocialHistoricModule.description = "Percentage of survey respondents who reported this distance from cultural or historic landmarks as acceptable";
        OpenStreetMapSocialHistoricModule.longDescription = '<p>This tool calculates the distance from a site to the nearest historic area, and then reports the percentage of survey respondents who said that distance was acceptable.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 477 respondents from six counties in Southern California answered Question 16 which asked "How much buffer distance is acceptable between a large solar facility and an area of cultural or historical importance?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest historic area is identified using OpenStreetMap. All map features using the "historic" key are considered. The accuracy of OSM data is limited by its contributors, and classification of historic or cultural sites may be highly subjective. See the OSM Wiki for more information (wiki.openstreetmap.org/wiki/Historic).</p>';

        return OpenStreetMapSocialHistoricModule;
    })();


    var OpenStreetMapSocialRecreationalModule = (function () {
        function OpenStreetMapSocialRecreationalModule() {
            var myModule = new pvMapper.Module({
                id: "OpenStreetMapSocialModule",
                author: "Scott Brown, INL",
                version: "0.1.ts",
                iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/home_icon.jpg",
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
                        //showConfigWindow: function () {
                        //    myToolLine = this; // fetch tool line, which was passed as 'this' parameter
                        //    propsWindow.show();
                        //},
                        title: OpenStreetMapSocialRecreationalModule.title, //"Recreational Proximity",
                        category: OpenStreetMapSocialRecreationalModule.category, //"Social Acceptance",
                        description: OpenStreetMapSocialRecreationalModule.description, //"Percentage of survey respondents who reported this distance from recreational areas as acceptable",
                        longDescription: OpenStreetMapSocialRecreationalModule.longDescription,//'<p>This tool calculates the distance from a site to the nearest recreational area, and then reports the percentage of survey respondents who said that distance was acceptable.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 488 respondents from six counties in Southern California answered Question 19 which asked "How much buffer distance is acceptable between a large solar facility and recreation areas such as hunting, fishing, or hiking locations?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest historic area is identified using OpenStreetMap. All map features using the "leisure" key are considered. The accuracy of OSM data is limited by its contributors. See the OSM Wiki for more information (wiki.openstreetmap.org/wiki/Key:leisure).</p>',
                        //onScoreAdded: function (e, score: pvMapper.Score) {
                        //    scores.push(score);
                        //},
                        onSiteChange: function (e, score) {
                            updateScore(score, '"leisure"', 'recreational', 'a recreational area');
                        },
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.4, 30, 0.8, 100, 1, "% in favor", "Percent Favor", "Score", "We don't want our favorite picnic spot blocks by panels.")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
            this.getModuleObj = function () { return myModule; }
        }
        OpenStreetMapSocialRecreationalModule.title = "Recreational Proximity";
        OpenStreetMapSocialRecreationalModule.category = "Social Acceptance";
        OpenStreetMapSocialRecreationalModule.description = "Percentage of survey respondents who reported this distance from recreational areas as acceptable";
        OpenStreetMapSocialRecreationalModule.longDescription = '<p>This tool calculates the distance from a site to the nearest recreational area, and then reports the percentage of survey respondents who said that distance was acceptable.</p><p>The survey used in this tool was administered by the PVMapper project in 2013. From this survey, 488 respondents from six counties in Southern California answered Question 19 which asked "How much buffer distance is acceptable between a large solar facility and recreation areas such as hunting, fishing, or hiking locations?" For full details, see "PVMapper: Report on the Second Public Opinion Survey" (INL/EXT-13-30706).</p><p>The nearest historic area is identified using OpenStreetMap. All map features using the "leisure" key are considered. The accuracy of OSM data is limited by its contributors. See the OSM Wiki for more information (wiki.openstreetmap.org/wiki/Key:leisure).</p>';
        return OpenStreetMapSocialRecreationalModule;
    })();



    //All private functions and variables go here. They will be accessible only to this module because of the AEAF (Auto-Executing Anonomous Function)

    var mapLayer = null;

    function addAllMaps() {
    }

    function removeAllMaps() {
        if (mapLayer !== null) {
            pvMapper.map.removeLayer(mapLayer, false);
            mapLayer = null;
        }
    }


    // projections we'll need...
    var projWGS84 = new OpenLayers.Projection("EPSG:4326");
    var proj900913 = new OpenLayers.Projection("EPSG:900913");


    function updateScore(score, wayQueryKey, objectType, objectTypeDescription) {
        nearestFeatureCache[objectType] = nearestFeatureCache[objectType] || {};

        if (typeof nearestFeatureCache[objectType][score.site.id] === 'undefined') {
            updateScoreFromOSM(score, 10, wayQueryKey, objectType, objectTypeDescription);
        } else {
            updateScoreFromCache(score, objectType, objectTypeDescription)
        }
    }

    function updateScoreFromOSM(score, searchDistanceInMi, wayQueryKey, objectType, objectTypeDescription) {
        var searchDistanceInMeters = searchDistanceInMi * 1609.34;

        //Note: we add a fudge buffer around the bounds, just in case
        //TODO: trim these... I think 1.25 may be larger than necessary.
        var bounds = new OpenLayers.Bounds(
            score.site.geometry.bounds.left - (searchDistanceInMeters * 1.25),
            score.site.geometry.bounds.bottom - (searchDistanceInMeters * 1.25),
            score.site.geometry.bounds.right + (searchDistanceInMeters * 1.25),
            score.site.geometry.bounds.top + (searchDistanceInMeters * 1.25));
        var bbox = bounds.transform(proj900913, projWGS84).toBBOX(6, true);

        var OpenStreetMapQueryUrl = "http://overpass.osm.rambler.ru/cgi/interpreter";


        // use a genuine JSONP request, rather than a plain old GET request routed through the proxy.
        var request = OpenLayers.Request.GET({
            url: OpenStreetMapQueryUrl,
            params: {
                data: 'way[' + wayQueryKey + '](' + bbox + ');(._;>;);out;'
            },
            callback: function (response) {
                if (response.status == 200) {
                    response.features = OpenLayers.Format.OSM.prototype.read(response.responseText);
                    var featuresInRange = [];

                    if (response.features) {
                        var closestFeature = null;
                        var minDistance = searchDistanceInMeters;

                        for (var i = 0; i < response.features.length; i++) {
                            // change all geometries into points transformed into our native projection
                            response.features[i].geometry = response.features[i].geometry.transform(projWGS84, proj900913);

                            // calculate distance, cache features within the search distance, and find the closest feature
                            response.features[i].distance = score.site.geometry.distanceTo(response.features[i].geometry, { edge: false });

                            if (response.features[i].distance < searchDistanceInMeters) {
                                featuresInRange.push(response.features[i]);

                                if (response.features[i].distance < minDistance) {
                                    minDistance = response.features[i].distance;
                                    closestFeature = response.features[i];
                                }
                            }
                        }

                        if (console) { console.log("  OSMSocialModule: " + featuresInRange.length + " of " + response.features.length + " " + objectType + " features within " + searchDistanceInMi + "mi."); }

                        if (closestFeature !== null && featuresInRange.length > 0) {
                            //TODO: there is a known issue that sometimes this can return a feature which isn't the nearest if the nearest
                            //      feature wasn't in the bounding box requested (the bounding box isn't a distance buffer of the site poly).
                            nearestFeatureCache[objectType][score.site.id] = featuresInRange;
                            updateScoreWithFeature(score, closestFeature, minDistance, objectType, objectTypeDescription);

                            return; // success
                        }
                    }

                    // if we've reached here, there were no features in range
                    if (searchDistanceInMi <= 10 /* < 5000*/) { //TODO: //HACK: quick change to only search 10 miles and 50 miles... fix this later on...!
                        // didn't find the features we're looking for - run the query again with a larger search area.
                        updateScoreFromOSM(score, searchDistanceInMi * 5, wayQueryKey, objectType, objectTypeDescription);
                    } else {
                        nearestFeatureCache[objectType][score.site.id] = [];
                        updateScoreWithFeature(score, null, searchDistanceInMeters, objectType, objectTypeDescription);
                    }
                } else {
                    score.popupMessage = "Error " + response.status + " " + response.statusText;
                    score.updateValue(Number.NaN);
                }
            }
        });
    }


    function updateScoreFromCache(score, objectType, objectTypeDescription) {
        var features = nearestFeatureCache[objectType][score.site.id];

        var closestFeature = null;
        var minDistance = 5000 * 1609.34;

        if (features) {
            for (var i = 0; i < features.length; i++) {
                var distance = score.site.geometry.distanceTo(features[i].geometry, { edge: false });
                if (distance < minDistance) {
                    minDistance = distance;
                    closestFeature = features[i];
                }
            }

            updateScoreWithFeature(score, closestFeature, minDistance, objectType, objectTypeDescription);
        } else {
            updateScoreWithFeature(score, null, 5000 * 1609.34, objectType, objectTypeDescription);
        }
    }

    function updateScoreWithFeature(score, closestFeature, distanceInMeters, objectType, objectTypeDescription) {
        if (closestFeature !== null) {
            var minDistanceInMi = distanceInMeters * 0.000621371;
            //lastDistanceCache[score.site.id] = minDistanceInMi;

            var percentOk = 0;
            var distanceOk = 5000;
            for (var i = surveyResults[objectType].length - 1; i--; i >= 0) {
                if (minDistanceInMi >= surveyResults[objectType][i].mi) {
                    percentOk = surveyResults[objectType][i].percentOk;
                    distanceOk = surveyResults[objectType][i].mi;
                    break;
                }
            }

            var distanceOkStr = (distanceOk < 1) ? distanceOk.toFixed(2) : (distanceOk < 10) ? distanceOk.toFixed(1) : distanceOk.toFixed(0);

            var minDistanceStr = (minDistanceInMi < 1) ? minDistanceInMi.toFixed(2) : (minDistanceInMi < 10) ? minDistanceInMi.toFixed(1) : minDistanceInMi.toFixed(0);

            //score.popupMessage = minDistanceStr + " mi to " +
            //    parseFloat(closestFeature.attributes['ACRES']).toFixed(1) + " acres of " +
            //    closestFeature.attributes['WETLAND_TYPE'] + "; " +
            //    percentOk.toFixed(1) + "% of respondents reported they would accept " +
            //    distanceOkStr + " mi or more.";
            //score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept " +
            //    distanceOkStr + " mi or more; " + score.site.name + " is " +
            //    minDistanceStr + " mi from " +
            //    parseFloat(closestFeature.attributes['ACRES']).toFixed(1) + " acres of " +
            //    closestFeature.attributes['WETLAND_TYPE'];
            //score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site " +
            //    minDistanceStr + " mi from a " +
            //    closestFeature.attributes['WETLAND_TYPE'] + "agriculture";
            //score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept this proximity. (site " +
            //    score.site.name + " is " + minDistanceStr + " mi from a " +
            //    closestFeature.attributes['WETLAND_TYPE'] + ")";
            score.popupMessage = percentOk.toFixed(1) + "% of respondents reported they would accept a site built " +
                distanceOkStr + " mi or more from " + objectTypeDescription +
                ". (There is " + objectTypeDescription + " " + minDistanceStr + " mi away" + 
                (closestFeature.attributes.name ? (" named " + closestFeature.attributes.name + ".)") : ".)");

            score.updateValue(percentOk);
        } else {
            // no agriculture found in max search distance, so 100% of respondants are Ok with this.
            //score.popupMessage = "over 5000 mi to any agriculture; 100% of respondents reported they would accept this distance.";
            //score.popupMessage = "100% of respondents reported they would accept this proximity. (site " +
            //    score.site.name + " is over 5000 mi from any agriculture)";

            //score.popupMessage = "100% of respondents reported they would accept a site built over 5000 mi from " + objectTypeDescription +
            //    ". (Didn't find " + objectTypeDescription + " within 5000 mi.)";

            score.popupMessage = "Didn't find " + objectTypeDescription + " within 50 mi.";

            score.updateValue(Number.NaN);
        }
        this.getModuleObj = function () { return myModule; }
    }

    INLModules.OpenStreetMapSocialHistoricModule = OpenStreetMapSocialHistoricModule;
    INLModules.OpenStreetMapSocialRecreationalModule = OpenStreetMapSocialRecreationalModule;
    //var modinstance = new OpenStreetMapSocialHistoricModule();
    //var modinstance = new OpenStreetMapSocialRecreationalModule();

})(INLModules || (INLModules = {}));

if (typeof (selfUrl) == 'undefined')
    var selfUrl = $('script[src$="OSMSocialModule.js"]').attr('src');
if (typeof (isActive) == 'undefined')
    var isActive = true;
pvMapper.moduleManager.registerModule(INLModules.OpenStreetMapSocialHistoricModule.category, INLModules.OpenStreetMapSocialHistoricModule.title, INLModules.OpenStreetMapSocialHistoricModule, isActive, selfUrl);
pvMapper.moduleManager.registerModule(INLModules.OpenStreetMapSocialRecreationalModule.category, INLModules.OpenStreetMapSocialRecreationalModule.title, INLModules.OpenStreetMapSocialRecreationalModule, isActive, selfUrl);
