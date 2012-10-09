Ext.define('pvMapper.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    items: [{
        xtype: 'panel',
        layout: 'border',
        items: [{
            id: 'header',
            region: 'north',
            xtype: 'panel',
            height: 65,
            items: [{
                xtype: 'panel',
                contentEl: 'Header',
            }]
        },
        //{
        //    region: 'west',
        //    title: 'Dock Container',
        //    width: '20%',
        //    minSize: 150
        //},
        {
            collapsible: false,
            xtype: 'panel',
            layout: 'border',
            id: 'mainbody',
            region: 'center',
            margins: '0',
            padding: '0',
            items: [{
                collapsible: false,
                xtype: 'toolbar',
                id: 'maintoolbar',
                region: 'north',
                margins: '0',
                padding: '0',
                items: [
                     {
                         // xtype: 'button', // default for Toolbars
                         text: 'Button'
                     },
                    {
                        xtype: 'splitbutton',
                        text: 'Split Button'
                    }
                ]
            },
            {
                collapsible: false,
                xtype: 'toolbar',
                id: 'maintaskbar',
                region: 'south',
                margins: '0',
                padding: '0',
                items: [
                     {
                         // xtype: 'button', // default for Toolbars
                         text: 'Button'
                     },
                    {
                        xtype: 'splitbutton',
                        text: 'Split Button'
                    }
                ]
            },
            {
                collapsible: false,
                xtype: 'panel',
                id: 'maincontent',
                region: 'center',
                margins: '0',
                padding: '5,5,5,5',
                contentEl: 'Content',
                items: [],
                weight: .7
            }]
        }],
    }]
});