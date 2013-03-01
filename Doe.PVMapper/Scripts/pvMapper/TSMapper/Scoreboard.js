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
                console.log("Score changed event detected by the scoreboard");
                _this.changedEvent.fire(_this, event);
            };
        }
        ScoreBoard.prototype.addLine = function (scoreline) {
            console.log("Adding scoreline " + scoreline.name);
            scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
            this.scoreLines.push(scoreline);
        };
        ScoreBoard.prototype.removeLine = function (idx) {
            throw ('Function not yet implemented');
        };
        ScoreBoard.prototype.render = function () {
            console.log('Rendering the scorboard');
            var r = new pvMapper.Renderer.HTML.Table();
            var row = r.addRow();
            row.attr({
                'class': 'header'
            });
            row.addCell("Tool Name").attr({
                'class': 'header'
            });
            var sites = pvMapper.siteManager.getSites();
            $.each(sites, function (idx, s) {
                row.addCell(s.name);
            });
            $.each(this.scoreLines, function (idx, sl) {
                var row = r.addRow();
                var tc = row.addCell(sl.name);
                tc.attr({
                    "title": sl.description
                });
                $.each(sl.scores, function (idx, s) {
                    row.addCell(s.value);
                });
            });
            var HTML = r.render();
            console.log("Scoreboard HTML = " + HTML);
            return HTML;
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
        var html = self.render();
        if(!pvMapper.floatingScoreboard) {
            pvMapper.floatingScoreboard = Ext.create('MainApp.view.Window', {
                title: 'Main Scoreboard',
                width: 600,
                height: 200,
                html: html,
                cls: "propertyBoard"
            });
            pvMapper.floatingScoreboard.show();
        }
        pvMapper.floatingScoreboard.update(html);
        pvMapper.floatingScoreboard.show();
    });
    pvMapper.onReady(function () {
        pvMapper.mainScoreboard.changedEvent.fire(pvMapper.mainScoreboard, {
        });
    });
})(pvMapper || (pvMapper = {}));
