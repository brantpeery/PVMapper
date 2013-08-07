pvMapper.onReady(function () {

    // We need to send requests through the proxy, to avoid cross domain security restrictions.
    // Just set the global proxy host for all OpenLayers calls, and be done with it.
    OpenLayers.ProxyHost = "/Proxy/proxy.ashx?";

    var control = new OpenLayers.Control.WMSGetFeatureInfo({
        //infoFormat: "application/vnd.ogc.gml", // <-- this format works reliably with GeoServer instances
        //infoFormat: "application/vnd.esri.wms_featureinfo_xml", // <-- this format works reliably with ArcGIS Server instances, 
        //                  ...but OpenLayers fails to parse it (see https://github.com/openlayers/openlayers/issues/885)
        infoFormat: "text/html", // <-- this is the only format which 'works' reliably for both servers. But, it's terribly ugly.
        // These formats didn't work reliably with ArcGIS Server: // "text/xml", // "application/vnd.ogc.wms_xml", // "application/json", // "application/vnd.ogc.gml",
        //...
        queryVisible: true, // <-- setting this to true will only call Identify on visible layers. Defaults to false.
        //drillDown: true, // <-- setting this will call identify on all (visible?) layers, rather than just the first (visible?) layer
        //Note: it looks like drillDown won't work unless we put our table parsing logic (below) inside of a new class inheriting from OpenLayers.Format
        //      this is because the object returned to us after the drill down only contains the raw text from the last identify operation to finish.
        //      if we pass in our own OpenLayers.Format class to the WMSGetFeatureInfo Control, it will get each of the raw text values in turn.
        //      ... (and it probably should inherit from OpenLayers.Format.XML, or even OpenLayers.Format.WMSGetFeatureInfo, for enhanced awesomeness)
        //...
        //output: 'object', // <-- this didn't help at all... but it might help, a little, if we implement our own OpenLayers.Format object
        //...
        maxFeatures: 3,
        eventListeners: {
            getfeatureinfo: function (e) {
                console.log("Identify WMS GetFeatureInfo Function");
                var items = [];
                Ext.each(e.features, function (feature) {
                    items.push({
                        xtype: "propertygrid",
                        title: feature.fid,
                        source: feature.attributes
                    });
                });

                ////////////////////////////////////////////////
                // Begin shabby code block:
                // this block assumes that there is an HTML table somewhere in the provided e.text, and tries to parse it.
                var $headers = $(e.text).find("th");
                var myRows = [];
                var headersText = [];

                var $rows = $(e.text).find("tr").each(function (index) {
                    $cells = $(this).find("td");
                    myRows[index] = {};

                    $cells.each(function (cellIndex) {
                        // Set the header text
                        if (headersText[cellIndex] === undefined) {
                            headersText[cellIndex] = $($headers[cellIndex]).text();
                        }
                        // Update the row object with the header/cell combo
                        var text = $(this).text();
                        if (text !== "") {
                            myRows[index][headersText[cellIndex]] = text;
                        }
                    });
                });

                // hack hack... show parsed html table results
                Ext.each(myRows, function (myRow) {
                    // the first row seems to return empty, so skip it here.
                    //Note: it returns empty because it's the header row: a <tr> element whose children are <th> elements, not <td> elements)
                    if (!jQuery.isEmptyObject(myRow)) {
                        // format a cute title... kinda (ought to add differentiation between layers here)
                        var title = "Feature parsed from HTML table";
                        if (myRow['fid']) {
                            title += " (" + myRow['fid'] + ")";
                        } else if (myRow['OBJECTID']) {
                            title += " (" + myRow['OBJECTID'] + ")";
                        }

                        items.push({
                            xtype: "propertygrid",
                            title: title,
                            source: myRow
                        });
                    }
                });

                
                
                // hack hack... show any returned html 'natively'
                if (e.text.indexOf('html') >= 0) {
                    items.push({
                        xtype: "panel",
                        title: "Rendered HTML table",
                        html: e.text
                    });
                }

                // hack hack... show raw value returned (helpful for debugging)
                items.push({
                    xtype: "propertygrid",
                    title: "Raw value returned",
                    source: { url: e.object.url, features: e.features.length, text: e.text, textLength: e.text.length }
                });

                // End shabby code block.
                ////////////////////////////////////////////////

                var wiz = new Ext.create('Ext.window.Window', {
                    layout: 'accordion',
                    modal: true,
                    //collapsible: false, // <-- this didn't seem to do much
                    id: "iden",
                    title: "Identify Point",
                    bodyPadding: '5 5 0',
                    width: 350,
                    height: 450,
                    items: items,
                    buttons: [{
                        text: 'Close',
                        handler: function (b, e) {
                            //control.deactivate(); // <-- this disables the control, but it doesn't disable our button - a little confusing
                            //b.pressed = false;
                            wiz.destroy();
                        }
                    }]

                });

                wiz.show();

                //Note: this is a total hack. But without it, the control will only ever send requests to the first layer it sent a request to.
                control.url = null; //TODO: hack hack hack hack...!
            }
        }
    });

    pvMapper.map.addControl(control);


    var IdentifyTool = new Ext.Button({
        text: "Identify",
        enableToggle: true,
        toggleGroup: "editToolbox",
        toggleHandler: function (buttonObj, eventObj) {
            if (buttonObj.pressed) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
    });
    pvMapper.mapToolbar.add(IdentifyTool);

});