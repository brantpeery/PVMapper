﻿/// <reference path="../pvMapper/TSMapper/Data/ScoreboardProcessor.ts" />
/// <reference path="../pvMapper/TSMapper/pvMapper.ts" />
/// <reference path="../pvMapper/TSMapper/Tools.ts" />
/// <reference path="../pvMapper/TSMapper/Options.d.ts" />
/// <reference path="../pvMapper/TSMapper/Module.ts" />


module pvMapper {
    export module Tools {
        export class Reports {
            constructor() {
                //Create a module to add to the system
                var myModule = new Module(<IModuleOptions>{
                    id: "inl.reports",
                    author: "Brant Peery, INL",
                    version: "0.1 ts",

                    activate: () => { },
                    deactivate: () => { },
                    destroy: null,
                    init: null,
                    infoTools: [<pvMapper.IInfoToolOptions>{
                        title: "Default Reports",
                        description: "Provide summary and detail report generation feature",
                        longDescription: "Provide summary and detail report generation feature",
                        category: "Reports",

                        activate: () => {
                            pvMapper.reportsToolbarMenu.add([{
                                text: 'Summary Report',
                                iconCls: 'x-barcharts-menu-icon',
                                handler: function () {
                                    ////Catch the event when the SumaryReport window is ready and send it the data. 
                                    ////This only works on same domain JS and window.
                                    //window['SummaryReportReady'] = function () {
                                    //    var url: string = window.location.href;
                                    //    var arr: string[] = url.split("/");
                                    //    var origin: string = arr[0] + "//" + arr[2];
                                    //    win.postMessage(JSON.stringify(pvMapper.Data.ScoreboardProcessor.getCleanObjectTransposed(pvMapper.mainScoreboard)), origin);
                                    //};
                                    var win = window.open('/Report/Summary', 'Report');

                                }
                            }, {
                                text: 'Site Detail Report',
                                iconCls: 'x-notes-menu-icon',
                                handler: function () {
                                    ////Catch the event when the SumaryReport window is ready and send it the data. 
                                    ////This only works on same domain JS and window.
                                    //window['SummaryReportReady'] = function () {
                                    //    var url: string = window.location.href;
                                    //    var arr: string[] = url.split("/");
                                    //    var origin: string = arr[0] + "//" + arr[2];
                                    //    win.postMessage(JSON.stringify(pvMapper.Data.ScoreboardProcessor.getCleanObjectTransposed(pvMapper.mainScoreboard)), origin);
                                    //};
                                    var win = window.open('/Report/SiteDetail', 'Report');

                                }
                            }]);
                        },
                        init: () => { },
                        destroy: () => { },
                        deactivate: () => { }
                    }]
                });
            }
        }
        //Instanciate the tool
        var toolInstance = new Reports();
    }

}