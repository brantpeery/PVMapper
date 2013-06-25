var pvMapper;
(function (pvMapper) {
    var TotalLine = (function () {
        function TotalLine(options) {
            this.ValueChangedEvent = new pvMapper.Event();
            this.category = "Totals";
            this.scores = [];
            this.CalculateScore = options.CalculateScore;
            this.title = options.title;
            this.name = options.name;
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
            var numSites = (lines.length > 0) ? lines[0].scores.length : 0;
            if(numSites < this.scores.length) {
                this.scores.splice(numSites, this.scores.length - numSites);
            }
            for(var idx = 0; idx < numSites; idx++) {
                var values = [];
                lines.forEach(function (line) {
                    if(line.scores[idx].utility) {
                        values.push({
                            value: line.scores[idx].utility,
                            weight: line.weight
                        });
                    }
                });
                if(!this.scores[idx]) {
                    this.scores.push({
                        utility: 0
                    });
                }
                this.scores[idx].utility = this.CalculateScore(values);
            }
        };
        return TotalLine;
    })();
    pvMapper.TotalLine = TotalLine;    
})(pvMapper || (pvMapper = {}));
