/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />

module BYUModules {
    class DemModule {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "DemModule",
                author: "Darian Ramage, BYU",
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

                    title: "Slope Tool",
                    description: "Calculates the average slope of the site",
                    onScoreAdded: (event, score) => { },
                    onSiteChange: (event, score: pvMapper.Score) => { },
                    updateScoreCallback: (score: pvMapper.Score) => { },
                },
                {
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Aspect Tool",
                    description: "Calculates the average aspect of the site",
                    onScoreAdded: (event, score) => { },
                    onSiteChange: (event, score: pvMapper.Score) => { },
                    updateScoreCallback: (score: pvMapper.Score) => { },
                },
                {
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "Elevation Tool",
                    description: "Calculates the averate elevation of the site",
                    onScoreAdded: (event, score) => { },
                    onSiteChange: (event, score: pvMapper.Score) => { },
                    updateScoreCallback: (score: pvMapper.Score) => { },
                }],
                infoTools: null
            });
        }
    }

    var modInstance = new DemModule();
    var request = OpenLayers.Request.POST;
}

