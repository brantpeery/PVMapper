
//view-source:http://openlayers.org/dev/examples/select-feature.html

var sitesLayer = pvMapper.getSiteLayer();
if (sitesLayer) {
    sitesLayer.events.on({
        'featureselected': function (feature) {
            console.log(this.selectedFeatures.length);
        },
        'featureunselected': function (feature) {
            console.log(this.selectedFeatures.length);
        }
    });

    var select = new OpenLayers.Control.SelectFeature(
        sitesLayer,
        {
            clickout: false, toggle: false,
            multiple: false, hover: false,
            toggleKey: "ctrlKey", // ctrl key removes from selection
            multipleKey: "shiftKey", // shift key adds to selection
            box: true
        });

    pvMapper.map.addControl(select);
    select.activate();

    //get selected site.

    //todo: calculate area.
    pvMapper.postScore( "High", Math.random(), "SiteName", "SiteAreaTool");
}