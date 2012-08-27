/// <reference path="../_references.js" />

//Site object 
(function (pvMapper) {
    pvM.site = function (/*OpenLayers.Feature*/ feature) {
        //Check the parameters
        if ($(feature).isPrototypeOf(OpenLayers.Feature)) { throw ('The parameter "feature" must be an OpenLayers.Feature'); }

        this.id;
        this.feature = feature;
        this.geometry;
        this.name;
        this.description;
        this.popupHTML;

        this.onFeatureSelected = function () { };
        this.onFeatureChanged = function () { };
        this.select = function () { };

        this.changeEvent = new Event();
        this.createEvent = new Event();
        this.destroyEvent = new Event();
        this.labelChangeEvent = new Event();
        this.selectEvent = new Event();
        this.unselectEvent = new Event();

    }
})(pvMapper);