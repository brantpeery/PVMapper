/// <reference path="../../jquery.d.ts" />
/// <reference path="Renderer.ts" />
/// <reference path="Event.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="../../ext-4.1.1a.d.ts" />

// Module
module pvMapper {

  // Class
  export class ScoreBoard {
    // Constructor
    constructor () {

      this.self = this;
    }

    private self: ScoreBoard;
    public scoreLines: ScoreLine[] = new ScoreLine[]();

    public changedEvent: pvMapper.Event = new pvMapper.Event();
    public scoresInvalidatedEvent: pvMapper.Event = new pvMapper.Event();
    public tableRenderer: Table = new Table();

    public addLine(scoreline: ScoreLine) {
      if (scoreline instanceof ScoreLine) {
        scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
        this.scoreLines.push(scoreline);
      }
    }

    public onScoreChanged(event: Event) {
      var html = this.self.render();
      this.self.changedEvent.fire(self, html);
    }

    public removeLine(idx: number) {
      throw ('Function not yet implemented');
    }

    public render() {
      var r: Table = new Table();
      var row: Row = r.addRow();
      row.attr({ 'class': 'header' });
      row.addCell("Tool Name").attr({ 'class': 'header' });
      var sites = pvMapper.siteManager.getSites();
      $.each(sites, function (idx: number, s: Site) {
        row.addCell(s.name);
      });

      $.each(this.scoreLines, function (idx: number, sl: ScoreLine) {
        var row: Row = r.addRow();
        $.each(sl.scores, function (idx: number, s: Score) {
          row.addCell(s.value);
        });
      });

      return r.render();
    }

    public onScoresInvalidated() {
      //let all the other modules that care know that a score changed
      //Create an event that holds the information about score and utility that changed it

      Error("Function not implemented yet!");
    }

  }

  //Just to trick TypeScript into believing that we are creating an Ext object
  //to by pass development time compiler
  if (typeof(Ext) === 'undefined') var Ext: Ext;

  export var floatingScoreboard: any;
  export var mainScoreboard = new ScoreBoard();
  mainScoreboard.changedEvent.addHandler(function () {
    var html: HTML = this.render();
    if (!pvMapper.floatingScoreboard) {
      pvMapper.floatingScoreboard = Ext.create('MainApp.view.Window', [{
        title: 'Site Properties',
        width: 400,
        height: 400,
        html: html
      }]);
      pvMapper.floatingScoreboard.show();
    } else {
      pvMapper.floatingScoreboard.update(html);
    }
    pvMapper.floatingScoreboard.show();

  });

}
