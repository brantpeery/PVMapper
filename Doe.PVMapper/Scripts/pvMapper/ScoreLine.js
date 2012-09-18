/// <reference path="Event.js" />
/// <reference path="Score.js" />
/// <reference path="../_references.js" />

(function (pvM) {
    pvM.ScoreLine = function (options) {
        //Events
        this.scoreChangeEvent = new Event();
        this.updatingScoresEvent = new Event();
        this.siteChangeEvent = new Event();

        //Check to make sure the siteChangeHandler is a function
        var siteChangeHandler = ($.isFunction(options.onSiteChange)) ? siteChangeHandler : null;

        this.getUtilityScore = function () { };
        this.getWeight = function () { };
        this.getWeightedUtilityScore = function () { };
        this.addScore=function(site){
            var score = new pvM.Score(site);
            site.onSiteChange.addHandler(this.siteChange); //Attach our handler directly to the site.
            this.scores.push(score);
            return score;
        };

        this.name; //The name that will show up in the row
        this.description; //The popup information that will show up on mouse hover
        this.scores=new Array(); //A collection of scores that store all the information for the colums of this line
        for (site in pvM.sites) {
            this.addScore(site);
        }



        //Observes the siteChanged event for the sites that this line cares about 
        this.onSiteChange = function (event) {
            //Pass the event on to the module that created the line
            //change the context to this line
            var e = (event) ? event : {};
            e.type = "ScoreLine.siteChange"
            this.siteChangeEvent.fire(this, e);
        }

        //Observes any sites being removed to the site manager
        this.onSiteRemoved;

        //Observers any sites being added to the site manager
        this.onSiteAdded = function (e) {
            var site = e.site;
            
            //Create a new score for the site
            this.addScore(site);
            
        }


        //Used to force the module to update all the scores for this line 
        this.updateScores = function () {
            for (idx = 0; idx > this.scores.length - 1; idx++) {
                var e = {
                    site: this.scores[idx].site,
                    score: this.scores[idx],
                    type: "ScoreLine.updateScores"
                }
                this.siteChangeEvent.fire(this, e)
            }
        }
    }
})(pvMapper);