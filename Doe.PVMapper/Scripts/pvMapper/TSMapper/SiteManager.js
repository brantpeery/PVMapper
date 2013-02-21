/// <reference path="Site.ts" />
/// <reference path="Event.ts" />
var pvMapper;
(function (pvMapper) {
    var SiteManager = (function () {
        function SiteManager() {
            this.siteAdded = new pvMapper.Event();
            this.siteRemoved = new pvMapper.Event();
            this.sites = [];
        }
        SiteManager.prototype.getSites = function () {
            return this.sites;
        };
        SiteManager.prototype.getSite = //public getSite(index: string): Site;
        //public getSite(index: any): Site {
        function (index) {
            return this.sites[index];
        };
        SiteManager.prototype.addSite = function (site) {
            this.sites.push(site);
            this.siteAdded.fire(site, site);
        };
        SiteManager.prototype.createSite = function (feature) {
            console.log("Creating site");
            var aSite = new pvMapper.Site(feature);
            this.sites.push(aSite);
            this.siteAdded.fire(aSite, feature);
        };
        SiteManager.prototype.removeSite = /**
        Removes a site from the sites array.
        */
        function (site) {
            //find the site
            var idx = this.sites.lastIndexOf(site);
            if(idx !== -1) {
                this.sites.splice(idx, 1);
            }
        };
        SiteManager.prototype.featureChangedHandler = /**
        handles the change event for the features on the sitelayer. will fire the sites change event if the
        feature that changed is a project site
        @parameter event {openlayers.event object with a feature property that is a reference to the feature that changed
        @See http://dev.openlayers.org/apidocs/files/OpenLayers/Layer/Vector-js.html#OpenLayers.Layer.Vector.events
        */
        function (event) {
            console.log("Feature change detected by the site manager");
            if(event.feature && event.feature.site) {
                // try {
                event.feature.site.changeEvent.fire(event.feature.site, event);
                console.log("Fired the change event for site: " + event.feature.site.name);
                //    } catch (e) {
                //        console.log("An error occurred while trying to fire the feature change event for a site from the site manager");
                //        console.error(e);
                //    }
                            } else {
                console.log("The feature was not a site");
            }
        };
        return SiteManager;
    })();
    pvMapper.SiteManager = SiteManager;    
    //instantiate siteManager object.
    pvMapper.siteManager = new SiteManager();
})(pvMapper || (pvMapper = {}));
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
