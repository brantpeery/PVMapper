pvController = {
  NavigateWindow: null,
  readyEvent: new Event(),
  onReady: function ( fn ) {
    this.readyEvent.addHandler( fn );
    $( 'body' ).on( "pvMapper-ready", fn );
  },
};

Ext.Loader.setConfig( {
  enabled: true,
  disableCaching: false,
  paths: {
    GeoExt: "/Scripts/GeoExt",
    Ext: "http://cdn.sencha.io/ext-4.1.0-gpl/src"
  }
} );

Ext.define( 'pvMapper.Window', {
  extend: 'Ext.window.Window',
  alias: 'pvWindow',
  layout: 'fit',
  title: null,
  //constrain: true,
  //renderTo: 'maincontent-body',
  autoShow: false,
  collapseMode: 'header',
  shadow: false,
  collapsible: true,
  bodyStyle: 'opacity: 1;',
  titleCollapse: true,
  stateWidth: 500,
  collapse: function () {
    this.stateWidth = this.getWidth();
    this.callParent( arguments );
    this.setWidth( this.getHeader().titleCmp.textEl.getWidth() + 40 );
  },
  expand: function () {
    this.setWidth( this.stateWidth );
    this.callParent( arguments );
  }
} );

pvMapper.MainContent = Ext.create( 'Ext.panel.Panel', {
  collapsible: false,
  xtype: 'panel',
  id: 'maincontent',
  region: 'center',
  margins: '0',
  padding: '5,5,5,5',
  contentEl: 'Content',
  items: [],
  weight: .7
} );

Ext.define( 'pvMapper.view.Viewport', {
extend: 'Ext.container.Viewport',
layout: 'fit',
items: [{
  xtype: 'panel',
  layout: 'border',
  items: [{
    region: 'north',
    xtype: 'panel',
    height: 65,
    items: [{
      xtype: 'panel',
      contentEl: 'Header',
    }]
  },
  //{
  //    region: 'west',
  //    title: 'Dock Container',
  //    width: '20%',
  //    minSize: 150
  //},
  {
    collapsible: false,
    xtype: 'panel',
    layout: 'border',
    id: 'main-body',
    region: 'center',
    margins: '0',
    padding: '0',
    items: [{
      collapsible: false,
      xtype: 'toolbar',
      id: 'main-toolbar',
      region: 'north',
      margins: '0',
      padding: '0',
      items: [
           {
             // xtype: 'button', // default for Toolbars
             text: 'Button'
           },
          {
            xtype: 'splitbutton',
            text: 'Split Button'
          }
      ]
    },
    {
      collapsible: false,
      xtype: 'toolbar',
      id: 'main-taskbar',
      region: 'south',
      margins: '0',
      padding: '0',
      items: [
           {
             // xtype: 'button', // default for Toolbars
             text: 'Button'
           },
          {
            xtype: 'splitbutton',
            text: 'Split Button'
          }
      ]
    },pvMapper.MainContent]
  }],
}]
} );

var app = Ext.application( {
  name: 'pvMapper',
  launch: function () {
    console.log( 'Application launched.' );
    
    pvMapper.mainToolbar = Ext.create( 'pvMapper.Window', {
      title: 'Test Window On Launch',
      height: 200,
      width: 400,
      constrainHeader: true,
      renderTo: 'maincontent-body',
      layout: 'fit',
      items: [],
    } ).show();

  },
  autoCreateViewport: true,
} );
