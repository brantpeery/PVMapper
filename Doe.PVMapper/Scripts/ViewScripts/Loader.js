/// <reference path="../_references.js" />
/// <reference path="../jquery-1.8.0.intellisense.js" />
/// <reference path="UtilityWeights.js" />
/// <reference path="UtilityFunctions.js" />

//#region Configuration

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
//#endregion

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

// create the function graph
var board, f2;
function loadBoard() {
  JXG.Options.ticks.majorHeight = 20;
  JXG.Options.ticks.minorTicks = 5;
  JXG.Options.ticks.insertTicks = false;
  JXG.Options.ticks.minorHeight = 5;
  JXG.Options.ticks.ticksDistance = 10;
  board = JXG.JSXGraph.initBoard( 'FunctionBox-body', { boundingbox: [0, 1.05, 100, -.05], axis: true, showCopyright: false, showNavigation: false } );
  f2 = board.create( 'functiongraph', [UtilityFunctions.utilityFunction1], { strokeWidth: 3, strokeColor: "red" } );
};

function updateBoard() {
  var target = Ext.getCmp( 'function-target' );
  board = JXG.JSXGraph.freeBoard( board );
  JXG.Options.ticks.majorHeight = 20;
  JXG.Options.ticks.minorTicks = 5;
  JXG.Options.ticks.insertTicks = false;
  JXG.Options.ticks.minorHeight = 5;
  //JXG.Options.ticks.ticksDistance = 2;
  JXG.Options.ticks.ticksDistance = ( target.maxValue - target.minValue ) / 10;
  board = JXG.JSXGraph.initBoard( 'FunctionBox-body', { boundingbox: [target.minValue, 1.15, target.maxWidth, -0.15], axis: true, showCopyright: false, showNavigation: false } );
  var mode = Ext.getCmp( 'function-mode' );
  if ( mode.value == 'Less is better' )
    f2 = board.create( 'functiongraph', [UtilityFunctions.utilityFunction1], { strokeWidth: 3, strokeColor: "red" } );
  else
    f2 = board.create( 'functiongraph', [UtilityFunctions.utilityFunction2], { strokeWidth: 3, strokeColor: "red" } );
}

var UtilityFunctions = {
  utilityFunction1: function ( x ) {
    var l = parseInt( $( "#target-MinValue-inputEl" ).val() );
    var b = parseInt( $( "#function-target-inputEl" ).val() );
    var h = parseInt( $( "#target-MaxValue-inputEl" ).val() );
    var s = parseInt( $( "#function-slope-inputEl" ).val() );
    var y = 0;

    if ( x >= h ) y = 1;
    else if ( x <= l ) y = 0;
    else y = 1 / ( 1 + Math.pow(( b - l ) / ( x - l ), ( 2 * ( 1 / s ) * ( b + x - 2 * l ) ) ) );

    if ( y >= 1 ) y = 1;
    if ( y <= 0 ) y = 0;
    return 1 - y;
  },

  utilityFunction2: function ( x ) {
    var l = parseInt( $( "#target-MinValue-inputEl" ).val() );
    var b = parseInt( $( "#function-target-inputEl" ).val() );
    var h = parseInt( $( "#target-MaxValue-inputEl" ).val() );
    var s = 1 / parseInt( $( "#function-slope-inputEl" ).val() );
    var y = 0;

    if ( x >= h ) y = 1;
    else if ( x <= l ) y = 0;
    else y = ( x < b ) ? 1 / ( 1 + Math.pow(( b - l ) / ( x - l ), ( 2 * s * ( b + x - 2 * l ) ) ) ) :
        1 - ( 1 / ( 1 + Math.pow(( b - ( 2 * b - h ) ) / ( ( 2 * b - x ) - ( 2 * b - h ) ), ( 2 * s * ( b + ( 2 * b - x ) - 2 * ( 2 * b - h ) ) ) ) ) );
    if ( y >= 1 ) y = 1;
    if ( y <= 0 ) y = 0;
    return y;
  },

  UtilityFunction3: function ( x ) {
  }
}


