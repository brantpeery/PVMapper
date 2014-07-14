Ext.define('MainApp.view.UtilityFunctionEdit', {
    extend: "MainApp.view.Window",
    title: 'Tool Scoring Editor',
    modal:true,
    layout: 'auto',
    //width: 400,
    //height: 450,
    shrinkWrap: 3,
    maxHeight: 600,
    maxWidth: 800,
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
    }],
    constrain: true
});
