/// <reference path="../Scoreboard.ts" />
/// <reference path="../ScoreLine.ts" />


module pvMapper {
    export module Data {
        export class ScoreboardProcessor {

            static getCleanObject(scoreboard: ScoreBoard) {
                var j = JSON.stringify(scoreboard);
                return JSON.parse(j);
            }

            static getCleanObjectTransposed(scoreboard: ScoreBoard) {
                var obj = scoreboard.toJSON();
                var newObj = {
                    sites: obj.sites.map(site => {
                        (<any>site).scores = obj.scoreLines.map(line => {
                            var score = line.scores.filter(score => score.site.id === site.id)[0];
                            score.scoreLine = line; // replace ID reference with full score line JSON object (for compatability with our reports)
                            return score;
                        });
                        return site;
                    })
                };
                //obj.scoreLines.forEach(function (line, sidx) {
                //    line.scores.forEach(function (score, idx) {
                //        if (newObj.sites[idx] == undefined) {
                //            newObj.sites[idx] = score.site;
                //            newObj.sites[idx].scores = [];
                //        }
                //        newObj.sites[idx].scores[sidx] = score;
                //        newObj.sites[idx].scores[sidx].scoreLine = line;
                //        delete score.site;
                //    });
                //    delete line.scores;
                //});
                return newObj;
            }

            //static getCleanObjectTransposedJSON(scoreboard:ScoreBoard): string {
            //    return JSON.stringify(this.getCleanObjectTransposed(scoreboard));
            //}
            
            static addSummaryAndDivergence(data: any) {
                var total = 0;
                var mean;

                var count = 0;
                data.sites.map(function (site, idx) {

                    count++;
                    var totalWeights = 0;
                    site.scores.map(function (score, idx) {
                        // NaN / null utility scores indicate that the tool could not derive a score for this site
                        // (either due to a lack of data or to a server communication error)
                        if (score.utility !== null && !isNaN(score.utility)) {
                            //The total of all the scores by sites for this tool (not weighted)
                            //The scoreLine objects are shared between all site.scores
                            if (score.scoreLine["totalSiteUtility"] == undefined) { score.scoreLine["totalSiteUtility"] = 0; }
                            score.scoreLine["totalSiteUtility"] += score.utility;

                            score.scoreLine["countSiteUtility"] = (score.scoreLine["countSiteUtility"] || 0) + 1;

                            //Update the mean when a score is added to the total
                            score.scoreLine["meanSiteUtility"] = score.scoreLine["totalSiteUtility"] / score.scoreLine["countSiteUtility"];

                            //The total of all scores by scoreline for each site (weighted)
                            if (site["totalUtility"] == undefined) { site["totalUtility"] = 0; }
                            site["totalUtility"] += score.utility * score.scoreLine.weight;

                            totalWeights += score.scoreLine.weight;
                        }
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
                        // NaN / null utility scores indicate that the tool could not derive a score for this site
                        // (either due to a lack of data or to a server communication error)
                        if (score.utility !== null && !isNaN(score.utility)) {
                            //calculate the score's divergence for this site compared to other sites for the same scoreLine
                            score['divergence'] = Math.round(score.utility - score.scoreLine["meanSiteUtility"]);
                            score['weightedDivergence'] = score['divergence'] * score.scoreLine.weight;
                        }
                    });

                    //Calculate the mean score divergence from the project mean for this site compared to other sites
                    site['divergence'] = Math.round(site['meanUtility'] - mean);
                });

                return this.sortScoresByTotalUtility(data);

            }

            static sortScoresByDivergence(data) {
                //Sort the weighted divergence for this site descending
                data.sites.map(function (site, idx) {
                    site.scores.sort(function (a, b) {
                        return Math.abs(b.weightedDivergence) - Math.abs(a.weightedDivergence);
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

            /**
                Sorts the sites by the utility score
                Order 1 = ascending
                Order -1 = descending
                Order 0 = do not sort
            */
            static sortSitesByUtility(data, ascending:boolean = false) {

                data.sites.sort(function (a, b) {
                    return (Math.abs(a.meanUtility) - Math.abs(b.meanUtility)) * ((ascending) ? 1 : -1);
                });
                return data;
            }
        }
    }
}