//#region   DataStore
var imgLink = "   <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>  <label class='funcWeight'> 0.00 </label>"
var catLink = "   <img class='funcCategory' src='http://localhost:1919/Images/Pie Chart.png'/>  <label class='funcWeight'> 0.00 </label>"
var navMenu = Ext.create( 'Ext.data.TreeStore', {
  root: {
    text: 'Overall ' + catLink,
    expanded: true,
    children: [{
      checked: false,
      text: "Cost " + catLink,
      expanded: true,
      children: [
        { text: "LCOE         " + imgLink, cls: 'menuItem', qtip: 'Levelized Cost of Energy.', leaf: true, checked: true },
        { text: "IRR          " + imgLink, cls: 'menuItem', qtip: 'After-tax Internal Rate of Return.', leaf: true, checked: true },
        { text: "DSCR         " + imgLink, cls: 'menuItem', qtip: 'Pre-tax min Debt Service Coverage Ratio.', leaf: true, checked: true },
        { text: "NPV          " + imgLink, cls: 'menuItem', qtip: 'After-Tax Net Present Value.', leaf: true, checked: true },
        { text: "Transmission " + imgLink, cls: 'menuItem', qtip: 'Cost to connect to preferred transmission line.', leaf: true, checked: true },
        { text: "Incentives   " + imgLink, cls: 'menuItem', qtip: 'Index of tax and other incentives offered to promote development.', leaf: true, checked: true }
      ]
    }, {
      checked: false,
      text: "Energy " + catLink,
      children: [
        { text: "Net Annual Energy " + imgLink, cls: 'menuItem', qtip: 'Annual expected kWh generation.', leaf: true, checked: true },
        { text: "Intermittency     " + imgLink, cls: 'menuItem', qtip: 'Index of solar radiation intermittency.', leaf: true, checked: true },
        { text: "Contract Risk     " + imgLink, cls: 'menuItem', qtip: 'Power Purchase Agreement Risk.', leaf: true, checked: true }
      ]
    }, {
      checked: false,
      text: "Environment " + catLink,
      children: [
        { text: "Endangered Species " + imgLink, cls: 'menuItem', qtip: 'Index of presence of endangered species.', leaf: true, checked: false },
        { text: "Cultural Resources " + imgLink, cls: 'menuItem', qtip: 'Index of presence of cultural resources.', leaf: true, checked: false },
        { text: "Zoning             " + imgLink, cls: 'menuItem', qtip: 'Index of zoning risk.', leaf: true, checked: false },
        { text: "Soil               " + imgLink, cls: 'menuItem', qtip: 'Index of soil type appropriate for development.', leaf: true, checked: false },
        { text: "Geology            " + imgLink, cls: 'menuItem', qtip: 'Index of geology appropriate for development.', leaf: true, checked: false },
        { text: "Water              " + imgLink, cls: 'menuItem', qtip: 'Index of adequate water is available for development.', leaf: true, checked: false }
      ]
    }, {
      checked: false,
      text: "Social " + catLink,
      children: [
        { text: "Public Perception " + imgLink, cls: 'menuItem', qtip: 'Index of public perception adequately positive for development.', leaf: true, checked: false }
      ]
    }
    ]
  }
} );
//#endregion 

//#region RootPanel
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

    //#region Data Store From Server
    //var store = Ext.create( 'Ext.data.TreeStore', {
    //  proxy: {
    //    type: 'ajax',
    //    url: '/api/Tools'                                                                                        
    //  }                                                                                                              
    //} );                     
    //#endregion
    //#region treePanel
    var treePanel = Ext.create( 'Ext.tree.TreePanel', {
      id: "ToolTree",
      border: false,
      //width: 300,
      store: navMenu,
      rootVisible: true,
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
        }
      }
    } );
    //#endregion

    this.items = [{
      title: 'Properties',
      region: 'west',
      layout: 'fit',
      width: 200,
      minSize: 100,
      collapsible: true,
      split: true,
      items: [treePanel]
    }, tabPanel]

    me.callParent( arguments );
  }
} );
//#endregion


