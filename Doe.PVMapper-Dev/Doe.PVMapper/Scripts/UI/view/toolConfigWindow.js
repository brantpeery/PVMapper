
var toolsStore = Ext.create('Ext.data.TreeStore', {
    root: {
        expanded: true,
        children: [
        ]
    }
});

var isToolChanged = false;
var toolTree = Ext.create('Ext.tree.Panel', {
    // title: 'Simple Tree',
    store: toolsStore,
    rootVisible: false,
    artoScroll: true,
    renderTo: Ext.getBody(),
    shrinkWrap: 3,
    listeners: {
        itemclick: function (view, record, item, index, e) {

        },
        checkchange: function (node, check) {
            if (check) {
                var mInfo = pvMapper.moduleManager.getModule(node.data.text);
                if (mInfo) {
                    mInfo.isActive = true;
                    if (!toolTree.createModule(mInfo.moduleUrl, mInfo.ctor, node.data.text)) {
                        mInfo.isActive = false;
                    }
                }
                isToolChanged = true;
            }
            else {
                //remove the module from scoreboard and dispose off.
                var moduleName = node.data.text;
                toolTree.removeModule(moduleName);
                isToolChanged = true;
            }
        }
    },
    createModule: function (url, ctor, moduleName) {
        try {
            if (ctor == undefined) {
                if (url != '') {
                    new Promise(function (resolve, reject) {
                        try {
                            pvMapper.moduleManager.getScript(url, function onLoaded() {
                                resolve();
                            });
                        }
                        catch (ex) {
                            reject(Error(ex.message));
                        }
                    }).then (bindTo(this, function onResolved(){
                        //refresh the tool listing, since adding a new tool module script may have many more tool in it.
                        this.loadToolModules();
                    }),
                    function onReject(err) {
                        console.log("Loading script error, cause: " + err.message);
                    })
                }
                else
                    alert("Activation of tool module '" + moduleName + "' failed because it has an unknown code file.")
            }
            else {
                var tool = new ctor();  //shouldn't really need to do any thing, the module is self injected into the scoreboard.
                if (tool.getModuleObj != undefined) {
                    var m = tool.getModuleObj();
                    if (m.getScoreLine != undefined) {
                        var sl = m.getScoreLine();
                        sl.loadConfiguration();
                    }
                }

                pvMapper.mainScoreboard.update();
                pvMapper.mainScoreboard.updateTotals();
            }
            return true;
        }
        catch (ex) {
            console.log("An attempt to create a module '" + moduleName + "' failed, cause: " + ex.message);
            return false;
        }
        
    },
    removeModule: function (moduleName) {
        if ((moduleName != undefined) && (moduleName.length > 0))
          pvMapper.mainScoreboard.removeModule(moduleName);
    },
    loadToolModules: function () {
        var modules = pvMapper.moduleManager.modules;
        var root = toolsStore.getRootNode();
        root.removeAll();
        modules.forEach(function (amodule) {
            var catNode = root.findChildBy(function (anode) {
                if (anode.data.text == amodule.category) return true; else return false;
            });

            if (catNode == null) {
                catNode = root.appendChild({ text: amodule.category, leaf: false, expanded: true });
            }

            var node = root.findChildBy(function (anode) {
                if (anode.data.text == amodule.moduleName) return true; else return false;
            });

            amodule.isActive = amodule.isActive || false;
            if (node == null) {
                catNode.appendChild({ text: amodule.moduleName, qtip:amodule.description, leaf: true, checked: amodule.isActive });
            }
        });
        this.store = toolsStore;
    }

});


var toolContent = Ext.create('Ext.form.Panel', {
    layout: 'fit',
    //autoScroll: true,
    renderTo: Ext.getBody(),
    items: [toolTree],
});



Ext.define("MainApp.view.ToolConfigWindow", {
    extend: "MainApp.view.Window",
    title: "Tool/Module Selector",
    autoWidth: true,
    autoHeight: true,
    x: 10,
    y: 10,
    width: 270,
    height: 540,
    floating: true,
    closeAction: 'close',
    constrainHeader: true,
    collapsible: false,
    minimizable: false,
    resizable: true,
    modal: true,
    initMode: true,
    closeMode: '',
    layout: 'auto',
    items: [],
    initComponent: function () {
        var me = this;
        me.items.push(toolContent);
        this.callParent(arguments);
        isToolChanged = false;
    },
    loadToolConfig: function (wnd, opt) {
        toolTree.loadToolModules();
    },
    saveToolConfig: function () {
        //TODO: save the tools config to the database.
        if (isToolChanged)
          pvMapper.moduleManager.saveTools();
    },
    listeners: {
        beforeshow: function (wnd, opt) {
            this.loadToolConfig(wnd, opt);
        },
        beforeclose: function (wnd, opt) {
            if (this.closeMode == 'Save') {
                this.saveToolConfig();
            }
            var root = toolsStore.getRootNode();
            root.removeAll();
            return true;
        },
        resize: function (wnd, w, h, op) {
            var bodyEl = document.getElementById(wnd.body.id);
            var cR = bodyEl.getClientRects()[0];
            toolContent.setHeight(cR.height);
            toolContent.setWidth(cR.width);
        }
    }
});