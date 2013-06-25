var pvMapper;
(function (pvMapper) {
    var ScoreLine = (function () {
        function ScoreLine(options) {
            var _this = this;
            this.scores = new Array();
            this.active = true;
            this.scoreAddedEvent = new pvMapper.Event();
            this.scoreChangeEvent = new pvMapper.Event();
            this.updatingScoresEvent = new pvMapper.Event();
            this.self = this;
            this.name = (typeof (options.title) === 'string') ? options.title : 'Unnamed Tool';
            this.description = (typeof (options.description) === 'string') ? options.description : 'Unnamed Tool';
            this.category = (typeof (options.category) === 'string') ? options.category : 'Other';
            this.weight = 1;
            if($.isFunction(options.onSiteChange)) {
                this.onSiteChangeHandler = options.onSiteChange;
            }
            this.valueChangeHandler = function (event) {
                event.score.setUtility(_this.getUtilityScore(event.newValue));
                _this.scoreChangeEvent.fire(self, event);
            };
            if($.isFunction(options.onScoreAdded)) {
                this.scoreAddedEvent.addHandler(options.onScoreAdded);
            }
            pvMapper.siteManager.siteAdded.addHandler(function (event) {
                if(console) {
                    console.log("Siteadded event detected in scoreline" + name);
                }
                _this.addScore(event);
            });
            pvMapper.siteManager.siteRemoved.addHandler(function (site) {
                _this.onSiteRemove(site);
            });
            if(options.scoreUtilityOptions == undefined) {
                options.scoreUtilityOptions = {
                    functionName: "random",
                    functionArgs: {
                    },
                    iconURL: null
                };
            }
            this.scoreUtility = new pvMapper.ScoreUtility(options.scoreUtilityOptions);
            this.weight = (typeof options.defaultWeight === "number") ? options.defaultWeight : 10;
            this.loadAllSites();
        }
        ScoreLine.prototype.getUtilityScore = function (x) {
            return this.scoreUtility.run(x);
        };
        ScoreLine.prototype.getWeight = function () {
            return this.weight;
        };
        ScoreLine.prototype.setWeight = function (value) {
            this.weight = value;
            this.scoreChangeEvent.fire(self, undefined);
        };
        ScoreLine.prototype.getWeightedUtilityScore = function () {
            return 0;
        };
        ScoreLine.prototype.addScore = function (site) {
            var score = new pvMapper.Score(site);
            score.siteChangeEvent.addHandler(this.onSiteChangeHandler);
            score.valueChangeEvent.addHandler(this.valueChangeHandler);
            this.scores.push(score);
            try  {
                this.onSiteChangeHandler(undefined, score);
            } catch (ex) {
                if(console) {
                    console.error(ex);
                }
            }
            return score;
        };
        ScoreLine.prototype.updateScores = function () {
            this.scores.forEach(function (score, index, scores) {
                var oldvalue = score.value;
                score.setUtility(this.getUtilityScore(score.value));
                this.scoreChangeEvent.fire(self, {
                    score: score,
                    oldValue: oldvalue,
                    newValue: score.value
                });
            }, this);
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
})(pvMapper || (pvMapper = {}));
