/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
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
            //public updateScore: ICallback = options.updateScoreCallback;
            this.active = true;
            this.scoreAddedEvent = new pvMapper.Event();
            this.scoreChangeEvent = new pvMapper.Event();
            this.updatingScoresEvent = new pvMapper.Event();
            //console.log("Adding a scoreline for " + options.title);
            this.self = this;
            this.name = (typeof (options.title) === 'string') ? options.title : 'Unnamed Tool';
            this.description = (typeof (options.description) === 'string') ? options.description : 'Unnamed Tool';
            this.category = (typeof (options.category) === 'string') ? options.category : 'Other';
            this.weight = 1;
            if($.isFunction(options.onSiteChange)) {
                this.onSiteChangeHandler = options.onSiteChange;
            }
            this.valueChangeHandler = function (event) {
                ///TODO: Create a ValueChangeEventArg or something to let the user know what to expect
                //Update the utility score for the score that just changed it's value.
                event.score.setUtility(_this.getUtilityScore(event.newValue));
                _this.scoreChangeEvent.fire(self, event);
            };
            if($.isFunction(options.onScoreAdded)) {
                this.scoreAddedEvent.addHandler(options.onScoreAdded);
            }
            pvMapper.siteManager.siteAdded.addHandler(function (event) {
                console.log("Siteadded event detected in scoreline" + name);
                _this.addScore(event);
            });
            pvMapper.siteManager.siteRemoved.addHandler(function (site) {
                _this.onSiteRemove(site);
            });
            //Set default scoreUtilityOptions object if none was provided
            if(options.scoreUtilityOptions == undefined) {
                options.scoreUtilityOptions = {
                    maxValue: 1,
                    minValue: 0,
                    target: 0.5,
                    slope: 50,
                    functionName: "random"
                };
                //"moreIsBetter"
                            }
            this.scoreUtility = new pvMapper.ScoreUtility(options.scoreUtilityOptions);
            //Set the default weight of the tool
            this.weight = (typeof options.defaultWeight === "number") ? options.defaultWeight : 10;
            this.loadAllSites();
        }
        ScoreLine.prototype.getUtilityScore = function (x) {
            return this.scoreUtility.run(x);
        };
        ScoreLine.prototype.getWeight = function () {
            return this.weight;
        };
        ScoreLine.prototype.getWeightedUtilityScore = function () {
            return 0;
        };
        ScoreLine.prototype.addScore = /**
        Adds a score object to this line for the site.
        */
        function (site) {
            //console.log('Adding new score to scoreline');
            var score = new pvMapper.Score(site);
            //score.value = this.getvalue(site);
            //attach the tool's handler directly to the score
            score.siteChangeEvent.addHandler(this.onSiteChangeHandler);
            //subscribe to the score updated event
            score.valueChangeEvent.addHandler(this.valueChangeHandler);
            this.scores.push(score);
            //this.self.scoreAddedEvent.fire(score, [{ score: score, site: site }, score]);
            //Set the initial value from the tool
            try  {
                this.onSiteChangeHandler(undefined, score);
                //this.updateScore(score);
                            } catch (ex) {
                console.log(ex);
            }
            return score;
        };
        ScoreLine.prototype.loadAllSites = function () {
            var allSites = pvMapper.siteManager.getSites();
            $.each(allSites, function (idx, site) {
                this.addScore(site);
            });
        };
        ScoreLine.prototype.onSiteRemove = function (site) {
            console.log('Attempting to remove a site/score from the scoreline');
            for(var i = 0; i < this.scores.length; i++) {
                var score = this.scores[i];
                if(score.site == site) {
                    // remove site from scoreline.
                    score.siteChangeEvent.removeHandler(this.onSiteChangeHandler);
                    score.valueChangeEvent.removeHandler(this.valueChangeHandler);
                    this.scores.splice(i, 1);
                    this.scoreChangeEvent.fire(self, undefined);
                    break;
                }
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
