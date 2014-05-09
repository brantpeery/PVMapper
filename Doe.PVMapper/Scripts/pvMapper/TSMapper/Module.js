/// <reference path="Scoreboard.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="../../jquery.d.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    // Class
    var Module = (function () {
        function Module(options) {
            var _this = this;
            this.id = options.id;
            this.version = options.version;
            this.author = options.author;

            this.init = options.init;
            this.destroy = options.destroy;
            this.activate = options.activate;
            this.deactivate = options.deactivate;

            this.scoringTools = options.scoringTools;
            this.infoTools = options.infoTools;
            this.totalTools = options.totalTools;

            //Load the info for this module into the data model
            //Load the scoring tools into the api
            if (this.scoringTools) {
                this.scoringTools.map(function (tool, idx, toolarr) {
                    if (console)
                        console.log("Loading scoring tool " + tool.title + " into the API");

                    //Create the scoreline
                    var scoreline = new pvMapper.ScoreLine(tool);

                    //A delegate function to return a reference to this module which associating with the scoreline, calling from scoreLine module.
                    scoreline.getModule = function (d, f) {
                        if (typeof d === "undefined") { d = _this; }
                        if (typeof f === "undefined") { f = function () {
                            return _this;
                        }; }
                        return f.apply(d, arguments);
                    };
                    _this.getScoreLine = function () {
                        return scoreline;
                    };

                    //Add the scoreline to the scoreboard/data model
                    pvMapper.mainScoreboard.addLine(scoreline);
                });
            }

            //Load in the TotalLine tools into the api
            if (this.totalTools) {
                this.totalTools.forEach(function (tool, idx, tools) {
                    if (console)
                        console.log("Loading total tool " + tool.title + " into the API");

                    //Create the tool
                    var toolLine = new pvMapper.TotalLine(tool);
                    pvMapper.mainScoreboard.addTotalLine(toolLine);
                });
            }

            //Load up the info tools into the api
            if (this.infoTools) {
                this.infoTools.map(function (tool, idx, toolbar) {
                    if (console)
                        console.log("Loading info tool " + tool.title + " into the API");

                    pvMapper.addInfoTool(new pvMapper.InfoTool(tool));
                    //TODO: Tie to the data model when ready
                });
            }

            //TODO: temp - call Init and Activate on the module, because all modules will be inited and activated by default
            if (typeof (this.init) === "function") {
                pvMapper.onReady(this.init);
            }
            if (typeof (this.activate) === "function") {
                pvMapper.onReady(this.activate);
            }

            if ($.isFunction(options.getModuleName)) {
                this.getModuleName = function () {
                    return options.getModuleName.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.setModuleName)) {
                this.setModuleName = function (name) {
                    options.setModuleName.apply(_this, arguments);
                };
            }
        }
        return Module;
    })();
    pvMapper.Module = Module;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=Module.js.map
