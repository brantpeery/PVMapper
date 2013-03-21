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
    text: 'Utility',
    width: 40,
    //flex: 0, //Will not be resized
    //shrinkWrap: 0,
    sortable: false,
    hideable: true,
    dataIndex: '',
    editor: ''
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
                        if (value.length <= idx) return '<i>No Value</i>'; //Avoid the index out of range error

                        //if (typeof value[idx].utility !== "undefined" && !isNaN(value[idx].utility)) {
                        //    metaData.style = "background-color:" + getColor(value[idx].utility);
                        //}

                        if (value[idx].popupMessage && value[idx].popupMessage.trim().length > 0) {
                            metaData.tdAttr = 'data-qtip="' + value[idx].popupMessage + '"';
                            return value[idx].popupMessage;
                        } else if (typeof value[idx].value !== "undefined" && !isNaN(value[idx].value)) {
                            return value[idx].value;
                        }
                        return '<i>No Value</i>'
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
                        metaData.style = "background-color:" + c;

                        return value[idx].utility.toFixed(0);
                    },
                    draggable: false,

                    summaryType: 'sum',
                    summaryRenderer: function (value, metaData) {
                        if (value.length <= idx) return '...'; //Avoid the index out of range error
                        var t = 0;
                        var count = 0;
                        this.grid.getStore().each(function (tool, index) {
                            var val = (value[idx] && value[idx].utility) ? value[idx].utility : 0;
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
    //{ftype: 'grouping'},
    {
        ftype: 'summary'
    }]
});

//Note: this is a failed attempt to get nested/grouped columns to expand their width dynamically (using forcefit and flex)
//Ext.override(Ext.grid.ColumnLayout, {
//    completeLayout: function (ownerContext) {
//        var me = this,
//            owner = me.owner,
//            state = ownerContext.state,
//            needsInvalidate = false,
//            calculated = me.sizeModels.calculated,
//            configured = me.sizeModels.configured,
//            totalFlex = 0, totalWidth = 0, remainingWidth = 0, colWidth = 0,
//            childItems, len, i, childContext, item,
//            j, sublen, subChild;

//        console.log("Called column layout completeLayout()");

//        me.callParent(arguments);


//        // Get the layout context of the main container
//        // Required two passes. First pass calculates total flexes of all items
//        // and child items. Second pass uses those flex values to calculate fixed
//        // widths for each item, then removes flexing so resizing/hiding works.
//        if (!state.flexesCalculated && owner.forceFit && !owner.isHeader) {
//            console.log("Calculating new flex thingey");
//            childItems = ownerContext.flexedItems = ownerContext.childItems;
//            len = childItems.length;
//            totalWidth = state.contentWidth;
//            if (state.contentWidth < state.boxPlan.availableSpace) {
//                totalWidth += state.boxPlan.availableSpace - 2;
//            }
//            remainingWidth = totalWidth;


//            // Begin first pass
//            ownerContext.flex = 0;
//            for (i = 0; i < len; i++) {
//                childContext = childItems[i];
//                item = childContext.target;
//                // Special code for Ext.ux.RowExpander
//                if (item.isRowExpander) {
//                    item.width = item.flex || item.width;
//                    totalWidth -= item.width;
//                    remainingWidth -= item.width;
//                    item.forceFit = false;
//                    delete item.flex;
//                    continue;
//                }


//                if (item.isGroupHeader) {
//                    totalFlex = 0;
//                    for (j = 0, sublen = childContext.childItems.length; j < sublen; j++) {
//                        subChild = childContext.childItems[j];
//                        subChild.widthModel = calculated;
//                        totalFlex += subChild.flex;
//                    }
//                    item.flex = childContext.flex = childContext.totalFlex = totalFlex;
//                    ownerContext.flex += totalFlex;
//                    needsInvalidate = true;
//                }
//                else {
//                    ownerContext.flex += item.flex;
//                }
//            }


//            ownerContext.totalFlex = ownerContext.flex;


//            // Begin second pass
//            for (i = 0; i < len; i++) {
//                childContext = childItems[i];
//                item = childContext.target;


//                if (item.isRowExpander) {
//                    continue;
//                }

//                // This is probably where the overflow is happening
//                // Might try using Math.round or Math.floor instead of Math.ceil
//                item.width = colWidth = Math.min(Math.ceil((totalWidth / ownerContext.totalFlex) * childContext.flex), remainingWidth);
//                remainingWidth -= colWidth;
//                childContext.sizeModel.width = childContext.widthModel = configured;

                
//                if (item.isGroupHeader) {
//                    for (j = 0, sublen = childContext.childItems.length; j < sublen; j++) {
//                        subChild = childContext.childItems[j];
//                        // Another use of Math.ceil where Math.round might work better
//                        subChild.target.width = Math.ceil((item.width / childContext.flex) * subChild.flex);
//                        subChild.sizeModel.width = subChild.widthModel = configured;
//                        delete subChild.flex;
//                        delete subChild.target.flex;
//                    }
//                    childContext.sizeModel.width = childContext.widthModel = calculated;
//                    delete item.width;
//                    delete item.flex;
//                }

//                item.forceFit = false;
//            }


//            delete owner.flex;
//            owner.forceFit = false;


//            if (needsInvalidate) {
//                console.log("Invalidating context doodle");
//                ownerContext.invalidate({ state: { flexesCalculated: true } });
//            }
//        }
//    }
//});

var scoreboardPanel = Ext.create('Ext.grid.ScoreboardGrid', {
});

Ext.define('MainApp.view.ScoreboardWindow', {
    extend: "MainApp.view.Window",
    title: 'Main Scoreboard',
    width: 800,
    height: 400,
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