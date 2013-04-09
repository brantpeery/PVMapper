/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="SiteManager.ts" />


// Module
module pvMapper {
    //  import pvM = pvMapper;

    // Class
    export class ScoreLine {
        // Constructor
        constructor(options: IScoreTool) {
            //console.log("Adding a scoreline for " + options.title);
            this.self = this;
            this.name = (typeof (options.title) === 'string') ? options.title : 'Unnamed Tool';
            this.description = (typeof (options.description) === 'string') ? options.description : 'Unnamed Tool';
            this.category = (typeof (options.category) === 'string') ? options.category : 'Other';
            this.weight = 1;

            if ($.isFunction(options.onSiteChange)) {
                this.onSiteChangeHandler = options.onSiteChange
            }

            this.valueChangeHandler = (event: IScoreValueChangedEvent) => {
                ///TODO: Create a ValueChangeEventArg or something to let the user know what to expect

                //Update the utility score for the score that just changed it's value.
                event.score.setUtility(this.getUtilityScore(event.newValue));
                this.scoreChangeEvent.fire(self, event);
            }

            if ($.isFunction(options.onScoreAdded)) {
                this.scoreAddedEvent.addHandler(options.onScoreAdded);
            }

            siteManager.siteAdded.addHandler((event: Site) => {
                if (console) console.log("Siteadded event detected in scoreline" + name);

                this.addScore(event);
            });

            siteManager.siteRemoved.addHandler((site: Site) => {
                this.onSiteRemove(site);
            });

            //Set default scoreUtilityOptions object if none was provided
            if (options.scoreUtilityOptions == undefined) {
                options.scoreUtilityOptions = {
                    functionName: "random",
                    functionArgs: {}
                }
            }

            this.scoreUtility = new ScoreUtility(options.scoreUtilityOptions);

            //Set the default weight of the tool
            this.weight = (typeof options.defaultWeight === "number") ? options.defaultWeight : 10;

            this.loadAllSites();
        };

        public scoreUtility: ScoreUtility;
        public name: string;
        public weight: number;
        public description: string;
        public category: string;
        public scores: Score[] = new Score[]();
        //public updateScore: ICallback = options.updateScoreCallback;
        public active: Boolean = true;

        public self: ScoreLine;
        public scoreAddedEvent: pvMapper.Event = new pvMapper.Event();
        public scoreChangeEvent: pvMapper.Event = new pvMapper.Event();
        public updatingScoresEvent: pvMapper.Event = new pvMapper.Event();

        public getUtilityScore(x) { return this.scoreUtility.run(x); }  number;
        public getWeight(): number { return this.weight; }
        public getWeightedUtilityScore(): number { return 0; }

        /**
          Adds a score object to this line for the site.
        */
        public addScore(site: pvMapper.Site): pvMapper.Score {
            //console.log('Adding new score to scoreline');
            var score: pvMapper.Score = new pvMapper.Score(site);
            //score.value = this.getvalue(site);

            //attach the tool's handler directly to the score
            score.siteChangeEvent.addHandler(this.onSiteChangeHandler);

            //subscribe to the score updated event
            score.valueChangeEvent.addHandler(this.valueChangeHandler);

            this.scores.push(score);
            //this.self.scoreAddedEvent.fire(score, [{ score: score, site: site }, score]);
            //Set the initial value from the tool
            try {
                this.onSiteChangeHandler(undefined, score);
                //this.updateScore(score);
            } catch (ex) {
                if (console) console.log(ex);
            }
            return score;
        }

        //public removeScore(score: Score) {
        //    // remove site from scoreline.
        //    score.siteChangeEvent.removeHandler(this.onSiteChangeHandler);
        //    score.valueChangeEvent.removeHandler(this.valueChangeHandler);
        //    var idx: number = this.scores.indexOf(score);
        //    if (idx >= 0) {
        //        this.scores.splice(idx, 1);
        //    }
        //}

        //public updateScores(site: Site) {

        //}

        public valueChangeHandler: ICallback;

        //Storage pointer to the tool's sitechanged handler function
        private onSiteChangeHandler: ICallback;

        private loadAllSites() {
            var allSites = siteManager.getSites();
            $.each(allSites, function (idx, site) {
                this.addScore(site);
            });
        }

        private onSiteRemove(site: Site) {
            console.log('Attempting to remove a site/score from the scoreline')
            for (var i = 0; i < this.scores.length; i++) {
                var score: Score = this.scores[i];
                if (score.site == site) {
                    // remove site from scoreline.
                    score.siteChangeEvent.removeHandler(this.onSiteChangeHandler);
                    score.valueChangeEvent.removeHandler(this.valueChangeHandler);
                    this.scores.splice(i, 1);
                    this.scoreChangeEvent.fire(self, undefined);
                    break;
                }
            }
        }

        //private onSiteAdded = 

        //private onSiteUpdated(event: EventArg) {
        //    if (event.data instanceof Site)
        //        updateScore(event.data);
        //}

    }

}
