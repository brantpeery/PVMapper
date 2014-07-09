pvMapper.onReady(function () {
    $.get("/api/ProjectSite/")
        .done(function (sites) {
            var sitesLayer = pvMapper.getSiteLayer();

            var loadAllSites = function() {
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
                            pvMapper.siteManager.addSite(s);
                   

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
            }

            if (sites.length > 10) {
                Ext.MessageBox.confirm("Site count warning", "Found " + sites.length + " sites from your last session. " +
                    "Using too many sites may cause problems. Are you sure you wish to load all of these sites?",
                    function (btn) {
                        if (btn !== 'yes') {
                            Ext.MessageBox.confirm("Delete these sites", "Would you like to delete the " + sites.length + " sites from your last session?",
                                function (btn) {
                                    if (btn === 'yes') {
                                        pvMapper.deleteAllSites(); // delete all sites on the server
                                    }
                                });
                        } else {
                            loadAllSites(); // load many sites
                        }
                    });
            } else {
                loadAllSites(); // load few sites
            }
        });
});