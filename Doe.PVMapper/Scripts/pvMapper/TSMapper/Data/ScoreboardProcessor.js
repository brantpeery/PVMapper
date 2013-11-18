/// <reference path="../Scoreboard.ts" />
/// <reference path="../ScoreLine.ts" />
var pvMapper;
(function (pvMapper) {
    (function (Data) {
        var ScoreboardProcessor = (function () {
            function ScoreboardProcessor() {
            }
            ScoreboardProcessor.getCleanObject = function (scoreboard) {
                var j = JSON.stringify(scoreboard);
                return JSON.parse(j);
            };
            ScoreboardProcessor.getCleanObjectTransposed = function (scoreboard) {
                var obj = this.getCleanObject(scoreboard);
                var newObj = {
                    sites: []
                };
                obj.scoreLines.forEach(function (line, sidx) {
                    line.scores.forEach(function (score, idx) {
                        if (newObj.sites[idx] == undefined) {
                            newObj.sites[idx] = score.site;
                            newObj.sites[idx].scores = [];
                        }
                        newObj.sites[idx].scores[sidx] = score;
                        newObj.sites[idx].scores[sidx].scoreLine = line;
                        delete score.site;
                    });
                    delete line.scores;
                });
                return newObj;
            };
            return ScoreboardProcessor;
        })();
        Data.ScoreboardProcessor = ScoreboardProcessor;
    })(pvMapper.Data || (pvMapper.Data = {}));
    var Data = pvMapper.Data;
})(pvMapper || (pvMapper = {}));
