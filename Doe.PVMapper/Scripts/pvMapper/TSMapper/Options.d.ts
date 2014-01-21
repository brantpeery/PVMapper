/// <reference path="Tools.ts" />
/// <reference path="common.ts" />
/// <reference path="Event.ts" />
//A dynamic callback signature.


declare module pvMapper {
    
    //export class ScoreLineOptions {
    //    public onSiteChange(): ICallback;
    //    public onScoreAdded(): ICallback;
    //    public title: string;
    //    public description: string;

    //    public calculateValueCallback: ICallback;  //(...args: any[]) =>any;

    //    public scoreUtility;
    //}

    export interface IModuleOptions {
        scoringTools?: IScoreToolOptions[];
        infoTools?: ITool[];
        totalTools?: ITotalTool[];
        //Intents: IIntent[];

        init: ICallback;
        destroy: ICallback;
        activate: ICallback;
        deactivate: ICallback;

        id: string;
        author: string;
        version: string;

        getModuleName?: () => string;
        setModuleName?: (name: string) => void;
    }
}