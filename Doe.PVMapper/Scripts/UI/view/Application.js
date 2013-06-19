Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        GeoExt : "/Scripts/GeoExt"
    }
});


var app = Ext.application({
    name: 'MainApp',
    requires: [
        'Ext.container.Viewport',
        'GeoExt.panel.Map',
        'GeoExt.panel.Legend',
        'GeoExt.container.LayerLegend',
        'GeoExt.container.WmsLegend',
        'GeoExt.container.VectorLegend',
        'GeoExt.container.UrlLegend'
    ],
    appFolder: '/Scripts/UI',
    autoCreateViewport: true,

    launch: function () {
        //Ext.Loader.setPath('GeoExt', "/Scripts/GeoExt");
        //Ext.Loader.setPath( 'MainApp', '/Scripts/UI' );

        if (console) console.log('launching application');

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
                        new OpenLayers.Control.LayerSwitcher({ 'ascending': true }),
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

        // create a layer store for the map
        var layerStore = new GeoExt.data.LayerStore({
            map: map,
        });

        var legendPanel = new GeoExt.LegendPanel({
            title: 'Legend',
            layerStore: layerStore,
            filter: function(record) {
                return (record.getLayer() !== pvMapper.siteLayer);
            },
            width: 200,
            minWidth: 150,
            maxWidth: 400,
            split: true,
            collapsible: true,
            collapsed: true,
            animCollapse: true,
            autoScroll: true,
            region: 'east'
        });

        //Create the panel the map lives in
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            id: 'mapPanel',
            title: null,
            header:false,
            map: map,
            extent: usBounds, // <-- this doesn't actually change the visible extent of our map at all
            stateful: true,
            region: 'center',
            stateId: 'mapPanel',
        });

        var mainPanel = new Ext.Container({
            //title: 'Border Layout',
            layout: 'border',
            items: [mapPanel, legendPanel]
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
        //Ext.ComponentQuery.query('#maincontent').add(mapPanel);

        if (console) console.log('Signaling that the pvMapper object is ready to go');
        pvMapper.readyEvent.fire();
    },
});
