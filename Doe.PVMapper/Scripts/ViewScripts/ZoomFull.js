
Ext.onReady(function () {
    // create an action that zooms map to max extent (no map control needed)
    var zoom = new Ext.Action({
        text: "Zoom Full",
        handler: function () {
            pvMapper.map.zoomToMaxExtent();
            pvMapper.map.setCenter(new OpenLayers.LonLat(-10723197, 4500612));
        },
        tooltip: "zoom to full extent"
    });

    pvMapper.toolbar.add(zoom);
});