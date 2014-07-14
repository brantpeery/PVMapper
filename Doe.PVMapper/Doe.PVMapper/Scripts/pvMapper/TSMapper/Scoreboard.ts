/// <reference path="pvMapper.ts" />
/// <reference path="../../jquery.d.ts" />
/// <reference path="Event.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="TotalLine.ts" />
/// <reference path="SiteManager.ts" />


// Module
module pvMapper {

    export interface IProjectJSON {
        configLines?: IScoreLineJSON[]; //Note: we've used either 'configLines' or 'scoreLines' in past format versions, so here we'll support both.
        scoreLines?: IScoreLineJSON[]; //Note: we've used either 'configLines' or 'scoreLines' in past format versions, so here we'll support both.
        totalLines?: IToolJSON[];

        sites?: ISiteJSON[];
        //scores?: IScoreJSON[]; // meh... no real reason not to just leave these as children of the scoreLines
        modules?: IModuleInfoJSON[];

        //tools?: IToolJSON[]; // currently we have no means of syncing or saving general tools (because currently there are no configurable general tools)

        //TODO: kmlFiles: any[]; ... something something
    }

    export declare var Renderer: any;

    // Class
    export class ScoreBoard {
        // Constructor
        constructor() {
            this.connectedToSiteManager = false;
        }

        public scoreLines: ScoreLine[] = new Array<ScoreLine>();
        public totalLines: TotalLine[] = new Array<TotalLine>();

        //Events -----------
        public scoresInvalidatedEvent: pvMapper.Event = new pvMapper.Event();
        public scoreLineAddedEvent: pvMapper.Event = new pvMapper.Event();

        /**
         Fires when a total line tool is added to the totalLines
        */
        //public totalLineAddedEvent: pvMapper.Event = new pvMapper.Event();

        //End Events---------

        //public tableRenderer = new pvMapper.Table();

        public addLine = (scoreline: ScoreLine) => {
            //console.log("Adding scoreline " + scoreline.name);
            this.linesHaveChanged = true;

            if (console && console.assert)
                console.assert(this.scoreLines.filter(sl => sl.id === scoreline.id).length <= 0,
                    "Warning: duplicate score line ID '" + scoreline.id + "'");
            //if (console && console.log) console.log("adding scoreline ID= '" + scoreline.id + "'");

            scoreline.scoreChangeEvent.addHandler(this.onScoreChanged);
            this.scoreLines.push(scoreline);

            if (siteManager && siteManager.getSites().length) // <-- this is aesthetic - it keeps the scorebord from popping up when we start with app without any sites.
                this.update();
        }

        public removeLine = (scoreline: ScoreLine) => {
            var idx = pvMapper.mainScoreboard.scoreLines.indexOf(scoreline);
            if (idx >= 0) {
                scoreline.scoreChangeEvent.removeHandler(this.onScoreChanged);
                pvMapper.mainScoreboard.scoreLines.splice(idx, 1);

                this.linesHaveChanged = true;
                this.update();
            }
        }

        public addTotalLine = (line: TotalLine) => {
            this.linesHaveChanged = true;

            this.totalLines.push(line);

            if (siteManager && siteManager.getSites().length) // <-- this is aesthetic - it keeps the scorebord from popping up when we start with app without any sites.
                this.update();
        }

        public removeTotalLine = (line: TotalLine) => {
            var idx = this.totalLines.indexOf(line);
            if (idx >= 0) {
                //scoreline.scoreChangeEvent.removeHandler(this.onScoreChanged);
                this.totalLines.splice(idx, 1);

                this.linesHaveChanged = true;
                this.update();
            }
        }

        public scoreLines_weightTotal: number;

        public updateTotals() {
            // compute the total weight of all score tools... this is used in the tooltip for the Weight column (which shows the percentage that tool contributes to the total weight)
            this.scoreLines_weightTotal = this.scoreLines.reduce((total: number, line: ScoreLine) => total += line.weight, 0);

            var sl = this.scoreLines; //A copy for scope in the forEach
            this.totalLines.forEach(function (t, idx) {
                t.UpdateScores(sl);
            });
        }

        public onScoreChanged: (event: Event) => void = (event: Event) => {
            this.update();
        }

        /**
        A function that returns a data object meant for consumption by ExtJS grid (UI)
        */
        public getTableData() {
            //Mash the two rendering line types together for display on the GUI
            var lines: IToolLine[] = (<IToolLine[]>this.scoreLines).concat(this.totalLines)
            return lines;
        }

        //Note: this method is used to save and load projects, as well as to send project data to reports.
        public toJSON(): IProjectJSON {
            return {
                scoreLines: this.scoreLines.map(l => l.toJSON()),
                totalLines: this.totalLines.map(l => l.toJSON()),

                sites: pvMapper.siteManager.getSites().map(s => s.toJSON()),
                //scores: this.scoreLines.map(l => l.scores).reduce((x, y) => x.concat(y)), // <-- meh, no compelling reason not to leave these as children of the score lines.
                modules: pvMapper.moduleManager.toJSON(),
            };
        }

