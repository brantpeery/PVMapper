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

Ext.define('MainApp.view.UtilityFunctionEdit', {
    extend: "MainApp.view.Window",
    title: 'Utiltiy Function Editor',
    layout: 'fit',
    width: 300,
    height: 200,
    buttons: [{
        buttons: [{
            xtype: 'button',
            text: 'OK',
            handler: function () { }
        }, {
            xtype: 'button',
            text: 'Cancel',
            handler: function () { }
        }]
    }]

});

var toolsStore = Ext.create('Ext.data.Store', {
    autoSync: false,
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
    editor: 'textfield'

}, {
    text: 'Weight',
    width: 45,
    //flex: 0, //Will not be resized
    //shrinkWrap: 1,
    sortable: true,
    hideable: false,
    dataIndex: 'weight',
    editor: 'textfield'
}, {
    xtype: 'actioncolumn',
    text: 'Utility',
    tooltip: 'Edit the Utility Scoring Function for this Tool',
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
                    shrinkWrap: 1,
                    sortable: true,
                    hideable: false,
                }]
            });
            var windows = Ext.create('MainApp.view.UtilityFunctionEdit', {
                items: dynamicPanel
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
                    width: 45,
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
                        return average;
                    },
                    summaryRenderer: function (value) {
                        if (typeof value === "number") {
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
    selType: 'cellmodel',
    columns: scoreboardColumns,
    plugins: [
    Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    })],
    features: [
        {ftype: 'grouping'},
    {
        ftype: 'summary'
    }]
});

var scoreboardGrid = Ext.create('Ext.grid.ScoreboardGrid', {
});

Ext.define('MainApp.view.ScoreboardWindow', {
    extend: "MainApp.view.Window",
    title: 'Main Scoreboard',
    width: 800,
    height: 400,
    cls: "propertyBoard",
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