var pvMapper;
(function (pvMapper) {
    var Site = (function () {
        function Site(feature) {
            this.feature = feature;
            this.offsetFeature = null;
            this.popupHTML = '';
            this.changeEvent = new pvMapper.Event();
            this.self = this;
            this.id = feature.fid;
            this.feature = feature;
            this.feature.site = this;
            this.geometry = feature.geometry;
            this.name = feature.attributes.name;
            this.description = feature.attributes.description;
        }
        return Site;
    })();
    pvMapper.Site = Site;    
})(pvMapper || (pvMapper = {}));
