
pvMapper.onReady(function () {

    action = Ext.create('GeoExt.Action', {
        text: "Measure",
        control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
            geodesic: true,
            eventListeners: {
                measure: function (event) {
                    var win = new Ext.Window({
                        title: "Measure Results",
                        modal: true,
                        width: 180,
                        constrain: true,
                        bodyStyle: { padding: 10 },
                        html: event.measure + " " + event.units
                    });
                    win.show();
                }
            }
        }),
        map: pvMapper.map,
        // button options
        toggleGroup: "mapNavGroup1",  // only one tool can be active in a group
        allowDepress: false,
        tooltip: "measure distance"
    });
    pvMapper.mapToolbar.add(Ext.create('Ext.button.Button', action));


    action = Ext.create('GeoExt.Action', {
        text: "Navigate",
        control: new OpenLayers.Control.Navigation(),
        map: pvMapper.map,
        // button options
        toggleGroup: "mapNavGroup1",  // only one tool can be active in a group
        allowDepress: false,
        pressed: true,
        tooltip: "navigate"
    });
    pvMapper.mapToolbar.add(Ext.create('Ext.button.Button', action));

    pvMapper.mapToolbar.add("-");
});