//#region Function Window
Ext.define( 'Ext.PopupWindow', {
  extend: 'Ext.window.Window',
  title: 'Functions',
  height: 500,
  width: 400,
  floating: true,
  layout: 'fit',
  closeAction: 'hide',
  draggable: true,
  modal: false,
  //  data: { bar: 'foo' },
  // tpl: Ext.create( 'Ext.XTemplate', '<div class="tooltip"><h1>{bar}</h1><div>{form}</div></div>', { compiled: true } ),
  initComponent: function () {
    var me = this;
    me.items = [
    Ext.create( 'Ext.form.Panel', {
      bodyStyle: 'padding:5px 5px 0',
      renderTo: Ext.getBody(),
      defaultType: 'numberfield',
      defaults: {
        anchor: '100%'
      },
      fieldDefaults: { labelWidth: 70 },
      //#region MinValue
      items: [{
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        items: [{
          xtype: 'numberfield',
          fieldLabel: 'Target Min',
          minWidth: 70,
          maxWidth: 150,
          value: Math.floor( Math.random() * 11 ),
          flex: 1,
          id: 'target-MinValue',
          listeners: {
            change: function ( me, newVal, oldVal, op ) {
              var slider = Ext.getCmp( 'target-slider' );
              var target = Ext.getCmp( 'function-target' );
              slider.setMinValue( newVal );
              if ( slider.value < newVal ) {
                slider.setValue( newVal );
              }
              if ( target.getValue() != slider.getValue() ) {
                target.setValue( slider.getValue() );

              }
              target.setMinValue( newVal );
              updateBoard();
            }
          }

        },
        //#endregion
      //#region Max Value
      {
        padding: '0 0 0 10',
        xtype: 'numberfield',
        fieldLabel: 'Target Max',
        minWidth: 70,
        maxWidth: 150,
        value: Math.floor( Math.random() * 91 ) + 10,
        flex: 1,
        id: 'target-MaxValue',
        listeners: {
          change: function ( me, newVal, oldVal, op ) {
            var slider = Ext.getCmp( 'target-slider' );
            var target = Ext.getCmp( 'function-target' );
            slider.setMaxValue( newVal );
            if ( slider.value > newVal ) {
              slider.setValue( newVal );
            }
            if ( target.getValue() != slider.getValue() ) {
              target.setValue( slider.getValue() );
            }
            target.setMaxValue( newVal );
            updateBoard();
          }
        }

      }]
      },
      //#endregion
      //#region Increment
      {
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        items: [
        {
          xtype: 'combo',
          editable: false,
          fieldLabel: 'Increment',
          flex: 2,
          minWidth: 70,
          maxWidth: 150,
          value: 1,
          id: 'target-Incremental',
          mode: 'local',
          triggerAction: 'all',
          store: [0.0001, 0.001, 0.01, 0.1, 1, 2, 5],
          listeners: {
            change: function ( me, newVal, oldVal, op ) {
              var slider = Ext.getCmp( 'target-slider' );
              var target = Ext.getCmp( 'function-target' );
              slider.increment = newVal;
              switch ( newVal ) {
                case 0.0001: slider.decimalPrecision = 4; target.decimalPrecision = 4; break;
                case 0.001: slider.decimalPrecision = 3; target.decimalPrecision = 3; break;
                case 0.01: slider.decimalPrecision = 2; target.decimalPrecision = 2; break;
                case 0.1: slider.decimalPrecision = 1; target.decimalPrecision = 1; break;
                default: slider.decimalPrecision = 0; target.decimalPrecision = 0; break;
              }
            }
          }
        }]
      },
      //#endregion
      //#region function target
      {
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        defaultType: 'numberfield',
        items: [{
          fieldLabel: 'Target',
          id: 'function-target',
          flex: 3,
          minWidth: 100,
          maxWidth: 150,
          value: 0,
          allowBlank: false,
          listeners: {
            change: function ( me, newVal, oldVal, op ) {
              Ext.getCmp( 'target-slider' ).setValue( newVal );
            }
          }
        },
        {
          id: 'target-slider',
          decimalPrecision: 0,
          xtype: 'slider',
          flex: 3,
          minValue: 0,
          maxValue: 100,
          increment: 1,
          listeners: {
            change: function ( me, newval, thumb, op ) {
              Ext.getCmp( 'function-target' ).setValue( newval );
            }
          }
        }]
      },
      //#endregion
      //#region  function slope
      {
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        defaultType: 'numberfield',
        items: [{
          fieldLabel: 'Slope',
          decimalPrecision: 0,
          id: 'function-slope',
          flex: 4,
          minWidth: 100,
          maxWidth: 150,
          //value: Math.floor(Math.random() * 100),
          minValue: 1,
          maxValue: 100,
          allowBlank: false,
          listeners: {
            change: function ( me, newVal, oldVal, op ) {
              Ext.getCmp( 'slope-slider' ).setValue( newVal );
              if ( board ) board.update();
            }
          }

        },
        {
          xtype: 'slider',
          decimalPrecision: 0,
          id: 'slope-slider',
          flex: 4,
          minValue: 1,
          maxValue: 100,
          increment: 1,
          value: Math.floor( Math.random() * 100 ),
          listeners: {
            change: function ( select, newval, thumb, op ) {
              Ext.getCmp( 'function-slope' ).setValue( newval );
            }
          }
        }]
      },
      //#endregion
      //#region Fuction Mode
      {
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        items: [
        {
          xtype: 'combo',
          fieldLabel: 'Mode',
          flex: 2,
          minWidth: 70,
          maxWidth: 250,
          value: 'Less is better',
          id: 'function-mode',
          mode: 'local',
          triggerAction: 'all',
          store: ['Less is better', 'More is better'],
          listeners: {
            change: function ( me, newVal, oldVal, op ) {
              updateBoard();
            }
          }
        }]
      },
      //#endregion
      //#region Weight
      { //Weight panel
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        defaultType: 'numberfield',
        items: [{
          fieldLabel: 'Weights(%)',
          id: 'function-weight',
          flex: 5,
          minWidth: 100,
          maxWidth: 150,
          minValue: 0,
          maxValue: 100,
          value: Math.floor( Math.random() * 100 ),
          allowBlank: false,
          listeners: {
            change: function ( me, newVal, oldVal, op ) {
              Ext.getCmp( 'weight-slider' ).setValue( newVal );
            }
          }
        },
        {
          id: 'weight-slider',
          xtype: 'slider',
          flex: 5,
          minValue: 0,
          maxValue: 100,
          increment: 1,
          tipText: function ( thumb ) {
            return Ext.String.format( '{0}%', thumb.value );
          },
          listeners: {
            change: function ( select, newval, thumb, op ) {
              Ext.getCmp( 'function-weight' ).setValue( newval );
            }
          }
        }]
      },
      //#endregion
      //#region Function Graph
      {
        xtype: 'panel',
        border: false,
        height: 10
      },
      {
        //padding: '10 0 0 0',
        id: 'FunctionBox',
        xtype: 'panel',
        layout: 'anchor',
        border: true,
        width: 200,
        height: 250
      }],
      //#endregion
      //#region Buttons
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
      //#endregion
    }
  )],

  me.callParent( arguments );
  },
  showing: function ( aTitle ) {
    this.title = aTitle + ' functions ';
    return this;
  }
} );
//#endregion


