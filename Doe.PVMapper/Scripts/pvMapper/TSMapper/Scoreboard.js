/// <reference path="pvMapper.ts" />
/// <reference path="../../jquery.d.ts" />
/// <reference path="Event.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="TotalLine.ts" />
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
            this.isScoreLoaded = false;
            //Events -----------
            this.changedEvent = new pvMapper.Event();
            this.scoresInvalidatedEvent = new pvMapper.Event();
            this.scoreLineAddedEvent = new pvMapper.Event();
            /**
            Fires when a total line tool is added to the totalLines
            */
            this.totalLineAddedEvent = new pvMapper.Event();
            this.self = this;

            this.onScoreChanged = function (event) {
                //console.log("Score changed event detected by the scoreboard");
                //var html = this.self.render();
                //Update all the summary (average/total) lines
                _this.updateTotals();

                _this.changedEvent.fire(_this, event); //Let the UI handle the changes
            };
        }
        ScoreBoard.prototype.update = function () {
            this.changedEvent.fire(this, null);
        };

        //End Events---------
        //public tableRenderer = new pvMapper.Table();
        ScoreBoard.prototype.addLine = function (scoreline) {
            //console.log("Adding scoreline " + scoreline.name);
            scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
            this.scoreLines.push(scoreline);
            //this.changedEvent.fire(this,null);
        };

        ScoreBoard.prototype.addTotalLine = function (line) {
            line.ValueChangedEvent.addHandler(function (event) {
                //Do what ever needs to be done for updating the GUI when
                //the total line recalculates
                //IGNORED for now
            });

            this.totalLines.push(line);

            //Fire the event that indicates adding a total line to the array
            this.totalLineAddedEvent.fire(this, line);
        };

        ScoreBoard.prototype.updateTotals = function () {
            var sl = this.scoreLines;
            this.totalLines.forEach(function (t, idx) {
                t.UpdateScores(sl);
            });
        };

        /**
        A function that returns a data object meant for consumption by ExtJS grid (UI)
        */
        ScoreBoard.prototype.getTableData = function (flat) {
            if (typeof flat === "undefined") { flat = false; }
            //Mash the two rendering line types together for display on the GUI
            var emptyArray = [];
            var lines = (emptyArray.concat(this.scoreLines)).concat(this.totalLines);
            return lines;
        };

        ScoreBoard.prototype.onScoresInvalidated = function () {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it
            Error("Function not implemented yet!");
        };

        ScoreBoard.prototype.removeCustomModule = function (moduleName) {
            var moduleDataArray = pvMapper.customModules.filter(function (a) {
                return (a.fileName === moduleName);
            });
            console.assert(moduleDataArray.length < 2, "Module name collision detected!");
            var amodule = moduleDataArray.length ? moduleDataArray[0] : null;

            if (amodule) {
                //remove the module from the local database
                pvMapper.ClientDB.deleteCustomKML(amodule.fileName, function (isSuccessful) {
                    if (isSuccessful) {
                        //remove it from the custom module list.
                        var idx = pvMapper.customModules.indexOf(amodule);
                        pvMapper.customModules.splice(idx, 1);

                        //now remove the scoreline.
                        var scorelineArray = pvMapper.mainScoreboard.scoreLines.filter(function (a) {
                            if (a.getModuleName !== undefined) {
                                if (a.getModuleName() === amodule.fileName)
                                    return true;
                                else
                                    return false;
                            } else
                                return false;
                        });
                        console.assert(scorelineArray.length < 2, "Module name collision detected!");
                        var scoreline = scorelineArray.length ? scorelineArray[0] : null;
                        if (scoreline) {
                            idx = pvMapper.mainScoreboard.scoreLines.indexOf(scoreline);
                            if (idx >= 0)
                                pvMapper.mainScoreboard.scoreLines.splice(idx, 1);

                            //finally then free the module.
                            delete scoreline;
                        }
                        if (amodule.moduleObject.removeLocalLayer !== undefined)
                            amodule.moduleObject.removeLocalLayer(); //remove the custom module layer from map.
                        delete amodule;
                        pvMapper.mainScoreboard.update();
                    }
                });
            }
        };

        ScoreBoard.prototype.removeModule = function (moduleName) {
            var scorelineArray = pvMapper.mainScoreboard.scoreLines.filter(function (sl) {
                return (sl.title == moduleName);
            });
            console.assert(scorelineArray.length < 2, "Module name collision detected in score lines!");
            var scoreline = scorelineArray.length ? scorelineArray[0] : null;

            if (scoreline) {
                var amodule = scoreline.getModule();

                //pvMapper.moduleManager.deleteModule(moduleName);
                var mInfo = pvMapper.moduleManager.getModule(moduleName);
                if (mInfo) {
                    mInfo.isActive = false;
                    delete amodule;
                    var idx = pvMapper.mainScoreboard.scoreLines.indexOf(scoreline);
                    if (idx >= 0)
                        pvMapper.mainScoreboard.scoreLines.splice(idx, 1);
                    delete scoreline;

                    pvMapper.mainScoreboard.update();
                    pvMapper.mainScoreboard.updateTotals();
                }
            }
        };

        ScoreBoard.prototype.toJSON = function () {
            return {
                scoreLines: this.scoreLines,
                totalLines: this.totalLines
            };
        };

        ScoreBoard.prototype.fromJSON = function (o) {
            for (var i = 0; i < o.scoreLines.length; i++) {
                this.scoreLines[i].fromJSON(o.scoreLines[i]);
            }

            for (var i = 0; i < o.totalLines.length; i++) {
                this.totalLines[i].fromJSON(o.totalLines[i]);
            }
        };
        return ScoreBoard;
    })();
    pvMapper.ScoreBoard = ScoreBoard;

    //declare var Ext: any; //So we can use it
    pvMapper.floatingScoreboard;
    pvMapper.mainScoreboard = new ScoreBoard();

    var timeoutHandle = null;

    //mainScoreboard.changedEvent.addHandler(() => {
    pvMapper.mainScoreboard.changedEvent.addHandler(function () {
        // queue the changed event to be handled shortly; ignore following change events until it is.
        if (timeoutHandle == null) {
            timeoutHandle = window.setTimeout(function () {
                if (console) {
                    console.log("Scoreboard update event(s) being processed...");
                }

                // we're done delaying our event, so reset the timeout handle to null
                timeoutHandle = null;

                var self = pvMapper.mainScoreboard;
                var mydata = pvMapper.mainScoreboard.getTableData();
                if (!pvMapper.floatingScoreboard) {
                    pvMapper.floatingScoreboard = Ext.create('MainApp.view.ScoreboardWindow', {
                        height: Math.min(900, (Ext.getBody().getViewSize().height - 140)),
                        data: mydata
                    });
                    pvMapper.floatingScoreboard.show();
                } else {
                    var gp = pvMapper.floatingScoreboard.down('gridpanel');

                    //Note: selecting cells hoarks everything up unless we clear the selection before reloading the data
                    gp.getSelectionModel().deselectAll();
                    gp.store.loadRawData(mydata);
                    //Note: removed this as it's really annoying (scoreboard pops up from minimized, covers up other windows, etc)
                    //pvMapper.floatingScoreboard.show();
                }
            }, 250);
            // queue is set to wait 1/10th of a second before it actually refreshes the scoreboard.
        } else {
            if (console) {
                console.log("Scoreboard update event safely (and efficiently) ignored.");
            }
        }
    });
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=Scoreboard.js.map
