Ext.view.ViewState = {
  NORMAL: 'ViewState_Normal',
  MINIMIZED: 'ViewState_Minimized',
  MAXIMIZED: 'ViewState_Maximized',
  HIDDEN: 'ViewState_Hidden',
  COLLAPSED: 'ViewState_Collapsed'
}

Ext.define( 'MainApp.view.Window', {
  extend: 'Ext.window.Window',
  //uses: 'MainApp.view.Viewport',
  alias: "pvWindow",
  layout: 'fit',
  type: 'Window',
  title: null,
  taskBar: null,
  //constrain: true,
  renderTo: 'maincontent-body',
  autoShow: false,
  collapseMode: 'header',
  collapsible: true,
  bodyStyle: 'opacity: 1;',
  titleCollapse: true,
  taskBar: null,
  viewState: Ext.view.ViewState.NORMAL,
  collapse: function () {
    this.callParent( arguments );
    var w = this.getHeader().titleCmp.textEl.getWidth();
    w = w < 120 ? 120 : w;
    this.setWidth( w );
    this.viewState = Ext.view.ViewState.COLLAPSED;
  },
  expand: function () {
    this.callParent( arguments );
    this.viewState = Ext.view.ViewState.NORMAL;
  },
  listeners: {
    beforeshow: function ( win, op ) {
      var taskBar = Ext.getCmp( 'maintaskbar' );
      if ( taskBar )
        taskBar.addButton( win );
      return true;
    },
    beforedestroy: function ( win, op ) {
      var taskBar = Ext.getCmp( 'maintaskbar' );
      if ( taskBar )
        taskBar.removeButton( win );
      return true;
    }
  }
} );
