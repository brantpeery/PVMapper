var pvMapper;
(function (pvMapper) {
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
            this.scoringTools.map(function (tool, idx, toolarr) {
                console.log("Loading scoring tool " + tool.title + " into the API");
                var scoreline = new pvMapper.ScoreLine(tool);
                pvMapper.mainScoreboard.addLine(scoreline);
            });
            if(this.infoTools) {
                this.infoTools.map(function (tool, idx, toolbar) {
                    console.log("Loading info tool " + tool.title + " into the API");
                });
            }
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
