var BYUModules;
(function (BYUModules) {
    var WildernessModule = (function () {
        function WildernessModule() {
            var myModule = new pvMapper.Module({
                id: "WildernessModule",
                author: "Darian Ramage",
                version: "0.1.ts",
                activate: function () {
                },
                deactivate: null,
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
    function updateScore(score, layers, description) {
        var params = "";
        var request = OpenLayers.Request.GET({
            url: "",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: function (response) {
                if(response.status == 200) {
                } else {
                    score.popupMessage = "Connection error " + response.status;
                    score.updateValue(Number.NaN);
                }
            }
        });
    }
})(BYUModules || (BYUModules = {}));
