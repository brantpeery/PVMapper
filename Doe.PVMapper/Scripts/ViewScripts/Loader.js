/// <reference path="../_references.js" />
/// <reference path="../jquery-1.8.0.intellisense.js" />
/// <reference path="UtilityWeights.js" />
/// <reference path="UtilityFunctions.js" />



Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        GeoExt: "/Scripts/GeoExt",
        Ext: "http://cdn.sencha.io/ext-4.1.0-gpl/src"
    }
});

Ext.Loader.setPath('Ext.ux.plugins.FitToParent', '/Scripts/extExtensions/FitToParent.js');
Ext.require([
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
]);

Ext.application({
    name: 'MyApp',
    launch: function () {

        // track map position 
        Ext.state.Manager.setProvider(
            Ext.create('Ext.state.CookieProvider', {
                expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)) //7 days from now
            }));

        var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
        var map = new OpenLayers.Map({
            // These projections are all webmercator, but the openlayers layer wants 900913 specifically
            projection: new OpenLayers.Projection("EPSG:900913"), //3857 //4326
            units: "m",
            numZoomLevels: 16,
            restrictedExtent: usBounds
        });
        var toolbarItems = [];
        mapPanel = Ext.create('GeoExt.panel.Map', {
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
        });

        pvMapper.mapToolbar = mapPanel.child('#map-toolbar-id');

        Ext.create('MyApp.RootPanel');

        // fire the pvMapper.onReady event
        pvMapper.map = map;
        $("body").trigger("pvMapper-ready");

    }
});


Ext.define( 'MyApp.RootPanel', {
    id: 'MyApp-RootPanel-id',
    extend: 'Ext.Panel',
    layout: 'border',
    height: 600,
    renderTo: 'rootPanel-id',
    plugins: ['fittoparent'],

    initComponent: function ()
    {
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

      //var store = Ext.create( 'Ext.data.TreeStore', {
      //  proxy: {
      //    type: 'ajax',
      //    url: '/api/Tools'
      //  }
      //} );


      var navMenu = Ext.create( 'Ext.data.TreeStore', {
        root: {
          expanded: true,
          children: [
            {
              checked: false,
              text: "Cost",
              expanded: true,
              children: [
                {
                  checked: false,
                  text: "Land Cost",
                  expanded: true,
                  children: [
                    { text: "Site Area <img id='Cost_Land-Cost_Site-Area' class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: true },
                    { text: "Offset Area <img id='Cost_Land-Cost_Offset-Area' class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                    { text: "Zone Type <img id='Cost_Land-Cost_Zone-Type' class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false }]
                  
                },
                {
                  text: "Facility Cost", checked: false,
                  children: [
                    { text: "Solar Panel System Cost <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                    { text: "Buildings <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                    { text: "Physical Security <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false }]
                },
                {
                  checked: false,
                  text: "Transmission Connection Cost",
                  children: [
                    { text: "Right of Way Lease Cost<img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                    { text: "Transmission Lines Cost<img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                    { text: "Terminating Equipment Cost<img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leave: true, checked: false }
                  ]
                },
                { text: "Permitting Cost <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false }
              ]
            },
            {
              checked: false,
              text: "Energy",
              children: [
                { text: "Power Output MW <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                { text: "Intermittncy <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                { text: "Power Purchase Contract Risk <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false }
              ]
            },
            {
              checked: false,
              text: "Environment",
              children: [
                { text: "Endangered Species <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                { text: "Water Quality <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                { text: "Air Emissions <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                { text: "Viewshed <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false }
              ]
            },
            {
              checked: false,
              text: "Social",
              children: [
                { text: "Public Acceptablity <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false },
                { text: "Housing Proximity <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>", leaf: true, checked: false }
              ]
            }
          ]
        }


      } );


      var treePanel = Ext.create( 'Ext.tree.Panel', {
        
        border: false,
        width: 200,
        store: navMenu,
        rootVisible: false,
        useArrows: true,
        buttons: [
          { text: 'Apply',
            handler:function (){alert( "Hey!" ) }
          },
          { text: 'Cancel' }
        ],


        listeners: {
          itemclick: {
            fn: function ( view, record, item, index, e )
            {

            }
          },
          checkchange: {
            fn: function ( node, check )
            {

              if ( check )
              {

                $.getScript( node.raw.url )
                    .done( function ( script, textStatus )
                    {
                    } )
                    .fail( function ( jqxhr, settings, exception )
                    {
                      console.log( exception );
                      pvMapper.displayMessage( "Could not load tool." );
                    } );
              }

            }
          }

        }
      } );

      
//      Ext.select( '#Cost_Land-Cost_Site-Area' ).on( 'click', function () { alert( "Woo!!!" ) } );
      //Ext.select( '#Cost_Land-Cost_Site-Area' ).on( 'click', alert( "Woo!!!" ) );
      //$( '#Cost_Land-Cost_Offset-Area' ).bind( {
      //  click: function () { alert( 'Wee!!!' ) }
      //});
      //$( '#Cost_Land-Cost_Zone-Type' ).bind( 'click', alert( 'Hey!!!' ) );

      this.items = [{
        title: 'Properties',
        region: 'west',
        layout: 'fit',
        width: 175,
        minSize: 100,
        collapsible: true,
        split: true,
        items: [treePanel]
      }, tabPanel]

      me.callParent( arguments );
    }
} );


//( function ( pvM )
//{
//  pvM.onReady( function ()
//  {
//    $( '#Cost_Land-Cost_Offset-Area' ).bind( {
//      click: function () { alert( 'Wee!!!' ) }
//    } );

//    $( '#Cost_Land-Cost_Zone-Type' ).bind( { click: function () { alert( 'Hey!!!' ) } } );
// } );
//} )( pvMapper );