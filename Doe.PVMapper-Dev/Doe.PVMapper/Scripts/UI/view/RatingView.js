Ext.require('MainApp.view.RatingTool');

Ext.define('MainApp.view.RatingView', {
  extend: 'MainApp.view.Window',
  title: 'Rating',
  //layout: "fit",
  //modal: true,
  closeAction: 'destroy',
  constrainHeader: true,
  minimizable: false,
  collapsible: false,
  modal: true,
  buttons: [{
    xtype: 'button',
    text: 'Close',
    handler: function () {
      this.up('window').close();
    }
  }],
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
    height: Math.min(540, (Ext.getBody().getViewSize().height - 160)), // limit initial height to window height
    listeners: {
      close: function (){
        onAccepted();
      }
    }
  });

  window.show();
};

