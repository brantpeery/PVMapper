/// <reference path="Scoreboard.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="Tools.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="../../jquery.d.ts" />


// Module
module pvMapper {

    ////Note: I have no idea why we've built modules this way... it seems crazy to me... but, I'll add interfaces to document the crazy might help.
    //export interface IModuleFactory {
    //    new (): IModuleHandle

    //    //TODO: move these values here - from their current location within IModuleOptions.
    //    //id: string;
    //    //author: string;
    //    //version: string;

    //    // add these to make it easier for the ModuleManager stuff.
    //    title: string;
    //    category: string;
    //    description: string;
    //    longDescription: string;
    //}

    ////Note: I have no idea why we've built modules this way... it seems crazy to me... but, I'll add interfaces to document the crazy.
    //export interface IModuleHandle {
    //    getModuleObj: () => Module;
    //    getFactory: () => IModuleFactory;
    //}

    ////Note: I have no idea why we've built modules this way... it seems crazy to me... but, I'll add interfaces to document the crazy might help.
    //export interface ICustomModuleHandle extends IModuleHandle {
    //    fileName: string;
    //}

    //export interface IModuleOptions {
    //    scoringTools?: IScoreToolOptions[];
    //    infoTools?: Array<ITool>;
    //    totalTools?: Array<ITotalTool>;
    //    //Intents: IIntent[];

    //    //init: ICallback;
    //    //destroy: ICallback;
    //    activate: ICallback;
    //    deactivate: ICallback;

    //    id: string;
    //    author: string;
    //    version: string;

    //    //these are to support custom module naming.
    //    //getModuleName?: () => string;
    //    //setModuleName?: (name: string) => void;
    //    //removeLocalLayer?: any;
    //}

    export interface IModuleOptions {
        scoringTools?: IScoreToolOptions[];
        infoTools?: Array<ITool>;
        totalTools?: Array<ITotalTool>;
        //Intents: IIntent[];

        //init: ICallback;
        //destroy: ICallback;
        activate?: ICallback;
        deactivate?: ICallback;

        //these are to support custom module naming.
        //getModuleName?: () => string;
        //setModuleName?: (name: string) => void;
        //removeLocalLayer?: any;
    }

    export interface IModuleInfoJSON {
        id: string;
        author: string;
        version: string;
        url: string;

        // add these to make it easier for the ModuleManager stuff.
        title: string;
        category: string;
        description: string;
        longDescription?: string;

        isActive?: boolean;
    }

    export interface IModule extends IModuleInfoJSON {
        activate();
        deactivate();

        //toJSON(): IModuleInfo;
        //fromJSON(IModuleInfo);
    }

    // Class
    export class Module implements IModule {
        constructor(moduleInfo?: IModuleInfoJSON) { // optional constructor... this attempts to support our older calling style.
            if (moduleInfo) {
                if (moduleInfo.id) this.id = moduleInfo.id;
                if (moduleInfo.author) this.author = moduleInfo.author;
                if (moduleInfo.version) this.version = moduleInfo.version;
                if (moduleInfo.url) this.url = moduleInfo.url;

                if (moduleInfo.title) this.title = moduleInfo.title;
                if (moduleInfo.category) this.category = moduleInfo.category;
                if (moduleInfo.description) this.description = moduleInfo.description;
                if (moduleInfo.longDescription) this.longDescription = moduleInfo.longDescription;
                //else if (moduleInfo.description) this.longDescription = "<p>" + moduleInfo.description + "</p>"; // backup plan for absent long descriptions...

                var modOptions = <IModuleOptions>moduleInfo;
                if (modOptions.activate || modOptions.deactivate || modOptions.infoTools || modOptions.scoringTools || modOptions.totalTools)
                    this.init(modOptions);
            }
        }
        public init = (options: IModuleOptions) => {
            if (console && console.assert) console.assert(options && !this.options, "Warning: attempting to initialize an already initialized module");
            this.options = options;

            // make sure our required attributes have been defined by the inheriting class...
            if (console && console.assert) console.assert(!!(this.id && this.author && this.version && this.url &&
                this.title && this.category && this.description /*&& this.longDescription*/, // <-- long descrition isn't strictly required
                "Warning: initializing module '" + (this.id || this.title) + "' without a required property.")); 

            this.scoreTools = (this.scoreTools || [])
                .concat((options.scoringTools || []).map(t => new ScoreLine(t, this)));

            this.totalTools = (this.totalTools || [])
                .concat((options.totalTools || []).map(t => new TotalLine(t, this)));

            this.infoTools = (this.infoTools || [])
                .concat((options.infoTools || []).map(t => new InfoTool(t, this)));
        }

        public id: string;
        public author: string;
        public version: string;
        public url: string;

        public title: string;
        public category: string;
        public description: string;
        public longDescription: string;

        public isActive: boolean = false;

        private options: IModuleOptions;

        public scoreTools: ScoreLine[] = [];
        public infoTools: InfoTool[] = [];
        public totalTools: TotalLine[] = [];

        public activate = () => {
            if (console && console.assert) console.assert(pvMapper.isReady);

            if (this.isActive) {
                if (console && console.warn) console.warn("Warning: attempting to activate an already active module ID='" + this.id + "'");
            }

            if (!this.isActive && this.options && typeof (this.options.activate) === "function")
                this.options.activate();

            //Load the info for this module into the data model
            //Load the scoring tools into the api
            this.scoreTools.forEach((tool) => {
                if (!tool.isActive)
                    tool.activate();
            });

            //Load in the TotalLine tools into the api
            this.totalTools.forEach((tool) => {
                pvMapper.mainScoreboard.addTotalLine(tool);
            });

            //Load up the info tools into the api
            this.infoTools.forEach((tool) => {
                if (typeof (tool.activate) === "function")
                    tool.activate();
            });

            this.isActive = true;
        }

        public deactivate = () => {
            if (!this.isActive) {
                if (console && console.warn) console.warn("Warning: attempting to deactivate an already inactive module ID='" + this.id + "'");
            }

            //Load the info for this module into the data model
            //Load the scoring tools into the api
            this.scoreTools.forEach((tool) => {
                if (tool.isActive)
                    tool.deactivate();
            });

            //Load in the TotalLine tools into the api
            this.totalTools.forEach((tool) => {
                pvMapper.mainScoreboard.removeTotalLine(tool);
            });

            //Load up the info tools into the api
            this.infoTools.forEach((tool) => {
                if (typeof (tool.deactivate) === "function")
                    tool.deactivate();
            });

            if (this.options && typeof (this.options.deactivate) === "function")
                this.options.deactivate();

            this.isActive = false;
        }
    }
}

