pvMapper.onReady(function () {
    // todo: load only users's site when loading the map.
    $.get("/api/ProjectSite/")
        .done(function (sites) {
            var sitesLayer = pvMapper.getSiteLayer();

            for (var i = 0; i < sites.length; i++) {

                var site = sites[i];
                var poly = new OpenLayers.Format.WKT().read(site.polygonGeometry);
                if (poly) { //Make sure the poly was created before trying to set properties    

                    // buffer tool prototype
                    var reader = new jsts.io.WKTReader();
                    var parser = new jsts.io.OpenLayersParser();

                    var input = reader.read(site.polygonGeometry);
                    var buffer = input.buffer(-20);
                    buffer = parser.write(buffer);
                    var innerPolygon = new OpenLayers.Feature.Vector(buffer, null, { fillColor: 'blue', fillOpacity: 0, strokeWidth: 3, strokeColor: "purple" });
                    sitesLayer.addFeatures([innerPolygon]);
                    // buffer tool prototype


                    poly.fid = site.siteId;
                    poly.attributes = {
                        name: site.name,
                        description: site.description,
                        // buffer tool prototype
                        innerGeometry: innerPolygon.geometry
                    };
                    sitesLayer.addFeatures([poly], {});

                    s = new pvMapper.Site(poly);
                    pvMapper.siteManager.addSite(s);

                    console.log('Added ' + s.name + ' to the site manager');
                }

            }

            //Add the event for the sitesLayer to the site manager 
            sitesLayer.events.register("featuremodified", sitesLayer, pvMapper.siteManager.featureChangedHandler);

        });
});