var pvMapper;
(function (pvMapper) {
    var Site = (function () {
        //The parameter list:    //test
        // site = the feature object from Open Layers that represents this siet
        function Site(feature) {
            this.feature = feature;
            //The long description of the site
            this.offsetFeature = null;
            //The offset Open Layers feature (depreciated)
            this.popupHTML = '';
            //The short description in HTML that will show as a tooltip or popup bubble
            //Events that fire when appropriate
            //The select/change events are fired when the feature changes. They are fired by the site manager
            this.selectEvent = new pvMapper.Event();
            this.changeEvent = new pvMapper.Event();
            this.destroyEvent = new pvMapper.Event();
            this.labelChangeEvent = new pvMapper.Event();
            this.unselectEvent = new pvMapper.Event();
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
        Site.prototype.onFeatureSelected = function (event) {
            this.selectEvent.fire(this.self, event);
        };
        Site.prototype.onFeatureChange = function (event) {
            ///TODO: update the event object to reflect THIS event, add in a sub event that refers to the original event object.
            this.changeEvent.fire(this.self, event);
        };
        Site.prototype.onFeatureUnselected = function (event) {
            this.unselectEvent.fire(this.self, event);
        };
        Site.prototype.destroy = function () {
            var event = {
            };
            this.destroyEvent.fire(this.self, event);
        };
        return Site;
    })();
    pvMapper.Site = Site;    
})(pvMapper || (pvMapper = {}));
//@ sourceMappingURL=Site.js.map
