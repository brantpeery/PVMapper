Ext.define('MainApp.view.UtilityFunctionEdit', {
    extend: "MainApp.view.Window",
    title: 'Utiltiy Function Editor',
    modal:true,
    layout: '',
    width: 300,
    shrinkWrap: 3,
    overflowY:'auto',
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
