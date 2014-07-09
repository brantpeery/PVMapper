/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="SiteManager.ts" />
var pvMapper;
(function (pvMapper) {
    var TotalLine = (function () {
        function TotalLine(options, parentModule) {
            var _this = this;
            //public getModule(): pvMapper.Module { return null; }
            this.ValueChangedEvent = new pvMapper.Event();
            this.category = "Totals";
            this.scores = [];
            this.UpdateScores = function (lines) {
                //Setup an array of sites(scores) that contain all the scoringTool values
                _this.scores = pvMapper.siteManager.getSites().map(function (site, index) {
                    //Aggragate all valid scores for this site into an array
                    var scoresToTotal = [];
                    lines.forEach(function (line) {
                        //TODO: This should be the weighted score
                        var score = TotalLine.getScoreForSiteFromLine(line, site, index);

                        if (score && typeof score.utility === "number" && isFinite(score.utility)) {
                            scoresToTotal.push({ utility: score.utility, site: site, scoreLine: line });
                        }
                    });

                    // get the Total line's score object which we'll update with our new total
                    var score = TotalLine.getScoreForSiteFromLine(_this, site, index) || { utility: NaN, site: { id: site.id }, scoreLine: { id: _this.id } };

                    //Update the score on the total line using the tools CalculateScore method
                    if (scoresToTotal.length) {
                        var scoreUpdate = _this.CalculateScore(scoresToTotal, site);
                        score.utility = scoreUpdate.utility;
                        score.popupMessage = scoreUpdate.popupMessage;
                    }

                    return score;
                });
            };
            this.getModule = function () {
                return parentModule;
            };

            if (console && console.assert)
                console.assert(!!options.id, "Tool ID is required");
            this.id = options.id;

            this.title = options.title || parentModule.title || this.title || 'Unnamed Tool';
            this.category = options.category || (parentModule && parentModule.category) || this.category || 'Totals';
            this.description = options.description || (parentModule && parentModule.description) || this.description || "";
            this.longDescription = options.longDescription || (parentModule && parentModule.longDescription) || this.longDescription || "";

            this.CalculateScore = options.CalculateScore;
            //this.init = options.init || function () { };
            //this.destroy = options.destroy || function () { };
            //this.activate = options.activate || function () { };
            //this.deactivate = options.deactivate || function () { };
        }
        TotalLine.prototype.toJSON = function () {
            var o = {
                id: this.id,
                title: this.title,
                category: this.category,
                description: this.description,
                longDescription: this.longDescription,
                scores: this.scores
            };
            return o;
        };

        TotalLine.prototype.fromJSON = function (o) {
            if (console && console.assert)
                console.assert(o.id === this.id);
            //this.title = o.title; //TODO: if we allow users to change the names of tool lines, then we should re-enable this line.
            // we don't want to load a lot of these - our current values are likely better than the old saved description etc.
            //this.description = o.description;
            //this.longDescription = o.longDescription;
            //this.category = o.category;
            //this.scores = o.scores;
        };

        // gets the score object from the given array of scores which matches the given site (using idx as a hint to its position in the array)
        TotalLine.getScoreForSiteFromLine = function (line, site, hintIndex) {
            var scores = line.scores;
            var score = (scores.length > hintIndex) && scores[hintIndex];
            if (!score || (score.site && score.site.id !== site.id)) {
                // try to find this score the hard way... (may be time consuming for our supported edge case of using many sites)
                var filteredScores = scores.filter(function (s) {
                    return s.site.id === site.id;
                });

                score = filteredScores.length && filteredScores[0];

                // perform some logging etc.
                if (console && console.warn && score)
                    console.warn("Warning: unaligned score array found in score line ID='" + line.id + "'");

                if (console && console.assert)
                    console.assert(filteredScores.length <= 1, "Warning: score line ID='" + line.id + "' holds duplicate scores for site ID='" + site.id + "'");
            }
            return score;
        };
        return TotalLine;
    })();
    pvMapper.TotalLine = TotalLine;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=TotalLine.js.map
