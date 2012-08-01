
pvMapper.onReady(function () {
    
    var action;

    // ZoomToMaxExtent control, a "button" control
    action = Ext.create('GeoExt.Action', {
        control: new OpenLayers.Control.ZoomToMaxExtent(),
        map: pvMapper.map,
        text: "Zoom 100%",
        tooltip: "zoom to United States"
    });

    pvMapper.mapToolbar.add(Ext.create('Ext.button.Button', action));

    // Navigation history - two "button" controls
    ctrl = new OpenLayers.Control.NavigationHistory();
    pvMapper.map.addControl(ctrl);

    action = Ext.create('GeoExt.Action', {
        text: "previous",
        control: ctrl.previous,
        disabled: true,
        tooltip: "previous in history"
    });
    pvMapper.mapToolbar.add(Ext.create('Ext.button.Button', action));

    action = Ext.create('GeoExt.Action', {
        text: "next",
        control: ctrl.next,
        disabled: true,
        tooltip: "next in history"
    });
    pvMapper.mapToolbar.add(Ext.create('Ext.button.Button', action));

    pvMapper.mapToolbar.add("-");
});