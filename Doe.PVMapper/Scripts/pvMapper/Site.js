/// <reference path="../_references.js" />
/// <reference path="Event.js" />

//Site object 
(function (pvM) {
    pvM.Site = function (/*OpenLayers.Feature*/ feature) {
        //Check the parameters
        if (!feature instanceof(OpenLayers.Feature)) { throw ('The parameter "feature" must be an OpenLayers.Feature'); }

        this.id = feature.fid;
        this.feature = feature;
        this.feature.site = this;
        this.geometry = feature.Geometry;
        this.name = feature.attributes.name;
        this.description = feature.attributes.description;
        this.popupHTML;

        //The events are fired by the layer. These events are fired by the pvMapper layer manager as it watches the layer for events
        //Ex. when the layer manager gets a feature change event, it uses the feature.site property
        //of the feature in the event to fire the feature.site.changeEvent of the site that manages that feature
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
        this.destroyEvent = new Event();
        this.labelChangeEvent = new Event();
        this.selectEvent = new Event();
        this.unselectEvent = new Event();




    }

})(pvMapper);

