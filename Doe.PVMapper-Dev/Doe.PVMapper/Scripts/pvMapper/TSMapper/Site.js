/// <reference path="OpenLayers.d.ts" />
/// <reference path="Event.ts" />

var pvMapper;
(function (pvMapper) {
    var Site = (function () {
        //The parameter list:    //test
        // site = the feature object from Open Layers that represents this siet
        function Site(feature) {
            this.feature = feature;
            this.offsetFeature = null;
            this.popupHTML = '';
            //Events that fire when appropriate
            //The select/change events are fired when the feature changes. They are fired by the site manager
            //public selectEvent: pvMapper.Event = new pvMapper.Event();
            this.changeEvent = new pvMapper.Event();
            //if (!feature instanceof(OpenLayers.Feature))
            //  throw ('The parameter "feature" must be an OpenLayers.Feature');
            this.self = this;
            this.id = feature.fid;
            this.feature = feature;
            this.feature.site = this;
            this.geometry = feature.geometry;
            this.name = feature.attributes.name;
            this.description = feature.attributes.description || ""; // default to empty string (not null)
        }
        /**
        *  This function is a helper function that is called by JSON.stringify() to properly stringify this object
        *  It basically sends back a simplified object that removes all the non essential properties
        */
        Site.prototype.toJSON = function () {
            var o = {
                id: this.id,
                geometry: this.geometry.toString(),
                name: this.name,
                description: this.description,
                popupHTML: this.popupHTML
            };
            return o;
        };

        /* Consumes the object created when a saved JSON string is parsed.
        *  Repopulates this object with the stuff from the JSON parse
        *
        */
        Site.prototype.fromJSON = function (o) {
            this.id = o.id;
            this.geometry = (this.geometry.fromWKT(o.geometry)); //convert WKT string into
            this.name = o.name;
            this.description = o.decription;
            this.popupHTML = o.popupHTML;
        };
        return Site;
    })();
    pvMapper.Site = Site;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=Site.js.map
