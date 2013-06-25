/// <reference path="Scoreboard.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="../../jquery.d.ts" />


// Module
module pvMapper {

  // Class
  export class Module {
        constructor(options: IModuleOptions) {
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
                this.scoringTools.map((tool, idx, toolarr) => {
                    if (console) console.log("Loading scoring tool " + tool.title + " into the API");

                    //Create the scoreline
                    var scoreline = new ScoreLine(tool);

                    //Add the scoreline to the scoreboard/data model
                    pvMapper.mainScoreboard.addLine(scoreline);
                });
            }

            //Load in the TotalLine tools into the api
            if (this.totalTools) {
                this.totalTools.forEach((tool, idx, tools) => {
                    if (console) console.log("Loading total tool " + tool.title + " into the API");

                    //Create the tool
                    var toolLine = new TotalLine(tool);
                    pvMapper.mainScoreboard.addTotalLine(toolLine);
                });
            }

            //Load up the info tools into the api
            if (this.infoTools) {
                this.infoTools.map((tool, idx, toolbar) => {
                    if (console) console.log("Loading info tool " + tool.title + " into the API");

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
        }

        public id: string;
        public author: string;
        public version: string;

        public scoringTools: IScoreTool[];
        public infoTools: ITool[];
        public totalTools: ITotalTool[];
        
        
        public init: ICallback;
        public destroy: ICallback;
        public activate: ICallback;
        public deactivate: ICallback;

    }

}

