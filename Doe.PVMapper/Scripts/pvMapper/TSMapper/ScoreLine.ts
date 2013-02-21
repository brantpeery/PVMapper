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
            console.log("Adding a scoreline for " + options.title);
            this.self = this;
            this.name = (typeof (options.title) === 'string') ? options.title : 'Unnamed Tool';
            this.description = (typeof (options.description) === 'string') ? options.description : 'Unname Tool';
            if ($.isFunction(options.onSiteChange)) {
                this.onSiteChangeHandler = options.onSiteChange
            }

            this.valueChangeHandler = (event: EventArg) => {
                ///TODO: Create a ValueChangeEventArg or something to let the user know what to expect

                this.scoreChangeEvent.fire(self, event);
            }

            if ($.isFunction(options.onScoreAdded)) {
                this.scoreAddedEvent.addHandler(options.onScoreAdded);
            }

            siteManager.siteAdded.addHandler((event: Site) => {
                console.log("Siteadded event detected in scoreline" + name);

                this.addScore(event);
            });
            siteManager.siteRemoved.addHandler(this.onSiteRemove);

            this.loadAllSites();
        };

        public name: string;
        public description: string;
        public scores: Score[] = new Score[]();
        public getvalue: ICallback = options.calculateValueCallback;

        public self: ScoreLine;
        public scoreAddedEvent: pvMapper.Event = new pvMapper.Event();
        public scoreChangeEvent: pvMapper.Event = new pvMapper.Event();
        public updatingScoresEvent: pvMapper.Event = new pvMapper.Event();

        public getUtilityScore(): number { return 0; }
        public getWeight(): number { return 0; }
        public getWeightedUtilityScore(): number { return 0; }

        /**
          Adds a score object to this line for the site.
        */
        public addScore(site: pvMapper.Site): pvMapper.Score {
            console.log('Adding new score to scoreline');
            var score: pvMapper.Score = new pvMapper.Score(site);
            score.value = this.getvalue(site);

            //attach the tool's handler directly to the score
            score.siteChangeEvent.addHandler(this.onSiteChangeHandler);

            //subscribe to the score updated event
            score.valueChangeEvent.addHandler(this.valueChangeHandler);

            this.scores.push(score);
            //this.self.scoreAddedEvent.fire(score, [{ score: score, site: site }, score]);
            //Set the initial value from the tool
            score.updateValue(this.getvalue(site));
            return score;
        }

        public removeScore(score: Score) {
            // remove site from scoreline.


        }

        public updateScores(site: Site) {

        }

        public valueChangeHandler: ICallback;

        //Storage pointer to the tool's sitechanged handler function
        private onSiteChangeHandler: ICallback;

        private loadAllSites() {
            var allSites = siteManager.getSites();
            $.each(allSites, function (idx, site) {
                this.addScore(site);
            });
        }


        ///TODO: get this to work using a score not a site
        private onSiteRemove(event: EventArg) {
            console.log('Attempting to remove a site/score from the scoreline')
            if (event.data instanceof Site)
                //remove the reference to the site.
                this.self.removeScore(event.data);

        }

        //private onSiteAdded = 

        //private onSiteUpdated(event: EventArg) {
        //    if (event.data instanceof Site)
        //        updateScore(event.data);
        //}

    }

}
