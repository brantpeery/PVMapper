/// <reference path="../_references.js" />


//Creates the tools for managing the sites. This includes an edit, add, delete functions. 
//Also will include rename and redescribe, recolor functions

//Requires: pvMapper object
//          OpenLayers javascript
//          jQueryUI

pvMapper.onReady(function () {
    var self = this;
    var sm = new siteManagementTool(pvMapper.map, pvMapper.getSiteLayer());

    var st1 = sm.selectFeatureTool(function (data) {
        sm.deleteSite(data);
    });
    var delAction = Ext.create('GeoExt.Action', {
        text: 'Delete Site',
        tooltip: "Delete a site from the database",
        control: st1,
        map: pvMapper.map,
        enableToggle: true,
        toggleGroup: "editToolbox", 
        group:"editToolbox"

    });

    var editAction = Ext.create('GeoExt.Action', {
        text: 'Edit Site',
        tooltip: "Edit the shape of a site",
        control: sm.modifyFeatureControl(function (data) {
            sm.editSite(data.feature);

        }),
        map: pvMapper.map,
        enableToggle: true,
        toggleGroup: "editToolbox",
        group: "editToolbox"
    });

    var st2 = sm.selectFeatureTool(function (data) {
        sm.editSiteAttributes(data);
        //this.unselect(data);
    });
    var renameAction = Ext.create('GeoExt.Action', {
        text: 'Edit Attributes',
        tooltip: "Edit the attributes of a site. (Name, Discription, Color...)",
        control: st2,
        map: pvMapper.map,
        enableToggle: true,
        toggleGroup: "editToolbox",
        group: "editToolbox"
    });

    var action = Ext.create('GeoExt.Action', {
        text: "Select Site",
        control: new OpenLayers.Control.SelectFeature(
         pvMapper.getSiteLayer(),
         {
             clickout: false, toggle: true,
             multiple: false, hover: false,
             toggleKey: "ctrlKey", // ctrl key removes from selection
             multipleKey: "shiftKey", // shift key adds to selection
             //box: true,
             eventListeners: {
                 featurehighlighted: function (event) {
                     pvMapper.map.zoomToExtent(pvMapper.getSelectedSite().geometry.getBounds());
                 }
             }
         }),
        map: pvMapper.map,
      //  enableToggle: true,
        toggleGroup: "mapNavGroup1",  // only one tool can be active in a group
        allowDepress: false,
        tooltip: "Select a site that tools can act upon."
    });
    pvMapper.mapToolbar.add(Ext.create('Ext.button.Button', action));

    // instead of commented code we tuck these in the edit menu.
    //var editTools = [new Ext.Button(delAction), new Ext.Button(editAction), new Ext.Button(renameAction)];
    //pvMapper.mapToolbar.add(editTools);

    pvMapper.mapToolbar.add({
        text: "Site Tools",
        menu: new Ext.menu.Menu({
            items: [
                //Delete Site
                new Ext.menu.CheckItem(delAction),

                //Edit Site
                new Ext.menu.CheckItem(editAction),

                //Edit Attributes
                new Ext.menu.CheckItem(renameAction)
            ]
        })
    });

});



//Creates a new siteManagement tool.
//The map is the map the tool will work on
//Layer is the site polygon layer that the tool will read/write to6
function siteManagementTool(map, layer) {
    var selectTool, currentMode, selectedFeature, selectedID, editTool
    var self = this; //Allow the internal functions access to this functionality

    //Delete
    this.deleteSite = function (feature) {
        var ret = pvMapper.deleteSite(feature.fid);
        feature.destroy();
    }

    //Edit poly
    this.editSite = function (feature) {
        //Save the modifications back to the database
        //This is where a save to the database might happen
        var WKT = feature.geometry.toString();
        var ret = pvMapper.updateSite(feature.fid, feature.attributes.name, feature.attributes.desc, WKT);
    }

    //Edit attributes
    this.editSiteAttributes = function (feature) {
        //Put the tool into select mode
        //Set the select callback to run the delete feature function
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

                    //Redraw the feature with all the changes
                    feature.layer.drawFeature(feature);
                }
            }, {
                text: 'Cancel',
                handler: function (b, e) {
                    wiz.destroy();
                }
            }]

        })

        wiz.show();
    }


    //Add new

    //Rightclick menu

    //Select feature
    this.selectFeatureTool = function (callback, options) {
        //if (!selectTool) {
        var defaults = { onSelect: callback };
        var selectTool = new OpenLayers.Control.SelectFeature(layer, defaults);
        map.addControl(selectTool);
        //} else {
        //    selectTool.onSelect = callback;
        //}

        return selectTool;
    }

    this.modifyFeatureControl = function (callback) {
        var mft = new OpenLayers.Control.ModifyFeature(layer, { vertexRenderIntent: "select" });
        layer.events.on({ "afterfeaturemodified": callback });
        return mft;
    }
}

