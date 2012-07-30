/*
Add site plugin

Contributors: Brant Peery, Matthew Klien
*/


///TODO: Find a way to limit the use of the tool to when the user is zoomed in to something like 10 miles across
///TODO: Switch user to map tab
///TODO: Show help

var tools = [];

pvMapper.onReady(function () {
    var thisTool = new addSite(pvMapper.map);
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
    pvMapper.toolbar.add(addSiteTool);
});

//The main plugin object. Conforms to the plugin definition set by the framework
function addSite(map, layer) {
    var commonStyleMap;


    var self = this; //Makes the 'this' object accessable from the private methods
    var WKT;
    var currentSiteName;
    var feature;
    var wiz;
    this.button;
    this.layer = createSiteLayer(map);
    this.mapControl = new OpenLayers.Control.DrawFeature(this.layer, OpenLayers.Handler.Polygon);
    map.addControl(this.mapControl);

    //activateDrawSite();
    this.mapControl.events.register("featureadded", this.mapControl, function (data) {
        var control = this;
        feature = data.feature;

        var kml = new OpenLayers.Format.KML();

        //Continue to collect the needed form data
        ///HACK: This needs to use the framework standard way of doing it. For now I am going to assume that I have access to EXTjs 3
        wiz = new Ext.Window({
            layout: 'form',
            modal: true,
            collapsible: true,
            id: "siteWizard",
            frame: true,
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
                    var name = Ext.getCmp("name").getValue();
                    var desc = Ext.getCmp("sitedescription").getValue();

                    feature.id = name;
                    feature.name = name;
                    feature.attributes = {
                        name: name,
                        description: desc
                    };

                    ///HACK: For some reason the OpenLayers engine renders an extra set of labels if 
                    ///the style is applied at the layer level. However by defining the label attribute at
                    ///the feature, an extra label is not drawn to the screen by the engine.
                    var myStyle = commonStyleMap.createSymbolizer(feature, 'default');
                    myStyle.label = name;
                    feature.style = myStyle;


                    //Refresh the feature
                    feature.layer.eraseFeatures(feature);
                    feature.layer.drawFeature(feature);

                    wiz.destroy();

                    var id = pvMapper.postSite("user1", name, desc, WKT);
                    feature.id = id; //Set the id of the feature so that it is updateable
                    
                    var msg;
                    if (id) {
                        msg = "The site " + name + " has been added to your database";
                    } else {
                        msg = "There was a problem adding the site to the database!";
                    }

                    pvMapper.displayMessage(msg, "warning");
                    deactivateDrawSite();
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


        //This is where a save to the database might happen
        WKT = feature.geometry.toString();

        //Now save the whole thing
    });

    function handleSave(b, e) {
        var msg;


        alert(feature.geometry.toString());
    }

    function createLayer() { }
    this.activateDrawSite= function() {
        self.mapControl.activate();
        pvMapper.displayMessage("Start creating your site by clicking on the map to draw the perimeter of your new site", "help");

    }
    function saveSiteInfo() { }
    this.deactivateDrawSite=function() {
        self.mapControl.deactivate();
        self.button.toggle(false);
    }
    function nameSiteFeature() { }

    function createAddSiteDialog() { }
    function createSiteLayer(map) {
        if (layer == null) {

            // allow testing of specific renderers via "?renderer=Canvas", etc
            var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

            var sitelayer = new OpenLayers.Layer.Vector("Sites",
                {
                    renderers: renderer
                });

            //If a style is applied at the layer level, then 
            //when a label is applied, the engine draws it incorrectly
            //For this reason the style is defined here, but used only when a 
            //feature is added
            commonStyleMap = new OpenLayers.StyleMap({
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

            sitelayer.id = "SiteLayer";
            map.addLayer(sitelayer);
            return sitelayer;
        } else { return layer; }
    }


};
addSite.prototype = {
    createEditTool: function () {
        control
        return control;
    }

}
