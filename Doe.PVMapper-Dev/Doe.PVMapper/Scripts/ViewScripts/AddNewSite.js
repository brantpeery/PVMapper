/*
Add site plugin

Contributors: Brant Peery, Matthew Klien
*/


var tools = [];

pvMapper.onReady(function () {
    var thisTool = new addSite(pvMapper.map, pvMapper.getSiteLayer());
    tools.push(thisTool);
    var addSiteToolButton = new Ext.Button({
        text: "Add Site",
        enableToggle: true,
        toggleGroup: "editToolbox",
        handler: function () {
            if (thisTool.mapControl.active) {
                thisTool.deactivateDrawSite();
                this.toggle(false);
            }
            else {
                //Note: restricting this to a particular scale is silly.
                //if (pvMapper.map.getScale() < 60000) {
                    //Make sure the user is seeing the map
                    //pvMapper.showMapTab();
                    thisTool.activateDrawSite();
                    thisTool.button = this;
                    this.toggle(true);
                //} else {
                //   pvMapper.displayMessage("The Add Site tool can only be used when the map is zoomed in. Try zooming the map in more to add a site", "warning");
                //    this.cancel;
                //}
            }
        }
    });
    //pvMapper.mapToolbar.add(addSiteToolButton);
    pvMapper.mapToolbar.insert(0, addSiteToolButton); // add this to the start of the tool list

    //var addSiteToolCheckItem = new Ext.create('Ext.menu.CheckItem', {
    //    text: "Add Site",
    //    toggleGroup: "editToolbox",
    //    handler: function () {
    //        if (thisTool.mapControl.active) {
    //            thisTool.deactivateDrawSite();
    //            this.setChecked(false);
    //        }
    //        else {
    //            //Note: restricting this to a particular scale is silly.
    //            //if (pvMapper.map.getScale() < 60000) {
    //            //Make sure the user is seeing the map
    //            //pvMapper.showMapTab();
    //            thisTool.activateDrawSite();
    //            thisTool.button = this;
    //            this.setChecked(true);
    //            //} else {
    //            //   pvMapper.displayMessage("The Add Site tool can only be used when the map is zoomed in. Try zooming the map in more to add a site", "warning");
    //            //    this.cancel;
    //            //}
    //        }
    //    }
    //});
    //pvMapper.sitesToolbarMenu.add(addSiteToolCheckItem);
});

//The main plugin object. Conforms to the plugin definition set by the framework
function addSite(map, layer) {
 
    //If a style is applied at the layer level, then 
    //when a label is applied, the engine draws it incorrectly
    //For this reason the style is defined here, but used only when a 
    //feature is added
   var commonStyleMap = new OpenLayers.StyleMap({
        'default': {
            strokeColor: "#00FF00",
            strokeOpacity: 1,
            strokeWidth: 3,
            fillColor: "#FF5500",
            fillOpacity: 0.5,
            pointRadius: 6,
            pointerEvents: "visiblePainted",
            fontColor: "blue",
            fontSize: "12px",
            fontFamily: "Courier New, monospace",
            fontWeight: "bold",
            labelAlign: "cm",
            labelOutlineColor: "white",
            labelOutlineWidth: 3
        }
    });

    var self = this; //Makes the 'this' object accessable from the private methods
    var WKT;
    var currentSiteName;
    var feature;
    this.button;
    this.layer = pvMapper.getSiteLayer();
    this.mapControl = new OpenLayers.Control.DrawFeature(this.layer, OpenLayers.Handler.Polygon);
    map.addControl(this.mapControl);

    //activateDrawSite();
    
    this.activateDrawSite= function() {
        self.mapControl.activate();
        self.mapControl.events.register("featureadded", this.mapControl, onFeatureAdded);
        //pvMapper.displayMessage("Start creating your site by clicking on the map to draw the perimeter of your new site", "help");
    }

    this.deactivateDrawSite = function () {
        self.mapControl.events.unregister("featureadded", this.mapControl, onFeatureAdded);
        self.mapControl.deactivate();
        self.button.toggle(false);
    }
  
    function onFeatureAdded(data) {
        var control = this;
        feature = data.feature;

        pvMapper.newFeature = feature;

        //Continue to collect the needed form data
        ///HACK: This needs to use the framework standard way of doing it. For now I am going to assume that I have access to EXTjs 3
        var wiz = new Ext.create('Ext.window.Window', {
            layout:'auto',
            modal: true,
            collapsible: false,
            id: "siteWizard",
            
            title: "Create a New Site",
            bodyPadding: '5 5 0',
            width: 350,
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'Site Name',
                hideLabel: false,
                name: 'name',
                id: 'name'
            }, {
                fieldLabel: 'Site Description',
                xtype: 'textarea',
                name: 'siteDescription',
                id: 'sitedescription'
            }],

            buttons: [{
                text: 'Save',
                handler: function (b, e) {
                    //Erase the feature so that the label and style and stuff can be modified without having any artifacts linger on the SVG
                    // removed - I haven't observed this drawing issue, and there have been complaints about sites disappearing when added.
                    //feature.layer.eraseFeatures(feature);

                    var name = Ext.getCmp("name").getValue();
                    var desc = Ext.getCmp("sitedescription").getValue();

                    feature.attributes.name = name;
                    feature.attributes.description = desc;

                    //Redraw the feature with its new name
                    feature.layer.drawFeature(feature);

                    wiz.destroy();

                    WKT = feature.geometry.toString();

                    pvMapper.postSite(name, desc, WKT)
                        .done(function (site) {
                            feature.fid = site.siteId;

                            //push the new site into the pvMapper system
                            var newSite = new pvMapper.Site(feature);
                            pvMapper.siteManager.addSite(newSite);

                            if (console) console.log('Added ' + (newSite.name || 'new site') + ' to the site manager');
                        })
                        .fail(function () {
                            pvMapper.displayMessage('Failed to send new site to the server.', 'error');
                            feature.destroy();
                        });

                    self.deactivateDrawSite();
                }
            }, {
                text: 'Cancel',
                handler: function (b, e) {
                    feature.destroy();
                    control.cancel();
                    wiz.destroy();
                    self.deactivateDrawSite();
                }
            }]

        })

        wiz.show();
    }
};

addSite.prototype = {
    createEditTool: function () {
        control
        return control;
    }
}
