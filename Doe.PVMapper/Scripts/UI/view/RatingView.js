
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

var ratingTool;

Ext.define('MainApp.view.RatingTool', {
  extend: 'Ext.grid.Panel',

  store: null,
  options: null,
  onURL: 'http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/star_icon.jpg',
  offURL: 'http://www.iconshock.com/img_jpg/VECTORNIGHT/general/jpg/16/star_icon.jpg',
  listeners: {
    beforerender: function (ts, eOpts) {
      ratingTool = this;
      var aOption = {};
      Ext.merge(aOption, ratingTool.options);
      ratingTool.options = aOption;

      ratingTool.columns[1].items = [];
      var m = ratingTool.options.getCount();

      for (i = 0; i < m; i++) {
        ratingTool.columns[1].items.push({
          index: i + 1,
          tooltip: aOption.data.items[i].raw.name,
          handler: handleItems,
          icon: ratingTool.onURL
        });
      }
      return true;
    }
  },
  getData: function () {
    return ratingTool.store.proxy.data;
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
      var n = record.get('value');

      var m = ratingTool.options.getCount();
      m = (m < n) ? n : m;

      for (i = 0; i < n; i++) {
        this.items[i].icon = ratingTool.onURL;
      }

      for (i = n; i < m; i++) {
        this.items[i].icon = ratingTool.offURL;
      }
    },
    items: []
  }],
  columnLines: true,
  width: 600,
  height: 300,
  title: 'Rate',
  renderTo: Ext.getBody()
});

var ratingData = {
  objects: [{
    name: 'Foo',
    value: 3
  }, {
    name: 'Bar',
    value: 2
  }, {
    name: 'Gut Power',
    value: 4
  }, {
    name: 'Instinct',
    value: 5
  }, {
    name: 'E=MC^2',
    value: 2
  }, {
    name: 'AI',
    value: 2
  }, {
    name: 'Human Brain',
    value: 3
  }]
};

var ratingStore = Ext.create('Ext.data.Store', {
  model: 'RatingModel',
  data: ratingData,
  autoLoad: true,
  autoSync: true,
  proxy: {
    type: 'memory',
    reader: {
      type: 'json',
      root: 'objects'
    },
  }
});

var optionData = {
  options: [{
    name: 'worse',
    value: 0
  }, {
    name: 'bad',
    value: 1
  }, {
    name: 'fair',
    value: 2
  }, {
    name: 'good',
    value: 3
  }, {
    name: 'best',
    value: 4
  }, {
    name: 'wonderful',
    value: 5
  }]
};

var optionStore = Ext.create('Ext.data.Store', {
  model: 'RatingOptionModel',
  data: optionData,
  autoLoad: true,
  autoSynch: true,
  proxy: {
    type: 'memory',
    reader: {
      type: 'json',
      root: 'options'
    }
  }
});

var ratingPanel = Ext.create('MainApp.view.RatingTool', {
  store: ratingStore,
  options: optionStore
});


Ext.define('MainApp.view.RatingView', {
  extend: 'MainApp.view.Window',
  title: 'Rating',
  width: 400,
  modal: true,
  layout: '',
  overflowY: 'auto',
  items: ratingPanel,
  buttons: [{
    xtype: 'button',
    text: 'OK',
    handler: function () { }
  }, {
    xtype: 'button',
    text: 'Cancel',
    handler: function () { }
  }]
  //constraint: true
});

//var ratingView = Ext.create('RatingView').show();



//How to use a rating too:  

/*
The rating tool creates number of stars corresponding to the number items found in the options store.  


var myRating = Ext.create('RatingTool', {
  store: <RatingModel>,  // a store object conforms to the "RatingModel": (name, value)
  options: <RatingOptionModel> // a store object conforms to the  "RatingOptionModel" (name, value)
});

To get the rating results, 

var myRatingResult = myRating.getData();  // return the result array of object (name, value)

*/
