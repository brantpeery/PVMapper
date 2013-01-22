/// <reference path="_frameworkobjects.d.ts" />
/// reference path="../../_references.js" />
/// <reference path="Event.ts" />





module pvMapper {
    import pvM = pvMapper;
    import Site = pvMapper.Site;
    import Event = pvMapper.Event;
    
    export var readyEvent = new pvM.Event(false);
    export function onReady(fn: () =>void ) {
        this.readyEvent.addHandler(fn);
        return pvMapper;
    }

    class SiteManager {
        siteAdded: pvM.Event = new pvM.Event();
        siteRemoved: pvM.Event = new pvM.Event();

        sites: Site[] = [];
        getSites() {
            return this.sites;
        }
        getSite(index: string): Site;
        getSite(index: number): Site;
        getSite(index: any):Site {
            return this.sites[index];
        }
        addSite(site: any);
        addSite(site: Site) {
            if (site instanceof OpenLayers.Feature) { //Convert the feature to a site
                site = new pvMapper.Site(site);
            } else if (site instanceof siteOptions) {

            } else if (!site instanceof Site) { //If the site was not one of the above and also is not a site then error
                console.log("Cannot create a site from a type : " + typeof (site) + " Site not created.");
            }
            this.sites.push(site);
            this.siteAdded.fire(site, [{ site: site }, site]);
        }
        removeSite(site) {
        }

        //Handles the change event for the features on the sitelayer. Will fire the sites change event if the 
        //  feature that changed is a project site
        //@Parameter event {OpenLayers.Event object with a feature property that is a reference to the feature that changed
        //@See http://dev.openlayers.org/apidocs/files/OpenLayers/Layer/Vector-js.html#OpenLayers.Layer.Vector.events
        featureChangedHandler(event: any) {
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

}