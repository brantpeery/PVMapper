/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="SiteManager.ts" />
/// <reference path="Tools.ts" />
///<reference path="DataManager.ts"/>

// Module
module pvMapper {
    //  import pvM = pvMapper;

    export interface IScoreLineJSON extends IToolJSON {
        id: string; // <-- in IToolJSON
        title: string; // <-- in IToolJSON

        //description: string;
        //category: string;
        weight: number;
        //isActive: boolean;
        scores: IScoreJSON[];
        scoreUtility: ScoreUtility; //TODO: fix score utility... sometime... it's dreadful.
        starRateTable: IStarRatings;
        config: any;
    }

    // Class
    export class ScoreLine implements IToolLine {
        // Constructor
        constructor(options: IScoreToolOptions, parentModule: Module) {
            if (console && console.assert) console.assert(!!options.id, "Missing ID on tool '" + options.title +
                parentModule ? ("' from module '" + (parentModule.id || parentModule.title) + "'") : "'");

            this.getModule = () => { return parentModule; };

            this.id = options.id;

            this.title = options.title || (parentModule && parentModule.title) || 'Unnamed Tool';
            this.category = options.category || (parentModule && parentModule.category) || 'Other';
            this.description = options.description || (parentModule && parentModule.description) || "";
            this.longDescription = options.longDescription || (parentModule && parentModule.longDescription) || ("<p>" + this.description + "</p>");

            if ($.isFunction(options.onSiteChange)) {
                this.onSiteChange = (e, score: pvMapper.Score) => {
                    if (console && console.warn && score.isValueOld) console.warn(
                        "Warning: new score update requested before the last score update finished (slow tool ID='" + this.id + "')");
                    score.isValueOld = true;

                    return options.onSiteChange.apply(this, arguments); // update score value
                }
            }

            // star rating functions
            if ($.isFunction(options.getStarRatables)) {
                this.getStarRatables = () => { return options.getStarRatables.apply(this, arguments); }
            }

            if ($.isFunction(options.setStarRatables)) {
                this.setStarRatables = (rateTable: IStarRatings) => { options.setStarRatables.apply(this, arguments); }
            }

            // tool config functions (to store any other options or values the tool may need.
            if ($.isFunction(options.getConfig)) {
                this.getConfig = () => { return options.getConfig.apply(this, arguments); }
            }

            if ($.isFunction(options.setConfig)) {
                this.setConfig = (config: any) => { options.setConfig.apply(this, arguments); }
            }

            // config window
            if ($.isFunction(options.showConfigWindow)) {
                this.showConfigWindow = () => { options.showConfigWindow.apply(this, arguments); }
            }

            this.valueChangeHandler = (event: IScoreValueChangedEvent) => {
                //Update the utility score for the score that just changed it's value.
                event.score.utility = this.getUtilityScore(event.newValue);

                this.delayFireScoreChangeEvent();
            }

            //if ($.isFunction(options.onScoreAdded)) {
            //    this.scoreAddedEvent.addHandler(options.onScoreAdded);
            //}

            var siteAddedHandler = (site: Site) => { this.addScore(site); };
            var siteRemovedHandler = (site: Site) => { this.removeScore(site); }

            this.activate = () => {
                if (console && console.assert) console.assert(!this.isActive);

                if (typeof (options.activate) === "function")
                    options.activate.apply(this, arguments); // 'this' will refer to the ScoreLine during calls to options.activate().

                siteManager.siteAdded.addHandler(siteAddedHandler);
                siteManager.siteRemoved.addHandler(siteRemovedHandler);

                this.isActive = true;

                this.loadAllSites();

                pvMapper.mainScoreboard.addLine(this);
            };

            this.deactivate = () => {
                if (!this.isActive) {
                    if (console && console.warn) console.warn("Warning: attempting to deactivate an already inactive tool ID='" + this.id + "'");
                }

                if (typeof (options.deactivate) === "function")
                    options.deactivate.apply(this, arguments); // 'this' will refer to the ScoreLine during calls to options.deactivate().

                siteManager.siteAdded.removeHandler(siteAddedHandler);
                siteManager.siteRemoved.removeHandler(siteRemovedHandler);

                this.isActive = false;

                this.unloadAllSites();

                pvMapper.mainScoreboard.removeLine(this);
            };

            if (console && console.assert) console.assert(typeof (options.scoreUtilityOptions) === "object",
                "Error: Missing score utility object on tool ID='" + this.id + "'");

            this.scoreUtility = new pvMapper.ScoreUtility(options.scoreUtilityOptions);

            //Set the default weight of the tool
            //Note: a weight of 0 is possible and valid. The default weight is 10.
            this.weight = (typeof options.weight === "number") ? options.weight : 10;

            // handy means of reusing code paths to reset the socreline configuration
            //Note: we keep this as a JSON string (rather than a JSON object) as a convenient means of deep-cloning the object.
            var defaultConfiguration: string = JSON.stringify(this.toJSON()); // <-- kinda hacky...
            this.resetConfiguration = () => {
                this.fromJSON(JSON.parse(defaultConfiguration));
            }

            // and finally, load our browser-cached configuration (if any)
            this.loadConfiguration();
        }

