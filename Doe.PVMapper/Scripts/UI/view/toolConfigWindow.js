
var toolsStore = Ext.create('Ext.data.TreeStore', {
    root: {
        expanded: true,
        children: [
        ]
    },
    folderSort: true,
    sorters: [{property:'text', direction: 'ASC'}],
});



Ext.define("MainApp.view.ToolConfigWindow", {
    extend: "MainApp.view.Window",
    title: "Tool Module Selector",
    //autoWidth: true,
    //autoHeight: true,
    //x: 10,
    //y: 10,
    width: 270,
    floating: true,
    closeAction: 'close',
    constrainHeader: true,
    collapsible: false,
    minimizable: false,
    resizable: true,
    modal: true,
    //initMode: true,
    //closeMode: '',
    //layout: 'fit',
    items: [{
        xtype: 'treepanel',
        layout: 'fit',
        // title: 'Simple Tree',
        store: toolsStore,
        rootVisible: false,
        //artoScroll: true,
        renderTo: Ext.getBody(),
        //shrinkWrap: 3,
        listeners: {
            //itemclick: function (view, record, item, index, e) {
            //},
            checkchange: function (node, check) {
                //if (check) {
                if (node.data.checked !== node.raw.isActive) {
                    if (node.data.checked) {
                        var registeredModule = pvMapper.moduleManager.activateModule(node.raw);
                        node.raw = registeredModule || node.raw; // save updated module handle from moduleManager, if there is one
                    } else {
                        var registeredModule = pvMapper.moduleManager.deactivateModule(node.raw);
                        node.raw = registeredModule || node.raw; // save updated module handle from moduleManager, if there is one
                    }
                }
                node.data.checked = node.raw.isActive;
                //TODO: the check box may populate incorrectly when activating a module requiring a js fetch which then fails to activate... I ought to correct that.
            },
            beforerender: function (panel, eOpts) {
                var modules = pvMapper.moduleManager.getAvailableModules().concat(); // concat makes a shallow copy of the array, for in-place sorting

                // sort modules...
                modules.sort(function (a, b) {
                    if (a.category > b.category)
                        return 1;
                    if (a.category < b.category)
                        return -1;
                    if (a.title > b.title)
                        return 1;
                    if (a.title < b.title)
                        return -1;
                    return 0;
                });

                var root = panel.store.getRootNode();
                //root.removeAll();
                modules.forEach(function (amodule) {
                    var catNode = root;
            
                    if (amodule.category) {
                        catNode = root.findChildBy(function (anode) {
                            return anode.data.text === amodule.category;
                        });

                        if (!catNode) {
                            catNode = root.appendChild({ text: amodule.category, leaf: false, expanded: true });
                        }
                    }

                    var node = catNode.findChildBy(function (anode) {
                        return anode.raw && anode.raw.id === amodule.id;
                    });

                    if (node == null) {
                        node = catNode.appendChild({ text: amodule.title, qtip:amodule.description, leaf: true, checked: amodule.isActive, raw: amodule });
                        node.raw = amodule;
                    } else {
                        node.checked = amodule.isActive || false;
                    }
                });
                //this.store = toolsStore;
            } // beforeshow
        } // listeners
    }],
    buttons: [{
        xtype: 'button',
        text: "Close",
        tooltip:'Close this window.',
        handler: function () {
            this.ownerCt.ownerCt.close();
        }
    }]
});