//Near River Module : Based on the Wilderness Module by Darian Ramage

var BYUModules;
(function (BYUModules) {

    //Load up the Road Module

    var NearRoadModule = (function () {
        function NearRoadModule() {
            var _this = this;
            this.NearRoadRestUrl = "https://geoserver.byu.edu/arcgis/rest/services/near_road/GPServer/near_join/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "NearRoadModule",
                author: "Rohit Khattar",
                version: "0.1",
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        title: "Nearest Road",
                        description: "Nearest Road to the Selected Site",
                        category: "Land Use",
                        onScoreAdded: function (event, score) {
                            NearRoadScoreKeeper[score.site.id] = score;
                        },
                        onSiteChange: function (event, score) {
                            NearRoadScoreKeeper[score.site.id] = score;
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            //TODO: what units is this distance in? kilometers? I'm guessing km... - It gets converted to miles!
                            functionArgs: new pvMapper.MinMaxUtilityArgs(100, 0, "Mi", "Available Road","Preference","Preference with existing road near by.","Minimum Road Distance threshold allowed.", "Maximum Road Distance threshold allowed.")
                        },
                        defaultWeight: 10
                    }
                ],
                infoTools: null
            });
        }
        return NearRoadModule;
    })();

    //NearRoadScore Hash to keep a track of its score object and make updates when the result comes back from the River module's Request
    var NearRoadScoreKeeper = {};



    BYUModules.NearRoadModule = NearRoadModule;
    var modInstance = new BYUModules.NearRoadModule();

    var NearRiverModule = (function () {
        function NearRiverModule() {
            var _this = this;
            this.NearRiverRestUrl = "https://geoserver.byu.edu/arcgis/rest/services/combined_near/GPServer/composite_near/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "NearRiverModule",
                author: "Rohit Khattar",
                version: "0.1",
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        title: "Nearest River",
                        description: "Nearest River to the Selected Site",
                        category: "Land Use",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(100, 0, "Mi", "Available of River","Preference","Preference of readily available source of water.","Minimum River threshold allowed.", "Maximum River threshold allowed.")
                        },
                        defaultWeight: 10
                    }
                ],
                infoTools: null
            });
        }

        NearRiverModule.prototype.updateScore = function (score) {
            var key = "roadModuleScore" + score.site.id;
            var roadScore = NearRoadScoreKeeper[score.site.id];
            //Removing the condtion of NAN as if the site gets changed, we need the italicised values to show that its a cached result
            if ($.jStorage.get(key)) {
                roadScore.popupMessage = "<i>" + $.jStorage.get(key + "msg") + "</i>";
                roadScore.updateValue($.jStorage.get(key));
            }
           key = "riverModuleScore" + score.site.id;
            if ($.jStorage.get(key)) {
                score.popupMessage = "<i>" + $.jStorage.get(key + "msg") + "</i>";
                score.updateValue($.jStorage.get(key));
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
                ],

            };

            //console.log("Esri Json: " + JSON.stringify(esriJsonObj));
            var request = OpenLayers.Request.POST({
                url: this.NearRiverRestUrl + "submitJob",
                proxy: "/Proxy/proxy.ashx?",
                data: OpenLayers.Util.getParameterString({ inpoly: JSON.stringify(esriJsonObj) }) + "+&env%3AoutSR=&env%3AprocessSR=&returnZ=false&returnM=false&f=pjson",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                callback: function (response) {
                    if (response.status == 200) {
                        var esriJsonParser = new OpenLayers.Format.JSON();
                        esriJsonParser.extractAttributes = true;
                        var parsedResponse = esriJsonParser.read(response.responseText);
                       // console.log("Near River Module Respone: " + JSON.stringify(parsedResponse));
                        //Ohkay Great! Now we have the job Submitted. Lets get the Job ID and then Submit a request for the results. 
                        var finalResponse = {};
                        var jobId = parsedResponse.jobId;
                        var resultSearcher = setInterval(function () {
                            console.log("Job Still Processing");
                            //Send out another request
                            var resultRequestRepeat = OpenLayers.Request.GET({
                                url: "http://geoserver.byu.edu/arcgis/rest/services/combined_near/GPServer/composite_near/jobs/" + jobId + "/results/near_rivers?f=json",
                                proxy: "/Proxy/proxy.ashx?",
                                callback: function (response) {
                                    if (response.status == 200) {
                                        var esriJsonParser = new OpenLayers.Format.JSON();
                                        esriJsonParser.extractAttributes = true;
                                        var parsedResponse = esriJsonParser.read(response.responseText);
                                        if (!parsedResponse.error) {
                                            //Finally got Result. Lets Send it to the console for now and break from this stupid loop!
                                            clearInterval(resultSearcher);
                                            if (parsedResponse && parsedResponse.value.features[0].attributes.PNAME) {

                                                var dist = Math.round(parsedResponse.value.features[0].attributes.near_dist * 0.000621371);
                                                score.popupMessage = dist + " miles to " + parsedResponse.value.features[0].attributes.PNAME;
                                                var msgRiver = dist + " miles to " + parsedResponse.value.features[0].attributes.PNAME;

                                                //Save to local cache
                                                $.jStorage.deleteKey(key);
                                                $.jStorage.deleteKey(key + "msg");
                                                $.jStorage.set(key, dist);
                                                $.jStorage.set(key + "msg", msgRiver);
                                                score.updateValue(dist);
                                            }
                                            else {
                                                score.popupMessage = "Error " + response.status;
                                                score.updateValue(Number.NaN);
                                            }

                                            //Working now to process the Score for near road module. 

                                            var resultRequestfinal = OpenLayers.Request.GET({
                                                url: "http://geoserver.byu.edu/arcgis/rest/services/combined_near/GPServer/composite_near/jobs/" + jobId + "/results/near_roads?f=json",
                                                proxy: "/Proxy/proxy.ashx?",
                                                callback: function (response) {
                                                    score = NearRoadScoreKeeper[score.site.id];
                                                    if (response.status == 200) {
                                                        var esriJsonParser = new OpenLayers.Format.JSON();
                                                        esriJsonParser.extractAttributes = true;
                                                        var parsedResponse = esriJsonParser.read(response.responseText);

                                                        if (!parsedResponse.error) {
                                                            if (parsedResponse && parsedResponse.value.features[0].attributes) {

                                                                var distRoad = parsedResponse.value.features[0].attributes.near_dist * 0.000621371;
                                                                var msgRoad = distRoad.toFixed(2) + " miles to " + parsedResponse.value.features[0].attributes.NAME + "(" + parsedResponse.value.features[0].attributes.FEATURE + ")";
                                                                score.popupMessage = msgRoad;
                                                                score.updateValue(distRoad);

                                                                //Save to local cache
                                                                key = "roadModuleScore" + score.site.id;
                                                                $.jStorage.deleteKey(key);
                                                                $.jStorage.deleteKey(key + "msg");
                                                                $.jStorage.set(key, distRoad);
                                                                $.jStorage.set(key + "msg", msgRoad);

                                                            }
                                                            else {
                                                                score.popupMessage = "Error " + response.status;
                                                                score.updateValue(Number.NaN);
                                                            }

                                                        }
                                                    } else {
                                                        score.popupMessage = "Error " + response.status;
                                                        score.updateValue(Number.NaN);
                                                    }
                                                }
                                            });
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
        return NearRiverModule;
    })();
    BYUModules.NearRiverModule = NearRiverModule;

    //Create new module and run
    var modInstance = new BYUModules.NearRiverModule();
})(BYUModules || (BYUModules = {}));
