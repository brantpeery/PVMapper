/// <reference path="pvMapper.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="Module.ts" />
/// <reference path="../../Esri-GeoJsonConverter.js />
var Modules;
(function (Modules) {
    var Module = (function () {
        function Module() {
            var _this = this;
            //URL of rest service for desired layer
            this.restUrl = "";
            //Land bounds taken from LandUseModule
            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
            var myModule = new pvMapper.Module({
                id: "",
                author: "",
                version: "",
                activate: function () {
                    _this.addMap();
                },
                deactivate: function () {
                    _this.removeMap();
                },
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        title: //activate: null,
                        //deactivate: null,
                        //destroy: null,
                        //init: null,
                        "",
                        description: "",
                        category: "",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                            _this.updateScore(score);
                        },
                        scoreUtilityOptions: {
                            functionArgs: //Replace these with desired scoreUtility
                            {
                            },
                            functionName: "linear"
                        }
                    }
                ],
                infoTools: null
            });
        }
        Module.prototype.addMap = //These functions are used to add and remove the layer from the main map when
        //activated and deactivated
        function () {
        };
        Module.prototype.removeMap = function () {
        };
        Module.prototype.updateScore = //Function used to update the score in the scoreboard
        function (score) {
        };
        return Module;
    })();
    Modules.Module = Module;    
    var modInstance = new Module();
})(Modules || (Modules = {}));
//@ sourceMappingURL=ModuleTemplate.js.map
