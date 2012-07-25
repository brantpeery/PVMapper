/*
Add site plugin

Contributors: Brant Peery, Matthew Klien
*/

var tools=[];

pvMapper.onReady(function () {

    var addSiteTool = new Ext.Action({
        text: "Add Site",
        handler: function () {
            var tool = new addSite(pvMapper.map);

            tools.push(tool);


            
        }

    });
    pvMapper.toolbar.add(addSiteTool);
});

//The main plugin object. Conforms to the plugin definition set by the framework
function addSite(map, layer) {
    var self = this; //Makes the 'this' object accessable from the private methods
    var WKT;
    var currentSiteName;
    var feature;
    var wiz;
    this.layer = createSiteLayer(map);
    this.mapControl = new OpenLayers.Control.DrawFeature(this.layer, OpenLayers.Handler.Polygon);
    map.addControl(this.mapControl);

    activateDrawSite();
    this.mapControl.events.register("featureadded", this.mapControl, function (data) {
        var control = this;
        feature = data.feature;
        
        //Give a way to cancel the creation

        //This is where a save to the database might happen
        WKT = feature.geometry.toString();

        var kml = new OpenLayers.Format.KML();
        //alert(kml.write(feature));
        //Then continue to collect the needed form data
        ///HACK: This needs to use the framework standard way of doing it. For now I am going to assume that I have access to EXTjs 3
        wiz = new Ext.Window({
            layout:'form',
            modal:true,
            collapsible: true,
            id: "siteWizard",
            frame: true,
            title: "Create a New Site",
            bodyPadding: '5 5 0',
            width: 350,
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'Site Name',
                hideLabel:false,
                name: 'name',
                id:'name'
            }, {
                fieldLabel: 'Site Description',
                xtype:'textarea',
                name: 'siteDescription',
                id:'sitedescription'
            }],

            buttons: [{
                text: 'Save',
                handler: function (b, e) {
                    var name = Ext.getCmp("name").getValue();
                    var desc = Ext.getCmp("sitedescription").getValue();

                    feature.id=name;
                    feature.name=name;
                    wiz.destroy();

                    var msg = "The feature has been named " + name + " and it is described as " + desc + ". \n " + WKT;
                    $msgdiv = $('<div>' + msg + '</div>').appendTo('body').css({ 'position': 'fixed', top: '0', left: 0, width: "100%", background: 'red', color: 'white' });
                    $msgdiv.show();
                    $msgdiv.fadeOut(10000);
                    pvMapper.postSite("user1", name, desc, WKT);
                    //alert (msg);
                }
            }, {
                text: 'Cancel',
                handler: function (b, e) {
                    feature.destroy();
                    control.cancel();
                    wiz.destroy();
                }
            }]
     
        })

        wiz.show();
        



        //Now save the whole thing
    });
    
    function handleSave(b, e) {
        var msg;
        

        alert(feature.geometry.toString());
    }

    function createLayer () { }
    function activateDrawSite() {
        self.mapControl.activate();
        
    }
    function saveSiteInfo () { }
    function deactivateDrawSite () { }
    function nameSiteFeature () { }

    function createAddSiteDialog() { }
    function createSiteLayer(map) {
        var sitelayer = new OpenLayers.Layer.Vector("Sites");
        sitelayer.id = "SiteLayer";
        map.addLayer(sitelayer);
        return sitelayer;
    }

    
};
addSite.prototype = {
    createEditTool: function () {
        control 
        return control;
    },

        
}
