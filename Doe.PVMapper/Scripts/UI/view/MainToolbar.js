

pvMapper.onReady(function () {

    function hasExtension(filename, extension) {
        // return true if the given filename uses the given file extension
        return filename.length < extension.length ? false :
            (filename.substr(filename.length - extension.length).toLowerCase() === extension.toLowerCase());
    }

    function ensureExtension(filename, extension) {
        // if the filename already ends with the given extension, return it without changes
        if (hasExtension(filename, extension))
            return filename;
        // if the filename doesn't end with the provided extension, return the filename with the extension appended onto it
        return filename + extension;
    }


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
    //#region Navigation History

    // Navigation history - two "button" controls
    ctrl = new OpenLayers.Control.NavigationHistory();
    pvMapper.map.addControl(ctrl);

    action = Ext.create('GeoExt.Action', {
        text: "»",
        control: ctrl.next,
        disabled: true,
        tooltip: "Go to next map view extent"
    });
    pvMapper.mapToolbar.add(9, Ext.create('Ext.button.Button', action));

    action = Ext.create('GeoExt.Action', {
        text: "«",
        control: ctrl.previous,
        disabled: true,
        tooltip: "Go back to previous map view extent"
    });
    pvMapper.mapToolbar.add(9, Ext.create('Ext.button.Button', action));

    //#endregion
    //----------------------------------------------------------------------------------------
    //#region Measure distance tool
    var control = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
        displaySystem: "english",
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
    fileDialogBox.style = 'display:none;height:0;';
    fileDialogBox.accept = "application/vnd.google-earth.kml+xml,application/vnd.google-earth.kmz"; //only support in chrome and IE.  FF doesn't work.
    fileDialogBox.addEventListener('change', handleCustomKML, false);  // disable the distance KML event.

    document.body.appendChild(fileDialogBox);

    //listen to a file pick selection <OK> button on the file dialog box clicked.
    function handleCustomKML(evt) {
        if (!evt.target.files || !evt.target.files[0])
            return;

        var afile = evt.target.files[0];

        if (afile.type !== "application/vnd.google-earth.kmz" && !hasExtension(afile.name, ".kmz") &&
            afile.type !== "application/vnd.google-earth.kml+xml" && !hasExtension(afile.name, ".kml")) 
        {
            Ext.MessageBox.alert("Unable to open file", "The file '" + afile.name + "' does not appear to be in a valid KML format.");
            return;
        }

        pvMapper.ClientDB.getAllCustomKMLName(function (customKmlNames) { 
            var i = 1;
            afile.uniqueName = afile.name;
            while (customKmlNames.indexOf(afile.uniqueName) >= 0) { // fix file name - ensure that it does not duplicate any other stored kml file names.
                afile.uniqueName = afile.name + " (" + (i++) + ")";
            }

            //we probably don't want to load hug file.  Limit is about 2MB.
            if (afile.size > 2000000) {
                Ext.MessageBox.confirm("File too big", "The file '" + afile.name + "' (with size: " + afile.size.toString() + ") is larger then 2000000 bytes (2 MB), do you want to continue loading?",
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
        });
        fileDialogBox.value = "";
    }
    //#endregion OpenFileDialog
    //----------------------------------------------------------------------------------------
    //#region  KML Site Import
    function continueHandlingSiteKML(afile) {

        if (afile.type === "application/vnd.google-earth.kmz" || hasExtension(afile.name, ".kmz")) {
            var reader = new FileReader();
            reader.onload = function (evt) { uncompressZip(evt.target.result, function (kmlResult) { importSitesFromKMLString(kmlResult, afile.name); }); }
            reader.readAsArrayBuffer(afile);
        } else { // otherwise, the file is kml
            var reader = new FileReader();
            reader.onload = function (evt) { importSitesFromKMLString(evt.target.result, afile.name); }
            reader.readAsText(afile);
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

    function importSitesFromKMLString(kmlString, kmlName) {
        var kml_projection = new OpenLayers.Projection("EPSG:4326");
        var map_projection = new OpenLayers.Projection("EPSG:3857");

        //var osm: OpenLayers.OSM = new OpenLayers.Layer.OSM();
        var kmlFormat = new OpenLayers.Format.KML({
            extractStyles: true,
            extractAttributes: true,
            internalProjection: map_projection,
            externalProjection: kml_projection,
            foldersName: "PV Mapper"
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
        } else if (polyFeatures.length > 0) {
            for (var i = 0; i < polyFeatures.length; i++) {
                AddSite(polyFeatures[i]);
            }
        } else {
            Ext.MessageBox.alert("No Sites Found", "Failed to extract any KML polygons from the file provided.");
        }
    };

    ///kmlFeature : pvMapper.SiteFeature.
    function AddSite(kmlFeature) {
        kmlFeature.attributes = kmlFeature.attributes || {}; // just in case...?

        kmlFeature.attributes.name = kmlFeature.attributes.name || "KML site";
        kmlFeature.attributes.description = kmlFeature.attributes.description || "";

        WKT = kmlFeature.geometry.toString();

        //adding the site to the server database.
        pvMapper.postSite(kmlFeature.attributes.name, kmlFeature.attributes.description, WKT)
            .done(function (site) {
                kmlFeature.fid = site.siteId;
                kmlFeature.style = pvMapper.siteLayer.style;

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
    function ExportToKML() {
        var kml_projection = new OpenLayers.Projection("EPSG:4326");
        var map_projection = new OpenLayers.Projection("EPSG:3857");

        var kmlFormat = new OpenLayers.Format.KML({
            extractStyles: false,
            extractAttributes: true,
            internalProjection: map_projection,
            externalProjection: kml_projection,
            foldersName: "PV Mapper"
        });

        var sitesKml = kmlFormat.write(pvMapper.siteLayer.features);
        SaveKmlAsFile(sitesKml);
    }

    var previousFilenameForSavingSites = 'PVMapper Sites'

    function SaveKmlAsFile(content) {
        // add a button on the tool bar to launch a file picker to load local KML file.
        //first, create an input with type='file' and add it to the body of the page.
        Ext.MessageBox.prompt('Save file as', 'Please enter a filename for the export sites.',
            function (btn, filename) {
                if (btn === 'ok') {
                    previousFilenameForSavingSites = (filename || 'PVMapper Sites')

                    //check to make sure that the file has '.kml' extension.
                    filename = ensureExtension(previousFilenameForSavingSites, '.kml');

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    var blob = new Blob([content], { type: 'application/vnd.google-earth.kml+xml' });
                    saveAs(blob, filename);
                }
            }, this, false, previousFilenameForSavingSites);
    }

    var kmlExportBtn = Ext.create('Ext.Action', {
        text: 'Save Sites to KML',
        iconCls: 'x-save-menu-icon',
        tooltip: "Export site polygons and scores to a KML file",
        handler: function () {
            ExportToKML();
        }
    });
    pvMapper.sitesToolbarMenu.add(kmlExportBtn);
    //#endregion export site to KML
    //----------------------------------------------------------------------------------------
    //#region Save project
    var previousFilenameForSavingProject = 'PVMapper Project'

    function saveProjectAs() {
        // add a button on the tool bar to launch a file picker to load local KML file.
        //first, create an input with type='file' and add it to the body of the page.
        Ext.MessageBox.prompt('Save file as', 'Please enter a filename for the export sites (.pvProj).',
            function (btn, filename) {
                if (btn === 'ok') {
                    previousFilenameForSavingProject = (filename || 'PVMapper Project')

                    //check to make sure that the file has '.pvProj' extension..  We will check and add extension only if user did not provide or provided with wrong extension.
                    filename = ensureExtension(previousFilenameForSavingProject, '.pvProj');

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    var content = JSON.stringify(pvMapper.mainScoreboard, null, '\t');
                    var blob = new Blob([content], { type: 'application/json' });
                    saveAs(blob, filename);
                }
            }, this, false, previousFilenameForSavingProject);
    }

    var saveProjectBtn = Ext.create('Ext.Action', {
        text: 'Save Project',
        iconCls: 'x-saveproject-menu-icon',
        tooltip: "Save the Scoreboard project to local file.",
        handler: function () {
            saveProjectAs();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(0, saveProjectBtn);
    //#endregion Save scoreboard
    //----------------------------------------------------------------------------------------
    //#region Load project
    var fDialogBox = document.createElement('input');
    fDialogBox.type = 'file';
    fDialogBox.style = 'display:none;height:0;';
    fDialogBox.accept = ".pvProj"; //only support in chrome and IE.  FF doesn't work.
    fDialogBox.addEventListener('change', handleLoadProject, false);
    document.body.appendChild(fDialogBox);

    function handleLoadProject(evt) {
        if (!evt.target.files || !evt.target.files[0])
            return;

        var afile = evt.target.files[0];
        
        if (hasExtension(afile.name, ".pvProj")) {
            var reader = new FileReader();
            reader.onload = function (evt) { importProjectFromJSON(evt.target.result); }
            reader.readAsText(afile);
        } else {
            Ext.MessageBox.alert("Unrecognize File Type", "The file [" + afile.name + "] is not a PVMapper project.");
        }
        fDialogBox.value = "";  //reset so we can open the same file again.
    }

    // this is a rough hack which attempts to handle module loading for old project files which didn't include module data.
    function setupModulesForLegacyProject(scoreLines) {
        var scoreModuleTitles = scoreLines.map(function (sl) { return sl.title; });

        var fakeModuleConfig = pvMapper.moduleManager.toJSON().filter(function (mod) { return scoreModuleTitles.indexOf(mod.title) >= 0 });

        fakeModuleConfig.forEach(function (mod) { mod.isActive = true; });

        return fakeModuleConfig;
    }

    function importProjectFromJSON(scoreboardJSON) {
        var jsonObj = JSON.parse(scoreboardJSON);

        if (jsonObj.scoreLines && jsonObj.scoreLines.length) {
            // handle older project format, where module configurations weren't stored with the project (use a default module config)
            jsonObj.modules = jsonObj.modules || setupModulesForLegacyProject(jsonObj.scoreLines);

            // handle older project format, where sites were stored (duplicatively) in each score line, as children of its score objects.
            jsonObj.sites = jsonObj.sites ||
                (jsonObj.scoreLines[0].scores && jsonObj.scoreLines[0].scores.length && // <-- lines must have scores
                jsonObj.scoreLines[0].scores[0].site && // <-- scores must have sites
                jsonObj.scoreLines[0].scores[0].site.geometry && // <-- sites must have geometries
                jsonObj.scoreLines[0].scores.map(function (s) { return s.site; })); // <-- fetch all of the sites (from the first score line)

            if (jsonObj.sites && jsonObj.sites.length) {
                // first remove all of our current sites
                pvMapper.deleteAllSites()
                    .done(function () {
                        // the server delete succeeded; remove sites locally
                        pvMapper.siteManager.removeAllSites();
                        pvMapper.siteLayer.removeAllFeatures(/*{ silent: true }*/);

                        // load modules, tools, scores, etc.
                        pvMapper.mainScoreboard.fromJSON(jsonObj);

                        // add new sites to the server; a new feature will be added locally as each Post completes.
                        var postSitePromises = jsonObj.sites.map(PostNewSiteToServer);

                        // after all sites have posted successfully, zoom to the project extent
                        $.when.apply($, postSitePromises).done(function () { 
                            pvMapper.map.zoomToExtent(pvMapper.siteLayer.getDataExtent());
                        });
                    });
            } else {
                // there are no new sites being imported, so we can keep our current sites (right...?).
                // load modules, tools, scores, etc.
                pvMapper.mainScoreboard.fromJSON(jsonObj);
            }
        } else {
            Ext.MessageBox.alert("Unrecognize data structure", "The file [" + afile.name + "] doesn't seems to be a PVMapper project file.");
        }
    }

    function PostNewSiteToServer(siteInfo) {
        //adding the site to the server database.
        return pvMapper.postSite(siteInfo.name, siteInfo.description, siteInfo.geometry.toString())
            .done(function (site) {
                aFeature = new OpenLayers.Feature.Vector(
                     OpenLayers.Geometry.fromWKT(site.polygonGeometry),
                     {
                         name: site.name,
                         description: site.description
                     },
                     pvMapper.siteLayer.style
                );

                aFeature.fid = site.siteId;

                pvMapper.siteLayer.addFeatures([aFeature]);

                //push the new site into the pvMapper system
                var newSite = new pvMapper.Site(aFeature);
                pvMapper.siteManager.addSite(newSite);
            });
    }


    var loadScoreboardBtn = Ext.create('Ext.Action', {
        text: 'Load Project',
        iconCls: 'x-openproject-menu-icon',
        tooltip: "Load a saved scoreboard project and use it as a default.",
        handler: function () {
            pvMapper.moduleManager.prefetchAllModuleScripts(); //HACK: since we don't know which modules this project will need, prefetch them all (to help the project load faster)
            fDialogBox.value = ''; // this allows us to select the same file twice in a row (and still fires the value changed event)
            fDialogBox.click();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(1, loadScoreboardBtn);

    //#endregion Load scoreboard
    //----------------------------------------------------------------------------------------
    //#region SaveScoreboardConfig
    var previousFilenameForSavingConfig = 'PVMapper Config';

    function saveScoreboardConfig() {
        Ext.MessageBox.prompt('Save file as', 'Please enter a configuraton filename (.pvCfg).',
            function (btn, filename) {
                if (btn === 'ok') {
                    previousFilenameForSavingConfig = (filename || 'PVMapper Config')

                    //check to make sure that the file has '.pvCfg' extension..  We will check and add extension only if user did not provide or provided with wrong extension.
                    filename = ensureExtension(previousFilenameForSavingConfig, '.pvCfg');

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    var config = { scoreLines: pvMapper.mainScoreboard.scoreLines }; //TODO: this includes Score objects... do we want to exclude those?
                    var content = JSON.stringify(config, null, '\t');
                    var blob = new Blob([content], { type: 'application/json' });
                    saveAs(blob, filename);
                }
            }, this, false, previousFilenameForSavingConfig);
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
    configDialogBox.style = 'display:none;height:0;';
    configDialogBox.accept = ".pvCfg"; //only support in chrome and IE.  FF doesn't work.
    configDialogBox.addEventListener('change', handleLoadScoreboardConfig, false);
    document.body.appendChild(configDialogBox);

    function handleLoadScoreboardConfig(evt) {
        if (!evt.target.files || !evt.target.files[0])
            return;

        var afile = evt.target.files[0];

        //since this feature is not support in FF, we need to check to make sure the file is correct extension.
        if (hasExtension(afile.name, ".pvCfg")) {
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

        pvMapper.mainScoreboard.fromJSON(obj);
    }

    //----------------------------------------------------------------------------------------
    var loadConfigBtn = Ext.create('Ext.Action', {
        text: "Load Configuration",
        iconCls: "x-openconfig-menu-icon",
        tooltip: "Load a Scoreboard Utility configuration from a local file.",
        handler: function () {
            pvMapper.moduleManager.prefetchAllModuleScripts(); //HACK: since we don't know which modules this project will need, prefetch them all (to help the project load faster)
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
                scrLine.resetConfiguration();
            });
        pvMapper.mainScoreboard.update();
    }

    var resetScoreboardBtn = Ext.create('Ext.Action', {
        text: 'Reset Configuration',
        iconCls: "x-cleaning-menu-icon",
        tooltip: "Reset the scoreboard to the default configuration",
        handler: function () {
            Ext.MessageBox.confirm("Confirm reset", "This will remove any configuration changes you've made to the scoreboard; continue?",
                function (btn) {
                    if (btn === 'yes') {
                        resetScoreboardConfig();
                    }
                });
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(5, resetScoreboardBtn);
    //#endregion
    //----------------------------------------------------------------------------------------
    //#region Export to Excel
    var previousFilenameForSavingCSV = 'PVMapper Scoreboard'
    function exportScoreboardToCSV() {
        Ext.MessageBox.prompt('Save file as', 'Please enter a filename for the scoreboard (.CSV).',
            function (btn, filename) {
                if (btn === 'ok') {
                    previousFilenameForSavingCSV = (filename || 'PVMapper Scoreboard')

                    //check to make sure that the file has '.csv' extension.  We just guard against wrong extension entered by user here.  Or if user not provided extension or mistype, we then add it here -- be smarter.
                    filename = ensureExtension(previousFilenameForSavingCSV, '.csv');

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    var exporter = Ext.create("GridExporter");

                    var content = exporter.getCSV(pvMapper.scoreboardGrid);
                    var blob = new Blob([content], { type: 'text/csv' }); // application/vnd.ms-excel
                    saveAs(blob, filename);
                }
            }, this, false, previousFilenameForSavingCSV
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
        Ext.MessageBox.prompt("Module Naming", "Please type in the module name", function (btn, kmlModuleName) {
            if (btn == 'ok') {
                if (kmlModuleName.length == 0)
                    kmlModuleName = afile.name;

                //var kmlModuleName = afile.name;

                //It seems HTML5 file API pull the file type from the MIME type association with an application.
                //problem here is that if the client machine never had Google Earth installed, the file.type is blank.
                //If it is the case, we can only realize on the file extension.
                if (afile.type === "application/vnd.google-earth.kmz" || hasExtension(afile.name, ".kmz")) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        uncompressZip(evt.target.result,
                            function (kmlResult) {
                                var newModule = new INLModules.LocalLayerModule(kmlResult, kmlModuleName, afile.uniqueName);
                                //pvMapper.customModules.push(new pvMapper.CustomModuleData({ fileName: afile.name, moduleObject: localLayer }));
                                pvMapper.moduleManager.addCustomModule(newModule);
                                pvMapper.ClientDB.saveCustomKML(kmlModuleName, newModule.moduleClass, afile.uniqueName, kmlResult); //TODO: we shouldn't use just the file name as the primary key here...
                            });
                    }
                    reader.readAsArrayBuffer(afile);
                } else { // by default, assume the file is kml
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        var newModule = new INLModules.LocalLayerModule(evt.target.result, kmlModuleName, afile.uniqueName);
                        //pvMapper.customModules.push(new pvMapper.CustomModuleData({ fileName: afile.name, moduleObject: localLayer }));
                        pvMapper.moduleManager.addCustomModule(newModule);
                        pvMapper.ClientDB.saveCustomKML(kmlModuleName, newModule.moduleClass, afile.uniqueName, evt.target.result); //TODO: we shouldn't use just the file name as the primary key here...
                    }
                    reader.readAsText(afile);
                }
            }
        }, this, false, afile.uniqueName);
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
        Ext.MessageBox.prompt("Module Naming", "Please type in the module name", function (btn, kmlModuleName) {
            if (btn == 'ok') {
                if (kmlModuleName.length == 0)
                    kmlModuleName = afile.name;

                if (afile.type === "application/vnd.google-earth.kmz" || hasExtension(afile.name, ".kmz")) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        uncompressZip(evt.target.result,
                            function (kmlResult) {
                                var newModule = new INLModules.KMLInfoModule(kmlResult, kmlModuleName, afile.uniqueName);
                                //pvMapper.customModules.push(new pvMapper.CustomModuleData({ fileName: afile.name, moduleObject: infoLayer }));
                                pvMapper.moduleManager.addCustomModule(newModule);
                                pvMapper.ClientDB.saveCustomKML(kmlModuleName, newModule.moduleClass, afile.uniqueName, kmlResult); //TODO: we shouldn't use just the file name as the primary key here...
                            });
                    }
                    reader.readAsArrayBuffer(afile);
                } else { // by default, assume the file is kml
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        var newModule = new INLModules.KMLInfoModule(evt.target.result, kmlModuleName, afile.uniqueName);
                        //pvMapper.customModules.push(new pvMapper.CustomModuleData({ fileName: afile.name, moduleObject: infoLayer }));
                        pvMapper.moduleManager.addCustomModule(newModule);
                        pvMapper.ClientDB.saveCustomKML(kmlModuleName, newModule.moduleClass, afile.uniqueName, evt.target.result); //TODO: we shouldn't use just the file name as the primary key here...
                    }
                    reader.readAsText(afile);
                }
            }
        }, this, false, afile.uniqueName);
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

    //#endregion Save/load modules
    //----------------------------------------------------------------------------------------


    var configTool = Ext.create('Ext.Action', {
        text: 'Tool Module Selector',
        iconCls: "x-tag-check-icon",
        tooltip: "Turn tool modules on and off.",
        //enabledToggle: false,
        handler: function () {
            var toolWin = Ext.create("MainApp.view.ToolConfigWindow", {
                height: Math.min(540, (Ext.getBody().getViewSize().height - 160)), // limit initial height to window height
            });
            toolWin.show();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(10, '-');
    pvMapper.scoreboardToolsToolbarMenu.add(11, configTool);

    //var loadAllTool = Ext.create("Ext.Action", {
    //    text: "Load all tools",
    //    iconCls: 'x-tag-restart-icon',
    //    tooltip: "Get an update of all available tool modules.  If no new module after update, press F5 to refresh.",
    //    handler: function () {
    //        pvMapper.moduleManager.isLoadOnly = true;
    //        pvMapper.moduleManager.loadModuleScripts();
    //        pvMapper.moduleManager.isLoadOnly = false;
    //    }
    //});
    //pvMapper.scoreboardToolsToolbarMenu.add(12, loadAllTool);


});

