/// <reference path="../pvmapper/tsmapper/starratinghelper.ts" />
/// <reference path="../pvmapper/tsmapper/pvmapper.ts" />
/// <reference path="../pvmapper/tsmapper/site.ts" />
/// <reference path="../pvmapper/tsmapper/score.ts" />
/// <reference path="../pvmapper/tsmapper/tools.ts" />
/// <reference path="../pvmapper/tsmapper/options.d.ts" />
/// <reference path="../pvmapper/tsmapper/module.ts" />
/// <reference path="../pvmapper/tsmapper/jstorage.d.ts" />
/// <reference path="../pvmapper/tsmapper/scoreutility.ts" />
/// <reference path="../jquery.d.ts" />
/// <reference path="../pvmapper/tsmapper/modulemanager.ts" />

var INLModules;
(function (INLModules) {
    var ProtectedAreasModule = (function () {
        function ProtectedAreasModule() {
            var _this = this;
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
            var myModule = new pvMapper.Module({
                id: "ProtectedAreasModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    _this.addMap();
                },
                deactivate: function () {
                    _this.removeMap();
                },
                destroy: null,
                init: null,
                scoringTools: [{
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: ProtectedAreasModule.title,
                        category: ProtectedAreasModule.category,
                        description: ProtectedAreasModule.description,
                        longDescription: ProtectedAreasModule.longDescription,
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function (mode) {
                            if ((mode !== undefined) && (mode === "default")) {
                                return _this.starRatingHelper.starRatings;
                            } else {
                                return _this.starRatingHelper.defaultStarRatings;
                            }
                        },
                        setStarRatables: function (rateTable) {
                            $.extend(_this.starRatingHelper.starRatings, rateTable);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Stars Rating", "Score", "Preference of proposed site away from protected area.")
                        },
                        weight: 10
                    }],
                infoTools: null
            });
            this.getModuleObj = function () {
                return myModule;
            };
        }
        ProtectedAreasModule.prototype.addMap = function () {
            this.federalLandsLayer = new OpenLayers.Layer.WMS("<img class=\"on_c_img\" mdata='MetaData not Found' src='http://www.iconsdb.com/icons/preview/tropical-blue/info-xxl.png' style='width:20px; height:20px'> " + "Protected Areas", this.federalLandsWmsUrl, {
                maxExtent: this.landBounds,
                layers: "0",
                layer_type: "polygon",
                transparent: "true",
                format: "image/gif",
                exceptions: "application/vnd.ogc.se_inimage",
                maxResolution: 156543.0339,
                srs: "EPSG:102113"
            }, { isBaseLayer: false });
            this.federalLandsLayer.epsgOverride = "EPSG:102113";
            this.federalLandsLayer.setOpacity(0.3);
            this.federalLandsLayer.setVisibility(false);
            pvMapper.map.addLayer(this.federalLandsLayer);
        };

        ProtectedAreasModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.federalLandsLayer, false);
        };

        ProtectedAreasModule.prototype.updateScore = function (score) {
            var _this = this;
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
                url: this.federalLandsRestUrl + "identify",
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
                            if (_this.starRatingHelper.starRatings !== undefined) {
                                score.popupMessage = _this.starRatingHelper.options.noCategoryLabel;
                                score.updateValue(_this.starRatingHelper.starRatings[_this.starRatingHelper.options.noCategoryLabel]);
                            }
                        }
                    } else {
                        score.popupMessage = "Error " + response.status + " " + response.statusText;
                        score.updateValue(Number.NaN);
                    }
                }
            });
        };
        ProtectedAreasModule.title = "Protected Areas";
        ProtectedAreasModule.category = "Land Use";
        ProtectedAreasModule.description = "Overlapping protected areas, found in the PADUS map hosted by gapanalysisprogram.com, using GAP status codes as the default star rating";
        ProtectedAreasModule.longDescription = '<p>This star rating tool finds all protected areas that intersect a proposed site. These ares are defined in PADUS: the national inventory of U.S. terrestrial and marine areas managed through legal or other effective means for the preservation of biological diversity or for other natural, recreational and cultural uses. This dataset includes all federal and most state conservation lands, and many areas at regional and local scales, including some private conservation efforts. For more information, see the USGS Gap Analysis Program (gapanalysis.usgs.gov/padus/data).</p><p>For each area, PADUS includes a GAP Status Code: a conservation measure of management intent for the long-term protection of biodiversity. These status codes range from 1, for areas where natural disturbance events (e.g. fires or floods) go uninterrupted or are mimicked through management, to 2, for areas which may receive uses or management practices that degrade the quality of existing natural communities, to 3, for areas subject to extractive uses of either a localized intense type, or a broad, low-intensity type (such as logging or motorsports). Refer to the PADUS metadata for more details (gapanalysis.usgs.gov/padus/data/metadata/).</p><p>This tool depends on a user-defined star rating for each protected area intersecting a site, on a scale of 0-5 stars. The default rating for a given protected area is equal to its GAP Status Code, so an area with status code 2 would have a two-star rating by default. The default rating for not intersecting any protected areas is four stars. These ratings can then be adjusted by the user.</p><p>When a site overlaps a protected area, its score is based on the star rating of that area (so overlapping a one-star area may give a score of 20, and overlapping a five-star area might give a score of 100). If a site overlaps more than one protected area, the lowest star rating is used to calculate its score (so a site overlapping both a one-star and a five-star area might have a score of 20). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>';
        return ProtectedAreasModule;
    })();
    INLModules.ProtectedAreasModule = ProtectedAreasModule;

    //============================================================
    var LandCoverModule = (function () {
        function LandCoverModule() {
            var _this = this;
            this.starRatingHelper = new pvMapper.StarRatingHelper({
                defaultStarRating: 4,
                noCategoryRating: 5,
                noCategoryLabel: "None"
            });
            this.defaultRating = 3;
            this.landCoverRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/NAT_LC/1_NVC_class_landuse/MapServer/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "LandCoverModule",
                author: "Leng Vang, INL",
                version: "0.1.ts",
                activate: function () {
                    _this.addMap();
                },
                deactivate: function () {
                    _this.removeMap();
                },
                destroy: null,
                init: null,
                scoringTools: [{
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: LandCoverModule.title,
                        category: LandCoverModule.category,
                        description: LandCoverModule.description,
                        longDescription: LandCoverModule.longDescription,
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function (mode) {
                            if ((mode !== undefined) && (mode === "default")) {
                                return _this.starRatingHelper.defaultStarRatings;
                            } else {
                                return _this.starRatingHelper.starRatings;
                            }
                        },
                        setStarRatables: function (rateTable) {
                            $.extend(_this.starRatingHelper.starRatings, rateTable);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Under Development", "Preference", "Preference for vegetation cover and land uses.")
                        },
                        weight: 10
                    }],
                infoTools: null
            });
            this.getModuleObj = function () {
                return myModule;
            };
        }
        LandCoverModule.prototype.addMap = function () {
            this.landCoverLayer = new OpenLayers.Layer.ArcGIS93Rest("<img class=\"on_c_img\" mdata='MetaData not Found' src='http://www.iconsdb.com/icons/preview/tropical-blue/info-xxl.png' style='width:20px; height:20px'> " + "Land Cover", this.landCoverRestUrl + "export", {
                layers: "show:0,1,2",
                format: "gif",
                srs: "3857",
                transparent: "true"
            });
            this.landCoverLayer.setOpacity(0.3);
            this.landCoverLayer.epsgOverride = "3857"; //"EPSG:102100";
            this.landCoverLayer.setVisibility(false);

            pvMapper.map.addLayer(this.landCoverLayer);
        };

        LandCoverModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.landCoverLayer, false);
        };

        LandCoverModule.prototype.updateScore = function (score) {
            var _this = this;
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
                url: this.landCoverRestUrl + "identify",
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

                            var rating = undefined;
                            if (_this.starRatingHelper.starRatings !== undefined) {
                                rating = _this.starRatingHelper.starRatings[landCover];
                            }

                            if (typeof rating === "undefined") {
                                if (_this.starRatingHelper.starRatings === undefined) {
                                    _this.starRatingHelper.starRatings = {};
                                }
                                rating = _this.starRatingHelper.starRatings[landCover] = _this.defaultRating;
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
        LandCoverModule.title = "Land Cover";
        LandCoverModule.category = "Land Use";
        LandCoverModule.description = "The type of land cover found in the center of a site, using GAP land cover data hosted by gapanalysisprogram.com";
        LandCoverModule.longDescription = '<p>This star rating tool finds the type of land cover present at the center of a proposed site. The GAP Land Cover dataset provides detailed vegetation and land use patterns for the continental United States, incorporating an ecological classification system to represent natural and semi-natural land cover. Note that the land cover at the center point of a site may not be representative of the overall land cover at that site. Note also that this dataset was created for regional biodiversity assessment, and not for use at scales larger than 1:100,000. Due to these limitations, results from this tool should be considered preliminary. For more information, see the USGS Gap Analysis Program (gapanalysis.usgs.gov/gaplandcover/data).</p><p>This tool depends on a user-defined star rating for the land cover classification found at each site, on a scale of 0-5 stars. The default rating for all land classes is three stars. These ratings should be adjusted by the user. The score for a site is based on the star rating of its land cover class (so overlapping a one-star class may give a score of 20, and overlapping a five-star class might give a score of 100). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>';
        return LandCoverModule;
    })();
    INLModules.LandCoverModule = LandCoverModule;

    //============================================================
    //============================================================
    var LandCoverModuleV2 = (function () {
        function LandCoverModuleV2() {
            var _this = this;
            this.landCoverRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/NAT_LC/1_NVC_class_landuse/MapServer/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            this.starRatingHelper = new pvMapper.StarRatingHelper({
                defaultStarRating: 4
            });
            var myModule = new pvMapper.Module({
                id: "LandCoverModuleV2",
                author: "Rohit Khattar BYU",
                version: "0.2.ts",
                activate: function () {
                    _this.addMap();
                },
                deactivate: function () {
                    _this.removeMap();
                },
                destroy: null,
                init: null,
                scoringTools: [{
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: LandCoverModuleV2.title,
                        category: LandCoverModuleV2.category,
                        description: LandCoverModuleV2.description,
                        longDescription: LandCoverModuleV2.longDescription,
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function (mode) {
                            if ((mode !== undefined) && (mode === "default")) {
                                return _this.starRatingHelper.defaultStarRatings;
                            } else {
                                return _this.starRatingHelper.starRatings;
                            }
                        },
                        setStarRatables: function (rateTable) {
                            $.extend(_this.starRatingHelper.starRatings, rateTable);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Land Use", "Preference", "Preference for the type of land cover present in propose site.")
                        },
                        weight: 10
                    }],
                infoTools: null
            });
            this.getModuleObj = function () {
                return myModule;
            };
        }
        LandCoverModuleV2.prototype.addMap = function () {
            this.landCoverLayer = new OpenLayers.Layer.ArcGIS93Rest("Land Cover 2", this.landCoverRestUrl + "export", {
                layers: "show:0,1,2",
                format: "gif",
                srs: "3857",
                transparent: "true"
            });
            this.landCoverLayer.setOpacity(0.3);
            this.landCoverLayer.epsgOverride = "3857"; //"EPSG:102100";
            this.landCoverLayer.setVisibility(false);

            pvMapper.map.addLayer(this.landCoverLayer);
        };

        LandCoverModuleV2.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.landCoverLayer, false);
        };

        LandCoverModuleV2.prototype.updateScore = function (score) {
            var _this = this;
            //Fetch data from the cache if it exists.
            var key = "landCover" + score.site.id;
            if (isNaN(score.value) && $.jStorage.get(key)) {
                score.popupMessage = "<i>" + $.jStorage.get(key + "msg") + "</i>";
                score.updateValue(($.jStorage.get(key)));
            }

            var _me = this;

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

                        //console.log("LandCoverModule Response: " + JSON.stringify(parsedResponse));
                        //Ohkay Great! Now we have the job Submitted. Lets get the Job ID and then Submit a request for the results.
                        var finalResponse = {};
                        var mainObj = _this;
                        var jobId = parsedResponse.jobId;
                        var resultSearcher = setInterval(function () {
                            console.log("Job Still Processing");

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
                                                console.log(length);

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
                                                    if (typeof _me.starRatingHelper.starRatings[landCovers[i].cover] === "undefined") {
                                                        _me.starRatingHelper.starRatings[landCovers[i].cover] = _me.starRatingHelper.options.defaultStarRating;
                                                    }

                                                    // overall score is the average star rating weighted by the percentage of individual land covers
                                                    var starRating = _me.starRatingHelper.starRatings[landCovers[i].cover];

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
                        score.popupMessage = "Error " + response.status + " " + response.statusText;
                        score.updateValue(Number.NaN);
                    }
                }
            });
        };
        LandCoverModuleV2.title = "Land Cover 2";
        LandCoverModuleV2.category = "Land Use";
        LandCoverModuleV2.description = "The types of Land cover found in the selected area. Using data hosted on Geoserver.byu.edu";
        LandCoverModuleV2.longDescription = "<p>The types of Land cover found in the selected area. Using data hosted on geoserver.byu.edu</p>";
        return LandCoverModuleV2;
    })();
    INLModules.LandCoverModuleV2 = LandCoverModuleV2;
})(INLModules || (INLModules = {}));

//var protectedAreasInstance = new INLModules.ProtectedAreasModule();
//var landCoverInstance = new INLModules.LandCoverModule();
if (typeof (selfUrl) == 'undefined')
    var selfUrl = $('script[src$="LandUseModule.js"]').attr('src');
if (typeof (isActive) == 'undefined')
    var isActive = true;
pvMapper.moduleManager.registerModule(INLModules.ProtectedAreasModule.category, INLModules.ProtectedAreasModule.title, INLModules.ProtectedAreasModule, isActive, selfUrl);
pvMapper.moduleManager.registerModule(INLModules.LandCoverModule.category, INLModules.LandCoverModule.title, INLModules.LandCoverModule, isActive, selfUrl);
pvMapper.moduleManager.registerModule(INLModules.LandCoverModuleV2.category, INLModules.LandCoverModuleV2.title, INLModules.LandCoverModuleV2, !isActive, selfUrl);
//# sourceMappingURL=LandUseModule.js.map