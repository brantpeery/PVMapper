/// <reference path="../_references.js" />
/// <reference path="../jquery-1.8.0.intellisense.js" />
/// <reference path="UtilityWeights.js" />
/// <reference path="UtilityFunctions.js" />



Ext.Loader.setConfig( {
  enabled: true,
  disableCaching: false,
  paths: {
    GeoExt: "/Scripts/GeoExt",
    Ext: "http://cdn.sencha.io/ext-4.1.0-gpl/src"
  }
} );

Ext.Loader.setPath( 'Ext.ux.plugins.FitToParent', '/Scripts/extExtensions/FitToParent.js' );
Ext.require( [
    'Ext.panel.*',
    'Ext.tab.*',
    'Ext.ux.plugins.FitToParent',
    'Ext.state.Manager',
    'Ext.state.CookieProvider',
    'Ext.layout.container.Border',
    'Ext.container.Viewport',
    'Ext.window.MessageBox',
    'Ext.data.TreeStore',
    'Ext.tree.Panel',
    'GeoExt.panel.Map',
    'GeoExt.Action',
    'Ext.grid.Panel',
    'Ext.data.ArrayStore',
    'Ext.grid.column.Action',
    'Ext.form.field.Number',
    'Ext.form.Label'
] );

Ext.application( {
  name: 'MyApp',
  launch: function () {

    // track map position 
    Ext.state.Manager.setProvider(
        Ext.create( 'Ext.state.CookieProvider', {
          expires: new Date( new Date().getTime() + ( 1000 * 60 * 60 * 24 * 7 ) ) //7 days from now
        } ) );

    var usBounds = new OpenLayers.Bounds( -14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284 );
    var map = new OpenLayers.Map( {
      // These projections are all webmercator, but the openlayers layer wants 900913 specifically
      projection: new OpenLayers.Projection( "EPSG:900913" ), //3857 //4326
      units: "m",
      numZoomLevels: 16,
      restrictedExtent: usBounds
    } );
    var toolbarItems = [];
    mapPanel = Ext.create( 'GeoExt.panel.Map', {
      id: 'map-panel-id',
      title: 'Site',
      map: map,
      zoom: 0,
      center: [-10723197, 4500612],
      stateful: true,
      stateId: 'mapPanel',

      dockedItems: [{
        itemId: 'map-toolbar-id',
        xtype: 'toolbar',
        dock: 'top',
        items: toolbarItems
      }]
    } );

    pvMapper.mapToolbar = mapPanel.child( '#map-toolbar-id' );

    Ext.create( 'MyApp.RootPanel' );

    // fire the pvMapper.onReady event
    pvMapper.map = map;
    $( "body" ).trigger( "pvMapper-ready" );

  }
} );


