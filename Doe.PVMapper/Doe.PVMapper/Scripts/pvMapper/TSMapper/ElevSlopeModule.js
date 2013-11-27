var BYUModules;
(function (BYUModules) {

    //NearRoadScore Hash to keep a track of its score object and make updates when the result comes back from the River module's Request
    var ElevScoreKeeper = {};


    var ElevSlopeModule = (function () {
        function ElevSlopeModule() {
            var myModule = new pvMapper.Module({
                id: "ElevSlopeModule",
                author: "Rohit Khattar, BYU",
                version: "0.1",
                activate: function () {
                    addMap();
                },
                deactivate: function () {
                    removeMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Elevation",
                        description: "The average elevation of the site, using data from ArcGIS Online",
                        category: "Geography",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            ElevScoreKeeper[score.site.id] = score;
                            //updateScore(score, "any:1", "m");
                        },
                        scoreUtilityOptions: {
                            functionName: "linear3pt",
                            functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.5, 1000, 0.9, 6000, 1, "m")
                        }
                    },
                    {
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,
                    title: "Aspect",
                    description: "The average horizontal aspect of the site, using data from ArcGIS Online",
                    category: "Geography",
                    onScoreAdded: function (event, score) {
                    },
                    onSiteChange: function (event, score) {
                        updateScore(score);
                    },
                    scoreUtilityOptions: {
                        functionName: "linear3pt",
                        functionArgs: new pvMapper.ThreePointUtilityArgs(0, 0.5, 180, 1, 360, 0.5, "degrees")
                    }
                }
                ],
                infoTools: null
            });
        }
        return ElevSlopeModule;
    })();

    var modInstance = new ElevSlopeModule();

    var topoMapRestUrl = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/";
    var topoMapLayer;

    function addMap() {
        topoMapLayer = new OpenLayers.Layer.ArcGIS93Rest("World Topography", topoMapRestUrl + "export", {
            layers: "visible",
            format: "gif",
            srs: "3857"
        }, { isBaseLayer: true });

        topoMapLayer.epsgOverride = "3857";
        topoMapLayer.setVisibility(false);
        pvMapper.map.addLayer(topoMapLayer);
    }

    function removeMap() {
        pvMapper.map.removeLayer(topoMapLayer, false);
    }

    function fetchCache(score, key)
    {
        key += score.site.id;
        if ($.jStorage.get(key)) {
            score.popupMessage = "<i>" + $.jStorage.get(key + "msg") + "</i>";
            score.updateValue($.jStorage.get(key));
        }
    }

    function updateScore(score) {
        fetchCache(ElevScoreKeeper[score.site.id], "ElevScore");
        fetchCache(score, "aspectScore");
        sendRequest(score);
    }

    function sendRequest(score)
    {
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
            ]};

        console.log(JSON.stringify(esriJsonObj));

        var request = OpenLayers.Request.POST({
            url: "http://geoserver.byu.edu/arcgis/rest/services/test_slope/GPServer/extractmask/submitJob",
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
                    console.log(parsedResponse);
                    var jobID =  parsedResponse.jobId;
                    getResult(score, jobID, "AspectMean", "aspectScore", "degrees");
                    getResult(ElevScoreKeeper[score.site.id], jobID, "ElevationMean", "ElevScore", "m");

                     } else {
                        score.popupMessage = "Error " + response.status;
                        score.updateValue(Number.NaN);
                            }
                    }
            });
    }

    function saveCache(scoreVal, scoreMsg, cacheKey)
    {
        cacheKey += score.site.id;
        //Save to local cache
        $.jStorage.deleteKey(cacheKey);
        $.jStorage.deleteKey(cacheKey + "msg");
        $.jStorage.set(cacheKey, scoreVal);
        $.jStorage.set(cacheKey + "msg", scoreMsg);
    }

    function  getResult(score, jobID, resultKey, cacheKey, unit)
    {
        var resultSearcher = setInterval(function () {
            console.log("Getting Score for : " + resultKey + ". Job Still being processed on server");
            var resultRequestRepeat = OpenLayers.Request.GET({
                url: "https://geoserver.byu.edu/arcgis/rest/services/test_slope/GPServer/extractmask/jobs/" + jobID + "/results/" + resultKey + "?f=json",
                proxy: "/Proxy/proxy.ashx?",
                callback: function (response) {
                    if (response.status == 200) {
                        var esriJsonParser = new OpenLayers.Format.JSON();
                        esriJsonParser.extractAttributes = true;
                        var parsedResponse = esriJsonParser.read(response.responseText);
                        if (!parsedResponse.error) {
                            //Finally got Result. Lets Send it to the console for now and break from this stupid loop!
                            clearInterval(resultSearcher);
                            if (parsedResponse && parsedResponse.value) {

                                var scoreVal = parseFloat(parsedResponse.value).toFixed(2);
                                var scoreMsg = parsedResponse.value + " " + unit;
                                score.popupMessage = (scoreMsg);
                                score.updateValue(scoreVal);
                                saveCache(scoreVal, scoreMsg, cacheKey);
                              
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

    }

})(BYUModules || (BYUModules = {}));

