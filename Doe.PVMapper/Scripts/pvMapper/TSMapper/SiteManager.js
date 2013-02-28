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
        SiteManager.prototype.getSite = function (index) {
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
        SiteManager.prototype.removeSite = function (site) {
            var idx = this.sites.lastIndexOf(site);
            if(idx !== -1) {
                this.sites.splice(idx, 1);
            }
        };
        SiteManager.prototype.featureChangedHandler = function (event) {
            console.log("Feature change detected by the site manager");
            if(event.feature && event.feature.site) {
                event.feature.site.changeEvent.fire(event.feature.site, event);
                console.log("Fired the change event for site: " + event.feature.site.name);
            } else {
                console.log("The feature was not a site");
            }
        };
        return SiteManager;
    })();
    pvMapper.SiteManager = SiteManager;    
    pvMapper.siteManager = new SiteManager();
})(pvMapper || (pvMapper = {}));
