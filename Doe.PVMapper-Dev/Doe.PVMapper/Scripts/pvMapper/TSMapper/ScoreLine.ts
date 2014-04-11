/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="SiteManager.ts" />
/// <reference path="Tools.ts" />
///<reference path="DataManager.ts"/>

// Module
module pvMapper {
    //  import pvM = pvMapper;

    export class DBScore {
        constructor(
            public title: string,
            public description: string,
            public category: string,
            public weight: number,
            public active: boolean,
            public scoreUtility: ScoreUtility,
            public rateTable: IStarRatings
            ) {
        }
    }

    // Class
    export class ScoreLine implements IToolLine {
        // Constructor
        constructor(options: IScoreToolOptions) {
            //console.log("Adding a scoreline for " + options.title);
            this.self = this;
            this.title = (typeof (options.title) === 'string') ? options.title : 'Unnamed Tool';
            //this.description = (typeof (options.description) === 'string') ? options.description : 'Unnamed Tool';
            if (options.description) {
                this.description = options.description;
            }
            if (options.longDescription) {
                this.longDescription = options.longDescription;
            }
            this.category = (typeof (options.category) === 'string') ? options.category : 'Other';

            if ($.isFunction(options.onSiteChange)) {
                this.onSiteChange = () => { return options.onSiteChange.apply(this, arguments); }
            }

            // star rating functions
            if ($.isFunction(options.getStarRatables)) {
                this.getStarRatables = () => { return options.getStarRatables.apply(this, arguments); }
            }

            if ($.isFunction(options.setStarRatables)) {
                this.setStarRatables = (rateTable: IStarRatings) => { options.setStarRatables.apply(this, arguments); }
            }

            if ($.isFunction(options.getModuleName)) {
                this.getModuleName = () => { return options.getModuleName.apply(this, arguments); }
            }

            if ($.isFunction(options.setModuleName)) {
                this.setModuleName = (name: string) => { options.setModuleName.apply(this, arguments); }
            }

            if ($.isFunction(options.getTitle)) {
                this.getTitle = () => { return options.getTitle.apply(this, arguments); }
            }

            if ($.isFunction(options.setTitle)) {
                this.setTitle = (name: string) => { options.setTitle.apply(this, arguments); }
            }

            // config window
            if ($.isFunction(options.showConfigWindow)) {
                this.showConfigWindow = () => { options.showConfigWindow.apply(this, arguments); }
            }

            this.valueChangeHandler = (event: IScoreValueChangedEvent) => {
                //Update the utility score for the score that just changed it's value.
                event.score.setUtility(this.getUtilityScore(event.newValue));

                this.scoreChangeEvent.fire(this, event);
            }

            //if ($.isFunction(options.onScoreAdded)) {
            //    this.scoreAddedEvent.addHandler(options.onScoreAdded);
            //}

            siteManager.siteAdded.addHandler((event: Site) => {
                //if (console) console.log("Siteadded event detected in scoreline" + name);

                this.addScore(event);
            });

            siteManager.siteRemoved.addHandler((site: Site) => {
                this.onSiteRemove(site);
            });

            //Set default scoreUtilityOptions object if none was provided
            if (options.scoreUtilityOptions == undefined) {
                options.scoreUtilityOptions = {
                    functionName: "random",
                    functionArgs: null,
                    iconURL: null
                }
            };

            this.utilargs = new pvMapper.MinMaxUtilityArgs(0, 10, "", "");
            this.scoreUtility = new pvMapper.ScoreUtility(options.scoreUtilityOptions);
            this.defaultScoreUtility = new pvMapper.ScoreUtility(options.scoreUtilityOptions);

            this.loadAllSites();

            //Set the default weight of the tool
            //Note: a weight of 0 is possible and valid. The default weight is 10.
            this.weight = (typeof options.weight === "number") ? options.weight : 10;
        }

        public utilargs: pvMapper.MinMaxUtilityArgs;
        public scoreUtility: ScoreUtility;
        public defaultScoreUtility: ScoreUtility;
        public title: string;
        public weight: number;
        public description: string;
        public longDescription: string;
        public category: string;
        public scores: Score[] = new Array<Score>(); //  new Score[](); <<-- TS0.9.0 doesn't like this.
        //public updateScore: ICallback = options.updateScoreCallback;
        public active: boolean = true;
        public suspendEvent: boolean = false;

        getStarRatables: (mode?: string) => IStarRatings;
        setStarRatables: (rateTable: IStarRatings) => void;
        getModuleName: () => string;
        setModuleName: (name: string) => void;
        getTitle: () => string;
        setTitle: (newTitle: string) => void;

