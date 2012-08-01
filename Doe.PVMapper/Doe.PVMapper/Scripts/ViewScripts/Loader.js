
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        GeoExt: "../../Scripts/GeoExt",
        Ext: "http://cdn.sencha.io/ext-4.1.0-gpl/src"
    }
});

Ext.Loader.setPath('Ext.ux.plugins.FitToParent', '/Scripts/extExtensions/FitToParent.js');Ext.require([    'Ext.panel.*',    'Ext.tab.*',    'Ext.ux.plugins.FitToParent',    'Ext.state.Manager',
    'Ext.state.CookieProvider',    'Ext.layout.container.Border',    'Ext.container.Viewport',
    'Ext.window.MessageBox',
    'Ext.data.TreeStore',
    'Ext.tree.Panel',
    'GeoExt.panel.Map',
    'GeoExt.Action']);
Ext.application({
    name: 'MyApp',
    launch: function () {

        // track map position 
        Ext.state.Manager.setProvider(
            Ext.create('Ext.state.CookieProvider', {
                expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)) //7 days from now
            }));

        // display tooltips for actions
        // Ext.QuickTips.init();
        var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
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
            title: 'Map',
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


Ext.define('MyApp.RootPanel', {
    extend: 'Ext.Panel',
    layout: 'border',
    height: 600,
    renderTo: 'rootPanel-id',
    plugins: ['fittoparent'],

    initComponent: function () {
        var me = this;

        var tabPanel = Ext.create('Ext.tab.Panel',            {
                collapsible: false,
                region: 'center',
                layout: 'fit',                border: false,                items: [mapPanel]
            });

        pvMapper.tabs = tabPanel;

        var store = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: '/api/Tools'
            }
        });

        var treePanel = Ext.create('Ext.tree.Panel', {
            border: false,
            width: 200,
            store: store,
            rootVisible: false,
            useArrows: true,
            listeners: {
                itemclick: {
                    fn: function (view, record, item, index, e) {

                    }
                },
                checkchange: {
                    fn: function (node, check) {

                        if (check) {

                            $.getScript(node.raw.url)
                                .done(function (script, textStatus) {
                                    pvMapper.displayMessage("Ran " + node.raw.text);
                                })
                                .fail(function (jqxhr, settings, exception) {
                                    console.log(exception);
                                    pvMapper.displayMessage("Could not load tool.");
                                });
                        }

                    }
                }

            }
        });

        this.items = [{
            title: 'Tools',
            region: 'west',
            layout: 'fit',
            width: 175,
            minSize: 100,
            collapsible: true,
            collapsed: true,
            split: true,
            items: [treePanel]
        }, tabPanel]

        pvMapper.tabs.add(
            {
                // we use the tabs.items property to get the length of current items/tabs
                title: 'Scoreboard',
                layout: 'fit',
                html: "scoreboard goes here. should it be processed client-side or on the server?",
                loader: {
                    url: 'ajax1.htm',
                    contentType: 'html',
                    loadMask: true
                },
                listeners: {
                    activate: function (tab) {
                        //tab.loader.load();
                        //    var SaleRecord = Ext.data.Record.create([
                        //    { name: 'person', type: 'string' },
                        //    { name: 'product', type: 'string' },
                        //    { name: 'city', type: 'string' },
                        //    { name: 'state', type: 'string' },
                        //    { name: 'month', type: 'int' },
                        //    { name: 'quarter', type: 'int' },
                        //    { name: 'quantity', type: 'int' },
                        //    { name: 'value', type: 'int' }
                        //    ]);

                        //    var myStore = new Ext.data.Store({
                        //        url: 'json.txt',
                        //        autoLoad: true,
                        //        reader: new Ext.data.JsonReader({
                        //            root: 'rows',
                        //            idProperty: 'id'
                        //        }, SaleRecord)
                        //    });

                        //    var pivotGrid = new Ext.grid.PivotGrid({
                        //        width: 600,
                        //        height: 259,
                        //        renderTo: 'scoreboard-id',
                        //        store: myStore,
                        //        aggregator: 'sum',
                        //        measure: 'quarter',

                        //        leftAxis: [
                        //           {
                        //               width: 190,
                        //               dataIndex: 'product'
                        //           }
                        //        ],

                        //        topAxis: [
                        //            {
                        //                dataIndex: 'city'
                        //            }
                        //        ]
                        //    });
                    }
                }
            });
        me.callParent(arguments);
    }
});