Ext.define( 'MyApp.RootPanel', {
  id: 'MyApp-RootPanel-id',
  extend: 'Ext.Panel',
  layout: 'border',
  height: 600,
  renderTo: 'rootPanel-id',
  plugins: ['fittoparent'],

  initComponent: function () {
    var me = this;

    var tabPanel = Ext.create( 'Ext.tab.Panel',
        {
          collapsible: false,
          region: 'center',
          layout: 'fit',
          border: false,
          items: [mapPanel]
        } );

    pvMapper.tabs = tabPanel;

    //var store = Ext.create( 'Ext.data.TreeStore', {
    //  proxy: {
    //    type: 'ajax',
    //    url: '/api/Tools'                                                                                        
    //  }                                                                                                              
    //} );                                                                                                             

    var imgLink = "<img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>"
    var navMenu = Ext.create( 'Ext.data.TreeStore', {
      root: {
        expanded: true,
        children: [{
          checked: false,
          text: "Cost",
          expanded: true,
          children: [{
            checked: false,
            text: "Land Cost",
            expanded: true,
            children: [
              { text: "Site Area" + imgLink, leaf: true, checked: true, },
              { text: "Offset Area" + imgLink, leaf: true, checked: false },
              { text: "Zone Type" + imgLink, leaf: true, checked: false }]
          }, {
            text: "Facility Cost", checked: false,
            children: [
              { text: "Solar Panel System Cost" + imgLink, leaf: true, checked: false },
              { text: "Buildings" + imgLink, leaf: true, checked: false },
              { text: "Physical Security" + imgLink, leaf: true, checked: false }]
          }, {
            checked: false,
            text: "Transmission Connection Cost",
            children: [
              { text: "Right of Way Lease Cost" + imgLink, leaf: true, checked: false },
              { text: "Transmission Lines Cost" + imgLink, leaf: true, checked: false },
              { text: "Terminating Equipment Cost" + imgLink, leave: true, checked: false }
            ]
          }, { text: "Permitting Cost" + imgLink, leaf: true, checked: false }
          ]
        }, {
          checked: false,
          text: "Energy",
          children: [
            { text: "Power Output MW" + imgLink, leaf: true, checked: false },
            { text: "Intermittncy" + imgLink, leaf: true, checked: false },
          { text: "Power Purchase Contract Risk" + imgLink, leaf: true, checked: false }
          ]
        }, {
          checked: false,
          text: "Environment",
          children: [
            { text: "Endangered Species " + imgLink, leaf: true, checked: false },
            { text: "Water Quality      " + imgLink, leaf: true, checked: false },
            { text: "Air Emissions      " + imgLink, leaf: true, checked: false },
            { text: "Viewshed           " + imgLink, leaf: true, checked: false }
          ]
        }, {
          checked: false,
          text: "Social",
          children: [
            { text: "Public Acceptablity " + imgLink, leaf: true, checked: false },
            { text: "Housing Proximity   " + imgLink, leaf: true, checked: false }
          ]
        }
        ]
      }
    } );


    var treePanel = Ext.create( 'Ext.tree.Panel', {
      id: "ToolTree",
      border: false,
      width: 200,
      store: navMenu,
      rootVisible: false,
      useArrows: true,
      buttons: [
        {
          text: 'Apply',
          handler: function () { alert( "Hey!" ) }
        },
        { text: 'Cancel' }
      ],


      listeners: {

        itemclick: {
          fn: function ( view, record, item, index, e ) {

          }
        },
        checkchange: {
          fn: function ( node, check ) {

            if ( check ) {

              $.getScript( node.raw.url )
                  .done( function ( script, textStatus ) {
                  } )
                  .fail( function ( jqxhr, settings, exception ) {
                    console.log( exception );
                    pvMapper.displayMessage( "Could not load tool." );
                  } );
            }

          }
        },
      }
    } );


    this.items = [{
      title: 'Properties',
      region: 'west',
      layout: 'fit',
      width: 175,
      minSize: 100,
      collapsible: true,
      split: true,
      items: [treePanel]
    }, tabPanel]

    me.callParent( arguments );
  }
} );


