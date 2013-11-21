/*
    Adds dropdown for related links to toolbar
    Author: Darian Ramage, BYU
*/

pvMapper.onReady(function () {
    var relatedLinksWindow = new Ext.window.Window({
        title: 'Related Sites',
        height: 200,
        width: 100,
        layout: 'fit',
        items: [{
            xtype: 'box',
            autoEl: {
                tag: 'a',
                html: 'PVWatts',
                href: 'http://www.nrel.gov/rredc/pvwatts/',
                target: '_blank'
            }
        }, {
            xtype: 'box',
            autoEl: {
                tag: 'a',
                html: 'SAM',
                href: 'https://sam.nrel.gov/',
                target: '_blank'
            }
        }, {
            xtype: 'box',
            autoEl: {
                tag: 'a',
                html: 'EISPC EZ Mapping Tool',
                href: 'http://eispctools.anl.gov/',
                target: '_blank'
            }
        }, {
            xtype: 'box',
            autoEl: {
                tag: 'a',
                html: 'ANL Solar Mapper',
                href: 'http://solarmapper.anl.gov/',
                target: '_blank'
            }
        }, {
            xtype: 'box',
            autoEl: {
                tag: 'a',
                html: 'DSIRE Database',
                href: 'http://www.dsireusa.org/',
                target: '_blank'
            }
        }]
    });

    var RelatedLinksButton = new Ext.Button({
        text: "Related Links",
        enableToggle: false,
        handler: function () {
            Ext.create('Ext.window.Window', {
                title: 'Related Sites',
                height: 200,
                width: 250,
                layout: 'fit',
                autoShow: true,
                items: [{
                    xtype: 'panel',
                    html: "<a href='http://www.nrel.gov/rredc/pvwatts/' target='_blank>PVWatts</a><br>"
                }, {
                    xtype: 'panel',
                    html: "<a href='https://sam.nrel.gov/' target='_blank>SAM</a><br>"
                }, {
                    xtype: 'panel',
                    html: "<a href='http://eispctools.anl.gov/' target='_blank>EISPC EZ Mapping Tool</a><br>"
                }, {
                    xtype: 'panel',
                    html: "<a href='http://solarmapper.anl.gov/' target='_blank>ANL Solar Mapper</a><br>"
                }, {
                    xtype: 'panel',
                    html: "<a href='http://www.dsireusa.org/' target='_blank>DSIRE Database</a><br>"
                }]
            });
        }
    });

    pvMapper.mapToolbar.add('-');
    pvMapper.mapToolbar.add(RelatedLinksButton);
    pvMapper.mapToolbar.add('-');
});