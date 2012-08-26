
function scoreBoard() {
    this.scoreChanged = new Event();
    this.scoresInvalidated = new Event();

    this.addLine;
    this.removeLine;
    this.scoreLines;

    function onScoreChanged() {
        //let all the other modules that care know that a score changed

    };

}