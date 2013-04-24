/*
 * Start FIX: Summary + Grouping. Without this fix there would be a summary row under each group
 * http://www.sencha.com/forum/showthread.php?135442-Ext.grid.feature.Summary-amp-amp-Ext.grid.feature.Grouping
 */
Ext.override(Ext.grid.feature.Summary, {
    closeRows: function () {
        return '</tpl>{[this.recursiveCall ? "" : this.printSummaryRow()]}';
    }
});
Ext.override(Ext.XTemplate, {
    recurse: function (values, reference) {
        this.recursiveCall = true;
        var returnValue = this.apply(reference ? values[reference] : values);
        this.recursiveCall = false;
        return returnValue;
    }
});
/*
 * End FIX: Summary + Grouping. Without this fix there would be a summary row under each group
 * http://www.sencha.com/forum/showthread.php?135442-Ext.grid.feature.Summary-amp-amp-Ext.grid.feature.Grouping
 */

var toolModel = Ext.define('Tools', {
    extend: 'Ext.data.Model',
    xtype: 'Tools',
    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'category',
        type: 'string'
    }, {
        name: 'id',
        type: 'int'
    }, {
        name: 'weight',
        type: 'number'
    }, {
        name: 'utility',
        mapping: 'scoreUtility',
        type: 'object'
    },{
      name: 'utilityFnName',
      convert: function (value, record) {
        var fnName = record.get('utility').functionName;
        return fnName;
      }
    }, {
        name: 'sites',
        mapping: 'scores',
        type: 'object'
    }],


    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'tools',
            idProperty: 'id'
        }
    }
});


var toolsStore = Ext.create('Ext.data.Store', {
    autoSync: true,
    autoLoad: true,
    model: 'Tools',
    data: pvMapper.mainScoreboard.getTableData(),
    groupField: 'category',
    groupDir: 'ASC'
});

var siteColumns = []; //Empty array for use below as a reference to what will be in the array eventually

//var sitesColumn = Ext.create('Ext.grid.column.Column', {
//    text: null,
//    sealed: false,
//    columns: siteColumns
//});


var scoreboardColumns = [{
    text: 'Tool Name',
    minWidth: 150,
    //maxWidth: 100,
    flex: 1, //Will be resized
    //shrinkWrap: 1,
    sortable: true,
    hideable: false,
    dataIndex: 'name',
    //editor: 'textfield', <-- don't edit this field - that would be silly
    summaryType: function (records) {
        //Note: this fails when we allow grouping by arbitrary fields (and it fails in mysterious ways)
        return records[0].get('category') + " subtotal:";
    },
    //}, {
    //    text: 'Category',
    //    width: 90,
    //    //flex: 0, //Will not be resized
    //    //shrinkWrap: 1,
    //    sortable: true,
    //    hideable: true,
    //    hidden: true,
    //    dataIndex: 'category',
    //    editor: 'textfield',
}, {
    text: 'Weight',
    width: 45,
    //flex: 0, //Will not be resized
    //shrinkWrap: 1,
    sortable: true,
    hideable: false,
    dataIndex: 'weight',
    //editor: 'numberfield', //TODO: this editing this value causes the scoreboard to throw exceptions on every subsequent refresh - fix that someday
}, {
    xtype: 'actioncolumn',
    text: 'Utility',
    tooltip: 'Edit the Utility Scoring Function for this Tool',
    width: 40,
    sortable: false,
    hideable: false,
    renderer: function (value, metadata, record) {
      var fn = record.get('utilityFnName');
      this.items[0].icon = pvMapper.UtilityFunctions[fn].iconURL;
    },
    items: [{
        icon: 'http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/gear_icon.jpg',
        height: 24,
        width: 24,
        handler: function (view, rowIndex, colIndex, item, e, record) {
            var dynamicPanel = Ext.create('Ext.panel.Panel', {
                items: [{
                    xtype: 'text',
                    text: 'configure me',
                    width: 100,
                    shrinkWrap: 3,
                    sortable: true,
                    hideable: false,
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    }
                }]
            });
            var uf = record.get('utility');
            var utilityFn = pvMapper.UtilityFunctions[uf.functionName];
           
            var windows = Ext.create('MainApp.view.UtilityFunctionEdit', {
              items: dynamicPanel,
              icon: utilityFn.iconURL,
              minimizable: false,
              collapsible: false,
                buttons: [{
                    xtype: 'button',
                    text: 'OK',
                    handler: function () {
                        //send the object (reference) to the function so it can change it

                        //Call the setupwindow function with the context of the function it is setting up
                        if (utilityFn.windowOk != undefined)
                            utilityFn.windowOk.apply(utilityFn, [dynamicPanel, uf.functionArgs]);
                        //Note: I really don't get this... it seems overly complicated.

                        record.store.update();
                        record.raw.updateScores();
                        windows.close();
                    }
                }, {
                    xtype: 'button',
                    text: 'Cancel',
                    handler: function () {
                      windows.close();
                    }
                }],
                listeners: {
                    beforerender: function () {
                        utilityFn.windowSetup.apply(utilityFn, [dynamicPanel, uf.functionArgs, utilityFn.fn, utilityFn.xBounds]);
                        //TODO: can't we just pass uf here, in place of all this other crap?
                        dynamicPanel.doLayout();
                    }
                }

            }).show();
        }
    }]
}, {
    text: undefined,
    sealed: true,
    menuText: "Sites",
    //defaults: {
    //    flex: 1, //Will stretch with the size of the window
    //    width: 100
    //},
    columns: siteColumns
}];


