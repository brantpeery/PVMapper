var BYUModules;
(function (BYUModules) {
    var WildernessModule = (function () {
        function WildernessModule() {
            var myModule = new pvMapper.Module({
                id: "WildernessModule",
                author: "Darian Ramage",
                version: "0.1.ts",
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
                        title: "Wilderness",
                        description: "Tells whether the given site is in a wilderness area.  ",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                        },
                        updateScoreCallback: function (score) {
                        }
                    }
                ],
                infoTools: null
            });
        }
        return WildernessModule;
    })();    
    var modInstance = new WildernessModule();
    var WildernessMapUrl = "";
    var wildernessLayer;
    function addMap() {
        pvMapper.map.addLayer(wildernessLayer);
    }
    function removeMap() {
    }
    function updateScore(score, layers, description) {
        var params = "";
        var request = OpenLayers.Request.GET({
            url: "",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: function (response) {
                if(response.status == 200) {
                    var esriJsonParser = new OpenLayers.Format.JSON();
                    esriJsonParser.extractAttributes = true;
                } else {
                    score.popupMessage = "Connection error " + response.status;
                    score.updateValue(Number.NaN);
                }
            }
        });
    }
})(BYUModules || (BYUModules = {}));
