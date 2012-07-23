
Ext.onReady(function () {
    // create an action that zooms map to max extent (no map control needed)
    var zoom = new Ext.Action({
        text: "Zoom Full",
        handler: function () {
            panel.map.zoomToMaxExtent();
        },
        tooltip: "zoom to full extent"
    });

    DotSpatialToolbar.add(zoom);
});