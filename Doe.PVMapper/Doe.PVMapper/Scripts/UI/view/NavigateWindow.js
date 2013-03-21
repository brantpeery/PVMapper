Ext.define('MainApp.view.NavigateWindow', {
  extend: 'MainApp.view.Window',
  title: 'Properties',
  height: 400,
  Width: 300,
  x: 10,
  y: 100,
  closeAction: 'hide',
  //renderTo: 'maincontent-body',
  constrainHeader: true,
  initComponent: function () {
    var me = this;
    me.items = [Ext.create('Ext.tree.TreePanel', {
      id: "ToolTree",
      border: false,
      width: 300,
      height: 400,
      store: navMenu,
      rootVisible: true,
      useArrows: true,
      listeners: {
        itemclick: {
          fn: function (view, record, item, index, e) {

          }
        },
        checkchange: {
          fn: function (node, check) {
            if (check) {
              $.getScript(node.raw.url)
                  .done(function (script, textStatus) {
                  })
                  .fail(function (jqxhr, settings, exception) {
                    console.log(exception);
                    pvMapper.displayMessage("Could not load tool.");
                  });
            }

          }
        }
      }
    })],
    //#endregion
    this.callParent(arguments);
  }
});
