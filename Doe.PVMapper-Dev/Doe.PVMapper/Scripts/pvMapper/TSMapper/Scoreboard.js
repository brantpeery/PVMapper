/// <reference path="pvMapper.ts" />
/// <reference path="../../jquery.d.ts" />
/// <reference path="Event.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="TotalLine.ts" />
/// <reference path="SiteManager.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    // Class
    var ScoreBoard = (function () {
        // Constructor
        function ScoreBoard() {
            var _this = this;
            this.scoreLines = new Array();
            this.totalLines = new Array();
            //Events -----------
            this.scoresInvalidatedEvent = new pvMapper.Event();
            this.scoreLineAddedEvent = new pvMapper.Event();
            /**
            Fires when a total line tool is added to the totalLines
            */
            //public totalLineAddedEvent: pvMapper.Event = new pvMapper.Event();
            //End Events---------
            //public tableRenderer = new pvMapper.Table();
            this.addLine = function (scoreline) {
                //console.log("Adding scoreline " + scoreline.name);
                _this.linesHaveChanged = true;

                if (console && console.assert)
                    console.assert(_this.scoreLines.filter(function (sl) {
                        return sl.id === scoreline.id;
                    }).length <= 0, "Warning: duplicate score line ID '" + scoreline.id + "'");

                //if (console && console.log) console.log("adding scoreline ID= '" + scoreline.id + "'");
                scoreline.scoreChangeEvent.addHandler(_this.onScoreChanged);
                _this.scoreLines.push(scoreline);

                if (pvMapper.siteManager && pvMapper.siteManager.getSites().length)
                    _this.update();
            };
            this.removeLine = function (scoreline) {
                var idx = pvMapper.mainScoreboard.scoreLines.indexOf(scoreline);
                if (idx >= 0) {
                    scoreline.scoreChangeEvent.removeHandler(_this.onScoreChanged);
                    pvMapper.mainScoreboard.scoreLines.splice(idx, 1);

                    _this.linesHaveChanged = true;
                    _this.update();
                }
            };
            this.addTotalLine = function (line) {
                _this.linesHaveChanged = true;

                _this.totalLines.push(line);

                if (pvMapper.siteManager && pvMapper.siteManager.getSites().length)
                    _this.update();
            };
            this.removeTotalLine = function (line) {
                var idx = _this.totalLines.indexOf(line);
                if (idx >= 0) {
                    //scoreline.scoreChangeEvent.removeHandler(this.onScoreChanged);
                    _this.totalLines.splice(idx, 1);

                    _this.linesHaveChanged = true;
                    _this.update();
                }
            };
            this.onScoreChanged = function (event) {
                _this.update();
            };
            this.connectedToSiteManager = false;
            this.linesHaveChanged = true;
            this.sitesHaveChanged = true;
            this.update_timeoutHandle = null;
            //mainScoreboard.changedEvent.addHandler(() => {
            this.update = function () {
                // queue the changed event to be handled shortly; ignore following change events until it is.
                if (_this.update_timeoutHandle == null) {
                    //this.updateStatusBar(); // <-- put this back if we decide to go with the more frequently updating status bar (ie, let it use its own timer).
                    _this.update_timeoutHandle = window.setTimeout(function () {
                        // we're done delaying our event, so reset the timeout handle to null
                        _this.update_timeoutHandle = null;

                        if (console && console.log) {
                            console.log("Scoreboard update event(s) being processed...");
                        }

                        if (!_this.connectedToSiteManager && pvMapper.siteManager) {
                            pvMapper.siteManager.siteAdded.addHandler(function (event) {
                                _this.sitesHaveChanged = true;
                            });
                            pvMapper.siteManager.siteRemoved.addHandler(function (event) {
                                _this.sitesHaveChanged = true;
                            });
                            _this.connectedToSiteManager = true;
                        }

                        _this.updateStatusBar();

                        //Update all the summary (average/total) lines
                        _this.updateTotals();

                        var mydata = _this.getTableData();

                        if (!pvMapper.floatingScoreboard) {
                            pvMapper.floatingScoreboard = Ext.create('MainApp.view.ScoreboardWindow', {
                                height: Math.min(900, (Ext.getBody().getViewSize().height - 140)),
                                data: mydata
                            });

                            if (_this.linesHaveChanged || _this.sitesHaveChanged) {
                                // generate scoreboard columns
                                pvMapper.generateMainScoreboardColumns();
                                _this.linesHaveChanged = _this.sitesHaveChanged = false;
                            }

                            pvMapper.floatingScoreboard.show();
                        } else {
                            var gp = pvMapper.floatingScoreboard.down('gridpanel');

                            //Note: selecting cells hoarks everything up unless we clear the selection before reloading the data
                            gp.getSelectionModel().deselectAll();

                            if (_this.linesHaveChanged || _this.sitesHaveChanged) {
                                // generate scoreboard columns
                                pvMapper.generateMainScoreboardColumns();
                                _this.linesHaveChanged = _this.sitesHaveChanged = false;
                            }

                            // load data (note: this hoarks our scrollbar positions, etc.)
                            gp.store.loadRawData(mydata);
                        }
                    }, 200);
                    // queue is set to wait 1/5th of a second before it actually refreshes the scoreboard.
                } else {
                    //if (console) { console.log("Scoreboard update event safely (and efficiently) ignored."); }
                }
            };
            this.updateStatusBar_statusBar = null;
            this.updateStatusBar = function () {
                _this.updateStatusBar_statusBar = _this.updateStatusBar_statusBar || Ext.getCmp('maintaskbar');

                var numberOfScoresWithOldValues = _this.scoreLines.reduce(function (outerCount, scoreLine) {
                    return outerCount + scoreLine.scores.reduce(function (innerCount, score) {
                        return innerCount + (score.isValueOld ? 1 : 0);
                    }, 0);
                }, 0);

                if (numberOfScoresWithOldValues > 0) {
                    _this.updateStatusBar_statusBar.showBusy({
                        text: numberOfScoresWithOldValues === 1 ? "Updating 1 score ..." : "Updating " + numberOfScoresWithOldValues + " scores ...",
                        clear: { wait: 30000, useDefaults: false }
                    });
                } else {
                    if (_this.updateStatusBar_statusBar.getText() !== '') {
                        _this.updateStatusBar_statusBar.setStatus({
                            text: "Scores updated", iconCls: "",
                            clear: { wait: 3000, useDefaults: false } }); // <-- keep "done" on the status bar for 3 seconds, then fade it away (fancy!)
                    }
                }
            };
            this.connectedToSiteManager = false;
        }
        ScoreBoard.prototype.updateTotals = function () {
            // compute the total weight of all score tools... this is used in the tooltip for the Weight column (which shows the percentage that tool contributes to the total weight)
            this.scoreLines_weightTotal = this.scoreLines.reduce(function (total, line) {
                return total += line.weight;
            }, 0);

            var sl = this.scoreLines;
            this.totalLines.forEach(function (t, idx) {
                t.UpdateScores(sl);
            });
        };

        /**
        A function that returns a data object meant for consumption by ExtJS grid (UI)
        */
        ScoreBoard.prototype.getTableData = function () {
            //Mash the two rendering line types together for display on the GUI
            var lines = this.scoreLines.concat(this.totalLines);
            return lines;
        };

        //Note: this method is used to save and load projects, as well as to send project data to reports.
        ScoreBoard.prototype.toJSON = function () {
            return {
                scoreLines: this.scoreLines.map(function (l) {
                    return l.toJSON();
                }),
                totalLines: this.totalLines.map(function (l) {
                    return l.toJSON();
                }),
                sites: pvMapper.siteManager.getSites().map(function (s) {
                    return s.toJSON();
                }),
                //scores: this.scoreLines.map(l => l.scores).reduce((x, y) => x.concat(y)), // <-- meh, no compelling reason not to leave these as children of the score lines.
                modules: pvMapper.moduleManager.toJSON()
            };
        };

        ScoreBoard.prototype.fromJSON = function (o) {
            var scoreToolConfigs = (o.configLines || []).concat(o.scoreLines || []);

            //Note: o.sites are currently loaded/handled in MainToolbar.js: importScoreboardFromJSON()
            //TODO: handle o.sites here...
            //if (typeof (o.sites) === "object") {
            //}
            if (typeof (o.modules) === "object") {
                // load saved module configurations.
                pvMapper.moduleManager.fromJSON(o.modules);
            }

            //TODO: handle custom modules here ...! (rather than sometimes handling them in MainToolbar.js, and otherwise not handling them at all)
            // load scoreboard and tool configurations
            this.scoreLines.forEach(function (line) {
                var sourceList = scoreToolConfigs.filter(function (source) {
                    return typeof (source.id) === "undefined" ? source.title === line.title : source.id === line.id;
                });
                if (console && console.warn && sourceList.length !== 1)
                    console.warn(sourceList.length ? "Warning: tool ID collision detected." : "Warning: configuration for tool '" + line.id + "' not found in JSON");
                if (sourceList && sourceList.length > 0) {
                    line.fromJSON(sourceList[0]);
                }
            });

            //Note: at present there is no reason to load anything from our total lines... neither of them store any configuration data.
            //if (o.totalLines) {
            //    this.totalLines.forEach(line => {
            //        var sourceList = o.totalLines.filter(source => source.id === line.id);
            //        if (console && console.warn && sourceList.length !== 1) console.warn(sourceList.length ?
            //            "Warning: tool ID collision detected." : "Warning: configuration for tool '" + line.id + "' not found in JSON");
            //        if (sourceList && sourceList.length > 0) {
            //            line.fromJSON(sourceList[0]);
            //        }
            //    });
            //}
            // redraw the scoreboard to reflect these changes (if necessary...)
            this.update();
        };
        return ScoreBoard;
    })();
    pvMapper.ScoreBoard = ScoreBoard;

    pvMapper.floatingScoreboard;
    pvMapper.mainScoreboard = new ScoreBoard();
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=Scoreboard.js.map
