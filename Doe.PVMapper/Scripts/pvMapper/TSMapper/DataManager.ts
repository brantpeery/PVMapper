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

        public static SCORE_LINE_CONFIG_STORE_NAME: string = "ScoreLineConfig";
        public static KML_STORE_NAME: string = "KML";
        public static MODULES_STORE_NAME = "Modules";

        public static db: IDBDatabase = null;
        //public static dbreq: IDBOpenDBRequest = null;
        public static DBVersion = 10000;

        public static indexedDB: IDBFactory = window.indexedDB || window.msIndexedDB; // || window.webkitIndexedDB || window.mozIndexedDB 

        public static clientDBError: boolean = false;

        public static initClientDB() {
            if (!ClientDB.indexedDB) {
                window.alert("Your browser doesn't support a stable version of IndexedDB. Local storage features will not be available.");
                return;
            }

            if (ClientDB.db) {
                return; //already have database object.
            }
            try {
                var dbreq: IDBOpenDBRequest = ClientDB.indexedDB.open(ClientDB.DB_NAME, this.DBVersion);

                dbreq.onsuccess = function (evt): any {
                    ClientDB.useDatabase(dbreq.result);
                }

                dbreq.onerror = function (event): any {
                    ClientDB.clientDBError = true;
                    if (console && console.warn) console.warn("indexedDB open error: " + event.currentTarget.error.message);
                    alert("Error: couldn't connect to in-browser storage.");
                }

                dbreq.onupgradeneeded = function (evt: IDBVersionChangeEvent): any {
                    try {
                        var db: IDBDatabase = (<any>evt.target).result;
                        if (evt.oldVersion < 10000) {
                            // this is the old version of the database... burn it to the ground.
                            while (db.objectStoreNames.length > 0) 
                                db.deleteObjectStore(db.objectStoreNames.item(0));
                        }

                        if (!db.objectStoreNames.contains(ClientDB.KML_STORE_NAME)) {
                            db.createObjectStore(ClientDB.KML_STORE_NAME);
                        }
                        if (!db.objectStoreNames.contains(ClientDB.SCORE_LINE_CONFIG_STORE_NAME)) {
                            db.createObjectStore(ClientDB.SCORE_LINE_CONFIG_STORE_NAME, { keypath: "id" });
                        }
                        if (!db.objectStoreNames.contains(ClientDB.MODULES_STORE_NAME)) {
                            db.createObjectStore(ClientDB.MODULES_STORE_NAME, { keypath: "id" });
                        }
                    }
                    catch (e) {
                        if (console && console.warn) console.warn("Creating object store failed, cause: " + e.message);
                    }
                }

                dbreq.onblocked = function (event): any {
                    if (console && console.warn) console.warn("database open is blocked ?!?");
                    alert("PV Mapper is open in another browser tab; please close that tab to continue.");
                }
            }
            catch (e) {
                if (console && console.error) console.error("initDB error: " + e.message);
            }
            return null;
        }

        private static useDatabase(db) {
            // Make sure to add a handler to be notified if another page requests a version
            // change. We must close the database. This allows the other page to upgrade the database.
            // If you don't do this then the upgrade won't happen until the user closes the tab.
            db.onversionchange = function (event) {
                db.close();
                if (console && console.warn) console.warn("database needs an update ?!?");
                alert("PV Mapper is open in another browser tab; please close this tab to continue.");
            };

            // Do stuff with the database.
            ClientDB.db = db;
            if (console && console.assert) console.assert(ClientDB.DBVersion === +ClientDB.db.version, "Warning: unexpected database version: " + ClientDB.db.version)

            if (console && console.log) console.log("Database 'PVMapperData' (version " + ClientDB.DBVersion + ") is open.");

            // Now, handle loading from our new database (or schedule it for handling, whenever pvMapper is ready)
            pvMapper.onReady(function () {
                pvMapper.mainScoreboard.scoreLines.forEach(function (sc) {
                    sc.loadConfiguration();
                });

                pvMapper.moduleManager.loadModulesFromBrowserConfig();

                //load custom modules.
                ClientDB.loadAllCustomKML();
            });
        }

        public static loadAllCustomKML() {
            ClientDB.getAllCustomKMLName(function (moduleFiles) {
                if ((moduleFiles) && (moduleFiles.length > 0)) {
                    moduleFiles.forEach(function (fileName) {
                        pvMapper.ClientDB.loadCustomKML(fileName, function (moduleObj) {
                            if (moduleObj) {
                                if (INLModules[moduleObj.customClass]) {
                                    var moduleHandle: IModule = new INLModules[moduleObj.customClass](moduleObj.customData, moduleObj.customName, fileName);
                                    pvMapper.moduleManager.addCustomModule(moduleHandle);
                                }
                            }
                        });
                    });
                }
            });
        }

        public static saveCustomKML(moduleName: string, moduleClass: string, filename: string, kmlStream: string): any {
            if (ClientDB.db == null) return;
            try {
                var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.KML_STORE_NAME, "readwrite");
                var store = txn.objectStore(ClientDB.KML_STORE_NAME);

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
            var txn = ClientDB.db.transaction(ClientDB.KML_STORE_NAME, "readonly");
            var store = txn.objectStore(ClientDB.KML_STORE_NAME);
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
            var txn = ClientDB.db.transaction(ClientDB.KML_STORE_NAME, "readwrite");
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

            var store = txn.objectStore(ClientDB.KML_STORE_NAME);
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
                var txn = ClientDB.db.transaction(ClientDB.KML_STORE_NAME, "readonly");
                var store = txn.objectStore(ClientDB.KML_STORE_NAME);
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
        public static loadToolModules() {
            return new Promise(function (resolve, reject) {
                if (ClientDB.db == null) {
                    reject(Error("Database is not available or not ready."));
                    return;
                }

                try {
                    if (!ClientDB.db.objectStoreNames.contains(ClientDB.MODULES_STORE_NAME)) {
                        reject(Error("There is no store '" + ClientDB.MODULES_STORE_NAME + "' exists."));
                    }

                    var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.MODULES_STORE_NAME, 'readonly');
                    txn.oncomplete = function (evt): any {
                        if (console && console.log) console.log("Transaction for '" + ClientDB.MODULES_STORE_NAME + "' completed.");
                    }
                    txn.onerror = function (evt): any {
                        if (console && console.error) console.error("Transaction for '" + ClientDB.MODULES_STORE_NAME + "' failed, cause: " + txn.error);
                    }

                    txn.onabort = function (evt): any {
                        if (console && console.warn) console.warn("Transaction for '" + ClientDB.MODULES_STORE_NAME + "' aborted, cause: " + txn.error);
                    }

                    var store = txn.objectStore(ClientDB.MODULES_STORE_NAME);

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
        public static saveToolModules(modules: IModuleInfoJSON[]) {

            if (ClientDB.db == null) {
                console.log("Database is not available or not ready.");
                return;
            }

            try {
                if (ClientDB.db == null) {
                    if (console && console.error) console.error("There is no data store '" + ClientDB.MODULES_STORE_NAME + "' exists.");
                    return;
                }

                if (!ClientDB.db.objectStoreNames.contains(ClientDB.MODULES_STORE_NAME)) {
                    if (console && console.error) console.error("There is no object store '" + ClientDB.MODULES_STORE_NAME + "'.");
                }

                var txn: IDBTransaction = ClientDB.db.transaction(ClientDB.MODULES_STORE_NAME, 'readwrite');
                var store = txn.objectStore(ClientDB.MODULES_STORE_NAME);
                if (store) {
                    store.clear().onsuccess = function (event) {
                        modules.forEach(function (moduleInfo) {
                            var request = store.get(moduleInfo.id);
                            request.onsuccess = function (evt): any {

                                //tool.value.ctorStr = tool.value.ctor.toString();
                                var jsonStr = JSON.stringify(moduleInfo);
                                if (request.result != undefined) { // if already exists, update
                                    store.put(jsonStr, moduleInfo.id);
                                    console.log("Tool module '" + moduleInfo.id + "' browser config resaved.");
                                }
                                else {
                                    store.add(jsonStr, moduleInfo.id); // if new, add
                                    console.log("Tool module '" + moduleInfo.id + "' browser config saved.");
                                }
                            }
                            request.onerror = function (evt): any {
                                if (console && console.error) console.error("Attempt to save module key = '" + moduleInfo.id + "' failed, cause: " + evt.message);
                            }
                        });
                        pvMapper.displayMessage("Saved module configuration to the browser.", "success");
                    }
                }
            }
            catch (ex) {
                pvMapper.displayMessage("Failed to save module configuration to the local browser.", "error");
                console.log("Save tool Modules failed, cause: " + ex.message);
            }
        }
    }

    ClientDB.initClientDB(); // connect to browser database
}

