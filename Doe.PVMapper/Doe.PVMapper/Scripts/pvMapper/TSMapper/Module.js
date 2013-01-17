/// <reference path="siteAreaModule.ts" />
/// <reference path="../../jquery.d.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    // Class
    var Module = (function () {
        // Constructor
        function Module(options) {
            this.id = "";
            this.author = "";
            this.version = "";
            this.settings = this.self = this;
            this.id = (typeof (this.self.settings.id) === 'string') ? this.self.settings.id : '';
            this.author = (typeof (this.self.settings.author) === 'string') ? this.self.settings.author : '';
            this.ScoringTools = new Array();
            var st = new pvMapper.ScoringTool();
            st.calculateCallback = this.calculateSiteArea;
            st.updateCallback = this.updateSetbackFeature;
            this.ScoringTools.push(st);
        }
        Module.prototype.init = //Called when the tool is loaded as a module.
        function () {
        };
        Module.prototype.destroy = //Called when the tool needs to completely remove itself from the interface and object tree
        function () {
        };
        Module.prototype.activate = //Called when the tool is checkmarked or activated by the system or user
        function () {
        };
        Module.prototype.deactivate = //Called when the tool is unchecked or deactivated by the system or user
        function () {
        };
        Module.prototype.calculateArea = function (polygon) {
            var proj = new OpenLayers.Projection('EPSG:900913');
            var area = polygon.getGeodesicArea(proj);
            var kmArea = area / 1000000;
            return Math.round(kmArea * 100) / 100;
        };
        Module.prototype.calculateSiteArea = function (site) {
            //Use the geometry of the OpenLayers feature to get the area
            var val = this.calculateArea(site.feature.geometry);
            return val;
        };
        return Module;
    })();
    pvMapper.Module = Module;    
})(pvMapper || (pvMapper = {}));

