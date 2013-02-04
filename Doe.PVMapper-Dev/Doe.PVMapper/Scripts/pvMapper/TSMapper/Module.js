var pvMapper;
(function (pvMapper) {
    var Module = (function () {
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
        Module.prototype.init = function () {
        };
        Module.prototype.destroy = function () {
        };
        Module.prototype.activate = function () {
        };
        Module.prototype.deactivate = function () {
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
            var val = this.calculateArea(site.feature.geometry);
            return val;
        };
        Module.prototype.updateSetbackFeature = function (site, setbackLength) {
            var reader = new jsts.io.WKTReader();
            var parser = new jsts.io.OpenLayersParser();
            var input = parser.read(site.feature.geometry);
            var buffer = input.buffer(-1 * setbackLength);
            var newGeometry = parser.write(buffer);
            if(!this.setbackLayer) {
                this.setbackLayer = new OpenLayers.Layer.Vector("Site Setback");
                pvMapper.map.addLayer(this.setbackLayer);
            }
            if(site.offsetFeature) {
                this.setbackLayer.removeFeatures(site.offsetFeature);
                site.offsetFeature.geometry = newGeometry;
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
