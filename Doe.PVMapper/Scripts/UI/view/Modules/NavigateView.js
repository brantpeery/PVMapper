
//#region RootPanel
Ext.define( 'pvMapper.NavigateWindow', {
  extend: 'pvMapper.Window',
  title: 'Properties',
  height: 600,
  Width: 300,
  x: 100,
  y: 100,
  closeAction: 'hide',
  initComponent: function () {
    var me = this;
    me.items = [Ext.create( 'Ext.tree.TreePanel', {
      id: "ToolTree",
      border: false,
      width: 300,
      height: 600,
      store: navMenu,
      rootVisible: true,
      useArrows: true,
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
    } )],
    //#endregion
    this.callParent( arguments );
  }
} );
//#endregion


var navWin = Ext.create( 'pvMapper.NavigateWindow' );
navWin.show();

( function ( pvM ) {
  //  var pieWin;
  pvM.onReady( function () {
    //display the Pie popup window
    $( '#ToolTree' ).on( {
      click: function ( ev ) {
        ev.stopPropagation();

        var tmpStr = $( this ).parent().text();
        tmpStr = tmpStr.substring( 0, tmpStr.indexOf( '[' ) ).trim();
        pvMapper.pieWin.showing( tmpStr ).show();
      }
    }, '.funcCategory' );

  } );

} )( Ext );

( function ( pvM ) {
  pvM.onReady( function () {

    //display the function utilities window.
    $( '#ToolTree' ).on( {
      click: function ( ev ) {
        ev.stopPropagation();
        currentMenu = $( this ).parent();
        var tmpStr = $( this ).parent().text();
        tmpStr = tmpStr.substring( 0, tmpStr.indexOf( '[' ) ).trim();
        pvMapper.functionWin.showing( tmpStr ).show();
      }
    }, '.funcButton' );

  } );
} )( Ext );

