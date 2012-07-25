/*
Add site plugin

Contributors: Brant Peery, Matthew Klien
*/


pvMapper.onReady(function () {

    var addSite = new Ext.Action({
        text: "Add Site",
        handler: function () {

            var pointLayer = new OpenLayers.Layer.Vector("Point Layer");
            pointLayer.id = "Hola";

            pvMapper.map.addLayer(pointLayer);
            var tool = new OpenLayers.Control.DrawFeature(pointLayer, OpenLayers.Handler.Point);
            pvMapper.map.addControl(tool);
            tool.activate();

            //var layer = pvMapper.map.getLayer("Hola");
            //layer.features[0].geometry[0].x;
            // view-source:http://openlayers.org/dev/examples/click.html
        }

    });
    pvMapper.toolbar.add(addSite);
});

//The main plugin object. Conforms to the plugin definition set by the framework
function addSite(map, layer) {
    var self = this; //Makes the 'this' object accessable from private methods
    var WKT;
    var currentSiteName;
    this.layer = createSiteLayer(map);
    this.mapControl = new OpenLayers.Control.DrawFeature(this.layer, OpenLayers.Handler.Polygon);

    activateDrawSite(); //Turn the tool on 

    function createLayer () { }
    function activateDrawSite() {
        self.mapControl.activate();
        
    }
    function saveSiteInfo () { }
    function deactivateDrawSite () { }
    function nameSiteFeature () { }

    function createAddSiteDialog() { }
    function createSiteLayer(map) {
        sitelayer = new OpenLayers.Layer.Vector("Sites");
        sitelayer.id = "SiteLayer";
        map.addLayer(sitelayer);
        return sitelayer;
    }

    
};
addSite.prototype = {
    createEditTool: function () {
        control 
        return control;
    },

        
}