//Use this store to maintain the panel list of sites
toolsStore.on({
    load: function () {
        siteColumns.length = 0; //Empty the array
        var rec0 = this.first();
        rec0.get('sites').forEach(function (scoreLine, idx) {
            siteColumns.push({
                text: scoreLine.site.name,
                sealed: true,
                //flex: 1, //Will stretch with the size of the window
                //width: 100,
                defaults: {
                    //flex: 1, //Will stretch with the size of the window
                    //width: 50,
                    sortable: true
                },
                columns: [{
                    text: "Value",
                    dataIndex: "sites",
                    //flex: 1, //Will stretch with the size of the window
                    //minWidth: 50,
                    width: 120,
                    renderer: function (value, metaData) {
                        if (value.length <= idx) return '<i>Calculating...</i>'; //Avoid the index out of range error

                        //if (typeof value[idx].utility !== "undefined" && !isNaN(value[idx].utility)) {
                        //    metaData.style = "background-color:" + getColor(value[idx].utility);
                        //}

                        if (value[idx].popupMessage && value[idx].popupMessage.trim().length > 0) {
                            metaData.tdAttr = 'data-qtip="' + value[idx].popupMessage + '"';
                        }

                        if (typeof value[idx].value !== "undefined" && !isNaN(value[idx].value)) {
                            return value[idx].toString();
                        } else {
                            // italicise on error
                            return '<i>' + value[idx].toString() + '</i>';
                        }
                    },
                    draggable: false
                }, {
                    text: "Score",
                    dataIndex: "sites",
                    //flex: 1, //Will stretch with the size of the window
                    //maxWidth: 500,
                    width: 40,
                    renderer: function (value, metaData) {
                        if (value.length <= idx) return '...'; //Avoid the index out of range error
                        if (isNaN(value[idx].utility)) return '...';

                        var val = (value[idx] && value[idx].utility) ? value[idx].utility : 0;
                        var c = getColor(val);
                        metaData.style = "text-align: center; border-radius: 5px; background-color:" + c;

                        return value[idx].utility.toFixed(0);
                    },
                    draggable: false,

                    summaryType: function (records) {
                        var total = 0;
                        var count = 0;
                        records.forEach(function (record) {
                            var scoreLine = record.raw;
                            if (scoreLine.scores[idx] && !isNaN(scoreLine.scores[idx].utility)) {
                                total += scoreLine.scores[idx].utility * scoreLine.weight;
                                count += scoreLine.weight;
                            }
                        });

                        var average = total / count;

                        // post the average score to the feature, so that it can render correctly on the map
                        //TODO: is this really the best place to be mucking about with the feature attributes?
                        if (records && records.length > 0 && records[0].raw &&
                            records[0].raw.scores && records[0].raw.scores.length > idx &&
                            records[0].raw.scores[idx].site && records[0].raw.scores[idx].site.feature) {
                            // test if the feature's average score value has changed
                            var feature = records[0].raw.scores[idx].site.feature;
                            if (feature.attributes['overallScore'] !== average) {
                                feature.attributes.overallScore = average;
                                // set the score's color as an attribute on the feature (note - this is at least partly a hack...)
                                feature.attributes.fillColor = (!isNaN(average)) ? getColor(average) : "";
                                // redraw the feature
                                feature.layer.drawFeature(feature);
                            }
                        }

                        return average;
                    },
                    summaryRenderer: function (value) {
                        if (typeof value === "number" && !isNaN(value)) {
                            var c = getColor(value);
                            return '<span style="border-radius: 3px; background-color:' + c + '">&nbsp' + value.toFixed(0) + '&nbsp</span>'; //font-weight: bold; 
                        }
                    },
                }]
            });
        });

        //Now update the sites section of the grid
        scoreboardGrid.reconfigure(this, scoreboardColumns);
    }

});


