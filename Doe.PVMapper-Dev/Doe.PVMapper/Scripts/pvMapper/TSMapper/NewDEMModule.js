//var Modules;
//(function (Modules) {
//    var Module = (function () {
//        function Module() {
//            var _this = this;
//            this.restUrl = "";
//            this.landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
//            var myModule = new pvMapper.Module({
//                id: "",
//                author: "",
//                version: "",
//                activate: function () {
//                    _this.addMap();
//                },
//                deactivate: function () {
//                    _this.removeMap();
//                },
//                destroy: null,
//                init: null,
//                scoringTools: [
//                    {
//                        title: "",
//                        description: "",
//                        category: "",
//                        onScoreAdded: function (event, score) {
//                        },
//                        onSiteChange: function (event, score) {
//                            _this.updateScore(score);
//                        },
//                        scoreUtilityOptions: {
//                            functionArgs: new pvMapper.MinMaxUtilityArgs(),
//                            functionName: "linear"
//                        }
//                    }
//                ],
//                infoTools: null
//            });
//        }
//        Module.prototype.addMap = function () {
//        };

//        Module.prototype.removeMap = function () {
//        };

//        Module.prototype.updateScore = function (score) {
//        };
//        return Module;
//    })();
//    Modules.Module = Module;

//    var modInstance = new Module();
//})(Modules || (Modules = {}));
