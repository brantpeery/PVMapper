/// <reference path="../jquery-1.8.0.js" />
/// <reference path="../OpenLayers.js" />
/// <reference path = "../pvMapper/TSMapper/Site.ts"/>
/// <reference path = "../pvMapper/TSMapper/Site.js"/>
/// <reference path="jasmine.js" />



describe("Site", function () {
    var site = new pvMapper.Site(new OpenLayers.Feature.Vector());

    it("can be created", function () {
        expect(site).toBeDefined();
    });
    //it("can fire select event", function () {
    //    var fn = jasmine.createSpy();
    //    site.selectEvent.addHandler(fn);

    //    site.onFeatureSelected(this, {});
    //    expect(fn).toHaveBeenCalled();
    //});
    xit("can fire destroy event", function () {
        var fn = jasmine.createSpy();
        site.destroyEvent.addHandler(fn);

        site.onFeatureDestroy(this, {});
        expect(fn).toHaveBeenCalled();
    });
    xit("can fire lableChange event", function () {
        var fn = jasmine.createSpy();
        site.lableChangeEvent.addHandler(fn);

        //Do something that would change the label;
        expect(fn).toHaveBeenCalled();
    });
    //it("can fire unselect event", function () {
    //    var fn = jasmine.createSpy();
    //    site.unselectEvent.addHandler(fn);

    //    site.onFeatureUnselected(this, {});
    //    expect(fn).toHaveBeenCalled();
    //});
});