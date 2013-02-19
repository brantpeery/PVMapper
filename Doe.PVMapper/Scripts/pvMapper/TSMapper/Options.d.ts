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

    export class ModuleOptions {
        public ScoringTools: IScoreTool[];
        public NonScoringTools: ITool[];
        public Intents: IIntent[];
        public init: ICallback;
        public destroy: ICallback;
        public activate: ICallback;
        public deactivate: ICallback;
        public id: string;
        public author: string;
        public version: string;
    }



}