pvMapper.pieStore = Ext.create( 'Ext.data.Store', {
  fields: [
    { name: 'Category', type: 'string' },
    { name: 'Data', type: 'int' },
    { name: 'Quality', type: 'int' }
  ],
  data: [
    { Category: 'LOCE', Data: 10, Quality: 100 },
    { Category: 'IRR', Data: 20, Quality: 100 },
    { Category: 'DSCR', Data: 30, Quality: 100 },
    { Category: 'NPV', Data: 5, Quality: 100 },
    { Category: 'Transmision', Data: 10, Quality: 100 },
    { Category: 'Incentives', Data: 25, Quality: 100 }
  ]
} );



Ext.define( 'Ext.PieWindow', {
  extend: 'Ext.window.Window',
  title: 'Category',
  height: 450,
  widht: 450,
  floating: true,
  layout: 'fit',
  closeAction: 'hide',
  draggable: true,
  model: false,
  initComponent: function () {
    var me = this;
    me.items = [
      Ext.create( 'Ext.form.Panel', {
        width: 400,
        height: 400,
        bodyStyle: 'padding: 5px 5px 0',
        renderTo: Ext.getBody(),
        defaults: {
          anchor: '100%'
        },
        items: [{
          xtype: 'chart',
          animate: true,
          width: 400,
          height: 400,
          //resizable: true,
          //resizeHandles: 'all',
          theme: 'Base:gradients',

          insetPadding: 5,
          legend: {
            position: 'right'
          },
          shadow: true,
          //#region Store data
          store: pvMapper.pieStore,
          //#endregion
          series: [{
            type: 'pie',
            //field: 'Data',
            angleField: 'Data',
            lengthField: 'Quality',
            showInLegend: true,
            highlight: {
              segment: {
                margin: 20
              }
            },

            tips: {
              trackMouse: true,
              width: 140,
              height: 20,
              renderer: function ( storeItem, item ) {
                //calculate and display percentage on hover
                var total = 0;
                pvMapper.pieStore.each( function ( rec ) {
                  total += rec.get( 'Data' );
                } );
                this.setTitle( storeItem.get( 'Category' ) + ': ' + Math.round( storeItem.get( 'Data' ) / total * 100 ) + '%' );

              }
            },
            label: {
              field: 'Category',
              display: 'rotate',
              contrast: true,
              font: '18px Arial'
            }
          }]
        }],
        buttons: [{
          xtype: 'button',
          text: 'OK',
          handler: function () {
            //TODO: execute update function here.


            pieWin.hide();
          }
        },
        {
          xtype: 'button',
          text: 'Cancel',
          handler: function () {
            pieWin.hide();
          }
        }]
      } )
    ]
    , this.callParent( arguments );
  }
} );


