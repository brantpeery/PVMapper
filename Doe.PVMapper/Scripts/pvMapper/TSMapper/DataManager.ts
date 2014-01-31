/// <reference path="Options.d.ts" />
/// <reference path="common.ts" />
/// <reference path="Score.ts" />
/// <reference path="../../ExtJS.d.ts" />


// Module                                               
module pvMapper {

    // for mainttaining uploaded custom KML modules.  The purpose if for keeping handles onto the module in case
    // user want to remove it from the project.

    //this class is the database KML Module record.  The key is the filename.  moduleName is the user given name.
    export class CustomModule {
        constructor(name: string, aclass: string, data: any) {
            this.customName = name;
            this.customClass = aclass;
            this.customData = data;
        }
        public customName: string;
        public customClass: string;
        public customData: any;
    }

    // these class and interface is for storing the module file name along with the module tool layer object
    export interface ICustomModuleTool {
        fileName: string;
        moduleObject: IModuleOptions;
    }

    export var ICustomModuleData: {
        new (name: string, data: any): ICustomModuleTool;
        prototype: ICustomModuleTool;
    }

    export class CustomModuleData implements ICustomModuleTool {

        constructor(options: ICustomModuleTool) {
            this.fileName = options.fileName;
            this.moduleObject = options.moduleObject;
        }
        public fileName: string;
        public moduleObject: IModuleOptions;
    }

   //Just to trick TypeScript into believing that we are creating an Ext object
   //to by pass development time compiler
//   if (typeof(Ext) === 'undefined') var Ext: ;

    export interface ExtendEventTarget extends EventTarget {
        result: any;  // this doest get defined  in Lib.d.s.
    }

    export class ClientDB {

        public static DB_NAME: string = "PVMapperData";
        public static CONFIG_STORE_NAME: string = "PVMapperScores";
        public static PROJECT_STORE_NAME: string = "PVMapperProjects";
        public static db: IDBDatabase = null;
        public static DBVersion = 7;

        public static indexedDB: IDBFactory = window.indexedDB || window.msIndexedDB; // || window.webkitIndexedDB || window.mozIndexedDB 

        public static isDBCreating = false;
        public static clientDBError: boolean = false;
        public static initClientDB() {
            var me = this;
            if (!ClientDB.indexedDB) {
                window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
                return;                         
            }

            if (ClientDB.db) return;//already have database object.

            try {
                if (!ClientDB.isDBCreating) {
                    ClientDB.isDBCreating = true;
                    var dbreq: IDBOpenDBRequest = ClientDB.indexedDB.open(ClientDB.DB_NAME, ClientDB.DBVersion);
                    dbreq.onsuccess = function (evt): any {
                        console.log("Database [PVMapperData] is open sucessful.");
                        ClientDB.db = evt.currentTarget.result;
                    }

                    dbreq.onerror = function (event: ErrorEvent): any {
                        me.clientDBError = true;
                        console.log("indexedDB open error: " + event.message);
                    }

                    dbreq.onupgradeneeded = function (evt): any {
                        try {
                            var db = evt.target.result;
                            if (!db.objectStoreNames.contains(ClientDB.CONFIG_STORE_NAME)) {
                                evt.currentTarget.result.createObjectStore(ClientDB.CONFIG_STORE_NAME, { keypath: "title" });
                            }
                            if (!db.objectStoreNames.contains(ClientDB.PROJECT_STORE_NAME)) {
                                evt.currentTarget.result.createObjectStore(ClientDB.PROJECT_STORE_NAME, { keypath: "project" });
                            }
                            ClientDB.db = evt.currentTarget.result;
                        }
                        catch (e) {
                            console.log("Creating object store failed, cause: " + e.message);
                        }
                    }
                }
            }
            catch (e) {
                console.log("initDB error, cause: " + e.message);
            }
            return null;
        }
        
        public static saveCustomKML(moduleName: string, moduleClass: string, filename: string, kmlStream: string): any {
            if (ClientDB.db == null) return;
                try {         
                    var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.PROJECT_STORE_NAME, "readwrite");
                    var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);
                    var stb = null;

