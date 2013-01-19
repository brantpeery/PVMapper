/// <reference path="OpenLayers.d.ts" />
/// <reference path="Site.ts" />
/// <reference path="Score.ts" />
/// <reference path="Options.d.ts" />

interface ISiteCallback {
  (site: pvMapper.Site, setbackLength?: number): any;
}

interface ICalculateAreaCallback {
  (geometry: OpenLayers.Geometry, offset?: number): number;
}

interface IScoringTool {
  calculateCallback: ISiteCallback;
}



// Module
module pvMapper {
  export class ScoreEvent extends Event {

}


  // Class
  export class ScoringTool implements IScoringTool {

    // Constructor
    constructor () { }
    public title: string;
    public description: string;
    public calculateCallback: ISiteCallback = null;
    public onSiteChange(event: Event, score: Score) { //Fires when a score has been notified that it's site has changed
      if (this.updateCallback != null)
        this.updateCallback(score.site);

      //Update the property (only do this if this is a very fast calculation)
      if (this.calculateCallback != null)
        score.updateValue(this.calculateCallback(score.site));  //Do it this way so the score can manage getting itself refreshed on the screen and in the DB
    }
    public onScoreAdded(event: ScoreEvent, score: Score) {

      //This will be called when a score is added to the scoreline that represents this tool
      //Really don't need to do anything here as the framework will be asking for the updated value later
    }

    //these are delegate function place holders.
    public updateCallback: ISiteCallback = null;
  }


  export class Intent {
    public Area(geometry: OpenLayers.Geometry): number {
      if (this.calculateArea != null)
        return this.calculateArea(geometry);
      else
        return null;
    }
    public OffsetArea(geometry: OpenLayers.Geometry, offset: number): number {
      if (this.calculateArea != null)
        return this.calculateArea(geometry, offset);
      else
        return null;
    }
    public calculateArea: ICalculateAreaCallback = null;
  }

}