Ext.define( 'MyApp.FunctionUtils', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'functionName', type: 'string' },
    { name: 'minValue', type: 'float' },
    { name: 'maxValue', type: 'float' },
    { name: 'increment', type: 'float' },
    { name: 'target', type: 'float' },
    { name: 'slope', type: 'float' },
    { name: 'mode', type: 'string' },
    { name: 'weight', type: 'int' }
  ]
} );

var funcStore = Ext.create( 'Ext.data.Store', {
  model: 'MyApp.FunctionUtils',
  data:[]

} );

if ( !String.prototype.trim ) {
  String.prototype.trim = function () {
    return this.replace( /^\s+|\s+$/g, '' );
  }
}

function loadData() {
  var LOCE = Ext.create('MyApp.FunctionUtils', {
    functionName: 'LOCE',
    minValue: 0,
    maxValue: 100,
    increment: 1,
    target: 50,
    mode: 'Less is better',
    weight: 20
  });

  var unknownFunc = Ext.create('MyApp.FunctionUtils', {
    functionName: 'Unknown',
    minValue: 0,
    maxValue: 50,
    increment: 1,
    target: 20,
    mode: 'More is better',
    weight: 70
  });


  funcStore.insert(0, LOCE );
  funcStore.insert( 1, unknownFunc );

  var root = navMenu.tree.root;
  pushChildNodes( root );


  var done = false;
  var cNode = root.childNodes;
  var tStr = '';
  var func, cnt = 0;
  var min;
  var max;

  while ( !done ) {
    if ( cNode.data.leaf ) {
      tStr = cNode.data.text.indexOf('<').trim();
      min = Math.floor( Math.random() * 11 );
      max = Math.floor( Math.random() * 90 ) + 10;

      func = Ext.create( 'MyApp.FunctionUtils', {
        functionName: tStr,
        minValue: min,
        maxValue: max,
        increment: 1,
        target: Math.floor( Math.random() * max ),
        slope: Math.floor( Math.random() * 100 ),
        mode: 'Less is better',
        weight: Math.floor( Math.random() * 100 )
      } );
      funcStore.insert( cnt, func );
      cnt = cnt + 1;
    }
  }
}

