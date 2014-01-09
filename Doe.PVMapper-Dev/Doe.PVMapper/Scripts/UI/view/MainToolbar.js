

pvMapper.onReady(function () {

    //----------------------------------------------------------------------------------------
    // place name and address search box
    var searchComboBox = Ext.create('Heron.widgets.search.NominatimSearchCombo', {
        map: pvMapper.map,
        width: 400,
    });

    pvMapper.mapToolbar.add(9, searchComboBox);

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
    //#endregion Measure distance
    //----------------------------------------------------------------------------------------
    //#region Add distance score from KML
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
    pvMapper.scoreboardToolsToolbarMenu.add(3, customTool);
    //#endregion Distance score from KML
    //----------------------------------------------------------------------------------------
    //#region  KML Site Import
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
    //#endregion export site to KML
    //----------------------------------------------------------------------------------------
    //#region Save scoreboard
    function saveScoreboardAs() {

        // add a button on the tool bar to launch a file picker to load local KML file.
        //first, create an input with type='file' and add it to the body of the page.
        Ext.MessageBox.prompt('Save file as', 'Please enter a filename for the export sites (.jso).',
            function (btn, filename) {
                if (btn === 'ok') {
                    filename = filename || 'PVMapperProject.jso';

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    //check to make sure that the file has '.kml' extension.
                    var dotindex = filename.lastIndexOf('.');
                    dotindex = dotindex == -1 ? filename.length : dotindex;
                    filename = filename.substr(0, dotindex, dotindex) + '.jso';

                    var content = JSON.stringify(pvMapper.mainScoreboard);
                    var blob = CustomBlob(content, null);
                    blob.data = content;
                    blob.type = 'data:application/jso';
                    saveAs(blob, filename);
                }
            }, this, false, 'PVMapperProject.jso');

        //This code below works too, but always save with a file name of "Download.kml".
        //uriContent = 'data:application/vnd.google-earth.kml+xml;headers=Content-Disposition:attachment;filename="sites.kml",' + encodeURIComponent(content);
        //newWindow = window.open(uriContent, 'sites.kml');
    }

    var loadScoreboardBtn = Ext.create('Ext.Action', {
        text: 'Save Project',
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
    fDialogBox.accept = "application/jso"; //only support in chrome and IE.  FF doesn't work.
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

        if (extension === ".jso") {
            var reader = new FileReader();
            reader.onload = function (evt) { importScoreboardFromJSON(evt.target.result); }
            reader.readAsText(afile);
        } else {
            Ext.MessageBox.alert("Unrecognize File Type", "The file [" + afile.name + "] is not a PVMapper project.");
        }
    }

    /// find an object in an array that match the srcObj  using the fn function to compare.
    /// provide function: as fn(obj1, scrObj) : integer.  if obj1 == scrObj return 0, else return -1.
    /// if found, return the matching object, if no element found, it returns null.

    if (Array.prototype.find === undefined) {
        Array.prototype.find = function (fn) {
            if (fn) {
                for (i = 0; i < this.length; i++) {
                    if (fn(this[i]))
                        return this[i];
                }
            }
            return undefined;
        }
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
            delete

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

                    if (scLine !== null) {
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
        tooltip: "Load a saved scoreboard project and use it as a default.",
        handler: function () {
            fDialogBox.click();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(1, loadScoreboardBtn);

    //#endregion Load scoreboard
    //----------------------------------------------------------------------------------------

    function saveScoreboardConfig() {
        Ext.MessageBox.prompt('Save file as', 'Please enter a configuraton filename(.cfg).',
            function (btn, filename) {
                if (btn === 'ok') {
                    filename = filename || 'PVMapperConfig.cfg';

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    //check to make sure that the file has '.kml' extension.
                    var dotindex = filename.lastIndexOf('.');
                    dotindex = dotindex == -1 ? filename.length : dotindex;
                    filename = filename.substr(0, dotindex, dotindex) + '.cfg';

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
                            config.configLines.push({title: aTitle, category: aCat, utility: aUtility, starRatables: aStarRatables, weight: aWeight });
                        });
                    var content = JSON.stringify(config);
                    var blob = CustomBlob(content, null);
                    blob.data = content;
                    blob.type = 'data:application/cfg';
                    saveAs(blob, filename);
                }
            }, this, false, 'PVMapperConfig.cfg');
    }
    //----------------------------------------------------------------------------------------

    var saveConfigBtn = Ext.create('Ext.Action', {
        text: "Save Configuration",
        tooltip: "Save the Scoreboard Utility configuration to a local file.",
        handler: function () {
            saveScoreboardConfig();
        }
    });

    pvMapper.scoreboardToolsToolbarMenu.add(2, '-');
    pvMapper.scoreboardToolsToolbarMenu.add(3, saveConfigBtn);
    //----------------------------------------------------------------------------------------

    
    var configDialogBox = document.createElement('input');
    configDialogBox.type = 'file';
    configDialogBox.style = 'display:none';
    configDialogBox.accept = "application/cfg"; //only support in chrome and IE.  FF doesn't work.
    configDialogBox.addEventListener('change', handleLoadScoreboardConfig, false);
    document.body.appendChild(configDialogBox);

    function handleLoadScoreboardConfig(evt) {
        if (!evt.target.files || !evt.target.files[0])
            return;

        var afile = evt.target.files[0];
        var afilename = afile.name;
        //check to make sure that the file has '.kml' extension.
        var dotindex = afilename.lastIndexOf('.');
        dotindex = dotindex == -1 ? afilename.length : dotindex;
        var name = afilename.substr(0, dotindex, dotindex);
        var extension = afilename.replace(name, "");

        if (extension === ".cfg") {
            var reader = new FileReader();
            reader.onload = function (evt) { loadScoreboardConfig(evt.target.result); }
            reader.readAsText(afile);
        } else {
            Ext.MessageBox.alert("Unrecognize File Type", "The file [" + afile.name + "] is not a PVMapper configuration file.");
        }

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
        tooltip: "Load a Scoreboard Utility configuration from a local file.",
        handler: function () {
            configDialogBox.click();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(4, loadConfigBtn);
    //----------------------------------------------------------------------------------------
    //#region Reset scoreboard config

    function resetScoreboardConfig() {
        pvMapper.mainScoreboard.scoreLines.forEach(
            function (scrLine, idx, scoreLines) {
                scrLine.scoreUtility = scrLine.defaultScoreUtility;
                if ((scrLine.setStarRatables !== undefined) && (scrLine.getStarRatables !== undefined))
                    scrLine.setStarRatables(scrLine.getStarRatables("default"));
                scrLine.setWeight(10);
            });
    }

    var resetScoreboardBtn = Ext.create('Ext.Action', {
        text: 'Reset Scoreboard Configuration',
        tooltip: "Export site polygons and scores to a KML file",
        handler: function () {
            resetScoreboardConfig();
        }
    });
    pvMapper.scoreboardToolsToolbarMenu.add(5, resetScoreboardBtn);

    //#endregion
    pvMapper.scoreboardToolsToolbarMenu.add(6, '-');
    //----------------------------------------------------------------------------------------
});

