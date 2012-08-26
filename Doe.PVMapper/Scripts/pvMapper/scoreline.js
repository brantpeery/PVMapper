/// <reference path="../_references.js" />

function scoreLine(scoreboard, name, updateScoreCallBack) {
    //Make sure we have the correct parameters 
    scoreboard = (scoreboard.prototype == scoreboard) ? scoreboard : pvMapper.scoreBoard;

    //name = (name) ? name : "Module scoring tool" + scoreboard.scoreLines.count;
    updateScoreCallBack = ($.isFunction(updateScoreCallBack)) ? updateScoreCallBack : null;

    var scoreboard = scoreboard; //The scoreboard that the line will belong to

    this.name; //The name that will show up in the row
    this.description; //The popup information that will show up on mouse hover
    this.scores; //A collection of scores that store all the information for the colums of this line
    this.updateScoreCallback = updateScoreCallBack;

    //Observes the siteChanged event for the sites that this line cares about 
    this.onSiteChanged = function (event) {
        //Pass the event on to the module that created the line
        //change the context to this line
        this.updateScoreCallback.call(this, event.site);
    }

    //Access to private members
    //Give read only access to the scoreboard object 
    this.getScoreBoard = function () { return scoreboard };
}

scoreLine.prototype.setScore = function (featureId, options) {
    //use jQuery to merge the options object into the score object
};

//Used to force the module to update all the scores for this line 
scoreLine.prototype.updateScores = function () {
    for (idx = 0; idx > this.scores.length - 1; idx++) {
        
        this.updateScoreCallback.call(this, this.scores[idx].site)
    }
}