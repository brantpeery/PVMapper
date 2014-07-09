/// <reference path="ScoreLine.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="StarRatingHelper.ts" />
/// <reference path="common.ts" />

module pvMapper {
    export interface IToolJSON {
        id: string;
        title: string;
    }

    export interface ITool extends IToolJSON {
        // the unique ID of the tool; for saving, loading, etc.
        id: string;

        /**
         The title of the tool that will be used in the scoreboard
         Make it short
        */
        //name: string;
        title: string;

        /**
         A short description of the tool: perhaps one sentence with a few clauses. This will be shown in a scoreboard tool tip.
        */
        description: string;

        /**
         The long-form description of the tool: perhaps two paragraphs, with basic HTML tags. This will be shown in reports.
        */
        longDescription: string;

        /**
         * The category of this tool, for hierarchical sorting
         */
        category: string;

        //actions: ToolAction[];

        //Buttons:UIButton[];
        //SiteAttributes:SiteAttribute[];

        //init?: ICallback;
        //destroy?: ICallback;
        activate?: ICallback;
        deactivate?: ICallback;
    }

    export interface IToolLine extends ITool {
        scores: IScore[];
    }


    export interface IInfoToolOptions extends ITool {

    }

    export interface IScoreToolOptions extends ITool {
        /**
        The function that will be called by the API everytime the tool should
        recalculate a value.
        @param site pvMapper.Site The site the tool is recalculating a value for
        @returns number The calculated value
        */
        onSiteChange: (event: EventArg, score: Score) => void;

        // optional members for star ratings (qualitative) tools...
        getStarRatables?: () => IStarRatings;
        setStarRatables?: (ratables: IStarRatings) => void;

        // optional method, implemented on configurable tools, which will show a configuration menu
        showConfigWindow?: () => void;

        // these handle loading and saving the config object
        getConfig?: () => any;
        setConfig?: (options: any) => void;

        scoreUtilityOptions?: IScoreUtilityOptions;
        weight?: number;

        //getModule: () => pvMapper.IModuleHandle;
    }

    /**
     A tool that will provide a total based on statistical analysis of the values in the scoring tools.
     Will normally be placed last on a scoreboard or report to represent the total score, average, mean, mode or whatever other aggragate the tool outputs
    */
    export interface ITotalTool extends ITool {
        /**
         Calculate the aggragate score based on an internal algorithm. 
        //This is called by the TotalLine.UpdateScores() when a value is changed in the Scoreboard

        @param values: array of numbers. The scores for a single site that is to be aggregated.
         Returns a number that is the result of the aggragate.
        */
        CalculateScore: (values: IValueWeight[], site: Site) => IScore;
    }

    export interface IInfoTool extends ITool {

    }
}
