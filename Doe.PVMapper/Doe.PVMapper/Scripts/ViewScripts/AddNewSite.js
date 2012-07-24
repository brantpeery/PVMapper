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