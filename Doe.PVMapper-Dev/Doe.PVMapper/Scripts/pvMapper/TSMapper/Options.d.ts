/// <reference path="common.ts" />
/// <reference path="Event.ts" />
//A dynamic callback signature.


module pvMapper {
  
  export class Options {
    public onSiteChange(): Event;
    public onScoreAdded(): Event;
    public title: string;
    public description: string;

    public calculateValueCallback: ICallBack;  //(...args: any[]) =>any;
  }
}