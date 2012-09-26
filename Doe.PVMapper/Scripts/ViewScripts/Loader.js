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

//#region Application launch
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
//#endregion

//#region function graph
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
//#endregion

//#region   Menu DataStore
var imgLink = "   <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>  <label class='funcWeight'>[0.00] </label>"
var catLink = "   <img class='funcCategory' src='http://localhost:1919/Images/Pie Chart.png'/>  <label class='funcWeight'>[0.00] </label>"
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
var currentMenu = null;

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
          id: 'target-Increment',
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
          var tmpStr = me.title;
          tmpStr = tmpStr.substring(0,tmpStr.indexOf('function')-1).trim();
          var funcRec = funcStore.findRecord( 'functionName', tmpStr );
          if ( funcRec != null ) {
            var target = Ext.getCmp( 'function-target' );
            funcRec.data.minValue = Ext.getCmp( 'target-MinValue' ).getValue();
            funcRec.data.maxValue = Ext.getCmp( 'target-MaxValue' ).getValue();
            funcRec.data.slope = Ext.getCmp( 'function-slope' ).getValue();
            funcRec.data.weight = Ext.getCmp( 'function-weight' ).getValue();
            funcRec.data.target = Ext.getCmp( 'function-target' ).getValue();
            funcRec.data.increment = Ext.getCmp( 'target-Increment' ).getValue();
            funcRec.data.mode = Ext.getCmp( 'function-mode' ).getValue();
            funcRec.commit( true );
          }
          currentMenu.children( '.funcWeight' ).text('['+ Ext.getCmp('function-weight').getValue() + ']' );
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
    this.setTitle(aTitle + ' functions ');
    var funcRec = funcStore.findRecord( 'functionName', aTitle );
    if ( funcRec != null) {
      var target = Ext.getCmp( 'function-target' );
      Ext.getCmp( 'target-MinValue' ).setValue( funcRec.data.minValue );
      Ext.getCmp( 'target-MaxValue' ).setValue( funcRec.data.maxValue );
      Ext.getCmp( 'function-slope' ).setValue( funcRec.data.slope );
      Ext.getCmp( 'slope-slider' ).setValue( funcRec.data.slope );
      Ext.getCmp( 'function-weight' ).setValue( funcRec.data.weight );
      Ext.getCmp( 'weight-slider' ).setValue( funcRec.data.weight );
      Ext.getCmp( 'target-Increment' ).setValue( funcRec.data.increment );
      Ext.getCmp( 'function-mode' ).setValue( funcRec.data.mode );

      var tslider = Ext.getCmp( 'target-slider' );
      tslider.setMinValue( funcRec.data.minValue );
      tslider.setMaxValue( funcRec.data.maxValue );
      tslider.increment = funcRec.data.increment;
      switch ( tslider.increment ) {
        case 0.0001: tslider.decimalPrecision = 4; target.decimalPrecision = 4; break;
        case 0.001: tslider.decimalPrecision = 3; target.decimalPrecision = 3; break;
        case 0.01: tslider.decimalPrecision = 2; target.decimalPrecision = 2; break;
        case 0.1: tslider.decimalPrecision = 1; target.decimalPrecision = 1; break;
        default: tslider.decimalPrecision = 0; target.decimalPrecision = 0; break;
      }
      tslider.setValue( funcRec.data.target );
      target.setValue( funcRec.data.target );
      target.setMinValue( funcRec.data.minValue );
      target.setMaxValue( funcRec.data.maxValue );
    }

    this.update();
    return this;
  }
} );
//#endregion

//#region PieStore
Ext.define( 'MyApp.PieModel', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'Category', type: 'string' },
    { name: 'Data', type: 'int' },
    { name: 'Quality', type: 'int' }
  ]
} );

var pieStore = Ext.create( 'Ext.data.Store', {
  model: 'MyApp.PieModel',
  data: [
  ]
} );
//#endregion

//#region PieWindow
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
          store: pieStore,
          //#endregion
          series: [{
            type: 'pie',
            //field: 'Data',
            angleField: 'Data',
            // lengthField: 'Quality',
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
                pieStore.each( function ( rec ) {
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
          ,interactions: ['rotate']
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
  ,
  showing: function ( aTitle ) {
    pieStore.data.clear();
    loadPieData( aTitle );
    return this;
  }
} );
//#endregion

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
  ],
  idProperty: 'functionName'
} );

