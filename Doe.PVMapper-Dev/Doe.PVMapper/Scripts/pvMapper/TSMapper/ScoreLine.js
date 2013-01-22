/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="SiteManager.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    //  import pvM = pvMapper;
    // Class
    var ScoreLine = (function () {
        // Constructor
        function ScoreLine(options) {
            this.scores = new Array();
            this.getvalue = options.calculateValueCallback;
            this.scoreAddedEvent = new pvMapper.Event();
            this.scoreChangeEvent = new pvMapper.Event();
            this.updatingScoresEvent = new pvMapper.Event();
            this.siteChangeHandler = new pvMapper.Event();
            this.self = this;
            this.name = (typeof (options.title) === 'string') ? options.title : 'Unnamed Tool';
            this.description = (typeof (options.description) === 'string') ? options.description : 'Unname Tool';
            this.siteChangeHandler.addHandler(($.isFunction(options.onSiteChange)) ? options.onSiteChange : null);
            if($.isFunction(options.onScoreAdded)) {
                this.scoreAddedEvent.addHandler(options.onScoreAdded);
            }
            pvMapper.siteManager.siteAdded.addHandler(this.onSiteAdded);
            pvMapper.siteManager.siteRemoved.addHandler(this.onSiteRemove);
            this.loadAllSites();
        }
        ScoreLine.prototype.getUtilityScore = function () {
            return 0;
        };
        ScoreLine.prototype.getWeight = function () {
            return 0;
        };
        ScoreLine.prototype.getWeightedUtilityScore = function () {
            return 0;
        };
        ScoreLine.prototype.addScore = function (site) {
            var score = new pvMapper.Score(site);
            score.siteChangeEvent.addHandler(this.siteChangeHandler)//attach the tool's handler directly to the score
            ;
            //subscribe to the score updated event
            score.valueChangeEvent.addHandler(this.valueChangeHandler);
            this.self.scores.push(score);
            //      this.self.scoreAddedEvent.fire(score, [{ score: score, site: site }, score]);
            //Set the initial value from the tool
            //      score.updateValue(this.self.getValue(site));
            return score;
        };
        ScoreLine.prototype.removeScore = function (site) {
            // remove site from scoreline.
                    };
        ScoreLine.prototype.valueChangeHandler = function (event) {
            this.scoreChangeEvent.fire(self, event);
        }//The name that will show up in the row
        ;
        ScoreLine.prototype.updateScore = function (site) {
        };
        ScoreLine.prototype.onSiteRemove = function (event) {
            if(event.data instanceof pvMapper.Site) {
                //remove the reference to the site.
                this.self.removeScore(event.data);
            }
        };
        ScoreLine.prototype.onSiteAdded = function (event) {
            if(event.data instanceof pvMapper.Site) {
                this.self.addScore(event.data);
            }
        };
        ScoreLine.prototype.onSiteUpdated = function (event) {
            if(event.data instanceof pvMapper.Site) {
                this.self.updateScore(event.data);
            }
        };
        ScoreLine.prototype.loadAllSites = function () {
            var allSites = pvMapper.siteManager.getSites();
            $.each(allSites, function (idx, site) {
                this.addScore(site);
            });
        };
        return ScoreLine;
    })();
    pvMapper.ScoreLine = ScoreLine;    
})(pvMapper || (pvMapper = {}));

