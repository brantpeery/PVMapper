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
                            title: "Total Score",
                            description: "The total scores for the sites, calculated across all categories.",
                            category: "Totals",
                            activate: function () {
                            },
                            init: function () {
                            },
                            destroy: function () {
                            },
                            deactivate: function () {
                            },
                            CalculateScore: function (values) {
                                var total = 0;
                                var count = 0;
                                values.forEach(function (v) {
                                    total += v.value * v.weight;
                                    count += v.weight;
                                });
                                return total / count;
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