var funcStore = Ext.create( 'Ext.data.Store', {
  model: 'MyApp.FunctionUtils',
  data:[]

} );

//just in case IE8 or earlier.
if ( !String.prototype.trim ) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '' );
  }
}
//#region load Function Data
function loadData() {
  var cNode = navMenu.getRootNode();
  if ( cNode.hasChildNodes() ) {
    var totalWeight = pushChildNodes( cNode.firstChild );
    fromCh = cNode.data.text.indexOf( '[' ) + 1;
    toCh = cNode.data.text.indexOf( ']' );
    cNode.data.text = cNode.data.text.substring( 0, fromCh ) + totalWeight + cNode.data.text.substring( toCh, cNode.data.lenth );
  }
}
function randomNormal() {
  return Math.cos( 2 * Math.PI * Math.random() ) * Math.sqrt( -2 * Math.log( Math.random() ) )
}

function normalDistribution(min, max, mean, std) {

  var norm = 0;
  if ( !mean || mean == 0.0 ) {
    var X = 0;
    for ( var i = 0; i < 10; i++ ) {
      X = randomNormal() * ( max - min );
      norm = norm + X;
    }
    norm = norm / 10;
    mean = norm + min;
  }

  if (!std || std == 0.0) {
    //we don't have std, calculate it: a sample of 10 point.
    var Y = 0.0;
    var norm2 = 0;
    for ( var i = 0; i < 10; i++ ) {
      norm2 = Math.pow(( randomNormal() * ( max - min ) - mean ), 2 )
      Y = Y + norm2;
    }
    norm2 = Math.sqrt( Y / 10 ) ;
    std = norm2;
  }
  var ND = norm / std + mean;
  console.log('min: '+min+', max: '+max+', mean: ' + mean + ', std: ' + std+ ', Norm: ' + norm + ', ND: ' + ND);
  return ND;
}

function getMode( id ) {
  if ( id == 0 ) return 'Less is better';
  else return 'More is better';
}

function createUtilsRecord( aName ) {
  switch (aName) {
    case 'LCOE': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 100, maxValue: 200, increment: 1, target: 144, slope: 50, mode: getMode(0), weight: Math.random() * 100 } );
    case 'IRR': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 35, increment: 1, target: 10, slope: 20, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'DSCR': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 1, maxValue: 5, increment: 1, target: 2, slope: 50, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'NPV': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 1000000, maxValue: 50000000, increment: 100, target: 20000000, slope: 50, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'Transmission': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 3000000, increment: 1, target: 500000, slope: 30, mode: getMode( 0 ), weight: Math.random() * 100 } );
    case 'Incentives': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 100, increment: 1, target: 50, slope: 50, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'Net Annual Energy': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 1000000, maxValue: 400000000, increment: 100, target: 40000000, slope: 30, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'Intermittency': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 1, increment: 0.01, target: 0.85, slope: 20, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'Contract Risk': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 1, increment: 0.01, target: 0.20, slope: 20, mode: getMode( 0 ), weight: Math.random() * 100 } );
    case 'Endangered Species': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 1, increment: 0.01, target: 0.1, slope: 10, mode: getMode( 0 ), weight: Math.random() * 100 } );
    case 'Cultural Resources': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 1, increment: 0.01, target: 0.1, slope: 10, mode: getMode( 0 ), weight: Math.random() * 100 } );
    case 'Zoning': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 1, increment: 0.01, target: 0.80, slope: 20, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'Soil': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 1, increment: 0.01, target: 0.80, slope: 20, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'Geology': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 1, increment: 0.01, target: 0.80, slope: 20, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'Water': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 1, increment: 0.01, target: 0.80, slope: 20, mode: getMode( 1 ), weight: Math.random() * 100 } );
    case 'Public Perception': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 0, maxValue: 1, increment: 0.01, target: 0.5, slope: 20, mode: getMode( 1 ), weight: Math.random() * 100 } );
  }
}

