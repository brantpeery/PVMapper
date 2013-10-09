//pvMapper.onReady(function () {
//  var grid;

//  Ext.define('EmptyModel', {
//    extend: 'Ext.data.Model',
//    fields: [
//       // Null out built in convert functions for performance *because the raw data is known to be valid*
//       // Specifying defaultValue as undefined will also save code. *As long as there will always be values in the data, or the app tolerates undefined field values*
//       //{ name: 'company', type: 'string' },
//       //{ name: 'price', type: 'float', convert: null, defaultValue: undefined },
//       //{ name: 'change', type: 'float', convert: null, defaultValue: undefined },
//    ],
//  });

   
//  //    {
//  //        menuDisabled: true,
//  //        sortable: false,
//  //        xtype: 'actioncolumn',
//  //        width: 50,
//  //        items: [{
//  //            // icon: '../shared/icons/fam/icon.gif',  // Use a URL in the icon config
//  //            tooltip: 'Sell stock',
//  //            handler: function (grid, rowIndex, colIndex) {
//  //                var rec = store.getAt(rowIndex);
//  //                alert("Running " + rec.get('name'));
//  //            }
//  //        }]
//  //    }
//  //],

//  /**
//   * Custom function used for column renderer
//   * @param {Object} val
//   */
//  //renderer: change
//  //on the column that should use this.
//  function change(val) {
//    if (val > 0) {
//      return '<span style="color:green;">' + val + '</span>';
//    } else if (val < 0) {
//      return '<span style="color:red;">' + val + '</span>';
//    }
//    return val;
//  }

//  // create the data store
//  var store = Ext.create('Ext.data.ArrayStore', {
//    model: 'EmptyModel',
//    proxy: {
//      type: 'ajax',
//      url: '/api/Scoreboard',
//      //url: 'json.txt',
//      reader: 'json'
//    },
//    autoLoad: true,
//    listeners: {
//      'metachange': function (store, meta) {
//        grid.reconfigure(store, meta.columns);
//      }
//    }

//  });

//  // create the Grid
//  grid = Ext.create('Ext.grid.Panel', {
//    id: 'scoreboard-grid-id',
//    store: store,
//    //stateful: true,
//    multiSelect: true,
//    //stateId: 'stateGrid',
//    columns: [{
//      header: 'Loading ...'
//    }],     
//    viewConfig: {
//      stripeRows: true,
//      emptyText: 'There is no data to display. Activate tools or add sites to get started.'
//      // enableTextSelection: true
//    }
//  });


//  pvMapper.tabs.add(
//  {
//    // we use the tabs.items property to get the length of current items/tabs
//    title: 'Site Properties',
//    layout: 'fit',
//    items: [grid],
//    listeners: {
//      activate: function (tab) {
//        //load more data?
//      }
//    }
//  });



//});