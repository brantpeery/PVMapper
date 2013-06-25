var pvMapper;
(function (pvMapper) {
    var ScoreBoard = (function () {
        function ScoreBoard() {
            var _this = this;
            this.scoreLines = new Array();
            this.totalLines = new Array();
            this.changedEvent = new pvMapper.Event();
            this.scoresInvalidatedEvent = new pvMapper.Event();
            this.scoreLineAddedEvent = new pvMapper.Event();
            this.totalLineAddedEvent = new pvMapper.Event();
            this.tableRenderer = new pvMapper.Renderer.HTML.Table();
            this.self = this;
            this.onScoreChanged = function (event) {
                _this.updateTotals();
                _this.changedEvent.fire(_this, event);
            };
        }
        ScoreBoard.prototype.addLine = function (scoreline) {
            scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
            this.scoreLines.push(scoreline);
        };
        ScoreBoard.prototype.addTotalLine = function (line) {
            line.ValueChangedEvent.addHandler(function (event) {
            });
            this.totalLines.push(line);
            this.totalLineAddedEvent.fire(this, line);
        };
        ScoreBoard.prototype.updateTotals = function () {
            var sl = this.scoreLines;
            this.totalLines.forEach(function (t, idx) {
                t.UpdateScores(sl);
            });
        };
        ScoreBoard.prototype.getTableData = function (flat) {
            if (typeof flat === "undefined") { flat = false; }
            var lines = ([].concat(this.scoreLines)).concat(this.totalLines);
            return lines;
        };
        ScoreBoard.prototype.onScoresInvalidated = function () {
            Error("Function not implemented yet!");
        };
        return ScoreBoard;
    })();
    pvMapper.ScoreBoard = ScoreBoard;    
    pvMapper.floatingScoreboard;
    pvMapper.mainScoreboard = new ScoreBoard();
    var timeoutHandle = null;
    pvMapper.mainScoreboard.changedEvent.addHandler(function () {
        if(timeoutHandle == null) {
            timeoutHandle = window.setTimeout(function () {
                timeoutHandle = null;
                var self = pvMapper.mainScoreboard;
                var mydata = pvMapper.mainScoreboard.getTableData();
                if(!pvMapper.floatingScoreboard) {
                    pvMapper.floatingScoreboard = Ext.create('MainApp.view.ScoreboardWindow', {
                        data: mydata
                    });
                    pvMapper.floatingScoreboard.show();
                } else {
                    var gp = pvMapper.floatingScoreboard.down('gridpanel');
                    gp.getSelectionModel().deselectAll();
                    gp.store.loadRawData(mydata);
                    pvMapper.floatingScoreboard.show();
                }
            }, 100);
        } else {
            if(console) {
                console.log("Scoreboard update event safely (and efficiently) ignored.");
            }
        }
    });
    pvMapper.onReady(function () {
    });
})(pvMapper || (pvMapper = {}));