Ext.define( 'Ext.PopupWindow', {
  extend: 'Ext.window.Window',
  title: 'Functions',
  height: 400,
  width: 400,
  layout: 'fit',
  resizable: false,
  closeAction: 'hide',
  draggable: true,
  modal: true,
  items: [],
  //  data: { bar: 'foo' },
  // tpl: Ext.create( 'Ext.XTemplate', '<div class="tooltip"><h1>{bar}</h1><div>{form}</div></div>', { compiled: true } ),
  initComponent: function () {
    var me = this;

    //Create items
    //var progressBar = Ext.create( 'Ext.ProgressBar', {
    //  text: 'Progress...',
    //  width: 250,
    //  animate: true,
    //  hidden: true,
    //  id: 'widget-progressbar'
    //} );

    me.items = [
    Ext.create( 'Ext.form.Panel', {
      bodyStyle: 'padding:5px 5px 0',
      width: 400,
      height: 400,
      renderTo: Ext.getBody(),
      defaultType: 'textfield',
      defaults: {
        anchor: '100%'
      },
      fieldDefaults: { labelWidth: 70 },
      items: [
        {
          fieldLabel: 'Min',
          minWidth: 70,
          maxWidth: 150,
          value: 10,
          id: 'minValue'
        },
        {
          fieldLabel: 'Max',
          minWidth: 70,
          maxWidth: 150,
          value: 10,
          id: 'maxValue'
        },
        {
          xtype: 'panel',
          border: false,
          layout: {
            type: 'hbox',
            align: 'middle'
          },
          items: [{
            xtype: 'combo',
            fieldLabel: 'Precision',
            value: '2',
            minWidth: 60,
            maxWidth: 150,
            id: 'PrecisionValue',
            mode: 'local',
            flex: 1,
            triggerAction: 'all',
            store: ['0','1','2','3','4']
          },
          {
            padding: 10,
            xtype: 'combo',
            fieldLabel: 'Increment',
            flex: 1,
            minWidth: 70,
            maxWidth: 150,
            value: 1,
            id: 'incrementation',
            mode: 'local',
            triggerAction: 'all',
            store: ['0.001','0.01','0.1','1','2','5']

          }
        ]},
        {
          xtype: 'panel',
          border: false,
          layout: {
            type: 'hbox',
            align: 'middle'
          },
          defaultType: 'textfield',
          items: [{
            fieldLabel: 'Target',
            id: 'target',
            flex: 1,
            minWidth: 50,
            maxWidth: 110,
            value: 10,
            allowBlank: false,
            listeners: {
              change: function ( me, newVal, oldVal, op ) {
                Ext.getCmp( "target-slider" ).setValue( newVal );
              }
            }
          },
          {
            id: 'target-slider',
            decimalPrecision: 2,
            xtype: 'slider',
            flex: 1,
            minValue: 0,
            maxValue: 5,
            increment: 0.01,
            listeners: {
              change: function ( select, newval, thumb, op ) {
                Ext.getCmp( "target" ).setValue( newval );
              }
            }
          }]
        },
        {
          xtype: 'panel',
          border: false,
          layout: {
            type: 'hbox',
            align: 'middle'
          },
          defaultType: 'textfield',
          items: [{
            fieldLabel: 'Slope',
            id: 'slope',
            flex: 1,
            minWidth: 50,
            maxWidth: 110,
            value: 10,
            allowBlank: false,
            listeners: {
              change: function ( me, newVal, oldVal, op ) {
                Ext.getCmp( "slope-slider" ).setValue( newVal );
              }
            }

          },
          {
            id: 'slope-slider',
            xtype: 'slider',
            flex: 1,
            minValue: 0,
            maxValue: 100,
            increment: 1,
            listeners: {
              change: function ( select, newval, thumb, op ) {
                Ext.getCmp( "slope" ).setValue( newval );
              }
            }
          }]
        },
        { //Weight panel
          xtype: 'panel',
          border: false,
          layout: {
            type: 'hbox',
            align: 'middle'
          },
          defaultType: 'textfield',
          items: [{
            fieldLabel: 'Weights',
            id: 'weight',
            flex: 1,
            minWidth: 50,
            maxWidth: 110,
            value: 33,
            allowBlank: false,
            listeners: {
              change: function ( me, newVal, oldVal, op ) {
                Ext.getCmp( "weight-slider" ).setValue( newVal );
              }
            }
          },
          {
            id: 'weight-slider',
            xtype: 'slider',

            flex: 1,
            minValue: 0,
            maxValue: 100,
            increment: 1,
            listeners: {
              change: function ( select, newval, thumb, op ) {
                Ext.getCmp( "weight" ).setValue( newval );
              }
            }
          }]
        }
      ],

      buttons: [{
        xtype: 'button',
        text: 'OK',
        handler: function () {
          //TODO: execute update function here.


          puWin.hide();
        }
      },
      {
        xtype: 'button',
        text: 'Cancel',
        handler: function () {
          puWin.hide();
        }
      }]
    } )],

    me.callParent( arguments );
  },
  showing: function ( aTitle ) {
    this.title = aTitle + ' functions ';
    return this;
  }
} );

var puWin = Ext.create( 'Ext.PopupWindow' );

( function ( pvM ) {
  pvM.onReady( function () {
    $( '#ToolTree' ).on( {
      click: function () {
        puWin.showing( $( this ).parent().text() ).show();
      }
    }, '.funcButton' )

    Ext.getCmp( 'slope-slider' ).setValue( Ext.getCmp( 'slope' ).value );
    Ext.getCmp( 'target-slider' ).setValue( Ext.getCmp( 'target' ).value );
    Ext.getCmp( 'weight-slider' ).setValue( Ext.getCmp( 'weight' ).value );

    //$( '#ToolTree' ).on( { click: function () { alert( $( this ).parent().text() ) } }, ".funcButton" );
    //console.log( "Added the click events to the images" );
  } );
} )( pvMapper );
