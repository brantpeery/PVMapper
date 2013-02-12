﻿if (typeof pvMapper == 'undefined') {
    this.pvMapper = {};
}

(function (pvM) {
    $.extend(pvM, {
        // should be passed a function that will be executed when all required scripts are fully loaded
        readyEvent: new pvM.Event(),
        onReady: function (fn) {
            this.readyEvent.addHandler(fn);
        },

        //All the sites that are managed by pvMapper  
        siteManager: {
            siteAdded: new pvM.Event(),
            siteRemoved: new pvM.Event(),

            sites: [],
            getSites: function () {
                return this.sites;
            },
            getSite: function (index) {
                return this.sites[index];
            },
            addSite: function (site) {
                if (site instanceof OpenLayers.Feature){ //Convert the feature to a site
                    site = new pvMapper.Site(site);
                } else if (site instanceof siteOptions){

                } else if (!site instanceof pvM.Site) { //If the site was not one of the above and also is not a site then error
                    console.log("Cannot create a site from a type : " + typeof (site) + " Site not created.");
                }
                this.sites.push(site);
                this.siteAdded.fire(site, [{ site: site }, site]);
            },
            removeSite: function (site) {
            },

            //Handles the change event for the features on the sitelayer. Will fire the sites change event if the 
            //  feature that changed is a project site
            //@Parameter event {OpenLayers.Event object with a feature property that is a reference to the feature that changed
            //@See http://dev.openlayers.org/apidocs/files/OpenLayers/Layer/Vector-js.html#OpenLayers.Layer.Vector.events
            featureChangedHandler: function (event) {
                console.log("Feature change detected by the site manager");
                if (event.feature && event.feature.site) {
                    try {
                        event.feature.site.changeEvent.fire(this, event);
                        console.log("Fired the change event for site: " + event.feature.site.name);
                    } catch (e) {
                        console.log("An error occurred while trying to fire the feature change event for a site from the site manager");
                        console.error(e);
                    }
                }
            }
        }
        
    })
})(pvMapper);