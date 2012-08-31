/// <reference path="../_references.js" />

//Site object 
(function (pvM) {
    pvM.site = function (/*OpenLayers.Feature*/ feature) {
        //Check the parameters
        if ($(feature).isPrototypeOf(OpenLayers.Feature)) { throw ('The parameter "feature" must be an OpenLayers.Feature'); }

        this.id = feature.fid;
        this.feature = feature;
        this.feature.site = this;
        this.geometry = feature.Geometry;
        this.name = feature.attributes.name;
        this.description = feature.attributes.description;
        this.popupHTML;

        this.onFeatureSelected = function (event) {
            this.selectEvent.fire(event);
        };
        this.onFeatureChanged = function (event) {
            this.changeEvent.fire(event);
        };
        this.select = function () {
            //Deselect the currently selected feature
            //Change the selected feature in the pvM object
            //Change the state of this feature to selected
        };

        this.changeEvent = new Event();
        this.createEvent = new Event();
        this.destroyEvent = new Event();
        this.labelChangeEvent = new Event();
        this.selectEvent = new Event();
        this.unselectEvent = new Event();




    }

})(pvMapper);

