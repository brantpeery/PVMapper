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
            var _this = this;
            this.scores = new Array();
            this.getvalue = options.calculateValueCallback;
            this.scoreAddedEvent = new pvMapper.Event();
            this.scoreChangeEvent = new pvMapper.Event();
            this.updatingScoresEvent = new pvMapper.Event();
            console.log("Adding a scoreline for " + options.title);
            this.self = this;
            this.name = (typeof (options.title) === 'string') ? options.title : 'Unnamed Tool';
            this.description = (typeof (options.description) === 'string') ? options.description : 'Unname Tool';
            if($.isFunction(options.onSiteChange)) {
                this.onSiteChangeHandler = options.onSiteChange;
            }
            this.valueChangeHandler = function (event) {
                ///TODO: Create a ValueChangeEventArg or something to let the user know what to expect
                _this.scoreChangeEvent.fire(self, event);
            };
            if($.isFunction(options.onScoreAdded)) {
                this.scoreAddedEvent.addHandler(options.onScoreAdded);
            }
            pvMapper.siteManager.siteAdded.addHandler(function (event) {
                console.log("Siteadded event detected in scoreline" + name);
                _this.addScore(event);
            });
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
        ScoreLine.prototype.addScore = /**
        Adds a score object to this line for the site.
        */
        function (site) {
            console.log('Adding new score to scoreline');
            var score = new pvMapper.Score(site);
            score.value = this.getvalue(site);
            //attach the tool's handler directly to the score
            score.siteChangeEvent.addHandler(this.onSiteChangeHandler);
            //subscribe to the score updated event
            score.valueChangeEvent.addHandler(this.valueChangeHandler);
            this.scores.push(score);
            //this.self.scoreAddedEvent.fire(score, [{ score: score, site: site }, score]);
            //Set the initial value from the tool
            score.updateValue(this.getvalue(site));
            return score;
        };
        ScoreLine.prototype.removeScore = function (score) {
            // remove site from scoreline.
                    };
        ScoreLine.prototype.updateScores = function (site) {
        };
        ScoreLine.prototype.loadAllSites = function () {
            var allSites = pvMapper.siteManager.getSites();
            $.each(allSites, function (idx, site) {
                this.addScore(site);
            });
        };
        ScoreLine.prototype.onSiteRemove = ///TODO: get this to work using a score not a site
        function (event) {
            console.log('Attempting to remove a site/score from the scoreline');
            if(event.data instanceof pvMapper.Site) {
                //remove the reference to the site.
                this.self.removeScore(event.data);
            }
        };
        return ScoreLine;
    })();
    pvMapper.ScoreLine = ScoreLine;    
    //private onSiteAdded =
    //private onSiteUpdated(event: EventArg) {
    //    if (event.data instanceof Site)
    //        updateScore(event.data);
    //}
    })(pvMapper || (pvMapper = {}));
//@ sourceMappingURL=ScoreLine.js.map
