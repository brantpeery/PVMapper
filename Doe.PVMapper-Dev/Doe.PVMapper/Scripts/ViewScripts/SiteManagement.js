/// <reference path="../_references.js" />


//Creates the tools for managing the sites. This includes an edit, add, delete functions. 
//Also will include rename and redescribe, recolor functions

//Requires: pvMapper object
//          OpenLayers javascript
//          jQueryUI

Ext.require('GeoExt.Action');

pvMapper.onReady(function () {
    //var self = this;
    var sm = new siteManagementTool(pvMapper.map, pvMapper.getSiteLayer());

    //var st1 = sm.selectFeatureTool(function (data) {
    //    sm.deleteSite(data);
    //});
    var delAction = Ext.create('Ext.Action', {
        text: 'Delete Selected Site',
        iconCls: "x-delete-menu-icon",
        tooltip: "Delete a site from the database",
        //control: st1,
        //map: pvMapper.map,
        disabled: true,
        //toggleGroup: "editToolbox", 
        //group:"editToolbox"
        handler: function () {
            if (pvMapper.siteLayer.selectedFeatures.length == 1) {
                Ext.MessageBox.confirm('Confirm', "Are you sure you want to delete site '" +
                    pvMapper.siteLayer.selectedFeatures[0].attributes.name + "'?",
                function (result) {
                    if (result === 'yes') {
                        var feature = pvMapper.siteLayer.selectedFeatures[0];
                        // unselect all features first (at present, this causes a PUT to the database if a feature was selected)
                        // if this isn't done, there will be artifacts left on the map after deleting the selected site(s).
                        // Note that this also removes any sketch features from the feature layer (ie, siteLayer.features.length may decrease !)
                        pvMapper.unselectAllSites();

                        // try to delete feature
                        pvMapper.deleteSite(feature.fid)
                            .done(function () {
                                // if we've deleted the feature from the database, let's delete it from BOTH local collections (?!?)
                                //TODO: This should happen automagically - ie the local collection should be tied into the database
                                //TODO: we should combine our siteManager with our OpenLayers feature collection - they both store sites, and that's absurd.
                                pvMapper.siteManager.removeSite(feature.site);
                                pvMapper.siteLayer.removeFeatures([feature], { silent: true });
                                feature.destroy();
                            })
                            .fail(function () {
                                if (console && console.log) console.log('failed to delete site "' + feature.site.name + '" with id "' + feature.site.id + '"');
                            });
                        // all done
                    }
                });
            }
        }
    });

    //var selectAction = Ext.create('GeoExt.Action', {
    //    text: 'Select Site',
    //    tooltip: "Select a site",
    //    //control: pvMapper.selectControl,
    //    map: pvMapper.map,
    //    enableToggle: false,
    //    toggleGroup: "editToolbox",
    //    group: "editToolbox"
    //});

    var editAction = Ext.create('GeoExt.Action', {
        text: 'Edit Site',
        tooltip: "Edit the shape of a site",
        control: sm.modifyFeatureControl(),
        map: pvMapper.map,
        enableToggle: false,
        toggleGroup: "editToolbox",
        group: "editToolbox"
    });
    editAction.control.activate();

    pvMapper.unselectAllSites = function() {
        editAction.control.selectControl.unselectAll();
    };

    //var st2 = sm.selectFeatureTool(function (data) {
    //    sm.editSiteAttributes(data);
    //    //this.unselect(data);
    //});
    var renameAction = Ext.create('Ext.Action', {
        text: 'Rename Selected Site',
        iconCls: "x-edit-menu-icon",
        tooltip: "Edit the attributes of a site (Name, Discription, Color...)",
        //control: st2,
        //map: pvMapper.map,
        disabled: true,
        //toggleGroup: "editToolbox",
        //group: "editToolbox"
        handler: sm.editSiteAttributes
    });

    pvMapper.siteLayer.events.register(
        'featureselected',
        null,
        function (featureObj) {
            // the feature selection has changed - update the enabled state of our actions and their menu
            //siteEditMenu.setDisbled(pvMapper.siteLayer.selectedFeatures.length <= 0);

            delAction.setDisabled(pvMapper.siteLayer.selectedFeatures.length != 1);
            //editAction.setDisabled(pvMapper.siteLayer.selectedFeatures.length != 1);
            renameAction.setDisabled(pvMapper.siteLayer.selectedFeatures.length != 1);
        });

    pvMapper.siteLayer.events.register(
        'featureunselected',
        null,
        function (featureObj) {
            // the feature selection has changed - update the enabled state of our actions and their menu
            //siteEditMenu.setDisbled(pvMapper.siteLayer.selectedFeatures.length <= 0);

            delAction.setDisabled(pvMapper.siteLayer.selectedFeatures.length != 1);
            //editAction.setDisabled(pvMapper.siteLayer.selectedFeatures.length != 1);
            renameAction.setDisabled(pvMapper.siteLayer.selectedFeatures.length != 1);
        });

    pvMapper.sitesToolbarMenu.add([renameAction, delAction]);



    var delAllAction = Ext.create('Ext.Action', {
        text: 'Delete All Sites',
        iconCls: 'x-delete-menu-icon',
        tooltip: "Delete all sites from the current project",
        handler: function ()
        {
            if (pvMapper.siteLayer.features.length > 0)
            {
                // unselect all features first (at present, this causes a PUT to the database if a feature was selected)
                // if this isn't done, there will be artifacts left on the map after deleting the selected site(s).
                // Note that this also removes any sketch features from the feature layer (ie, siteLayer.features.length may decrease !)
                pvMapper.unselectAllSites();
                //editAction.control.selectControl.unselectAll();

                if (pvMapper.siteLayer.features.length > 0)
                {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete ' +
                        pvMapper.siteLayer.features.length + (pvMapper.siteLayer.features.length === 1 ? ' site?' : ' sites?'),
                        function (result)
                        {
                            if (result === 'yes')
                            {
                                // try to delete all features
                                pvMapper.deleteAllSites()
                                    .done(function ()
                                    {
                                        // if we've deleted the feature from the database, let's delete it from BOTH local collections (?!?)
                                        //TODO: This should happen automagically - ie the local collection should be tied into the database
                                        //TODO: we should combine our siteManager with our OpenLayers feature collection - they both store sites, and that's absurd.
                                        pvMapper.siteManager.removeAllSites();
                                        pvMapper.siteLayer.removeAllFeatures(); // Remove map features after deletion 
                                    })
                                    .fail(function (errObj)
                                    {
                                        if (console && console.error) console.error('failed to delete sites: ' + errObj);
                                    });
                                // all done
                            }
                        });
                }
            }
        }
    });
    pvMapper.sitesToolbarMenu.add(delAllAction);

});


