pvMapper.onReady(function () {
    // todo: load only users's site when loading the map.
    $.get("/api/ProjectSite/")
        .done(function (sites) {
            var sitesLayer = pvMapper.getSiteLayer();

            for (var i = 0; i < sites.length; i++) {
                var poly = new OpenLayers.Format.WKT().read(sites[i].polygonGeometry);
                poly.fid = sites[i].siteId;
                poly.attributes = {
                    name: sites[i].name,
                    description: sites[i].description
                };

                // todo: add label
                sitesLayer.addFeatures([poly], {});

                
            }
        });
});