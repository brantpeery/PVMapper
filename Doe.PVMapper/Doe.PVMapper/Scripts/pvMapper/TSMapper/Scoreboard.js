var pvMapper;
(function (pvMapper) {
    var ScoreBoard = (function () {
        function ScoreBoard() {
            var _this = this;
            this.scoreLines = new Array();
            this.changedEvent = new pvMapper.Event();
            this.scoresInvalidatedEvent = new pvMapper.Event();
            this.tableRenderer = new pvMapper.Renderer.HTML.Table();
            this.self = this;
            this.onScoreChanged = function (event) {
                _this.changedEvent.fire(_this, event);
            };
        }
        ScoreBoard.prototype.addLine = function (scoreline) {
            scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
            this.scoreLines.push(scoreline);
        };
        ScoreBoard.prototype.getTableData = function (flat) {
            if (typeof flat === "undefined") { flat = false; }
            return this.scoreLines;
        };
        ScoreBoard.prototype.onScoresInvalidated = function () {
            Error("Function not implemented yet!");
        };
        return ScoreBoard;
    })();
    pvMapper.ScoreBoard = ScoreBoard;    
    pvMapper.floatingScoreboard;
    pvMapper.mainScoreboard = new ScoreBoard();
    pvMapper.mainScoreboard.changedEvent.addHandler(function () {
        var self = pvMapper.mainScoreboard;
        var mydata = pvMapper.mainScoreboard.getTableData();
        if(!pvMapper.floatingScoreboard) {
            pvMapper.floatingScoreboard = Ext.create('MainApp.view.ScoreboardWindow', {
                data: mydata
            });
            pvMapper.floatingScoreboard.show();
        } else {
            var gp = pvMapper.floatingScoreboard.down('gridpanel');
            gp.store.loadRawData(mydata);
            pvMapper.floatingScoreboard.show();
        }
    });
    pvMapper.onReady(function () {
    });
})(pvMapper || (pvMapper = {}));
