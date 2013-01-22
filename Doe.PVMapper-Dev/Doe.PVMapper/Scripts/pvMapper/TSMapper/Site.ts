
/// <reference path="OpenLayers.d.ts" />
/// <reference path="Event.ts" />

module pvMapper {
  export class Site {
    //The parameter list:
    // site = the feature object from Open Layers that represents this siet

    constructor (public feature: OpenLayers.SiteFeature) {
      //if (!feature instanceof(OpenLayers.Feature)) 
      //  throw ('The parameter "feature" must be an OpenLayers.Feature');
      this.self = this;
      this.id = feature.fid;
      this.site = feature;
      this.geometry = feature.geometry;
      this.name = feature.name;
      this.description = feature.description;
    }
    public self: any; //Reference to this object 
    public id: number; //The id that came from the DB
    public site: OpenLayers.SiteFeature; //The site object from Open Layers
    public geometry: OpenLayers.Polygon; //The site boundry 
    public name: string; //The saved name of the site
    public description: string; //The long description of the site
    public offsetFeature: OpenLayers.FVector=null; //The offset Open Layers feature (depreciated)
    public popupHTML: string =''; //The short description in HTML that will show as a tooltip or popup bubble
 

    public selectEvent: pvMapper.Event = new pvMapper.Event();
    public changeEvent: pvMapper.Event = new pvMapper.Event();
    public destroyEvent: pvMapper.Event = new pvMapper.Event();
    public labelChangeEvent: pvMapper.Event = new pvMapper.Event();
    public unselectEvent: pvMapper.Event = new pvMapper.Event();

    public onFeatureSelected(event: any) {
      this.selectEvent.fire(this.self, event);
    };
        
    public onFeatureChange(event : any) {
    //This was declare originally to use ...fire(self,event) where self=this at instantiation, but using 'this' in TS is more direct but will it work?
      this.changeEvent.fire(this.self, event);
    }

    public select() {

    }


  }
}



