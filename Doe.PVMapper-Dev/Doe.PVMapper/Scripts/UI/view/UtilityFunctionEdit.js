Ext.define('MainApp.view.UtilityFunctionEdit', {
    extend: "MainApp.view.Window",
    title: 'Utiltiy Function Editor',
    modal:true,
    layout: 'fit',
    width: 300,
    height: 200,
    buttons: [{
        buttons: [{
            xtype: 'button',
            text: 'OK',
            handler: function () { }
        }, {
            xtype: 'button',
            text: 'Cancel',
            handler: function () { }
        }]
    }]
});
