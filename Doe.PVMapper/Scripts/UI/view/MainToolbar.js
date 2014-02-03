

pvMapper.onReady(function () {

    //----------------------------------------------------------------------------------------
    //#region Address Search
    // place name and address search box
    var searchComboBox = Ext.create('Heron.widgets.search.NominatimSearchCombo', {
        map: pvMapper.map,
        width: 400,
    });

    pvMapper.mapToolbar.add(9, searchComboBox);
    //#endregion
    //----------------------------------------------------------------------------------------
    //#region Measure distance tool
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
    //#endregion
    //----------------------------------------------------------------------------------------
    //#region OpenFileDialog
    // add a button on the tool bar to launch a file picker to load local KML file.
    //first, create an input with type='file' and add it to the body of the page.
    var KMLMode = { KMLNONE: 0, KMLSITE: 1, KMLDISTANCE: 2, KMLINFO: 3 };
    KMLMode.CurrentMode = KMLMode.KMLNONE;
    var fileDialogBox = document.createElement('input');
    fileDialogBox.type = 'file';
    fileDialogBox.style = 'display:none';
    fileDialogBox.accept = "application/vnd.google-earth.kml+xml,application/vnd.google-earth.kmz"; //only support in chrome and IE.  FF doesn't work.
    fileDialogBox.addEventListener('change', handleCustomKML, false);  // disable the distance KML event.

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
                        switch (KMLMode.CurrentMode) {
                            case KMLMode.KMLSITE:
                                continueHandlingSiteKML(afile);
                                break;
                            case KMLMode.KMLDISTANCE:
                                continueHandlingDistanceKML(afile);
                                break;
                            case KMLMode.KMLINFO:
                                continueHandlingInfoKML(afile);
                                break;
                    }
        }
                        });
            } else {
            switch (KMLMode.CurrentMode) {
                case KMLMode.KMLSITE:
                        continueHandlingSiteKML(afile);
                    break;
                case KMLMode.KMLDISTANCE:
                    continueHandlingDistanceKML(afile);
                    break;
                case KMLMode.KMLINFO:
                    continueHandlingInfoKML(afile);
                    break;
                    }
        }
        fileDialogBox.value = "";
    }
    //#endregion OpenFileDialog
    //----------------------------------------------------------------------------------------
    //#region  KML Site Import
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

    function uncompressZip(kmzFile, kmlHandler) {
        try {
            var zip = new JSZip(kmzFile);
            // that, or a good ol' for(var entryName in zip.files)
            $.each(zip.files, function (index, zipEntry) {
                if (zipEntry.name.substr(zipEntry.name.length - '.kml'.length).toLowerCase() === '.kml') {
                    kmlHandler(zipEntry.asText() /*, zipEntry.name*/);
                }
            });
            // end of the magic !

        } catch (e) {
            Ext.MessageBox.alert("Compression Error", "The KMZ file could not be unzipped.");
        }
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
                    features.push(subFeature);  //note: append each collection component  onto the features to be recursively traverse.
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

    ///kmlFeature : pvMapper.SiteFeature.
    function AddSite(kmlFeature) {
        var name = kmlFeature.attributes.name ? kmlFeature.attributes.name : "KML site";
        var desc = kmlFeature.attributes.description ? kmlFeature.attributes.description : "";

        kmlFeature.attributes.name = name;
        kmlFeature.attributes.description = desc;

        WKT = kmlFeature.geometry.toString();

        //adding the site to the server database.
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
        text: 'Load Sites from KML',
        iconCls: 'x-open-menu-icon',
        tooltip: "Import site polygons from a KML file",
        handler: function () {
            fileDialogBox.value = ''; // this allows us to select the same file twice in a row (and still fires the value changed event)
            KMLMode.CurrentMode = KMLMode.KMLSITE;
            fileDialogBox.click();
        }
    });
    pvMapper.sitesToolbarMenu.add('-');
    pvMapper.sitesToolbarMenu.add(siteImportAction);
    //#endregion KML Site import
    //----------------------------------------------------------------------------------------
    //#region export site to KML
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
                    filename = (filename || 'PVMapper Sites') + '.kml';

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
            }, this, false, 'PVMapper Sites');

        //This code below works too, but always save with a file name of "Download.kml".
        //uriContent = 'data:application/vnd.google-earth.kml+xml;headers=Content-Disposition:attachment;filename="sites.kml",' + encodeURIComponent(content);
        //newWindow = window.open(uriContent, 'sites.kml');
    }

    var kmlExportBtn = Ext.create('Ext.Action', {
        text: 'Save Sites to KML',
        iconCls: 'x-save-menu-icon',
        tooltip: "Export site polygons and scores to a KML file",
        handler: function () {
            ExportToXML();
        }
    });
    pvMapper.sitesToolbarMenu.add(kmlExportBtn);
    //#endregion export site to KML
    //----------------------------------------------------------------------------------------
    //#region Save scoreboard
    function saveScoreboardAs() {

        // add a button on the tool bar to launch a file picker to load local KML file.
        //first, create an input with type='file' and add it to the body of the page.
        Ext.MessageBox.prompt('Save file as', 'Please enter a filename for the export sites (.pvProj).',
            function (btn, filename) {
                if (btn === 'ok') {
                    filename = (filename || 'PVMapper Project');//  + '.pvProj';  Blindly add extension confuses user.

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    //check to make sure that the file has '.pvProj' extension..  We will check and add extension only if user did not provide or provided with wrong extension.
                    var dotindex = filename.lastIndexOf('.');
                    dotindex = dotindex == -1 ? filename.length : dotindex;
                    filename = filename.substr(0, dotindex, dotindex) + '.pvProj';

                    var content = JSON.stringify(pvMapper.mainScoreboard);
                    var blob = CustomBlob(content, null);
                    blob.data = content;
                    blob.type = 'data:application/json';
                    saveAs(blob, filename);
                }
            }, this, false, 'PVMapper Project');

    }

    var loadScoreboardBtn = Ext.create('Ext.Action', {
        text: 'Save Project',
        iconCls: 'x-saveproject-menu-icon',
        tooltip: "Save the Scoreboard project to local file.",
        handler: function () {
            saveScoreboardAs();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(0, loadScoreboardBtn);
    //#endregion Save scoreboard
    //----------------------------------------------------------------------------------------
    //#region Load scoreboard
    var fDialogBox = document.createElement('input');
    fDialogBox.type = 'file';
    fDialogBox.style = 'display:none';
    fDialogBox.accept = ".pvProj"; //only support in chrome and IE.  FF doesn't work.
    fDialogBox.addEventListener('change', handleLoadScoreboard, false);
    document.body.appendChild(fDialogBox);
    function handleLoadScoreboard(evt) {
        if (!evt.target.files || !evt.target.files[0])
            return;

        var afile = evt.target.files[0];
        var afilename = afile.name;


        //check to make sure that the file has '.kml' extension.
        var dotindex = afilename.lastIndexOf('.');
        dotindex = dotindex == -1 ? afilename.length : dotindex;
        var name = afilename.substr(0, dotindex, dotindex);
        var extension = afilename.replace(name, "");

        if (extension === ".pvProj") {
            var reader = new FileReader();
            reader.onload = function (evt) { importScoreboardFromJSON(evt.target.result); }
            reader.readAsText(afile);
        } else {
            Ext.MessageBox.alert("Unrecognize File Type", "The file [" + afile.name + "] is not a PVMapper project.");
        }
        fDialogBox.value = "";  //reset so we can open the same file again.
                }

    function AddScoreboardSite(aFeature, fn) {
        WKT = aFeature.geometry.toString();

        //adding the site to the server database.
        pvMapper.postSite(aFeature.attributes.name, aFeature.attributes.description, WKT)
            .done(function (site) {
                aFeature.fid = site.siteId;

                pvMapper.siteLayer.addFeatures([aFeature]);

                //push the new site into the pvMapper system
                var newSite = new pvMapper.Site(aFeature);
                pvMapper.siteManager.addSite(newSite);

                if (console) console.log('Added ' + newSite.name + ' from Scoreboard Project to the site manager');
                if ((fn) && (typeof fn === "function"))
                    fn();
            })
            .fail(function () {
                if (console) console.log('failed to post Scoreboard site');
                aFeature.destroy();
            });
    }

    var isDone;
    var whenDone;
    function waiting() {
        if ((isDone) && (typeof isDone === "function")) {
            if (!isDone()) {
                setTimeout(waiting, 1000); //1 second.
            }
            else {
                if ((whenDone) && (typeof whenDone === "function"))
                    whenDone();
            }
        }
    }

    function importScoreboardFromJSON(scoreboardJSON) {
        var obj = JSON.parse(scoreboardJSON);

        if ((obj.scoreLines !== undefined) && (obj.scoreLines.length > 0)) {
            //first remove all sites from sitelayer and from the database.

            var site, feature;
            var features = [];

            //look up for all currently in memory features
            while (site = pvMapper.siteManager.sites.pop()) {
                pvMapper.deleteSite(site.id);
                pvMapper.siteManager.removeSite(site);
                feature = pvMapper.siteLayer.features.find(
                    function (a) {
                        if (a.attributes.name === site.name) return true;
                        else return false;
                    });
                if (feature !== null)
                    features.push(feature);
            }

            //remove all site features found
            pvMapper.siteLayer.removeFeatures(features, { silent: true });

            //the scoreboard JSON object is in the following format, we need to search throught to find all features (polygons)
            //root
            //   |=scoreLines
            //           |= Scores
            //                  |= Scores
            //                        |= Site
            //                             |= geometry (features)
            var allSites = [];
            obj.scoreLines.forEach(function (scline, scid) {
                scline.scores.forEach(function (score, sid) {
                    var asite = allSites.find(
                        function (a) {
                            if (a.name === score.site.name) return true;
                            else return false;
                        });
                    if (asite == null)
                        allSites.push(score.site);
                });
            });

            //now add the project sites into siteLayer.
            var count = 0;
            allSites.forEach(function (site, idx) {
                feature = new OpenLayers.Feature.Vector(
                     OpenLayers.Geometry.fromWKT(site.geometry),
                     {
                         name: site.name,
                         description: site.description
                     },
                     pvMapper.siteLayer.style
                );
                AddScoreboardSite(feature, function () {
                    count++;
                });
            });

            //This is  a hack synchronize to wait until all sites have been added before updating data to the scoreboard.
            //isDone is a callback for the wait() function to check for when all sites are added,  it then 
            //call a callback whenDone() function to continue.
            isDone = function () {
                return count == allSites.length;
            }
            whenDone = function () {
                //all scorelines (modules) should've been created.
                //update score in each scoreLine, if matched.
                obj.scoreLines.forEach(function (line, idx) {
                    var scLine = pvMapper.mainScoreboard.scoreLines.find(
                        function (a) {
                            if ((a.category === line.category) && (a.title === line.title)) return true;
                            else return false;
                        });

                    if (typeof scLine === "object" && scLine !== null) {
                        scLine.suspendEvent = true;
                        scLine.fromJSON(line);
                        scLine.suspendEvent = false;
                    }
                });

                var bound = pvMapper.siteLayer.getDataExtent();
                pvMapper.map.zoomToExtent(bound, false);
            }
            waiting();

        }
        else {
            Ext.MessageBox.alert("Unrecognize data structure", "The file [" + afile.name + "] doesn't seems to be a PVMapper project file.");
        }
    }


    var loadScoreboardBtn = Ext.create('Ext.Action', {
        text: 'Load Project',
        iconCls: 'x-openproject-menu-icon',
        tooltip: "Load a saved scoreboard project and use it as a default.",
        handler: function () {
            fDialogBox.value = ''; // this allows us to select the same file twice in a row (and still fires the value changed event)
            fDialogBox.click();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(1, loadScoreboardBtn);

    //#endregion Load scoreboard
    //----------------------------------------------------------------------------------------
    //#region SaveScoreboardConfig
    function saveScoreboardConfig() {
        Ext.MessageBox.prompt('Save file as', 'Please enter a configuraton filename (.pvCfg).',
            function (btn, filename) {
                if (btn === 'ok') {
                    filename = (filename || 'PVMapper Config'); //  + '.pvCfg';   //I think I like this behavior better, ... ??

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    //check to make sure that the file has '.pvCfg' extension..  We will check and add extension only if user did not provide or provided with wrong extension.
                    var dotindex = filename.lastIndexOf('.');
                    dotindex = dotindex == -1 ? filename.length : dotindex;
                    filename = filename.substr(0, dotindex, dotindex) + '.pvCfg';

                    var config = {configLines: []};
                    var aUtility, aStarRatables, aWeight, aTitle, aCat = null;

                    pvMapper.mainScoreboard.scoreLines.forEach(
                        function (scrline, idx, scoreLines) {
                            aUtility = scrline.scoreUtility;
                            aWeight = scrline.weight;
                            aTitle = scrline.title;
                            aCat = scrline.category;
                            aStarRatables = null;
                            if (scrline.getStarRatables !== undefined) {
                                aStarRatables = scrline.getStarRatables();
                            }
                            config.configLines.push({ title: aTitle, category: aCat, utility: aUtility, starRatables: aStarRatables, weight: aWeight });
                        });
                    var content = JSON.stringify(config);
                    var blob = CustomBlob(content, null);
                    blob.data = content;
                    blob.type = 'data:application/json';
                    saveAs(blob, filename);
                }
            }, this, false, 'PVMapper Config');
    }
    //----------------------------------------------------------------------------------------

    var saveConfigBtn = Ext.create('Ext.Action', {
        text: "Save Configuration",
        iconCls: "x-saveconfig-menu-icon",
        tooltip: "Save the Scoreboard Utility configuration to a local file.",
        handler: function () {
            saveScoreboardConfig();
        }
    });

    pvMapper.scoreboardToolsToolbarMenu.add(2, '-');
    pvMapper.scoreboardToolsToolbarMenu.add(3, saveConfigBtn);
    //#endregion SaveScoreboardConfig
    //----------------------------------------------------------------------------------------
    //#region LoadScoreboardConfig
    var configDialogBox = document.createElement('input');
    configDialogBox.type = 'file';
    configDialogBox.style = 'display:none';
    configDialogBox.accept = ".pvCfg"; //only support in chrome and IE.  FF doesn't work.
    configDialogBox.addEventListener('change', handleLoadScoreboardConfig, false);
    document.body.appendChild(configDialogBox);

    function handleLoadScoreboardConfig(evt) {
        if (!evt.target.files || !evt.target.files[0])
            return;

        var afile = evt.target.files[0];
        var afilename = afile.name;
        //check to make sure that the file has '.pvCfg' extension.
        var dotindex = afilename.lastIndexOf('.');
        dotindex = dotindex == -1 ? afilename.length : dotindex;
        var name = afilename.substr(0, dotindex, dotindex);
        var extension = afilename.replace(name, "");

        //since this feature is not support in FF, we need to check to make sure the file is correct extension.
        if (extension === ".pvCfg") {
            var reader = new FileReader();
            reader.onload = function (evt) { loadScoreboardConfig(evt.target.result); }
            reader.readAsText(afile);
        } else {
            Ext.MessageBox.alert("Unrecognize File Type", "The file [" + afile.name + "] is not a PVMapper configuration file.");
        }
        configDialogBox.value = "";

    }
    function loadScoreboardConfig(configJSON) {
        var obj = JSON.parse(configJSON);

        if ((obj.configLines !== undefined) && (obj.configLines.length > 0)) {
            //first remove all sites from sitelayer and from the database
            var scLine;
            obj.configLines.forEach(
                function (cfgLine, idx, configLines) {
                    scLine = pvMapper.mainScoreboard.scoreLines.find(
                        function (a) {
                            if ((a.category === cfgLine.category) && (a.title === cfgLine.title)) return true;
                            else return false;
                        });

                    if (scLine !== null) {
                        scLine.updateConfiguration(cfgLine.utility, cfgLine.starRatables, cfgLine.weight);
                    }
                });
        }
        else {
            Ext.MessageBox.alert("Unrecognize structure", "The file [" + afile.name + "] doesn't seems to be a PVMapper configuration file.");
        }

    }

    //----------------------------------------------------------------------------------------
    var loadConfigBtn = Ext.create('Ext.Action', {
        text: "Load Configuration",
        iconCls: "x-openconfig-menu-icon",
        tooltip: "Load a Scoreboard Utility configuration from a local file.",
        handler: function () {
            configDialogBox.value = ''; // this allows us to select the same file twice in a row (and still fires the value changed event)
            configDialogBox.click();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(4, loadConfigBtn);
    //#endregion LoadScoreboardConfig
    //----------------------------------------------------------------------------------------
    //#region Reset scoreboard config
    function resetScoreboardConfig() {
        pvMapper.mainScoreboard.scoreLines.forEach(
            function (scrLine, idx, scoreLines) {
                scrLine.scoreUtility = scrLine.defaultScoreUtility;
                if ((scrLine.setStarRatables !== undefined) && (scrLine.getStarRatables !== undefined))
                    scrLine.setStarRatables(scrLine.getStarRatables("default"));
                scrLine.setWeight(10); //TODO: not all score lines have a default weight of 10.
                //TODO: some score lines have their own config menues, which should also be reset.
            });
    }

    var resetScoreboardBtn = Ext.create('Ext.Action', {
        text: 'Reset Configuration',
        iconCls: "x-cleaning-menu-icon",
        tooltip: "Reset the scoreboard to the default configuration",
        handler: function () {
            resetScoreboardConfig();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(5, resetScoreboardBtn);
    //#endregion
    //----------------------------------------------------------------------------------------
    //#region Export to Excel
    function exportScoreboardToCSV() {
        Ext.MessageBox.prompt('Save file as', 'Please enter a filename for the scoreboard (.CSV).',
            function (btn, filename) {
                if (btn === 'ok') {
                    filename = (filename || 'PVMapper Scoreboard');  /// + '.csv';  If user happen to enter with extension, we will have double .

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    //check to make sure that the file has '.csv extension.  We just guard against wrong extension entered by user here.  Or if user not provided extension or mistype, we then add it here -- be smarter.
                    var dotindex = filename.lastIndexOf('.');
                    dotindex = dotindex == -1 ? filename.length : dotindex;
                    filename = filename.substr(0, dotindex, dotindex) + '.csv';

                    var exporter = Ext.create("GridExporter");

                    var content = exporter.getCSV(pvMapper.scoreboardGrid);
                    var blob = CustomBlob(content, null);
                    blob.data = content;
                    blob.type = 'data:application/csv';
                    saveAs(blob, filename);
                }
            }, this, false, 'PVMapper Scoreboard'
        );
    }

    var exportBtn = Ext.create('Ext.Action', {
        text: "Export Scoreboard to CSV",
        iconCls: "x-fileexport-menu-icon",
        tooltip: "Export the scoreboard data to a CSV file.",
        handler: function () {
            exportScoreboardToCSV();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(6, exportBtn);

    //#endregion
    //----------------------------------------------------------------------------------------
    //#region Add distance score from KML
    function continueHandlingDistanceKML(afile) {
        var module = pvMapper.customModules.find(function (a) {
            if (a.name === afile.name) return true;
            else return false;
        });

        if (!module) {
            Ext.MessageBox.prompt("Module Naming", "Please type in the module name", function (btn, kmlModuleName) {
                if (btn == 'ok') {
                    if (kmlModuleName.length == 0)
                        kmlModuleName = afile.name;

                    if (afile.type === "application/vnd.google-earth.kmz") {
                        var localLayer = new INLModules.LocalLayerModule();
                        var reader = new FileReader();
                        reader.onload = function (evt) {
                            uncompressZip(evt.target.result,
                                function (kmlResult) {
                                    localLayer.readTextFile(kmlResult, kmlModuleName, afile.name);
                                    pvMapper.customModules.push(new pvMapper.CustomModuleData({ fileName: afile.name, moduleObject: localLayer }));
                                    saveToLocalDB(kmlModuleName, localLayer.moduleClass, afile.name, kmlResult);
                                });
                        }
                        reader.readAsArrayBuffer(afile);
                    } else if (afile.type === "application/vnd.google-earth.kml+xml") {
                        var localLayer = new INLModules.LocalLayerModule();
                        var reader = new FileReader();
                        reader.onload = function (evt) {
                            localLayer.readTextFile(evt.target.result, kmlModuleName, afile.name);
                            pvMapper.customModules.push(new pvMapper.CustomModuleData({ fileName: afile.name, moduleObject: localLayer }));
                            saveToLocalDB(kmlModuleName, localLayer.moduleClass, afile.name, evt.target.result);
                        }
                        reader.readAsText(afile);
                    } else {
                        Ext.MessageBox.alert("Unknown File Type", "The file [" + afile.name + "] is not a KML format.");
                    }
                }
            }, this, false, afile.name);
        }
        else {
            Ext.MessageBox.alert("Duplicate module", "The module [" + afile.name + "] aleady loaded.");
        }
    }

    //create the actual button and put on the tool bar.
    var customTool = Ext.create('Ext.Action', {
        text: 'Add Distance Score From KML',
        iconCls: "x-open-menu-icon",
        tooltip: "Add a new layer using features from a KML file, and add a score line for the distance from each site to the nearest feature in the KML layer",
        //enabledToggle: false,
        handler: function () {
            fileDialogBox.value = ''; // this allows us to select the same file twice in a row (and still fires the value changed event)
            KMLMode.CurrentMode = KMLMode.KMLDISTANCE;
            fileDialogBox.click();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(7, '-');
    pvMapper.scoreboardToolsToolbarMenu.add(8, customTool);
    //#endregion Distance score from KML
    //----------------------------------------------------------------------------------------
   //#region Custom Info From KML
    function continueHandlingInfoKML(afile) {
        var module = pvMapper.customModules.find(function (a) {
            if (a.name === afile.name) return true;
            else return false;
        });

        if (!module) {
            Ext.MessageBox.prompt("Module Naming", "Please type in the module name", function (btn, kmlModuleName) {
                if (btn == 'ok') {
                    if (kmlModuleName.length == 0)
                        kmlModuleName = afile.name;

                    if (afile.type === "application/vnd.google-earth.kmz") {
                        var infoLayer = new INLModules.KMLInfoModule();
                        var reader = new FileReader();
                        reader.onload = function (evt) {
                            uncompressZip(evt.target.result,
                                function (kmlResult) {
                                    infoLayer.readTextFile(kmlResult, kmlModuleName, afile.name);
                                    pvMapper.customModules.push(new pvMapper.CustomModuleData({ fileName: afile.name, moduleObject: infoLayer }));
                                    saveToLocalDB(kmlModuleName, infoLayer.moduleClass, afile.name, kmlResult);
                                });
                        }
                        reader.readAsArrayBuffer(afile);
                    } else if (afile.type === "application/vnd.google-earth.kml+xml") {
                        var infoLayer = new INLModules.KMLInfoModule();
                        var reader = new FileReader();
                        reader.onload = function (evt) {
                            infoLayer.readTextFile(evt.target.result, kmlModuleName, afile.name);
                            pvMapper.customModules.push(new pvMapper.CustomModuleData({ fileName: afile.name, moduleObject: infoLayer }));
                            saveToLocalDB(kmlModuleName, infoLayer.moduleClass, afile.name, evt.target.result);
                        }
                        reader.readAsText(afile);
                    } else {
                        Ext.MessageBox.alert("Unknown File Type", "The file [" + afile.name + "] is not a KML format.");
                    }
                }
            }, this, false, afile.name);
        }
        else {
            Ext.MessageBox.alert("Duplicate module", "The module [" + afile.name + "] aleady loaded on the scoreboard.");
        }
    }

    var customInfoTool = Ext.create('Ext.Action', {
        text: 'Add Info Layer From KML',
        iconCls: "x-open-menu-icon",
        tooltip: "Add a new layer using features from a KML file as a reference information.",
        //enabledToggle: false,
        handler: function () {
            fileDialogBox.value = ''; // this allows us to select the same file twice in a row (and still fires the value changed event)
            KMLMode.CurrentMode = KMLMode.KMLINFO;
            fileDialogBox.click();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(9, customInfoTool);
    //#endregion Custom info from KML
    //----------------------------------------------------------------------------------------
    //#region Save and Load Modules to local IndexedDB
    //Save the uploaded KML data to the client side database.
    //aname: string - the module name
    //aclass: string - the module class name.
    //akey: string - a unitue module key (a file name).
    //value: object - a string or object represent the actual module data.
    function saveToLocalDB(aname, aclass, akey, value) {
        pvMapper.ClientDB.saveCustomKML(aname, aclass, akey, value);
    }

    //load all saved uploaded KML modules.  This function is to be invoke by the scoreboard when everything is loaded.
    //the "pvMapper.isLocalModuleLoaded" prevent a session from loading one too many times.
    var isModulesLoading = false;
    pvMapper.loadLocalModules = function () {
        if (!pvMapper.isLocalModulesLoaded && !isModulesLoading) {
            isModulesLoading = true;
            pvMapper.ClientDB.getAllCustomKMLName(function (moduleFiles) {
                if ((moduleFiles) && (moduleFiles.length > 0)) {
                    moduleFiles.forEach(function (fileName, idx) {
                        pvMapper.ClientDB.loadCustomKML(fileName, function (moduleObj) {
                            if (moduleObj) {
                                var alayer = null;
                                if (moduleObj.customClass !== undefined) {
                                    if (moduleObj.customClass === "LocalLayerModule")
                                        alayer = new INLModules.LocalLayerModule();
                                    else if (moduleObj.customClass === "KMLInfoModule")
                                        alayer = new INLModules.KMLInfoModule();
                                }
                                if (alayer !== null) {
                                    alayer.readTextFile(moduleObj.customData, moduleObj.customName, fileName);
                                    pvMapper.customModules.push(new pvMapper.CustomModuleData({ fileName: fileName, moduleObject: alayer }));
                                }
                            }
                        });
                    });
                }
                pvMapper.isLocalModulesLoaded = true;
            });
        }
    }
    //#endregion Save/load modules
    //----------------------------------------------------------------------------------------

});

