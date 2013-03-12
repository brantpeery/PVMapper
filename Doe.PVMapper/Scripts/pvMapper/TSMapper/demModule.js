/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var BYUModules;
(function (BYUModules) {
    var DemModule = (function () {
        function DemModule() {
            var myModule = new pvMapper.Module({
                id: "DemModule",
                author: "Darian Ramage, BYU",
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
                        title: "Slope Tool",
                        description: "Calculates the average slope of the site",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                        },
                        updateScoreCallback: function (score) {
                        }
                    }, 
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Aspect Tool",
                        description: "Calculates the average aspect of the site",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                        },
                        updateScoreCallback: function (score) {
                        }
                    }, 
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "Elevation Tool",
                        description: "Calculates the averate elevation of the site",
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
        return DemModule;
    })();    
    var modInstance = new DemModule();
    var request = OpenLayers.Request.POST;
})(BYUModules || (BYUModules = {}));
