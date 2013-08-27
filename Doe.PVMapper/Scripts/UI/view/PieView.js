
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
  internalPanel: null,
  renderTo: 'maincontent-body',
  initComponent: function () {
    var me = this;
    me.internalPanel = this;
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
              minWidth: 150,
              //maxWidth: 650,
              //height: 50,
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
              font: '14px Arial'
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
  plugins: [{
    ptype: "headericons",
    index: 1,
    headerButtons: [
        {
          xtype: 'button',
          iconCls: 'x-ux-grid-printer',
          width: 24,
          height: 15,
          //scope: this,
          handler: function () {
            //var win = Ext.WindowManager.getActive();
            //if (win) {
            //  win.toggleMaximize();
            //}
            var style=''; var link='';
            var printContent = document.getElementById(internalPanel.id+"-body"); //TODO: change to get the ID, rather than use 'magic' ID
            var printWindow = window.open('', '', ''); // 'left=10, width=800, height=520');

            var html = printContent.outerHTML; //TODO: must change to innerHTML ???
            $("link").each(function () {
              link += $(this)[0].outerHTML;
            });
            $("style").each(function () {
              style += $(this)[0].outerHTML;
            });

            // var script = '<script> window.onmouseover = function(){window.close();}</script>';
            printWindow.document.write('<!DOCTYPE html><html lang="en"><head><title>PV Mapper: ' + internalPanel.title + '</title>' + link + style + ' </head><body>' + html + '</body>');
            $('div',printWindow.document).each(function () {
              if (($(this).css('overflow') == 'hidden') || ($(this).css('overflow') == 'auto')) {
                $(this).css('overflow', 'visible');
                  
              }
            });
            printWindow.document.close();
            printWindow.print();
          }
        }
    ]
  }],
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

