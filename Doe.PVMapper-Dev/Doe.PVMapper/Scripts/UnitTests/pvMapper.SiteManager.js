/// <reference path="../jquery-1.8.0.js" />
/// <reference path="../OpenLayers.js" />
/// <reference path = "../pvMapper/TSMapper/SiteManager.ts"/>
/// <reference path = "../pvMapper/TSMapper/SiteManager.js"/>
/// <reference path = "../pvMapper/TSMapper/Site.js"/>
/// <reference path="jasmine.js" />

describe("SiteManager", function () {
    var siteManager = new pvMapper.SiteManager();
    var testSite;

    it("can be instantiated", function () {
        //siteManager = pvMapper.SiteManager();

        expect(siteManager).toBeDefined();
    });

    it("can add a site", function () {
        var feature = new OpenLayers.Feature.Vector();
        testSite = new pvMapper.Site(feature);
        siteManager.addSite(testSite);

        expect(siteManager.sites[0]).toBe(testSite);
    });

    it("can remove a site", function () {
        var feature = new OpenLayers.Feature.Vector();
        var site = new pvMapper.Site(feature);
        siteManager.addSite(site);

        expect(siteManager.sites.length).toBe(2);
        expect(siteManager.sites[1]).toBe(site);
        siteManager.removeSite(site);
        expect(siteManager.getSite[1]).toBeFalsy();
        expect(siteManager.sites.length).toBe(1);
        
    });

    xit("can respond to a feature changed event", function () {

    });

    xit("can get a site", function () {
        expect(siteManager.getSite(0)).toBe(testSite);
    });

    xit("can fetch a site by id", function () {

    });







    
});