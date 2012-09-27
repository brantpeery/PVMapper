/// <reference path="Event.js" />
/// <reference path="Score.js" />
/// <reference path="../_references.js" />

(function (pvM) {
    pvM.ScoreLine = function (options) {
        var self = this;

        //Events
        this.scoreAddedEvent = new Event();  //Signature is (EVENT = {score, site}, score)
        this.scoreChangeEvent = new Event(); //Signature is (EVENT = {score, site}, score)
        this.updatingScoresEvent = new Event(); //Signature is ??
        //this.siteChangeEvent = new Event();

        //Check to make sure the siteChangeHandler is a function
        var siteChangeHandler = ($.isFunction(options.onSiteChange)) ? options.onSiteChange : null;
        //this.siteChangeEvent.addHandler(siteChangeHandler);


        this.getUtilityScore = function () { };
        this.getWeight = function () {; }
        this.getWeightedUtilityScore = function () { };
        this.addScore = function (site) {
            var score = new pvM.Score(site);
            score.siteChangeEvent.addHandler(siteChangeHandler); //Attach the tool's handler directly to the score.

            //Subscribe to the score updated event
            score.valueChangeEvent.addHandler(function (event) {
                self.scoreChangeEvent.fire(self, event); //Just pass the event on while setting the context
            });
            self.scores.push(score);

            //Set the initial value from the tool
            score.updateValue(self.getValue(site));

            self.scoreAddedEvent.fire(score, [{ score: score, site: site }, score]);
            return score;
        };


        this.name = (typeof (options.title) === 'string') ? options.title : "Unnamed Tool"; //The name that will show up in the row
        this.description = (typeof (options.description) === 'string') ? options.description : "Unnamed Tool";; //The popup information that will show up on mouse hover
        this.scores = new Array(); //A collection of scores that store all the information for the colums of this line
        for (site in pvM.sites) {
            self.addScore(site);
        }
        this.getValue = options.calculateValueCallback;

        //Observes the siteChanged event for the sites that this line cares about 
        //this.onSiteChange = function (event) {
        //    //Pass the event on to the module that created the line
        //    //change the context to this line
        //    var e = (event) ? event : {};
        //    e.type = "ScoreLine.siteChange"
        //    this.siteChangeEvent.fire(this, e);
        //}

        //Observes any sites being removed to the site manager
        this.onSiteRemoved = function (event) {
            //Remove the reference to the site. 


        };

        //Observers any sites being added to the site manager
        this.onSiteAdded = function (e) {
            var site = e.site;

            //Create a new score for the site
            self.addScore(site);
        }


        //Used to force the module to update all the scores for this line 
        this.updateScores = function () {
            for (idx = 0; idx > this.scores.length - 1; idx++) {
                var e = {
                    site: this.scores[idx].site,
                    score: this.scores[idx],
                    type: "ScoreLine.updateScores"
                }
                self.siteChangeEvent.fire(this, e);
            }
        }


        //Init logic
        loadAllSites();

        //Watch all the events from the site manager
        pvM.siteManager.siteAdded.addHandler(this.onSiteAdded);
        pvM.siteManager.siteRemoved.addHandler(this.onSiteRemoved);

        //Private functions        
        function loadAllSites() {
            var self = this; //Give access back to the public members within the inner scopes
            var allSites = pvM.siteManager.getSites();
            $.each(allSites, function (idx, site) {
                self.addSite(site);
            });
        }
    }
})(pvMapper);