                    var request = store.get(filename);
                    request.onsuccess = function (evt): any {
                        var data = new CustomModule(moduleName, moduleClass, kmlStream);
                        if (request.result != undefined) { // if already exists, update
                            store.put(data,filename);
                        }
                        else
                            store.add(data, filename); // if new, add
                    }                     
                } catch (e) {
                    console.log("save custom KML failed, cause: " + e.message);
                }
        }

        public static loadCustomKML(key: string, cbFn : ICallback): string {
            var kmlData: CustomModule;
            if (ClientDB.db == null) return;
            var txn = ClientDB.db.transaction(ClientDB.PROJECT_STORE_NAME, "readonly");
            var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);
                var request = store.get(key);
                request.onsuccess = function (evt): any {
                    if (request.result != undefined) {
                        if (+ClientDB.db.version <= 6) 
                            kmlData = new CustomModule(key, "LocalLayerModule", request.result);
                        else 
                            kmlData = request.result;
                        if (typeof (cbFn) === "function") 
                            cbFn(kmlData);
                    }
                }
        }

        public static deleteCustomKML(key: string, fn: ICallback) {
            if (ClientDB.db == null) return;
            var txn = ClientDB.db.transaction(ClientDB.PROJECT_STORE_NAME, "readwrite");
            txn.oncomplete = function (evt): any {
                console.log("Transaction completed deleting module: " + key + " has been deleted from the database.")
            }
            txn.onerror = function (evt): any {
                console.log("Transaction delete module: " + key + " failed, cause: " + txn.error);
            }

            txn.onabort = function (evt): any {
                console.log("Transaction aborted module: " + key + " failed, cause: " + txn.error);
            }

            var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);
            var request = store.delete(key);
            request.onsuccess = function (evt): any {
                console.log("Custom KML module: " + key + " has been deleted from the database.")
                if ((fn) && (typeof (fn) === "function")) {
                    fn(true);
                }
            }
            request.onerror = function (evt): any {
                console.log("Attempt to delete module: " + key + " failed, cause: " + request.error);
                if ((fn) && (typeof (fn) === "function")) {
                    fn(false);
                }

            }


        }

        public static getAllCustomKMLName(fn: ICallback){
            var kmlNames: string[] = new Array<string>();
            if (ClientDB.db == null) return;
            try {
                var txn = ClientDB.db.transaction(ClientDB.PROJECT_STORE_NAME, "readonly");
                var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);
                store.openCursor().onsuccess = function (evt) {
                    var cursor = (<ExtendEventTarget>evt.target).result;
                    if (cursor) {
                        kmlNames.push(cursor.key);
                        cursor.continue();
                    }
                    else {
                        if (typeof fn === "function") {
                            fn(kmlNames);
                        }
                    }
                }
            }
            catch (ex) {
                console.log("getAllCustomerKMLName failed, cause: " + ex.message);
            }
            return kmlNames;
        }
    }

//===========================================
  export class SiteData{            
    id: string;
    isActive: Boolean;
    name: string;
    description: string;
    polygon: OpenLayers.Polygon;
  }
  // Class
  export class dataManager {
    // Constructor
    constructor () { }



    public postScore(score: pvMapper.Score, rank: number, siteId: string, toolId: string) {
      $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, toolId: toolId },
        function (data: any) {
          // refresh scoreboard.
          //Ext.getCmp('scoreboard-grid-id')).store.load();
          //Ext.getCmp('scoreboard-grid-id').getView().refresh();
          var grid: Ext.grid.IPanel = Ext.getCmp('scoreboard-grid-id');
          grid.store.load();
          grid.getView().refresh();
        });
    }

    public getSite(siteId : string) {
      return $.get("/api/ProjectSite/" + siteId);
    }

    public postSite (aName:string,aDesc:string,aPolygon:OpenLayers.Polygon) {
        return $.post("/api/ProjectSite", {
            name: aName,
            description: aDesc,
            isActive: true,
            polygonGeometry: aPolygon
        });
    }

    public updateSite(siteId:string,aName:string, aDesc:string, aPoly){
      //Only send the stuff that was passed into this function.
      var data: SiteData = new SiteData();
      data.id = siteId;
      data.isActive = true;
      if (aName) data.name = aName;
      if (aDesc) data.description = aDesc;
      if (aPoly) data.polygon = aPoly;

      return $.ajax("/api/ProjectSite", {
        data:data,
        type:"PUT",
        //done: function () {
        //    pvMapper.displayMessage("The site changes were saved","Info");
        //  },
        //  fail: function () {
        //    pvMapper.displayMessage("Unable to save the changes to the site. There was an error communicating with the database.","Warning");
        //  }
        });
        //pvMapper.displayMessage("The site has been updated.","Info");
    }

    //Deletes a site from the datastore
    public deleteSite(siteId: string) {
      return $.ajax("/api/ProjectSite/" + siteId, {
        data: {
          Id: siteId,
          type: "DELETE",
          //done: function () {
          //  pvMapper.displayMessage("The site was deleted from the database.", "Warning");
          //},
          //fail: function () {
          //  pvMapper.displayMessage("Unable to delete the site. There was an error communicating with the database.", "warning");
          //}
        }
      });
    }
  }

}

