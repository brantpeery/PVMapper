var INLModules;
(function (INLModules) {
    var ProtectedAreasModule = (function () {
        function ProtectedAreasModule() {
            var _this = this;
            this.starRatingHelper = new pvMapper.StarRatingHelper({
                defaultStarRating: 2,
                noCategoryRating: 4,
                noCategoryLabel: "None"
            });
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
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Protected Areas",
                        description: "Overlapping protected areas, using PAD-US map data hosted by UI-GAP (gap.uidaho.edu)",
                        category: "Land Use",
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function () {
                            return _this.starRatingHelper.starRatings;
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }
        ProtectedAreasModule.prototype.addMap = function () {
            this.federalLandsLayer = new OpenLayers.Layer.WMS("Protected Areas", this.federalLandsWmsUrl, {
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

                                var newText = "";

                                if (name && name != "Null" && isNaN(parseFloat(name))) {
                                    // some of the names start with a number - skip those
                                    newText += name;
                                } else if (type && type != "Null") {
                                    newText += type;
                                }

                                if (manager && manager != "Null") {
                                    newText += (newText) ? ": " + manager : manager;
                                } else if (owner && owner != "Null") {
                                    newText += (newText) ? ": " + owner : owner;
                                }

                                if (responseArray.indexOf(newText) < 0) {
                                    responseArray.push(newText);
                                }
                            }

                            // use the combined rating string, and its lowest rating value
                            var combinedText = _this.starRatingHelper.sortRatableArray(responseArray);
                            score.popupMessage = combinedText;
                            score.updateValue(_this.starRatingHelper.starRatings[responseArray[0]]);
                        } else {
                            // use the no category label, and its current star rating
                            score.popupMessage = _this.starRatingHelper.options.noCategoryLabel;
                            score.updateValue(_this.starRatingHelper.starRatings[_this.starRatingHelper.options.noCategoryLabel]);
                        }
                    } else {
                        score.popupMessage = "Error " + response.status;
                        score.updateValue(Number.NaN);
                    }
                }
            });
        };
        return ProtectedAreasModule;
    })();
    INLModules.ProtectedAreasModule = ProtectedAreasModule;

    var protectedAreasInstance = new INLModules.ProtectedAreasModule();

    //============================================================
    var LandCoverModule = (function () {
        function LandCoverModule() {
            var _this = this;
            this.landCoverRestUrl = "http://dingo.gapanalysisprogram.com/ArcGIS/rest/services/NAT_LC/1_NVC_class_landuse/MapServer/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            this.starRatingHelper1 = new pvMapper.StarRatingHelper({
                defaultStarRating: 4
            });
            var myModule = new pvMapper.Module({
                id: "LandCoverModule",
                author: "Leng Vang, INL, Rohit Khattar BYU",
                version: "0.2.ts",
                activate: function () {
                    _this.addMap();
                },
                deactivate: function () {
                    _this.removeMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Land Cover",
                        description: "The types of Land cover found in the selected area. Using data hosted on Geoserver.byu.edu",
                        category: "Land Use",
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {
                            _this.updateScore(score);
                        },
                        getStarRatables: function () {
                            return _this.starRatingHelper1.starRatings;
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars")
                        },
                        weight: 10
                    }
                ],
                infoTools: null
            });
        }
        LandCoverModule.prototype.addMap = function () {
            this.landCoverLayer = new OpenLayers.Layer.ArcGIS93Rest("Land Cover", this.landCoverRestUrl + "export", {
                layers: "show:0,1,2",
                format: "gif",
                srs: "3857",
                transparent: "true"
            });
            this.landCoverLayer.setOpacity(0.3);
            this.landCoverLayer.epsgOverride = "3857";
            this.landCoverLayer.setVisibility(false);

            pvMapper.map.addLayer(this.landCoverLayer);
        };

        LandCoverModule.prototype.removeMap = function () {
            pvMapper.map.removeLayer(this.landCoverLayer, false);
        };

        LandCoverModule.prototype.updateScore = function (score) {
            var _this = this;
            //Fetch data from the cache if it exists.
            var key = "landCover" + score.site.id;
            if (isNaN(score.value) && $.jStorage.get(key)) {
                score.popupMessage = "<i>" + $.jStorage.get(key + "msg") + "</i>";
                score.updateValue($.jStorage.get(key));
            }

            var _this = this;

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
                                                    if (typeof _this.starRatingHelper1.starRatings[landCovers[i].cover] === "undefined") {
                                                        _this.starRatingHelper1.starRatings[landCovers[i].cover] = _this.starRatingHelper1.options.defaultStarRating;
                                                    }

                                                    // overall score is the average star rating weighted by the percentage of individual land covers
                                                    var starRating = _this.starRatingHelper1.starRatings[landCovers[i].cover];

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
                                        score.popupMessage = "Error " + response.status;
                                        score.updateValue(Number.NaN);
                                    }
                                }
                            });
                        }, 10000);
                    } else {
                        score.popupMessage = "Error " + response.status;
                        score.updateValue(Number.NaN);
                    }
                }
            });
        };
        return LandCoverModule;
    })();
    INLModules.LandCoverModule = LandCoverModule;

    var landCoverInstance = new INLModules.LandCoverModule();
})(INLModules || (INLModules = {}));