        public fromJSON(o: IProjectJSON) {
            var scoreToolConfigs: IScoreLineJSON[] = (o.configLines || []).concat(o.scoreLines || []);

            //Note: o.sites are currently loaded/handled in MainToolbar.js: importScoreboardFromJSON()
            //TODO: handle o.sites here...
            //if (typeof (o.sites) === "object") {
            //}

            if (typeof (o.modules) === "object") {
                // load saved module configurations.
                pvMapper.moduleManager.fromJSON(o.modules);
            }

            //TODO: handle custom modules here ...! (rather than sometimes handling them in MainToolbar.js, and otherwise not handling them at all)

            // load scoreboard and tool configurations
            this.scoreLines.forEach(line => {
                var sourceList = scoreToolConfigs.filter( // If this line has no id, then fall back on matching by title (to support our old format)
                    source => typeof(source.id) === "undefined" ? source.title === line.title : source.id === line.id);
                if (console && console.warn && sourceList.length !== 1) console.warn(sourceList.length ?
                    "Warning: tool ID collision detected." : "Warning: configuration for tool '" + line.id + "' not found in JSON");
                if (sourceList && sourceList.length > 0) {
                    line.fromJSON(sourceList[0]);
                }
            });

            //Note: at present there is no reason to load anything from our total lines... neither of them store any configuration data.
            //if (o.totalLines) {
            //    this.totalLines.forEach(line => {
            //        var sourceList = o.totalLines.filter(source => source.id === line.id);
            //        if (console && console.warn && sourceList.length !== 1) console.warn(sourceList.length ?
            //            "Warning: tool ID collision detected." : "Warning: configuration for tool '" + line.id + "' not found in JSON");
            //        if (sourceList && sourceList.length > 0) {
            //            line.fromJSON(sourceList[0]);
            //        }
            //    });
            //}

            // redraw the scoreboard to reflect these changes (if necessary...)
            this.update();
        }

        private connectedToSiteManager = false;

        private linesHaveChanged = true;
        private sitesHaveChanged = true;

        private update_timeoutHandle = null;
        //mainScoreboard.changedEvent.addHandler(() => {
        public update = () => {
            // queue the changed event to be handled shortly; ignore following change events until it is.
            if (this.update_timeoutHandle == null) {
                //this.updateStatusBar(); // <-- put this back if we decide to go with the more frequently updating status bar (ie, let it use its own timer).
                this.update_timeoutHandle = window.setTimeout(() => {
                    // we're done delaying our event, so reset the timeout handle to null
                    this.update_timeoutHandle = null;

                    if (console && console.log) { console.log("Scoreboard update event(s) being processed..."); }

                    if (!this.connectedToSiteManager && siteManager) {
                        siteManager.siteAdded.addHandler(event => { this.sitesHaveChanged = true; });
                        siteManager.siteRemoved.addHandler(event => { this.sitesHaveChanged = true; });
                        this.connectedToSiteManager = true;
                    }
                    
                    this.updateStatusBar();

                    //Update all the summary (average/total) lines
                    this.updateTotals();

                    var mydata = this.getTableData();

                    if (!pvMapper.floatingScoreboard) {
                        pvMapper.floatingScoreboard = Ext.create('MainApp.view.ScoreboardWindow', {
                            height: Math.min(900, (Ext.getBody().getViewSize().height - 140)), // initial scoreboard height proportional to window height
                            data: mydata
                        });

                        if (this.linesHaveChanged || this.sitesHaveChanged) {
                            // generate scoreboard columns
                            (<any>pvMapper).generateMainScoreboardColumns();
                            this.linesHaveChanged = this.sitesHaveChanged = false;
                        }

                        pvMapper.floatingScoreboard.show();
                    } else {
                        var gp = pvMapper.floatingScoreboard.down('gridpanel'); //TODO: this is a hack...

                        //Note: selecting cells hoarks everything up unless we clear the selection before reloading the data
                        gp.getSelectionModel().deselectAll();

                        if (this.linesHaveChanged || this.sitesHaveChanged) {
                            // generate scoreboard columns
                            (<any>pvMapper).generateMainScoreboardColumns();
                            this.linesHaveChanged = this.sitesHaveChanged = false;
                        }

                        // load data (note: this hoarks our scrollbar positions, etc.)
                        gp.store.loadRawData(mydata);
                    }
                }, 200);
                // queue is set to wait 1/5th of a second before it actually refreshes the scoreboard.
            } else {
                //if (console) { console.log("Scoreboard update event safely (and efficiently) ignored."); }
            }
        };

        private updateStatusBar_statusBar: {
            setStatus(config: { text: string; iconCls: string; clear?: { wait?: number; anim?: boolean; useDefaults?: boolean;} });
            clearStatus(config?: { anim?: boolean; useDefaults?: boolean });
            getText(); setIcon(iconCls?: string); setText(text?: string);
            showBusy(config?: { text?: string; iconCls?: string; clear?: { wait?: number; anim?: boolean; useDefaults?: boolean; } });
            autoClear: number; busyIconCls: string; busyText: string;
        } = null;

        public updateStatusBar = () => {
            this.updateStatusBar_statusBar = this.updateStatusBar_statusBar || Ext.getCmp('maintaskbar');

            var numberOfScoresWithOldValues = this.scoreLines.reduce((outerCount: number, scoreLine: ScoreLine) =>
                outerCount + scoreLine.scores.reduce((innerCount: number, score: Score) => innerCount + (score.isValueOld ? 1 : 0), 0), 0);

            if (numberOfScoresWithOldValues > 0) {
                this.updateStatusBar_statusBar.showBusy({ text: numberOfScoresWithOldValues === 1 ? 
                    "Updating 1 score ..." : "Updating " + numberOfScoresWithOldValues + " scores ...",
                    clear: { wait: 30000, useDefaults: false } // <-- an astronomical timeout here (30s), for those occasional requests that will *literally wait forever*
                });
            } else {
                if (this.updateStatusBar_statusBar.getText() !== '') {
                    this.updateStatusBar_statusBar.setStatus({ text: "Scores updated", iconCls: "", 
                        clear: { wait: 3000, useDefaults: false } }); // <-- keep "done" on the status bar for 3 seconds, then fade it away (fancy!)
                }
            }
        }
    }

    export var floatingScoreboard: any; //The EXTjs window
    export var mainScoreboard = new ScoreBoard(); //API Element
}
