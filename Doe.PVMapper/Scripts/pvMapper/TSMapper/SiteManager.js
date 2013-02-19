var pvMapper;
(function (pvMapper) {
    pvMapper.readyEvent = new pvMapper.Event(false);
    function onReady(fn) {
        this.readyEvent.addHandler(fn);
        return pvMapper;
    }
    pvMapper.onReady = onReady;
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
        };
        SiteManager.prototype.createSite = function (feature) {
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
                try  {
                    event.feature.site.changeEvent.fire(this, event);
                    console.log("Fired the change event for site: " + event.feature.site.name);
                } catch (e) {
                    console.log("An error occurred while trying to fire the feature change event for a site from the site manager");
                    console.error(e);
                }
            } else {
                console.log("The feature was not a site");
            }
        };
        return SiteManager;
    })();
    pvMapper.SiteManager = SiteManager;    
    pvMapper.siteManager = new SiteManager();
})(pvMapper || (pvMapper = {}));
