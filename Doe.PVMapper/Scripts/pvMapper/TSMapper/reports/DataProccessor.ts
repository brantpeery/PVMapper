/// <reference path="../Scoreboard.ts" />
/// <reference path="../ScoreLine.ts" />


module pvMapper {
   export module Data {
        export class ScoreboardProcessor {
            constructor(scoreboard: ScoreBoard) {
                this.scoreboard = scoreboard;
            }
            private scoreboard: ScoreBoard;
            public getCleanObject() {
                var j = JSON.stringify(this.scoreboard);
                return JSON.parse(j);
            }
            public getCleanObjectTransposed() {
                var obj = this.getCleanObject();
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
            public toJSON() { }
            public fromJSON() { }
        }    
    }
}