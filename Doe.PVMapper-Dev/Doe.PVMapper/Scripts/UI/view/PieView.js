
//#region PieWindow
Ext.define('MainApp.view.PieWindow', {
  extend: 'MainApp.view.Window',
  dataStore: null,
  dataField: 'Data',
  dataName: 'Category',
  fillColor: 'Color',
  minWidth: 200,
  minHeigh: 0,
  title: 'Category',
  height: 500,
  width: 550,
  floating: true,
  closeAction: 'close',
  constrainHeader: true,
  minimizable: false,
  collapsible: false,
  modal: true,
  renderTo: 'maincontent-body',
  initComponent: function () {
    var me = this;
    me.items = [
      Ext.create('Ext.form.Panel', {
        //id: 'pie-view-panel-id',
        width: 550,
        height: 400,
        bodyStyle: 'padding: 5px 5px 0',
        renderTo: Ext.getBody(),
        defaults: {
          anchor: '100%'
        },
        items: [{
          xtype: 'chart',
          animate: true,
          width: 550,
          height: 400,
          theme: 'Base:gradients',

          insetPadding: 5,
          legend: {
            position: 'right'
          },
          shadow: true,
          store: pieStore,
          series: [{
            type: 'pie',
            angleField: me.dataField,
            showInLegend: true,
            highlight: {
              segment: {
                margin: 20
              }
            },
            tips: {
              trackMouse: true,
              minWidth: 100,
              maxWidth: 550,
              height: 40,
              renderer: function (storeItem, item) {
                //calculate and display percentage on hover
                var total = 0;
                pieStore.each(function (rec) {
                  total += rec.get(me.dataField);
                });
                this.setTitle(storeItem.get(me.dataName) + ': ' + storeItem.get(me.dataField) + ' (' + Math.round(storeItem.get(me.dataField) / total * 100) + '%)');
              }
            },

            //pull the color to fill the pie from the datastore.
            renderer: function (sprite, record, attr, index, store) {
              return Ext.apply(attr, { fill: record.get(me.fillColor) });
            },
            label: {
              field: me.dataName,
              display: 'rotate',
              contrast: true,
              font: '18px Arial'
            },
            listeners: {
              itemmousedown: function (options, obj) {
                //alert(options.storeItem.data[me.dataName] + ' &' + options.storeItem.data[me.dataField]);
              }
            }
          }],
          interactions: ['rotate']
        }],
      })
    ],
    this.callParent(arguments);
  },
  showing: function (aTitle) {
    pieStore.data.clear();
    this.setTitle(aTitle);
    return this;
  }

});
//#endregion


//#region PieStore testing.
Ext.define('MainApp.data.PieModel', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'Category', type: 'string' },
    { name: 'Data', type: 'int' },
    { name: 'Color', type: 'int' }
  ]
});

var pieStore = Ext.create('Ext.data.Store', {
  model: 'MainApp.data.PieModel',
  data: [
  ]
});

//( function ( pvM ) {
//  pvM.onReady(function() {
//    pvMapper.pieWin = Ext.create('MainApp.view.PieWindow', {
//      dataStore: pieStore,
//      dataField: 'Data',
//      dataName: 'Category',
//      fillColor: 'Color'
//    });
//  } );

//} )( pvMapper );
//#endregion



//pvMapper.pieWin = Ext.create( 'pvMapper.PieWindow' );

