/// <reference path="../pvMapper/TSMapper/Data/ScoreboardProcessor.ts" />
/// <reference path="../pvMapper/TSMapper/pvMapper.ts" />
/// <reference path="../pvMapper/TSMapper/Tools.ts" />
/// <reference path="../pvMapper/TSMapper/Module.ts" />


module pvMapper {
    export module Tools {
        export class Reports extends pvMapper.Module {
            constructor() {
                //Create a module to add to the system
                super({
                    id: "inl.reports",
                    author: "Brant Peery, INL",
                    version: "0.1 ts",
                    url: null, // this module isn't loaded dynamically.

                    title: "Default Reports",
                    description: "Provide summary and detail report generation feature",
                    category: "Reports",

                    activate: null,
                    deactivate: null,

                    infoTools: [<pvMapper.IInfoToolOptions>{
                        id: "DefaultReportsTool",
                        title: "Default Reports",
                        description: "Provide summary and detail report generation feature",
                        longDescription: "<p>Provide summary and detail report generation feature</p>",
                        category: "Reports",

                        activate: () => {
                            this.addedComponents = pvMapper.reportsToolbarMenu.add([{
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
                        deactivate: () => {
                            if (this.addedComponents) {
                                var component;
                                while (component = this.addedComponents.pop())
                                    pvMapper.reportsToolbarMenu.remove(component);
                            }
                        }
                    }]
                });
            }

            private addedComponents: any;
        }
        //Instanciate the tool
        var toolInstance = new Reports();
        pvMapper.onReady(toolInstance.activate);
    }
}