/// <reference path="Options.d.ts" />
/// <reference path="OpenLayers.d.ts" />
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
            this.scoringTools = new Array();
            var st = new pvMapper.ScoringTool();
            st.calculateCallback = this.calculateSiteArea;
            st.updateCallback = this.updateSetbackFeature;
            this.scoringTools.push(st);
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
        Module.prototype.addScoringTool = function (scoreTool) {
            this.scoringTools.push(scoreTool);
        };
        Module.prototype.removeScoringTool = function (scoreTool) {
            var idx = this.scoringTools.indexOf(scoreTool, 0);
            if(idx >= 0) {
                this.scoringTools.splice(idx, 1);
            }
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
        Module.prototype.updateSetbackFeature = function (site, setbackLength) {
            var reader = new jsts.io.WKTReader();
            var parser = new jsts.io.OpenLayersParser();
            var input = parser.read(site.feature.geometry);
            var buffer = input.buffer(-1 * setbackLength);//Inset the feature
            
            var newGeometry = parser.write(buffer);
            if(!this.setbackLayer) {
                this.setbackLayer = new OpenLayers.Layer.Vector("Site Setback");
                pvMapper.map.addLayer(this.setbackLayer);
            }
            if(site.offsetFeature) {
                //Redraw the polygon
                this.setbackLayer.removeFeatures(site.offsetFeature);
                site.offsetFeature.geometry = newGeometry//This probably wont work
                ;
            } else {
                var style = {
                    fillColor: 'blue',
                    fillOpacity: 0,
                    strokeWidth: 3,
                    strokeColor: "purple"
                };
                site.offsetFeature = new OpenLayers.Feature.Vector(newGeometry, {
                    parentFID: site.feature.fid
                }, style);
            }
            this.setbackLayer.addFeatures(site.offsetFeature);
            return 0;
        };
        return Module;
    })();
    pvMapper.Module = Module;    
    ; ;
    pvMapper.map = new OpenLayers.Map();
})(pvMapper || (pvMapper = {}));

