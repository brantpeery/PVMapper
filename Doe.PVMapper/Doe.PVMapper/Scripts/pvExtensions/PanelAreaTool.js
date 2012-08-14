(function () {

    var site = pvMapper.getSelectedSite();
    if (site) {

        var wiz = new Ext.create('Ext.window.Window', {
            layout: 'auto',
            modal: true,
            collapsible: false,
            id: "siteWizard",

            title: "Panel Area",
            bodyPadding: '5 5 0',
            width: 350,
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'Ground Area Available',
                xtype: 'numberfield',
                //http://www.mysamplecode.com/2011/12/extjs-4-set-decimal-precision-using.html
                value: .85,
                decimalPrecision: 2,
                maxValue: 1,
                minValue: 0,
                step: 0.02,
                // Remove spinner buttons, and arrow key and mouse wheel listeners
                //hideTrigger: true,
                //keyNavEnabled: false,
                //mouseWheelEnabled: false,
                name: 'areaPercent',
                id: 'areaPercent'
            }, {
                xtype: 'label',
                forId: 'areaPercent',
                text: 'The figure provided will be multiplied by the buffered site area.',
                margins: '0 0 0 10'
            }],

            buttons: [{
                text: 'Save',
                handler: function (b, e) {
                    var setback = site.attributes.innerGeometry;
                    // hack: for some reason this seems to give a larger area than the original polygon.
                    // it may be getting the wrong polygon somehow.
                    var area = setback.getGeodesicArea();
                    var areaPercent = Ext.getCmp("areaPercent").getValue();
                    var panelArea = area * areaPercent;
                    var kmArea = panelArea / 1000000;
                    pvMapper.postScore(kmArea, kmArea, site.fid, "TODO:PanelAreaID");
                    $.jGrowl("Submitted panel area: " + kmArea);
                    // todo: destroy only on done, not on fail (so user can resubmit)
                    wiz.destroy();
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
})();