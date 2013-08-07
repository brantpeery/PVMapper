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
            var win = Ext.WindowManager.getActive();
            if (win) {
                win.close();
            }
        }
    }],

});

pvMapper.showRatingWindow = function (ratables, onClose, title) {
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
        listeners: {
            beforeclose: onClose
        },
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
