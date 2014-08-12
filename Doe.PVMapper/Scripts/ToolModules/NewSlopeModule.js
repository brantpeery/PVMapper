//SLope Module involving client side calculation. 

var BYUModules;
(function (BYUModules) {
   
    var slopeConfigProperties = {
        percentT: 5
    };

    var myToolLine;

    var propsGrid;
    var propsWindow;

    Ext.onReady(function () {
        propsGrid = new Ext.grid.PropertyGrid({
            nameText: 'Properties Grid',
            minWidth: 300,
            source: slopeConfigProperties,
            customRenderers: {
                percentT: function (v) {
                    return v + " %";
                }
            },
            propertyNames: {
                percentT: 'Maximum Slope',
            },
        });
        propsWindow = Ext.create('Ext.window.Window', {
            title: "Configure Slope Tool",
            closeAction: "hide",
            layout: "fit",
            items: [
                propsGrid
            ],
            listeners: {
                beforehide: function () {
                    // update any scores which aren't already out for update (those will pick up the new slope percent threshold when they return)
                    myToolLine.scores.forEach(function (score) {
                        if (!score.isValueOld) {
                            score.isValueOld = true;
                            reCalculate(score);
                        }
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


    var NewSlopeModule = new pvMapper.Module({
        id: "SlopeCModule",
        author: "Rohit Khattar",
        version: "0.1",
        url: selfUrl,

        title: "Slope Threshold",
        category: "Geography",
        description: "Percentage of site slope which falls under the given threshold (Default : 5%)",

        //activate: null,
        //deactivate: null,

        scoringTools: [
            {
                showConfigWindow: function () {
                    myToolLine = this;
                    propsWindow.show();
                },
                //activate: null,
                //deactivate: null,

                id: "SlopeCTool",
                title: "Slope",
                category: "Geography",
                description: "Percentage of site slope which falls under the given threshold (Default : 5%)",
                longDescription: "<p>Percentage of site slope which falls under the given threshold (Default : 5%)</p>",
                //onScoreAdded: function (event, score) {
                //},
                onSiteChange: function (event, score) {
                    updateScore(score);
                },
                getConfig: function () {
                    return slopeConfigProperties;
                },
                setConfig: function (config) {
                    if (config.percentT >= 0 && slopeConfigProperties.percentT !== config.percentT) {
                        slopeConfigProperties.percentT = config.percentT;
                        propsGrid.setSource(slopeConfigProperties);

                        // update any scores which aren't already out for update (those will pick up the new slope percent threshold when they return)
                        this.scores.forEach(function (score) {
                            if (!score.isValueOld) {
                                score.isValueOld = true;
                                reCalculate(score);
                            }
                        });
                    }
                },
                scoreUtilityOptions: {
                    functionName: "linear3pt",
                    functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0, 50, 0.5, 100, 1.0, "% of site", "% of site area with acceptable slope", 
                        "Prefer sites to have more land area with acceptable slope.")
                },
                defaultWeight: 10
            }
        ],
    });
    //BYUModules.NewSlopeModule = NewSlopeModule;

    var landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

    function reCalculate (score) {

        var key = "slopeURL" + score.site.id;
        if ($.jStorage.get(key)) {
            url = $.jStorage.get(key);
            if (score.popupMessage !== "Calculating..." || score.value !== Number.NaN) {
                score.popupMessage = "Calculating...";
                score.updateValue(Number.NaN);
                score.isValueOld = true; // we're still trying to fetch that URL...
            }
        }
        else {
            //Url has not been established. Run the update score. 
            updateScore(score);
            return;
        }

   
        var fileReq = OpenLayers.Request.GET({
            url: url,
            proxy: "/Proxy/proxy.ashx?",
            callback: function (response) {

                var input = response.responseText;
                input = input.replace(/ -9999/gi, "");
                input = input.replace(/-9999/gi, "");
                var position = input.search("NODATA_value ");
                input = input.substr(position + 13);
                var values = input.split(" ");
                var totalNo = values.length;
                var totalCount = 0;
                for (var i = 0; i < totalNo; i++) {
                    if (values[i] <= slopeConfigProperties.percentT) {
                        totalCount++;
                    }
                }

                var percent = (totalCount * 100.0) / totalNo;

                var message = percent.toFixed(2) + "% of land has less than " + slopeConfigProperties.percentT + "% slope";
                score.popupMessage = message;
                score.updateValue(percent);
                var key = "slopeModule" + score.site.id;
                //Save to local cache
                $.jStorage.deleteKey(key);
                $.jStorage.deleteKey(key + "msg");
                $.jStorage.set(key, percent);
                $.jStorage.set(key + "msg", message);


                return (percent);

            }
        });
    }

    var requestFailureCount = {};

    function updateScore (score) {

        var NearRoadRestUrl = "https://geoserver.byu.edu/arcgis/rest/services/Sloep30m/GPServer/extractpoly";
        //Fetch data from the cache if it exists. 
        var key = "slopeModule" + score.site.id;
        if (isNaN(score.value) && $.jStorage.get(key)) {
            score.popupMessage = "<i>" + $.jStorage.get(key + "msg") + "</i>";
            score.updateValue($.jStorage.get(key));
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
            ],
        };

        //console.log("Esri Json: " + JSON.stringify(esriJsonObj));

        var request = OpenLayers.Request.POST({
            url: NearRoadRestUrl + "/submitJob",
            proxy: "/Proxy/proxy.ashx?",
            data: OpenLayers.Util.getParameterString({ UserPoly: JSON.stringify(esriJsonObj) }) + "+&env%3AoutSR=&env%3AprocessSR=&returnZ=false&returnM=false&f=pjson",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "max-age=0"
            },
            callback: function (response) {
                if (response.status == 200) {

                    var esriJsonParser = new OpenLayers.Format.JSON();
                    esriJsonParser.extractAttributes = true;
                    var parsedResponse = esriJsonParser.read(response.responseText);

                    if (!parsedResponse.error && parsedResponse.jobId) {
                        //console.log("Slope Module Respone: " + JSON.stringify(parsedResponse));

                        //Ohkay Great! Now we have the job Submitted. Lets get the Job ID and then Submit a request for the results. 
                        var finalResponse = {};
                        var jobId = parsedResponse.jobId;
                        requestFailureCount[jobId] = 0;
                        var resultSearcher = setInterval(function () {
                            //Send out another request
                            var resultRequestRepeat = OpenLayers.Request.GET({
                                url: "https://geoserver.byu.edu/arcgis/rest/services/Sloep30m/GPServer/extractpoly/" + "jobs/" + jobId + "/results/slopeout_TXT?f=json",
                                proxy: "/Proxy/proxy.ashx?",
                                callback: function (response) {

                                    if (response.status == 200) {
                                        var esriJsonParser = new OpenLayers.Format.JSON();
                                        esriJsonParser.extractAttributes = true;
                                        var parsedResponse = esriJsonParser.read(response.responseText);

                                        if (!parsedResponse.error) {
                                            //Got Result. Downloading file and processing it. 

                                            clearInterval(resultSearcher);
                                            finalResponse = parsedResponse;
                                            var fileURL = finalResponse.value.url;
                                            var key = "slopeURL" + score.site.id;
                                            //Save to local cache
                                            $.jStorage.deleteKey(key);
                                            $.jStorage.set(key, fileURL);
                                            var result = reCalculate(score);
                                        } else {
                                            // request error might be perminant... need to handle that!
                                            requestFailureCount[jobId] += 1;

                                            if (requestFailureCount[jobId] < 30) { // 30 failures * 4000ms wait = 120 second timeout
                                                console.log("Slope tool job '" + jobId + "' still processing...");
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
                        }, 4000);
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

    pvMapper.moduleManager.registerModule(NewSlopeModule, true);

})(BYUModules || (BYUModules = {}));

