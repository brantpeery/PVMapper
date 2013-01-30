var map;

function init() {
	map = new OpenLayers.Map({
		div: "map",
		projection: new OpenLayers.Projection("EPSG:900913"), //3857 //4326
		units: "m",
        numZoomLevels: 16,
        restrictedExtent: usBounds,
        center: '-10723197, 4500612' 
		/*layers: [
			new OpenLayers.Layer.WMS(
				"Natural Earth",
				"http://demo.opengeo.org/geoserver/wms",
				{layers: "topp:naturalearth}
			),
			/*new OpenLayers.Layer.Vector("WFS", {
				strategies: [new OpenLayers.Strategy,BBox()],
				protocol: new OpenLayers.Protocol.WFS({
					url: "https://10.18.35.11/geoserver/wfs",
					featureType: "USRivers",
				}),
			})*/
		],*/
	});
	var controls = [new OpenLayers.Control.PanPanel(),
                        new OpenLayers.Control.ZoomPanel()]
    map.addControls(controls);
}