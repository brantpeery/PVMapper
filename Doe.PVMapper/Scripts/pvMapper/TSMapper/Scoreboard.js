/// <reference path="../../jquery.d.ts" />
/// <reference path="Renderer.ts" />
/// <reference path="Event.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="../../ext-4.1.1a.d.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    // Class
    var ScoreBoard = (function () {
        // Constructor
        function ScoreBoard() {
            this.scoreLines = new Array();
            this.changedEvent = new pvMapper.Event();
            this.scoresInvalidatedEvent = new pvMapper.Event();
            this.tableRenderer = new pvMapper.Table();
            this.self = this;
        }
        ScoreBoard.prototype.addLine = function (scoreline) {
            if(scoreline instanceof pvMapper.ScoreLine) {
                scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
                this.scoreLines.push(scoreline);
            }
        };
        ScoreBoard.prototype.onScoreChanged = function (event) {
            var html = this.self.render();
            this.self.changedEvent.fire(self, html);
        };
        ScoreBoard.prototype.removeLine = function (idx) {
            throw ('Function not yet implemented');
        };
        ScoreBoard.prototype.render = function () {
            var r = new pvMapper.Table();
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
                $.each(sl.scores, function (idx, s) {
                    row.addCell(s.value);
                });
            });
            return r.render();
        };
        ScoreBoard.prototype.onScoresInvalidated = function () {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it
            Error("Function not implemented yet!");
        };
        return ScoreBoard;
    })();
    pvMapper.ScoreBoard = ScoreBoard;    
    //Just to trick TypeScript into believing that we are creating an Ext object
    //to by pass development time compiler
    if(typeof (Ext) === 'undefined') {
        var Ext;
    }
    pvMapper.floatingScoreboard;
    pvMapper.mainScoreboard = new ScoreBoard();
    pvMapper.mainScoreboard.changedEvent.addHandler(function () {
        var html = this.render();
        if(!pvMapper.floatingScoreboard) {
            pvMapper.floatingScoreboard = Ext.create('MainApp.view.Window', [
                {
                    title: 'Site Properties',
                    width: 400,
                    height: 400,
                    html: html
                }
            ]);
            pvMapper.floatingScoreboard.show();
        } else {
            pvMapper.floatingScoreboard.update(html);
        }
        pvMapper.floatingScoreboard.show();
    });
})(pvMapper || (pvMapper = {}));
//@ sourceMappingURL=Scoreboard.js.map
