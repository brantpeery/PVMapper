/// <reference path="../pvMapper/TSMapper/Data/ScoreboardProcessor.ts" />
/// <reference path="../pvMapper/TSMapper/pvMapper.ts" />
/// <reference path="../pvMapper/TSMapper/Tools.ts" />
/// <reference path="../pvMapper/TSMapper/Options.d.ts" />
/// <reference path="../pvMapper/TSMapper/Module.ts" />
var pvMapper;
(function (pvMapper) {
    (function (Tools) {
        var Reports = (function () {
            function Reports() {
                //Create a module to add to the system
                var myModule = new pvMapper.Module({
                    id: "inl.reports",
                    author: "Brant Peery, INL",
                    version: "0.1 ts",
                    activate: function () {
                    },
                    deactivate: function () {
                    },
                    destroy: null,
                    init: null,
                    infoTools: [
                        {
                            activate: function () {
                                pvMapper.mapToolbar.add(Ext.create('Ext.button.Split', {
                                    text: 'Reports',
                                    menu: Ext.create('Ext.menu.Menu', {
                                        items: [
                                            {
                                                text: 'Summary Report',
                                                handler: function () {
                                                    //Catch the event when the SumaryReport window is ready and send it the data.
                                                    //This only works on same domain JS and window.
                                                    window['SummaryReportReady'] = function () {
                                                        var url = window.location.href;
                                                        var arr = url.split("/");
                                                        var origin = arr[0] + "//" + arr[2];
                                                        win.postMessage(pvMapper.Data.ScoreboardProcessor.getCleanObjectTransposed(pvMapper.mainScoreboard), origin);
                                                    };
                                                    var win = window.open('/Report/Summary', 'Report');
                                                }
                                            }
                                        ]
                                    })
                                }));
                            },
                            init: function () {
                            },
                            destroy: function () {
                            },
                            deactivate: function () {
                            }
                        }
                    ]
                });
            }
            return Reports;
        })();
        Tools.Reports = Reports;

        //Instanciate the tool
        var toolInstance = new Reports();
    })(pvMapper.Tools || (pvMapper.Tools = {}));
    var Tools = pvMapper.Tools;
})(pvMapper || (pvMapper = {}));