function pushChildNodes( pNode ) {
  var done = false;
  var cNode = pNode.childNodes;
  var tStr = '';
  var func, cnt = 0;
  var min;
  var max;

  //add to store "group node"


  //insert to store "leaf node"
  cNode.forEach();
  while ( !done ) {
    if ( cNode.data.leaf ) {
      tStr = cNode.data.text.indexOf( '<' ).trim();
      min = Math.floor( Math.random() * 11 );
      max = Math.floor( Math.random() * 90 ) + 10;

      func = Ext.create( 'MyApp.FunctionUtils', {
        functionName: tStr,
        minValue: min,
        maxValue: max,
        increment: 1,
        target: Math.floor( Math.random() * max ),
        slope: Math.floor( Math.random() * 100 ),
        mode: 'Less is better',
        weight: Math.floor( Math.random() * 100 )
      } );
      funcStore.insert( cnt, func );
      cnt = cnt + 1;
    }
    cNode = cNode.nextSibling();

  }
}

//#region onReady
var pieWin = Ext.create( 'Ext.PieWindow' );
var puWin = Ext.create( 'Ext.PopupWindow' );

( function ( pvM ) {
  pvM.onReady( function () {
    $( '#ToolTree' ).on( {
      click: function () {
        //if ( ev.target != this ) return true;
        alert( 'Value is: ' + this.textContent );
      }
    }, '.funcWeight' );

    $( '#ToolTree' ).on( {
      click: function ( ev ) {
        ev.stopPropagation();
        puWin.showing( $( this ).parent().text() ).show();
      }
    }, '.funcButton' );

    $( '#ToolTree' ).on( {
      click: function ( ev ) {
        ev.stopPropagation();
        pieWin.show();
      }
    }, '.funcCategory' );

    var target = Ext.getCmp( 'function-target' );
    Ext.getCmp( 'function-slope' ).setValue( Math.random() * 100 );
    Ext.getCmp( 'slope-slider' ).setValue( Ext.getCmp( 'function-slope' ).getValue() );
    Ext.getCmp( 'weight-slider' ).setValue( Ext.getCmp( 'function-weight' ).getValue() );
    var tslider = Ext.getCmp( 'target-slider' );
    tslider.setMinValue( Ext.getCmp( 'target-MinValue' ).getValue() );
    tslider.setMaxValue( Ext.getCmp( 'target-MaxValue' ).getValue() );
    tslider.increment = Ext.getCmp( 'target-Incremental' ).getValue();
    switch ( tslider.increment ) {
      case 0.0001: tslider.decimalPrecision = 4; target.decimalPrecision = 4; break;
      case 0.001: tslider.decimalPrecision = 3; target.decimalPrecision = 3; break;
      case 0.01: tslider.decimalPrecision = 2; target.decimalPrecision = 2; break;
      case 0.1: tslider.decimalPrecision = 1; target.decimalPrecision = 1; break;
      default: tslider.decimalPrecision = 0; target.decimalPrecision = 0; break;
    }
    tslider.setValue( Math.floor( Math.random() * tslider.maxValue ) );
    target.setValue( tslider.getValue() );
    target.setMinValue( tslider.minValue );
    target.setMaxValue( tslider.maxValue );

    if ( typeof ( JXG ) == "undefined" ) {
      console.log( "Loading in the JXG Graph script" );
      $( "<link/>" )
          .appendTo( "head" )
          .attr( { rel: "stylesheet", type: "text/css", href: "http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" } );
      $.getScript( "http://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.93/jsxgraphcore.js", function () {
        loadBoard();
      } );
    } else {
      loadBoard();
    }
  } );
  //#endregion
} )( pvMapper );
