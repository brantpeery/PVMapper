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
var stateWindowWidth=550;

Ext.define( 'Ext.PieWindow', {
  extend: 'Ext.window.Window',
  minWidth: 200,
  minHeigh: 0,
  title: 'Category',
  height: 500,
  width: stateWindowWidth,
  floating: true,
  collapsible: true,
  layout: 'fit',
  closeAction: 'hide',
  draggable: true,
  model: false,
  initComponent: function () {
    

    var me = this;
    me.items = [
      Ext.create( 'Ext.form.Panel', {
        id: 'pie-view-panel-id',
        width: stateWindowWidth,
        height: 400,
        bodyStyle: 'padding: 5px 5px 0',
        renderTo: Ext.getBody(),
        defaults: {
          anchor: '100%'
        },
        items: [{
          xtype: 'chart',
          animate: true,
          width: stateWindowWidth,
          height: 400,
          theme: 'Base:gradients',

          insetPadding: 5,
          legend: {
            position: 'right'
          },
          shadow: true,
          store: pieStore,
          series: [{
            type: 'pie',
            angleField: 'Data',
            showInLegend: true,
            highlight: {
              segment: {
                margin: 20
              }
            },
            tips: {
              trackMouse: true,
              minWidth: 100,
              maxWidth: 550,
              height: 60,
              renderer: function ( storeItem, item ) {
                //calculate and display percentage on hover
                var total = 0;
                pieStore.each( function ( rec ) {
                  total += rec.get( 'Data' );
                } );
                this.setTitle( storeItem.get( 'Category' ) + ':' + storeItem.get( 'Data' ) + ' (' + Math.round( storeItem.get( 'Data' ) / total * 100 ) + '%)' );

              }
            },
            label: {
              field: 'Category',
              display: 'rotate',
              contrast: true,
              font: '18px Arial'
            }
          }]
          , interactions: ['rotate']
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
  , collapse: function ( d, a ) {

    stateWindowWidth = this.getWidth();
    this.setWidth( 40 );
    var c = this.callParent( arguments );
    return c;

  }
  , expand: function ( a ) {
    var c = this.callParent( arguments );
    c.setWidth( stateWindowWidth );
    return c;

  }
  , showing: function ( aTitle ) {
    pieStore.data.clear();
    loadPieData( aTitle );
    this.setTitle( aTitle );
    return this;
  },
  
} );
//#endregion

//#region load Pie Data
function loadPieData( aTitle ) {
  // get the parent node to which matched parameter aTitle.
  var cNode = navMenu.getRootNode().findChildBy( function () {
    var toCh, nodeName = '';
    if ( !this.data.leaf ) {
      toCh = this.data.text.indexOf( '<' ) - 1;
      if ( toCh <= 0 ) toCh = this.data.text.lenth - 1;
      nodeName = this.data.text.substring( 0, toCh ).trim();
    }
    return nodeName == aTitle;
  }, null, true );

  //for each child node, create a new record and add ot the pieStore.
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
var pieWin = Ext.create( 'Ext.PieWindow' );

//#region onReady

( function ( pvM ) {
//  var pieWin;
  pvM.onReady( function () {
    //display the Pie popup window
    $( '#ToolTree' ).on( {
      click: function ( ev ) {
        ev.stopPropagation();

        var tmpStr = $( this ).parent().text();
        tmpStr = tmpStr.substring( 0, tmpStr.indexOf( '[' ) ).trim();
        pieWin.showing( tmpStr ).show();
      }
    }, '.funcCategory' );

  } );

} )( pvMapper );
//#endregion

