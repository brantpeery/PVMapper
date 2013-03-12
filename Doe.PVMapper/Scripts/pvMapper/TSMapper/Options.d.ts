/// <reference path="Tools.ts" />
/// <reference path="common.ts" />
/// <reference path="Event.ts" />
//A dynamic callback signature.


module pvMapper {

    export class ScoreLineOptions {
        public onSiteChange(): ICallback;
        public onScoreAdded(): ICallback;
        public title: string;
        public description: string;

        public calculateValueCallback: ICallback;  //(...args: any[]) =>any;
    }

    export interface IModuleOptions {
        scoringTools: IScoreTool[];
        infoTools: ITool[];
        //Intents: IIntent[];
        init: ICallback;
        destroy: ICallback;
        activate: ICallback;
        deactivate: ICallback;
        id: string;
        author: string;
        version: string;
    }
}