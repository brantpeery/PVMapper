/*
Add site plugin

Contributors: Brant Peery, Matthew Klien
*/


///TODO: Find a way to limit the use of the tool to when the user is zoomed in to something like 10 miles across
///TODO: Switch user to map tab
///TODO: Show help

var tools = [];

pvMapper.onReady(function () {
    var thisTool = new addSite(pvMapper.map, pvMapper.getSiteLayer());
    tools.push(thisTool);

    var addSiteTool = new Ext.Button({
        text: "Add Site",
        handler: function () {
            if (thisTool.mapControl.active) {
                thisTool.deactivateDrawSite();
                this.toggle(false);
            }
            else {
                if (pvMapper.map.getScale() < 60000) {
                    //Make sure the user is seeing the map
                    pvMapper.showMapTab();
                    thisTool.activateDrawSite();
                    thisTool.button = this;
                    this.toggle(true);
                } else {
                   pvMapper.displayMessage("The Add Site tool can only be used when the map is zoomed in. Try zooming the map in more to add a site", "warning");
                    this.cancel;
                }
            }


        }
        
    });
    pvMapper.mapToolbar.add(addSiteTool);
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
    

    function handleSave(b, e) {
        var msg;


        alert(feature.geometry.toString());
    }

    function createLayer() { }
    this.activateDrawSite= function() {
        self.mapControl.activate();
        self.mapControl.events.register("featureadded", this.mapControl, onFeatureAdded);
        pvMapper.displayMessage("Start creating your site by clicking on the map to draw the perimeter of your new site", "help");

    }
    function saveSiteInfo() { }
    this.deactivateDrawSite = function () {
        self.mapControl.events.unregister("featureadded", this.mapControl, onFeatureAdded);
        self.mapControl.deactivate();
        self.button.toggle(false);
    }
    function nameSiteFeature() { }

    function createAddSiteDialog() { }
  
    function onFeatureAdded(data) {
        var control = this;
        feature = data.feature;

        var kml = new OpenLayers.Format.KML();
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
                    feature.layer.eraseFeatures(feature);

                    var name = Ext.getCmp("name").getValue();
                    var desc = Ext.getCmp("sitedescription").getValue();

                    feature.attributes.name = name;
                    feature.attributes.description = desc;

                    wiz.destroy();

                    WKT = feature.geometry.toString();
                    var id = pvMapper.postSite(name, desc, WKT);
                    feature.fid = id; //Set the id of the feature so that it is updateable
                    
                    //push the new site into the pvMapper system
                    var newSite = new pvMapper.Site(feature);
                    pvMapper.siteManager.addSite(newSite);

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
    }

};
addSite.prototype = {
    createEditTool: function () {
        control
        return control;
    }

}
