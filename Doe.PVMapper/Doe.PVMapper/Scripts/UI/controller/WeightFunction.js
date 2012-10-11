
//#region   Menu DataStore
var imgLink = "   <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>  <label class='funcWeight'>[0.00] </label>"
var catLink = "   <img class='funcCategory' src='http://localhost:1919/Images/Pie Chart.png'/>  <label class='funcWeight'>[0.00] </label>"
var navMenu = Ext.create( 'Ext.data.TreeStore', {
  root: {
    text: 'Overall ' + catLink,
    expanded: true,
    children: [

    //  {
    //  checked: false,
    //  text: "Cost " + catLink,
    //  expanded: true,
    //  children: [
    //    { text: "LCOE         " + imgLink, cls: 'menuItem', qtip: 'Levelized Cost of Energy.', leaf: true, checked: true },
    //    { text: "IRR          " + imgLink, cls: 'menuItem', qtip: 'After-tax Internal Rate of Return.', leaf: true, checked: true },
    //    { text: "DSCR         " + imgLink, cls: 'menuItem', qtip: 'Pre-tax min Debt Service Coverage Ratio.', leaf: true, checked: true },
    //    { text: "NPV          " + imgLink, cls: 'menuItem', qtip: 'After-Tax Net Present Value.', leaf: true, checked: true },
    //    { text: "Transmission " + imgLink, cls: 'menuItem', qtip: 'Cost to connect to preferred transmission line.', leaf: true, checked: true },
    //    { text: "Incentives   " + imgLink, cls: 'menuItem', qtip: 'Index of tax and other incentives offered to promote development.', leaf: true, checked: true }
    //  ]
    //},
    {
      checked: true,
      expanded: true,
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
    url: '../api/Properties',
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
//funcStore.load( {
//  scope: this,
//  callback: function ( records, operation, success ) {
//    loadData();
//  }
//} );





