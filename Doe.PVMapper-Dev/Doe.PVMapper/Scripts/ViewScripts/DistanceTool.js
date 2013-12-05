

pvMapper.onReady(function () {
    var control = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
        eventListeners: {
            measure: function (evt) {
                Ext.MessageBox.alert('Measure Distance', "The measurement was " + evt.measure.toFixed(2) + " " + evt.units);
                //alert("The measurement was " + evt.measure.toFixed(2) + " " + evt.units);
            }
        }
    });

    pvMapper.map.addControl(control);

    var distanceBtn = new Ext.Button({
        text: 'Measure Distance',
        enableToggle: true,
        //displaySystemUnits: ["mi","ft"],
        toggleGroup: "editToolbox",
        toggleHandler: function (buttonObj, eventObj) {
            if (buttonObj.pressed) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
    });

    pvMapper.mapToolbar.add(3, distanceBtn);


    // add a button on the tool bar to launch a file picker to load local KML file.
    //first, create an input with type='file' and add it to the body of the page.
    var fileDialogBox = document.createElement('input');
    fileDialogBox.type = 'file';
    fileDialogBox.style = 'display:none';
    fileDialogBox.accept = "application/vnd.google-earth.kml+xml,application/vnd.google-earth.kmz"; //only support in chrome and IE.  FF doesn't work.

    document.body.appendChild(fileDialogBox);

    //listen to a file pick selection <OK> button on the file dialog box clicked.
    function handleCustomKML(evt) {
        if (!evt.target.files || !evt.target.files[0])
            return;

        var afile = evt.target.files[0];

        //we probably don't want to load hug file.  Limit is about 2MB.
        if (afile.size > 2000000) {
            Ext.MessageBox.confirm("File too big", "The file [" + afile.name + " with size: " + afile.size.toString() + "] is larger then 2000000 bytes (2 MB), do you want to continue loading?",
                function (btn) {
                    if (btn === 'yes') {
                        continueHandlingCustomKML(afile);
                    }
                });
        } else {
            continueHandlingCustomKML(afile);
        }
    }

    function continueHandlingCustomKML(afile) {
        if (afile.type === "application/vnd.google-earth.kmz") {
            var localLayer = new INLModules.LocalLayerModule();
            var reader = new FileReader();
            reader.onload = function (evt) { uncompressZip(evt.target.result, function (kmlResult) { localLayer.readTextFile(kmlResult, afile.name); }); }
            reader.readAsArrayBuffer(afile);
        } else if (afile.type === "application/vnd.google-earth.kml+xml") {
            var localLayer = new INLModules.LocalLayerModule();
            var reader = new FileReader();
            reader.onload = function (evt) { localLayer.readTextFile(evt.target.result, afile.name); }
            reader.readAsText(afile);
        } else {
            Ext.MessageBox.alert("Unknown File Type", "The file [" + afile.name + "] is not a KML format.");
        }
    }

    //create the actual button and put on the tool bar.
    var customTool = Ext.create('Ext.Action', {
        text: 'Add Distance Score From KML',
        tooltip: "Add a new layer using features from a KML file, and add a score line for the distance from each site to the nearest feature in the KML layer",
        //enabledToggle: false,
        handler: function () {
            fileDialogBox.removeEventListener('change', handleSiteKML, false);  //disable the site KML event.
            fileDialogBox.addEventListener('change', handleCustomKML, false);  // enable the distance KML event.
            fileDialogBox.click();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(customTool);


    function handleSiteKML(evt) {
        if (!evt.target.files || !evt.target.files[0])
            return;

        var afile = evt.target.files[0];

        //we probably don't want to load hug file.  Limit is about 2MB.
        if (afile.size > 2000000) {
            Ext.MessageBox.confirm("File Size Warning", "The file [" + afile.name + " with size: " + afile.size.toString() + "] is larger then 2000000 bytes (2 MB); do you want to try loading it anyway?",
                function (btn) {
                    if (btn === 'yes') {
                        continueHandlingSiteKML(afile);
                    }
                });
        } else {
            continueHandlingSiteKML(afile);
        }
    }

    function continueHandlingSiteKML(afile) {

        if (afile.type === "application/vnd.google-earth.kmz") {
            var reader = new FileReader();
            reader.onload = function (evt) { uncompressZip(evt.target.result, function (kmlResult) { importLocalSiteFromString(kmlResult, afile.name); }); }
            reader.readAsArrayBuffer(afile);
        } else if (afile.type === "application/vnd.google-earth.kml+xml") {
            var reader = new FileReader();
            reader.onload = function (evt) { importLocalSiteFromString(evt.target.result, afile.name); }
            reader.readAsText(afile);
        } else {
            Ext.MessageBox.alert("Unknown File Type", "The file [" + afile.name + "] is not a KML format.");
        }
    }

    //function importLocalSite(kmlFile) {
    //}

    function uncompressZip(kmzFile, kmlHandler) {
        //var $title = $("<h3>", {
        //    text: theFile.name
        //});
        //$result.append($title);
        //var $ul = $("<ul>");
        try {

            //var dateBefore = new Date();
            // read the content of the file with JSZip
            var zip = new JSZip(kmzFile);
            //var dateAfter = new Date();

            //$title.append($("<span>", {
            //    text: " (parsed in " + (dateAfter - dateBefore) + "ms)"
            //}));

            // that, or a good ol' for(var entryName in zip.files)
            $.each(zip.files, function (index, zipEntry) {
                if (zipEntry.name.substr(zipEntry.name.length - '.kml'.length).toLowerCase() === '.kml') {
                    kmlHandler(zipEntry.asText() /*, zipEntry.name*/ );
                }
                //$ul.append("<li>" + zipEntry.name + "</li>");
                // the content is here : zipEntry.asText()
            });
            // end of the magic !

        } catch (e) {
            Ext.MessageBox.alert("Compression Error", "The KMZ file could not be unzipped.");
            //$ul.append("<li class='error'>Error reading " + theFile.name + " : " + e.message + "</li>");
        }
        //$result.append($ul);
    }

    function importLocalSiteFromString(kmlString, kmlName) {
        var kml_projection = new OpenLayers.Projection("EPSG:4326");
        var map_projection = new OpenLayers.Projection("EPSG:3857");

        //var osm: OpenLayers.OSM = new OpenLayers.Layer.OSM();
        var kmlFormat = new OpenLayers.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: map_projection,
            externalProjection: kml_projection
        });

        var features = kmlFormat.read(kmlString);
        var polyFeatures = [];
        var feature;
        while (feature = features.pop()) {
            if (feature.geometry.CLASS_NAME === "OpenLayers.Geometry.Polygon") {
                polyFeatures.push(feature);
            } else if (feature.geometry.CLASS_NAME === "OpenLayers.Geometry.Collection") {
                for (var i = 0; i < feature.geometry.components.length; i++) {
                    var subFeature = feature.clone();
                    subFeature.geometry = feature.geometry.components[i];
                    features.push(subFeature);
                }
            }
        }

        if (polyFeatures.length >= 10) {
            Ext.MessageBox.confirm("Numerous Sites Warning", "There are more then 10 sites to add; do you want to add them anyway?",
                function (btn) {
                    if (btn === 'yes') {
                        for (var i = 0; i < polyFeatures.length; i++) {
                            AddSite(polyFeatures[i]);
                        }
                    }
                });
        } else if (polyFeatures.length <= 0) {
            Ext.MessageBox.alert("No Sites Found", "Failed to extract any KML polygons from the file provided.");
        } else {
            for (var i = 0; i < polyFeatures.length; i++) {
                AddSite(polyFeatures[i]);
            }
        }
    };

    function AddSite(kmlFeature) {
        var name = kmlFeature.attributes.name ? kmlFeature.attributes.name : "KML site";
        var desc = kmlFeature.attributes.description ? kmlFeature.attributes.description : "";

        kmlFeature.attributes.name = name;
        kmlFeature.attributes.description = desc;

        //Redraw the feature with its new name
        //feature.layer.drawFeature(feature);

        WKT = kmlFeature.geometry.toString();

        pvMapper.postSite(name, desc, WKT)
            .done(function (site) {
                kmlFeature.fid = site.siteId;
                kmlFeature.style = null;

                pvMapper.siteLayer.addFeatures([kmlFeature]);

                //push the new site into the pvMapper system
                var newSite = new pvMapper.Site(kmlFeature);
                pvMapper.siteManager.addSite(newSite);

                if (console) console.log('Added ' + newSite.name + ' from KML to the site manager');
            })
            .fail(function () {
                if (console) console.log('failed to post KML site');
                kmlFeature.destroy();
            });
    }

    var siteImportAction = Ext.create('Ext.Action', {
        text: 'Load Sites From KML',
        tooltip: "Import site polygons from a KML file",
        handler: function () {
            fileDialogBox.removeEventListener('change', handleCustomKML, false);  //enable the site KML event.
            fileDialogBox.addEventListener('change', handleSiteKML, false);  // disable the distance KML event.
            fileDialogBox.click();
        }
    });
    pvMapper.sitesToolbarMenu.add('-');
    pvMapper.sitesToolbarMenu.add(siteImportAction);



    
    function ExportToXML() {
        var kml_projection = new OpenLayers.Projection("EPSG:4326");
        var map_projection = new OpenLayers.Projection("EPSG:3857");

        var kmlFormat = new OpenLayers.Format.KML({
            extractStyles: false,
            extractAttributes: true,
            internalProjection: map_projection,
            externalProjection: kml_projection 
        });

        var sitesKml = kmlFormat.write(pvMapper.siteLayer.features);
        SaveAsFile(sitesKml);
    }



    function SaveAsFile(content) {

        // add a button on the tool bar to launch a file picker to load local KML file.
        //first, create an input with type='file' and add it to the body of the page.
        Ext.MessageBox.prompt('Save file as', 'Please enter a filename for the export sites.',
            function (btn, filename) {
                if (btn === 'ok') {
                    filename = filename || 'sites.kml';

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    //check to make sure that the file has '.kml' extension.
                    var dotindex = filename.lastIndexOf('.');
                    dotindex = dotindex == -1 ? filename.length : dotindex;
                    filename = filename.substr(0, dotindex, dotindex) + '.kml';

                    var blob = CustomBlob(content, null);
                    blob.data = content;
                    blob.type = 'data:application/vnd.google-earth.kml+xml';
                    saveAs(blob, filename);
                }
            }, this, false, 'Sites.kml');

        //This code below works too, but always save with a file name of "Download.kml".
        //uriContent = 'data:application/vnd.google-earth.kml+xml;headers=Content-Disposition:attachment;filename="sites.kml",' + encodeURIComponent(content);
        //newWindow = window.open(uriContent, 'sites.kml');
    }

    var kmlExportBtn = Ext.create('Ext.Action', {
        text: 'Save Sites to KML',
        tooltip: "Export site polygons and scores to a KML file",
        handler: function () {
            ExportToXML();
        }
    });
    pvMapper.sitesToolbarMenu.add(kmlExportBtn);

});