var cnt = 0;
function pushChildNodes( fNode) {
  var nodeName, fromCh, toCh, tmpStr, weights, totalWeight = 0.00;
  var min,max;
  //var maxWeight = 0.00;
  var cNode = fNode;

  while ( cNode ) {
    if ( cNode.data.leaf ) {
      toCh = cNode.data.text.indexOf( '<' ) - 1;
      if ( toCh <= 0 ) toCh = cNode.data.text.lenth - 1;
      nodeName = cNode.data.text.substring( 0, toCh ).trim();
      
      //min = getMin( nodeName );
      //max = getMax( nodeName );

      //min = Math.floor( Math.random() * 11 );
      //max = Math.floor( Math.random() * 90 ) + 10;
      
      //if ( !cNode.nextSibling )
      //  weights = 100.00 - totalWeight;
      //else 
      //  weights = Math.floor( Math.random() * 30 ) + 1;

      var func = createUtilsRecord( nodeName );
      weights = func.data.weight;
      totalWeight = totalWeight + weights;

      //func = Ext.create( 'MyApp.FunctionUtils', {
      //  functionName: nodeName,
      //  minValue: min,
      //  maxValue: max,
      //  increment: 1,
      //  target: Math.floor( Math.random() * max ),
      //  slope: Math.floor( Math.random() * 100 ),
      //  mode: 'Less is better',
      //  weight: weights
      //} );
      funcStore.insert( cnt, func );
      
      fromCh = cNode.data.text.indexOf( '[' )+1;
      toCh = cNode.data.text.indexOf(']');
      cNode.data.text = cNode.data.text.substring( 0, fromCh ) + weights + cNode.data.text.substring(toCh,cNode.data.lenth);
      cnt = cnt + 1;
    } else if ( cNode.hasChildNodes() ) {
      var total = pushChildNodes( cNode.firstChild );
     
      fromCh = cNode.data.text.indexOf( '[' ) + 1;
      toCh = cNode.data.text.indexOf( ']' );
      cNode.data.text = cNode.data.text.substring( 0, fromCh ) + total + cNode.data.text.substring( toCh, cNode.data.lenth );
      totalWeight = totalWeight + total;
    }
    cNode = cNode.nextSibling;
  }
  return totalWeight;
}
//#endregion
//#region load Pie Data

function loadPieData(aTitle) {
  var cNode = navMenu.getRootNode().findChildBy( function () {
    var toCh, nodeName = '';
    if ( !this.data.leaf ) {
      toCh = this.data.text.indexOf( '<' ) - 1;
      if ( toCh <= 0 ) toCh = this.data.text.lenth - 1;
      nodeName = this.data.text.substring( 0, toCh ).trim();
    }
    return nodeName == aTitle;
  }, null, true );
  if ( cNode != null && cNode.hasChildNodes() ) {
    var toCh, nodeName;
    cNode = cNode.firstChild;
    while ( cNode ) {
      toCh = cNode.data.text.indexOf( '<' ) - 1;
      nodeName = cNode.data.text.substring( 0, toCh ).trim();

      fromCh = cNode.data.text.indexOf( '[' ) + 1;
      toCh = cNode.data.text.indexOf( ']' );
      weight = cNode.data.text.substring( fromCh, toCh );
      pieStore.add( { Category: nodeName, Data: weight, Quality: 100 } );
      cNode = cNode.nextSibling;
    }
  }
}

//#endregion

//#region onReady
var pieWin = Ext.create( 'Ext.PieWindow' );
var puWin = Ext.create( 'Ext.PopupWindow' );
loadData();

( function ( pvM ) {
  pvM.onReady( function () {
   
    //$( '#ToolTree' ).on( {
    //  click: function () {
    //    //if ( ev.target != this ) return true;
    //    alert( 'Value is: ' + this.textContent );
    //  }
    //}, '.funcWeight' );

    $( '#ToolTree' ).on( {
      click: function ( ev ) {
        ev.stopPropagation();
        currentMenu = $( this ).parent();
        var tmpStr = $( this ).parent().text();
        tmpStr = tmpStr.substring( 0, tmpStr.indexOf( '[' ) ).trim();
        puWin.showing(tmpStr ).show();
      }
    }, '.funcButton' );

    $( '#ToolTree' ).on( {
      click: function ( ev ) {
        ev.stopPropagation();
                
        var tmpStr = $( this ).parent().text();
        tmpStr = tmpStr.substring( 0, tmpStr.indexOf( '[' ) ).trim();
        pieWin.showing(tmpStr).show();
      }
    }, '.funcCategory' );

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
