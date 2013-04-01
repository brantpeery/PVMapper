/// <reference path="ScoreUtility.ts" />
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

        /**
         * The category of this tool, for hierarchical sorting
         */
        category: string;

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
        updateScoreCallback: (score: Score) => void;
        onSiteChange: (event: EventArg, score: Score) => void;
        onScoreAdded: (event: EventArg, score: Score) => void;

        //TODO: add utility function configuration options here...
        scoreUtilityOptions?: IScoreUtilityOptions;
        defaultWeight?: number;
    }

    export interface IToolAction {

    }
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
        updateScoreCallback: (score: pvMapper.Score) => {
            score.updateValue(1);
        },
        onSiteChange: null,
        onScoreAdded: function (context: any, event: EventArg, score: pvMapper.Score) => void {}
    };

An example of loading the tool after creating it

    var myothertool: IScoreTool;
    myothertool.title = "Other Tool";
    myothertool.updateScoreCallback = (score: pvMapper.Score) => {
        score.updateValue(1);
    }
    myothertool.description = "Some cool tool that does stuff";
    //Finish fleshing out all members of the interface...

*/





