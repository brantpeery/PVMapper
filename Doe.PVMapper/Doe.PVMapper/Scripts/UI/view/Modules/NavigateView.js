﻿
//#region RootPanel
Ext.define( 'MainApp.view.NavigateWindow', {
  extend: 'MainApp.view.Window',
  title: 'Properties',
  height: 600,
  Width: 300,
  x: 100,
  y: 100,
  closeAction: 'hide',
  renderTo: 'maincontent-body',
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




( function ( pvM ) {
  //  var pieWin;
  pvM.onReady( function () {
    console.log( 'Application ready state' );

    //display the Pie popup window
    //funcStore.load( {
    //  scope: this,
    //  callback: function ( records, operation, success ) {
    //    loadData();
    //  }
    //} );

    pvMapper.navigateWin = Ext.create( 'pvMapper.NavigateWindow' );
    pvMapper.navigateWin.show();
    
    //pvMapper.functionWin = Ext.create( 'Ext.PopupWindow' );
    //loadBoard();

    //pvMapper.pieWin = Ext.create( 'pvMapper.PieWindow' );


    $( '#ToolTree' ).on( {
      click: function ( ev ) {
        ev.stopPropagation();

        var tmpStr = $( this ).parent().text();
        tmpStr = tmpStr.substring( 0, tmpStr.indexOf( '[' ) ).trim();
        pvMapper.pieWin.showing( tmpStr ).show();
      }
    }, '.funcCategory' );

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

} )( pvMapper );