//----------------The grid and window-----------------
Ext.define('Ext.grid.ScoreboardGrid', {
    //xtype:'Scoreboard',
    extend: 'Ext.grid.Panel',
    store: toolsStore,
    //forceFit: true,
    //width: '100%',
    //height:600,
    title: "Tools List",
    selType: 'rowmodel', //Note: use 'cellmodel' once we have cell editing worked out
    columns: scoreboardColumns,
    plugins: [
    Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    })],
    features: [
    {
            //Note: this feature provides per-group summary values, rather than repeating the global summary for each group.
            groupHeaderTpl: '{name} ({rows.length} {[values.rows.length != 1 ? "Tools" : "Tool"]})',
            ftype: 'groupingsummary',
            enableGroupingMenu: false,
            //hideGroupedHeader: true, <-- this is handy, if we ever allow grouping by arbitrary fields
        },
        //{ ftype: 'grouping' },
        //{ ftype: 'summary' },
    ]
});

var scoreboardGrid = Ext.create('Ext.grid.ScoreboardGrid', {
});

Ext.define('MainApp.view.ScoreboardWindow', {
    extend: "MainApp.view.Window",
    title: 'Main Scoreboard',
    width: 800,
    height: 520,
    //cls: "propertyBoard", <-- this looked hokey, and conflicted with ext js's default styling.
    closeAction: 'hide',
    items: scoreboardGrid
});


//toolsStore.load(pvMapper.mainScoreboard.getTableData()); //Load the data to the panel

function getColor(score) {
    var min = Math.min;
    var max = Math.max;
    var round = Math.round;

    var startColor = {
        red: 255,
        green: 0,
        blue: 0
    };
    var midColor = {
        red: 255,
        green: 255,
        blue: 100
    };
    var endColor = {
        red: 173,
        green: 255,
        blue: 47
    };

    var scale = 0;
    score = round(min(100, max(0, score)));
    if (score > 50) {
        startColor = midColor;
        scale = score / 50 - 1;
    } else {
        endColor = midColor;
        scale = score / 50;
    }

    var r = startColor['red'] + scale * (endColor['red'] - startColor['red']);
    var b = startColor['blue'] + scale * (endColor['blue'] - startColor['blue']);
    var g = startColor['green'] + scale * (endColor['green'] - startColor['green']);
    r = round(min(255, max(0, r)));
    b = round(min(255, max(0, b)));
    g = round(min(255, max(0, g)));

    return 'rgb(' + r + ',' + g + ',' + b + ')';

}