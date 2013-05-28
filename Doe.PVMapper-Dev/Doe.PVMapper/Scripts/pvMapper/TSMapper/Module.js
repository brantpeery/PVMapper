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
            this.id = options.id;
            this.version = options.version;
            this.author = options.author;
            this.init = options.init;
            this.destroy = options.destroy;
            this.activate = options.activate;
            this.deactivate = options.deactivate;
            this.scoringTools = options.scoringTools;
            this.infoTools = options.infoTools;
            //Load the info for this module into the data model
            //Load the scoring tools into the api
            this.scoringTools.map(function (tool, idx, toolarr) {
                if(console) {
                    console.log("Loading scoring tool " + tool.title + " into the API");
                }
                //Create the scoreline
                var scoreline = new pvMapper.ScoreLine(tool);
                //Add the scoreline to the scoreboard/data model
                pvMapper.mainScoreboard.addLine(scoreline);
            });
            //Load up the info tools into the api
            if(this.infoTools) {
                this.infoTools.map(function (tool, idx, toolbar) {
                    if(console) {
                        console.log("Loading info tool " + tool.title + " into the API");
                    }
                    //TODO: Tie to the data model when ready
                                    });
            }
            //TODO: temp - call Init and Activate on the module, because all modules will be inited and activated by default
            if(typeof (this.init) === "function") {
                pvMapper.onReady(this.init);
            }
            if(typeof (this.activate) === "function") {
                pvMapper.onReady(this.activate);
            }
        }
        return Module;
    })();
    pvMapper.Module = Module;    
})(pvMapper || (pvMapper = {}));
