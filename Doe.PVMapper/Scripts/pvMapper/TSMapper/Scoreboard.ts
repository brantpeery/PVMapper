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

                //Update all the summary (average/total) lines
                this.updateTotals();

                this.changedEvent.fire(this, event); //Let the UI handle the changes
            }
        }

        private self: ScoreBoard;
        public scoreLines: ScoreLine[] = new Array<ScoreLine>();//ScoreLine[]();  <<-- TS0.9.0 doesn't like this.
        public totalLines: TotalLine[] = new Array<TotalLine>();
        public isScoreLoaded: boolean = false;
        //Events -----------
        public changedEvent: pvMapper.Event = new pvMapper.Event();
        public scoresInvalidatedEvent: pvMapper.Event = new pvMapper.Event();
        public scoreLineAddedEvent: pvMapper.Event = new pvMapper.Event();
        public update() {
            this.changedEvent.fire(this, null);
        }

        /**
         Fires when a total line tool is added to the totalLines
        */
        public totalLineAddedEvent: pvMapper.Event = new pvMapper.Event();

        //End Events---------

        //public tableRenderer = new pvMapper.Table();

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
            var emptyArray = []; // Typescript 0.98 doesn't like this:  [].concat()...  
            var lines: IToolLine[] = (emptyArray.concat(this.scoreLines)).concat(this.totalLines)
            return lines;
        }

        public onScoresInvalidated() {
            //let all the other modules that care know that a score changed
            //Create an event that holds the information about score and utility that changed it
            Error("Function not implemented yet!");
        }


        public removeCustomModule(moduleName: string) {
            var moduleDataArray = pvMapper.customModules.filter(function (a) {
                return (a.fileName === moduleName); //TODO: this is NOT a unique key !  Also, this equality isn't easily enforcable or obvious to non-experts. Should change it entirely.
            });
            console.assert(moduleDataArray.length < 2, "Module name collision detected!");
            var amodule = moduleDataArray.length ? moduleDataArray[0] : null

            if (amodule) {
                //remove the module from the local database
                pvMapper.ClientDB.deleteCustomKML(amodule.fileName, function (isSuccessful) {
                    if (isSuccessful) {
                        //remove it from the custom module list.
                        var idx = pvMapper.customModules.indexOf(amodule);
                        pvMapper.customModules.splice(idx, 1);
                        //now remove the scoreline.
                        var scorelineArray: pvMapper.ScoreLine[] = pvMapper.mainScoreboard.scoreLines.filter(function (a) {
                            if (a.getModuleName !== undefined) {
                                if (a.getModuleName() === amodule.fileName) return true; //TODO: this is NOT a unique key !  Also, this equality isn't easily enforcable or obvious to non-experts. Should change it entirely.
                                else return false;
                            }
                            else return false;
                        });
                        console.assert(scorelineArray.length < 2, "Module name collision detected!");
                        var scoreline = scorelineArray.length ? scorelineArray[0] : null;
                        if (scoreline) {
                            idx = pvMapper.mainScoreboard.scoreLines.indexOf(scoreline);
                            if (idx >= 0) pvMapper.mainScoreboard.scoreLines.splice(idx, 1);
                            //finally then free the module.
                            delete scoreline;
                        }
                        if (amodule.moduleObject.removeLocalLayer !== undefined)
                            amodule.moduleObject.removeLocalLayer();  //remove the custom module layer from map.
                        delete amodule;
                        pvMapper.mainScoreboard.update();
                    }
                });
            }
        }

        public removeModule(moduleName: string) {
            var scorelineArray = mainScoreboard.scoreLines.filter(function (sl) {
                return (sl.title == moduleName); //TODO: this is NOT a unique key !  Also, this equality isn't easily enforcable or obvious to non-experts. Should change it entirely.
            });
            console.assert(scorelineArray.length < 2, "Module name collision detected in score lines!");
            var scoreline = scorelineArray.length ? scorelineArray[0] : null

            if (scoreline) {
                var amodule = scoreline.getModule();
                //pvMapper.moduleManager.deleteModule(moduleName);
                var mInfo: pvMapper.ModuleInfo = pvMapper.moduleManager.getModule(moduleName);
                if (mInfo) {
                    mInfo.isActive = false;
                    delete amodule;
                    var idx = pvMapper.mainScoreboard.scoreLines.indexOf(scoreline);
                    if (idx >= 0) pvMapper.mainScoreboard.scoreLines.splice(idx, 1);
                    delete scoreline;

                    pvMapper.mainScoreboard.update();
                    pvMapper.mainScoreboard.updateTotals();
                }
            }
        }


        public toJSON() {
            return {
                scoreLines: this.scoreLines,
                totalLines: this.totalLines
            }
        }

        public fromJSON(o: any) {
            for (var i = 0; i < o.scoreLines.length; i++) {
                this.scoreLines[i].fromJSON(o.scoreLines[i]);
            }

            for (var i = 0; i < o.totalLines.length; i++) {
                this.totalLines[i].fromJSON(o.totalLines[i]);
            }

        }

    }

    //declare var Ext: any; //So we can use it
    export var floatingScoreboard: any; //The EXTjs window
    export var mainScoreboard = new ScoreBoard(); //API Element

    var timeoutHandle = null;
    //mainScoreboard.changedEvent.addHandler(() => {
    mainScoreboard.changedEvent.addHandler(function () {
        // queue the changed event to be handled shortly; ignore following change events until it is.
        if (timeoutHandle == null) {
            timeoutHandle = window.setTimeout(function () {

                if (console) { console.log("Scoreboard update event(s) being processed..."); }
                // we're done delaying our event, so reset the timeout handle to null
                timeoutHandle = null;

                var self = mainScoreboard;
                var mydata = mainScoreboard.getTableData();
                if (!pvMapper.floatingScoreboard) {


                    pvMapper.floatingScoreboard = Ext.create('MainApp.view.ScoreboardWindow', {
                        height: Math.min(900, (Ext.getBody().getViewSize().height - 140)), // initial scoreboard height proportional to window height
                        data: mydata
                    });
                    pvMapper.floatingScoreboard.show();

                } else {
                    var gp = pvMapper.floatingScoreboard.down('gridpanel');
                    //Note: selecting cells hoarks everything up unless we clear the selection before reloading the data
                    gp.getSelectionModel().deselectAll();
                    gp.store.loadRawData(mydata);

                    //Note: removed this as it's really annoying (scoreboard pops up from minimized, covers up other windows, etc)
                    //pvMapper.floatingScoreboard.show();
                }
            }, 250);
            // queue is set to wait 1/10th of a second before it actually refreshes the scoreboard.
        } else {
            if (console) { console.log("Scoreboard update event safely (and efficiently) ignored."); }

        }
    });

    //this file has all modules to be loaded.
    pvMapper.clientScripts = "~/Scirpts/pvClient.js";

    //this function will wait until IndexedDB is loaded and then load the configuration as well as saved CustomKML modules.
    //However, if the browser is not supporting IndexedDB, it will just kick it back out.
    //TODO: Should change this to use the Promise pattern. --LV
    var holdYourHorse = false;
    pvMapper.waitToLoad = function () {
        if (ClientDB.db !== null) {
            if (!holdYourHorse) {
                holdYourHorse = true;
                //load all necessary modules dynamically.
                pvMapper.moduleManager.loadTools();

                //load custom modules.
                if ((pvMapper.loadLocalModules !== undefined) && (pvMapper.loadLocalModules !== null)
                    && (typeof (pvMapper.loadLocalModules) === "function")) {
                    pvMapper.loadLocalModules();
                }

                //load configuration
                if ((ClientDB.db != null) && (!mainScoreboard.isScoreLoaded)) {
                    mainScoreboard.scoreLines.forEach(function (sc) {
                        sc.loadConfiguration();
                    });
                    mainScoreboard.isScoreLoaded = true;
                }
            }
        } else {
            setTimeout(pvMapper.waitToLoad, 5000);
        }

    }

    //Create the scoreboard onscreen
    pvMapper.onReady(function () {
        holdYourHorse = false;
        setTimeout(pvMapper.waitToLoad, 5000); //check every 5 seconds.
    });

}
