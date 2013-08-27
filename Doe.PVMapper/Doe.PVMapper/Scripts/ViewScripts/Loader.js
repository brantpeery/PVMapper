///// <reference path="../_references.js" />
///// <reference path="../jquery-1.8.0.intellisense.js" />
///// <reference path="UtilityWeights.js" />
///// <reference path="UtilityFunctions.js" />

////#region Configuration 

//Ext.Loader.setConfig( {
//  enabled: true,
//  disableCaching: false,
//  paths: {
//    GeoExt: "/Scripts/GeoExt",
//    Ext: "http://cdn.sencha.io/ext-4.1.0-gpl/src"
//  }
//} );

//Ext.Loader.setPath( 'Ext.ux.plugins.FitToParent', '/Scripts/extExtensions/FitToParent.js' );
//Ext.require( [
//    'Ext.panel.*',
//    'Ext.tab.*',
//    'Ext.ux.plugins.FitToParent',
//    'Ext.state.Manager',
//    'Ext.state.CookieProvider',
//    'Ext.layout.container.Border',
//    'Ext.container.Viewport',
//    'Ext.window.MessageBox',
//    'Ext.data.TreeStore',
//    'Ext.tree.Panel',
//    'GeoExt.panel.Map',
//    'GeoExt.Action',
//    'Ext.grid.Panel',
//    'Ext.data.ArrayStore',
//    'Ext.grid.column.Action',
//    'Ext.form.field.Number',
//    'Ext.form.Label'
//] );
////#endregion

////#region Application launch
//Ext.application( {
//  name: 'MyApp',
//  launch: function () {

//    // track map position 
//    Ext.state.Manager.setProvider(
//        Ext.create( 'Ext.state.CookieProvider', {
//          expires: new Date( new Date().getTime() + ( 1000 * 60 * 60 * 24 * 7 ) ) //7 days from now
//        } ) );

//    var usBounds = new OpenLayers.Bounds( -14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284 );
//    var map = new OpenLayers.Map( {
//      // These projections are all webmercator, but the openlayers layer wants 900913 specifically
//      projection: new OpenLayers.Projection("EPSG:3857"), //3857 //4326           900913
//      units: "m",
//      numZoomLevels: 16,
//      restrictedExtent: usBounds
//    } );
//    var toolbarItems = [];
//    mapPanel = Ext.create( 'GeoExt.panel.Map', {
//      id: 'map-panel-id',
//      title: 'Site',
//      map: map,
//      zoom: 0,
//      center: [-10723197, 4500612],
//      stateful: true,
//      stateId: 'mapPanel',

//      dockedItems: [{
//        itemId: 'map-toolbar-id',
//        xtype: 'toolbar',
//        dock: 'top',
//        items: toolbarItems
//      }]
//    } );

//    pvMapper.mapToolbar = mapPanel.child( '#map-toolbar-id' );

//    var rootPanel = Ext.create( 'MyApp.RootPanel');

//    rootPanel.dockedItems = Ext.create('Ext.panel.Panel'); 
//    //, {
//    //  dockedItems: [{
//    //    itemId: 'navDockingArea',
//    //    xtype: 'panel',
//    //    dock: 'right',
//    //    items:[pieWin]
//    //  }]
//    //});

//    // fire the pvMapper.onReady event
//    pvMapper.map = map;
//    pvMapper.readyEvent.fire();
//    //$( "body" ).trigger( "pvMapper-ready" );

//  }
//} );
////#endregion
////#region onReady
//( function ( pvM ) {
//  pvM.onReady( function () {

//    if ( typeof ( JXG ) === "undefined" ) {
//      if (console) console.log( "Loading in the JXG Graph script" );
//      $( "<link/>" )
//          .appendTo( "head" )
//          .attr( { rel: "stylesheet", type: "text/css", href: "http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" } );
//      $.getScript( "http://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.93/jsxgraphcore.js", function () {
//        loadBoard();
//      } );
//    } else {
//      loadBoard();
//    }
//  } );
//} )( pvMapper );
////#endregion
