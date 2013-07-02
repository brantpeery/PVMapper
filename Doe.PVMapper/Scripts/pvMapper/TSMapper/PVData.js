if (typeof (Ext) == 'undefined')
    var Ext = new Ext();

var pvMapper;
(function (pvMapper) {
    var PVData = (function () {
        function PVData() {
            this.userInfos = pvMapper.userInfoStore;
            this.projects = pvMapper.projectStore;
            this.modules = null;
            this.scoreBoards = pvMapper.scoreBoardStore;
            this.tools = null;
            this.scores = null;
            pvMapper.projectStore.load();
            this.getStore();
        }
        PVData.prototype.insert = function (tableName, fields) {
        };
        PVData.prototype.update = function (tableName, fields, id) {
        };
        PVData.prototype.delete = function (tableName, id) {
        };
        PVData.prototype.select = function (tableName, fields, predicate) {
        };

        PVData.prototype.refreshTree = function () {
            var ts = pvMapper.treeStore;
            ts.root.removeAll();

            var aRoot = ts.getRootNode();
            var proj = pvMapper.projectStore.first();
            var projectNode = Ext.create('NodeInterface', {
                text: proj.Project_Name,
                cls: 'menuItem',
                expandable: true,
                leaf: false,
                checked: true,
                root: true
            });
            proj.modules().each(function (aModule) {
                var moduleNode = Ext.create('NodeInterface', {
                    text: aModule.Tool_Name,
                    cls: 'menuItem',
                    leaf: true,
                    expandable: true,
                    checked: false,
                    parentNode: projectNode
                });
                projectNode.appendChild(moduleNode);
                aModule.tools().each(function (aTool) {
                    var toolNode = Ext.create('NodeInterface', {
                        text: aTool.Tool_Name,
                        cls: 'menuItem',
                        leaf: true,
                        checked: false,
                        parentNode: moduleNode
                    });
                    moduleNode.appendChild(toolNode);
                });
            });
            return projectNode;
        };

        PVData.prototype.refreshScore = function () {
            pvMapper.scoreBoardStore.removeAll();

            var proj = pvMapper.projectStore.first();
            proj.modules().each(function (aMod) {
                aMod.tools().each(function (aTool) {
                    aTool.scores().each(function (aScore) {
                        var aSite = aScore.getSiteModel();

                        var sb = Ext.create('MyApp.data.ScoreBoardModel', {
                            Tool_ID: aTool.Tool_ID,
                            Tool_Name: aTool.Tool_Name,
                            Score_Value: aScore.Value,
                            Score_ID: aScore.Score_ID,
                            Score_Object: aScore
                        });

                        pvMapper.scoreBoardStore.insert(sb);
                    });
                });
            });
        };

        PVData.prototype.getStore = function () {
            this.projects = pvMapper.projectStore;
            this.modules = pvMapper.projectStore.modules();
            this.tools = this.modules.tools();
            this.scores = this.tools.scores();
        };
        return PVData;
    })();
    pvMapper.PVData = PVData;

    pvMapper.projectStore.load({
        callback: function () {
            var proj = pvMapper.projectStore.first();
            proj.modules().each(function (aMod) {
                aMod.tools().each(function (aTool) {
                    aTool.scores().each(function (aScore) {
                        var aSite = aScore.getSiteModel();

                        var sb = Ext.create('MyApp.data.ScoreBoardModel', {
                            Tool_ID: aTool.Tool_ID,
                            Tool_Name: aTool.Tool_Name,
                            Score_Value: aScore.Value,
                            Score_ID: aScore.Score_ID,
                            Score_Object: aScore
                        });

                        pvMapper.scoreBoardStore.insert(sb);
                    });
                });
            });
        }
    });

    pvMapper.treeStore = Ext.create('Ext.data.TreeStore', {
        root: {
            text: 'Root',
            expanded: false,
            children: []
        }
    });

    Ext.define('MyApp.data.ScoreBoardModel', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ScoreBoard_ID', type: 'int' },
            { name: 'Tool_ID', type: 'int' },
            { name: 'Tool_Name', type: 'int' },
            { name: 'Score_Value', type: 'float' },
            { name: 'Score_Object', type: 'auto' }
        ],
        idProperty: 'ScoreBoard_ID'
    });

    pvMapper.scoreBoardStore = Ext.create('Ext.data.Store', {
        model: 'MyApp.data.ScoreBoardModel',
        autoLoad: true,
        autoSave: true,
        idProperty: 'ScoreBoard_ID',
        proxy: {
            type: 'localstorage'
        }
    });

    Ext.define('SiteModel', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Site_ID', type: 'int' },
            { name: 'Site_Name', type: 'string' }
        ],
        idProperty: 'Site_ID',
        hasMany: { model: 'MyApp.data.ScoreModel', name: 'scores' }
    });

    Ext.define('MyApp.data.ProjectModel', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Project_ID', type: 'int' },
            { name: 'Project_Name', type: 'string' },
            { name: 'Module_Owner', type: 'string' }
        ],
        idProperty: 'Project_ID',
        hasMany: { model: 'MyApp.data.ModuleModel', name: 'modules' },
        proxy: {
            type: 'ajax',
            url: '../api/Project',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });

    pvMapper.projectStore = Ext.create('Ext.data.Store', {
        model: 'MyApp.data.ProjectModel',
        autoLoad: false,
        autoSave: true,
        idProperty: 'Project_ID'
    });

    Ext.define('MyApp.data.ModuleModel', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Module_ID', type: 'int' },
            { name: 'Module_Name', type: 'string' },
            { name: 'Module_Owner', type: 'string' }
        ],
        idProperty: 'Module_ID',
        hasMany: { model: 'MyApp.data.ToolModel', name: 'tools' },
        belongsTo: 'MyApp.data.ProjectModel'
    });

    Ext.define('MyApp.data.ToolModel', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Tool_ID', type: 'int' },
            { name: 'Tool_Name', type: 'string' },
            { name: 'Tool_Owner', type: 'string' }
        ],
        idProperty: 'Tool_ID',
        hasMany: { model: 'MyApp.data.ScoreModel', name: 'scores' },
        belongsTo: 'MyApp.data.ModuleModel'
    });

    Ext.define('MyApp.data.ScoreModel', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Score_ID', type: 'int' },
            { name: 'Score_Name', type: 'string' },
            { name: 'Value', type: 'float' },
            { name: 'Tool_ID', type: 'int' },
            { name: 'Site_ID', type: 'int' }
        ],
        idProperty: 'Score_ID',
        belongsTo: ['MyApp.data.ToolModel', { model: 'SiteModel', associationKey: 'site_score' }]
    });

    Ext.define('MyApp.data.UserInfo', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'UserInfo_ID', type: 'int' },
            { name: 'User_ID', type: 'int' },
            { name: 'Info_Name', type: 'string' },
            { name: 'Info_Desc', type: 'string' }
        ],
        idProperty: 'UserInfo_ID'
    });

    pvMapper.userInfoStore = Ext.create('Ext.data.JsonStore', {
        model: 'MyApp.data.UserInfo',
        autoLoad: true,
        autoSave: true,
        idProperty: 'UserInfo_ID',
        proxy: {
            type: 'ajax',
            url: '../api/UserInfo'
        }
    });
})(pvMapper || (pvMapper = {}));
