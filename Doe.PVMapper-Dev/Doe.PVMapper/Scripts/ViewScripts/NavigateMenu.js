
////#region   Menu DataStore
//var imgLink = "   <img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'/>  <label class='funcWeight'>[0.00] </label>"
//var catLink = "   <img class='funcCategory' src='http://localhost:1919/Images/Pie Chart.png'/>  <label class='funcWeight'>[0.00] </label>"
//var navMenu = Ext.create( 'Ext.data.TreeStore', {
//  root: {
//    text: 'Overall ' + catLink,
//    expanded: true,
//    children: [

//    //  {
//    //  checked: false,
//    //  text: "Cost " + catLink,
//    //  expanded: true,
//    //  children: [
//    //    { text: "LCOE         " + imgLink, cls: 'menuItem', qtip: 'Levelized Cost of Energy.', leaf: true, checked: true },
//    //    { text: "IRR          " + imgLink, cls: 'menuItem', qtip: 'After-tax Internal Rate of Return.', leaf: true, checked: true },
//    //    { text: "DSCR         " + imgLink, cls: 'menuItem', qtip: 'Pre-tax min Debt Service Coverage Ratio.', leaf: true, checked: true },
//    //    { text: "NPV          " + imgLink, cls: 'menuItem', qtip: 'After-Tax Net Present Value.', leaf: true, checked: true },
//    //    { text: "Transmission " + imgLink, cls: 'menuItem', qtip: 'Cost to connect to preferred transmission line.', leaf: true, checked: true },
//    //    { text: "Incentives   " + imgLink, cls: 'menuItem', qtip: 'Index of tax and other incentives offered to promote development.', leaf: true, checked: true }
//    //  ]
//    //},
//    {
//      checked: true,
//      expanded: true,
//      text: "Energy " + catLink,
//      children: [
//        { text: "Net Annual Energy " + imgLink, cls: 'menuItem', qtip: 'Annual expected kWh generation.', leaf: true, checked: true },
//        { text: "Intermittency     " + imgLink, cls: 'menuItem', qtip: 'Index of solar radiation intermittency.', leaf: true, checked: true },
//        { text: "Contract Risk     " + imgLink, cls: 'menuItem', qtip: 'Power Purchase Agreement Risk.', leaf: true, checked: true }
//      ]
//    }, {
//      checked: false,
//      text: "Environment " + catLink,
//      children: [
//        { text: "Endangered Species " + imgLink, cls: 'menuItem', qtip: 'Index of presence of endangered species.', leaf: true, checked: false },
//        { text: "Cultural Resources " + imgLink, cls: 'menuItem', qtip: 'Index of presence of cultural resources.', leaf: true, checked: false },
//        { text: "Zoning             " + imgLink, cls: 'menuItem', qtip: 'Index of zoning risk.', leaf: true, checked: false },
//        { text: "Soil               " + imgLink, cls: 'menuItem', qtip: 'Index of soil type appropriate for development.', leaf: true, checked: false },
//        { text: "Geology            " + imgLink, cls: 'menuItem', qtip: 'Index of geology appropriate for development.', leaf: true, checked: false },
//        { text: "Water              " + imgLink, cls: 'menuItem', qtip: 'Index of adequate water is available for development.', leaf: true, checked: false }
//      ]
//    }, {
//      checked: false,
//      text: "Social " + catLink,
//      children: [
//        { text: "Public Perception " + imgLink, cls: 'menuItem', qtip: 'Index of public perception adequately positive for development.', leaf: true, checked: false }
//      ]
//    }
//    ]
//  }
//} );
////#endregion 

////#region RootPanel
//Ext.define( 'MyApp.RootPanel', {
//  id: 'MyApp-RootPanel-id',
//  extend: 'Ext.Panel',
//  layout: 'border',
//  height: 600,
//  renderTo: 'rootPanel-id',
//  plugins: ['fittoparent'],

//  initComponent: function () {
//    var me = this;

//    var tabPanel = Ext.create( 'Ext.tab.Panel',
//        {
//          collapsible: false,
//          region: 'center',
//          layout: 'fit',
//          border: false,
//          items: [mapPanel]
//        } );

//    pvMapper.tabs = tabPanel;

//    //#region Data Store From Server
//    //var store = Ext.create( 'Ext.data.TreeStore', {
//    //  proxy: {
//    //    type: 'ajax',
//    //    url: '/api/Tools'                                                                                        
//    //  }                                                                                                              
//    //} );                     
//    //#endregion
//    //#region treePanel
//    var treePanel = Ext.create( 'Ext.tree.TreePanel', {
//      id: "ToolTree",
//      border: false,
//      //width: 300,
//      store: navMenu,
//      rootVisible: true,
//      useArrows: true,
//      buttons: [
//        {
//          text: 'Apply',
//          handler: function () { alert( "Hey!" ) }
//        },
//        { text: 'Cancel' }
//      ],


//      listeners: {

//        itemclick: {
//          fn: function ( view, record, item, index, e ) {

//          }
//        },
//        checkchange: {
//          fn: function ( node, check ) {
//            if ( check ) {
//              $.getScript( node.raw.url )
//                  .done( function ( script, textStatus ) {
//                  } )
//                  .fail( function ( jqxhr, settings, exception ) {
//                    if (console) console.log( exception );
//                    pvMapper.displayMessage( "Could not load tool." );
//                  } );
//            }

//          }
//        }
//      }
//    } );
//    //#endregion

//    this.items = [{
//      title: 'Properties',
//      region: 'west',
//      layout: 'fit',
//      width: 200,
//      minSize: 100,
//      collapsible: true,
//      split: true,
//      items: [treePanel]
//    }, tabPanel]

//    me.callParent( arguments );
//  }
//} );
////#endregion

