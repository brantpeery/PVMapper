var pvMapper;
(function (pvMapper) {
    var ScoreLine = (function () {
        function ScoreLine(options) {
            var _this = this;
            this.scores = new Array();
            this.updateScore = options.updateScoreCallback;
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
        ScoreLine.prototype.addScore = function (site) {
            console.log('Adding new score to scoreline');
            var score = new pvMapper.Score(site);
            score.siteChangeEvent.addHandler(this.onSiteChangeHandler);
            score.valueChangeEvent.addHandler(this.valueChangeHandler);
            this.scores.push(score);
            this.updateScore(score);
            return score;
        };
        ScoreLine.prototype.removeScore = function (score) {
        };
        ScoreLine.prototype.updateScores = function (site) {
        };
        ScoreLine.prototype.loadAllSites = function () {
            var allSites = pvMapper.siteManager.getSites();
            $.each(allSites, function (idx, site) {
                this.addScore(site);
            });
        };
        ScoreLine.prototype.onSiteRemove = function (event) {
            console.log('Attempting to remove a site/score from the scoreline');
            if(event.data instanceof pvMapper.Site) {
                this.self.removeScore(event.data);
            }
        };
        return ScoreLine;
    })();
    pvMapper.ScoreLine = ScoreLine;    
})(pvMapper || (pvMapper = {}));
