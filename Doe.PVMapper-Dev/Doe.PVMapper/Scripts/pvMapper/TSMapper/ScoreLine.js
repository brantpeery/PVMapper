/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="SiteManager.ts" />
/// <reference path="Tools.ts" />
///<reference path="DataManager.ts"/>
// Module
var pvMapper;
(function (pvMapper) {
    //  import pvM = pvMapper;
    var DBScore = (function () {
        function DBScore(title, description, category, weight, active, scoreUtility, rateTable) {
            this.title = title;
            this.description = description;
            this.category = category;
            this.weight = weight;
            this.active = active;
            this.scoreUtility = scoreUtility;
            this.rateTable = rateTable;
        }
        return DBScore;
    })();
    pvMapper.DBScore = DBScore;

    // Class
    var ScoreLine = (function () {
        // Constructor
        function ScoreLine(options) {
            var _this = this;
            this.scores = new Array();
            //public updateScore: ICallback = options.updateScoreCallback;
            this.active = true;
            this.suspendEvent = false;
            //public scoreAddedEvent: pvMapper.Event = new pvMapper.Event();
            this.scoreChangeEvent = new pvMapper.Event();
            this.updatingScoresEvent = new pvMapper.Event();
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
                this.onSiteChange = function () {
                    return options.onSiteChange.apply(_this, arguments);
                };
            }

            // star rating functions
            if ($.isFunction(options.getStarRatables)) {
                this.getStarRatables = function () {
                    return options.getStarRatables.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.setStarRatables)) {
                this.setStarRatables = function (rateTable) {
                    options.setStarRatables.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.getModuleName)) {
                this.getModuleName = function () {
                    return options.getModuleName.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.setModuleName)) {
                this.setModuleName = function (name) {
                    options.setModuleName.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.getTitle)) {
                this.getTitle = function () {
                    return options.getTitle.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.setTitle)) {
                this.setTitle = function (name) {
                    options.setTitle.apply(_this, arguments);
                };
            }

            // config window
            if ($.isFunction(options.showConfigWindow)) {
                this.showConfigWindow = function () {
                    options.showConfigWindow.apply(_this, arguments);
                };
            }

            this.valueChangeHandler = function (event) {
                //Update the utility score for the score that just changed it's value.
                event.score.setUtility(_this.getUtilityScore(event.newValue));

                //update the scoreline title for custom tools.
                if (typeof (_this.getTitle) === 'function') {
                    _this.title = _this.getTitle();
                }

                _this.scoreChangeEvent.fire(_this, event);
            };

            //if ($.isFunction(options.onScoreAdded)) {
            //    this.scoreAddedEvent.addHandler(options.onScoreAdded);
            //}
            pvMapper.siteManager.siteAdded.addHandler(function (event) {
                //if (console) console.log("Siteadded event detected in scoreline" + name);
                _this.addScore(event);
            });

            pvMapper.siteManager.siteRemoved.addHandler(function (site) {
                _this.onSiteRemove(site);
            });

            //Set default scoreUtilityOptions object if none was provided
            if (options.scoreUtilityOptions == undefined) {
                options.scoreUtilityOptions = {
                    functionName: "random",
                    functionArgs: null,
                    iconURL: null
                };
            }
            ;

            this.utilargs = new pvMapper.MinMaxUtilityArgs(0, 10, "", "");
            this.scoreUtility = new pvMapper.ScoreUtility(options.scoreUtilityOptions);
            this.defaultScoreUtility = new pvMapper.ScoreUtility(options.scoreUtilityOptions);

            this.loadAllSites();

            //Set the default weight of the tool
            //Note: a weight of 0 is possible and valid. The default weight is 10.
            this.weight = (typeof options.weight === "number") ? options.weight : 10;
        }
        ScoreLine.prototype.getUtilityScore = function (x) {
            return this.scoreUtility.run(x);
        };
        ScoreLine.prototype.getWeight = function () {
            return this.weight;
        };
        ScoreLine.prototype.setWeight = function (value) {
            this.weight = value;
            this.scoreChangeEvent.fire(self, undefined); // score line changed
            this.saveConfiguration();
        };

        /**
        Adds a score object to this line for the site.
        */
        ScoreLine.prototype.addScore = function (site) {
            //console.log('Adding new score to scoreline');
            var score = new pvMapper.Score(site);

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
                try  {
                    // request a score update
                    this.onSiteChange(undefined, score);
                } catch (ex) {
                    if (console)
                        console.error(ex);
                }
                //}
            }
            return score;
        };

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
        ScoreLine.prototype.updateScores = function () {
            this.scores.forEach(function (score, index, scores) {
                var oldvalue = score.value;
                score.setUtility(this.getUtilityScore(score.value));
                this.scoreChangeEvent.fire(this, {
                    score: score,
                    oldValue: oldvalue,
                    newValue: score.value
                });
            }, this);
        };

        ScoreLine.prototype.loadAllSites = function () {
            var _this = this;
            var allSites = pvMapper.siteManager.getSites();
            $.each(allSites, function (idx, site) {
                _this.addScore(site);
            });
        };

        ScoreLine.prototype.onSiteRemove = function (site) {
            console.log('Attempting to remove a site/score from the scoreline');
            for (var i = 0; i < this.scores.length; i++) {
                var score = this.scores[i];
                if (score.site == site) {
                    // remove site from scoreline.
                    score.siteChangeEvent.removeHandler(this.onSiteChange);
                    score.valueChangeEvent.removeHandler(this.valueChangeHandler);
                    this.scores.splice(i, 1);
                    this.scoreChangeEvent.fire(self, undefined);
                    break;
                }
            }
        };

        ScoreLine.prototype.toJSON = function () {
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
            };
            return o;
        };

        ScoreLine.prototype.fromJSON = function (o) {
            this.title = o.title;
            this.weight = o.weight;
            this.description = o.description;
            this.longDescription = o.longDescription;
            this.category = o.category;
            this.scoreUtility.fromJSON(o.scoreUtility);
            this.scores = new Array();

            var asite;
            var ascore = null;

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
        };

        //#region "Client indexedDB storage"
        ScoreLine.prototype.putConfiguration = function () {
            var me = this;
            if (pvMapper.ClientDB.db) {
                try  {
                    var txn = pvMapper.ClientDB.db.transaction(pvMapper.ClientDB.CONFIG_STORE_NAME, "readwrite");

                    txn.oncomplete = function (evt) {
                        console.log("Transaction completed: '" + me.title + "' has been saved to the database.");
                    };
                    txn.onerror = function (evt) {
                        console.log("Transaction error: saving '" + me.title + "' failed, cause: " + txn.error);
                    };

                    txn.onabort = function (evt) {
                        console.log("Transaction aborted: saving " + me.title + " failed, cause: " + txn.error);
                    };

                    var store = txn.objectStore(pvMapper.ClientDB.CONFIG_STORE_NAME);
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

                    var dbScore = new DBScore(me.title, me.description, me.category, me.weight, me.active, util, stb);

                    var request = store.get(me.title);
                    request.onsuccess = function (evt) {
                        if (request.result != undefined) {
                            store.put(dbScore, dbScore.title);
                            console.log("updated '" + me.title + "' successful.");
                        } else {
                            store.add(dbScore, dbScore.title); // if new, add
                            console.log("new record '" + me.title + "' saved successful.");
                        }
                    };
                    request.onerror = function (evt) {
                        console.log("save utilitity, check for existing record failed, cause: " + evt.message);
                    };
                } catch (e) {
                    console.log("putScore failed, cause: " + e.message);
                }
            }
        };

        ScoreLine.prototype.saveConfiguration = function () {
            if (pvMapper.ClientDB.db == null)
                return;
            try  {
                this.putConfiguration();
            } catch (e) {
                console.log("Error: " + e.message);
            }
        };

        ScoreLine.prototype.getConfiguration = function () {
            var me = this;
            if (pvMapper.ClientDB.db) {
                var txn = pvMapper.ClientDB.db.transaction(pvMapper.ClientDB.CONFIG_STORE_NAME, "readonly");
                var store = txn.objectStore(pvMapper.ClientDB.CONFIG_STORE_NAME);
                var request = store.get(me.title);
                request.onsuccess = function (evt) {
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
                };
            }
        };

        ScoreLine.prototype.loadConfiguration = function () {
            if (pvMapper.ClientDB.db == null)
                return;
            try  {
                this.getConfiguration();
            } catch (e) {
                console.log("Error: " + e.message);
            }
        };

        ScoreLine.prototype.updateConfiguration = function (utility, starRatables, weight) {
            this.scoreUtility.functionName = utility.functionName;
            this.scoreUtility.functionArgs = utility.functionArgs;
            this.scoreUtility.iconURL = utility.iconURL;
            this.scoreUtility.fCache = utility.fCache;

            if ((this.setStarRatables !== undefined) && (starRatables !== undefined)) {
                this.setStarRatables(starRatables);
            }
            this.setWeight(weight);
        };
        return ScoreLine;
    })();
    pvMapper.ScoreLine = ScoreLine;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=ScoreLine.js.map
