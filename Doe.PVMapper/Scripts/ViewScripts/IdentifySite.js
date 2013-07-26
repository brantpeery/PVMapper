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

    /*  Methods to use REST Identify on various layers
    function byuLayersIdentify(x, y) {
        console.log("In BYU identify method");
        var byuLayers = [   //contains info for all of BYU Layers to identify on [url, layerName]
            ["https://geoserver.byu.edu/arcgis/rest/services/Layers/counties/MapServer/", "US Counties"]
        ]

        var panels = [];

        for (var i = 0; i < byuLayers.length; i++) {
            console.log("byuLayersIdentify( " + i + "): " + byuLayers[i][0] + byuLayers[i][1]);
            panels[i] = byuIdentify(byuLayers[i][0], byuLayers[i][1]);
        }
        return panels;
    }

    function byuIdentify(inUrl, layerName, x, y) {
        var dataArray = [];

        var params = {
            f: "json",
            mapExtent: pvMapper.map.getExtent(),
            geometryType: "esriGeometryPoint",
            geometry: "",
            layers: "all",
            tolerance: 0,
            imageDisplay: "1, 1, 96",
            returnGeometry: false,
        };

        function handler(response) {
            if (response.status == 200) {
                var esriJsonParser = new OpenLayers.Format.JSON();
                esriJsonParser.extractAttributes = true;
                var parsedResponse = esriJsonParser.read(response.responseText);
                console.log("Identify Site Response: " + response.responseText);
                if (parsedResponse && parsedResponse.results) {
                    Console.log(parsedResponse.results);
                    dataArray = parsedResponse.results;
                } else {
                    dataArray = [["error: ", response.text]];
                }
            } else {
                dataArray = [["error: ", response.status]];
            }
        };

        var request = OpenLayers.Request.GET({
            url: inUrl + "identify",
            proxy: "/Proxy/proxy.ashx?",
            params: params,
            callback: handler
        });

        return createGrid(dataArray, layerName);
    }

    function createGrid(dataArray, layerName) {
        var store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                { name: 'field' },
                { name: 'value' }
            ],
            data: dataArray
        });

        var grid = Ext.create('Ext.grid.Panel', {
            hideCollapseTool: true,
            store: store,
            columnLines: true,
            columns: [
                {
                    text: 'Field',
                    sortable: true,
                    dataIndex: 'field',
                    width: 125
                },
                {
                    text: 'Value',
                    sortable: false,
                    dataIndex: 'value',
                    flex: 1
                }
            ],
            title: layerName,
            viewConfig: {
                stripeRows: true
            }
        });

        return grid;
    }*/

    function onIdentify(data) {
        console.log(data);
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

        //Send out a WMS Request as below, get the JSON data and push it into the array for output. 
        var lonlat = new OpenLayers.LonLat(x0, y0);
        var pixel = pvMapper.map.getPixelFromLonLat(lonlat);
      //  console.log(pixel);
       
      //  console.log(pvMapper.map.calculateBounds().toBBOX());
        /*var paramsWMS = {
            bbox: pvMapper.map.calculateBounds().transform(proj900913, projWGS84).toBBOX(),
            format: "jpeg",
            info_format: "application/json",
            request: "GetFeatureInfo",
            layers: "PVMapper:USStates",
            query_layers: "PVMapper:USStates",
            width: pvMapper.map.getSize().w,
            height: pvMapper.map.getSize().h,
            x: pixel.x,
            y: pixel.y,
            feature_count: 5
        };


        var request = new OpenLayers.Request.GET({
            url: "https://geoserver.byu.edu/geoserver/wms",
            proxy: "/Proxy/proxy.ashx?",
            params: paramsWMS,
            callback: function (response) {

                console.log(response);
                var jsonres = JSON.parse(response._object.response);
                console.log(jsonres.features[0].properties);
            }


        })*/

        var accordionGrid = byuLayersIdentify(x, y);
        

        //Continue to collect the needed form data
        ///HACK: This needs to use the framework standard way of doing it. For now I am going to assume that I have access to EXTjs 3
        var wiz = new Ext.create('Ext.window.Window', {
            layout: 'accordion',
            modal: true,
            collapsible: false,
            id: "iden",
            title: "Identify point(" + x + "," + y + ")",
            bodyPadding: '5 5 0',
            width: 350,
            height: 450,
            items: accordionGrid,
                //grid,
            /*{  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'grid',
                border: false,
                columns: [{ header: 'Field' }, { header: 'Value' }],                 // One header just for show. There's no data,
                store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
            },*/

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

/* Notes Completing Identify Method
main identify method called from OnIdentify Method
    returns completed ext.grid.panel
    use method to identify each layer, adding them in turn to the data store

layer panel creator method
    This method takes the array from the layer data store creator and adds it to a grid

layer data store creator method
    takes the array from layer identify method

layer identify
    sends identify request to the server
    takes the response, which should be all the field/value pairs from that layer at that location,
    and puts them into an array
    this array is returned to the above method
 */



//Basis for individual layer
//To be used for testing UI
var dataArray = [];

var layerName = "Layer Name";

var store = Ext.create('Ext.data.ArrayStore', {
    fields: [
        { name: 'field' },
        { name: 'value' }
    ],
    data: dataArray
});

var grid = Ext.create('Ext.grid.Panel', {
    hideCollapseTool: true,
    store: store,
    columnLines: true,
    columns: [
        {
            text: 'Field',
            sortable: true,
            dataIndex: 'field',
            width: 125
        },
        {
            text: 'Value',
            sortable: false,
            dataIndex: 'value',
            flex: 1
        }
    ],
    title: layerName,
    viewConfig: {
        stripeRows: true
    }
});
