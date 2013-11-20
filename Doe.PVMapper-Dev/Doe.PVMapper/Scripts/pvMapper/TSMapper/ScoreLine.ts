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
            //public scores: Score[]
            )
        {
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
                    functionArgs: { className: "Random" },
                    iconURL: null
                }
			};
            
            this.utilargs = new pvMapper.MinMaxUtilityArgs(0, 10, "", "");
            this.scoreUtility = new pvMapper.ScoreUtility(options.scoreUtilityOptions);

            //if (ClientDB.db == null)     
            //    ClientDB.initClientDB();

            this.loadAllSites();
            // this.loadScore();

            //Set the default weight of the tool
            //Note: a weight of 0 is possible and valid
            this.weight = (typeof options.weight === "number") ? options.weight : 0;
        }

        public utilargs: pvMapper.MinMaxUtilityArgs;
        public scoreUtility: ScoreUtility;
        public title: string;
        public weight: number;
        public description: string;
        public category: string;
        public scores: Score[] = new Array<Score>(); //  new Score[](); <<-- TS0.9.0 doesn't like this.
        //public updateScore: ICallback = options.updateScoreCallback;
        public active: boolean = true;

        getStarRatables: () => IStarRatings;
        setStarRatables: (rateTable: IStarRatings)=>void;

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
            this.saveScore();
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
            //Set the initial value from the tool
            try {
                // request a score update
                this.onSiteChange(undefined, score);
            } catch (ex) {
                if (console) console.error(ex);
            }
            //}

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
			return {
                title: this.title,
                weight: this.weight,
                description: this.description,
                category: this.category,
                scoreUtility: this.scoreUtility,
                scores: this.scores
            }
		}


        //private onSiteAdded = 

        //private onSiteUpdated(event: EventArg) {
        //    if (event.data instanceof Site)
        //        updateScore(event.data);
        //}



        //#region "Client indexedDB storage"
        public putScore(): any {
            var me = this;
            if (ClientDB.db) {
                try {
                    var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.STORE_NAME, "readwrite");
                    var store = txn.objectStore(ClientDB.STORE_NAME);
                    var stb = null;
                    if (me.getStarRatables !== undefined)
                       stb = me.getStarRatables(); // call the module for the rating value.
                    var dbScore: DBScore = new DBScore(
                        me.title,
                        me.description,
                        me.category,
                        me.weight,
                        me.active,
                        me.scoreUtility,
                        stb
                        );

                    var request = store.get(me.title);
                    request.onsuccess = function (evt): any {
                        if (request.result != undefined) { // if already exists, update
                            store.put(dbScore, dbScore.title);
                        }
                        else
                            store.add(dbScore, dbScore.title); // if new, add
                    }
                } catch (e) {
                    console.log("putScore failed, cause: " + e.message);
                }
            }
        }

        public saveScore(): any {
            if (ClientDB.db == null) return;
            try {
                this.putScore();
            }
            catch (e) {
                console.log("Error: " + e.message);
            }
        }

        public getScore(): any {
            var me = this;
            if (ClientDB.db) {
                var txn = ClientDB.db.transaction(ClientDB.STORE_NAME, "readonly");
                var store = txn.objectStore(ClientDB.STORE_NAME);
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
                        //This won't work.  No way to write back to the module's rateTable.
                        //me.getStarRatables = request.result.rateTable;

                        if ((me.setStarRatables !== undefined) && (request.result.rateTable !== null)) {
                            me.setStarRatables(request.result.rateTable);
                        }

                        me.updateScores();
                    }
                }
			}
        }

        public loadScore(): any {
            if (ClientDB.db == null) return;
            try {
                this.getScore();
            }
            catch (e) {
                console.log("Error: " + e.message);
            }
        }

        //#endregion "Client indexedDB storage"
    }

}
