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
        infoTools?: Array<ITool>;
        totalTools?: Array<ITotalTool>;
        //Intents: IIntent[];

        init: ICallback;
        destroy: ICallback;
        activate: ICallback;
        deactivate: ICallback;

        id: string;
        author: string;
        version: string;

        //these are to support custom module naming.
        getModuleName?: () => string;
        setModuleName?: (name: string) => void;
        removeLocalLayer?: any;
    }
}