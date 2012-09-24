/// <reference path="Renderer.js" />

(function (pvM) {
    pvM.Scoreboard = function () {
        this.scoreChangedEvent = new Event();
        this.scoresInvalidatedEvent = new Event();

        this.addLine = function (scoreLine) {
            if (scoreLine instanceof pvM.ScoreLine) {
                scoreLine.scoreChangeEvent.addHandler(onScoreChanged);
                //scoreLine.scoresInvalidatedEvent.addHandler(onScoresInvalidated);

                this.scoreLines.push(scoreLine);
            } else {
                //Try to parse the options

            }
        };

        this.removeLine = function (idx) {
            throw("Function not yet implemented!");
        };
        this.removeLine;
        this.scoreLines=[];
        this.render = function () {
            var r = new pvM.Renderer.HTML.Table();
            $.each(this.scoreLines, function (idx, r) {
                var row = r.addRow();
                row.addCell(sl.name).attr({ title: sl.description, 'class': 'toolName' });
                for (var s in sl.scores) {
                    row.addCell(s.value);
                }
            });
        }

        //Private functions
        function onScoreChanged() {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it

            throw("Function not implemented yet!");
        };
        function onScoresInvalidated() {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it

            Error("Function not implemented yet!");
        };
        var tableRenderer = new pvM.Renderer.HTML.Table();

        
    }

    //Create a scoreboard instance on the pvMapper object
    pvM.mainScoreboard = new pvM.Scoreboard();
})(pvMapper);