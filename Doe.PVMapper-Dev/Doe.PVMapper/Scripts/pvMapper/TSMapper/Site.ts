/// <reference path="OpenLayers.d.ts" />
/// <reference path="Event.ts" />

interface SiteChangeEventArg extends EventArg {
    site: pvMapper.Site;
}


module pvMapper {



    export class Site {
        //The parameter list:    //test
        // site = the feature object from Open Layers that represents this siet

        constructor(public feature: OpenLayers.SiteFeature) {
            //if (!feature instanceof(OpenLayers.Feature)) 
            //  throw ('The parameter "feature" must be an OpenLayers.Feature');
            this.self = this;
            this.id = feature.fid;
            this.feature = feature;
            this.feature.site = this;
            this.geometry = feature.geometry;
            this.name = feature.attributes.name;
            this.description = feature.attributes.description;
        }
        public self: any; //Reference to this object 
        public id: string; //The id that came from the DB
        //public site: OpenLayers.SiteFeature; //The site object from Open Layers
        public geometry: OpenLayers.Polygon; //The site boundry 
        public name: string; //The saved name of the site
        public description: string; //The long description of the site
        public offsetFeature: OpenLayers.FVector = null; //The offset Open Layers feature (depreciated)
        public popupHTML: string = ''; //The short description in HTML that will show as a tooltip or popup bubble


        /**
        *  This function is a helper function that is called by JSON.stringify() to properly stringify this object
        *  It basically sends back a simplified object that removes all the non essential properties
        */ 
        public toJSON(): any {
            var o = {
                id: this.id,
                geometry: this.geometry.toString(),
                name: this.name,
                description: this.description,
                popupHTML: this.popupHTML   
            }
            return o;
        }

        /* Consumes the object created when a saved JSON string is parsed. 
        *  Repopulates this object with the stuff from the JSON parse
        *
        */
        public fromJSON() {

        }



        //Events that fire when appropriate
        //The select/change events are fired when the feature changes. They are fired by the site manager
        //public selectEvent: pvMapper.Event = new pvMapper.Event();
        public changeEvent: pvMapper.Event = new pvMapper.Event();
        //public destroyEvent: pvMapper.Event = new pvMapper.Event();
        //public labelChangeEvent: pvMapper.Event = new pvMapper.Event();
        //public unselectEvent: pvMapper.Event = new pvMapper.Event();

        //public onFeatureSelected(event: any) {
        //    this.selectEvent.fire(this.self, event);
        //};

        //public onFeatureChange(event: any) {
        //    ///TODO: update the event object to reflect THIS event, add in a sub event that refers to the original event object.
        //    this.changeEvent.fire(this.self, event);
        //}

        //public onFeatureUnselected(event: any) {
        //    this.unselectEvent.fire(this.self, event);
        //}

        //public destroy() {

        //    var event = {};
        //    this.destroyEvent.fire(this.self, event);
        //}
    }
}



