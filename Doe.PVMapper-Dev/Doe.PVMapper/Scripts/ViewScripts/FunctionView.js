
/// <reference path="../_references.js" />
/// <reference path="../jquery-1.8.0.intellisense.js" />
/// <reference path="UtilityWeights.js" />
/// <reference path="UtilityFunctions.js" />


//#region function graph
var board, f2;
function loadBoard() {
  board = JXG.JSXGraph.initBoard( 'FunctionBox-body', { boundingbox: [0, 1.05, 100, -.05], axis: true, showCopyright: false, showNavigation: false } );
  f2 = board.create( 'functiongraph', [UtilityFunctions.utilityFunction1], { strokeWidth: 3, strokeColor: "red" } );
};

function updateBoard() {
  var target = Ext.getCmp( 'function-target' );
  f2.Y = ( Ext.getCmp( 'function-mode' ).value == 'More is better' )?UtilityFunctions.utilityFunction1:UtilityFunctions.utilityFunction2;
  
  if ( target.maxValue - target.minValue != 0 ) {
    var diff = target.maxValue - target.minValue;
    board.setBoundingBox( [target.minValue - diff * .1, 1.1, target.maxValue + diff * .1, -.1] );
    board.update();
  }
}

var UtilityFunctions = {
  utilityFunction1: function ( x ) {
    //var l = parseInt( $( "#target-MinValue-inputEl" ).val() );
    //var b = parseInt( $( "#function-target-inputEl" ).val() );
    //var h = parseInt( $( "#target-MaxValue-inputEl" ).val() );
    //var sRatio = ( parseInt( $( "#function-slope-inputEl" ).val() ) / 5 ) + .3;
    //var y = 0;

    //var s = Math.max( 2 / ( b - l ), 2 / ( h - b ) );
    ////s = s * ( sRatio );

    //if ( x >= h ) y = 1;
    //else if ( x <= l ) y = 0;
    //else y = 1 / ( 1 + Math.pow(( b - l ) / ( x - l ), ( 2 * ( 1 / s ) * ( b + x - 2 * l ) ) ) );

    //if ( y >= 1 ) y = 1;
    //if ( y <= 0 ) y = 0;
    return 1-UtilityFunctions.utilityFunction2(x);
  },

  utilityFunction2: function ( x ) {
    var l = parseInt( $( "#target-MinValue-inputEl" ).val() );
    var b = parseInt( $( "#function-target-inputEl" ).val() );
    var h = parseInt( $( "#target-MaxValue-inputEl" ).val() );
    var sRatio = (parseInt( $( "#function-slope-inputEl" ).val())/5)+.3;
    var y = 0;

    var s = Math.min( -2 / ( b - l ), -2 / ( h - b ) );
    s = s * (sRatio);

    if ( x >= h ) y = 0;
    else if ( x <= l ) y = 1;
    else y = ( x < b ) ? 1 / ( 1 + Math.pow(( b - l ) / ( x - l ), ( 2 * s * ( b + x - 2 * l ) ) ) ) :
        1 - ( 1 / ( 1 + Math.pow(( b - ( 2 * b - h ) ) / ( ( 2 * b - x ) - ( 2 * b - h ) ), ( 2 * s  * ( b + ( 2 * b - x ) - 2 * ( 2 * b - h ) ) ) ) ) );
    if ( y >= 1 ) y = 1;
    if ( y <= 0 ) y = 0;
    return y;
  },

  UtilityFunction3: function ( x ) {
  }
}
//#endregion

//#region Function Window
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
    { name: 'weight', type: 'int' },
    { name: 'UserId', type: 'string' }
  ],
  idProperty: 'functionName'
} );

var funcStore = Ext.create( 'Ext.data.JsonStore', {
  model: 'MyApp.FunctionUtils',
  autoLoad: false,
  autoSave: false,
  root: 'data',
  idProperty: 'id',
  proxy: {
    type: 'ajax',
    url: 'api/Properties',
  }
} );

