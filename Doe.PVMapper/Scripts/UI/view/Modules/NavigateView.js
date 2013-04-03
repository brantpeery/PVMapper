
var currentMenu = null;
( function ( pvM ) {
  //  var pieWin;
  pvM.onReady( function () {
    if (console) console.log( 'Application ready state' );

    funcStore.load( {
      scope: this,
      callback: function ( records, operation, success ) {
        loadData();
      }
    } );

    pvMapper.navigateWin = Ext.create( 'MainApp.view.NavigateWindow' );
    pvMapper.navigateWin.show();

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
        if ( pvMapper.functionWin ) {
          pvMapper.functionWin.showing( tmpStr ).show();
          updateBoard();
        }

      }
    }, '.funcButton' );


  } );

} )( pvMapper );

