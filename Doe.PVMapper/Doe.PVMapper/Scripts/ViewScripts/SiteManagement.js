/// <reference path="../_references.js" />


//Creates the tools for managing the sites. This includes an edit, add, delete functions. 
//Also will include rename and redescribe, recolor functions

//Requires: pvMapper object
//          OpenLayers javascript
//          jQueryUI

pvMapper.onReady(function () {
    var self = this;
    var sm = new siteManagementTool(pvMapper.map, pvMapper.getSiteLayer());
    var deltool = new Ext.Button({
        text: "Delete Site",
        toggleGroup: "SiteManager",
        listeners: {
            toggle: function () {
                if (this.pressed) {
                    sm.deleteSite(true);
                    //this.toggle(false);
                }
                else {
                    sm.deleteSite();
                    //this.toggle(true);
                    pvMapper.displayMessage("Click on a site to delete it.", "help");
                }
            }
        }
    });
    var edittool = new Ext.Button({
        text: "Edit Site",
        toggleGroup: "SiteManager",
        listeners: {
            toggle: function () {
                if (this.pressed) {
                    sm.editSite(true);
                    this.toggle(false);
                }
                else {
                    sm.editSite();
                    this.toggle(true);
                    pvMapper.displayMessage("Click on a site to edit its shape.", "help");
                }
            }
        }
    });
    var editlabeltool = new Ext.Button({
        text: "Edit Attributes",
        toggleGroup: "SiteManager",
        //ui:'default-toolbar',
        listeners: {
            toggle: function () {
                if (this.pressed) {
                    sm.editSiteAttributes(true);
                    this.toggle(false);
                }
                else {
                    sm.editSiteAttributes();
                    this.toggle(true);
                    pvMapper.displayMessage("Click on a site to edit it the label and description.", "help");
                }
            }
        }

    });

    //var dropDown = new Ext.Button({
    //    text:"Site Management",
    //    menu: new Ext.menu.Menu({
    //        items: [deltool,
    //        edittool,
    //        editlabeltool]
    //    })
    //});
    //pvMapper.mapToolbar.add(dropDown);
    pvMapper.mapToolbar.add(deltool);
    pvMapper.mapToolbar.add(edittool);
    pvMapper.mapToolbar.add(editlabeltool);
});

//Creates a new siteManagement tool.
//The map is the map the tool will work on
//Layer is the site polygon layer that the tool will read/write to
function siteManagementTool(map, layer) {
    var selectTool, currentMode, selectedFeature, selectedID, editTool
    var self = this; //Allow the internal functions access to this

    //functionality

    //Delete
    this.deleteSite = function (deactivate) {

        if (deactivate) { selectTool.deactivate(); }
        else {
            //Put the tool into select mode
            //Set the select callback to rund the delete feature function
            this.selectFeatureTool(function (f) {
                //var f = new OpenLayers.Feature.Vector();
                var ret = pvMapper.deleteSite(f.fid);
                f.destroy();
            });
        }
    }

    //Edit poly
    this.editSite = function (deactivate) {

        if (deactivate) {
            editTool.deactivate();
        }
        else {
            if (!editTool) {
                editTool = new OpenLayers.Control.ModifyFeature(pvMapper.getSiteLayer(), {vertexRenderIntent: "select"});
                map.addControl(editTool);
                layer.events.register("afterfeaturemodified", editTool, function (e) {
                    //Save the modifications back to the database
                    //This is where a save to the database might happen
                    var f = e.feature;
                    var WKT = f.geometry.toString();
                    var ret = pvMapper.updateSite(f.fid, "user1", f.name, f.attributes.desc, WKT);
                });
            }
            editTool.activate();

        }
    }

    //Edit attributes
    this.editSiteAttributes = function (deactivate) {
        if (deactivate) { selectTool.deactivate(); }
        else {
            //Put the tool into select mode
            //Set the select callback to run the delete feature function
            this.selectFeatureTool(function (f) {
                var feature = f;

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
                        value:f.attributes.name
                    }, {
                        fieldLabel: 'Site Description',
                        xtype: 'textarea',
                        name: 'siteDescription',
                        id: 'sitedescription',
                        value:f.attributes.description
                    }],

                    buttons: [{
                        text: 'Save',
                        handler: function (b, e) {
                            var name = Ext.getCmp("name").getValue();
                            var desc = Ext.getCmp("sitedescription").getValue();

                            feature.layer.eraseFeatures(feature);

                            feature.name = name;
                            feature.attributes = {
                                name: name,
                                description: desc
                            };

                            wiz.destroy();

                            var WKT = feature.toString();
                            var ret = pvMapper.updateSite(feature.fid, "user1", name, desc, WKT);

                            var msg;
                            if (id) {
                                msg = "The site " + name + " has been added to your database";
                                pvMapper.displayMessage(msg, "info");
                            } else {
                                msg = "There was a problem adding the site to the database!";
                                pvMapper.displayMessage(msg, "warning");
                            }


                            self.deactivateDrawSite();
                            
                            //Redraw the feature with all the changes
                            feature.layer.drawFeature(feature);
                        }
                    }, {
                        text: 'Cancel',
                        handler: function (b, e) {
                            feature.destroy();
                            control.cancel();
                            wiz.destroy();
                            deactivateDrawSite();
                        }
                    }]

                })

                wiz.show();
            });
        }
    }

    //Add new

    //Rightclick menu

    //Select feature
    this.selectFeatureTool = function (callback, options) {
        if (!selectTool) {
            var defaults = { onSelect: callback };
            selectTool = new OpenLayers.Control.SelectFeature(layer, defaults);
            map.addControl(selectTool);
        }
        selectTool.activate();
    }
}