        public utilargs: pvMapper.MinMaxUtilityArgs;
        public scoreUtility: ScoreUtility;

        public id: string;

        public title: string;
        public weight: number;
        public description: string;
        public longDescription: string;
        public category: string;

        public scores: Score[] = new Array<Score>(); //  new Score[](); <<-- TS0.9.0 doesn't like this.
        //public updateScore: ICallback = options.updateScoreCallback;

        public isActive: boolean = false;
        public activate: () => void;
        public deactivate: () => void;

        //public suspendEvent: boolean = false;

        public getStarRatables: () => IStarRatings;
        public setStarRatables: (rateTable: IStarRatings) => void;

        public getConfig: () => any;
        public setConfig: (options: any) => void;

        //getModuleName: () => string;
        //setModuleName: (name: string) => void;
        //getTitle: () => string;
        //setTitle: (newTitle: string) => void;
        public getModule: () => pvMapper.Module;
        public showConfigWindow: () => void;

        //public scoreAddedEvent: pvMapper.Event = new pvMapper.Event();
        public scoreChangeEvent: pvMapper.Event = new pvMapper.Event();
        public updatingScoresEvent: pvMapper.Event = new pvMapper.Event();

        public getUtilityScore = (x: number): number => { return this.scoreUtility.run(x); }

        public getWeight = (): number => { return this.weight; }
        public setWeight = (value: number) => {
            this.weight = value;
            this.delayFireScoreChangeEvent(); // score line changed
            this.saveConfiguration();
        }

        /**
          Adds a score object to this line for the site.
        */
        public addScore = (site: pvMapper.Site): pvMapper.Score => {
            //console.log('Adding new score to scoreline');
            var score: pvMapper.Score = new pvMapper.Score(site, this);
            //score.value = this.getvalue(site);

            //attach the tool's handler directly to the score
            score.siteChangeEvent.addHandler(this.onSiteChange);

            //subscribe to the score updated event
            score.valueChangeEvent.addHandler(this.valueChangeHandler);

            this.scores.push(score);

            //this.self.scoreAddedEvent.fire(score, [{ score: score, site: site }, score]);

            try {
                // request a score update
                this.onSiteChange(null, score);
            } catch (ex) {
                if (console) console.error(ex);
            }
            return score;
        }

        // this updates utility scores from the existing score value of each Score object
        public applyUtilityFunctionToAllScores = () => {
            this.scores.forEach((score: Score, index: number, scores: Score[]) => {
                score.utility = this.getUtilityScore(score.value);
                this.delayFireScoreChangeEvent();
            });
        }

        public valueChangeHandler: ICallback;

