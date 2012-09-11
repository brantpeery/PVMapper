(function (pvM) {
    pvM.Scoreboard = function () {
        this.scoreChangedEvent = new Event();
        this.scoresInvalidatedEvent = new Event();

        this.addLine = function (scoreLine) {
            score.scoreChangedEvent.addHandler(onScoreChanged);
            score.scoresInvalidatedEvent.addHandler(onScoresInvalidated);
        };

        this.removeLine = function (idx) {
            throw("Function not yet implemented!");
        };
        this.removeLine;
        this.scoreLines;


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



    }

    //Create a scoreboard instance on the pvMapper object
    pvM.mainScoreboard = new pvM.Scoreboard();
})(pvMapper);