        showConfigWindow: () => void;

        public self: ScoreLine;
        //public scoreAddedEvent: pvMapper.Event = new pvMapper.Event();
        public scoreChangeEvent: pvMapper.Event = new pvMapper.Event();
        public updatingScoresEvent: pvMapper.Event = new pvMapper.Event();

        public getUtilityScore(x: number): number { return this.scoreUtility.run(x); }
        public getWeight(): number { return this.weight; }
        public setWeight(value: number) {
            this.weight = value;
            this.scoreChangeEvent.fire(self, undefined); // score line changed
            this.saveConfiguration();
        }

        /**
          Adds a score object to this line for the site.
        */
        public addScore(site: pvMapper.Site): pvMapper.Score {
            //console.log('Adding new score to scoreline');
            var score: pvMapper.Score = new pvMapper.Score(site);
            //score.value = this.getvalue(site);

            //attach the tool's handler directly to the score
            score.siteChangeEvent.addHandler(this.onSiteChange);

            //subscribe to the score updated event
            score.valueChangeEvent.addHandler(this.valueChangeHandler);

            this.scores.push(score);

            //this.self.scoreAddedEvent.fire(score, [{ score: score, site: site }, score]);

            // Check if we are testing; if so, skip the initial load of scores
            //if (document.location.hostname === "localhost") {
            //    //Set the initial value to 1
            //    window.setTimeout(function () {
            //        score.popupMessage = "localhost" +
            //            " &nbsp (this appears only when running from localhost;" +
            //            " it's an initial dummy value, where all scores are set to 1;" +
            //            " to load actual scores, simply edit/change/drag a site vertex)";
            //        score.updateValue.apply(score, [1]);
            //    }, 2500 * Math.random());

            //} else {
            if (!this.suspendEvent) {
                //Set the initial value from the tool
                try {
                    // request a score update
                    this.onSiteChange(undefined, score);
                } catch (ex) {
                    if (console) console.error(ex);
                }
                //}
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

        // this updates utility scores from the existing score value of each Score object
        public updateScores() {
            this.scores.forEach(function (score: Score, index: number, scores: Score[]) {
                var oldvalue = score.value;
                score.setUtility(this.getUtilityScore(score.value));
                this.scoreChangeEvent.fire(this, <IScoreValueChangedEvent> {
                    score: score,
                    oldValue: oldvalue,
                    newValue: score.value
                });
            }, this);
        }

        //public refreshAllScoresFromServer() {
        //    this.scores.forEach(function (score: Score, index: number, scores: Score[]) {
        //       this.onSiteChange(null, score);
        //    });
        //}

        public valueChangeHandler: ICallback;

        //Storage pointer to the tool's sitechanged handler function
        private onSiteChange: ICallback;

        private loadAllSites() {
            var _this = this;
            var allSites = siteManager.getSites();
            $.each(allSites, function (idx, site) {
                _this.addScore(site);
            });
        }

        private onSiteRemove(site: Site) {
            console.log('Attempting to remove a site/score from the scoreline')
            for (var i = 0; i < this.scores.length; i++) {
                var score: Score = this.scores[i];
                if (score.site == site) {
                    // remove site from scoreline.
                    score.siteChangeEvent.removeHandler(this.onSiteChange);
                    score.valueChangeEvent.removeHandler(this.valueChangeHandler);
                    this.scores.splice(i, 1);
                    this.scoreChangeEvent.fire(self, undefined);
                    break;
                }
            }
        }

        public toJSON(): any {
            var stb = null;
            if (this.getStarRatables !== undefined)
                stb = this.getStarRatables(); // call the module for the rating value.
            var o = {
                title: this.title,
                weight: this.weight,
                description: this.description,
                longDescription: this.longDescription,
                category: this.category,
                scoreUtility: this.scoreUtility,
                scores: this.scores,
                starRateTable: stb
            }
          return o;
        }

        public fromJSON(o: any) {
            this.title = o.title;
            this.weight = o.weight;
            this.description = o.description;
            this.longDescription = o.longDescription;
            this.category = o.category;
            this.scoreUtility.fromJSON(o.scoreUtility);
            this.scores = new Array<Score>();

            var asite;
            var ascore: pvMapper.Score = null;

            for (var i = 0; i < o.scores.length; i++) {
                asite = pvMapper.siteManager.getSiteByName(o.scores[i].site.name);
                if (asite !== null) {
                    ascore = this.addScore(asite);
                    ascore.fromJSON(o.scores[i]);
                }
            }

            if ((this.setStarRatables !== undefined) && (o.starRateTable !== null)) {
                this.setStarRatables(o.starRateTable);
            }
        }

        //#region "Client indexedDB storage"
        public putConfiguration(): any {
            var me = this;
            if (ClientDB.db) {
                try {
                    var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.CONFIG_STORE_NAME, "readwrite");

                    txn.oncomplete = function (evt): any {
                        console.log("Transaction completed: '" + me.title + "' has been saved to the database.")
                    }
                    txn.onerror = function (evt): any {
                        console.log("Transaction error: saving '" + me.title + "' failed, cause: " + txn.error);
                    }

                    txn.onabort = function (evt): any {
                        console.log("Transaction aborted: saving " + me.title + " failed, cause: " + txn.error);
                    }

                    var store = txn.objectStore(ClientDB.CONFIG_STORE_NAME);
                    var stb = null;
                    if (me.getStarRatables !== undefined)
                        stb = me.getStarRatables(); // call the module for the rating value.

                    //Man!!!!  IndexedDB just hates the IScoreUtilityArgs "stringify" function.  It conplains that it can not clone the object if it has a 'stringify' function defined.
                    //Even the scoreUtility class has "stringify" defined, its fine, just not in the ScoreUtilityArgs class like ThreePoint or Linear.  May be because it thinks that 
                    //the stringify there has text formatting resemblance of DOM elements, because IndexedDB will not serialized DOM nodes.
                    //since we will be serialized the scoreUtility and its going to do away with functions any way, we just remove the function 'stringify' if any.
                    var util = new pvMapper.ScoreUtility(me.scoreUtility);
                    if (util.functionArgs.stringify !== undefined)
                        util.functionArgs.stringify = undefined;

                    var dbScore: DBScore = new DBScore(
                        me.title,
                        me.description,
                        me.category,
                        me.weight,
                        me.active,
                        util,
                        stb
                        );

                    var request = store.get(me.title);
                    request.onsuccess = function (evt): any {
                        if (request.result != undefined) { // if already exists, update
                            store.put(dbScore, dbScore.title);
                            console.log("updated '" + me.title + "' successful.");
                        }
                        else {
                            store.add(dbScore, dbScore.title); // if new, add
                            console.log("new record '" + me.title + "' saved successful.");
                        }
                    }
                    request.onerror = function (evt): any {
                        console.log("save utilitity, check for existing record failed, cause: " + evt.message);
                    }
                } catch (e) {
                    console.log("putScore failed, cause: " + e.message);
                }
            }
        }

        public saveConfiguration(): any {
            if (ClientDB.db == null) return;
            try {
                this.putConfiguration();
            }
            catch (e) {
                console.log("Error: " + e.message);
            }
        }

        public getConfiguration(): any {
            var me = this;
            if (ClientDB.db) {
                var txn = ClientDB.db.transaction(ClientDB.CONFIG_STORE_NAME, "readonly");
                var store = txn.objectStore(ClientDB.CONFIG_STORE_NAME);
                var request = store.get(me.title);
                request.onsuccess = function (evt): any {
                    if (request.result != undefined) {
                        me.title = request.result.title;
                        me.description = request.result.description;
                        me.category = request.result.category;
                        me.weight = request.result.weight;
                        me.active = request.result.active;

                        me.scoreUtility.functionName = request.result.scoreUtility.functionName;
                        me.scoreUtility.functionArgs = request.result.scoreUtility.functionArgs;
                        me.scoreUtility.iconURL = request.result.scoreUtility.iconURL;
                        me.scoreUtility.fCache = request.result.scoreUtility.fCache;

                        if ((me.setStarRatables !== undefined) && (request.result.rateTable !== null)) {
                            me.setStarRatables(request.result.rateTable);
                        }

                        me.updateScores();
                    }
                }
            }
        }

        public loadConfiguration(): any {
            if (ClientDB.db == null) return;
            try {
                this.getConfiguration();
            }
            catch (e) {
                console.log("Error: " + e.message);
            }
        }

        public updateConfiguration(utility: ScoreUtility, starRatables: IStarRatings, weight: number) {
            this.scoreUtility.functionName = utility.functionName;
            this.scoreUtility.functionArgs = utility.functionArgs;
            this.scoreUtility.iconURL = utility.iconURL;
            this.scoreUtility.fCache = utility.fCache;

            if ((this.setStarRatables !== undefined) && (starRatables !== undefined)) {
                this.setStarRatables(starRatables);
            }
            this.setWeight(weight);
        }
        //#endregion "Client indexedDB storage"
    }

}
