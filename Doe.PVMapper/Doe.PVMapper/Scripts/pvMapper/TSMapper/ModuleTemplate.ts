/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />

module Modules {
    class Module {
        constructor() {
            var myModule: pvMapper.Module = new pvMapper.Module({
                id: "",
                author: "",
                version: "",

                activate: () => { },
                deactivate: null,
                destroy: null,
                init: null,

                scoringTools: [{
                    activate: null,
                    deactivate: null,
                    destroy: null,
                    init: null,

                    title: "",
                    description: "",
                    category: "",
                    onScoreAdded: (event, score) => { },
                    onSiteChange: (event, score: pvMapper.Score) => { },
                    updateScoreCallback: (score: pvMapper.Score) => { },
                }],
                infoTools: null
            });
        }
    }

    var modInstance = new Module();
}