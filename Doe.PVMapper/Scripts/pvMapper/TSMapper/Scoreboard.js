/// <reference path="pvMapper.ts" />
/// <reference path="../../jquery.d.ts" />
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
            var _this = this;
            this.scoreLines = new Array();
            this.changedEvent = new pvMapper.Event();
            this.scoresInvalidatedEvent = new pvMapper.Event();
            this.tableRenderer = new pvMapper.Renderer.HTML.Table();
            this.self = this;
            this.onScoreChanged = function (event) {
                console.log("Score changed event detected by the scoreboard");
                //var html = this.self.render();
                _this.changedEvent.fire(_this, event);
            };
        }
        ScoreBoard.prototype.addLine = function (scoreline) {
            console.log("Adding scoreline " + scoreline.name);
            scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
            this.scoreLines.push(scoreline);
            //this.changedEvent.fire(this,null);
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
            //Render the header
            var sites = pvMapper.siteManager.getSites();
            $.each(sites, function (idx, s) {
                row.addCell(s.name);
            });
            //Render each scoreline
            $.each(this.scoreLines, function (idx, sl) {
                var row = r.addRow();
                //Render the tool name
                var tc = row.addCell(sl.name);
                tc.attr({
                    "title": sl.description
                });
                //Render each site for this scoreline
                $.each(sl.scores, function (idx, s) {
                    if(isNaN(s.value)) {
                        row.addCell("<i>" + s.toString() + "</i>")// using raw html tags - ewww
                        ;
                    } else {
                        row.addCell(s.toString());
                    }
                });
            });
            var HTML = r.render();
            console.log("Scoreboard HTML = " + HTML);
            return HTML;
        };
        ScoreBoard.prototype.onScoresInvalidated = function () {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it
            Error("Function not implemented yet!");
        };
        return ScoreBoard;
    })();
    pvMapper.ScoreBoard = ScoreBoard;    
    pvMapper.floatingScoreboard;//The EXTjs window
    
    pvMapper.mainScoreboard = new ScoreBoard();//API Element
    
    pvMapper.mainScoreboard.changedEvent.addHandler(function () {
        var self = pvMapper.mainScoreboard;
        var html = self.render();
        if(!pvMapper.floatingScoreboard) {
            pvMapper.floatingScoreboard = Ext.create('MainApp.view.Window', {
                title: 'Main Scoreboard',
                width: 800,
                height: 200,
                html: html,
                cls: "propertyBoard"
            });
            pvMapper.floatingScoreboard.show();
        }
        pvMapper.floatingScoreboard.update(html);
        pvMapper.floatingScoreboard.show();
    });
    //Create the scoreboard onscreen
    pvMapper.onReady(function () {
        pvMapper.mainScoreboard.changedEvent.fire(pvMapper.mainScoreboard, {
        });
    });
})(pvMapper || (pvMapper = {}));
