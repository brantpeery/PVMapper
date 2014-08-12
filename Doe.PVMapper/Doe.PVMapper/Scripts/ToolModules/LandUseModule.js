/// <reference path="../pvmapper/tsmapper/starratinghelper.ts" />
/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/jstorage.d.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="../jquery.d.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var INLModules;
(function (INLModules) {
    

    var ProtectedAreasModule = (function (_super) {
        __extends(ProtectedAreasModule, _super);
        function ProtectedAreasModule() {
            var _this = this;
            _super.call(this);
            this.id = "ProtectedAreasModule";
            this.author = "Leng Vang, INL";
            this.version = "0.1.ts";
            this.url = selfUrl;
            this.title = "Protected Areas";
            this.category = "Land Use";
            this.description = "Overlapping protected areas, found in the PADUS map hosted by gapanalysisprogram.com, using GAP status codes as the default star rating";
            this.starRatingHelper = new pvMapper.StarRatingHelper({
                defaultStarRating: 4,
                noCategoryRating: 5,
                noCategoryLabel: "None"
            });
            //TODO: use more authoratative (and likely better updated) data sources hosted by USGS ?!?
            //http://gis1.usgs.gov/arcgis/rest/services/gap/PADUS_Status/MapServer
            //http://gis1.usgs.gov/arcgis/rest/services/gap/PADUS_Owner/MapServer
            this.federalLandsWmsUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/services/PADUS/PADUS_owner/MapServer/WMSServer";
            this.federalLandsRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/PADUS/PADUS_owner/MapServer/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            this.addMap = function () {
                if (!_this.federalLandsLayer) {
                    _this.federalLandsLayer = new OpenLayers.Layer.WMS("Land Administration", _this.federalLandsWmsUrl, {
                        maxExtent: _this.landBounds,
                        layers: "0",
                        layer_type: "polygon",
                        transparent: "true",
                        format: "image/gif",
                        exceptions: "application/vnd.ogc.se_inimage",
                        maxResolution: 156543.0339,
                        srs: "EPSG:102113"
                    }, { isBaseLayer: false });
                    _this.federalLandsLayer.epsgOverride = "EPSG:102113";
                    _this.federalLandsLayer.setOpacity(0.3);
                    _this.federalLandsLayer.setVisibility(false);
                }
                pvMapper.map.addLayer(_this.federalLandsLayer);
            };
            this.removeMap = function () {
                pvMapper.map.removeLayer(_this.federalLandsLayer, false);
            };
            this.updateScore = function (score) {
                var params = {
                    mapExtent: score.site.geometry.bounds.toBBOX(6, false),
                    geometryType: "esriGeometryEnvelope",
                    geometry: score.site.geometry.bounds.toBBOX(6, false),
                    f: "json",
                    layers: "0",
                    tolerance: 0,
                    imageDisplay: "1, 1, 96",
                    returnGeometry: false
                };

                //console.log("LandUseModule.ts: " + score.site.geometry.bounds.toBBOX(6, false));
                var request = OpenLayers.Request.GET({
                    url: _this.federalLandsRestUrl + "identify",
                    proxy: "/Proxy/proxy.ashx?",
                    params: params,
                    callback: function (response) {
                        // update value
                        if (response.status === 200) {
                            var esriJsonPerser = new OpenLayers.Format.JSON();
                            esriJsonPerser.extractAttributes = true;
                            var parsedResponse = esriJsonPerser.read(response.responseText);

                            if (parsedResponse && parsedResponse.results && parsedResponse.results.length > 0) {
                                var responseArray = [];
                                for (var i = 0; i < parsedResponse.results.length; i++) {
                                    var name = parsedResponse.results[i].attributes["Primary Designation Name"];
                                    var type = parsedResponse.results[i].attributes["Primary Designation Type"];

                                    var owner = parsedResponse.results[i].attributes["Owner Name"];
                                    var manager = parsedResponse.results[i].attributes["Manager Name"];
                                    var gapStatusCode = parseInt(parsedResponse.results[i].attributes["GAP Status Code"], 10);

                                    var newText = "";

                                    // use name if we can; use type otherwise
                                    if (name && name != "Null" && isNaN(parseFloat(name))) {
                                        // some of the names start with a number - skip those
                                        newText += name;
                                    } else if (type && type != "Null") {
                                        newText += type;
                                    }

                                    // use manager if we can; use owner otherwise
                                    if (manager && manager != "Null") {
                                        newText += (newText) ? ": " + manager : manager;
                                    } else if (owner && owner != "Null") {
                                        newText += (newText) ? ": " + owner : owner;
                                    }

                                    // add this to the array of responses we've received
                                    if (responseArray.indexOf(newText) < 0) {
                                        responseArray.push(newText);
                                    }

                                    // if we have a valid gap status code, and no current star rating,
                                    // then let's go ahead and use the gap status code as the star rating.
                                    // (gap status codes defined: http://www.gap.uidaho.edu/padus/gap_iucn.html)
                                    if (typeof _this.starRatingHelper.starRatings[newText] === "undefined" && !isNaN(gapStatusCode) && gapStatusCode > 0 && gapStatusCode <= 5) {
                                        _this.starRatingHelper.starRatings[newText] = gapStatusCode;
                                    }
                                }

                                // use the combined rating string, and its lowest rating value
                                var combinedText = _this.starRatingHelper.sortRatableArray(responseArray);
                                score.popupMessage = combinedText;
                                score.updateValue(_this.starRatingHelper.starRatings[responseArray[0]]);
                            } else {
                                // use the no category label, and its current star rating
                                if (console && console.assert)
                                    console.assert(typeof (_this.starRatingHelper.starRatings) !== "undefined");

                                score.popupMessage = _this.starRatingHelper.options.noCategoryLabel;
                                score.updateValue(_this.starRatingHelper.starRatings[_this.starRatingHelper.options.noCategoryLabel]);
                            }
                        } else {
                            score.popupMessage = "Error " + response.status + " " + response.statusText;
                            score.updateValue(Number.NaN);
                        }
                    }
                });
            };

            var thisModule = this;
            this.init({
                activate: null,
                deactivate: null,
                scoringTools: [{
                        activate: function () {
                            _this.addMap();
                        },
                        deactivate: function () {
                            _this.removeMap();
                        },
                        id: "ProtectedAreasTool",
                        title: "Land Administration",
                        category: "Land Use",
                        description: "Land administration and conservation, found in the PADUS map hosted by gapanalysisprogram.com, using GAP status codes as the default star rating",
                        longDescription: '<p>This star rating tool finds all protected areas that intersect a proposed site. These ares are defined in PADUS: the national inventory of U.S. terrestrial and marine areas managed through legal or other effective means for the preservation of biological diversity or for other natural, recreational and cultural uses. This dataset includes all federal and most state conservation lands, and many areas at regional and local scales, including some private conservation efforts. For more information, see the USGS Gap Analysis Program (gapanalysis.usgs.gov/padus/data).</p><p>For each area, PADUS includes a GAP Status Code: a conservation measure of management intent for the long-term protection of biodiversity. These status codes range from 1, for areas where natural disturbance events (e.g. fires or floods) go uninterrupted or are mimicked through management, to 2, for areas which may receive uses or management practices that degrade the quality of existing natural communities, to 3, for areas subject to extractive uses of either a localized intense type, or a broad, low-intensity type (such as logging or motorsports). Refer to the PADUS metadata for more details (gapanalysis.usgs.gov/padus/data/metadata/).</p><p>This tool depends on a user-defined star rating for each protected area intersecting a site, on a scale of 0-5 stars. The default rating for a given protected area is equal to its GAP Status Code, so an area with status code 2 would have a two-star rating by default. The default rating for not intersecting any protected areas is four stars. These ratings can then be adjusted by the user.</p><p>When a site overlaps a protected area, its score is based on the star rating of that area (so overlapping a one-star area may give a score of 20, and overlapping a five-star area might give a score of 100). If a site overlaps more than one protected area, the lowest star rating is used to calculate its score (so a site overlapping both a one-star and a five-star area might have a score of 20). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>',
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function () {
                            return _this.starRatingHelper.starRatings;
                        },
                        setStarRatables: function (rateTable) {
                            //$.extend(this.starRatingHelper.starRatings, rateTable);
                            thisModule.starRatingHelper.resetStarRatings(rateTable);

                            // update any scores which aren'r already out for update (those will pick up the new star ratings when they return)
                            var thisScoreLine = this;
                            thisScoreLine.scores.forEach(function (s) {
                                if (!s.isValueOld) {
                                    s.isValueOld = true;
                                    thisModule.updateScore(s);
                                }
                            });
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Star Rating", "Prefer sites with less administration and conservation oversight")
                        },
                        weight: 10
                    }]
            });
        }
        return ProtectedAreasModule;
    })(pvMapper.Module);
    INLModules.ProtectedAreasModule = ProtectedAreasModule;

    //============================================================
    var LandCoverModule = (function (_super) {
        __extends(LandCoverModule, _super);
        function LandCoverModule() {
            var _this = this;
            _super.call(this);
            this.id = "LandCoverModule";
            this.author = "Leng Vang, INL";
            this.version = "0.1.ts";
            this.url = selfUrl;
            this.title = "Land Cover";
            this.category = "Land Use";
            this.description = "The type of land cover found in the center of a site, using GAP land cover data hosted by gapanalysisprogram.com";
            this.longDescription = '<p>This star rating tool finds the type of land cover present at the center of a proposed site. The GAP Land Cover dataset provides detailed vegetation and land use patterns for the continental United States, incorporating an ecological classification system to represent natural and semi-natural land cover. Note that the land cover at the center point of a site may not be representative of the overall land cover at that site. Note also that this dataset was created for regional biodiversity assessment, and not for use at scales larger than 1:100,000. Due to these limitations, results from this tool should be considered preliminary. For more information, see the USGS Gap Analysis Program (gapanalysis.usgs.gov/gaplandcover/data).</p><p>This tool depends on a user-defined star rating for the land cover classification found at each site, on a scale of 0-5 stars. The default rating for all land classes is three stars. These ratings should be adjusted by the user. The score for a site is based on the star rating of its land cover class (so overlapping a one-star class may give a score of 20, and overlapping a five-star class might give a score of 100). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>';
            this.ratables = {};
            this.defaultRating = 3;
            this.landCoverRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/NAT_LC/1_NVC_class_landuse/MapServer/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            this.addMap = function () {
                if (!_this.landCoverLayer) {
                    _this.landCoverLayer = new OpenLayers.Layer.ArcGIS93Rest("Land Cover", _this.landCoverRestUrl + "export", {
                        layers: "show:0,1,2",
                        format: "gif",
                        srs: "3857",
                        transparent: "true"
                    });
                    _this.landCoverLayer.setOpacity(0.3);
                    _this.landCoverLayer.epsgOverride = "3857"; //"EPSG:102100";
                    _this.landCoverLayer.setVisibility(false);
                }

                pvMapper.map.addLayer(_this.landCoverLayer);
            };
            this.removeMap = function () {
                pvMapper.map.removeLayer(_this.landCoverLayer, false);
            };
            this.updateScore = function (score) {
                var params = {
                    mapExtent: score.site.geometry.bounds.toBBOX(6, false),
                    geometryType: "esriGeometryEnvelope",
                    geometry: score.site.geometry.bounds.toBBOX(6, false),
                    f: "json",
                    layers: "all",
                    tolerance: 0,
                    imageDisplay: "1, 1, 96",
                    returnGeometry: false
                };

                var request = OpenLayers.Request.GET({
                    url: _this.landCoverRestUrl + "identify",
                    proxy: "/Proxy/proxy.ashx?",
                    params: params,
                    callback: function (response) {
                        // update value
                        if (response.status === 200) {
                            var esriJsonPerser = new OpenLayers.Format.JSON();
                            esriJsonPerser.extractAttributes = true;
                            var parsedResponse = esriJsonPerser.read(response.responseText);

                            if (parsedResponse && parsedResponse.results && parsedResponse.results.length > 0) {
                                console.assert(parsedResponse.results.length === 1, "Warning: land cover score tool unexpectedly found more than one land cover type");

                                var landCover = "";
                                var lastText = null;
                                for (var i = 0; i < parsedResponse.results.length; i++) {
                                    var newText = parsedResponse.results[i].attributes["NVC_DIV"];
                                    if (newText != lastText) {
                                        if (lastText != null) {
                                            landCover += ", \n";
                                        }
                                        landCover += newText;
                                    }
                                    lastText = newText;
                                }

                                var rating = _this.ratables[landCover];

                                if (typeof rating === "undefined") {
                                    var rating = _this.ratables[landCover] = _this.defaultRating;
                                }

                                score.popupMessage = landCover + " [" + rating + (rating === 1 ? " star]" : " stars]");
                                score.updateValue(rating);
                                //TODO: the server refuses to return more than one pixel value... how do we get %coverage?
                                //      I'm afraid that we'll have to fetch the overlapping image and parse it ourselves...
                                //      or at least run a few requests for different pixels and conbine the results.
                                //      Either way, it'll be costly and inefficient. But, I can't find a better server,
                                //      nor have I been successful at coaxing multiple results from this one. Curses.
                            } else {
                                score.popupMessage = "No data for this site";
                                score.updateValue(Number.NaN);
                            }
                        } else {
                            score.popupMessage = "Error " + response.status + " " + response.statusText;
                            score.updateValue(Number.NaN);
                        }
                    }
                });
            };

            var thisModule = this;
            this.init({
                activate: null,
                deactivate: null,
                scoringTools: [{
                        activate: function () {
                            _this.addMap();
                        },
                        deactivate: function () {
                            _this.removeMap();
                        },
                        id: "LandCoverTool",
                        title: "Land Cover",
                        category: "Land Use",
                        description: "The type of land cover found in the center of a site, using GAP land cover data hosted by gapanalysisprogram.com",
                        longDescription: '<p>This star rating tool finds the type of land cover present at the center of a proposed site. The GAP Land Cover dataset provides detailed vegetation and land use patterns for the continental United States, incorporating an ecological classification system to represent natural and semi-natural land cover. Note that the land cover at the center point of a site may not be representative of the overall land cover at that site. Note also that this dataset was created for regional biodiversity assessment, and not for use at scales larger than 1:100,000. Due to these limitations, results from this tool should be considered preliminary. For more information, see the USGS Gap Analysis Program (gapanalysis.usgs.gov/gaplandcover/data).</p><p>This tool depends on a user-defined star rating for the land cover classification found at each site, on a scale of 0-5 stars. The default rating for all land classes is three stars. These ratings should be adjusted by the user. The score for a site is based on the star rating of its land cover class (so overlapping a one-star class may give a score of 20, and overlapping a five-star class might give a score of 100). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>',
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function () {
                            return _this.ratables;
                        },
                        setStarRatables: function (rateTable) {
                            //$.extend(this.starRatingHelper.starRatings, rateTable);
                            thisModule.ratables = rateTable;

                            // update any scores which aren'r already out for update (those will pick up the new star ratings when they return)
                            var thisScoreLine = this;
                            thisScoreLine.scores.forEach(function (s) {
                                if (!s.isValueOld) {
                                    s.isValueOld = true;
                                    thisModule.updateScore(s);
                                }
                            });
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Star Rating", "Prefer sites with higher-rated land cover.")
                        },
                        weight: 10
                    }]
            });
        }
        return LandCoverModule;
    })(pvMapper.Module);
    INLModules.LandCoverModule = LandCoverModule;

    //============================================================
    //============================================================
    var LandCoverModuleV2 = (function (_super) {
        __extends(LandCoverModuleV2, _super);
        function LandCoverModuleV2() {
            var _this = this;
            _super.call(this);
            this.id = "LandCoverModuleV2";
            this.author = "Rohit Khattar BYU";
            this.version = "0.2.ts";
            this.url = selfUrl;
            this.title = "Land Cover 2";
            this.category = "Land Use";
            this.description = "The types of Land cover found in the selected area. Using data hosted on Geoserver.byu.edu";
            this.longDescription = "<p>The types of Land cover found in the selected area. Using data hosted on geoserver.byu.edu</p>";
            //private landCoverRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/NAT_LC/1_NVC_class_landuse/MapServer/";
            //TODO: try switching to WMS source instead, to support Identify and Legend functions. WMS url:
            //      http://dingo.gapanalysisprogram.com/ArcGIS/services/NAT_LC/6_Ecol_Sys_landuseNocache/MapServer/WMSServer?request=GetCapabilities&service=WMS
            //private landCoverLayer;
            //private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            //private addMap() {
            //    this.landCoverLayer = new OpenLayers.Layer.ArcGIS93Rest(
            //        "Land Cover 2",
            //        this.landCoverRestUrl + "export",
            //        {
            //            layers: "show:0,1,2",
            //            format: "gif",
            //            srs: "3857", //"102100",
            //            transparent: "true",
            //        }//,{ isBaseLayer: false }
            //        );
            //    this.landCoverLayer.setOpacity(0.3);
            //    this.landCoverLayer.epsgOverride = "3857"; //"EPSG:102100";
            //    this.landCoverLayer.setVisibility(false);
            //    pvMapper.map.addLayer(this.landCoverLayer);
            //}
            //private removeMap() {
            //    pvMapper.map.removeLayer(this.landCoverLayer, false);
            //}
            this.starRatingHelper = new pvMapper.StarRatingHelper({
                defaultStarRating: 4
            });
            this.updateScore = function (score) {
                //Fetch data from the cache if it exists.
                var key = "landCover" + score.site.id;
                if (isNaN(score.value) && $.jStorage.get(key)) {
                    score.popupMessage = "<i>" + $.jStorage.get(key + "msg") + "</i>";
                    score.updateValue(($.jStorage.get(key)));
                    score.isValueOld = true; // we've only loaded an old value.
                }

                var toGeoJson = new OpenLayers.Format.GeoJSON();
                var geoJsonObj = toGeoJson.extract.geometry.apply(toGeoJson, [
                    score.site.geometry
                ]);
                var toEsriJson = new geoJsonConverter();
                var recObj = toEsriJson.toEsri(geoJsonObj);
                var esriJsonObj = {
                    "displayFieldName": "",
                    "features": [
                        { "geometry": recObj }
                    ]
                };

                var requestFailureCount = {};

                var request = OpenLayers.Request.POST({
                    //Changing this to leverage the new service from arcgis servers
                    url: "https://geoserver.byu.edu/arcgis/rest/services/land_cover/GPServer/land_cover/submitJob",
                    proxy: "/Proxy/proxy.ashx?",
                    data: OpenLayers.Util.getParameterString({ inpoly: JSON.stringify(esriJsonObj) }) + "+&env%3AoutSR=&env%3AprocessSR=&returnZ=false&returnM=false&f=pjson",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    callback: function (response) {
                        // update value
                        if (response.status === 200) {
                            var esriJsonParser = new OpenLayers.Format.JSON();
                            esriJsonParser.extractAttributes = true;
                            var parsedResponse = esriJsonParser.read(response.responseText);

                            if (!parsedResponse.error && parsedResponse.jobId) {
                                //console.log("LandCoverModule Response: " + JSON.stringify(parsedResponse));
                                //Ohkay Great! Now we have the job Submitted. Lets get the Job ID and then Submit a request for the results.
                                var finalResponse = {};
                                var mainObj = _this;
                                var jobId = parsedResponse.jobId;
                                requestFailureCount[jobId] = 0;
                                var resultSearcher = setInterval(function () {
                                    //Send out another request
                                    var resultRequestRepeat = OpenLayers.Request.GET({
                                        url: "https://geoserver.byu.edu/arcgis/rest/services/land_cover/GPServer/land_cover/" + "jobs/" + jobId + "/results/Extract_nlcd1_TableSelect?f=json",
                                        proxy: "/Proxy/proxy.ashx?",
                                        callback: function (response) {
                                            if (response.status == 200) {
                                                var esriJsonParser = new OpenLayers.Format.JSON();
                                                esriJsonParser.extractAttributes = true;
                                                var parsedResponse = esriJsonParser.read(response.responseText);
                                                if (!parsedResponse.error) {
                                                    //Finally got Result. Lets Send it to the console for now and break from this stupid loop!
                                                    //  console.log(parsedResponse);
                                                    clearInterval(resultSearcher);

                                                    if (parsedResponse && parsedResponse.value.features[0].attributes.Value) {
                                                        var length = parsedResponse.value.features.length, element = null;

                                                        //console.log(length);
                                                        var landCovers = [];
                                                        var ele = null;
                                                        for (var i = 0; i < length; i++) {
                                                            ele = parsedResponse.value.features[i].attributes;
                                                            var percentRound = Math.round(ele.Percent);
                                                            if (percentRound > 1) {
                                                                landCovers.push({ cover: ele.LandCover, percent: percentRound });
                                                            }
                                                        }

                                                        function SortByPercent(x, y) {
                                                            return x.percent - y.percent;
                                                        }

                                                        landCovers.sort(SortByPercent);
                                                        landCovers.reverse();

                                                        //console.log(landCovers);
                                                        //Show a different row for each Type observed
                                                        //Maybe later to show different lines. Presently going with the Star Rating Approach
                                                        //var responseArray: string[] = [];
                                                        var overallScore = 0;
                                                        var totalPercent = 0;
                                                        var combinedText = '';

                                                        for (var i = 0; i < landCovers.length; i++) {
                                                            if (typeof _this.starRatingHelper.starRatings[landCovers[i].cover] === "undefined") {
                                                                _this.starRatingHelper.starRatings[landCovers[i].cover] = _this.starRatingHelper.options.defaultStarRating;
                                                            }

                                                            // overall score is the average star rating weighted by the percentage of individual land covers
                                                            var starRating = _this.starRatingHelper.starRatings[landCovers[i].cover];

                                                            totalPercent += landCovers[i].percent;
                                                            overallScore += landCovers[i].percent * starRating;

                                                            var newText = landCovers[i].percent + "% " + landCovers[i].cover + " [" + starRating + ((starRating === 1) ? " star]" : " stars]");

                                                            combinedText += (combinedText.length ? ', ' : '') + newText;
                                                        }

                                                        overallScore = overallScore / totalPercent;

                                                        // use the combined rating string, and its lowest rating value
                                                        //console.log(this);
                                                        //var combinedText = _this.starRatingHelper1.sortRatableArray(responseArray);
                                                        score.popupMessage = combinedText;

                                                        //var scoreVal = _this.starRatingHelper1.starRatings[responseArray[0]];
                                                        score.updateValue(overallScore);

                                                        //Save to local cache
                                                        $.jStorage.deleteKey(key);
                                                        $.jStorage.deleteKey(key + "msg");
                                                        $.jStorage.set(key, overallScore);
                                                        $.jStorage.set(key + "msg", combinedText);
                                                    } else {
                                                        // use the no category label, and its current star rating
                                                        score.popupMessage = "No landcover found";
                                                        score.updateValue(Number.NaN);
                                                    }
                                                } else {
                                                    // request error might be perminant... need to handle that!
                                                    requestFailureCount[jobId] += 1;

                                                    if (requestFailureCount[jobId] < 12) {
                                                        console.log("Land Use tool job '" + jobId + "' still processing...");
                                                    } else {
                                                        clearInterval(resultSearcher);
                                                        score.popupMessage = "Error " + parsedResponse.error.code + ": " + parsedResponse.error.message;
                                                        score.updateValue(Number.NaN);
                                                    }
                                                }
                                            } else {
                                                clearInterval(resultSearcher);
                                                score.popupMessage = "Error " + response.status + " " + response.statusText;
                                                score.updateValue(Number.NaN);
                                            }
                                        }
                                    });
                                }, 10000);
                            } else {
                                score.popupMessage = "Error" + (parsedResponse.error ? " " + parsedResponse.error.code + ": " + parsedResponse.error.message : ": Server didn't send a job ID");
                                score.updateValue(Number.NaN);
                            }
                        } else {
                            score.popupMessage = "Error " + response.status + " " + response.statusText;
                            score.updateValue(Number.NaN);
                        }
                    }
                });
            };

            var thisModule = this;
            this.init({
                activate: null,
                deactivate: null,
                scoringTools: [{
                        activate: null,
                        deactivate: null,
                        id: "LandCoverToolV2",
                        title: "Land Cover",
                        category: "Land Use",
                        description: "The types of Land cover found in the selected area. Using data hosted on Geoserver.byu.edu",
                        longDescription: "<p>The types of Land cover found in the selected area. Using data hosted on geoserver.byu.edu</p>",
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function () {
                            return _this.starRatingHelper.starRatings;
                        },
                        setStarRatables: function (rateTable) {
                            //$.extend(this.starRatingHelper.starRatings, rateTable);
                            thisModule.starRatingHelper.resetStarRatings(rateTable);

                            // update any scores which aren'r already out for update (those will pick up the new star ratings when they return)
                            var thisScoreLine = this;
                            thisScoreLine.scores.forEach(function (s) {
                                if (!s.isValueOld) {
                                    s.isValueOld = true;
                                    thisModule.updateScore(s);
                                }
                            });
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Star Rating", "Prefer sites with higher-rated land cover.")
                        },
                        weight: 10
                    }]
            });
        }
        return LandCoverModuleV2;
    })(pvMapper.Module);
    INLModules.LandCoverModuleV2 = LandCoverModuleV2;

    //============================================================
    pvMapper.moduleManager.registerModule(new ProtectedAreasModule(), true);
    pvMapper.moduleManager.registerModule(new LandCoverModule(), false);
    pvMapper.moduleManager.registerModule(new LandCoverModuleV2(), true);
})(INLModules || (INLModules = {}));
//# sourceMappingURL=LandUseModule.js.map
