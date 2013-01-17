/// <reference path="siteAreaModule.ts" />
/// <reference path="../../jquery.d.ts" />


// Module
module pvMapper {

  // Class
  export class Module {
    // Constructor
    constructor (options: any) {
      this.settings =

      this.self = this;
      this.id = (typeof (this.self.settings.id) === 'string') ? this.self.settings.id : '';
      this.author = (typeof (this.self.settings.author) === 'string') ? this.self.settings.author : '';
      this.ScoringTools = new ScoringTool[]();
      var st: ScoringTool = new ScoringTool();
      st.calculateCallback = this.calculateSiteArea;
      st.updateCallback = this.updateSetbackFeature;

      this.ScoringTools.push(st);
    }

    public self: Module;
    public defaults: Module;
    public id: string = "";
    public author: string = "";
    public version: string = "";

    //Called when the tool is loaded as a module.
    public init() { };
      //Called when the tool needs to completely remove itself from the interface and object tree
    public destroy() { };
      //Called when the tool is checkmarked or activated by the system or user
    public activate() { };
      //Called when the tool is unchecked or deactivated by the system or user
    public deactivate() { };

    public settings: Module; // = $.extend({}, this.defaults, options);

    public nonScoringTools: any[];
    public ScoringTools: ScoringTool[];

    public calculateArea(polygon: OpenLayers.Polygon): number {

      var proj: OpenLayers.Projection = new OpenLayers.Projection('EPSG:900913');
      var area: number = polygon.getGeodesicArea(proj);
      var kmArea = area / 1000000;

      return Math.round(kmArea * 100) / 100;
    }

    public calculateSiteArea(site: Site): number {
      //Use the geometry of the OpenLayers feature to get the area
      var val = this.calculateArea(site.feature.geometry);
      return val;

    }

    public setbackLayer: any;

    public updateSetbackFeature(site: Site, setback: number) {
      var reader = new jsts.io.WKTReader();
      var parser = new jsts.io.OpenLayersParser();

      var input = parser.read(site.feature.geometry);
      var buffer = input.buffer(-1 * setback); //Inset the feature
      var newGeometry = parser.write(buffer);

      if (!this.setbackLayer) {
        this.setbackLayer = new OpenLayers.Layer.Vector("Site Setback");
        pvM.map.addLayer(setbackLayer);
      }

      if (site.offsetFeature) {
        //Redraw the polygon
        setbackLayer.removeFeatures(site.offsetFeature);
        site.offsetFeature.geometry = newGeometry; //This probably wont work
      } else {
        var style = { fillColor: 'blue', fillOpacity: 0, strokeWidth: 3, strokeColor: "purple" };
        site.offsetFeature = new OpenLayers.Feature.Vector(newGeometry, { parentFID: site.feature.fid }, style);
      }
      setbackLayer.addFeatures(site.offsetFeature);


    }

  }

}

