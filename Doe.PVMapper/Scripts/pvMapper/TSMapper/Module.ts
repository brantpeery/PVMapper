/// <reference path="Scoreboard.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="../../jquery.d.ts" />


// Module
module pvMapper {

    //Note: I have no idea why we've built modules this way... it seems crazy to me... but, interfaces to document the crazy might help.
    export interface IModuleFactory {
        new (): IModuleHandle

        // add these to make it easier for the ModuleManager stuff.
        title: string;
        category: string;
        description: string;
        longDescription: string;
    }

    //Note: I have no idea why we've built modules this way... it seems crazy to me... but, interfaces to document the crazy might help.
    export interface IModuleHandle {
        getModuleObj: () => Module; // IModuleOptions;
    }

    // Class
    export class Module implements IModuleOptions {
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
                    var scoreline: pvMapper.ScoreLine = new pvMapper.ScoreLine(tool);

                    //A delegate function to return a reference to this module which associating with the scoreline, calling from scoreLine module.
                    scoreline.getModule = (d = this, f= () => this) => f.apply(d, arguments);
                    this.getScoreLine = function () { return scoreline; };

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

                    pvMapper.addInfoTool(new InfoTool(tool));
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
                this.getModuleName = () => { return options.getModuleName.apply(this, arguments); }
            }

            if ($.isFunction(options.setModuleName)) {
                this.setModuleName = (name: string) => { options.setModuleName.apply(this, arguments); }
            }
        }

        public id: string;
        public author: string;
        public version: string;

        public scoringTools: IScoreToolOptions[];
        public infoTools: ITool[];
        public totalTools: ITotalTool[];


        public init: ICallback;
        public destroy: ICallback;
        public activate: ICallback;
        public deactivate: ICallback;

        getModuleName: () => string;
        setModuleName: (name: string) => void;
        getScoreLine: () => pvMapper.ScoreLine;


    }

}

