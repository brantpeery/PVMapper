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

                _this.changedEvent.fire(_this, event);
            };
        }
        //End Events---------
        //public tableRenderer = new pvMapper.Table();
        ScoreBoard.prototype.addLine = function (scoreline) {
            //console.log("Adding scoreline " + scoreline.name);
            scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
            this.scoreLines.push(scoreline);
        };

        ScoreBoard.prototype.addTotalLine = function (line) {
            line.ValueChangedEvent.addHandler(function (event) {
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
            var lines = ([].concat(this.scoreLines)).concat(this.totalLines);
            return lines;
        };

        ScoreBoard.prototype.onScoresInvalidated = function () {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it
            Error("Function not implemented yet!");
        };

        ScoreBoard.prototype.toJSON = function () {
            return {
                scoreLines: this.scoreLines,
                totalLines: this.totalLines
            };
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
                        data: mydata
                    });
                    pvMapper.floatingScoreboard.show();
                } else {
                    var gp = pvMapper.floatingScoreboard.down('gridpanel');

                    //Note: selecting cells hoarks everything up unless we clear the selection before reloading the data
                    gp.getSelectionModel().deselectAll();
                    gp.store.loadRawData(mydata);
                }
            }, 250);
        } else {
            if (console) {
                console.log("Scoreboard update event safely (and efficiently) ignored.");
            }

            if ((pvMapper.ClientDB.db != null) && (!pvMapper.mainScoreboard.isScoreLoaded)) {
                pvMapper.mainScoreboard.scoreLines.forEach(function (sc) {
                    sc.loadScore();
                });
                pvMapper.mainScoreboard.isScoreLoaded = true;
            }
        }
    });

    //Create the scoreboard onscreen
    pvMapper.onReady(function () {
    });
})(pvMapper || (pvMapper = {}));
