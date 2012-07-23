
Ext.onReady(function () {
    // create an action tied to a measure control
    var measure = new GeoExt.Action({
        text: "Measure",
        control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
            geodesic: true,
            eventListeners: {
                measure: function (event) {
                    var win = new Ext.Window({
                        title: "Measure Resuls",
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
        toggleGroup: "group1",  // only one tool can be active in a group
        allowDepress: false,
        tooltip: "measure distance"
    });

    pvMapper.toolbar.add(measure);

    // create an action tied to a navigation control
    var navigate = new GeoExt.Action({
        text: "Navigate",
        control: new OpenLayers.Control.Navigation(),
        map: pvMapper.map,
        // button options
        toggleGroup: "group1",  // only one tool can be active in a group
        allowDepress: false,
        pressed: true,
        tooltip: "navigate"
    });

    pvMapper.toolbar.add(navigate);
});