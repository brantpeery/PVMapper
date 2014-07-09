/// <reference path="../pvMapper/TSMapper/pvMapper.ts" />
/// <reference path="../pvMapper/TSMapper/Site.ts" />
/// <reference path="../pvMapper/TSMapper/Score.ts" />
/// <reference path="../pvMapper/TSMapper/Tools.ts" />
/// <reference path="../pvMapper/TSMapper/Module.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pvMapper;
(function (pvMapper) {
    (function (Tools) {
        var TotalScore = (function (_super) {
            __extends(TotalScore, _super);
            function TotalScore() {
                _super.call(this, {
                    activate: null,
                    deactivate: null,
                    id: "TotalToolModule",
                    author: "Brant Peery, INL",
                    version: "0.1",
                    url: null,
                    title: "Score Total Tools",
                    description: "Tools to given default total lines in the scoreboard.",
                    category: "Totals",
                    totalTools: [
                        {
                            id: "WeightedAverageTotalTool",
                            title: "Weighted Average Score",
                            description: "The weighted arithmetic mean of all scores for a site",
                            longDescription: "The weighted arithmetic mean of all scores for a site",
                            category: "Totals",
                            activate: null,
                            deactivate: null,
                            //addedToScoreboard: () => { },
                            //removedFromScoreboard: () => { },
                            CalculateScore: function (values, site) {
                                var total = 0;
                                var count = 0;

                                values.forEach(function (v) {
                                    total += v.utility * v.scoreLine.weight;
                                    count += v.scoreLine.weight;
                                });

                                var average = total / count;

                                // post the average score to the feature, so that it can render correctly on the map
                                //TODO: is this really the best place to be mucking about with the feature attributes?
                                var feature = site.feature;

                                // test if the feature's average score value has changed
                                if (feature.attributes.overallScore !== average) {
                                    feature.attributes.overallScore = average;

                                    // set the score's color as an attribute on the feature (note - this is at least partly a hack...)
                                    feature.attributes.fillColor = (!isNaN(average)) ? pvMapper.getColorForScore(average) : "";

                                    // redraw the feature
                                    if (feature.layer) {
                                        feature.layer.drawFeature(feature);
                                    }
                                }

                                //Return the basic average
                                return { utility: average, popupMessage: "Average" };
                            }
                        }, {
                            id: "LowestScoreTotalTool",
                            title: "Lowest Score",
                            description: "The lowest score for a site, and the name of the tool which generated that score",
                            longDescription: "The lowest score for a site, and the name of the tool which generated that score",
                            category: "Totals",
                            activate: null,
                            deactivate: null,
                            //addedToScoreboard: () => { },
                            //removedFromScoreboard: () => { },
                            CalculateScore: function (values, site) {
                                var min = Number.POSITIVE_INFINITY;
                                var title;
                                values.forEach(function (v) {
                                    // skip 0-weight scores tools...
                                    if (v.scoreLine.weight) {
                                        if (typeof v.utility !== 'undefined' && v.utility < min) {
                                            min = v.utility;
                                            title = v.scoreLine.title;
                                        }
                                    }
                                });

                                if (isNaN(min) || !isFinite(min)) {
                                    min = NaN; // NaN is already used to flag bad values...
                                    title = null; // no need for a popup
                                }

                                return { utility: min, popupMessage: title };
                            }
                        }],
                    infoTools: null
                });
            }
            return TotalScore;
        })(pvMapper.Module);
        Tools.TotalScore = TotalScore;
    })(pvMapper.Tools || (pvMapper.Tools = {}));
    var Tools = pvMapper.Tools;

    var TotalAverageScoreInstance = new pvMapper.Tools.TotalScore();
    pvMapper.onReady(TotalAverageScoreInstance.activate);
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=TotalsModule.js.map
