/// <reference path="Site.ts" />
/// <reference path="Event.ts" />

module pvMapper {

    export class SiteManager {
        public siteAdded: pvMapper.Event = new pvMapper.Event();
        public siteRemoved: pvMapper.Event = new pvMapper.Event();
        public siteLoaded: pvMapper.Event = new pvMapper.Event();

        private sites: Site[] = [];
        public getSites() {
            return this.sites;
        }
        //public getSite(index: string): Site;
        //public getSite(index: any): Site {
        public getSite(index: number): Site {
            return this.sites[index];
        }

        public addSite(site: pvMapper.Site) {
            this.sites.push(site);
            this.siteAdded.fire(site, site);
        }
        public loadSite(site: pvMapper.Site) {
            this.sites.push(site);
            //This function can be used to make specific load commands for various modules
            //
            this.siteAdded.fire(site, site);
        }

        public createSite(feature: OpenLayers.SiteFeature) {
            if (console) console.log("Creating site");
            var aSite = new Site(feature);
            this.sites.push(aSite);
            this.siteAdded.fire(aSite, feature);
        }

        public getSiteByName(siteName: string): Site {
            for (var i = 0; i < this.sites.length; i++) {
                if (this.sites[i].name === siteName) {
                    return this.sites[i];
                }
            }
            return null;
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
        public featureChangedHandler(event: any) {
            if (console) console.log("Feature change detected by the site manager");
            if (event.feature && event.feature.site) {
               // try {
                    event.feature.site.changeEvent.fire(event.feature.site, event);
                    if (console) console.log("Fired the change event for site: " + event.feature.site.name);
            //    } catch (e) {
            //        console.log("An error occurred while trying to fire the feature change event for a site from the site manager");
            //        console.error(e);
            //    }
            } else {
                if (console) console.log("The feature was not a site");
            }
        }

        //TODO: add event handlers for feature added and feature removed here - it's rather important!
        //      will move this responsability out of SiteManagement.js and AddNewSite.js
        //TODO: also, make this class the sole source responsible for calling the server-side site api

    }
    //instantiate siteManager object.
    export var siteManager: SiteManager = new SiteManager();
}

/*       public addSite(site: Site) {
if (site instanceof (OpenLayers.Feature)) { //Convert the feature to a site
    site = new Site(site);
} else if (site instanceof Options) {

} else if (!site instanceof Site) { //If the site was not one of the above and also is not a site then error
    console.log("Cannot create a site from a type : " + typeof (site) + " Site not created.");
}
this.sites.push(site);
this.siteAdded.fire(site, [{ site: site }, site]);
}
*/

