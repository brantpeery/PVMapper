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
            this.totalTools = options.totalTools;
            if(this.scoringTools) {
                this.scoringTools.map(function (tool, idx, toolarr) {
                    if(console) {
                        console.log("Loading scoring tool " + tool.title + " into the API");
                    }
                    var scoreline = new pvMapper.ScoreLine(tool);
                    pvMapper.mainScoreboard.addLine(scoreline);
                });
            }
            if(this.totalTools) {
                this.totalTools.forEach(function (tool, idx, tools) {
                    if(console) {
                        console.log("Loading total tool " + tool.title + " into the API");
                    }
                    var toolLine = new pvMapper.TotalLine(tool);
                    pvMapper.mainScoreboard.addTotalLine(toolLine);
                });
            }
            if(this.infoTools) {
                this.infoTools.map(function (tool, idx, toolbar) {
                    if(console) {
                        console.log("Loading info tool " + tool.title + " into the API");
                    }
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
