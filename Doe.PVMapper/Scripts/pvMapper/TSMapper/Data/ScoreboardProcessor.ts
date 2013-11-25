﻿/// <reference path="../Scoreboard.ts" />
/// <reference path="../ScoreLine.ts" />


module pvMapper {
    export module Data {
        interface ICleanScoreboardData {
              
        }

        export class ScoreboardProcessor {


            static getCleanObject(scoreboard: ScoreBoard) {
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
                            newObj.sites[idx].scores = [];
                        }
                        newObj.sites[idx].scores[sidx] = score;
                        newObj.sites[idx].scores[sidx].scoreLine = line;
                        delete score.site;
                    });
                    delete line.scores;
                });
                return newObj;
            }

            static getCleanObjectTransposedJSON(scoreboard:ScoreBoard): string {
                return JSON.stringify(this.getCleanObjectTransposed(scoreboard));
            }
            
            static addSummaryAndDivergence(data: any) {
                var total = 0;
                var mean;

                var count = 0;
                data.sites.map(function (site, idx) {

                    count++;
                    var totalWeights = 0;
                    site.scores.map(function (score, idx) {


                        //The total of all the scores by sites for this tool (not weighted)
                        //The scoreLine objects are shared between all site.scores
                        if (score.scoreLine["totalSiteUtility"] == undefined) { score.scoreLine["totalSiteUtility"] = 0; }
                        score.scoreLine["totalSiteUtility"] += score.utility;

                        //Update the mean when a score is added to the total
                        score.scoreLine["meanSiteUtility"] = score.scoreLine["totalSiteUtility"] / count;

                        //The total of all scores by scoreline for each site (weighted)
                        if (site["totalUtility"] == undefined) { site["totalUtility"] = 0; }
                        site["totalUtility"] += score.utility * score.scoreLine.weight;

                        totalWeights += score.scoreLine.weight;
                    });
                    site['meanUtility'] = site["totalUtility"] / totalWeights;
                    site['totalWeights'] = totalWeights;//The total of all the weights for all the scores

                    //Total mean scores across all sites
                    total += site['meanUtility'];
                    //The mean score for all sites
                    mean = total / count;
                });

                //Now add in the divergence
                data.sites.map(function (site, idx) {
                    count++;
                    site.scores.map(function (score, idx) {
                        //calculate the score's divergence for this site compared to other sites for the same scoreLine
                        score['divergence'] = Math.round(score.utility - score.scoreLine["meanSiteUtility"]);
                    });

                    //Calculate the mean score divergence from the project mean for this site compared to other sites
                    site['divergence'] = Math.round(site['meanUtility'] - mean);
                });

                return this.sortScoresByTotalUtility(data);

            }

            static sortScoresByDivergence(data) {
                //Sort the divergence for this site descending
                data.sites.map(function (site, idx) {
                    site.scores.sort(function (a, b) {
                        return Math.abs(b.divergence) - Math.abs(a.divergence);
                    });
                });
                return data;
            }

            //Sorts the scores by their total utility (score's utility * weight)
            static sortScoresByTotalUtility(data) {
                data.sites.map(function (site, idx) {
                    site.scores.sort(function (a, b) {
                        return Math.abs(b.totalUtility) - Math.abs(a.totalUtility);
                    });
                });
                return data;
            }
        }
    }
}