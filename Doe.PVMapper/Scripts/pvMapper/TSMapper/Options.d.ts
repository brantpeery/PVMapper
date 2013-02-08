/// <reference path="Event.ts" />
//A dynamic callback signature.
interface ICallBack {
  (...args: any[]): any;
}

module pvMapper {
  
  export class Options {
    public onSiteChange(): Event;
    public onScoreAdded(): Event;
    public title: string;
    public description: string;

    public calculateValueCallback: ICallBack;  //(...args: any[]) =>any;
  }
}