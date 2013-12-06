pvMapper.onReady(function () {
    // todo: load only users's site when loading the map.
    $.get("/api/ProjectSite/")
        .done(function (sites) {
            var sitesLayer = pvMapper.getSiteLayer();

            for (var i = 0; i < sites.length; i++) {
                try {
                    //if (console) console.log("Adding site to the map");

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
                        pvMapper.siteManager.loadSite(s);
                   

                        if (console) console.log('Added ' + s.name + ' to the site manager');
                    } else {
                        if (console) console.log("Unable to add the site. Unable to create the openlayers feature");
                    }
                } catch (e) {
                    if (console) { console.warn("Error loading site from database: "); console.log(e); }
                }
            }

            // if we loaded any sites, go ahead and zoom in to them.
            if (sites.length > 0) {
                pvMapper.map.zoomToExtent(sitesLayer.getDataExtent())
            }

            //Add the event for the sitesLayer to the site manager 
            sitesLayer.events.register("featuremodified", sitesLayer, pvMapper.siteManager.featureChangedHandler);

        });
});