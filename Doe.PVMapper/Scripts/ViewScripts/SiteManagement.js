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
        handler: function () {
            if (this.pressed) {
                sm.deleteSite(true);
                this.toggle(false);
            }
            else {
                sm.deleteSite();
                this.toggle(true);
                pvMapper.displayMessage("Click on a site to delete it.", "help");
            }
        }
    });
    var edittool = new Ext.Button({
        text: "Edit Site",
        handler: function () {
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
    });

    pvMapper.mapToolbar.add(deltool);
    pvMapper.mapToolbar.add(edittool);
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
                editTool = new OpenLayers.Control.ModifyFeature(layer, {});
                map.addControl(editTool);
                layer.events.register("afterfeaturemodified", editTool, function (e) {
                    //Save the modifications back to the database
                    //This is where a save to the database might happen
                    var f = e.feature;
                    var WKT = f.geometry.toString();
                    pvMapper.updateSite(f.fid, "user1", f.name, f.attributes.desc, WKT);
                });
            }
            editTool.activate();

        }
    }

    //Edit attributes

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