        // Wrapper for the tool's sitechanged handler function
        private onSiteChange: ICallback;

        private loadAllSites = () => {
            var allSites = siteManager.getSites();
            allSites.forEach((site) => {
                this.addScore(site);
            });
        }

        private unloadAllSites = () => {
            var allSites = this.scores.map(s => s.site);
            allSites.forEach((site) => {
                this.removeScore(site);
            });
        }

        private removeScore = (site: Site) => {
            for (var i = 0; i < this.scores.length; i++) {
                var score: Score = this.scores[i];
                if (score.site == site) {
                    // remove site from scoreline.
                    score.siteChangeEvent.removeHandler(this.onSiteChange);
                    score.valueChangeEvent.removeHandler(this.valueChangeHandler);
                    score.deactivate();
                    this.scores.splice(i, 1);
                    this.delayFireScoreChangeEvent();
                    break;
                }
            }
        }

        // this fires a score change event after a bit...
        // hopefully adding the delay will prevent these events from occurring mid-way through an atomic change 
        // (like when we delete a site, or when we change the configuration for the line)
        private delayFireScoreChangeEvent_timeoutHandle = null;
        private delayFireScoreChangeEvent = () => {
            if (this.delayFireScoreChangeEvent_timeoutHandle === null) {
                this.delayFireScoreChangeEvent_timeoutHandle = window.setTimeout(() => {
                    this.delayFireScoreChangeEvent_timeoutHandle = null;
                    this.scoreChangeEvent.fire(this, null);
                }, 1); // trivial 1ms delay
            }
        }

        public toJSON = (): IScoreLineJSON => {
            var stb = null;
            if (typeof (this.getStarRatables) === "function")
                stb = this.getStarRatables(); // call the module for the rating value.

            var config = null;
            if (typeof (this.getConfig) === "function")
                config = this.getConfig(); // call the module for the rating value.

            var o = {
                // we want to return all of these fields because this is used for storage, as well as for reporting!
                id: this.id,
                title: this.title,
                weight: this.weight,
                description: this.description,
                longDescription: this.longDescription,
                category: this.category,
                scoreUtility: this.scoreUtility.toJSON(),
                scores: this.scores.map(s => s.toJSON()),
                starRateTable: stb,
                config: config,
            }
            return o;
        }

        public fromJSON = (o: IScoreLineJSON) => {
            if (console && console.assert) console.assert(o.id === this.id || typeof (o.id) === "undefined", // old storage format didn't save IDs.
                "Error: Attempting to load config from tool ID '" + o.id + "' into tool ID '" + this.id + "'");

            if (console && console.warn && o.title && this.title !== o.title) console.warn(
                "Warning: tool changing title from '" + this.title + "' to '" + o.title + "'.");

            this.title = o.title || this.title; // custom KML tools use this (I think...)
            this.weight = o.weight;
            // we don't want to load a lot of these - our current values are likely better than the old saved description etc.
            //this.description = o.description;
            //this.longDescription = o.longDescription;
            //this.category = o.category;
            this.scoreUtility.fromJSON(o.scoreUtility);
            //this.scores = new Array<Score>();

            //TODO: should we update scores now, or should we call a more robust update after the root operation completes?
            this.applyUtilityFunctionToAllScores();

            //TODO: load/handle active state...?

            //Note: not reloading scores at present... no real compelling reason to do so.
            // load scores... (Note: any new sites will need to be loaded before this... hmm...)
            //for (var i = 0; i < o.scores.length; i++) {
            //    if (o.scores[i].scoreLine && o.scores[i].scoreLine.id === this.id) {
            //        // this isn't ok...
            //        if (console && console.warn) console.warn("Warning: attempting to load scores which don't belong to this score line.");
            //    } else {
            //        var matchingScores = this.scores.filter(s => s.site.id === o.scores[i].site.id);
            //        if (console && console.assert) console.assert(matchingScores.length < 2, "Warning: duplicate score ID encountered.");

            //        if (matchingScores.length) {
            //            matchingScores[0].fromJSON(o.scores[i]);
            //        }
            //    }
            //}

            if (typeof (this.setStarRatables) === "function" && o.starRateTable) {
                this.setStarRatables(o.starRateTable);
            }
            if (typeof (this.setConfig) === "function" && o.config) {
                this.setConfig(o.config);
            }

            this.saveConfiguration();
        }

