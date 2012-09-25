/// <reference path="Renderer.js" />

(function (pvM) {
    pvM.Scoreboard = function () {
        var self = this;

        this.changedEvent = new Event();
        this.scoresInvalidatedEvent = new Event();

        this.addLine = function (scoreLine) {
            if (scoreLine instanceof pvM.ScoreLine) {
                scoreLine.scoreChangeEvent.addHandler(onScoreChanged);
                //scoreLine.scoresInvalidatedEvent.addHandler(onScoresInvalidated);

                this.scoreLines.push(scoreLine);
            } else {
                //Try to parse the options

            }
        };

        this.removeLine = function (idx) {
            throw ("Function not yet implemented!");
        };
        this.removeLine;
        this.scoreLines = [];
        this.render = function () {
            var r = new pvM.Renderer.HTML.Table();
            //Make the header row
            var row = r.addRow();
            row.addCell("Tool Name").attr({ 'class': 'scoreboardHeader' });
            var sites = pvM.siteManager.getSites();
            $.each(sites, function (idx, s) {
                row.addCell(s.name);
            });


            $.each(this.scoreLines, function (idx, sl) {
                var row = r.addRow();
                row.addCell(sl.name).attr({ title: sl.description, 'class': 'toolName' });
                $.each(sl.scores, function (idx, s) {
                    row.addCell(s.value());
                });
            });
            return r.render();
        }

        //Private functions
        function onScoreChanged() {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it

            var html = self.render();

            self.changedEvent.fire(self, html);
        };
        function onScoresInvalidated() {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it

            Error("Function not implemented yet!");
        };
        var tableRenderer = new pvM.Renderer.HTML.Table();


    }

    //Create a scoreboard instance on the pvMapper object
    pvM.mainScoreboard = new pvM.Scoreboard();
    pvM.mainScoreboard.changedEvent.addHandler(function () {
        var html = this.render();

        if (!pvM.floatingScoreboard) {
            pvM.floatingScoreboard = Ext.create('Ext.window.Window', {
                title: 'Floating Scoreboard',
                width: 400,
                height: 400,
                html: html,
                floating: true,
                renderTo: Ext.getBody(),
                modal: false,
                draggable: true,
                layout: 'fit'
            });
        } else {
            pvM.floatingScoreboard.update(html);
        }
        pvM.floatingScoreboard.show();
    });
})(pvMapper);