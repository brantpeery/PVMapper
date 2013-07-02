/// <reference path="pvMapper.ts" />
/// <reference path="../../jquery.d.ts" />
/// <reference path="Event.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="TotalLine.ts" />


// Module
module pvMapper {

    export declare var Renderer: any;

    // Class
    export class ScoreBoard {
        // Constructor
        constructor() {

            this.self = this;

            this.onScoreChanged = (event) => {
                //console.log("Score changed event detected by the scoreboard");
                //var html = this.self.render();
                this.updateTotals(); //Update all the total lines
                this.changedEvent.fire(this, event); //Let the UI handle the changes
            }
        }

        private self: ScoreBoard;
        public scoreLines: ScoreLine[] = new Array<ScoreLine>();//ScoreLine[]();  <<-- TS0.9.0 doesn't like this.
        public totalLines: TotalLine[] = new Array<TotalLine>();

        //Events -----------
        public changedEvent: pvMapper.Event = new pvMapper.Event();
        public scoresInvalidatedEvent: pvMapper.Event = new pvMapper.Event();
        public scoreLineAddedEvent: pvMapper.Event = new pvMapper.Event();

        /**
         Fires when a total line tool is added to the totalLines
        */
        public totalLineAddedEvent: pvMapper.Event = new pvMapper.Event();

        //End Events---------

        public tableRenderer: any = new pvMapper.Renderer.HTML.Table();

        public addLine(scoreline: ScoreLine) {
            //console.log("Adding scoreline " + scoreline.name);
            scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
            this.scoreLines.push(scoreline);

            //this.changedEvent.fire(this,null);
        }

        public addTotalLine(line: TotalLine) {
            line.ValueChangedEvent.addHandler(function (event) {
                //Do what ever needs to be done for updating the GUI when 
                //the total line recalculates
                //IGNORED for now
            })

            this.totalLines.push(line);

            //Fire the event that indicates adding a total line to the array
            this.totalLineAddedEvent.fire(this, line);
        }

        public updateTotals() {
            var sl = this.scoreLines; //A copy for scope in the forEach
            this.totalLines.forEach(function (t, idx) {
                t.UpdateScores(sl);
            });
        }

        //Set up in the constructor
        public onScoreChanged: (event: Event) => void;


        /**
        A function that returns a data object meant for consumption by ExtJS grid (UI)
        */
        public getTableData(flat: Boolean = false) {
            //Mash the two rendering line types together for display on the GUI
            var lines:IToolLine[]= ([].concat(this.scoreLines)).concat(this.totalLines)
            return lines;
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

    var timeoutHandle = null;
    //mainScoreboard.changedEvent.addHandler(() => {
    mainScoreboard.changedEvent.addHandler(function () {
        // queue the changed event to be handled shortly; ignore following change events until it is.
        if (timeoutHandle == null) {
            timeoutHandle = window.setTimeout(function () {
                // we're done delaying our event, so reset the timeout handle to null
                timeoutHandle = null; 
                var self = mainScoreboard;
                var mydata = mainScoreboard.getTableData();
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
                    pvMapper.floatingScoreboard.show();
                }
            }, 100);
            // queue is set to wait 1/10th of a second before it actually refreshes the scoreboard.
        } else {
            if (console) { console.log("Scoreboard update event safely (and efficiently) ignored."); }
        }
    });

    //Create the scoreboard onscreen
    pvMapper.onReady(function () {
        //mainScoreboard.changedEvent.fire(mainScoreboard, {});
    });

}
