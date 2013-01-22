/// <reference path="Event.ts" />

module pvMapper {
  
  //A dynamic callback signature.
  interface ICallBack {
     (...args: any[]):any;
  }

  export class Options {
    public onSiteChange(): pvMapper.Event;
    public onScoreAdded(): pvMapper.Event;
    public title: string;
    public description: string;

    public calculateValueCallback: ICallBack;  //(...args: any[]) =>any;
  }
}