var currentMenu = null;
Ext.define( 'Ext.FunctionViewWindow', {
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
          var tmpStr = me.title;
          var targetWeight = Ext.getCmp( 'function-weight' ).getValue();
          tmpStr = tmpStr.substring( 0, tmpStr.indexOf( 'function' ) - 1 ).trim();
          var funcRec = funcStore.findRecord( 'functionName', tmpStr );
          var isNew = false;
          if ( !funcRec ) {
            funcRec = createUtilsRecord( tmpStr );
            isNew = true;
          }

          var target = Ext.getCmp( 'function-target' );
          funcRec.data.minValue = Ext.getCmp( 'target-MinValue' ).getValue();
          funcRec.data.maxValue = Ext.getCmp( 'target-MaxValue' ).getValue();
          funcRec.data.slope = Ext.getCmp( 'function-slope' ).getValue();
          funcRec.data.weight = targetWeight;
          funcRec.data.target = Ext.getCmp( 'function-target' ).getValue();
          funcRec.data.increment = Ext.getCmp( 'target-Increment' ).getValue();
          funcRec.data.mode = Ext.getCmp( 'function-mode' ).getValue();
          funcRec.commit( false );
          funcRec.dirty = true;

          if ( isNew )
            funcStore.insert( funcRec );

          funcStore.save();

          //Update the navMenu store data.
          var cNode = navMenu.getRootNode().findChildBy( function () {
            var toCh, nodeName = '';
            if ( this.data.leaf ) {
              toCh = this.data.text.indexOf( '<' ) - 1;
              if ( toCh <= 0 ) toCh = this.data.text.lenth - 1;
              nodeName = this.data.text.substring( 0, toCh ).trim();
            }
            return nodeName == tmpStr;
          }, null, true );
          if ( cNode != null ) {
            toCh = cNode.data.text.indexOf( '<' ) - 1;
            nodeName = cNode.data.text.substring( 0, toCh ).trim();

            fromCh = cNode.data.text.indexOf( '[' ) + 1;
            toCh = cNode.data.text.indexOf( ']' );
            var tStr = cNode.data.text.substring( 0, fromCh ) + targetWeight + cNode.data.text.substring( toCh, cNode.data.text.length );
            cNode.data.text = tStr;
          }
          sumWeights( tmpStr );

          var treeMenu = Ext.getCmp( 'ToolTree' );
          treeMenu.setRootNode( navMenu.getRootNode() );  // by resetting root node to the treepanel, forces it to reload and update view.

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
    this.setTitle( aTitle + ' functions ' );
    var funcRec = funcStore.findRecord( 'functionName', aTitle );
    if ( funcRec != null ) {
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

//#region load Function Data
//sum all children's weight and assign to the parent's total weight.
function getParentOf( pNode, aTitle ) {
  var cNode, tNode = null, tStr, toCh;
  if ( pNode.hasChildNodes() ) {
    cNode = pNode.firstChild;
    while ( cNode ) {
      toCh = cNode.data.text.indexOf( '<' ) - 1;
      tStr = cNode.data.text.substring( 0, toCh ).trim();
      if ( tStr == aTitle ) return pNode;
      tNode = getParentOf( cNode, aTitle )
      if ( tNode != null ) return tNode;
      cNode = cNode.nextSibling;
    }
    return null;
  }

  if ( cNode != null ) {
    cNode = cNode.nextSibling;
    if ( cNode != null ) {
      tNode = getParentOf( cNode, aTitle );
      if ( tNode != null ) return tNode;
    }
  }
  return null;
}

function sumWeights( aTitle ) {
  var totalWeight = 0, toCh, fromCh, nodeName;
  var wgt = 0;
  var cNode = null;
  var pNode = getParentOf( navMenu.getRootNode(), aTitle );
  if ( ( pNode != null ) && ( pNode.hasChildNodes() ) ) {
    cNode = pNode.firstChild;

    while ( cNode ) {
      toCh = cNode.data.text.indexOf( '<' ) - 1;
      if ( toCh <= 0 ) toCh = cNode.data.text.lenth - 1;
      nodeName = cNode.data.text.substring( 0, toCh ).trim();

      var func = funcStore.findRecord( 'functionName', nodeName );
      if ( func != null ) {
        wgt = func.data.weight;
        totalWeight = totalWeight + wgt;
      }
      cNode = cNode.nextSibling;
    }

    fromCh = pNode.data.text.indexOf( '[' ) + 1;
    toCh = pNode.data.text.indexOf( ']' );

    //write the weight back to the parent node.
    var tStr = pNode.data.text.substring( 0, fromCh ) + totalWeight + pNode.data.text.substring( toCh, pNode.data.lenth );
    pNode.data.text = tStr;
  }
}

function loadData() {
  var cNode = navMenu.getRootNode();
  if ( cNode.hasChildNodes() ) {
    var totalWeight = pushChildNodes( cNode.firstChild );
    fromCh = cNode.data.text.indexOf( '[' ) + 1;
    toCh = cNode.data.text.indexOf( ']' );
    cNode.data.text = cNode.data.text.substring( 0, fromCh ) + totalWeight + cNode.data.text.substring( toCh, cNode.data.lenth );
  }
}


var cnt = 0;
function pushChildNodes( fNode ) {
  var nodeName, fromCh, toCh, tmpStr, weights, totalWeight = 0.00;
  var min, max;
  //var maxWeight = 0.00;
  var cNode = fNode;

  while ( cNode ) {
    if ( cNode.data.leaf ) {
      toCh = cNode.data.text.indexOf( '<' ) - 1;
      if ( toCh <= 0 ) toCh = cNode.data.text.lenth - 1;
      nodeName = cNode.data.text.substring( 0, toCh ).trim();


      var func = funcStore.findRecord( 'functionName', nodeName );
      if ( !func ) {
        func = createUtilsRecord( nodeName );
        funcStore.insert( cnt, func );
      }

      weights = func.data.weight;
      totalWeight = totalWeight + weights;

      fromCh = cNode.data.text.indexOf( '[' ) + 1;
      toCh = cNode.data.text.indexOf( ']' );

      cNode.data.text = cNode.data.text.substring( 0, fromCh ) + weights + cNode.data.text.substring( toCh, cNode.data.lenth );
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



//#region Randomize Utilities

function randomNormal() {
  return Math.cos( 2 * Math.PI * Math.random() ) * Math.sqrt( -2 * Math.log( Math.random() ) )
}

function normalDistribution( min, max, mean, std ) {

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

  if ( !std || std == 0.0 ) {
    //we don't have std, calculate it: a sample of 10 point.
    var Y = 0.0;
    var norm2 = 0;
    for ( var i = 0; i < 10; i++ ) {
      norm2 = Math.pow(( randomNormal() * ( max - min ) - mean ), 2 )
      Y = Y + norm2;
    }
    norm2 = Math.sqrt( Y / 10 );
    std = norm2;
  }
  var ND = norm / std + mean;
  console.log( 'min: ' + min + ', max: ' + max + ', mean: ' + mean + ', std: ' + std + ', Norm: ' + norm + ', ND: ' + ND );
  return ND;
}
//#endregion
//#region utilities 
//just in case IE8 or earlier.
if ( !String.prototype.trim ) {
  String.prototype.trim = function () {
    return this.replace( /^\s+|\s+$/g, '' );
  }
}

function getMode( id ) {
  if ( id == 0 ) return 'Less is better';
  else return 'More is better';
}

function createUtilsRecord( aName ) {
  switch ( aName ) {
    case 'LCOE': return Ext.create( 'MyApp.FunctionUtils', { functionName: aName, minValue: 100, maxValue: 200, increment: 1, target: 144, slope: 50, mode: getMode( 0 ), weight: Math.random() * 100 } );
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
//#endregion


var puWin = Ext.create( 'Ext.FunctionViewWindow' );
funcStore.load( {
  scope: this,
  callback: function ( records, operation, success ) {
    loadData();
  }
} );


//#region onReady

( function ( pvM ) {
  pvM.onReady( function () {

    //display the function utilities window.
    $( '#ToolTree' ).on( {
      click: function ( ev ) {
        ev.stopPropagation();
        currentMenu = $( this ).parent();
        var tmpStr = $( this ).parent().text();
        tmpStr = tmpStr.substring( 0, tmpStr.indexOf( '[' ) ).trim();
        puWin.showing( tmpStr ).show();
      }
    }, '.funcButton' );

  } );
} )( pvMapper );
//#endregion
