pvMapper.onReady(function () {

    // We need to send requests through the proxy, to avoid cross domain security restrictions.
    // Just set the global proxy host for all OpenLayers calls, and be done with it.
    OpenLayers.ProxyHost = "/Proxy/proxy.ashx?";

    var vectorLayersAndFeaturesUnderMouse = []; //type: { name: string, features: feature[] }[]

    var wmsInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
        //infoFormat: "application/vnd.ogc.gml", // <-- this format works reliably with GeoServer instances
        //infoFormat: "application/vnd.esri.wms_featureinfo_xml", // <-- this format works reliably with ArcGIS Server instances, 
        //                  ...but OpenLayers fails to parse it (see https://github.com/openlayers/openlayers/issues/885)
        infoFormat: "text/html", // <-- this is the only format which 'works' reliably for both servers. But, it's terribly ugly.
        // These formats didn't work reliably with ArcGIS Server: // "text/xml", // "application/vnd.ogc.wms_xml", // "application/json", // "application/vnd.ogc.gml",
        //...
        queryVisible: true, // <-- setting this to true will only call Identify on visible layers. Defaults to false.
        drillDown: true, // <-- setting this will call identify on all (visible?) layers, rather than just the first (visible?) layer
        format: { 
            read: function (data) {
                // parse html format features returned by Identify...
                var features = [];

                // this block assumes that there is an HTML table somewhere in the provided e.text, and tries to parse it.
                $(data).filter("table").each(function () {
                    var table = this;
                    
                    // first row needs to be headers 
                    var headers = [];
                    for (var i = 0; i < table.rows[0].cells.length; i++) {
                        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,''); 
                    } 

                    // go through cells 
                    for (var i = 1; i < table.rows.length; i++) { 
                        var tableRow = table.rows[i]; 
                        var rowData = {}; 
                        for (var j = 0; j < tableRow.cells.length; j++) {
                            if (tableRow.cells[j].innerHTML)
                                rowData[ headers[j] ] = tableRow.cells[j].innerHTML; 
                        }
                        features.push({ attributes: rowData });
                    }
                });
                
                return features;
            }
        },
        output: 'object', // <-- this gives us 'url' members for each sub-collection of features returned, so that we have a hope of guessing which layer they came from

        //maxFeatures: 1, //HACK: using 1 here, to hopefully side-step several remaining issues: missing layer names, no drillDown, and incorrect field names
        eventListeners: {
            beforegetfeatureinfo: function (e) {
                // find vector features near the point clicked...
                vectorLayersAndFeaturesUnderMouse = [];

                var pixelBuffer = 16;

                var minXY = this.map.getLonLatFromPixel({ x: e.xy.x - pixelBuffer, y: e.xy.y - pixelBuffer });
                var maxXY = this.map.getLonLatFromPixel({ x: e.xy.x + pixelBuffer, y: e.xy.y + pixelBuffer });

                var bounds = new OpenLayers.Bounds( minXY.lon, minXY.lat, maxXY.lon, maxXY.lat );
                var testGeom = bounds.toGeometry();

                vectorLayersAndFeaturesUnderMouse = pvMapper.map.layers.filter(function (layer) {
                    // include every visible vector layer (except our site layer)...
                    return (layer instanceof OpenLayers.Layer.Vector && layer.getVisibility() && layer !== pvMapper.siteLayer);
                }).map(function (layer) {
                    return {
                        name: layer.name,
                        features: layer.features.filter(function (feature) {
                            // ...and every visible feature from that layer which intersects our mouse click (note that this array can be empty)
                            return (feature.geometry && feature.getVisibility() && testGeom.intersects(feature.geometry));
                        })
                    };
                }); //.reduce(function (x, y) { return x.concat(y); }); // <-- reduce/concat feature arrays into a single feature array
            },
            nogetfeatureinfo: function (e) {
                // e.features is empty (as we found no visible & identifyable WMS layers), so only show the vector features (if any)
                var featuresUnderMouse = vectorLayersAndFeaturesUnderMouse.filter(
                    function (featureCollections) { return featureCollections.features.length > 0; });

                if (featuresUnderMouse.length > 0) {
                    showIdentifyWindow(featuresUnderMouse);
                } else if (vectorLayersAndFeaturesUnderMouse.length > 0) {
                    pvMapper.displayMessage('No features found.', "success");
                } else {
                    // we didn't find any WMS layers or Vector layers to run identify on; let's tell the user that they should turn on more layers.
                    Ext.MessageBox.alert("Error", "The current visible layers don't support Identify; please try again with another layer from the list.");
                    //pvMapper.displayMessage("Identify unavailable on current visible layers.", "warning");
                }

                //Note: this is a total hack. But without it, the wmsInfoControl will only ever send requests to the first layer it sent a request to.
                wmsInfoControl.url = null; //TODO: hack hack hack hack...!
            },
            getfeatureinfo: function (e) {
                // e.features stores the features returned by our WMS service(s); append them to our vector features, to show both
                var featuresUnderMouse = vectorLayersAndFeaturesUnderMouse.concat(e.features).filter(
                    function (featureCollections) { return featureCollections.features.length > 0; });

                if (featuresUnderMouse.length > 0) {
                    showIdentifyWindow(featuresUnderMouse);
                } else {
                    pvMapper.displayMessage('No features found near mouse click.', "warning");
                }

                //Note: this is a total hack. But without it, the wmsInfoControl will only ever send requests to the first layer it sent a request to.
                wmsInfoControl.url = null; //TODO: hack hack hack hack...!
            }
        }
    });

    pvMapper.map.addControl(wmsInfoControl);


    var showIdentifyWindow = function (featureCollections) {
        var items = [];
        featureCollections.forEach(function (featureCollection) {
            if (featureCollection.features && featureCollection.features.length) {
                var layerNameGuess = featureCollection.name;

                // if we don't have the actual layer name, then we'll try to guess it based on the url
                if (!layerNameGuess && featureCollection.url) {
                    var layerNameCandidates = pvMapper.map.layers.filter(function (layer) {
                        return layer.getVisibility() && featureCollection.url === (OpenLayers.Util.isArray(layer.url) ? layer.url[0] : layer.url);
                    });
                    layerNameGuess = layerNameCandidates && layerNameCandidates.length === 1 ? layerNameCandidates[0].name : null;
                }

                featureCollection.features.forEach(function (feature) {
                    // format a cute title... kinda (ought to add differentiation between layers here)
                    var myRow = feature.attributes;
                    var title = "Unknown feature";

                    // add an id to the title, if we have one
                    var idFields = ['NAME', 'Name', 'name', 'pname', 'Project Name', 'primarylocalname', 'dam_name', 'FID', 'fid', 'OBJECTID', 'objectid'];
                    for (var i = 0; i < idFields.length; i++) {
                        if (myRow[idFields[i]]) {
                            title = myRow[idFields[i]].toString().substring(0, 25); // trim the title to a max length...

                            if (!isNaN(+title)) // if the title is numeric (probably an OID or something), let's include the field as a courtesy
                                title = idFields[i] + ": " + title;
                            break;
                        }
                    }

                    if (layerNameGuess)
                        title += " (" + layerNameGuess + ")";

                    items.push({
                        xtype: "propertygrid",
                        title: title,
                        source: myRow
                    });
                });
            }
        });

        var identifyWindow = new Ext.create('Ext.window.Window', {
            layout: 'accordion',
            modal: true,
            title: "Identify Results",
            //bodyPadding: '5 5 0',
            width: 350,
            height: 450,
            items: items,
            buttons: [{
                text: 'Close',
                handler: function (b, e) {
                    identifyWindow.destroy();
                }
            }]
        });

        identifyWindow.show();
    };

    var IdentifyTool = new Ext.Button({
        text: "Identify",
        enableToggle: true,
        toggleGroup: "editToolbox",
        toggleHandler: function (buttonObj, eventObj) {
            if (buttonObj.pressed) {
                wmsInfoControl.activate();
            } else {
                wmsInfoControl.deactivate();
            }
        }
    });
    pvMapper.mapToolbar.add(2, IdentifyTool);

});