/// <reference path="../Scoreboard.ts" />
/// <reference path="../ScoreLine.ts" />


module pvMapper {
   export module Data {
        export class ScoreboardProcessor {
            
            static getCleanObject(scoreboard) {
                var j = JSON.stringify(scoreboard);
                return JSON.parse(j);
            }
            static getCleanObjectTransposed(scoreboard) {
                var obj = this.getCleanObject(scoreboard);
                var newObj = {
                    sites: []
                };
                obj.scoreLines.forEach(function (line, sidx) {
                    line.scores.forEach(function (score, idx) {
                        if (newObj.sites[idx] == undefined) {
                            newObj.sites[idx] = score.site;
                            newObj.sites[idx].scores = []
                            }
                        newObj.sites[idx].scores[sidx] = score;
                        newObj.sites[idx].scores[sidx].scoreLine = line;
                        delete score.site;
                    });
                    delete line.scores;
                });
                return newObj;
            }

            static getCleanObjectTransposedJSON(scoreboard) string {
                var obj = this.getCleanObject(scoreboard);
                var newObj = {
                    sites: []
                };
                obj.scoreLines.forEach(function (line, sidx) {
                    line.scores.forEach(function (score, idx) {
                        if (newObj.sites[idx] == undefined) {
                            newObj.sites[idx] = score.site;
                            newObj.sites[idx].scores = []
                            }
                        newObj.sites[idx].scores[sidx] = score;
                        newObj.sites[idx].scores[sidx].scoreLine = line;
                        delete score.site;
                    });
                    delete line.scores;
                });
                return JSON.stringify(newObj);
            }

        }    
    }
}