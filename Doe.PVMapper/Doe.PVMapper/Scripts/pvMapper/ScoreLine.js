/// <reference path="../_references.js" />

(function (pvM){
    pvM.ScoreLine = function (scoreboard, name, updateScoreCallBack) {
        this.scoreChangeEvent = new Event();
        this.updatingScoresEvent = new Event();

        //Make sure we have the correct parameters, default to the main scoreboard.
        scoreboard = (scoreboard.prototype == pvM.Scoreboard) ? scoreboard : pvM.mainScoreboard;

        //name = (name) ? name : "Module scoring tool" + scoreboard.scoreLines.count;
        updateScoreCallBack = ($.isFunction(updateScoreCallBack)) ? updateScoreCallBack : null;

        this.getUtilityScore = function () { };
        this.getWeight = function () { };
        this.getWeightedUtilityScore = function () { };

        this.name; //The name that will show up in the row
        this.description; //The popup information that will show up on mouse hover
        this.scores; //A collection of scores that store all the information for the colums of this line
        this.updateScoreCallback = updateScoreCallBack;

        //Observes the siteChanged event for the sites that this line cares about 
        this.onSiteChanged = function (event) {
            //Pass the event on to the module that created the line
            //change the context to this line
            var e = (event) ? event : {};
            if (!e.site) {
                ///TODO:Check to make sure the this var is a site
                e.site = this; //Set the site to the current context (should be a site)
            }
            
            this.updateScoreCallback.apply(this, e);
        }

        //Access to private members
        //Give read only access to the scoreboard object 
        this.getScoreBoard = function () { return scoreboard };
    }

    //Depreciated
    //pvM.ScoreLine.prototype.setScore = function (featureId, options) {
    //    //use jQuery to merge the options object into the score object
    //};

    //Used to force the module to update all the scores for this line 
    pvM.ScoreLine.prototype.updateScores = function () {
        for (idx = 0; idx > this.scores.length - 1; idx++) {

            this.updateScoreCallback.apply(this, this.scores[idx].site)
        }
    }
})(pvMapper);