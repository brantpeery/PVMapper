pvMapper.onReady(function () {

    var control = new OpenLayers.Control.WMSGetFeatureInfo({
        infoFormat: "application/vnd.ogc.gml",
        maxFeatures: 3,
        eventListeners: {
            getfeatureinfo: function (e) {
                var items = [];
                Ext.each(e.features, function (feature) {
                    items.push({
                        xtype: "propertygrid",
                        title: feature.fid,
                        source: feature.attributes
                    });
                });

                var wiz = new Ext.create('Ext.window.Window', {
                    layout: 'accordion',
                    modal: true,
                    collapsible: false,
                    id: "iden",
                    title: "Identify Point",
                    bodyPadding: '5 5 0',
                    width: 350,
                    height: 450,
                    items: items,
                    buttons: [{
                        text: 'Close',
                        handler: function (b, e) {
                            control.deactivate();
                            //b.pressed = false;
                            wiz.destroy();
                        }
                    }]

                });
                wiz.show();
            }
        }
    });

    pvMapper.map.addControl(control);


    var IdentifyTool = new Ext.Button({
        text: "Identify",
        enableToggle: true,
        toggleGroup: "editToolbox",
        toggleHandler: function (buttonObj, eventObj) {
            if (buttonObj.pressed) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
    });
    pvMapper.mapToolbar.add(IdentifyTool);

});