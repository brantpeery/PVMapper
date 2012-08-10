
//view-source:http://openlayers.org/dev/examples/select-feature.html

var sitesLayer = pvMapper.getSiteLayer();
if (sitesLayer) {
    sitesLayer.events.on({
        'featureselected': function (feature) {
            var features = sitesLayer.selectedFeatures;
            if (!features)
                return;

            if (!features[0])
                return;

            var selectedFeature = features[0];
            
            // todo: implement global tool select feature
            // todo: tools need a way to get their ID, or the postScore should figure it out for them.
            var geo = selectedFeature.geometry;
            var area = geo.getGeodesicArea();
            pvMapper.postScore(area, area, selectedFeature.fid, "501062b7440aa11aa044d839");
            $.jGrowl("Submitted area: " + area);
            select.deactivate();
        },
        'featureunselected': function (feature) {
          //  console.log(this.selectedFeatures.length);
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
}