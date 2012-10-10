Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false
});



var app = Ext.application({
    name: 'pvMapper',
    requires: ['Ext.container.Viewport'],
    appFolder: '/Scripts/UI',
    autoCreateViewport: true,

    launch: function () {
        Ext.Loader.setPath('GeoExt', "/Scripts/GeoExt");


        console.log('launching application');

        ///--------------------------Set the map stuff up--------------------------------------------
        // track map position 
        Ext.state.Manager.setProvider(
            Ext.create('Ext.state.CookieProvider', {
                expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)) //7 days from now
            }));


        //Create the map
        var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
        var map = new OpenLayers.Map('Content', {
            // These projections are all webmercator, but the openlayers layer wants 900913 specifically
            projection: new OpenLayers.Projection("EPSG:900913"), //3857 //4326
            units: "m",
            numZoomLevels: 16,
            restrictedExtent: usBounds,
            //center: [-10723197, 4500612],
            zoom:1
        });
        //map.setCenter([-10723197, 4500612], 1);
        //Creat the panel the map lives in
        //var mapPanel = Ext.create('GeoExt.panel.Map', {
        //    id: 'mapPanel',
        //    title: 'Site',
        //    map: map,
        //    zoom: 0,
        //    center: [-10723197, 4500612],
        //    stateful: true,
        //    stateId: 'mapPanel',
        //});
        //pvMapper.mapPanel = mapPanel;
        pvMapper.map = map;
        ///--------------------------END Set the map stuff up--------------------------------------------

        ///--------------------------Set the toolbar stuff up--------------------------------------------
        pvMapper.mapToolbar = Ext.ComponentQuery.query('#maintoolbar');
        //Ext.ComponentQuery.query('#maincontent').add(mapPanel);

        console.log('Signaling that the pvMapper object is ready to go');
        pvMapper.readyEvent.fire();
    },
});
