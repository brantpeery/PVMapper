/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
var Modules;
(function (Modules) {
    var Module = (function () {
        function Module() {
            var myModule = new pvMapper.Module({
                id: "",
                author: "",
                version: "",
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
                        title: "",
                        description: "",
                        category: "",
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
        return Module;
    })();    
    var modInstance = new Module();
})(Modules || (Modules = {}));
