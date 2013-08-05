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
            this.description = feature.attributes.description;
        }
        return Site;
    })();
    pvMapper.Site = Site;
})(pvMapper || (pvMapper = {}));
