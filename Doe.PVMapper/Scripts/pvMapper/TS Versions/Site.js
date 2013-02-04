var pvMapper;
(function (pvMapper) {
    var pvM = pvMapper;
    var Site = (function () {
        function Site(feature) {
            this.changeEvent = new pvM.Event();
            this.destroyEvent = new pvM.Event();
            this.labelChangeEvent = new pvM.Event();
            this.selectEvent = new pvM.Event();
            this.unselectEvent = new pvM.Event();
            if(!feature instanceof (OpenLayers.Feature)) {
                throw ('The parameter "feature" must be an OpenLayers.Feature');
            }
            this.id = feature.fid;
            this.feature = feature;
            this.feature.site = this;
            this.geometry = feature.Geometry;
            this.name = feature.attributes.name;
            this.description = feature.attributes.description;
        }
        Site.prototype.onFeatureChanged = function (event) {
            this.changeEvent.fire(this, event);
        };
        Site.prototype.onFeatureSelected = function (event) {
            this.selectEvent.fire(this, event);
        };
        return Site;
    })();
    pvMapper.Site = Site;    
})(pvMapper || (pvMapper = {}));

