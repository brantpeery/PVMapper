
pvMapper.onReady(function () {
    // create an action that zooms map to max extent (no map control needed)
    var zoom = new Ext.Action({
        text: "Zoom Full",
        handler: function () {
            pvMapper.map.zoomToMaxExtent();
            pvMapper.map.setCenter(new OpenLayers.LonLat(-10723197, 4500612));
        },
        tooltip: "zoom to United States"
    });

    pvMapper.toolbar.add(zoom);

    // Navigation history - two "button" controls
    // http://api.geoext.org/1.1/examples/toolbar.js 
   var ctrl = new OpenLayers.Control.NavigationHistory();
   pvMapper.map.addControl(ctrl);

   var action = new GeoExt.Action({
        text: "previous",
        control: ctrl.previous,
        disabled: true,
        tooltip: "previous in history"
    });

   pvMapper.toolbar.add(action);

    action = new GeoExt.Action({
        text: "next",
        control: ctrl.next,
        disabled: true,
        tooltip: "next in history"
    });

    pvMapper.toolbar.add(action);

});