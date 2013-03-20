/// <reference path="pvMapper.ts" />
/// <reference path="../../jquery.d.ts" />
/// <reference path="Event.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="../../ext-4.1.1a.d.ts" />



// Module
module pvMapper {

    export declare var Renderer: any;

    // Class
    export class ScoreBoard {
        // Constructor
        constructor() {

            this.self = this;

            this.onScoreChanged = (event) => {
                console.log("Score changed event detected by the scoreboard");
                //var html = this.self.render();
                this.changedEvent.fire(this, event);
            }
        }

        private self: ScoreBoard;
        public scoreLines: ScoreLine[] = new ScoreLine[]();

        public changedEvent: pvMapper.Event = new pvMapper.Event();
        public scoresInvalidatedEvent: pvMapper.Event = new pvMapper.Event();
        public tableRenderer: any = new pvMapper.Renderer.HTML.Table();

        public addLine(scoreline: ScoreLine) {
            console.log("Adding scoreline " + scoreline.name);
            scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
            this.scoreLines.push(scoreline);
            //this.changedEvent.fire(this,null);

        }

        public onScoreChanged: (event: Event) => void;

        public removeLine(idx: number) {
            throw ('Function not yet implemented');
        }

        public render() {
            console.log('Rendering the scorboard');
            var r = new Renderer.HTML.Table();
            var row = r.addRow();
            row.attr({ 'class': 'header' });
            row.addCell("Tool Name").attr({ 'class': 'header' });

            //Render the header
            var sites = pvMapper.siteManager.getSites();
            $.each(sites, function (idx: number, s: Site) {
                row.addCell(s.name);
            });

            //Render each scoreline
            $.each(this.scoreLines, function (idx: number, sl: ScoreLine) {
                var row = r.addRow();

                //Render the tool name
                var tc = row.addCell(sl.name);
                tc.attr({ "title": sl.description });
                //Render each site for this scoreline
                $.each(sl.scores, function (idx: number, s: Score) {
                    if (isNaN(s.value)) {
                        row.addCell("<i>" + s.toString() + "</i>"); // using raw html tags - ewww
                    } else {
                        row.addCell(s.toString());
                    }
                });
            });

            var HTML = r.render();
            console.log("Scoreboard HTML = " + HTML);
            return HTML;
        }

        /**
        A function that returns a flat table style data object meant for consumption by ExtJS grid
        */
        public getTableData(flat?: Boolean = false) {

            //Then an object with all the scorelines
            //In each scoreline include the 
            //  Tool name, description, category,
            //  Weight, and function for the score
            //  Include for each site:
            //      Value, Description, score, weighted score

            //This should be strong typed eventually
            var myData: any = { tools: [] };

            //make a data obect that contains all the active tools
            this.scoreLines.map(function (sl: ScoreLine, idx: number) {
                if (!sl.active) { return; } //Dont process the line if it is inactive

                var tool: any = {
                    name: sl.name,
                    description: sl.description,
                    //category: sl.category,
                    weight: sl.getWeight()
                };

                var toolSites = [];
                sl.scores.map(function (s: Score, sidx: number) {
                    if (flat) {
                        var sitename: string = 'site_' + sidx;
                        tool[sitename + '_value'] = s.value;
                        tool[sitename + '_score'] = s.utility;
                        tool[sitename + '_popup'] = s.popupMessage;
                        //tool[sitename + '_weightedscore'] = s.weightedScore;
                    } else {
                        var site = {
                            'name': s.site.name,
                            'value': s.value,
                            'score': s.utility,
                            'popup': s.popupMessage
                        }
                        toolSites.push(site);
                    }
                });
                if (!flat) tool['sites'] = toolSites;
                myData.tools.push(tool);
            });


            return myData;
        }

        public onScoresInvalidated() {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it

            Error("Function not implemented yet!");
        }

    }

    declare var Ext: any; //So we can use it

    export var floatingScoreboard: any; //The EXTjs window
    export var mainScoreboard = new ScoreBoard(); //API Element
    mainScoreboard.changedEvent.addHandler(function () => {

        var self = mainScoreboard;
        var mydata = mainScoreboard.getTableData();
        if (!pvMapper.floatingScoreboard) {

            pvMapper.floatingScoreboard = Ext.create('MainApp.view.ScoreboardWindow', {
                data: mydata
            });
            pvMapper.floatingScoreboard.show();
        } else {
            var gp = pvMapper.floatingScoreboard.down('gridpanel');
            //gp.store.removeAll();
            gp.store.loadRawData(mydata);
            pvMapper.floatingScoreboard.show();
        }
    });

    //Create the scoreboard onscreen
    pvMapper.onReady(function () {
        //mainScoreboard.changedEvent.fire(mainScoreboard, {});
    });

}
