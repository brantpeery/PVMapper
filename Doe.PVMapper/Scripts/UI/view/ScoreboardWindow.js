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
    model: 'Tools',
    data: pvMapper.mainScoreboard.getTableData(),
    groupField: 'category',
    groupDir: 'ASC'
});

var siteColumns = []; //Empty array for use below as a reference to what will be in the array eventually

var sitesColumn = Ext.create('Ext.grid.column.Column', {
    text: null,
    sealed: false,
    columns: siteColumns
});


var scoreboardColumns = [{
    text: 'Tool Name',
    width: 100,
    shrinkWrap: 1,
    sortable: true,
    hideable: false,
    dataIndex: 'name',
    editor: 'textfield'

}, {
    text: 'Weight',
    width: 45,
    shrinkWrap: 1,
    sortable: true,
    hideable: false,
    dataIndex: 'weight',
    editor: 'textfield'
}, {
    text: 'Utility',
    width: 24,
    shrinkWrap: 0,
    sortable: false,
    hideable: true,
    dataIndex: '',
    editor: ''
},

{
    text: undefined,
    sealed: true,
    menuText: "Sites",
    defaults: {
        width: 100
    },
    columns: siteColumns
}];


//Use this store to maintain the panel list of sites
toolsStore.on({
    load: function () {
        siteColumns.length = 0; //Empty the array
        var rec0 = this.first();
        rec0.get('sites').forEach(function (site, idx) {
            siteColumns.push({
                text: site['name'],
                sealed: true,
                width: 100,
                defaults: {
                    width: 50,
                    sortable: true
                },
                columns: [{
                    text: "Value",
                    dataIndex: "sites",
                    renderer: function (value, metaData) {
                        if (value.length <= idx) return '...'; //Avoid the index out of range error
                        var val = (value[idx] && value[idx].score) ? value[idx].score : 0;
                        var c = getColor(val);
                        metaData.style = "background-color:" + c;
                        return value[idx].value;
                    },
                    draggable: false
                }, {
                    text: "Score",
                    dataIndex: "sites",
                    renderer: function (value, metaData) {
                        if (value.length <= idx) return '...'; //Avoid the index out of range error
                        var val = (value[idx] && value[idx].score) ? value[idx].score : 0;
                        var c = getColor(val);
                        metaData.style = "background-color:" + c;
                        return value[idx].score;
                    },
                    draggable: false,

                    summaryType: 'sum',
                    summaryRenderer: function (value, metaData) {
                        if (value.length <= idx) return '...'; //Avoid the index out of range error
                        var t = 0;
                        var count = 0;
                        this.grid.getStore().each(function (tool, index) {
                            var val = (value[idx] && value[idx].score) ? value[idx].score : 0;
                            t += val;
                            count++;
                        });

                        t = Math.round(t / count);
                        var c = getColor(t);
                        metaData.style = "background-color:" + c;
                        return '<div style="background-color:' + c + '">' + t + '</div>';

                    },
                }]
            });
        });

        //Now update the sites section of the grid
        scoreboardPanel.reconfigure(this, scoreboardColumns);
    }

});


//----------------The grid and window-----------------
Ext.define('Ext.grid.ScoreboardGrid', {
    //xtype:'Scoreboard',
    extend: 'Ext.grid.Panel',
    store: toolsStore,
    width: '100%',
    //height:600,
    title: "Tools List",
    selType: 'cellmodel',
    columns: scoreboardColumns,
    plugins: [
    Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    })],
    features: [
    //{ftype: 'grouping'},
    {
        ftype: 'summary'
    }]
});

var scoreboardPanel = Ext.create('Ext.grid.ScoreboardGrid', {
});

Ext.define('MainApp.view.ScoreboardWindow', {
    extend: "MainApp.view.Window",
    title: 'Main Scoreboard',
    width: 800,
    height: 200,
    cls: "propertyBoard",
    closeAction: 'hide',
    items: scoreboardPanel
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