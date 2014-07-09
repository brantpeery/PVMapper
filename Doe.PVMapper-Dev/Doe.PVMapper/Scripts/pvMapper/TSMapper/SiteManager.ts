/// <reference path="Site.ts" />
/// <reference path="Event.ts" />

module pvMapper {

    export class SiteManager {
        public siteAdded: pvMapper.Event = new pvMapper.Event();
        public siteRemoved: pvMapper.Event = new pvMapper.Event();

        private sites: Site[] = [];
        public getSites() {
            return this.sites;
        }

        public getSite(index: number): Site {
            return this.sites[index];
        }

        public addSite(site: pvMapper.Site) {
            if (console && console.assert) console.assert(this.sites.filter(s => s.id === site.id).length === 0,
                "Warning: registering a new site with a duplicate ID: '" + site.id + "'");

            this.sites.push(site);

            this.siteAdded.fire(site, site);
        }

        /**
        Removes all sites from the sites array.
        */
        public removeAllSites() {
            while (this.sites.length) {
                var site = this.sites.pop();
                this.siteRemoved.fire(site, site);
                //site.destroy();
            }
        }

        /**
        Removes a site from the sites array.
        */
        public removeSite(site: pvMapper.Site) {
            //find the site
            var idx: number = this.sites.indexOf(site);
            if (idx !== -1) {
                this.sites.splice(idx, 1);
                this.siteRemoved.fire(site, site);
                //site.destroy();
            }
        }

        /**
        Removes a site from the sites array.
        */
        public removeSiteById(siteId: string)
        {
            var i: number;
            for (i = 0; i < this.sites.length; i++)
            {
                if (this.sites[i].id == siteId)
                    break;
            }

            if (console && console.assert) console.assert(i < this.sites.length,
                "Warning: couldn't remove site (found no site matching ID '" + siteId + "')");
            
            if (i < this.sites.length)
            {
                var site = this.sites.splice(i, 1)[0];
                this.siteRemoved.fire(site, site);
            }
        }

        /**
        handles the change event for the features on the sitelayer. will fire the sites change event if the 
          feature that changed is a project site
        @parameter event {openlayers.event object with a feature property that is a reference to the feature that changed
        @See http://dev.openlayers.org/apidocs/files/OpenLayers/Layer/Vector-js.html#OpenLayers.Layer.Vector.events
        */
        public featureChangedHandler(event: { feature: { site: Site } }) {
            if (event.feature && event.feature.site) {
                try {
                    event.feature.site.changeEvent.fire(event.feature.site, event);
                } catch (e) {
                    if (console && console.error) console.error("An error occurred while trying to fire the feature change event for a site from the site manager.");
                    if (console && console.debug) console.debug(e);
                }
            } else {
                if (console && console.warn) console.warn("Warning: SiteManager's featureChangedHandler called on a non-site feature");
            }
        }
    }
    //instantiate siteManager object.
    export var siteManager: SiteManager = new SiteManager();
}
