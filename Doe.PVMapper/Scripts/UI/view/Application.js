// configure search paths for Ext require()
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        GeoExt: "/Scripts/GeoExt",
        MainApp: "/Scripts/UI"
    }
});

// requirements for layer list and legend
Ext.require([
    'Ext.layout.container.Border',
    'GeoExt.tree.Panel',
    //'Ext.tree.plugin.TreeViewDragDrop',
    'GeoExt.panel.Map',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
    'GeoExt.tree.View',
    'GeoExt.data.LayerTreeModel',
    'GeoExt.container.LayerLegend',
    'GeoExt.container.WmsLegend',
    'GeoExt.container.VectorLegend',
    'GeoExt.container.UrlLegend',
    'GeoExt.tree.Column',
    'MainApp.view.Window',
    'MainApp.view.Viewport'
]);

var app = Ext.application({
    name: 'MainApp',
    requires: [
        'Ext.container.Viewport',
        'GeoExt.panel.Map'
    ],
    appFolder: '/Scripts/UI',
    autoCreateViewport: true,

    launch: function () {
        // Test for IE 8
        if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
            // found IE 8 - produce fail message (it's better than failing without a message)
            Ext.MessageBox.show({
                title: 'Browser Support',
                closable: false,
                msg: "We're sorry, but the present version of PV Mapper does not support Internet Explorer 8.<br>" +
                    "Please bear with us as we expand browser comatability after the beta test period.",
                buttons: [],
            });
            return;
        } 

        if (console) console.log('launching application');

    //connect to local indexedDB database.
    pvMapper.ClientDB.initClientDB();

        // set the theme for OpenLayers
        OpenLayers.ImgPath = "/Content/OpenLayers/default/img/";

        ///--------------------------Set the map stuff up--------------------------------------------
        // track map position 
        Ext.state.Manager.setProvider(
            Ext.create('Ext.state.CookieProvider', {
                expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)) //7 days from now
            }));

        //Create default map controls
        var controls = [new OpenLayers.Control.Navigation(),
                        //new OpenLayers.Control.PanPanel(), // <-- these two pan/zoom controls use CSS styling
                        //new OpenLayers.Control.ZoomPanel(),
                        new OpenLayers.Control.PanZoomBar(), // <-- this pan/zoom control is styled by images
                        new OpenLayers.Control.Attribution(),
                        new OpenLayers.Control.ScaleLine(),
                        //new OpenLayers.Control.MousePosition(),
                        //new OpenLayers.Control.LayerSwitcher({ 'ascending': true }), // <-- replaced by fancy GeoExt stuff
        ];

        //Create the map
        var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
        var map = new OpenLayers.Map({
            // These projections are all webmercator, but the openlayers layer wants 900913 specifically
            projection: new OpenLayers.Projection("EPSG:3857"), //3857 //4326            900913
            units: "m",
            numZoomLevels: 16,
            //maxExtent: usBounds, <-- that stopped base layers from drawing out of bounds
            //restrictedExtent: usBounds, <-- this was annoying
            //center: '-10723197, 4500612',
            controls: controls,
            theme: "/Content/OpenLayers/default/style.css",
        });

        var layerTreeStore = Ext.create('Ext.data.TreeStore', {
            model: 'GeoExt.data.LayerTreeModel',
            root: {
                children: [{
                    text: "Base Maps",
                    expanded: true,
                    plugins: ['gx_baselayercontainer']
                }, {
                    text: "Tool Data",
                    expanded: true,
                    plugins: [{
                        ptype: "gx_overlaylayercontainer",
                        loader: {
                            createNode: function (attr) {
                                // add a WMS legend to each WMS node created
                                if (attr.layer instanceof OpenLayers.Layer.WMS) {
                                    attr.component = {
                                        xtype: "gx_wmslegend",
                                        layerRecord: mapPanel.layers.getByLayer(attr.layer),
                                        showTitle: false,
                                        style: "padding-left: 46px;",
                                        hidden: !attr.layer.getVisibility()
                                    };
                                }
                                return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
                            },
                            filter: function (record) {
                                return record.raw != pvMapper.siteLayer && !record.raw.isBaseLayer &&
                                    !record.raw.isReferenceLayer;
                            }
                        }
          }]
                }, {
                    text: "Reference",
                    expanded: true,
                    plugins: [{
                        ptype: "gx_overlaylayercontainer",
                        loader: {
                            createNode: function (attr) {
                                // add a WMS legend to each WMS node created
                                if (attr.layer instanceof OpenLayers.Layer.WMS) {
                                    attr.component = {
                                        xtype: "gx_wmslegend",
                                        layerRecord: mapPanel.layers.getByLayer(attr.layer),
                                        showTitle: false,
                                        style: "padding-left: 46px;",
                                        hidden: !attr.layer.getVisibility()
                                    };
                                }
                                return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
                            },
                            filter: function (record) {
                                return record.raw != pvMapper.siteLayer && !record.raw.isBaseLayer &&
                                    record.raw.isReferenceLayer;
                            }
                        }
                    }]
                }]
            }
        });

        var layerPanel = new GeoExt.tree.Panel({
            title: "Layers",
            viewConfig: {
                plugins: [{
                    ptype: 'treeviewdragdrop',
                    appendOnly: false
                }]
            },
            store: layerTreeStore,
            rootVisible: false,
            lines: false,

            width: 200,
            minWidth: 150,
            maxWidth: 400,
            split: true,
            collapsible: true,
            //collapsed: true,  //Note: uncommenting this will break stuff (GeoExt needs this to be rendered right away)
            animCollapse: true,
            autoScroll: true,
            region: 'east'
        });

        // if we can't have this start collapsed initially, let's have it collapse half a second after loading the page. It'll be cute.
        window.setTimeout(function () { layerPanel.collapse(); }, 500);

        //Create the panel the map lives in
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            id: 'mapPanel',
            title: null,
      header: false,
            map: map,
            extent: usBounds, // <-- this doesn't actually change the visible extent of our map at all
            stateful: true,
            region: 'center',
            stateId: 'mapPanel',
        });

        var mainPanel = new Ext.Container({
            layout: 'border',
            items: [mapPanel, layerPanel]
        });

        this.mainContent = Ext.ComponentQuery.query('#maincontent')[0];
        this.mainContent.add(mainPanel);

        pvMapper.mapPanel = mapPanel;
        pvMapper.map = map;

        //map.zoomToExtent(usBounds, true); <-- this didn't help at all

        //Insert the site layer
        pvMapper.siteLayer = new OpenLayers.Layer.Vector("Sites");
        pvMapper.siteLayer.id = "SiteLayer";

        //pvMapper.selectControl = new OpenLayers.Control.SelectFeature(pvMapper.siteLayer);

        ///--------------------------END Set the map stuff up--------------------------------------------

        ///--------------------------Set the toolbar stuff up--------------------------------------------
        pvMapper.mapToolbar = Ext.ComponentQuery.query('#maintoolbar')[0];

        pvMapper.sitesToolbarMenu = Ext.ComponentQuery.query('#maintoolbar-sitessmenu')[0].menu;
        pvMapper.scoreboardToolsToolbarMenu = Ext.ComponentQuery.query('#maintoolbar-scoreboardtoolsmenu')[0].menu;
        pvMapper.reportsToolbarMenu = Ext.ComponentQuery.query('#maintoolbar-reportsmenu')[0].menu;
        pvMapper.linksToolbarMenu = Ext.ComponentQuery.query('#maintoolbar-linksmenu')[0].menu;

        //Ext.ComponentQuery.query('#maincontent').add(mapPanel);

        if (console) console.log('Signaling that the pvMapper object is ready to go');
        pvMapper.readyEvent.fire();
    },
});
