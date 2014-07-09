/// <reference path="OpenLayers.d.ts" />
/// <reference path="Event.ts" />

interface SiteChangeEventArg extends EventArg {
    site: pvMapper.Site;
}

module pvMapper {
    export interface ISiteJSON {
        id: string;
        geometry: string; // WKT format.
        name: string;
        description: string;
    }

    export class Site {
        //The parameter list:    //test
        // site = the feature object from Open Layers that represents this siet

        constructor(public feature: OpenLayers.SiteFeature) {
            if (console && console.log) console.log("Creating site for feature id=" + feature.id + ", fid=" + feature.fid);

            this.id = feature.fid; // feature.fid is the unique ID we get from the database. feature.id is just session-unique, and will change each session (so don't use it)
            this.feature = feature;
            this.feature.site = this;
            this.geometry = feature.geometry;
            this.name = feature.attributes.name;
            this.description = feature.attributes.description || ""; // default to empty string (not null)
        }
        public id: string; //The id that came from the DB
        //public site: OpenLayers.SiteFeature; //The site object from Open Layers
        public geometry: OpenLayers.Polygon; //The site boundry 
        public name: string; //The saved name of the site
        public description: string; //The long description of the site
        //public offsetFeature: OpenLayers.FVector = null; //The offset Open Layers feature (depreciated)
        //public popupHTML: string = ''; //The short description in HTML that will show as a tooltip or popup bubble


        /**
        *  This function is a helper function that is called by JSON.stringify() to properly stringify this object
        *  It basically sends back a simplified object that removes all the non essential properties
        */ 
        public toJSON(): ISiteJSON {
            var o = {
                id: this.id,
                geometry: this.geometry.toString(), //retturn a WKT format.
                name: this.name,
                description: this.description,
            }
            return o;
        }

        /* Consumes the object created when a saved JSON string is parsed. 
        *  Repopulates this object with the stuff from the JSON parse
        */
        
        //Note: fromJSON totally won't work; other classes are responsible for that... I've commented it out here so later developers don't expect it to work.
        //public fromJSON(o: ISiteJSON) {
        //    if (console && console.assert) console.assert(this.id === o.id, "Warning: ID mismatch when loading site from JSON");
        //    this.id = o.id;
        //    this.geometry = <OpenLayers.Polygon>(this.geometry.fromWKT(o.geometry));  //convert WKT string into 
        //    this.name = o.name;
        //    this.description = o.description;
        //}


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

