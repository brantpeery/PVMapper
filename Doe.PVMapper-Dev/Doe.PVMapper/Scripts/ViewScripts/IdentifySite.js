/*Identify tool modify from Add site plugin ( Contributors: Brant Peery, Matthew Klien)
*/
var tools = [];

pvMapper.onReady(function () {
    var thisTool = new identifySite(pvMapper.map, pvMapper.getSiteLayer());
    tools.push(thisTool);
 
    
    var IdentifyTool = new Ext.Button({
        enableToggle: true,
        toggleGroup: "editToolbox",
        text: "Identify",
        handler: function () {
            if (thisTool.mapControl.active) {
                thisTool.deactivateDrawSite();
                this.toggle(false);
            }
            else {
                pvMapper.showMapTab();
                thisTool.activateDrawSite();
                thisTool.button = this;
                this.toggle(true);
            }
        }
    });
    pvMapper.mapToolbar.add(IdentifyTool);
});

//The main plugin object. Conforms to the plugin definition set by the framework
function identifySite(map, layer) {
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
    this.mapControl = new OpenLayers.Control.DrawFeature(this.layer, OpenLayers.Handler.Point);
    map.addControl(this.mapControl);


    function handleSave(b, e) {
        var msg;

        alert(feature.geometry.toString());
    }

    function createLayer() { }
    this.activateDrawSite = function () {
        self.mapControl.activate();
        self.mapControl.events.register("featureadded", this.mapControl, onIdentify);
        pvMapper.displayMessage("Start creating your site by clicking on the map to draw the perimeter of your new site", "help");

    }

    this.deactivateDrawSite = function () {
        
        self.mapControl.events.unregister("featureadded", this.mapControl, onIdentify);
        self.mapControl.deactivate();
        self.button.toggle(false);
    }

    function onIdentify(data) {
        var control = this;
       feature = data.feature;
       var kml = new OpenLayers.Format.KML();
        pvMapper.newFeature = feature;

        //----------------------------------------------------------------------
        //get indify location
        // UTM system
        var x0 = data.feature.geometry.x;
        var y0 = data.feature.geometry.y;

        var projWGS84 = new OpenLayers.Projection("EPSG:4326");
        var proj900913 = new OpenLayers.Projection("EPSG:900913");

        var point = new OpenLayers.LonLat(x0, y0);
        var point2 = point.transform(proj900913, projWGS84);
        //LAT-LONG system
        var x = point2.lat;
        var y = point2.lon;
        //----------------------------------------------------------------------


        //To Retrieve data from OpenGeo
       
        var map = pvMapper.map;
        var info = new OpenLayers.Control.WMSGetFeatureInfo({
            id: 'identify',
            autoActivate : true,
            url: 'http://demo.opengeo.org/geoserver/wms',
            title: 'Identify features by clicking',
            queryVisible: true,
            eventListeners: {
                "beforegetfeatureinfo": function (e) {

                    console.log("Event captured : " + e.xy);
                },
                "getfeatureinfo": function (e) {
                    console.log(JSON.stringify(e.features));
                    var items = [];
                    Ext.each(e.features, function (feature) {
                        items.push({
                            xtype: "propertygrid",
                            title: feature.fid,
                            source: feature.attributes
                        });
                    });

                    new GeoExt.Popup({
                        title: "Feature Info",
                        width: 200,
                        height: 200,
                        layout: "accordion",
                        map: map,
                        location: e.xy,
                        items: items
                    }).show();

                }
            }
        });
        map.addControl(info);

        //Build the request


        info.activate();

        var optionsI = info.buildWMSOptions('http://demo.opengeo.org/geoserver/wms', pvMapper.map , map.getPixelFromLonLat(point));
      
        //var result = info.request(map.getPixelFromLonLat(point));

        //handleResponse(xy,request,url);

       // info.triggerGetFeatureInfo(optionsI,map.getPixelFromLonLat(point),result);

//        map.events.triggerEvent("WMSGetFeatureInfo", { xy: map.getPixelFromLonLat(point) });
        

        //Continue to collect the needed form data
        ///HACK: This needs to use the framework standard way of doing it. For now I am going to assume that I have access to EXTjs 3
        var wiz = new Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            collapsible: false,
            id: "iden",
            title: "Identify point(" + x + "," + y + ")",
            bodyPadding: '5 5 0',
            width: 350,
            height: 450,
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'grid',
                border: false,
                columns: [{ header: 'Field' }, { header: 'Value' }],                 // One header just for show. There's no data,
                store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
            },

            buttons: [{
                text: 'Close',
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

identifySite.prototype = {
    createEditTool: function () {
        control
        return control;
    }

}