//Creates a new siteManagement tool.
//The map is the map the tool will work on
//Layer is the site polygon layer that the tool will read/write to6
function siteManagementTool(map, layer) {
    var selectTool, currentMode, selectedFeature, selectedID, editTool;
    var self = this; //Allow the internal functions access to this functionality

    //Edit attributes
    this.editSiteAttributes = function () {
        // check state; fail quick
        if (pvMapper.siteLayer.selectedFeatures.length !== 1)
            return;

        //Put the tool into select mode
        //Set the select callback to run the delete feature function
        var feature = pvMapper.siteLayer.selectedFeatures[0];
        var f = feature; //Shortcut

        var wiz = new Ext.create('Ext.window.Window', {
            layout: 'auto',
            modal: true,
            collapsible: true,
            id: "siteWizard",

            title: "Edit Site",
            bodyPadding: '5 5 0',
            width: 350,
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'Site Name',
                hideLabel: false,
                name: 'name',
                id: 'name',
                value: f.attributes.name
            }, {
                fieldLabel: 'Site Description',
                xtype: 'textarea',
                name: 'siteDescription',
                id: 'sitedescription',
                value: f.attributes.description
            }],

            buttons: [{
                text: 'Save',
                handler: function (b, e) {
                    var name = Ext.getCmp("name").getValue();
                    var desc = Ext.getCmp("sitedescription").getValue();

                    //Erase the features so the changes can be made
                    feature.layer.eraseFeatures(feature);

                    feature.name = name;
                    feature.attributes = {
                        name: name,
                        description: desc
                    };

                    wiz.destroy();

                    var WKT = feature.toString();
                    var ret = pvMapper.updateSite(feature.fid, name, desc);

                    //TODO: propegate feature name change to Site object !!!

                    //Redraw the feature with all the changes
                    feature.layer.drawFeature(feature);
                }
            }, {
                text: 'Cancel',
                handler: function (b, e) {
                    wiz.destroy();
                }
            }]

        });

        wiz.show();
    };


    var saveFeatureToServer_timeoutHandle = null;
    var saveFeatureToServer = function (data) {
        // Send updated site to server
        //sm.editSite(data.feature);
        var ret = pvMapper.updateSite(data.feature.fid,
            data.feature.attributes.name,
            data.feature.attributes.desc,
            data.feature.geometry.toString());
    }

    this.modifyFeatureControl = function (callback) {
        var mft = new OpenLayers.Control.ModifyFeature(layer, {
            vertexRenderIntent: "select",
            //selectControl: pvMapper.selectControl
            clickout: true, toggle: false,
            multiple: false, hover: false,
            toggleKey: "ctrlKey", // ctrl key removes from selection
            multipleKey: "shiftKey", // shift key adds to selection
            box: false
        });
        layer.events.on({"featuremodified": function (data) {
            if (!data.feature || !data.feature.site) {
                if (console && console.warn) console.warn("Warning: featuremodified fired on non-site feature");
                return; // nothing to do here...
            }

            // notify the site manager (which will update scores etc)
            pvMapper.siteManager.featureChangedHandler(data);
            featureModified_timeoutHandle = null;

            // if we've been waiting to save old changes to the DB, don't bother - they're out of date.
            if (typeof saveFeatureToServer_timeoutHandle === "number") {
                window.clearTimeout(saveFeatureToServer_timeoutHandle);
            }

            // wait a few seconds before we bother saving/persisting these changes to the DB
            saveFeatureToServer_timeoutHandle = window.setTimeout(function () { saveFeatureToServer(data); }, 4000);
        }});
        layer.events.on({ "afterfeaturemodified": function (data) {
            if (!data.feature || !data.feature.site) {
                if (console && console.warn) console.warn("Warning: afterfeaturemodified fired on non-site feature");
                return; // nothing to do here...
            }

            // save these changes immediately.
            if (typeof saveFeatureToServer_timeoutHandle === "number") {
                if (console && console.assert) console.assert(data.modified, "Warning: saving unmodified site feature to the database...");
                // if we've been waiting to save old changes to the DB, don't bother - they're out of date.
                if (typeof saveFeatureToServer_timeoutHandle === "number") {
                    window.clearTimeout(saveFeatureToServer_timeoutHandle);
                    saveFeatureToServer_timeoutHandle = null;
                }
                saveFeatureToServer(data);
            }
        }});
        return mft;
    };
}

