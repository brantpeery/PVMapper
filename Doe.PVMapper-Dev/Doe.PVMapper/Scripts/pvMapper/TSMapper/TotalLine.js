/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="SiteManager.ts" />
var pvMapper;
(function (pvMapper) {
    var TotalLine = (function () {
        function TotalLine(options) {
            this.ValueChangedEvent = new pvMapper.Event();
            this.category = "Totals";
            this.scores = [];
            this.CalculateScore = options.CalculateScore;
            this.title = options.title;

            //this.name = options.name;
            this.description = options.description;

            this.init = options.init || function () {
            };
            this.destroy = options.destroy || function () {
            };
            this.activate = options.activate || function () {
            };
            this.deactivate = options.deactivate || function () {
            };
        }
        TotalLine.prototype.UpdateScores = function (lines) {
            //Setup an array of sites(scores) that contain all the scoringTool values
            var numSites = (lines.length > 0) ? lines[0].scores.length : 0;

            if (numSites < this.scores.length) {
                //Remove the excess scores
                this.scores.splice(numSites, this.scores.length - numSites);
            }

            for (var idx = 0; idx < numSites; idx++) {
                var values = [];

                //Aggragate all the scoreline's values into an array
                lines.forEach(function (line) {
                    if (line.scores && line.scores[idx] && line.scores[idx].utility) {
                        values.push({ utility: line.scores[idx].utility, tool: line });
                    }
                });

                if (!this.scores[idx]) {
                    this.scores.push({ utility: 0 });
                }

                //Update the score on the total line using the tools CalculateScore method
                this.scores[idx] = this.CalculateScore(values);
            }
        };
        return TotalLine;
    })();
    pvMapper.TotalLine = TotalLine;
})(pvMapper || (pvMapper = {}));
