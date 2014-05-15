/// <reference path="Options.d.ts" />
/// <reference path="common.ts" />
/// <reference path="Score.ts" />
/// <reference path="../../ExtJS.d.ts" />

interface Promise {
    then: (resolveFn: ICallback, rejectFn?: ICallback) => Promise;
}
var Promise: {
    new (fn: ICallback): Promise;  //fn is expecting two parameters of callback functions, fn(resolve, reject).
    prototype: Promise;
}

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

    export interface ExtendEventTarget extends EventTarget {
        result: any;  // this doest get defined  in Lib.d.s.
    }


    export class ClientDB {

        public static DB_NAME: string = "PVMapperData";
        public static CONFIG_STORE_NAME: string = "PVMapperScores";
        public static PROJECT_STORE_NAME: string = "PVMapperProjects";
        public static TOOLS_STORE_NAME: string = "PVMapperTools";
        public static db: IDBDatabase = null;
        public static DBVersion = 1;  //Each time a new store or any changes to the database, current version must be increased to fire onupgradeneeded event.

        public static indexedDB: IDBFactory = window.indexedDB || window.msIndexedDB; // || window.webkitIndexedDB || window.mozIndexedDB 

        public static isDBCreating = false;
        public static clientDBError: boolean = false;
        public static initClientDB(forced: boolean = false) {
            var me = this;
            if (!ClientDB.indexedDB) {
                window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
                return;
            }

            if (ClientDB.db) {
                if (!forced)
                    return;//already have database object.
                else {
                    ClientDB.db = null;
                    ClientDB.isDBCreating = false;
                }
            }
            try {
                if (!ClientDB.isDBCreating) {
                    ClientDB.isDBCreating = true;
                    if (forced)
                        var dbreq: IDBOpenDBRequest = ClientDB.indexedDB.open(ClientDB.DB_NAME, ClientDB.DBVersion);
                    else
                        var dbreq: IDBOpenDBRequest = ClientDB.indexedDB.open(ClientDB.DB_NAME);
                    dbreq.onsuccess = function (evt): any {
                        console.log("Database [PVMapperData] is open sucessful.");
                        ClientDB.db = evt.currentTarget.result;
                        ClientDB.DBVersion = +ClientDB.db.version;
                    }

                    dbreq.onerror = function (event): any {
                        me.clientDBError = true;
                        console.log("indexedDB open error: " + event.currentTarget.error.message);
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
                            if (!db.objectStoreNames.contains(ClientDB.TOOLS_STORE_NAME)) {
                                evt.currentTarget.result.createObjectStore(ClientDB.TOOLS_STORE_NAME, { keypath: "tools" });
                            }
                            if (ClientDB.CUSTOM_STORE_NAME && ClientDB.CUSTOM_STORE_NAME.length > 0) {
                                if (!db.objectStoreNames.contains(ClientDB.CUSTOM_STORE_NAME)) {
                                    evt.currentTarget.result.createObjectStore(ClientDB.CUSTOM_STORE_NAME, { keypath: "custom_id" });
                                }
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

                var request = store.get(filename);
                request.onsuccess = function (evt): any {
                    var data = new CustomModule(moduleName, moduleClass, kmlStream);
                    if (request.result != undefined) { // if already exists, update
                        store.put(data, filename);
                    }
                    else
                        store.add(data, filename); // if new, add
                }
                } catch (e) {
                console.log("save custom KML failed, cause: " + e.message);
            }
        }

        public static loadCustomKML(key: string, cbFn: ICallback): string {
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

        public static getAllCustomKMLName(fn: ICallback) {
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


        //Open a indexedDb Store with a given storeName and get all records into an array and return it.  This function uses 
        //the HTML5 new Promise framework to better sync to the async of indexedDB process.  
        // NOTE: Promise framework is not support on all browsers, so there is a \Scripts\UI\extras\Project.js provided.
        private static CUSTOM_STORE_NAME: string = "";

        public static loadToolModules(storeName: string) {
            this.CUSTOM_STORE_NAME = storeName;

            return new Promise(function (resolve, reject) {
                if (ClientDB.db == null) {
                    reject(Error("Database is not available or not ready."));
                    return;
                }
                if (storeName == undefined || storeName.length == 0) {
                    reject(Error("Tried to open a store, but store name is not provided."));
                    return;
                }

                try {
                    //if the custom store is not yet exists, re-initCLientDB to force it to connect with higher version.
                    if (!ClientDB.db.objectStoreNames.contains(ClientDB.CUSTOM_STORE_NAME)) {
                        reject(Error("There is no store '" + ClientDB.CUSTOM_STORE_NAME + "' exists."));
                    }

                    var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.CUSTOM_STORE_NAME, 'readonly');
                    txn.oncomplete = function (evt): any {
                        console.log("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' completed.");
                    }
                    txn.onerror = function (evt): any {
                        console.log("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' failed, cause: " + txn.error);
                    }

                    txn.onabort = function (evt): any {
                        console.log("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' aborted, cause: " + txn.error);
                    }

                    var store = txn.objectStore(ClientDB.CUSTOM_STORE_NAME);

                    if (store) {
                        var results: Array<any> = new Array<any>();
                        var cursor = store.openCursor();
                        cursor.onsuccess = function (evt) {
                            var rec = (<ExtendEventTarget>evt.target).result;
                            if (rec) {
                                var jsonObj = JSON.parse(rec.value);
                                results.push({ key: rec.key, value: jsonObj });
                                rec.continue();
                            }
                            else {
                                resolve(results);
                            }
                        };
                        cursor.onerror = function (evt) {
                            console.log("Open a cursor on '" + store + "' failed, cause: " + evt.message);
                        }
                    }

                } catch (e) {
                    reject(Error(e.message));
                }
            });
        }

        //Save user preferences of tool modules to local database.  
        //storeName - the "table" name
        //tools - array of object [key,value] pair.
        public static saveToolModules(storeName: string, tools: Array<any>) {
            this.CUSTOM_STORE_NAME = storeName;

            if (ClientDB.db == null) {
                console.log("Database is not available or not ready.");
                return;
            }
            if (storeName == undefined || storeName.length == 0) {
                console.log("Tried to open a store, but store name is not provided.");
                return;
            }

            try {
                //if the custom store is not yet exists, re-initCLientDB to force it to connect with higher version.
                if (!ClientDB.db.objectStoreNames.contains(ClientDB.CUSTOM_STORE_NAME)) {
                    console.log("There is no store '" + ClientDB.CUSTOM_STORE_NAME + "' exists.");
                }

                var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.CUSTOM_STORE_NAME, 'readwrite');
                var store = txn.objectStore(ClientDB.CUSTOM_STORE_NAME);
                if (store) {
                    store.clear().onsuccess = function (event) {
                        tools.forEach(function (tool) {
                            var request = store.get(tool.key);
                            request.onsuccess = function (evt): any {

                                //tool.value.ctorStr = tool.value.ctor.toString();
                                var jsonStr = JSON.stringify(tool.value);
                                if (request.result != undefined) { // if already exists, update
                                    store.put(jsonStr, tool.key);
                                    console.log("Tool module: '" + tool.key + "' updated successful.");
                                }
                                else {
                                    store.add(jsonStr, tool.key); // if new, add
                                    console.log("Tool module: '" + tool.key + "' added successfule.");
                                }
                            }
                        request.onerror = function (evt): any {
                                console.log("Attempt to save tool key = '" + tool.key + "' failed, cause: " + evt.message);
                            }
                    });
                    }
                }
            }
            catch (ex) {
                console.log("Save tool Modules failed, cause: " + ex.message);
            }
        }
    }

    //===========================================
    export class SiteData {
        id: string;
        isActive: Boolean;
        name: string;
        description: string;
        polygon: OpenLayers.Polygon;
    }
    // Class
    export class dataManager {
        // Constructor
        constructor() { }



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

        public getSite(siteId: string) {
            return $.get("/api/ProjectSite/" + siteId);
        }

        public postSite(aName: string, aDesc: string, aPolygon: OpenLayers.Polygon) {
            return $.post("/api/ProjectSite", {
                name: aName,
                description: aDesc,
                isActive: true,
                polygonGeometry: aPolygon
            });
        }

        public updateSite(siteId: string, aName: string, aDesc: string, aPoly) {
            //Only send the stuff that was passed into this function.
            var data: SiteData = new SiteData();
            data.id = siteId;
            data.isActive = true;
            if (aName) data.name = aName;
            if (aDesc) data.description = aDesc;
            if (aPoly) data.polygon = aPoly;

            return $.ajax("/api/ProjectSite", {
                data: data,
                type: "PUT",
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

