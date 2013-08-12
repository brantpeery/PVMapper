//Near River Module : Based on the Wilderness Module by Darian Ramage

var BYUModules;
(function (BYUModules) {
    var NearRiverModule = (function () {
        function NearRiverModule() {
            var _this = this;
            this.NearRiverRestUrl = "https://geoserver.byu.edu/arcgis/rest/services/near_river4/GPServer/near_join/";
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
            var toGeoJson = new OpenLayers.Format.GeoJSON();
            var geoJsonObj = toGeoJson.extract.geometry.apply(toGeoJson, [
                score.site.geometry
            ]);
            var toEsriJson = new geoJsonConverter();
            var recObj = toEsriJson.toEsri(geoJsonObj);
            var key = "riverModuleScore" + score.site.id;
            var esriJsonObj = {
                "displayFieldName": "",
                "features": [
                    { "geometry": recObj }
                ],

            };
       

            //Geometry Checked. Its fine. Now to Pass the Geometry to the service and since the service is running slow, figure out a way to repeat requests untill a response is obtained

           // console.log("Converted Geometry:");
            console.log("Esri Json: " + JSON.stringify(esriJsonObj));

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
                        var resultSearcher = setInterval(function () {
                            console.log("Job Still Processing");
                            //Send out another request
                            var resultRequestRepeat = OpenLayers.Request.GET({
                                url: "https://geoserver.byu.edu/arcgis/rest/services/near_river4/GPServer/near_join/" + "jobs/" + jobId + "/results/near_dist_Layer?f=json",
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


                        //Fetch data from the cache if it exists. 


                        if ($.jStorage.get(key)) {
                            score.popupMessage = "<i>" + $.jStorage.get(key + "msg") + "</i>";
                            score.updateValue($.jStorage.get(key));
                        }
                        else {
                            score.popupMessage = "Please Wait! Lots of rivers!";
                            score.updateValue(Number.NaN);
                        }


                     
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
    var modInstance = new BYUModules.NearRiverModule();
})(BYUModules || (BYUModules = {}));
