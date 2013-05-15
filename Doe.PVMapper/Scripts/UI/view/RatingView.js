Ext.require('Scripts.UI.view.RatingTool');

var ratingStore = function () {
  return Ext.create('Ext.data.Store', {
    model: 'RatingModel',
    data: ratingData = {
      objects: [{
        name: 'Foo',
        value: 5
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
        value: 5
      }, {
        name: 'Human Brain',
        value: 3
      }]
    },
    autoLoad: true,
    autoSync: true,
    proxy: {
      type: 'memory',
      reader: {
        type: 'json',
        root: 'objects'
      },
    }
  })
};
var optionStore = function () {
  return Ext.create('Ext.data.Store', {
    model: 'RatingOptionModel',
    data: {
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
    },
    autoLoad: true,
    autoSynch: true,
    proxy: {
      type: 'memory',
      reader: {
        type: 'json',
        root: 'options'
      }
    }
  })
};

var ratingPanel = function () {
  return Ext.create('MainApp.view.RatingTool', {
   store: ratingStore(),
   options: optionStore()
  })
};


Ext.define('MainApp.view.RatingView', {
  extend: 'MainApp.view.Window',
  title: 'Rating',
  width: 400,
  modal: true,
  constraint: true,
  closeAction: 'destroy',
  layout:'fit',
  initComponent: function() {
    Ext.apply(this, {
      items: [Ext.create('MainApp.view.RatingTool', {
        store: ratingStore(),
        options: optionStore()
      })
      ]
    });
    this.callParent(arguments);
  }
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
