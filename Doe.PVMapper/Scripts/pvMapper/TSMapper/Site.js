var pvMapper;
(function (pvMapper) {
    var Site = (function () {
        function Site(feature) {
            this.feature = feature;
            this.offsetFeature = null;
            this.popupHTML = '';
            this.selectEvent = new pvMapper.Event();
            this.changeEvent = new pvMapper.Event();
            this.destroyEvent = new pvMapper.Event();
            this.labelChangeEvent = new pvMapper.Event();
            this.unselectEvent = new pvMapper.Event();
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
