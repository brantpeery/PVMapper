/// <reference path="Site.ts" />
/// <reference path="Event.ts" />

module pvMapper {
    //import pvM = pvMapper;

    export var readyEvent = new Event(false);
    export function onReady(fn: () =>void ) {
        this.readyEvent.addHandler(fn);
        return pvMapper;
    }

    export class SiteManager {
        public siteAdded: Event = new Event();
        public siteRemoved: Event = new Event();

        sites: Site[] = [];
        public getSites() {
            return this.sites;
        }
        public getSite(index: string): Site;
        public getSite(index: number): Site;
        public getSite(index: any):Site {
            return this.sites[index];
        }
        public addSite(site: any);
        public addSite(feature: OpenLayers.SiteFeature) {
          var aSite = new Site(feature);
          this.sites.push(aSite);
          this.siteAdded.fire(aSite, feature);
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
        public removeSite(site) {
        }

        //Handles the change event for the features on the sitelayer. Will fire the sites change event if the 
        //  feature that changed is a project site
        //@Parameter event {OpenLayers.Event object with a feature property that is a reference to the feature that changed
        //@See http://dev.openlayers.org/apidocs/files/OpenLayers/Layer/Vector-js.html#OpenLayers.Layer.Vector.events
        public featureChangedHandler(event: any) {
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
   //instantiate siteManager object.
   export var siteManager: SiteManager = new SiteManager();

}