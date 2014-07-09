/// <reference path="es6-promises.d.ts" />
/// <reference path="common.ts" />
/// <reference path="pvMapper.ts" />
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

    //export class CustomModuleData implements ICustomModuleHandle {

    //    constructor(options: ICustomModuleHandle) {
    //        this.fileName = options.fileName;
    //        this.moduleObject = options.moduleObject;
    //    }
    //    public fileName: string;
    //    public moduleObject: IModuleOptions;
    //}

    export interface ExtendEventTarget extends EventTarget {
        result: any;  // this doest get defined  in Lib.d.s.
    }


    export class ClientDB {

        public static DB_NAME: string = "PVMapperData";
        public static CONFIG_STORE_NAME: string = "PVMapperScores";
        public static PROJECT_STORE_NAME: string = "PVMapperProjects";
        public static TOOLS_STORE_NAME: string = "PVMapperTools";
        public static db: IDBDatabase = null;
        public static dbreq: IDBOpenDBRequest = null;
        public static DBVersion = 1;  //Each time a new store or any changes to the database, current version must be increased to fire onupgradeneeded event.

        public static indexedDB: IDBFactory = window.indexedDB || window.msIndexedDB; // || window.webkitIndexedDB || window.mozIndexedDB 

        public static isDBCreating = false;
        public static clientDBError: boolean = false;

        public static initClientDB(forced: boolean = false) {
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
                        ClientDB.dbreq = ClientDB.indexedDB.open(ClientDB.DB_NAME, ClientDB.DBVersion);
                    else
                        ClientDB.dbreq = ClientDB.indexedDB.open(ClientDB.DB_NAME);
                    ClientDB.dbreq.onsuccess = function (evt): any {
                        ClientDB.useDatabase(evt.currentTarget.result);
                    }

                    ClientDB.dbreq.onerror = function (event): any {
                        ClientDB.clientDBError = true;
                        if (console && console.warn) console.warn("indexedDB open error: " + event.currentTarget.error.message);
                        alert("Error: couldn't connect to in-browser storage.");
                    }

                    ClientDB.dbreq.onupgradeneeded = function (evt): any {
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

                            ClientDB.useDatabase(evt.currentTarget.result);
                        }
                        catch (e) {
                            if (console && console.warn) console.warn("Creating object store failed, cause: " + e.message);
                        }
                    }

                    ClientDB.dbreq.onblocked = function (event): any {
                        if (console && console.warn) console.warn("database open is blocked ?!?");
                        alert("PV Mapper is open in another browser tab; please close that tab to continue.");
                    }
                }
            }
            catch (e) {
                console.log("initDB error, cause: " + e.message);
            }
            return null;
        }

        private isScoreLoaded = false; //TODO: why are we doing this...?
        private static useDatabase(db) {
            // Make sure to add a handler to be notified if another page requests a version
            // change. We must close the database. This allows the other page to upgrade the database.
            // If you don't do this then the upgrade won't happen until the user closes the tab.
            db.onversionchange = function (event) {
                alert("PV Mapper is open in another browser tab; please close this tab to continue.");
                //db.close();
                window.close();
            };

            // Do stuff with the database.
            ClientDB.db = db;
            ClientDB.DBVersion = +ClientDB.db.version;

            if (console && console.log) console.log("Database 'PVMapperData' (version " + ClientDB.DBVersion + ") is open.");

            // Now, handle loading from our new database (or schedule it for handling, whenever pvMapper is ready)
            pvMapper.onReady(function () {
                pvMapper.moduleManager.loadTools();

                //load custom modules.
                if (console && console.assert)
                    console.assert(typeof (pvMapper.loadLocalModules) === "function",
                        "Warning: MainToolbar isn't finished loading...!");

                if (typeof (pvMapper.loadLocalModules) === "function") {
                    pvMapper.loadLocalModules();
                }

                //load configuration
                if (console && console.assert) console.assert(!this.isScoreLoaded,
                    "If this never happens, then I should delete isScoreLoaded - it server no purpose."); //TODO: delete isScoreLoaded !

                if ((ClientDB.db != null) && (!this.isScoreLoaded)) {
                    mainScoreboard.scoreLines.forEach(function (sc) {
                        sc.loadConfiguration();
                    });
                    this.isScoreLoaded = true;
                }
            });
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
                        if (console && console.warn) console.warn("Warning: overwriting KML file already saved in browser: " + filename);
                        store.put(data, filename);
                    }
                    else {
                        store.add(data, filename); // if new, add
                    }
                    pvMapper.displayMessage(filename + " stored in local browser.", "success");
                }
            } catch (e) {
                pvMapper.displayMessage("Couldn't store " + filename + " in local browser.", "error");
                if (console && console.error) console.error(e);
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
                if (console && console.log) console.log("Transaction completed deleting module: " + key + " has been deleted from the database.")
            }
            txn.onerror = function (evt): any {
                pvMapper.displayMessage("Failed to remove " + key + " module.", "error");
                if (console && console.error) console.error("Transaction delete module: " + key + " failed, cause: " + txn.error);
            }

            txn.onabort = function (evt): any {
                if (console && console.warn) console.warn("Transaction aborted module: " + key + " failed, cause: " + txn.error);
            }

            var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);
            var request = store.delete(key);
            request.onsuccess = function (evt): any {
                pvMapper.displayMessage("Deleted " + key + " from the local browser.", "success");
                if ((fn) && (typeof (fn) === "function")) {
                    fn(true);
                }
            }
            request.onerror = function (evt): any {
                pvMapper.displayMessage("Failed to delete " + key + " from the local browser.", "error");
                if (console && console.error) console.error("Attempt to delete module: " + key + " failed, cause: " + request.error);
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
                if (console && console.error) console.error("getAllCustomerKMLName failed, cause: " + ex.message);
            }
            return kmlNames;
        }

        //Open a indexedDb Store with a given storeName and get all records into an array and return it.  This function uses 
        //the HTML5 new Promise framework to better sync to the async of indexedDB process.  
        // NOTE: Promise framework is not support on all browsers, so there is a \Scripts\UI\extras\Project.js provided.
        private static CUSTOM_STORE_NAME: string = "";

        public static loadToolModules(storeName: string) {
            ClientDB.CUSTOM_STORE_NAME = storeName;

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
                        if (console && console.log) console.log("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' completed.");
                    }
                    txn.onerror = function (evt): any {
                        if (console && console.error) console.error("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' failed, cause: " + txn.error);
                    }

                    txn.onabort = function (evt): any {
                        if (console && console.warn) console.warn("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' aborted, cause: " + txn.error);
                    }

                    var store = txn.objectStore(ClientDB.CUSTOM_STORE_NAME);

                    if (store) {
                        var results: Array<any> = new Array<any>();
                        var cursor = store.openCursor();
                        cursor.onsuccess = function (evt) {
                            var rec = (<ExtendEventTarget>evt.target).result;
                            if (rec) {
                                var jsonObj = JSON.parse(rec.value);
                                results.push(jsonObj);
                                rec.continue();
                            }
                            else {
                                resolve(results);
                            }
                        };
                        cursor.onerror = function (evt) {
                            if (console && console.error) console.error("Open a cursor on '" + store + "' failed, cause: " + evt.message);
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
        public static saveToolModules(storeName: string, tools: IModuleInfoJSON[]) {
            ClientDB.CUSTOM_STORE_NAME = storeName;

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
                    ClientDB.DBVersion = +ClientDB.db.version + 1; //TODO: this is a terrible abuse of the version system. Terrible. Truly terrible.

                    if (console && console.log) console.log("Upgrading database 'PVMapperData' to version " + ClientDB.DBVersion + ".");

                    new Promise(function (resolve: ICallback, reject: ICallback) {
                        ClientDB.initClientDB(true);
                        var cycle = 0;
                        var waitAsecond = function () {
                            if (ClientDB.db == null) {
                                ++cycle;
                                setTimeout(waitAsecond, 1000);
                            }
                            else if (cycle == 10) {  //wait 10 seconds.
                                reject(Error("Waiting for create database time out"));
                            }
                            else {
                                resolve();
                            }
                        }
                        waitAsecond();
                    }).then(function onResolve() { },
                    function onReject(Err) {
                        if (console && console.error) console.error(Err);
                    });
                }

                if (ClientDB.db == null) {
                    console.log("There is no data store '" + ClientDB.CUSTOM_STORE_NAME + "' exists.");
                    return;
                }
                var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.CUSTOM_STORE_NAME, 'readwrite');
                var store = txn.objectStore(ClientDB.CUSTOM_STORE_NAME);
                if (store) {
                    store.clear().onsuccess = function (event) {
                        tools.forEach(function (tool) {
                            var request = store.get(tool.id);
                            request.onsuccess = function (evt): any {

                                //tool.value.ctorStr = tool.value.ctor.toString();
                                var jsonStr = JSON.stringify(tool);
                                if (request.result != undefined) { // if already exists, update
                                    store.put(jsonStr, tool.id);
                                    console.log("Tool module '" + tool.id + "' browser config resaved.");
                                }
                                else {
                                    store.add(jsonStr, tool.id); // if new, add
                                    console.log("Tool module '" + tool.id + "' browser config saved.");
                                }
                            }
                            request.onerror = function (evt): any {
                                if (console && console.error) console.error("Attempt to save tool key = '" + tool.id + "' failed, cause: " + evt.message);
                            }
                        });
                        pvMapper.displayMessage("Saved tool configuration to the local browser.", "success");
                    }
                }
            }
            catch (ex) {
                pvMapper.displayMessage("Failed to save tool configuration to the local browser.", "error");
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
    //export class dataManager {
    //    // Constructor
    //    constructor() { }



    //    public postScore(score: pvMapper.Score, rank: number, siteId: string, toolId: string) {
    //        $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, toolId: toolId },
    //            function (data: any) {
    //                // refresh scoreboard.
    //                //Ext.getCmp('scoreboard-grid-id')).store.load();
    //                //Ext.getCmp('scoreboard-grid-id').getView().refresh();
    //                var grid: Ext.grid.IPanel = Ext.getCmp('scoreboard-grid-id');
    //                grid.store.load();
    //                grid.getView().refresh();
    //            });
    //    }

    //    public getSite(siteId: string) {
    //        return $.get("/api/ProjectSite/" + siteId);
    //    }

    //    public postSite(aName: string, aDesc: string, aPolygon: OpenLayers.Polygon) {
    //        return $.post("/api/ProjectSite", {
    //            name: aName,
    //            description: aDesc,
    //            isActive: true,
    //            polygonGeometry: aPolygon
    //        });
    //    }

    //    public updateSite(siteId: string, aName: string, aDesc: string, aPoly) {
    //        //Only send the stuff that was passed into this function.
    //        var data: SiteData = new SiteData();
    //        data.id = siteId;
    //        data.isActive = true;
    //        if (aName) data.name = aName;
    //        if (aDesc) data.description = aDesc;
    //        if (aPoly) data.polygon = aPoly;

    //        return $.ajax("/api/ProjectSite", {
    //            data: data,
    //            type: "PUT",
    //            //done: function () {
    //            //    pvMapper.displayMessage("The site changes were saved","Info");
    //            //  },
    //            //  fail: function () {
    //            //    pvMapper.displayMessage("Unable to save the changes to the site. There was an error communicating with the database.","Warning");
    //            //  }
    //        });
    //        //pvMapper.displayMessage("The site has been updated.","Info");
    //    }

    //    //Deletes a site from the datastore
    //    public deleteSite(siteId: string) {
    //        return $.ajax("/api/ProjectSite/" + siteId, {
    //            data: {
    //                Id: siteId,
    //                type: "DELETE",
    //                //done: function () {
    //                //  pvMapper.displayMessage("The site was deleted from the database.", "Warning");
    //                //},
    //                //fail: function () {
    //                //  pvMapper.displayMessage("Unable to delete the site. There was an error communicating with the database.", "warning");
    //                //}
    //            }
    //        });
    //    }

    //    //Deletes all sites from the datastore
    //    public deleteAllSites() {
    //        return $.ajax("/api/ProjectSite/", {
    //            data: {
    //                type: "DELETE",
    //            }
    //        });
    //    }

    //}
}

