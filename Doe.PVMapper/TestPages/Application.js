Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false
});



var app = Ext.application({
    name: 'MainApp',
    requires: ['Ext.container.Viewport'],
    appFolder: '/Scripts/UI',
    autoCreateViewport: true,

    launch: function () {
        Ext.Loader.setPath('GeoExt', "/Scripts/GeoExt");
        Ext.Loader.setPath( 'MainApp', '/Scripts/UI' );

        console.log('launching application');

        ///--------------------------Set the map stuff up--------------------------------------------
        // track map position 
        Ext.state.Manager.setProvider(
            Ext.create('Ext.state.CookieProvider', {
                expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)) //7 days from now
            }));


        //Create the map
        var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
        var map = new OpenLayers.Map({
            // These projections are all webmercator, but the openlayers layer wants 900913 specifically
            projection: new OpenLayers.Projection("EPSG:900913"), //3857 //4326
            units: "m",
            numZoomLevels: 16,
            restrictedExtent: usBounds,
            center: '-10723197, 4500612' 
        });

        /*var gphy = new OpenLayers.Layer.Google(
            "Google Physical",
            { type: G_PHYSICAL_MAP, sphericalMercator: true }
        );

        map.addLayer(gphy);*/

        var wfs = new OpenLayers.Layer.Vector("Test Layer",
            {});

        //Add PanZoom controls
        var controls = [new OpenLayers.Control.PanPanel(),
                        new OpenLayers.Control.ZoomPanel()]
        map.addControls(controls);

        //Create the panel the map lives in
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            id: 'mapPanel',
            title: null,
            header:false,
            map: map,
            zoom: 0,
            center: [-10723197, 4500612],
            stateful: true,
            stateId: 'mapPanel',
        });

        map.addControl(new OpenLayers.Control.PanZoomBar());

        this.mainContent = Ext.ComponentQuery.query('#maincontent')[0];
        this.mainContent.add(mapPanel);
        pvMapper.mapPanel = mapPanel;
        pvMapper.map = map;

        ///--------------------------END Set the map stuff up--------------------------------------------

        ///--------------------------Set the toolbar stuff up--------------------------------------------
        pvMapper.mapToolbar = Ext.ComponentQuery.query('#maintoolbar')[0];
        //Ext.ComponentQuery.query('#maincontent').add(mapPanel);

        console.log('Signaling that the pvMapper object is ready to go');
        pvMapper.readyEvent.fire();
    },
});
