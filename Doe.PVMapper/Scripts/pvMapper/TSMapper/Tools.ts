/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="common.ts" />

module pvMapper {
    export interface ITool {
        /**
         The title of the tool that will be used in the scoreboard
         Make it short
        */
        title: string;

        /**
         The description of the tool. This will be visible in reports and as a tool tip
        */
        description: string;

        //actions: ToolAction[];

        //Buttons:UIButton[];
        //SiteAttributes:SiteAttribute[];

        init: ICallback;
        destroy: ICallback;
        activate: ICallback;
        deactivate: ICallback;
    }

    export interface IScoreTool extends ITool {
        /**
        The function that will be called by the API everytime the tool should
        recalculate a value.
        @param site pvMapper.Site The site the tool is recalculating a value for
        @returns number The calculated value
        */
        calculateValueCallback: (site: Site) => number;
        onSiteChange: (context: any, event: EventArg, score: Score) => void;
        onScoreAdded: (context: any, event: EventArg, score: Score) => void;
    }

    export interface IToolAction {

    }


    /* *************************************
    //This block of code is slated to be deleted after code review.Keeping it here just in case reviewers want a concrete class
    
    export class ScoreTool implements IScoreTool {
        constructor(scoreTool: IScoreTool) {
            if (scoreTool !== undefined) {
                //Load up the object
                this.title = scoreTool.title;
                this.description = scoreTool.description;
                this.init = scoreTool.init;
                this.destroy = scoreTool.destroy;
                this.activate = scoreTool.activate;
                this.deactivate = scoreTool.deactivate;
                this.calculateValueCallback = scoreTool.calculateValueCallback;
                this.onSiteChange = scoreTool.onSiteChange;
                this.onScoreAdded = scoreTool.onScoreAdded;
            }


        }

    public title: string;
    public description: string;
    public init: ICallback;
    public destroy: ICallback;
    public activate: ICallback;
    public deactivate: ICallback;

    public calculateValueCallback: (site: Site) => number;
    public onSiteChange: (context: any, event: EventArg, score: Score) => void;
    public onScoreAdded: (context: any, event: EventArg, score: Score) => void;
    }
    *****************************************/



    
}


/**
An example of how to create a tool using the ITool interface

    var mytool: IScoreTool = {
        title: "ThisTool",
        description: "My super sweet score thingy",
        init: null,
        destroy: null,
        activate: null,
        deactivate: null,
        calculateValueCallback: function (site: pvMapper.Site) {
            return 1;
        },
        onSiteChange: null,
        onScoreAdded: function (context: any, event: EventArg, score: pvMapper.Score) => void {}
    };

An example of loading the tool after creating it

    var myothertool: IScoreTool;
    myothertool.title = "Other Tool";
    myothertool.calculateValueCallback = (site: Site) => {
        return 1;
    }
    myothertool.description = "Some cool tool that does stuff";
    //Finish fleshing out all members of the interface...

*/




