﻿/// <reference path="../pvMapper/TSMapper/pvMapper.ts" />
/// <reference path="../pvMapper/TSMapper/Site.ts" />
/// <reference path="../pvMapper/TSMapper/Score.ts" />
/// <reference path="../pvMapper/TSMapper/Tools.ts" />
/// <reference path="../pvMapper/TSMapper/Options.d.ts" />
/// <reference path="../pvMapper/TSMapper/Module.ts" />
var pvMapper;
(function (pvMapper) {
    (function (Tools) {
        var TotalScore = (function () {
            function TotalScore() {
                var myModule = new pvMapper.Module({
                    activate: function () {
                    },
                    init: function () {
                    },
                    destroy: function () {
                    },
                    deactivate: function () {
                    },
                    author: "Brant Peery, INL",
                    version: "0.1",
                    id: "TOTALS_TOOLS",
                    totalTools: [
                        {
                            title: "Weighted Average Score",
                            description: "The weighted arithmetic mean of all scores for a site, ",
                            category: "Totals",
                            activate: function () {
                            },
                            init: function () {
                            },
                            destroy: function () {
                            },
                            deactivate: function () {
                            },
                            //addedToScoreboard: () => { },
                            //removedFromScoreboard: () => { },
                            CalculateScore: function (values) {
                                var total = 0;
                                var count = 0;

                                values.forEach(function (v) {
                                    total += v.utility * v.tool.weight;
                                    count += v.tool.weight;
                                });

                                //Return the basic average
                                return { utility: total / count, popupMessage: "Average" };
                            }
                        },
                        {
                            title: "Lowest Score",
                            description: "The lowest score for a site, and the name of the tool which generated that score",
                            category: "Totals",
                            activate: function () {
                            },
                            init: function () {
                            },
                            destroy: function () {
                            },
                            deactivate: function () {
                            },
                            //addedToScoreboard: () => { },
                            //removedFromScoreboard: () => { },
                            CalculateScore: function (values) {
                                var min = Number.POSITIVE_INFINITY;
                                var title;
                                values.forEach(function (v) {
                                    if (v.tool.weight) {
                                        if (typeof v.utility !== 'undefined' && v.utility < min) {
                                            min = v.utility;
                                            title = v.tool.title;
                                        }
                                    }
                                });

                                if (isNaN(min) || !isFinite(min)) {
                                    min = NaN;
                                    title = null;
                                }

                                return { utility: min, popupMessage: title };
                            }
                        }
                    ],
                    infoTools: null
                });
            }
            return TotalScore;
        })();
        Tools.TotalScore = TotalScore;
    })(pvMapper.Tools || (pvMapper.Tools = {}));
    var Tools = pvMapper.Tools;

    var TotalAverageScoreInstance = new pvMapper.Tools.TotalScore();
})(pvMapper || (pvMapper = {}));
