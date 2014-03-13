//SLope Module involving client side calculation. 

var BYUModules;
(function (BYUModules) {
   
    var lineConfigProperties = {
        percentT: 5
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
                    { 'display': '2 %', 'value': 2 },
                    { 'display': '4 %', 'value': 4 },
                    { 'display': '5 %', 'value': 5 }
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
            source: lineConfigProperties,
            customRenderers: {
                percentT: function (v) {
                    return v + " %";
                }
            },
            propertyNames: {
                percentT: 'Maximum Slope',
            },
            customEditors: {
                'percentT': new Ext.form.ComboBox(comboConfig),
               
            }
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
                    myToolLine.scores.forEach(function (score) {
                       reCalculate(score);
                    });
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


    var NewSlopeModule = (function () {
        function NewSlopeModule() {
            var _this = this;
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "SlopeCModule",
                author: "Rohit Khattar",
                version: "0.1",
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        showConfigWindow: function () {
                            myToolLine = this;
                            propsWindow.show();
                        },
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Slope",
                        description: "Slope percentage exceeding the described threshold(Default : 5%)",
                        category: "Geography",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            functionName: "linear",
                            functionArgs: new pvMapper.MinMaxUtilityArgs(10, 0, "%")
                        },
                        defaultWeight: 10
                    }
                ],
                infoTools: null
            });
        }

        NewSlopeModule.prototype.updateScore = function (score) {
            updateScore(score);
        }
      
        return NewSlopeModule;
    })();
    BYUModules.NewSlopeModule = NewSlopeModule;
    var modInstance = new BYUModules.NewSlopeModule();

    function reCalculate (score) {

        var key = "slopeURL" + score.site.id;
        if ($.jStorage.get(key)) {
            url = $.jStorage.get(key);
            score.popupMessage = "<i>Calculating...</i>";
            score.updateValue(0);
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
                    if (values[i] > lineConfigProperties.percentT) {
                        totalCount++;
                    }
                }

                var percent = (totalCount * 100.0) / totalNo;
                percent = percent.toFixed(2);

                var message = percent + "% of land has greater than " + lineConfigProperties.percentT + "% slope";
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

    function updateScore (score) {

        var NearRoadRestUrl = "http://geoserver.byu.edu/arcgis/rest/services/wst_slope/GPServer/extractpoly";
        //Fetch data from the cache if it exists. 
        var key = "slopeModule" + score.site.id;
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

        //console.log("Esri Json: " + JSON.stringify(esriJsonObj));

        var request = OpenLayers.Request.POST({
            url: NearRoadRestUrl + "/submitJob",
            proxy: "/Proxy/proxy.ashx?",
            data: OpenLayers.Util.getParameterString({ Utah_user: JSON.stringify(esriJsonObj) }) + "+&env%3AoutSR=&env%3AprocessSR=&returnZ=false&returnM=false&f=pjson",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "max-age=0"
            },
            callback: function (response) {
                if (response.status == 200) {

                    var esriJsonParser = new OpenLayers.Format.JSON();
                    esriJsonParser.extractAttributes = true;
                    var parsedResponse = esriJsonParser.read(response.responseText);

                    //console.log("Slope Module Respone: " + JSON.stringify(parsedResponse));

                    //Ohkay Great! Now we have the job Submitted. Lets get the Job ID and then Submit a request for the results. 
                    var finalResponse = {};
                    var jobId = parsedResponse.jobId;
                    var resultSearcher = setInterval(function () {
                        console.log("Job Still Processing");
                        console.log(jobId);
                        //Send out another request
                        var resultRequestRepeat = OpenLayers.Request.GET({
                           
                                url: "http://geoserver.byu.edu/arcgis/rest/services/wst_slope/GPServer/extractpoly/" + "jobs/" + jobId + "/results/slopeout_TXT?f=json",
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
                    }, 4000);

                } else {
                    score.popupMessage = "Error " + response.status;
                    score.updateValue(Number.NaN);
                }
            }
        });
    };


})(BYUModules || (BYUModules = {}));
