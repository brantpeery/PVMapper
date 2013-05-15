
Ext.define('RatingModel', {
  extend: 'Ext.data.Model',
  fields: [{
    name: 'name'
  }, {
    name: 'value',
    type: 'object'
  }]
});


Ext.define('RatingOptionModel', {
  extend: 'Ext.data.Model',
  fields: [{
    name: 'name',
  }, {
    name: 'value',
    type: 'object'
  }]
});


var handleItems = function (grid, rowIndex, colIndex, item, e, record) {
  record.set('value', item.index);
  record.raw.value = item.index;
}

Ext.define('MainApp.view.RatingTool', {
  extend: 'Ext.grid.Panel',
  columnLines: true,
  width: 600,
  height: 300,
  title: 'Rate',
  renderTo: Ext.getBody(),
  onURL: 'http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/star_icon.jpg',
  offURL: 'http://www.iconshock.com/img_jpg/VECTORNIGHT/general/jpg/16/star_icon.jpg',
  getData: function () {
    return this.store.proxy.data;
  },

  /*
  NOTE:  Any custom class that to be create/destroy and recreate must be wrapped inside 'initComponent' property.  -- leng.
  */
  initComponent: function() {
    Ext.apply(this, {
      listeners: {
        beforerender: function (ts, eOpts) {
          var me = this;
          var aOption = {};
          Ext.merge(aOption, me.options);
          me.options = aOption;

          me.columns[1].items = [];
          var m = me.options.data.getCount();

          for (i = 0; i < m; i++) {
            me.columns[1].items.push({
              index: i + 1,
              tooltip: aOption.data.items[i].raw.name,
              handler: handleItems,
              icon: me.onURL
            });
          }
          return true;
        },
        beforedestroy: function (ts, ops) {
          this.options = null;
          return true;
        }
      },
      columns: [{
        // text: "Name",
        width: 150,
        dataIndex: 'name'
      }, {
        xtype: 'actioncolumn',
        //  text: 'Rating',
        width: 150,
        renderer: function (value, metadata, record) {
          var me = this.ownerCt.ownerCt;
          var n = record.get('value');

          var m = me.options.data.getCount();
          m = (m < n) ? n : m;

          for (i = 0; i < n; i++) {
            this.items[i].icon = me.onURL;
          }

          for (i = n; i < m; i++) {
            this.items[i].icon = me.offURL;
          }
        },
        items: []
      }]
    });
    this.callParent(arguments);
  }
});
