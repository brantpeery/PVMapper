Ext.require('MainApp.view.RatingTool');

Ext.define('MainApp.view.RatingView', {
  extend: 'MainApp.view.Window',
  title: 'Rating',
  layout: "fit",
  //modal: true,
  closeAction: 'destroy',
  constrainHeader: true,
  minimizable: false,
  collapsible: false,
  modal: true,
  buttons: [{
    xtype: 'button',
    text: 'OK',
    handler: function () {
      this.up('window').fireEvent('onOk');
    }
  },
  {
    xtype: 'button',
    text: 'Cancel',
    handler: function () {
      this.up('window').fireEvent('onCancel');
    }
  }],
  initComponent: function () {
    this.addEvents({
      "onCancel": true,
      "onOk": true
    });
    this.callParent(arguments);
  }
});

pvMapper.showRatingWindow = function (ratables, onAccepted, title) {
  var store = new Ext.grid.property.Store(null, ratables);
  store.autoLoad = true;
  store.autoSync = true;

  var window = Ext.create('MainApp.view.RatingView', {
    title: title || "Category Ratings",
    items: [
        Ext.create('MainApp.view.RatingTool', {
          store: store
        })
    ],
    height: Math.min(500, (Ext.getBody().getViewSize().height - 160)), // limit initial height to window height
    listeners: {
      onCancel: function () {
        window.close();
      },
      onOK: function (){
        onAccepted();
        window.close();
      }
    }
  });

  window.show();
};


var ratingPanel = function () {
  return Ext.create('MainApp.view.RatingTool', {
    store: ratingStore(),
  });
  //return Ext.create('MainApp.view.Window', {
  //    title: "Category Ratings",
  //    layout: "fit",
  //    //modal: true,
  //    closeAction: 'destroy',
  //    constrain: true,

  //    items: [
  //        Ext.create('MainApp.view.RatingTool', {
  //            store: ratingStore(),
  //        })
  //    ],
  //    listeners: {
  //        beforeclose: onClose
  //    },

  //});
};
