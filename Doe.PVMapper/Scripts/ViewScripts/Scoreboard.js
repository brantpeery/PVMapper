pvMapper.onReady(function () {

    // Define Company entity
    // Null out built in convert functions for performance *because the raw data is known to be valid*
    // Specifying defaultValue as undefined will also save code. *As long as there will always be values in the data, or the app tolerates undefined field values*
    Ext.define('Company', {
        extend: 'Ext.data.Model',
        fields: [
           { name: 'company' },
           { name: 'price', type: 'float', convert: null, defaultValue: undefined },
           { name: 'change', type: 'float', convert: null, defaultValue: undefined },
        ],
        idProperty: 'company'
    });

    // sample static data for the store
    var myData = [
        ['3m Co', 71.72, 0.02, 0.03, '9/1 12:00am'],
        ['Alcoa Inc', 29.01, 0.42, 1.47, '9/1 12:00am'],
        ['Altria Group Inc', 83.81, 0.28, 0.34, '9/1 12:00am'],
        ['American Express Company', 52.55, 0.01, 0.02, '9/1 12:00am'],
    ];

    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    function change(val) {
        if (val > 0) {
            return '<span style="color:green;">' + val + '</span>';
        } else if (val < 0) {
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

    // create the data store
    var store = Ext.create('Ext.data.ArrayStore', {
        model: 'Company',
        data: myData
    });

    // create the Grid
    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        stateful: true,
        multiSelect: true,
        stateId: 'stateGrid',
        columns: [
            {
                text: 'Tool',
                flex: 1,
                sortable: true,
                dataIndex: 'company'
            },
            {
                text: 'Site 1',
                width: 75,
                sortable: true,
                dataIndex: 'price'
            },
            {
                text: 'Site 2',
                width: 75,
                sortable: true,
                renderer: change,
                dataIndex: 'price'
            },
            {
                text: 'Site 3',
                width: 75,
                sortable: true,
                renderer: change,
                dataIndex: 'price'
            },
            {
                text: 'Site 4',
                width: 75,
                sortable: true,
                renderer: change,
                dataIndex: 'change'
            },
                       {
                menuDisabled: true,
                sortable: false,
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                   // icon: '../shared/icons/fam/icon.gif',  // Use a URL in the icon config
                    tooltip: 'Sell stock',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        alert("Running " + rec.get('name'));
                    }
                }]
            }
        ],
       
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true
        }
    });

    pvMapper.tabs.add(
    {
        // we use the tabs.items property to get the length of current items/tabs
        title: 'Scoreboard',
        layout: 'fit',
        items:[grid],
        listeners: {
            activate: function (tab) {
               //load more data?
            }
        }
    });
});