/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />

module BYUModules {
    class WildernessModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "WildernessModule",
                author: "Darian Ramage",
                version: "0.1.ts",

                activate: () => { },
                deactivate: null,
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Wilderness",
                    description: "Tells whether the given site is in a wilderness area.  ",
                    onScoreAdded: (event, score) => { },
                    onSiteChange: (event, score: pvMapper.Score) => { },
                    updateScoreCallback: (score: pvMapper.Score) => { },
                }],
                infoTools: null
            });
        }
    }

    var modInstance = new WildernessModule();

    function updateScore(score: pvMapper.Score, layers: string, description?: string) {
        var params = "";
        
        var request = OpenLayers.Request.GET({
            url: "",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: (response) => {
                if (response.status == 200) {

                } else {
                    score.popupMessage = "Connection error " + response.status;
                    score.updateValue(Number.NaN);
                }
            }
        })
    }
}