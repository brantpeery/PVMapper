/// <reference path="../../ExtJS.d.ts" />
/// <reference path="../../jquery.d.ts" />



//if (typeof (Ext) == 'undefined')
//  var Ext = new Ext();

module pvMapper {

  export class PVData {
    constructor() {
      projectStore.load();
      this.getStore();
    }

    public userInfos = pvMapper.userInfoStore;
    public projects = pvMapper.projectStore;
    public modules = null;
    public scoreBoards = pvMapper.scoreBoardStore;
    public tools = null;
    public scores = null;

    public insert(tableName: string, fields: any[]) { }
    public update(tableName: string, fields: any[], id: number) { }                         
    public delete (tableName: string, id: number) { }
    public select(tableName: string, fields: any[], predicate: string[]): any { }

    public refreshTree() : any {
      var ts: Ext.data.ITreeStore = pvMapper.treeStore;
      ts.root.removeAll(); //Remove all records (children)
      //TreeStore start with ModuleStore.
      var aRoot = ts.getRootNode();
      var proj = projectStore.first();
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

          // scoreStore is not required for the tree menu.
        });
      });
      return projectNode;
    }

    public refreshScore() {
      //clear all item from the store.
      scoreBoardStore.removeAll();

      var proj = projectStore.first();
      proj.modules().each(function (aMod) {
        aMod.tools().each(function (aTool) {
          aTool.scores().each(function (aScore) {
            var aSite = aScore.getSiteModel();
            //Create a scoreboard record.
            var sb = Ext.create('MyApp.data.ScoreBoardModel', {
              Tool_ID: aTool.Tool_ID,
              Tool_Name: aTool.Tool_Name,
              Score_Value: aScore.Value,
              Score_ID: aScore.Score_ID,
              Score_Object: aScore
            });
            //Add a record into the ScoreBoard store.
            scoreBoardStore.insert(sb);
          });
        });
      });
    }

    public getStore() {
      this.projects = projectStore;
      this.modules = projectStore.modules();
      this.tools = this.modules.tools();
      this.scores = this.tools.scores();
    }
  }

  projectStore.load({
    callback: function () {
      //on successful load do:
      var proj = projectStore.first();
      proj.modules().each(function (aMod) {
        aMod.tools().each(function (aTool) {
          aTool.scores().each(function (aScore) {
            var aSite = aScore.getSiteModel();
            //Create a scoreboard record.
            var sb = Ext.create('MyApp.data.ScoreBoardModel', {
              Tool_ID: aTool.Tool_ID,
              Tool_Name: aTool.Tool_Name,
              Score_Value: aScore.Value,
              Score_ID: aScore.Score_ID,
              Score_Object: aScore
            });
            //Add a record into the ScoreBoard store.
            scoreBoardStore.insert(sb);
          });
        });
      });
    }
  });

  //===============TREE STORE ===============
  export var treeStore = Ext.create('Ext.data.TreeStore', {
    root: {
      text: 'Root',
      expanded: false,
      children: []
    }
  });

  //=========SCORE BOARD Model ==========
  Ext.define('MyApp.data.ScoreBoardModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'ScoreBoard_ID', type: 'int' },
      { name: 'Tool_ID', type: 'int' },
      { name: 'Tool_Name', type: 'int' },
      { name: 'Score_Value', type: 'float' },
      { name: 'Score_Object', type: 'auto' }
    ],
    idProperty: 'ScoreBoard_ID',
  });

  export var scoreBoardStore = Ext.create('Ext.data.Store', {
    model: 'MyApp.data.ScoreBoardModel',
    autoLoad: true,
    autoSave: true,
    idProperty: 'ScoreBoard_ID',
    proxy: {
      type: 'localstorage'
      /*
        type: 'json',
        url: '...
         */
    }
  });

  //============== Site ===============
  Ext.define('SiteModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'Site_ID', type: 'int' },
      { name: 'Site_Name', type: 'string' }
    ],
    idProperty: 'Site_ID',
    hasMany: { model: 'MyApp.data.ScoreModel', name: 'scores' }
  });

  //============== Project Info ===============
  /**
  The project is the root.  A project makes up of one or more ModuleModel.  Each module makes up one or more ToolModel. 
  ToolModel isone-to-one with a scoreline.  ToolModel shares one or more of the ScoreModel with SiteModel.  ScoreModel is an association
  (many-to-many) with SiteModel and ToolModel.
  */
  Ext.define('MyApp.data.ProjectModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'Project_ID', type: 'int' },
      { name: 'Project_Name', type: 'string' },
      { name: 'Module_Owner', type: 'string' },
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

  /*
  A single store will load/save an entire project hiearchy: project->modules->tools->scores<-sites.
  */
  export var projectStore = Ext.create('Ext.data.Store', {
    model: 'MyApp.data.ProjectModel',
    autoLoad: false,
    autoSave: true,
    idProperty: 'Project_ID',
  });

  //============== Module ===============
  Ext.define('MyApp.data.ModuleModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'Module_ID', type: 'int' },
      { name: 'Module_Name', type: 'string' },
      { name: 'Module_Owner', type: 'string' },
    ],
    idProperty: 'Module_ID',
    hasMany: { model: 'MyApp.data.ToolModel', name: 'tools' },
    belongsTo: 'MyApp.data.ProjectModel',
  });

  //============== Tool ===============
  Ext.define('MyApp.data.ToolModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'Tool_ID', type: 'int' },
      { name: 'Tool_Name', type: 'string' },
      { name: 'Tool_Owner', type: 'string' },
    ],
    idProperty: 'Tool_ID',
    hasMany: { model: 'MyApp.data.ScoreModel', name: 'scores' },
    belongsTo: 'MyApp.data.ModuleModel'
  });

  //============ SCORE ============
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
    //create an associate table between Site and Tool.
    belongsTo: <any[]>['MyApp.data.ToolModel', { model: 'SiteModel', associationKey: 'site_score' }]
  });

  //============== Project Info ===============
  Ext.define('MyApp.data.UserInfo', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'UserInfo_ID', type: 'int' },
      { name: 'User_ID', type: 'int' },
      { name: 'Info_Name', type: 'string' },
      { name: 'Info_Desc', type: 'string' },
    ],
    idProperty: 'UserInfo_ID',
  });

  export var userInfoStore = Ext.create('Ext.data.JsonStore', {
    model: 'MyApp.data.UserInfo',
    autoLoad: true,
    autoSave: true,
    idProperty: 'UserInfo_ID',
    proxy: {
      type: 'ajax',
      url: '../api/UserInfo'
    }
  });

}