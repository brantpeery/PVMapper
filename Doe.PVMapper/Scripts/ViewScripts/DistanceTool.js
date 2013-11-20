

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

    pvMapper.mapToolbar.add(distanceBtn);


    // add a button on the tool bar to launch a file picker to load local KML file.
    //first, create an input with type='file' and add it to the body of the page.
    var fileDialogBox = document.createElement('input');
    fileDialogBox.type = 'file';
    fileDialogBox.style = 'display:none';
    fileDialogBox.accept = "application/vnd.google-earth.kml+xml"; //only support in chrome and IE.  FF doesn't work.

    document.body.appendChild(fileDialogBox);

    //listen to a file pick selection <OK> button on the file dialog box clicked.
    function handleCustomKML(evt) {
        var afile = evt.target.files[0];
        if (afile.type !== "application/vnd.google-earth.kml+xml") {
            Ext.MessageBox.alert("File type unknown.", "The file [" + afile.name + "] is not a KML format.");
            return;
        }

        //we probably don't want to load hug file.  Limit is about 2MB.
        if (afile.size > 2000000) {
            Ext.MessageBox.confirm("File too big", "The file [" + afile.name + " with size: " + afile.size.toString() + "] is larger then 2000000 bytes (2 MB), do you want to continue loading?",
                function (btn) {
                    if (btn === 'yes') {
                        var localLayer = new INLModules.LocalLayerModule();
                        isFileRead = localLayer.readTextFile(evt.target.files[0]);
                    }
                });
        } else {
            var localLayer = new INLModules.LocalLayerModule();
            isFileRead = localLayer.readTextFile(evt.target.files[0]);
        }
    }


    //create the actual button and put on the tool bar.
    var customTool = new Ext.Button({
        text: 'Add KML Distance Score',
        enabledToggle: false,
        handler: function () {
            fileDialogBox.removeEventListener('change', handleSiteKML, false);  //disable the site KML event.
            fileDialogBox.addEventListener('change', handleCustomKML, false);  // enable the distance KML event.
            fileDialogBox.click();
        }
    });
    pvMapper.mapToolbar.add(customTool);


    function handleSiteKML(evt) {
        var afile = evt.target.files[0];
        if (afile.type !== "application/vnd.google-earth.kml+xml") {
            Ext.MessageBox.alert("File type unknown.", "The file [" + afile.name + "] is not a KML format.");
            return;
        }

        //we probably don't want to load hug file.  Limit is about 2MB.
        if (afile.size > 2000000) {
            Ext.MessageBox.confirm("File too big", "The file [" + afile.name + " with size: " + afile.size.toString() + "] is larger then 2000000 bytes (2 MB), do you want to continue loading?",
                function (btn) {
                    if (btn === 'yes') {
                        importLocalSite(afile);
                    }
                });
        } else {
            importLocalSite(afile);
        }
    }

    function importLocalSite(kmlFile) {
        var reader = new FileReader();

        reader.readAsText(kmlFile);
        reader.onload = function (evt) {
            var kml_projection = new OpenLayers.Projection("EPSG:4326");
            var map_projection = new OpenLayers.Projection("EPSG:3857");

            //var osm: OpenLayers.OSM = new OpenLayers.Layer.OSM();
            var kmlFormat = new OpenLayers.Format.KML({
                extractStyles: true,
                extractAttributes: true,
                internalProjection: map_projection,
                externalProjection: kml_projection
            });

            //OpenLayers.Feature.Vector
            var features = kmlFormat.read(evt.target.result);
            var polys = [];
            for (i = 0; i < features.length; i++) {
                if (features[i].geometry && features[i].geometry.CLASS_NAME === "OpenLayers.Geometry.Polygon") {
                    polys.push(features[i]);
                }
            }

            if (polys.length >= 10) {
                Ext.MessageBox.confirm("Too many sites", "There are more then 10 sites to be save, do you want to continue?",
                    function (btn) {
                        if (btn === 'yes') {
                            for (var i = 0; i < polys.length; i++) {
                                AddSite(polys[i]);
                            }
                        }
                    });
            } else {
                for (var i = 0; i < polys.length; i++) {
                    AddSite(polys[i]);
                }
            }
        };
    }

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

    var siteImportBtn = new Ext.Button({
        text: 'Load Sites from KML',
        enabledToggle: false,
        handler: function () {
            fileDialogBox.removeEventListener('change', handleCustomKML, false);  //enable the site KML event.
            fileDialogBox.addEventListener('change', handleSiteKML, false);  // disable the distance KML event.
            fileDialogBox.click();
        }
    });
    pvMapper.mapToolbar.add(siteImportBtn);



    
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

    var kmlExportBtn = new Ext.Button({
        text: 'Save Sites to KML',
        enabledToggle: false,
        handler: function () {
            ExportToXML();
        }
    });
    pvMapper.mapToolbar.add(kmlExportBtn);

});

