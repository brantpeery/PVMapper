/// <reference path="_frameworkobjects.d.ts" />
/// <reference path="../../_references.js" />
/// <reference path="Event.ts" />

/*Site object
*Tracks the features in Openlayers that are on the Site layer and are also marked as features. 
*   Usually this object is created then added to the siteManager on the global pvMapper object
*   The site will have a feature that will also have a site property. This is so that any events
*   on the Openlayers manager that fire on a feature can be checked to see if it is managed by a
*   the pvMapper API
*
*/ 
module pvMapper {
    import pvM = pvMapper;
    export class Site {
        public id;
        public feature;
        public geometry;
        public name;
        public description;
        public pupupHTML;

        //Events
        public changeEvent = new pvM.Event();
        public destroyEvent = new pvM.Event();
        public labelChangeEvent = new pvM.Event();
        public selectEvent = new pvM.Event();
        public unselectEvent = new pvM.Event();

        constructor (feature) {
            if (!feature instanceof (OpenLayers.Feature)) {
                throw ('The parameter "feature" must be an OpenLayers.Feature');
            }
            this.id = feature.fid;
            this.feature = feature;
            this.feature.site = this;
            this.geometry = feature.Geometry;
            this.name = feature.attributes.name;
            this.description = feature.attributes.description;
        }



        onFeatureChanged(event) {
            this.changeEvent.fire(this, event);
        }
        onFeatureSelected(event) {
            this.selectEvent.fire(this, event);
        }
    }
}



