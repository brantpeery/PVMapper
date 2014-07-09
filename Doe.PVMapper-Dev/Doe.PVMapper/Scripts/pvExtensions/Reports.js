/// <reference path="../pvMapper/TSMapper/Data/ScoreboardProcessor.ts" />
/// <reference path="../pvMapper/TSMapper/pvMapper.ts" />
/// <reference path="../pvMapper/TSMapper/Tools.ts" />
/// <reference path="../pvMapper/TSMapper/Module.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pvMapper;
(function (pvMapper) {
    (function (Tools) {
        var Reports = (function (_super) {
            __extends(Reports, _super);
            function Reports() {
                var _this = this;
                //Create a module to add to the system
                _super.call(this, {
                    id: "inl.reports",
                    author: "Brant Peery, INL",
                    version: "0.1 ts",
                    url: null,
                    title: "Default Reports",
                    description: "Provide summary and detail report generation feature",
                    category: "Reports",
                    activate: null,
                    deactivate: null,
                    infoTools: [{
                            id: "DefaultReportsTool",
                            title: "Default Reports",
                            description: "Provide summary and detail report generation feature",
                            longDescription: "<p>Provide summary and detail report generation feature</p>",
                            category: "Reports",
                            activate: function () {
                                _this.addedComponents = pvMapper.reportsToolbarMenu.add([
                                    {
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
                            deactivate: function () {
                                if (_this.addedComponents) {
                                    var component;
                                    while (component = _this.addedComponents.pop())
                                        pvMapper.reportsToolbarMenu.remove(component);
                                }
                            }
                        }]
                });
            }
            return Reports;
        })(pvMapper.Module);
        Tools.Reports = Reports;

        //Instanciate the tool
        var toolInstance = new Reports();
        pvMapper.onReady(toolInstance.activate);
    })(pvMapper.Tools || (pvMapper.Tools = {}));
    var Tools = pvMapper.Tools;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=Reports.js.map
