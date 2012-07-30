Ext.onReady(function () {

    // todo: load only users's site when loading the map.
    $.get("/api/ProjectSite/")

        .done(function (sites) {
            //for (var i = 0; i < sites.length; i++) {
            //    var poly = new OpenLayers.Format.WKT().read(sites[i].polygonGeometry);
            //    poly.fid = sites[i].siteId;
            //    polyLayer.addFeatures([poly]);
            //}
        });

});