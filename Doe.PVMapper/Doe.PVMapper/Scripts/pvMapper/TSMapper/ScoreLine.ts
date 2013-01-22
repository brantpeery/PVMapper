/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="SiteManager.ts" />


// Module
module pvMapper {
//  import pvM = pvMapper;

  // Class
  export class ScoreLine {
    // Constructor
    constructor (options: Options) {
      this.self = this;
      this.name = (typeof (options.title) === 'string') ? options.title : 'Unnamed Tool'; 
      this.description = (typeof (options.description) === 'string') ? options.description : 'Unname Tool';
      this.siteChangeHandler.addHandler( ($.isFunction(options.onSiteChange)) ? options.onSiteChange : null);
      if ($.isFunction(options.onScoreAdded)) {
        this.scoreAddedEvent.addHandler(options.onScoreAdded);
      }

      siteManager.siteAdded.addHandler(this.onSiteAdded);
      siteManager.siteRemoved.addHandler(this.onSiteRemove);

      this.loadAllSites();
    }
    public name: string;
    public description: string;
    public scores: Score[] = new Score[]();
    public getvalue:ICallBack = options.calculateValueCallback;

    public self: ScoreLine;
    public scoreAddedEvent: pvMapper.Event = new pvMapper.Event();
    public scoreChangeEvent: pvMapper.Event = new pvMapper.Event();
    public updatingScoresEvent: pvMapper.Event = new pvMapper.Event();
    public siteChangeHandler: pvMapper.Event = new pvMapper.Event();

    public getUtilityScore(): number { return 0;  }
    public getWeight(): number { return 0; }
    public getWeightedUtilityScore(): number { return 0; }
    public addScore(site: pvMapper.Site): pvMapper.Score { 
      var score: pvMapper.Score = new pvMapper.Score(site);
      score.siteChangeEvent.addHandler(this.siteChangeHandler); //attach the tool's handler directly to the score
      //subscribe to the score updated event
      score.valueChangeEvent.addHandler(this.valueChangeHandler);

      this.self.scores.push(score);
//      this.self.scoreAddedEvent.fire(score, [{ score: score, site: site }, score]);
      //Set the initial value from the tool
//      score.updateValue(this.self.getValue(site));
      return score;
     }
    public removeScore(site: Site) {
      // remove site from scoreline.

    }

    public valueChangeHandler (event : pvMapper.Event) {
        this.scoreChangeEvent.fire(self, event);
    }
    //The name that will show up in the row
    public updateScore(site: Site) {

    }

    public onSiteRemove(event: pvMapper.Event) {
      if (event.data instanceof Site)
      //remove the reference to the site.
        this.self.removeScore(event.data);
    }

    public onSiteAdded(event : pvMapper.Event) {
      if (event.data instanceof Site)
      this.self.addScore(event.data);
    }

    public onSiteUpdated(event: Event) {
      if (event.data instanceof Site)
        this.self.updateScore(event.data);
    }

    private loadAllSites() {
      var allSites = siteManager.getSites();
      $.each(allSites, function (idx, site) {
        this.addScore(site);
      });
    }
  }

}