        //#region "Client indexedDB storage"
        private putConfiguration = (): void => {
            if (ClientDB.db && !this.isGettingConfiguration) {
                try {
                    var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.SCORE_LINE_CONFIG_STORE_NAME, "readwrite");

                    txn.oncomplete = (evt): any => {
                        //if (console && console.log) console.log("Transaction completed: '" + this.title + "' has been saved to the database.")
                        pvMapper.displayMessage("Saved tool configuration to the local browser.", "success");
                    }
                    txn.onerror = (evt): any => {
                        if (console && console.error) console.error("Transaction error: saving '" + this.title + "' failed, cause: " + txn.error);
                        pvMapper.displayMessage("Failed to save tool configuration to the local browser.", "error");
                    }

                    txn.onabort = (evt): any => {
                        if (console && console.warn) console.warn("Transaction aborted: saving " + this.title + " failed, cause: " + txn.error);
                        pvMapper.displayMessage("Failed to save tool configuration to the local browser.", "error");
                    }

                    var store = txn.objectStore(ClientDB.SCORE_LINE_CONFIG_STORE_NAME);

                    var dbScore = this.toJSON();

                    var request = store.get(this.id);
                    request.onsuccess = (evt): any => {
                        if (request.result != undefined) { // if already exists, update
                            store.put(dbScore, dbScore.id);
                            if (console && console.log) console.log("updated '" + this.title + "' successfully.");
                        }
                        else {
                            store.add(dbScore, dbScore.id); // if new, add
                        if (console && console.log) console.log("new record '" + this.title + "' saved successfully.");
                        }
                    }
                    request.onerror = (evt): any => {
                        if (console && console.error) console.error("save utilitity, check for existing record failed, cause: " + evt.message);
                    }
                } catch (e) {
                    if (console && console.error) console.error(e);
                }
            }
        }

        public saveConfiguration = (): void => {
            if (ClientDB.db == null) return;
            try {
                this.putConfiguration();
            }
            catch (e) {
                if (console && console.error) console.error(e);
            }
        }

        private isGettingConfiguration = false;

        //Note: this is very different from getConfig(), although I probably should have named them a bit differently...
        // load tool configration stored in browser
        private getConfiguration = (): void => {
            if (ClientDB.db) {
                this.isGettingConfiguration = true;
                var txn = ClientDB.db.transaction(ClientDB.SCORE_LINE_CONFIG_STORE_NAME, "readonly");
                var store = txn.objectStore(ClientDB.SCORE_LINE_CONFIG_STORE_NAME);
                var key = this.id;
                var request = store.get(key);
                request.onsuccess = (evt): any => {
                    if (request.result) {

                        this.fromJSON(request.result);

                        if (console && console.log) console.log("Loaded configuration for tool '" + key + "'");
                    } else {
                        if (console && console.warn) console.warn("Couldn't find configuration for tool '" + key + "'");
                    }
                    this.isGettingConfiguration = false;
                }
                request.onerror = (evt): any => {
                    if (console && console.error) console.error("Error loading configuration for tool '" + key + "': " + evt.toString());
                    this.isGettingConfiguration = false;
                }
            }
        }

        public loadConfiguration = (): void => {
            if (ClientDB.db == null) return;
            try {
                this.getConfiguration();
            }
            catch (e) {
                if (console && console.error) console.error(e);
            }
        }

        public resetConfiguration: () => void;

        //#endregion "Client indexedDB storage"
    }

}
