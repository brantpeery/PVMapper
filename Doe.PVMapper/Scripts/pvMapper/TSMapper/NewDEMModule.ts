///// <reference path="pvMapper.ts" />
///// <reference path="Site.ts" />
///// <reference path="Score.ts" />
///// <reference path="Tools.ts" />
///// <reference path="Options.d.ts" />
///// <reference path="Module.ts" />
///// <reference path="../../Esri-GeoJsonConverter.js />

//module Modules {
//    export class Module {
//        constructor() {
//            var myModule: pvMapper.Module = new pvMapper.Module({
//                id: "",
//                author: "",
//                version: "",

//                activate: () => { this.addMap();  },
//                deactivate: () => { this.removeMap(); },
//                destroy: null,
//                init: null,

//                scoringTools: [ <pvMapper.IScoreToolOptions>{
//                    //activate: null,
//                    //deactivate: null,
//                    //destroy: null,
//                    //init: null,

//                    title: "",
//                    description: "",
//                    category: "",
//                    onScoreAdded: (event: EventArg, score: pvMapper.Score) => { },
//                    onSiteChange: (event: EventArg, score: pvMapper.Score) => {
//                        this.updateScore(score);
//                    },
//                    scoreUtilityOptions: {
//                        //Replace these with desired scoreUtility
//                        functionArgs: new pvMapper.MinMaxUtilityArgs(),
//                        functionName: "linear"
//                    }
//                }],
//                infoTools: null
//            });
//        }

//        //URL of rest service for desired layer
//        private restUrl = "";
//        //variable holding layer taken from service to add to pvmapper.map
//        private layer;
//        //Land bounds taken from LandUseModule
//        private landBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

//        //These functions are used to add and remove the layer from the main map when
//        //activated and deactivated
//        private addMap() { }

//        private removeMap() { }

//        //Function used to update the score in the scoreboard
//        private updateScore(score: pvMapper.Score) { }
//    }

//    var modInstance = new Module();
//}