﻿pvMapper.onReady(function () {
    // todo: load only users's site when loading the map.
    $.get("/api/ProjectSite/")
        .done(function (sites) {
            var sitesLayer = pvMapper.getSiteLayer();

            for (var i = 0; i < sites.length; i++) {
                console.log("Adding site " + sites[i].fid + " to the map");

                var site = sites[i];
                var poly = new OpenLayers.Format.WKT().read(site.polygonGeometry);
                if (poly) { //Make sure the poly was created before trying to set properties    
                    poly.fid = site.siteId;
                    poly.attributes = {
                        name: site.name,
                        description: site.description,
                        // buffer tool prototype
                        //innerGeometry: innerPolygon.geometry
                    };
                    sitesLayer.addFeatures([poly], {});

                    s = new pvMapper.Site(poly);
                    pvMapper.siteManager.addSite(s);

                    console.log('Added ' + s.name + ' to the site manager');
                } else {
                    console.log("Unable to add the site. Unable to create the openlayers feature");
                }
            }

            //Add the event for the sitesLayer to the site manager 
            sitesLayer.events.register("featuremodified", sitesLayer, pvMapper.siteManager.featureChangedHandler);

        });
});