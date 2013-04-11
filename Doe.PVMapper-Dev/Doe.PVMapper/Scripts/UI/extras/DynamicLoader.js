

function loadScriptFile( filename ) {
  var fileref = document.createElement( 'script' );
  fileref.setAttribute( 'type', 'text/javascript' );
  fileref.setAttribute( 'src', filename );
  if ( typeof fileref == 'undefined' )
    document.getElementsByTagName( 'head' )[0].appendChild( fileref );
}

function loadExternalCSS( hrefCSS ) {
  $( "<link/>" )
      .appendTo( "head" )
      .attr( { rel: "stylesheet", type: "text/css", href: hrefCSS } ); 
}




