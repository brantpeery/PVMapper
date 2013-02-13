/// <reference path="OpenLayers.d.ts" />
/// <reference path="Event.ts" />
var pvMapper;
(function (pvMapper) {
    var Site = (function () {
        //The parameter list:
        // site = the feature object from Open Layers that represents this siet
        function Site(feature) {
            this.feature = feature;
            //The long description of the site
            this.offsetFeature = null;
            //The offset Open Layers feature (depreciated)
            this.popupHTML = '';
            //The short description in HTML that will show as a tooltip or popup bubble
            this.selectEvent = new pvMapper.Event();
            this.changeEvent = new pvMapper.Event();
            this.destroyEvent = new pvMapper.Event();
            this.labelChangeEvent = new pvMapper.Event();
            this.unselectEvent = new pvMapper.Event();
            //if (!feature instanceof(OpenLayers.Feature))
            //  throw ('The parameter "feature" must be an OpenLayers.Feature');
            this.self = this;
            this.id = feature.fid;
            this.site = feature;
            this.geometry = feature.geometry;
            this.name = feature.name;
            this.description = feature.description;
        }
        Site.prototype.onFeatureSelected = function (event) {
            this.selectEvent.fire(this.self, event);
        };
        Site.prototype.onFeatureChange = function (event) {
            //This was declare originally to use ...fire(self,event) where self=this at instantiation, but using 'this' in TS is more direct but will it work?
            this.changeEvent.fire(this.self, event);
        };
        Site.prototype.select = function () {
        };
        return Site;
    })();
    pvMapper.Site = Site;    
})(pvMapper || (pvMapper = {}));
//@ sourceMappingURL=Site.js.map
