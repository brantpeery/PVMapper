//Near Road Module : Client Side Calculations.

var BYUModules;
(function (BYUModules) {
    var NearRoadModule = (function () {
        function NearRoadModule() {
            var _this = this;
            this.NearRoadRestUrl = "https://geoserver.byu.edu/arcgis/rest/services/Road_data/GPServer/Model/";
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "NearRoadModule",
                author: "Rohit Khattar",
                version: "0.2",
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        title: NearRoadModule.title, //"Nearest Road",
                        description: NearRoadModule.description, //"Nearest Road to the Selected Site",
                        category: NearRoadModule.category, //"Land Use",
                        longDescription: NearRoadModule.longDescription,
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            //TODO: what units is this distance in? kilometers? I'm guessing km... - It gets converted to miles!
                            functionArgs: new pvMapper.MinMaxUtilityArgs(100, 0, "Mi", "Nearest Road", "Score", "Do we need to build our own road to this site?",
                              "Minimum Road Distance threshold allowed.", "Maximum Road Distance threshold allowed.")
                        },
                        defaultWeight: 10
                    }
                ],
                infoTools: null
            });
            this.getModuleObj = function () { return myModule; }
        }
        NearRoadModule.title = "Nearest Road";
        NearRoadModule.category = "Land Use";
        NearRoadModule.description = "Nearest Road to the Selected Site";
        NearRoadModule.longDescription = '???';

        NearRoadModule.prototype.updateScore = function (score) {

            //Fetch data from the cache if it exists. 
            var key = "roadModuleScore"+ score.site.id;
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

            var request = OpenLayers.Request.POST({
                url: this.NearRoadRestUrl + "submitJob",
                proxy: "/Proxy/proxy.ashx?",                                                           
                data: OpenLayers.Util.getParameterString({ User_poly: JSON.stringify(esriJsonObj) }) + "+&env%3AoutSR=&env%3AprocessSR=&returnZ=false&returnM=false&f=pjson",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cache-Control": "max-age=0"
                },
                callback: function (response) {
                    if (response.status == 200) {
                       
                        var esriJsonParser = new OpenLayers.Format.JSON();
                        esriJsonParser.extractAttributes = true;
                        var parsedResponse = esriJsonParser.read(response.responseText);

                    //    console.log("Near Road Module Respone: " + JSON.stringify(parsedResponse));

                        //Ohkay Great! Now we have the job Submitted. Lets get the Job ID and then Submit a request for the results. 
                        var finalResponse = {};
                        var jobId = parsedResponse.jobId;
                        var resultSearcher = setInterval(function () {
                            console.log("Job Still Processing");
                            //Send out another request
                            var resultRequestRepeat = OpenLayers.Request.GET({

                                url: "https://geoserver.byu.edu/arcgis/rest/services/Road_data/GPServer/Model/" + "jobs/" + jobId + "/results/roadsimple200_Clip?f=json",
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

                                            //Calculate the nearest road. 

                                            var parser = new OpenLayers.Format.GeoJSON();

                                            var closestFeature = null;
                                            var minDistance = 99999999;
                                            if (finalResponse.value.features) {
                                                for (var i = 0; i < finalResponse.value.features.length; i++) {
                                                    var feature = finalResponse.value.features[i];

                                                    //Converting obtained paths to OpenLayers Geometry. For some reason none of 
                                                    //the in built methods seem to work. 

                                                    var tempArray = feature.geometry.paths[0];
                                                    var points1 = new Array();
                                                    tempArray.forEach(function (entry) {
                                                        points1.push(new OpenLayers.Geometry.Point(entry[0], entry[1]));
                                                    });

                                                    var line = new OpenLayers.Geometry.LineString(points1);

                                                    var distance = score.site.geometry.distanceTo(line);
                                                    if (distance < minDistance) {
                                                        minDistance = distance;
                                                        closestFeature = feature;
                                                    }
                                                }
                                            }


                                            if (closestFeature !== null) {
                                                var name = "nearest road"
                                                if (closestFeature.attributes.NAME) {
                                                    name = closestFeature.attributes.NAME;
                                                }
                                                var message = (minDistance / 1000).toFixed(1) + " km to " + name + " (" + closestFeature.attributes.FEATURE + ")." ;
                                                score.popupMessage = message;
                                                score.updateValue(minDistance / 1000);

                                                //Save to local cache
                                                $.jStorage.deleteKey(key);
                                                $.jStorage.deleteKey(key+"msg");
                                                $.jStorage.set(key, minDistance / 1000);
                                                $.jStorage.set(key+"msg", message);


                                            } else {
                                                score.popupMessage = "No Road found within 200 miles.";
                                            }

                                        }

                                        else {
                                            score.popupMessage = "Error " + response.status;
                                            score.updateValue(Number.NaN);
                                        }

                                    } else {
                                        clearInterval(resultSearcher);
                                        score.popupMessage = "Error " + response.status;
                                        score.updateValue(Number.NaN);
                                    }
                                }
                            });
                        }, 3000);
                     
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
   // var modInstance = new BYUModules.NearRoadModule();
})(BYUModules || (BYUModules = {}));

var selfUrl = $('script[src$="NearRoadModule.js"]').attr('src');
if (typeof (isActive) == 'undefined')
    var isActive = true;
pvMapper.moduleManager.registerModule(BYUModules.NearRoadModule.category, BYUModules.NearRoadModule.title, BYUModules.NearRoadModule, isActive, selfUrl);
