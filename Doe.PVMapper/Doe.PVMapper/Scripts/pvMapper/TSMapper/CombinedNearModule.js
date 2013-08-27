//Near River Module : Based on the Wilderness Module by Darian Ramage

var BYUModules;
(function (BYUModules) {

    var requestSent = 0;
    var jobID = "";
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
                            //TODO: what units is this distance in? kilometers? I'm guessing km...-Its miles
                            functionArgs: new pvMapper.MinMaxUtilityArgs(100, 0, "Mi", "Minimum River threshold allowed.", "Maximum River threshold allowed.")
                        },
                        defaultWeight: 10
                    }
                ],
                infoTools: null
            });
        }

        NearRiverModule.prototype.updateScore = function (score) {
            var key = "riverModuleScore" + score.site.id;
            if (isNaN(score.value) && $.jStorage.get(key)) {
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


            //Geometry Checked. Its fine. Now to Pass the Geometry to the service and since the service is running slow, figure out a way to repeat requests untill a response is obtained

            // console.log("Converted Geometry:");
            console.log("Esri Json: " + JSON.stringify(esriJsonObj));
            requestSent = 1;
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

                        console.log("Near River Module Respone: " + JSON.stringify(parsedResponse));

                        //Ohkay Great! Now we have the job Submitted. Lets get the Job ID and then Submit a request for the results. 
                        var finalResponse = {};
                        var jobId = parsedResponse.jobId;
                        jobID = jobId;
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
                                            finalResponse = parsedResponse;

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
                                                requestSent = 0;
                                            }
                                            else {
                                                score.popupMessage = "Error " + response.status;
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
        return NearRiverModule;
    })();
    BYUModules.NearRiverModule = NearRiverModule;

    //Create new module and run
    var modInstance = new BYUModules.NearRiverModule();

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
                        },
                        onSiteChange: function (event, score) {
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            //TODO: what units is this distance in? kilometers? I'm guessing km... - It gets converted to miles!
                            functionArgs: new pvMapper.MinMaxUtilityArgs(100, 0, "Mi", "Minimum Road Distance threshold allowed.", "Maximum Road Distance threshold allowed.")
                        },
                        defaultWeight: 10
                    }
                ],
                infoTools: null
            });
        }

        NearRoadModule.prototype.updateScore = function (score) {
            var key = "roadModuleScore" + score.site.id;
            if (requestSent) {
                if (isNaN(score.value) && $.jStorage.get(key)) {
                    score.popupMessage = "<i>" + $.jStorage.get(key + "msg") + "</i>";
                    score.updateValue($.jStorage.get(key));
                }
                //else {
                //    score.popupMessage = "Please Wait! Roads confuse me!";
                //    score.updateValue(Number.NaN);
                //}

                //Wait for a few seconds, then fetch the job id and the results from that job. 

                var finalResponse = {};
                var jobId = jobID;
                var resultSearcher = setInterval(function () {
                    jobId = jobID;
                    console.log("Job Still Processing");
                    //Send out another request
                    var resultRequestRepeat = OpenLayers.Request.GET({
                        url: "http://geoserver.byu.edu/arcgis/rest/services/combined_near/GPServer/composite_near/jobs/" + jobId + "/results/near_roads?f=json",
                        proxy: "/Proxy/proxy.ashx?",
                        callback: function (response) {

                            if (response.status == 200) {
                                var esriJsonParser = new OpenLayers.Format.JSON();
                                esriJsonParser.extractAttributes = true;
                                var parsedResponse = esriJsonParser.read(response.responseText);

                                if (!parsedResponse.error) {
                                    //Finally got Result. Lets Send it to the console for now and break from this stupid loop!

                                    clearInterval(resultSearcher);
                                    finalResponse = parsedResponse;

                                    if (parsedResponse && parsedResponse.value.features[0].attributes) {

                                        var distRoad = parsedResponse.value.features[0].attributes.near_dist * 0.000621371;
                                        var msgRoad = distRoad.toFixed(2) + " miles to " + parsedResponse.value.features[0].attributes.NAME + "(" + parsedResponse.value.features[0].attributes.FEATURE + ")";
                                        score.popupMessage = msgRoad;

                                        score.updateValue(distRoad);

                                        //Save to local cache


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
                                clearInterval(resultSearcher);
                                score.popupMessage = "Error " + response.status;
                                score.updateValue(Number.NaN);
                            }
                        }
                    });
                }, 10000);


                return;

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
            //Geometry Checked. Its fine. Now to Pass the Geometry to the service and since the service is running slow, figure out a way to repeat requests untill a response is obtained

            // console.log("Converted Geometry:");
            console.log("Esri Json: " + JSON.stringify(esriJsonObj));
            requestSent = 1;
            var request = OpenLayers.Request.POST({
                url: this.NearRoadRestUrl + "submitJob",
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

                        console.log("Near Road Module Respone: " + JSON.stringify(parsedResponse));

                        //Ohkay Great! Now we have the job Submitted. Lets get the Job ID and then Submit a request for the results. 
                        var finalResponse = {};
                        var jobId = parsedResponse.jobId;
                        jobID = jobId;
                        var resultSearcher = setInterval(function () {
                            console.log("Job Still Processing");
                            //Send out another request
                            var resultRequestRepeat = OpenLayers.Request.GET({
                                url: "https://geoserver.byu.edu/arcgis/rest/services/near_road/GPServer/near_join/" + "jobs/" + jobId + "/results/near_dist_Layer?f=json",
                                proxy: "/Proxy/proxy.ashx?",
                                callback: function (response) {

                                    if (response.status == 200) {
                                        var esriJsonParser = new OpenLayers.Format.JSON();
                                        esriJsonParser.extractAttributes = true;
                                        var parsedResponse = esriJsonParser.read(response.responseText);

                                        if (!parsedResponse.error) {
                                            //Finally got Result. Lets Send it to the console for now and break from this stupid loop!

                                            clearInterval(resultSearcher);
                                            finalResponse = parsedResponse;

                                            if (parsedResponse && parsedResponse.value.features[0].attributes) {

                                                var distRoad = parsedResponse.value.features[0].attributes.near_dist * 0.000621371;
                                                var msgRoad = distRoad.toFixed(2) + " miles to " + parsedResponse.value.features[0].attributes.NAME + "(" + parsedResponse.value.features[0].attributes.FEATURE + ")";
                                                score.popupMessage = msgRoad;

                                                score.updateValue(distRoad);

                                                //Save to local cache


                                                $.jStorage.deleteKey(key);
                                                $.jStorage.deleteKey(key + "msg");
                                                $.jStorage.set(key, distRoad);
                                                $.jStorage.set(key + "msg", msgRoad);

                                                requestSent = 0;

                                            }
                                            else {
                                                score.popupMessage = "Error " + response.status;
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
        return NearRoadModule;
    })();

    BYUModules.NearRoadModule = NearRoadModule;
    var modInstance = new BYUModules.NearRoadModule();

})(BYUModules || (BYUModules = {}));
