
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
  f2.Y = ( Ext.getCmp( 'function-mode' ).value == 'More is better' ) ? UtilityFunctions.utilityFunction1 : UtilityFunctions.utilityFunction2;

  if ( target.maxValue - target.minValue != 0 ) {
    var diff = target.maxValue - target.minValue;
    board.setBoundingBox( [target.minValue - diff * .1, 1.1, target.maxValue + diff * .1, -.1] );
    board.update();
  }
}

var UtilityFunctions = {
  utilityFunction1: function ( x ) {
    return 1 - UtilityFunctions.utilityFunction2( x );
  },

  utilityFunction2: function ( x ) {
    var l = parseInt( $( "#target-MinValue-inputEl" ).val() );
    var b = parseInt( $( "#function-target-inputEl" ).val() );
    var h = parseInt( $( "#target-MaxValue-inputEl" ).val() );
    var sRatio = ( parseInt( $( "#function-slope-inputEl" ).val() ) / 5 ) + .3;
    var y = 0;

    var s = Math.min( -2 / ( b - l ), -2 / ( h - b ) );
    s = s * ( sRatio );

    if ( x >= h ) y = 0;
    else if ( x <= l ) y = 1;
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

( function ( pvM ) {
  pvM.onReady( function () {
    pvMapper.functionWin = Ext.create( 'MainApp.view.FunctionWindow' );
    if ( typeof ( JXG ) == "undefined" ) {
      console.log( "Loading in the JXG Graph script" );
      loadExternalCSS( "http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" );
      $.getScript( "http://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.93/jsxgraphcore.js", function () {
        loadBoard();
      } );
    }
    else loadBoard();
  } )
} )( pvMapper );

