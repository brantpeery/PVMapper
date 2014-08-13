/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="SiteManager.ts" />
/// <reference path="Tools.ts" />
///<reference path="DataManager.ts"/>
// Module
var pvMapper;
(function (pvMapper) {
    

    // Class
    var ScoreLine = (function () {
        // Constructor
        function ScoreLine(options, parentModule) {
            var _this = this;
            this.scores = new Array();
            //public updateScore: ICallback = options.updateScoreCallback;
            this.isActive = false;
            //public scoreAddedEvent: pvMapper.Event = new pvMapper.Event();
            this.scoreChangeEvent = new pvMapper.Event();
            this.updatingScoresEvent = new pvMapper.Event();
            this.getUtilityScore = function (x) {
                return _this.scoreUtility.run(x);
            };
            this.getWeight = function () {
                return _this.weight;
            };
            this.setWeight = function (value) {
                _this.weight = value;
                _this.delayFireScoreChangeEvent(); // score line changed
                _this.saveConfiguration();
            };
            /**
            Adds a score object to this line for the site.
            */
            this.addScore = function (site) {
                //console.log('Adding new score to scoreline');
                var score = new pvMapper.Score(site, _this);

                //score.value = this.getvalue(site);
                //attach the tool's handler directly to the score
                score.siteChangeEvent.addHandler(_this.onSiteChange);

                //subscribe to the score updated event
                score.valueChangeEvent.addHandler(_this.valueChangeHandler);

                _this.scores.push(score);

                try  {
                    // request a score update
                    _this.onSiteChange(null, score);
                } catch (ex) {
                    if (console)
                        console.error(ex);
                }
                return score;
            };
            // this updates utility scores from the existing score value of each Score object
            this.applyUtilityFunctionToAllScores = function () {
                _this.scores.forEach(function (score, index, scores) {
                    score.utility = _this.getUtilityScore(score.value);
                    _this.delayFireScoreChangeEvent();
                });
            };
            this.loadAllSites = function () {
                var allSites = pvMapper.siteManager.getSites();
                allSites.forEach(function (site) {
                    _this.addScore(site);
                });
            };
            this.unloadAllSites = function () {
                var allSites = _this.scores.map(function (s) {
                    return s.site;
                });
                allSites.forEach(function (site) {
                    _this.removeScore(site);
                });
            };
            this.removeScore = function (site) {
                for (var i = 0; i < _this.scores.length; i++) {
                    var score = _this.scores[i];
                    if (score.site == site) {
                        // remove site from scoreline.
                        score.siteChangeEvent.removeHandler(_this.onSiteChange);
                        score.valueChangeEvent.removeHandler(_this.valueChangeHandler);
                        score.deactivate();
                        _this.scores.splice(i, 1);
                        _this.delayFireScoreChangeEvent();
                        break;
                    }
                }
            };
            // this fires a score change event after a bit...
            // hopefully adding the delay will prevent these events from occurring mid-way through an atomic change
            // (like when we delete a site, or when we change the configuration for the line)
            this.delayFireScoreChangeEvent_timeoutHandle = null;
            this.delayFireScoreChangeEvent = function () {
                if (_this.delayFireScoreChangeEvent_timeoutHandle === null) {
                    _this.delayFireScoreChangeEvent_timeoutHandle = window.setTimeout(function () {
                        _this.delayFireScoreChangeEvent_timeoutHandle = null;
                        _this.scoreChangeEvent.fire(_this, null);
                    }, 1); // trivial 1ms delay
                }
            };
            this.toJSON = function () {
                var stb = null;
                if (typeof (_this.getStarRatables) === "function")
                    stb = _this.getStarRatables(); // call the module for the rating value.

                var config = null;
                if (typeof (_this.getConfig) === "function")
                    config = _this.getConfig(); // call the module for the rating value.

                var o = {
                    // we want to return all of these fields because this is used for storage, as well as for reporting!
                    id: _this.id,
                    title: _this.title,
                    weight: _this.weight,
                    description: _this.description,
                    longDescription: _this.longDescription,
                    category: _this.category,
                    scoreUtility: _this.scoreUtility.toJSON(),
                    scores: _this.scores.map(function (s) {
                        return s.toJSON();
                    }),
                    starRateTable: stb,
                    config: config
                };
                return o;
            };
            this.fromJSON = function (o) {
                if (console && console.assert)
                    console.assert(o.id === _this.id || typeof (o.id) === "undefined", "Error: Attempting to load config from tool ID '" + o.id + "' into tool ID '" + _this.id + "'");

                if (console && console.warn && o.title && _this.title !== o.title)
                    console.warn("Warning: tool changing title from '" + _this.title + "' to '" + o.title + "'.");

                _this.title = o.title || _this.title; // custom KML tools use this (I think...)
                _this.weight = o.weight;

                // we don't want to load a lot of these - our current values are likely better than the old saved description etc.
                //this.description = o.description;
                //this.longDescription = o.longDescription;
                //this.category = o.category;
                _this.scoreUtility.fromJSON(o.scoreUtility);

                //this.scores = new Array<Score>();
                //TODO: should we update scores now, or should we call a more robust update after the root operation completes?
                _this.applyUtilityFunctionToAllScores();

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
                if (typeof (_this.setStarRatables) === "function" && o.starRateTable) {
                    _this.setStarRatables(o.starRateTable);
                }
                if (typeof (_this.setConfig) === "function" && o.config) {
                    _this.setConfig(o.config);
                }

                _this.saveConfiguration();
            };
            //#region "Client indexedDB storage"
            this.putConfiguration = function () {
                if (pvMapper.ClientDB.db && !_this.isGettingConfiguration) {
                    try  {
                        var txn = pvMapper.ClientDB.db.transaction(pvMapper.ClientDB.SCORE_LINE_CONFIG_STORE_NAME, "readwrite");

                        txn.oncomplete = function (evt) {
                            //if (console && console.log) console.log("Transaction completed: '" + this.title + "' has been saved to the database.")
                            pvMapper.displayMessage("Saved tool configuration to the local browser.", "success");
                        };
                        txn.onerror = function (evt) {
                            if (console && console.error)
                                console.error("Transaction error: saving '" + _this.title + "' failed, cause: " + txn.error);
                            pvMapper.displayMessage("Failed to save tool configuration to the local browser.", "error");
                        };

                        txn.onabort = function (evt) {
                            if (console && console.warn)
                                console.warn("Transaction aborted: saving " + _this.title + " failed, cause: " + txn.error);
                            pvMapper.displayMessage("Failed to save tool configuration to the local browser.", "error");
                        };

                        var store = txn.objectStore(pvMapper.ClientDB.SCORE_LINE_CONFIG_STORE_NAME);

                        var dbScore = _this.toJSON();

                        var request = store.get(_this.id);
                        request.onsuccess = function (evt) {
                            if (request.result != undefined) {
                                store.put(dbScore, dbScore.id);
                                if (console && console.log)
                                    console.log("updated '" + _this.title + "' successfully.");
                            } else {
                                store.add(dbScore, dbScore.id); // if new, add
                                if (console && console.log)
                                    console.log("new record '" + _this.title + "' saved successfully.");
                            }
                        };
                        request.onerror = function (evt) {
                            if (console && console.error)
                                console.error("save utilitity, check for existing record failed, cause: " + evt.message);
                        };
                    } catch (e) {
                        if (console && console.error)
                            console.error(e);
                    }
                }
            };
            this.saveConfiguration = function () {
                if (pvMapper.ClientDB.db == null)
                    return;
                try  {
                    _this.putConfiguration();
                } catch (e) {
                    if (console && console.error)
                        console.error(e);
                }
            };
            this.isGettingConfiguration = false;
            //Note: this is very different from getConfig(), although I probably should have named them a bit differently...
            // load tool configration stored in browser
            this.getConfiguration = function () {
                if (pvMapper.ClientDB.db) {
                    _this.isGettingConfiguration = true;
                    var txn = pvMapper.ClientDB.db.transaction(pvMapper.ClientDB.SCORE_LINE_CONFIG_STORE_NAME, "readonly");
                    var store = txn.objectStore(pvMapper.ClientDB.SCORE_LINE_CONFIG_STORE_NAME);
                    var key = _this.id;
                    var request = store.get(key);
                    request.onsuccess = function (evt) {
                        if (request.result) {
                            _this.fromJSON(request.result);

                            if (console && console.log)
                                console.log("Loaded configuration for tool '" + key + "'");
                        } else {
                            if (console && console.warn)
                                console.warn("Couldn't find configuration for tool '" + key + "'");
                        }
                        _this.isGettingConfiguration = false;
                    };
                    request.onerror = function (evt) {
                        if (console && console.error)
                            console.error("Error loading configuration for tool '" + key + "': " + evt.toString());
                        _this.isGettingConfiguration = false;
                    };
                }
            };
            this.loadConfiguration = function () {
                if (pvMapper.ClientDB.db == null)
                    return;
                try  {
                    _this.getConfiguration();
                } catch (e) {
                    if (console && console.error)
                        console.error(e);
                }
            };
            if (console && console.assert)
                console.assert(!!options.id, "Missing ID on tool '" + options.title + parentModule ? ("' from module '" + (parentModule.id || parentModule.title) + "'") : "'");

            this.getModule = function () {
                return parentModule;
            };

            this.id = options.id;

            this.title = options.title || (parentModule && parentModule.title) || 'Unnamed Tool';
            this.category = options.category || (parentModule && parentModule.category) || 'Other';
            this.description = options.description || (parentModule && parentModule.description) || "";
            this.longDescription = options.longDescription || (parentModule && parentModule.longDescription) || ("<p>" + this.description + "</p>");

            if ($.isFunction(options.onSiteChange)) {
                this.onSiteChange = function (e, score) {
                    if (console && console.warn && score.isValueOld)
                        console.warn("Warning: new score update requested before the last score update finished (slow tool ID='" + _this.id + "')");
                    score.isValueOld = true;

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

            // tool config functions (to store any other options or values the tool may need.
            if ($.isFunction(options.getConfig)) {
                this.getConfig = function () {
                    return options.getConfig.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.setConfig)) {
                this.setConfig = function (config) {
                    options.setConfig.apply(_this, arguments);
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
                event.score.utility = _this.getUtilityScore(event.newValue);

                _this.delayFireScoreChangeEvent();
            };

            //if ($.isFunction(options.onScoreAdded)) {
            //    this.scoreAddedEvent.addHandler(options.onScoreAdded);
            //}
            var siteAddedHandler = function (site) {
                _this.addScore(site);
            };
            var siteRemovedHandler = function (site) {
                _this.removeScore(site);
            };

            this.activate = function () {
                if (console && console.assert)
                    console.assert(!_this.isActive);

                if (typeof (options.activate) === "function")
                    options.activate.apply(_this, arguments); // 'this' will refer to the ScoreLine during calls to options.activate().

                pvMapper.siteManager.siteAdded.addHandler(siteAddedHandler);
                pvMapper.siteManager.siteRemoved.addHandler(siteRemovedHandler);

                _this.isActive = true;

                _this.loadAllSites();

                pvMapper.mainScoreboard.addLine(_this);
            };

            this.deactivate = function () {
                if (!_this.isActive) {
                    if (console && console.warn)
                        console.warn("Warning: attempting to deactivate an already inactive tool ID='" + _this.id + "'");
                }

                if (typeof (options.deactivate) === "function")
                    options.deactivate.apply(_this, arguments); // 'this' will refer to the ScoreLine during calls to options.deactivate().

                pvMapper.siteManager.siteAdded.removeHandler(siteAddedHandler);
                pvMapper.siteManager.siteRemoved.removeHandler(siteRemovedHandler);

                _this.isActive = false;

                _this.unloadAllSites();

                pvMapper.mainScoreboard.removeLine(_this);
            };

            if (console && console.assert)
                console.assert(typeof (options.scoreUtilityOptions) === "object", "Error: Missing score utility object on tool ID='" + this.id + "'");

            this.scoreUtility = new pvMapper.ScoreUtility(options.scoreUtilityOptions);

            //Set the default weight of the tool
            //Note: a weight of 0 is possible and valid. The default weight is 10.
            this.weight = (typeof options.weight === "number") ? options.weight : 10;

            // handy means of reusing code paths to reset the socreline configuration
            //Note: we keep this as a JSON string (rather than a JSON object) as a convenient means of deep-cloning the object.
            var defaultConfiguration = JSON.stringify(this.toJSON());
            this.resetConfiguration = function () {
                _this.fromJSON(JSON.parse(defaultConfiguration));
            };

            // and finally, load our browser-cached configuration (if any)
            this.loadConfiguration();
        }
        return ScoreLine;
    })();
    pvMapper.ScoreLine = ScoreLine;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=ScoreLine.js.map
